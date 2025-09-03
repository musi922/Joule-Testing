sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"ytjoule/flightaplication/test/integration/pages/FlightsList",
	"ytjoule/flightaplication/test/integration/pages/FlightsObjectPage"
], function (JourneyRunner, FlightsList, FlightsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('ytjoule/flightaplication') + '/index.html',
        pages: {
			onTheFlightsList: FlightsList,
			onTheFlightsObjectPage: FlightsObjectPage
        },
        async: true
    });

    return runner;
});

