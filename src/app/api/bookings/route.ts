import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreateBooking = z.object({
  flightId: z.number(),
  seatId: z.number(),
  passenger: z.object({ firstName: z.string(), lastName: z.string(), email: z.string().email() })
});

// Generate unique PNR
function generatePNR(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

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
    include: { wallet: true }
  });

  // Create wallet if doesn't exist
  let wallet = p.wallet;
  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        passengerId: p.id,
        balance: 50000
      }
    });
  }

  const flight = await prisma.flight.findUnique({ 
    where: { id: flightId },
    include: { route: true }
  });
  if (!flight) return new Response(JSON.stringify({ error: "Flight not found" }), { status: 404 });

  const finalPrice = flight.currentPrice || flight.basePrice;

  // Check wallet balance
  if (wallet.balance < finalPrice) {
    return new Response(JSON.stringify({ 
      error: "Insufficient wallet balance",
      required: finalPrice,
      available: wallet.balance,
      shortfall: finalPrice - wallet.balance
    }), { status: 400 });
  }

  const pnr = generatePNR();

  const booking = await prisma.$transaction(async (tx) => {
    // Deduct from wallet
    await tx.wallet.update({
      where: { id: wallet.id },
      data: {
        balance: { decrement: finalPrice },
        transactions: {
          create: {
            amount: -finalPrice,
            type: "DEBIT",
            description: `Booking for ${flight.route.origin} to ${flight.route.destination} - PNR: ${pnr}`
          }
        }
      }
    });

    // Mark seat as booked
    await tx.seat.update({ where: { id: seatId }, data: { isBooked: true, isHeld: false } });

    // Create booking
    return tx.booking.create({
      data: {
        pnr,
        flightId,
        seatId,
        passengerId: p.id,
        price: finalPrice,
      },
      include: {
        flight: { include: { route: true, aircraft: true } },
        seat: true,
        passenger: true
      }
    });
  });

  return Response.json({ booking, walletBalance: wallet.balance - finalPrice });
}

export async function GET() {
  const bookings = await prisma.booking.findMany({ 
    include: { 
      flight: { include: { route: true, aircraft: true } }, 
      seat: true, 
      passenger: true 
    },
    orderBy: { createdAt: 'desc' }
  });
  return Response.json({ bookings });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const idStr = searchParams.get("id");
  const id = idStr ? Number(idStr) : NaN;
  if (!id || Number.isNaN(id)) return new Response(JSON.stringify({ error: "Invalid id" }), { status: 400 });

  const booking = await prisma.booking.findUnique({ 
    where: { id }, 
    include: { seat: true, passenger: { include: { wallet: true } } } 
  });
  if (!booking) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });

  await prisma.$transaction(async (tx) => {
    // Refund to wallet
    if (booking.passenger.wallet) {
      await tx.wallet.update({
        where: { id: booking.passenger.wallet.id },
        data: {
          balance: { increment: booking.price },
          transactions: {
            create: {
              amount: booking.price,
              type: "REFUND",
              description: `Refund for cancelled booking - PNR: ${booking.pnr}`
            }
          }
        }
      });
    }

    // Update booking status
    await tx.booking.update({ where: { id }, data: { status: "CANCELED" } });
    
    // Free the seat
    await tx.seat.update({ where: { id: booking.seatId }, data: { isBooked: false } });
  });

  return new Response(null, { status: 204 });
}
