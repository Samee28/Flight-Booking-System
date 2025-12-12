import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Get wallet for a passenger
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return new Response(JSON.stringify({ error: "Email required" }), { status: 400 });
  }

  const passenger = await prisma.passenger.findUnique({
    where: { email },
    include: {
      wallet: {
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        }
      }
    }
  });

  if (!passenger) {
    return Response.json({ balance: 50000, transactions: [] });
  }

  // Create wallet if doesn't exist
  if (!passenger.wallet) {
    const wallet = await prisma.wallet.create({
      data: {
        passengerId: passenger.id,
        balance: 50000
      },
      include: { transactions: true }
    });
    return Response.json(wallet);
  }

  return Response.json(passenger.wallet);
}

// Add money to wallet (for testing)
export async function POST(req: NextRequest) {
  const json = await req.json();
  const { email, amount } = json;

  if (!email || !amount) {
    return new Response(JSON.stringify({ error: "Email and amount required" }), { status: 400 });
  }

  const passenger = await prisma.passenger.findUnique({
    where: { email },
    include: { wallet: true }
  });

  if (!passenger) {
    return new Response(JSON.stringify({ error: "Passenger not found" }), { status: 404 });
  }

  let wallet = passenger.wallet;
  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        passengerId: passenger.id,
        balance: 50000
      }
    });
  }

  const updated = await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      balance: { increment: amount },
      transactions: {
        create: {
          amount,
          type: "CREDIT",
          description: "Added to wallet"
        }
      }
    },
    include: { transactions: true }
  });

  return Response.json(updated);
}
