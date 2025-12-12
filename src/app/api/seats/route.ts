import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const flightIdStr = searchParams.get("flightId");
  const flightId = flightIdStr ? Number(flightIdStr) : undefined;

  if (!flightId) {
    return new Response(JSON.stringify({ error: "flightId required" }), { status: 400 });
  }

  const seats = await prisma.seat.findMany({
    where: { flightId },
    orderBy: { seatNumber: 'asc' }
  });

  return Response.json({ seats });
}
