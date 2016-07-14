'use strict';

angular.module( 'BookingSystem.usersServices',

  [
    'ngResource'
  ]
)
  .factory( 'User', ['$resource', 'API_URL', ( $resource, API_URL ) => {

    return $resource(
      API_URL + 'User/:userId',
      {userId: '@userId'},
      {
        /*
        queryFreeForPeriod: {
          url: API_URL + 'Location/free/:fromDate/:toDate/:locationBookingId',
          id: '@id',
          method: 'GET',
          isArray: true,
          params: {
            locationBookingId: '@locationBookingId',
            fromDate: '@fromDate',
            toDate: '@toDate'
          }
        },
        // Search for location
        querySearch: {
          url: API_URL + 'Location/search/:column',
          id: '@id',
          method: 'GET',
          isArray: true,
          params: {
            column: '@column'
          }
        }
        */
      }
    );
  }]
)

  .factory( 'UserImage', ['$http', 'API_URL', ( $http, API_URL ) => {

    return {
      upload : function( imageData, userId ) {

        return $http(
          {
            method: 'POST',
            url: API_URL + 'User/image/' + userId,
            data: imageData,
            headers: {'Content-Type': undefined}
          }
        );
      }
    };
  }]
);