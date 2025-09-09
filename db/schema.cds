namespace YT_Joule;
using { cuid } from '@sap/cds/common';

@assert.unique: { flightNumber: [flightNumber] }
entity Flights : cuid {
  flightNumber: String(10) @mandatory;
  price: Integer;
  departure: String(100);
  arrival: String(100);
  departureTime: DateTime;
  arrivalTime: DateTime;
  status: String(20);
  airline: Association to Airlines;
  passengers: Association to many Passengers on passengers.flights1 = $self;
  passengers1: Association to Passengers;
}

@assert.unique: { code: [code] }
entity Airlines : cuid {
  code: String(3) @mandatory;
  name: String(100);
  country: String(50);
  flights: Association to many Flights on flights.airline = $self;
}

@assert.unique: { passportNumber: [passportNumber] }
entity Passengers : cuid {
  passportNumber: String(20) @mandatory;
  firstName: String(50);
  lastName: String(50);
  email: String(100);
  flights: Association to many Flights on flights.passengers1 = $self;
  flights1: Association to Flights;
}

