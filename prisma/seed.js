const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ log: ["error", "warn"] });

async function main() {
  // Clear existing data for fresh seed
  await prisma.booking.deleteMany({});
  await prisma.hold.deleteMany({});
  await prisma.seat.deleteMany({});
  await prisma.flight.deleteMany({});
  await prisma.passenger.deleteMany({});
  await prisma.aircraft.deleteMany({});
  await prisma.route.deleteMany({});

  // Create multiple routes
  const routes = await Promise.all([
    prisma.route.create({ data: { origin: "NYC", destination: "SFO" } }),
    prisma.route.create({ data: { origin: "NYC", destination: "LAX" } }),
    prisma.route.create({ data: { origin: "SFO", destination: "NYC" } }),
    prisma.route.create({ data: { origin: "LAX", destination: "MIA" } }),
  ]);

  // Create multiple aircraft
  const aircrafts = await Promise.all([
    prisma.aircraft.create({ data: { code: "A320", name: "Airbus A320" } }),
    prisma.aircraft.create({ data: { code: "B737", name: "Boeing 737" } }),
    prisma.aircraft.create({ data: { code: "A350", name: "Airbus A350" } }),
  ]);

  // Create multiple flights
  const flights = [];
  for (let i = 0; i < 6; i++) {
    const route = routes[i % routes.length];
    const aircraft = aircrafts[i % aircrafts.length];
    const daysAhead = i + 1;
    const dep = new Date(Date.now() + daysAhead * 24 * 3600 * 1000);
    dep.setHours(8 + (i * 2) % 12, 0, 0, 0);
    const arr = new Date(dep.getTime() + 4 * 3600 * 1000);
    
    const flight = await prisma.flight.create({
      data: {
        routeId: route.id,
        aircraftId: aircraft.id,
        departureAt: dep,
        arrivalAt: arr,
        basePrice: 150 + i * 50,
        status: "SCHEDULED"
      }
    });
    flights.push(flight);
  }

  // Create seats for each flight (6 rows, 4 seats per row)
  for (const flight of flights) {
    const seats = [];
    for (let row = 1; row <= 6; row++) {
      for (let col = 0; col < 4; col++) {
        const seatNumber = `${row}${['A', 'B', 'C', 'D'][col]}`;
        seats.push({
          aircraftId: flight.aircraftId,
          flightId: flight.id,
          seatNumber,
          class: row <= 2 ? "BUSINESS" : "ECONOMY",
        });
      }
    }
    await prisma.seat.createMany({ data: seats });
  }

  console.log("✅ Seeded sample data successfully!");
  console.log(`Created ${routes.length} routes, ${aircrafts.length} aircraft, ${flights.length} flights`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
