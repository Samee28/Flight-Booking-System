"use client";
import { useState, useEffect } from "react";

interface Seat {
  id: number;
  seatNumber: string;
  class: string;
  isBooked: boolean;
  isHeld: boolean;
}

interface Flight {
  id: number;
  departureAt: string;
  arrivalAt: string;
  basePrice: number;
  route: { origin: string; destination: string };
  aircraft: { name: string };
  seats?: Seat[];
}

export default function SearchPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [results, setResults] = useState<Flight[]>([]);
  const [selected, setSelected] = useState<Flight | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [loading, setLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState<'search' | 'seats' | 'details'>('search');
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function search() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/search?origin=${origin}&destination=${destination}&date=${date}`);
      const data = await res.json();
      setResults(data.flights ?? []);
      if (data.flights?.length === 0) {
        setMessage({ type: 'error', text: 'No flights found. Try different search criteria.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to search flights' });
    }
    setLoading(false);
  }

  async function selectFlight(flight: Flight) {
    setSelected(flight);
    setBookingStep('seats');
    setLoading(true);
    try {
      const res = await fetch(`/api/seats?flightId=${flight.id}`);
      const data = await res.json();
      setSeats(data.seats ?? []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load seats' });
    }
    setLoading(false);
  }

  async function handleBooking() {
    if (!selected || !selectedSeat) return;
    
    setLoading(true);
    setMessage(null);
    try {
      const body = {
        flightId: selected.id,
        seatId: selectedSeat.id,
        passenger: { firstName, lastName, email }
      };
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessage({ type: 'success', text: '✅ Booking confirmed! Redirecting to bookings...' });
        setTimeout(() => window.location.href = '/bookings', 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Booking failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create booking' });
    }
    setLoading(false);
  }

  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.seatNumber.substring(0, seat.seatNumber.length - 1);
    if (!acc[row]) acc[row] = [];
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Search Flights</h1>

      {/* Search Form */}
      {bookingStep === 'search' && (
        <div className="card">
          <div className="search-form">
            <input
              className="input"
              placeholder="Origin (e.g., NYC)"
              value={origin}
              onChange={e => setOrigin(e.target.value.toUpperCase())}
            />
            <input
              className="input"
              placeholder="Destination (e.g., SFO)"
              value={destination}
              onChange={e => setDestination(e.target.value.toUpperCase())}
            />
            <input
              className="input"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            <button className="button" onClick={search} disabled={loading}>
              {loading ? 'Searching...' : '🔍 Search'}
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {/* Flight Results */}
      {bookingStep === 'search' && results.length > 0 && (
        <div>
          <h2 style={{ margin: '2rem 0 1rem' }}>Available Flights ({results.length})</h2>
          {results.map(flight => (
            <div
              key={flight.id}
              className="flight-card"
              onClick={() => selectFlight(flight)}
            >
              <div className="flight-header">
                <div className="route">
                  {flight.route.origin} → {flight.route.destination}
                </div>
                <div className="price">${flight.basePrice}</div>
              </div>
              <div className="flight-details">
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Departure</div>
                  <div style={{ fontWeight: 600 }}>{new Date(flight.departureAt).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Arrival</div>
                  <div style={{ fontWeight: 600 }}>{new Date(flight.arrivalAt).toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Aircraft</div>
                  <div style={{ fontWeight: 600 }}>{flight.aircraft.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Seat Selection */}
      {bookingStep === 'seats' && selected && (
        <div>
          <button
            className="button button-outline"
            onClick={() => { setBookingStep('search'); setSelected(null); setSelectedSeat(null); }}
            style={{ marginBottom: '1rem' }}
          >
            ← Back to Search
          </button>
          
          <div className="card">
            <h2>Select Your Seat</h2>
            <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#6b7280' }}>
              {selected.route.origin} → {selected.route.destination} | {selected.aircraft.name}
            </div>

            <div className="legend">
              <div className="legend-item">
                <div className="legend-box" style={{ background: 'white' }}></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}></div>
                <span>Business</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ background: '#2563eb', borderColor: '#2563eb' }}></div>
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <div className="legend-box" style={{ background: '#e5e7eb' }}></div>
                <span>Booked</span>
              </div>
            </div>

            <div className="seat-map">
              {Object.keys(groupedSeats).sort().map(row => (
                <div key={row} className="seat-row">
                  {groupedSeats[row].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber)).map(seat => (
                    <button
                      key={seat.id}
                      className={`seat ${seat.class.toLowerCase()} ${selectedSeat?.id === seat.id ? 'selected' : ''} ${seat.isBooked ? 'booked' : ''} ${seat.isHeld ? 'held' : ''}`}
                      onClick={() => !seat.isBooked && !seat.isHeld && setSelectedSeat(seat)}
                      disabled={seat.isBooked || seat.isHeld}
                    >
                      {seat.seatNumber}
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {selectedSeat && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <div className="alert alert-info">
                  Selected: Seat {selectedSeat.seatNumber} ({selectedSeat.class})
                </div>
                <button
                  className="button"
                  onClick={() => setBookingStep('details')}
                >
                  Continue to Booking →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Passenger Details */}
      {bookingStep === 'details' && selected && selectedSeat && (
        <div>
          <button
            className="button button-outline"
            onClick={() => setBookingStep('seats')}
            style={{ marginBottom: '1rem' }}
          >
            ← Back to Seat Selection
          </button>

          <div className="card">
            <h2>Passenger Details</h2>
            
            <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Booking Summary</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Flight: {selected.route.origin} → {selected.route.destination}<br />
                Seat: {selectedSeat.seatNumber} ({selectedSeat.class})<br />
                Price: ${selected.basePrice}
              </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                className="input"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
              <input
                className="input"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button
              className="button button-secondary"
              onClick={handleBooking}
              disabled={loading || !firstName || !lastName || !email}
              style={{ width: '100%' }}
            >
              {loading ? 'Processing...' : '✓ Confirm Booking'}
            </button>
          </div>
        </div>
      )}

      {loading && bookingStep === 'search' && <div className="spinner"></div>}
    </div>
  );
}
