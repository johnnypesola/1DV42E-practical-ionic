
// Declare module
angular.module( 'BookingSystem.locationBookingServices',

  // Dependencies
  [
    'ngResource'
  ]
  )

  .factory( 'LocationBooking', [ '$resource', 'API_URL', ( $resource, API_URL ) => {

    return $resource(
      API_URL + 'LocationBooking/:locationBookingId',
      {locationBookingId: '@locationBookingId'}
    );
  }]
  );
