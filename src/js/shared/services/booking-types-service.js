/**
 * Created by Johanna Larsson on 2016-04-25.
 */
'use strict';

angular.module( 'BookingSystem.bookingTypesServices',

  // Dependencies
  [
    'ngResource'
  ]
  )
  .factory( 'BookingType', [ '$resource', 'API_URL', ( $resource, API_URL ) => {

    return $resource(
      API_URL + 'BookingType/:bookingTypeId',
      {bookingTypeId: '@bookingTypeId'}
    );
  }]
  );