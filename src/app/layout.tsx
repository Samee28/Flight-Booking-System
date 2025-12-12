import Link from "next/link";
import "./globals.css";

export const metadata = { title: "Flight Booking System" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container">
            <h1>✈️ Flight Booking System</h1>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/search">Search Flights</Link>
              <Link href="/bookings">My Bookings</Link>
            </nav>
          </div>
        </header>
        <main className="main">
          <div className="container">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
