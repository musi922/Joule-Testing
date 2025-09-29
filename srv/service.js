const cds = require('@sap/cds');
class FlightService extends cds.ApplicationService {
   async init(){
    this.before("CREATE", "Flights", this.#validateFlights);
    await super.init()
   }
   async #validateFlights(req) {
    const { flightNumber, origin, destination, departureTime, arrivalTime, airline } = req.data;
    if(!flightNumber) return req.error(400, "ERROR_FLIGHTNUMBER_IS_REQUIRED")
    if(!origin) return req.error(400, "ERROR_ORIGIN_IS_REQUIRED")
    if(!destination) return req.error(400, "ERROR_DESTINATION_IS_REQUIRED")
    if(!destination) return req.error(400, "ERROR_DESTINATION_IS_REQUIRED")
    if(!departureTime) return req.error(400, "ERROR_DEPARTURETIME_IS_REQUIRED")
    if(!arrivalTime) return req.error(400, "ERROR_ARRIVALTIME_IS_REQUIRED")
    if(!airline) return req.error(400, "ERROR_AIRLINE_IS_REQUIRED")


   const [existingFlightNumber] = await cds.run(SELECT.from("Flights").where({flightNumber}));
    if(existingFlightNumber) return req.error(400, "ERROR_FLIGHTNUMBER_ALREADY_EXISTS")

   }

}


module.exports = FlightService;