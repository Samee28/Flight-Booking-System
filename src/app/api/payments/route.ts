import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const PaymentSchema = z.object({
  bookingId: z.number(),
  amount: z.number().min(1),
  paymentMethod: z.string().optional()
});

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = PaymentSchema.safeParse(json);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.format() }), { status: 400 });
  }

  const { bookingId, amount } = parsed.data;

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
  }

  // Mock payment processing - always succeeds
  const payment = await prisma.payment.create({
    data: {
      amount,
      currency: "USD",
      status: "CAPTURED",
      provider: "MOCK_PAYMENT_GATEWAY"
    }
  });

  await prisma.booking.update({
    where: { id: bookingId },
    data: { paymentId: payment.id }
  });

  return Response.json({
    success: true,
    payment,
    message: "Payment processed successfully (mock)"
  });
}

export async function GET() {
  const payments = await prisma.payment.findMany({
    include: {
      bookings: {
        include: {
          passenger: true,
          flight: { include: { route: true } }
        }
      }
    }
  });

  return Response.json({ payments });
}
