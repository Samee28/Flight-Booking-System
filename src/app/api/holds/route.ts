import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const HoldSeat = z.object({ seatId: z.number(), minutes: z.number().min(1).max(60).default(10) });

export async function POST(req: NextRequest) {
  const json = await req.json();
  const parsed = HoldSeat.safeParse(json);
  if (!parsed.success) return new Response(JSON.stringify({ error: parsed.error.format() }), { status: 400 });

  const { seatId, minutes } = parsed.data;
  const seat = await prisma.seat.findUnique({ where: { id: seatId } });
  if (!seat || seat.isBooked) return new Response(JSON.stringify({ error: "Seat unavailable" }), { status: 409 });

  const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

  const hold = await prisma.$transaction(async (tx) => {
    await tx.seat.update({ where: { id: seatId }, data: { isHeld: true } });
    return tx.hold.create({ data: { seatId, expiresAt, active: true } });
  });

  return Response.json({ hold });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const seatIdStr = searchParams.get("seatId");
  const seatId = seatIdStr ? Number(seatIdStr) : NaN;
  if (!seatId || Number.isNaN(seatId)) return new Response(JSON.stringify({ error: "Invalid seatId" }), { status: 400 });

  await prisma.$transaction(async (tx) => {
    await tx.seat.update({ where: { id: seatId }, data: { isHeld: false } });
    await tx.hold.updateMany({ where: { seatId, active: true }, data: { active: false } });
  });

  return new Response(null, { status: 204 });
}
