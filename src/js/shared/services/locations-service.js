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
          url: API_URL + 'Location/free/:fromDate/:toDate',
          id: '@id',
          method: 'GET',
          isArray: true,
          params: {
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
  );