using { yT_JouleSrv } from '../srv/service.cds';

annotate yT_JouleSrv.Flights with @UI.HeaderInfo: { TypeName: 'Flight', TypeNamePlural: 'Flights', Title: { Value: flightNumber } };
annotate yT_JouleSrv.Flights with {
  ID @UI.Hidden @Common.Text: { $value: flightNumber, ![@UI.TextArrangement]: #TextOnly }
};
annotate yT_JouleSrv.Flights with @UI.Identification: [{ Value: flightNumber }];
annotate yT_JouleSrv.Flights with {
  airline @Common.ValueList: {
    CollectionPath: 'Airlines',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: airline_ID, 
        ValueListProperty: 'ID'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'code'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'name'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'country'
      },
    ],
  }
};
annotate yT_JouleSrv.Flights with {
  passengers1 @Common.ValueList: {
    CollectionPath: 'Passengers',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: passengers1_ID, 
        ValueListProperty: 'ID'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'passportNumber'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'firstName'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'lastName'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'email'
      },
    ],
  }
};
annotate yT_JouleSrv.Flights with @UI.DataPoint #departure: {
  Value: departure,
  Title: 'Departure',
};
annotate yT_JouleSrv.Flights with @UI.DataPoint #arrival: {
  Value: arrival,
  Title: 'Arrival',
};
annotate yT_JouleSrv.Flights with {
  flightNumber @title: 'Flight Number';
  departure @title: 'Departure';
  arrival @title: 'Arrival';
  departureTime @title: 'Departure Time';
  arrivalTime @title: 'Arrival Time';
  status @title: 'Status'
};

annotate yT_JouleSrv.Flights with @UI.LineItem: [
 { $Type: 'UI.DataField', Value: flightNumber },
 { $Type: 'UI.DataField', Value: departure },
 { $Type: 'UI.DataField', Value: arrival },
 { $Type: 'UI.DataField', Value: departureTime },
 { $Type: 'UI.DataField', Value: arrivalTime },
 { $Type: 'UI.DataField', Value: status },
    { $Type: 'UI.DataField', Label: 'Airline', Value: airline_ID },
    { $Type: 'UI.DataField', Label: 'Passenger', Value: passengers1_ID }
];

annotate yT_JouleSrv.Flights with @UI.FieldGroup #Main: {
  $Type: 'UI.FieldGroupType', Data: [
 { $Type: 'UI.DataField', Value: flightNumber },
 { $Type: 'UI.DataField', Value: departure },
 { $Type: 'UI.DataField', Value: arrival },
 { $Type: 'UI.DataField', Value: departureTime },
 { $Type: 'UI.DataField', Value: arrivalTime },
 { $Type: 'UI.DataField', Value: status },
    { $Type: 'UI.DataField', Label: 'Airline', Value: airline_ID },
    { $Type: 'UI.DataField', Label: 'Passenger', Value: passengers1_ID }
  ]
};

annotate yT_JouleSrv.Flights with {
  airline @Common.Text: { $value: airline.code, ![@UI.TextArrangement]: #TextOnly };
  passengers1 @Common.Text: { $value: passengers1.passportNumber, ![@UI.TextArrangement]: #TextOnly }
};

annotate yT_JouleSrv.Flights with {
  airline @Common.Label: 'Airline';
  passengers @Common.Label: 'Passengers';
  passengers1 @Common.Label: 'Passenger'
};

annotate yT_JouleSrv.Flights with @UI.HeaderFacets: [
 { $Type : 'UI.ReferenceFacet', Target : '@UI.DataPoint#departure' },
 { $Type : 'UI.ReferenceFacet', Target : '@UI.DataPoint#arrival' }
];

annotate yT_JouleSrv.Flights with @UI.Facets: [
  { $Type: 'UI.ReferenceFacet', ID: 'Main', Label: 'General Information', Target: '@UI.FieldGroup#Main' }
];

annotate yT_JouleSrv.Flights with @UI.SelectionFields: [
  airline_ID,
  passengers1_ID
];

annotate yT_JouleSrv.Airlines with @UI.HeaderInfo: { TypeName: 'Airline', TypeNamePlural: 'Airlines', Title: { Value: code } };
annotate yT_JouleSrv.Airlines with {
  ID @UI.Hidden @Common.Text: { $value: code, ![@UI.TextArrangement]: #TextOnly }
};
annotate yT_JouleSrv.Airlines with @UI.Identification: [{ Value: code }];
annotate yT_JouleSrv.Airlines with @UI.DataPoint #name: {
  Value: name,
  Title: 'Name',
};
annotate yT_JouleSrv.Airlines with {
  code @title: 'Code';
  name @title: 'Name';
  country @title: 'Country'
};

annotate yT_JouleSrv.Airlines with @UI.LineItem: [
 { $Type: 'UI.DataField', Value: code },
 { $Type: 'UI.DataField', Value: name },
 { $Type: 'UI.DataField', Value: country }
];

annotate yT_JouleSrv.Airlines with @UI.FieldGroup #Main: {
  $Type: 'UI.FieldGroupType', Data: [
 { $Type: 'UI.DataField', Value: code },
 { $Type: 'UI.DataField', Value: name },
 { $Type: 'UI.DataField', Value: country }
  ]
};

annotate yT_JouleSrv.Airlines with {
  flights @Common.Label: 'Flights'
};

annotate yT_JouleSrv.Airlines with @UI.HeaderFacets: [
 { $Type : 'UI.ReferenceFacet', Target : '@UI.DataPoint#name' }
];

annotate yT_JouleSrv.Airlines with @UI.Facets: [
  { $Type: 'UI.ReferenceFacet', ID: 'Main', Label: 'General Information', Target: '@UI.FieldGroup#Main' }
];

annotate yT_JouleSrv.Airlines with @UI.SelectionFields: [
  code
];

annotate yT_JouleSrv.Passengers with @UI.HeaderInfo: { TypeName: 'Passenger', TypeNamePlural: 'Passengers', Title: { Value: passportNumber } };
annotate yT_JouleSrv.Passengers with {
  ID @UI.Hidden @Common.Text: { $value: passportNumber, ![@UI.TextArrangement]: #TextOnly }
};
annotate yT_JouleSrv.Passengers with @UI.Identification: [{ Value: passportNumber }];
annotate yT_JouleSrv.Passengers with {
  flights1 @Common.ValueList: {
    CollectionPath: 'Flights',
    Parameters    : [
      {
        $Type            : 'Common.ValueListParameterInOut',
        LocalDataProperty: flights1_ID, 
        ValueListProperty: 'ID'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'flightNumber'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'departure'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'arrival'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'departureTime'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'arrivalTime'
      },
      {
        $Type            : 'Common.ValueListParameterDisplayOnly',
        ValueListProperty: 'status'
      },
    ],
  }
};
annotate yT_JouleSrv.Passengers with @UI.DataPoint #firstName: {
  Value: firstName,
  Title: 'First Name',
};
annotate yT_JouleSrv.Passengers with @UI.DataPoint #lastName: {
  Value: lastName,
  Title: 'Last Name',
};
annotate yT_JouleSrv.Passengers with {
  passportNumber @title: 'Passport Number';
  firstName @title: 'First Name';
  lastName @title: 'Last Name';
  email @title: 'Email'
};

annotate yT_JouleSrv.Passengers with @UI.LineItem: [
 { $Type: 'UI.DataField', Value: passportNumber },
 { $Type: 'UI.DataField', Value: firstName },
 { $Type: 'UI.DataField', Value: lastName },
 { $Type: 'UI.DataField', Value: email },
    { $Type: 'UI.DataField', Label: 'Flight', Value: flights1_ID }
];

annotate yT_JouleSrv.Passengers with @UI.FieldGroup #Main: {
  $Type: 'UI.FieldGroupType', Data: [
 { $Type: 'UI.DataField', Value: passportNumber },
 { $Type: 'UI.DataField', Value: firstName },
 { $Type: 'UI.DataField', Value: lastName },
 { $Type: 'UI.DataField', Value: email },
    { $Type: 'UI.DataField', Label: 'Flight', Value: flights1_ID }
  ]
};

annotate yT_JouleSrv.Passengers with {
  flights1 @Common.Text: { $value: flights1.flightNumber, ![@UI.TextArrangement]: #TextOnly }
};

annotate yT_JouleSrv.Passengers with {
  flights @Common.Label: 'Flights';
  flights1 @Common.Label: 'Flight'
};

annotate yT_JouleSrv.Passengers with @UI.HeaderFacets: [
 { $Type : 'UI.ReferenceFacet', Target : '@UI.DataPoint#firstName' },
 { $Type : 'UI.ReferenceFacet', Target : '@UI.DataPoint#lastName' }
];

annotate yT_JouleSrv.Passengers with @UI.Facets: [
  { $Type: 'UI.ReferenceFacet', ID: 'Main', Label: 'General Information', Target: '@UI.FieldGroup#Main' }
];

annotate yT_JouleSrv.Passengers with @UI.SelectionFields: [
  flights1_ID
];

