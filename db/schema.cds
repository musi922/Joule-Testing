namespace Flights;
using { cuid, managed } from '@sap/cds/common';

entity Flights : cuid, managed {
  flightNumber: String(10) not null;
  flightClass: String(100);
  origin: String(100) not null;
  destination: String(100) not null;
  departureTime: Timestamp not null;
  arrivalTime: Timestamp not null;
  price: Decimal(10,2);
  availableSeats: Integer;
  totalSeats: Integer;
  status: String(20);
  airline: String(20);
  bookings: Association to many Bookings on bookings.flight = $self;
}

entity Airlines : cuid, managed {
  code: String(3) not null;
  name: String(100) not null;
  country: String(50);
  contactEmail: String(100);
  contactPhone: String(20);
}

entity Passengers : cuid, managed {
  passportNumber: String(20) not null;
  firstName: String(50) not null;
  lastName: String(50) not null;
  email: String(100) not null;
  phone: String(20);
  dateOfBirth: Date;
  nationality: String(50);
  bookings: Association to many Bookings on bookings.passenger = $self;
}

entity Bookings : cuid, managed {
  bookingReference: String(10) not null;
  seatNumber: String(5);      
  bookingStatus: String(20);
  ticketPrice: Decimal(10,2);         
  bookingDate: Timestamp not null;
  passenger: Association to Passengers not null;
  flight: Association to Flights not null;
}