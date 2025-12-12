import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Track booking attempt and calculate surge pricing
export async function POST(req: NextRequest) {
  const json = await req.json();
  const { flightId, userId } = json;

  if (!flightId || !userId) {
    return new Response(JSON.stringify({ error: "flightId and userId required" }), { status: 400 });
  }

  const flight = await prisma.flight.findUnique({ where: { id: flightId } });
  if (!flight) {
    return new Response(JSON.stringify({ error: "Flight not found" }), { status: 404 });
  }

  // Record the attempt
  await prisma.bookingAttempt.create({
    data: { flightId, userId }
  });

  // Get attempts in last 5 minutes
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const recentAttempts = await prisma.bookingAttempt.count({
    where: {
      flightId,
      userId,
      attemptAt: { gte: fiveMinutesAgo }
    }
  });

  // Calculate price
  let currentPrice = flight.basePrice;
  let surgeApplied = false;
  
  if (recentAttempts >= 3) {
    // Apply 10% surge
    currentPrice = Math.round(flight.basePrice * 1.1);
    surgeApplied = true;

    // Update flight's current price
    await prisma.flight.update({
      where: { id: flightId },
      data: { currentPrice }
    });
  }

  // Check if we should reset (10 minutes since last attempt)
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const oldAttempts = await prisma.bookingAttempt.count({
    where: {
      flightId,
      userId,
      attemptAt: { lt: tenMinutesAgo }
    }
  });

  if (oldAttempts > 0 && recentAttempts === 0) {
    // Reset price
    await prisma.flight.update({
      where: { id: flightId },
      data: { currentPrice: flight.basePrice }
    });
    currentPrice = flight.basePrice;
    surgeApplied = false;
  }

  return Response.json({
    basePrice: flight.basePrice,
    currentPrice,
    surgeApplied,
    attempts: recentAttempts,
    message: surgeApplied 
      ? `Price increased by 10% due to ${recentAttempts} booking attempts in last 5 minutes`
      : "Normal pricing"
  });
}

// Get current price for a flight
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const flightIdStr = searchParams.get("flightId");
  const flightId = flightIdStr ? Number(flightIdStr) : undefined;

  if (!flightId) {
    return new Response(JSON.stringify({ error: "flightId required" }), { status: 400 });
  }

  const flight = await prisma.flight.findUnique({ where: { id: flightId } });
  if (!flight) {
    return new Response(JSON.stringify({ error: "Flight not found" }), { status: 404 });
  }

  return Response.json({
    basePrice: flight.basePrice,
    currentPrice: flight.currentPrice || flight.basePrice
  });
}
