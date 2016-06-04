
// Declare module
angular.module( 'BookingSystem.mealBookingServices',

  // Dependencies
  [
    'ngResource'
  ]
  )

  .factory( 'MealBooking', [ '$resource', 'API_URL', ( $resource, API_URL ) => {

    return $resource(
      API_URL + 'MealBooking/:mealBookingId',
      {mealBookingId: '@mealBookingId'},
      {
        // Get bookings for a specified period
        queryLessForPeriod: {
          url: API_URL + 'MealBooking/period/:fromDate/:toDate/less',
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
          url: API_URL + 'MealBooking/period/:fromDate/:toDate/more',
          id: '@id',
          method: 'GET',
          isArray: true,
          params: {
            fromDate: '@fromDate',
            toDate: '@toDate'
          }
        }
      }
    );
  }]
  );
