/*
  Warnings:

  - Added the required column `pnr` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Wallet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "passengerId" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 50000,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Wallet_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walletId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookingAttempt" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flightId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "attemptAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BookingAttempt_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pnr" TEXT NOT NULL,
    "flightId" INTEGER NOT NULL,
    "seatId" INTEGER NOT NULL,
    "passengerId" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "paymentId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "Seat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "Passenger" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("createdAt", "flightId", "id", "passengerId", "paymentId", "price", "seatId", "status") SELECT "createdAt", "flightId", "id", "passengerId", "paymentId", "price", "seatId", "status" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE UNIQUE INDEX "Booking_pnr_key" ON "Booking"("pnr");
CREATE TABLE "new_Flight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "routeId" INTEGER NOT NULL,
    "aircraftId" INTEGER NOT NULL,
    "airline" TEXT NOT NULL DEFAULT 'Air India',
    "departureAt" DATETIME NOT NULL,
    "arrivalAt" DATETIME NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "currentPrice" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Flight_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Flight" ("aircraftId", "arrivalAt", "basePrice", "createdAt", "departureAt", "id", "routeId", "status") SELECT "aircraftId", "arrivalAt", "basePrice", "createdAt", "departureAt", "id", "routeId", "status" FROM "Flight";
DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'AUTHORIZED',
    "provider" TEXT NOT NULL DEFAULT 'MOCK',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Payment" ("amount", "createdAt", "currency", "id", "provider", "status") SELECT "amount", "createdAt", "currency", "id", "provider", "status" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_passengerId_key" ON "Wallet"("passengerId");
