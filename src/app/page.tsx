import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, #2563eb 0%, #10b981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome to Flight Booking System
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem' }}>
          Search and book flights with ease. Find the best deals and manage your bookings in one place.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/search" className="button" style={{ textDecoration: 'none', display: 'inline-block' }}>
            🔍 Search Flights
          </Link>
          <Link href="/bookings" className="button button-outline" style={{ textDecoration: 'none', display: 'inline-block' }}>
            📋 My Bookings
          </Link>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>✨ Features</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.5rem 0' }}>✓ Real-time flight search</li>
            <li style={{ padding: '0.5rem 0' }}>✓ Visual seat selection</li>
            <li style={{ padding: '0.5rem 0' }}>✓ Seat hold & booking</li>
            <li style={{ padding: '0.5rem 0' }}>✓ Easy cancellation</li>
            <li style={{ padding: '0.5rem 0' }}>✓ Booking management</li>
          </ul>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>🚀 How It Works</h3>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li style={{ padding: '0.5rem 0' }}>Search for flights by route and date</li>
            <li style={{ padding: '0.5rem 0' }}>Select your preferred flight</li>
            <li style={{ padding: '0.5rem 0' }}>Choose your seat from the seat map</li>
            <li style={{ padding: '0.5rem 0' }}>Complete booking with passenger details</li>
            <li style={{ padding: '0.5rem 0' }}>Manage bookings anytime</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
