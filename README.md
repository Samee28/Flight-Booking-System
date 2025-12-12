# ✈️ Flight Booking System

A modern, full-featured flight booking application built with **Next.js 14**, **TypeScript**, **Prisma**, and **SQLite**. It includes real-time flight search, visual seat selection, wallet payments, dynamic pricing, PDF tickets, and booking history.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.18-2D3748)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57)

## ✨ Features

### Core Functionality
- **Flight Search** – Search by origin/destination/date with 10 results guaranteed (fills from schedule if fewer matches)
- **Visual Seat Selection** – Interactive seat map with booked/held/available states
- **Wallet & Payments** – ₹50,000 starter wallet, balance checks, transactions, and mock payment capture
- **Dynamic Pricing** – 10% surge after repeated attempts within 5 minutes; resets after 10 minutes
- **Bookings** – Create, view, cancel; automatic PNR generation and seat release on cancel
- **PDF Tickets** – Downloadable tickets via jsPDF from booking history
- **Responsive UI** – Modern layout tuned for desktop and mobile

### User Experience
- 🎨 Modern UI with clean cards and badges
- 📱 Mobile-ready forms, cards, and seat map
- ⚡ Fast SSR with Next.js App Router
- ✅ Request validation with Zod and guarded server routes

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API routes (Edge-like handlers)
- **Database**: SQLite + Prisma ORM
- **Styling**: Custom CSS
- **PDF**: jsPDF ticket generator
- **Validation**: Zod

## 📋 Prerequisites

- Node.js 18 or 20 (Node 22 is not supported by Next 14)
- npm

## 🛠️ Installation & Setup

### 1. Clone the repository
```powershell
git clone https://github.com/Samee28/Flight-Booking-System.git
cd Flight-Booking-System
```

### 2. Install dependencies
```powershell
npm install
```

### 3. Set up the database
```powershell
# Apply migrations (uses bundled migrations)
npx prisma migrate dev

# Seed the database with sample data (routes, flights, seats, wallet)
npm run db:seed
```

### 4. Start the development server
```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Flight Booking System/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.js                # Database seeding script
│   └── migrations/            # Database migrations
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with navigation
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Global styles
│   │   ├── search/
│   │   │   └── page.tsx       # Flight search, seat selection, booking flow
│   │   ├── bookings/
│   │   │   └── page.tsx       # Booking history, cancellations, PDF tickets
│   │   └── api/
│   │       ├── search/        # Flight search API
│   │       ├── seats/         # Seat availability API
│   │       ├── bookings/      # Booking CRUD API
│   │       ├── holds/         # Seat hold API
│   │       ├── wallet/        # Wallet balance + top-up API
│   │       ├── pricing/       # Dynamic pricing attempts API
│   │       └── payments/      # Payment processing API (mock)
│   └── lib/
│       ├── prisma.ts          # Prisma client singleton
│       └── pdfGenerator.ts    # jsPDF ticket generator
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🗄️ Database Schema (high level)

- **Route** – flight routes (origin → destination)
- **Aircraft** – aircraft types
- **Flight** – scheduled flights with base/current price and airline
- **Seat** – per-flight seats with class and state (booked/held)
- **Passenger** – passenger profile with wallet
- **Wallet** – balance + transactions
- **Booking** – booking with PNR, price, status
- **Hold** – temporary seat holds
- **Payment** – mock payment records
- **BookingAttempt** – tracks attempts for surge pricing

## 🔌 API Endpoints

### Search Flights
```http
GET /api/search?origin=DELHI&destination=MUMBAI&date=2025-12-13
```

### Get Seats for Flight
```http
GET /api/seats?flightId=1
```

### Create Booking
```http
POST /api/bookings
Content-Type: application/json

{
  "flightId": 1,
  "seatId": 5,
  "passenger": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
  }
}
```

### Wallet
```http
GET /api/wallet?email=jane@example.com   # fetch balance
POST /api/wallet                         # top-up (if enabled)
```

### Dynamic Pricing (attempt tracking)
```http
POST /api/pricing
Content-Type: application/json
{
  "flightId": 1,
  "userId": "jane@example.com"
}
```

### Cancel Booking
```http
DELETE /api/bookings?id=1
```

### Hold Seat
```http
POST /api/holds
Content-Type: application/json

{
  "seatId": 5,
  "minutes": 10
}
```

### Release Seat Hold
```http
DELETE /api/holds?seatId=5
```

### Process Payment (Mock)
```http
POST /api/payments
Content-Type: application/json

{
  "bookingId": 1,
  "amount": 199
}
```

## 🎯 User Workflows

### Booking a Flight
1. Navigate to **Search Flights**
2. Enter origin, destination, and date
3. Click **Search** to view available flights
4. Click on a flight card to view seats
5. Select an available seat from the seat map
6. Click **Continue to Booking**
7. Enter passenger details (first name, last name, email)
8. Review wallet balance and surge price (if any)
9. Click **Confirm Booking**
10. Receive confirmation (PNR) and redirect to bookings

### Managing Bookings
1. Navigate to **My Bookings**
2. View all your bookings with details
3. Click **Cancel Booking** to cancel (if status is CONFIRMED)
4. Confirmation dialog appears
5. Booking status updates to CANCELED, seat is released, wallet is refunded

## 🎨 UI Components

### Flight Card
- Route display with arrow
- Departure and arrival times
- Aircraft information
- Price display
- Hover effects and selection state

### Seat Map
- 6 rows × 4 seats (A, B, C, D)
- Visual indicators:
  - 🟢 **White** - Available seat
  - 🟡 **Yellow** - Business class
  - 🔵 **Blue** - Selected seat
  - 🔴 **Gray** - Booked seat
  - 🟠 **Yellow border** - Held seat

### Booking Card
- Passenger information
- Flight details
- Seat and class
- Price
- Booking status badge
- Cancel button (if applicable)

## 🧪 Quick Smoke Tests (PowerShell)

```powershell
# Search (returns up to 10 flights)
Invoke-WebRequest -Uri "http://localhost:3000/api/search?origin=DELHI&destination=MUMBAI&date=2025-12-13" -Method GET

# Seats for a flight
Invoke-WebRequest -Uri "http://localhost:3000/api/seats?flightId=1" -Method GET

# Pricing attempt (surge tracking)
$pricing = @{ flightId = 1; userId = "demo@example.com" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/pricing" -Method POST -ContentType "application/json" -Body $pricing

# Wallet
Invoke-WebRequest -Uri "http://localhost:3000/api/wallet?email=demo@example.com" -Method GET

# Create booking
$body = @{ flightId = 1; seatId = 5; passenger = @{ firstName = "Demo"; lastName = "User"; email = "demo@example.com" } } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/bookings" -Method POST -ContentType "application/json" -Body $body

# Cancel booking
Invoke-WebRequest -Uri "http://localhost:3000/api/bookings?id=1" -Method DELETE
```

## 📝 Scripts

```powershell
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:migrate   # Run Prisma migrations
npm run db:generate  # Generate Prisma Client
npm run db:seed      # Seed database with sample data
```

## 🌱 Sample Data (seed)

The seed script creates:
- **12 routes**: Indian metro pairs (e.g., DELHI↔MUMBAI, DELHI→BANGALORE, MUMBAI→KOLKATA, etc.)
- **4 aircraft**: A320, B737, A350, B787
- **20 flights**: Spread across upcoming days, base prices ₹2000–₹3000
- **Seats**: 24 per flight (6 rows × 4 seats), Business and Economy
- **Wallet**: Auto-creates passenger wallet with ₹50,000 on first booking

## 🔐 Environment Variables

No environment variables required for local development. SQLite uses a local file database (`prisma/dev.db`).

For production, consider:
- `DATABASE_URL` - PostgreSQL/MySQL connection string
- `NODE_ENV=production`

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add PostgreSQL database (Vercel Postgres)
4. Update `DATABASE_URL` in environment variables
5. Deploy

### Other Platforms
- Update database provider in `prisma/schema.prisma`
- Run `npx prisma migrate deploy`
- Set environment variables
- Build with `npm run build`
- Start with `npm run start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Samee28**
- GitHub: [@Samee28](https://github.com/Samee28)
- Repository: [Flight-Booking-System](https://github.com/Samee28/Flight-Booking-System)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Vercel for hosting and deployment platform

---

Made with ❤️ using Next.js and TypeScript
