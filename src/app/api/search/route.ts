import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const origin = searchParams.get("origin") ?? undefined;
  const destination = searchParams.get("destination") ?? undefined;
  const date = searchParams.get("date");

  const start = date ? new Date(date) : undefined;
  const end = start ? new Date(start) : undefined;
  if (end) end.setHours(23,59,59,999);

  const flights = await prisma.flight.findMany({
    where: {
      route: {
        ...(origin ? { origin } : {}),
        ...(destination ? { destination } : {}),
      },
      ...(start && end ? { departureAt: { gte: start, lte: end } } : {}),
      status: "SCHEDULED",
    },
    include: { route: true }
  });

  return Response.json({ flights });
}
