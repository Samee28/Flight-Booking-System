import Link from "next/link";
export default function Home() {
  return (
    <div>
      <p>Search and book flights.</p>
      <ul>
        <li><Link href="/search">Search Flights</Link></li>
        <li><Link href="/bookings">My Bookings</Link></li>
      </ul>
    </div>
  );
}
