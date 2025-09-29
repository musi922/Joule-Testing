using { Flights as my } from '../db/schema.cds';

service FlightsService {
  entity Flights as projection on my.Flights;
  entity Airlines as projection on my.Airlines;
  entity Passengers as projection on my.Passengers;
  entity Bookings as projection on my.Bookings;


}