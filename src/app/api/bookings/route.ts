import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateBooking = z.object({
  flightId: z.number(),
  seatId: z.number(),
  passenger: z.object({ firstName: z.string(), lastName: z.string(), email: z.string().email() })
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = CreateBooking.safeParse(json);
  if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.format() }), { status: 400 });

  const { flightId, seatId, passenger } = parsed.data;

  const seat = await prisma.seat.findUnique({ where: { id: seatId } });
  if (!seat || seat.isBooked || seat.isHeld === true) {
    return new Response(JSON.stringify({ error: "Seat unavailable" }), { status: 409 });
  }

  const p = await prisma.passenger.upsert({
    where: { email: passenger.email },
    create: passenger,
    update: passenger,
  });

  const flight = await prisma.flight.findUnique({ where: { id: flightId } });
  if (!flight) return new Response(JSON.stringify({ error: "Flight not found" }), { status: 404 });

  const booking = await prisma.$transaction(async (tx) => {
    await tx.seat.update({ where: { id: seatId }, data: { isBooked: true } });
    return tx.booking.create({
      data: {
        flightId,
        seatId,
        passengerId: p.id,
        price: flight.basePrice,
      },
    });
  });

  return Response.json({ booking });
}

export async function GET() {
  const bookings = await prisma.booking.findMany({ include: { flight: true, seat: true, passenger: true } });
  return Response.json({ bookings });
}
