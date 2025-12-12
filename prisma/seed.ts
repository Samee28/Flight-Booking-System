import { prisma } from "../src/lib/prisma";

async function main() {
  const route = await prisma.route.create({ data: { origin: "NYC", destination: "SFO" } });
  const aircraft = await prisma.aircraft.create({ data: { code: "A320", name: "Airbus A320" } });
  const flight = await prisma.flight.create({
    data: {
      routeId: route.id,
      aircraftId: aircraft.id,
      departureAt: new Date(Date.now() + 24 * 3600 * 1000),
      arrivalAt: new Date(Date.now() + 28 * 3600 * 1000),
      basePrice: 199,
    }
  });

  const seats = Array.from({ length: 20 }).map((_, i) => ({
    aircraftId: aircraft.id,
    flightId: flight.id,
    seatNumber: `${Math.floor(i/4)+1}${['A','B','C','D'][i%4]}`,
    class: i < 4 ? "BUSINESS" : "ECONOMY",
  }));

  await prisma.seat.createMany({ data: seats });

  console.log("Seeded sample data.");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
