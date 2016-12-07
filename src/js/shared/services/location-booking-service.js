
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
      {locationBookingId: '@locationBookingId'},
      {
        // Get bookings for a specified period
        queryLessForPeriod: {
          url: API_URL + 'LocationBooking/period/:fromDate/:toDate/less',
          id: '@id',
          method: 'GET',
          isArray: true,
          params: {
            fromDate: '@fromDate',
            toDate: '@toDate'
          }
        },
        // Get bookings for a specified period
        queryMoreForPeriod: {
          url: API_URL + 'LocationBooking/period/:fromDate/:toDate/more',
          id: '@id',
          method: 'GET',
          isArray: true,
          params: {
            fromDate: '@fromDate',
            toDate: '@toDate'
          }
        },

        // Get bookings for a specified period for a specific location
        queryForLocationForPeriod: {
          url: API_URL + 'LocationBooking/location/:locationId/period/:fromDate/:toDate',
          id: '@id',
          method: 'GET',
          isArray: true,
          params: {
            locationId: '@locationId',
            fromDate: '@fromDate',
            toDate: '@toDate'
          }
        }
      }
    );
  }]
  );
