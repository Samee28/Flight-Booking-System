const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({ log: ["error", "warn"] });

async function main() {
  // Clear existing data for fresh seed
  await prisma.bookingAttempt.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.wallet.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.hold.deleteMany({});
  await prisma.seat.deleteMany({});
  await prisma.flight.deleteMany({});
  await prisma.passenger.deleteMany({});
  await prisma.aircraft.deleteMany({});
  await prisma.route.deleteMany({});

  // Create Indian city routes
  const routes = await Promise.all([
    prisma.route.create({ data: { origin: "DELHI", destination: "MUMBAI" } }),
    prisma.route.create({ data: { origin: "MUMBAI", destination: "DELHI" } }),
    prisma.route.create({ data: { origin: "DELHI", destination: "BANGALORE" } }),
    prisma.route.create({ data: { origin: "BANGALORE", destination: "DELHI" } }),
    prisma.route.create({ data: { origin: "MUMBAI", destination: "BANGALORE" } }),
    prisma.route.create({ data: { origin: "BANGALORE", destination: "MUMBAI" } }),
    prisma.route.create({ data: { origin: "DELHI", destination: "CHENNAI" } }),
    prisma.route.create({ data: { origin: "CHENNAI", destination: "DELHI" } }),
    prisma.route.create({ data: { origin: "KOLKATA", destination: "MUMBAI" } }),
    prisma.route.create({ data: { origin: "MUMBAI", destination: "KOLKATA" } }),
    prisma.route.create({ data: { origin: "DELHI", destination: "HYDERABAD" } }),
    prisma.route.create({ data: { origin: "HYDERABAD", destination: "DELHI" } }),
  ]);

  // Create aircraft
  const aircrafts = await Promise.all([
    prisma.aircraft.create({ data: { code: "A320", name: "Airbus A320" } }),
    prisma.aircraft.create({ data: { code: "B737", name: "Boeing 737" } }),
    prisma.aircraft.create({ data: { code: "A350", name: "Airbus A350" } }),
    prisma.aircraft.create({ data: { code: "B787", name: "Boeing 787 Dreamliner" } }),
  ]);

  const airlines = ["Air India", "IndiGo", "SpiceJet", "Vistara", "GoAir"];

  // Create 20 flights with Indian pricing (₹2000-₹3000 base)
  const flights = [];
  for (let i = 0; i < 20; i++) {
    const route = routes[i % routes.length];
    const aircraft = aircrafts[i % aircrafts.length];
    const airline = airlines[i % airlines.length];
    const daysAhead = Math.floor(i / 4) + 1; // Spread over 5 days
    const dep = new Date(Date.now() + daysAhead * 24 * 3600 * 1000);
    dep.setHours(6 + (i % 4) * 4, 0, 0, 0); // 6am, 10am, 2pm, 6pm
    const flightDuration = 2 + Math.random() * 2; // 2-4 hours
    const arr = new Date(dep.getTime() + flightDuration * 3600 * 1000);
    const basePrice = 2000 + Math.floor(Math.random() * 1000); // ₹2000-₹3000
    
    const flight = await prisma.flight.create({
      data: {
        routeId: route.id,
        aircraftId: aircraft.id,
        airline,
        departureAt: dep,
        arrivalAt: arr,
        basePrice,
        currentPrice: basePrice,
        status: "SCHEDULED"
      }
    });
    flights.push(flight);
  }

  // Create seats for each flight (6 rows, 4 seats per row = 24 seats)
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
  console.log("All flights have base prices between ₹2000-₹3000");
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
