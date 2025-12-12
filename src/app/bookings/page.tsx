"use client";
import { useEffect, useState } from "react";

interface Booking {
  id: number;
  status: string;
  price: number;
  createdAt: string;
  flight: {
    route: { origin: string; destination: string };
    departureAt: string;
    arrivalAt: string;
  };
  seat: { seatNumber: string; class: string };
  passenger: { firstName: string; lastName: string; email: string };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  async function loadBookings() {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load bookings' });
    }
    setLoading(false);
  }

  async function cancelBooking(id: number) {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'Booking cancelled successfully' });
        loadBookings();
      } else {
        setMessage({ type: 'error', text: 'Failed to cancel booking' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to cancel booking' });
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>My Bookings</h1>

      {message && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {loading && <div className="spinner"></div>}

      {!loading && bookings.length === 0 && (
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✈️</div>
          <h3>No bookings yet</h3>
          <p>Start by searching for flights!</p>
          <a href="/search" className="button" style={{ textDecoration: 'none', display: 'inline-block', marginTop: '1rem' }}>
            Search Flights
          </a>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="grid-2">
          {bookings.map(booking => (
            <div key={booking.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>
                  {booking.flight.route.origin} → {booking.flight.route.destination}
                </h3>
                <span className={`badge ${
                  booking.status === 'CONFIRMED' ? 'badge-success' : 
                  booking.status === 'CANCELED' ? 'badge-danger' : 'badge-info'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div style={{ display: 'grid', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div>
                  <div style={{ color: '#6b7280' }}>Passenger</div>
                  <div style={{ fontWeight: 600 }}>
                    {booking.passenger.firstName} {booking.passenger.lastName}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.75rem' }}>{booking.passenger.email}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <div style={{ color: '#6b7280' }}>Departure</div>
                    <div style={{ fontWeight: 600 }}>
                      {new Date(booking.flight.departureAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#6b7280' }}>Arrival</div>
                    <div style={{ fontWeight: 600 }}>
                      {new Date(booking.flight.arrivalAt).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <div style={{ color: '#6b7280' }}>Seat</div>
                    <div style={{ fontWeight: 600 }}>
                      {booking.seat.seatNumber} ({booking.seat.class})
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#6b7280' }}>Price</div>
                    <div style={{ fontWeight: 600, color: '#2563eb' }}>${booking.price}</div>
                  </div>
                </div>

                <div>
                  <div style={{ color: '#6b7280' }}>Booked</div>
                  <div>{new Date(booking.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {booking.status === 'CONFIRMED' && (
                <button
                  className="button button-danger"
                  onClick={() => cancelBooking(booking.id)}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
