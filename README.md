# Flight Booking System (Next.js)

A simple flight search and booking demo built with Next.js 14 (App Router), TypeScript, Prisma, and SQLite.

## Stack
- Next.js + React
- Prisma ORM
- SQLite (file-based dev DB)
- Zod for validation
- Vitest for tests

## Setup

```powershell
# From d:\Flight Booking System
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

Open http://localhost:3000

## Features
- Search flights by origin/destination/date: `GET /api/search`
- Create booking: `POST /api/bookings` with JSON `{ flightId, seatId, passenger: { firstName, lastName, email } }`
- List bookings: `GET /api/bookings`

## Sample Request
```powershell
$body = @{ flightId = 1; seatId = 1; passenger = @{ firstName = "Ada"; lastName = "Lovelace"; email = "ada@example.com" } } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/bookings" -Method POST -ContentType "application/json" -Body $body
```

## Notes
- Payments are mocked; extend later to integrate a real provider.
- This is a minimal scaffold; refine UI and add auth as needed.
