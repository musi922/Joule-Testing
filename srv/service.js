const cds = require('@sap/cds');

class FlightService extends cds.ApplicationService {
   async init(){
    this.before("CREATE", "Flights", this.#validateFlights);
    this.before("CREATE", "Bookings", this.#validateBookings);
    this.after("CREATE", "Bookings", this.#decreaseAvailableSeats);
    this.before("UPDATE", "Bookings", this.#validateBookingUpdate);
    this.after("DELETE", "Bookings", this.#increaseAvailableSeats);
    await super.init()
   }

   async #validateFlights(req) {
    const { flightNumber, origin, destination, departureTime, arrivalTime, airline } = req.data;
    
    if(!flightNumber) return req.error(400, "ERROR_FLIGHTNUMBER_IS_REQUIRED")
    if(!origin) return req.error(400, "ERROR_ORIGIN_IS_REQUIRED")
    if(!destination) return req.error(400, "ERROR_DESTINATION_IS_REQUIRED")
    if(!departureTime) return req.error(400, "ERROR_DEPARTURETIME_IS_REQUIRED")
    if(!arrivalTime) return req.error(400, "ERROR_ARRIVALTIME_IS_REQUIRED")
    if(!airline) return req.error(400, "ERROR_AIRLINE_IS_REQUIRED")

    const [existingFlightNumber] = await cds.run(SELECT.from("Flights").where({flightNumber}));
    if(existingFlightNumber) return req.error(400, "ERROR_FLIGHTNUMBER_ALREADY_EXISTS")
   }

   async #validateBookings(req) {
    const { flight_ID, passenger_ID, bookingDate, numberOfSeats } = req.data;
    
    if(!flight_ID) return req.error(400, "ERROR_FLIGHT_IS_REQUIRED");
    if(!bookingDate) return req.error(400, "ERROR_BOOKING_DATE_IS_REQUIRED");
    if(!passenger_ID) return req.error(400, "ERROR_PASSENGER_ID_IS_REQUIRED");

      const [existingPassenger] = await cds.run(
      SELECT.from("Passengers").where({ ID: passenger_ID })
    );
    
    if(!existingPassenger) return req.error(404, "ERROR_PASSENGER_NOT_FOUND", [passenger_ID]);

    
    const seatsToBook = numberOfSeats || 1;
    if(seatsToBook <= 0) {
      return req.error(400, "ERROR_INVALID_NUMBER_OF_SEATS");
    }
    const [existingFlight] = await cds.run(
      SELECT.from("Flights").where({ ID: flight_ID })
    );
    
    if(!existingFlight) return req.error(404, "ERROR_FLIGHT_NOT_FOUND", [flight_ID]);

    if(existingFlight.availableSeats < seatsToBook) {
      return req.error(400, "ERROR_NOT_ENOUGH_SEATS_AVAILABLE", [
        `Requested: ${seatsToBook}, Available: ${existingFlight.availableSeats}`
      ]);
    }

    if(existingFlight.status === 'CANCELLED') {
      return req.error(400, "ERROR_FLIGHT_IS_CANCELLED");
    }
   }

async #decreaseAvailableSeats(results, req) {
    
    const booking = Array.isArray(results) ? results[0] : results;
    const { flight_ID, numberOfSeats } = booking;
        
    if(flight_ID) {
      await cds.run(
        UPDATE("Flights")
          .set({ availableSeats: { '-=': numberOfSeats || 1 } })
          .where({ ID: flight_ID })
      );
    }
}

async #increaseAvailableSeats(results, req) {
   
    const booking = Array.isArray(results) ? results[0] : results;
    if(booking && booking.flight_ID) {
      const seatsToRestore = booking.numberOfSeats || 1;
      await cds.run(
        UPDATE("Flights")
          .set({ availableSeats: { '+=': seatsToRestore } })
          .where({ ID: booking.flight_ID })
      );
    }
}

   async #validateBookingUpdate(req) {
    const { flight_ID } = req.data;
    
    if(flight_ID) {
      const [existingFlight] = await cds.run(
        SELECT.from("Flights").where({ ID: flight_ID })
      );
      
      if(!existingFlight) {
        return req.error(404, "ERROR_FLIGHT_NOT_FOUND", [flight_ID]);
      }
    }
   }
}

module.exports = FlightService;