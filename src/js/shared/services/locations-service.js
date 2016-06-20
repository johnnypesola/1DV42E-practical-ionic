/**
 * Created by Johanna Larsson on 2016-05-11.
 */
'use strict';

angular.module( 'BookingSystem.locationsServices',

  [
    'ngResource'
  ]
  )
  .factory( 'Location', ['$resource', 'API_URL', ( $resource, API_URL ) => {

    return $resource(
      API_URL + 'Location/:locationId',
      {locationId: '@locationId'},
      {
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
      }
    );
  }]
  )

  .factory( 'LocationImage', ['$http', 'API_URL', ( $http, API_URL ) => {

    return {
      upload : function( imageData, locationId ) {

        return $http(
          {
            method: 'POST',
            url: API_URL + 'Location/image/' + locationId,
            data: imageData,
            headers: {'Content-Type': undefined}
          }
        );
      }
    };
  }]
  );