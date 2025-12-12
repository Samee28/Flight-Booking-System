import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: { flight: { include: { route: true } }, seat: true, passenger: true }
  });
  return (
    <div>
      <h2>Bookings</h2>
      <ul>
        {bookings.map(b => (
          <li key={b.id}>
            {b.passenger.firstName} {b.passenger.lastName} — {b.flight.route.origin} → {b.flight.route.destination} — Seat {b.seat.seatNumber} — {b.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
