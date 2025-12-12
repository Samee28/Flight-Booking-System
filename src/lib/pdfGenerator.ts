import jsPDF from 'jspdf';

export interface TicketData {
  pnr: string;
  passengerName: string;
  airline: string;
  flightId: number;
  route: string;
  seatNumber: string;
  seatClass: string;
  price: number;
  bookingDate: string;
  departureTime: string;
  arrivalTime: string;
}

export function generateTicketPDF(data: TicketData) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FLIGHT TICKET', 105, 20, { align: 'center' });
  
  // PNR - Large and prominent
  doc.setFontSize(16);
  doc.setTextColor(37, 99, 235); // Blue
  doc.text(`PNR: ${data.pnr}`, 105, 35, { align: 'center' });
  
  doc.setTextColor(0, 0, 0); // Black
  
  // Draw line
  doc.setLineWidth(0.5);
  doc.line(20, 42, 190, 42);
  
  // Passenger Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Passenger Details:', 20, 52);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Name: ${data.passengerName}`, 20, 60);
  doc.text(`Seat: ${data.seatNumber} (${data.seatClass})`, 20, 68);
  
  // Flight Details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Flight Details:', 20, 82);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Airline: ${data.airline}`, 20, 90);
  doc.text(`Flight ID: ${data.flightId}`, 20, 98);
  doc.text(`Route: ${data.route}`, 20, 106);
  doc.text(`Departure: ${data.departureTime}`, 20, 114);
  doc.text(`Arrival: ${data.arrivalTime}`, 20, 122);
  
  // Booking Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Booking Information:', 20, 136);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Booking Date: ${data.bookingDate}`, 20, 144);
  doc.text(`Amount Paid: ₹${data.price}`, 20, 152);
  
  // Footer with important notice
  doc.setLineWidth(0.5);
  doc.line(20, 165, 190, 165);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Please carry a valid ID proof along with this ticket', 105, 175, { align: 'center' });
  doc.text('Check-in opens 2 hours before departure', 105, 182, { align: 'center' });
  
  // QR Code placeholder (visual box)
  doc.setFontSize(8);
  doc.rect(155, 50, 30, 30);
  doc.text('QR Code', 170, 68, { align: 'center' });
  
  // Download the PDF
  doc.save(`ticket-${data.pnr}.pdf`);
}
