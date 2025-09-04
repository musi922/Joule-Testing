using { YT_Joule as my } from '../db/schema.cds';

@path: '/service/yT_Joule'
@requires: 'authenticated-user'
service yT_JouleSrv {
  @odata.draft.enabled
  entity Flights as projection on my.Flights;
  @odata.draft.enabled
  entity Airlines as projection on my.Airlines;
  @odata.draft.enabled
  entity Passengers as projection on my.Passengers;

  action callGeminiAI(message: String, context: String) returns {
    success: Boolean;
    response: String;
    error: String;
  };
}