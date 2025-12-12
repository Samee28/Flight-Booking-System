import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

function parseDate(input: string | null): { start?: Date; end?: Date } {
  if (!input) return {};
  // Support ISO (YYYY-MM-DD) and DD-MM-YYYY formats
  let parsed: Date | null = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    parsed = new Date(input);
  } else if (/^\d{2}-\d{2}-\d{4}$/.test(input)) {
    const [d, m, y] = input.split("-");
    parsed = new Date(`${y}-${m}-${d}`);
  }
  if (!parsed || isNaN(parsed.getTime())) return {};
  const start = new Date(parsed);
  const end = new Date(parsed);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  // Normalize inputs to uppercase because Prisma SQLite filters are case-sensitive
  const origin = searchParams.get("origin")?.trim().toUpperCase() || undefined;
  const destination = searchParams.get("destination")?.trim().toUpperCase() || undefined;
  const date = searchParams.get("date");

  const { start, end } = parseDate(date);

  let flights = await prisma.flight.findMany({
    where: {
      route: {
        ...(origin ? { origin: { contains: origin } } : {}),
        ...(destination ? { destination: { contains: destination } } : {}),
      },
      ...(start && end ? { departureAt: { gte: start, lte: end } } : {}),
      status: "SCHEDULED",
    },
    include: {
      route: true,
      aircraft: true
    },
    orderBy: { departureAt: 'asc' },
    take: 10
  });

  // If fewer than 10 results, top up with other flights to always return 10
  if (flights.length < 10) {
    const missing = 10 - flights.length;
    const extra = await prisma.flight.findMany({
      where: { status: "SCHEDULED" },
      include: { route: true, aircraft: true },
      orderBy: { departureAt: 'asc' },
      take: missing
    });
    flights = [...flights, ...extra];
  }

  return Response.json({ flights });
}
