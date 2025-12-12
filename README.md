# ✈️ Flight Booking System

A modern, full-featured flight booking application built with **Next.js 14**, **TypeScript**, **Prisma ORM**, and **SQLite**. Features include real-time flight search, visual seat selection, booking management, and mock payment processing.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.18-2D3748)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57)

## ✨ Features

### Core Functionality
- **Flight Search** - Search flights by origin, destination, and date
- **Visual Seat Selection** - Interactive seat map with real-time availability
- **Seat Classes** - Business and Economy class seating
- **Real-time Availability** - See booked, held, and available seats instantly
- **Booking Management** - Create, view, and cancel bookings
- **Passenger Management** - Automatic passenger profile creation
- **Payment Processing** - Mock payment gateway integration
- **Responsive Design** - Works seamlessly on desktop and mobile

### User Experience
- 🎨 **Modern UI** - Clean, professional interface with smooth animations
- 📱 **Mobile Responsive** - Optimized for all screen sizes
- ⚡ **Fast Performance** - Server-side rendering with Next.js App Router
- 🔄 **Real-time Updates** - Dynamic seat availability and booking status
- ✅ **Form Validation** - Client and server-side validation with Zod

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Styling**: Custom CSS with CSS variables
- **Validation**: Zod schema validation
- **Type Safety**: Full TypeScript coverage

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

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
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with sample data
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
│   │   │   └── page.tsx       # Flight search & booking flow
│   │   ├── bookings/
│   │   │   └── page.tsx       # Booking management
│   │   └── api/
│   │       ├── search/        # Flight search API
│   │       ├── seats/         # Seat availability API
│   │       ├── bookings/      # Booking CRUD API
│   │       ├── holds/         # Seat hold API
│   │       └── payments/      # Payment processing API
│   └── lib/
│       └── prisma.ts          # Prisma client singleton
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🗄️ Database Schema

### Models
- **Route** - Flight routes (origin → destination)
- **Aircraft** - Aircraft types and configurations
- **Flight** - Scheduled flights with pricing
- **Seat** - Individual seats with class and status
- **Passenger** - Passenger profiles
- **Booking** - Booking records with status
- **Hold** - Temporary seat holds with expiry
- **Payment** - Payment transactions

## 🔌 API Endpoints

### Search Flights
```http
GET /api/search?origin=NYC&destination=SFO&date=2025-12-15
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
8. Click **Confirm Booking**
9. Receive confirmation and redirect to bookings

### Managing Bookings
1. Navigate to **My Bookings**
2. View all your bookings with details
3. Click **Cancel Booking** to cancel (if status is CONFIRMED)
4. Confirmation dialog appears
5. Booking status updates to CANCELED and seat is released

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

## 🧪 Testing

Sample test flow in PowerShell:

```powershell
# Search for flights
Invoke-WebRequest -Uri "http://localhost:3000/api/search?origin=NYC&destination=SFO" -Method GET

# Get seats for flight ID 1
Invoke-WebRequest -Uri "http://localhost:3000/api/seats?flightId=1" -Method GET

# Create a booking
$body = @{
  flightId = 1
  seatId = 5
  passenger = @{
    firstName = "Jane"
    lastName = "Smith"
    email = "jane@example.com"
  }
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/bookings" -Method POST -ContentType "application/json" -Body $body

# Cancel booking ID 1
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

## 🌱 Sample Data

The seed script creates:
- **4 routes**: NYC↔SFO, NYC→LAX, LAX→MIA
- **3 aircraft**: Airbus A320, Boeing 737, Airbus A350
- **6 flights**: Scheduled over the next 6 days
- **144 seats**: 24 seats per flight (6 rows × 4 seats)

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
