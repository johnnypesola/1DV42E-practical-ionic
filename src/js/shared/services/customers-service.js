/**
 * Created by Johanna Larsson on 2016-04-24.
 */
'use strict';

angular.module( 'BookingSystem.customersServices',

  // Dependencies
  [
    'ngResource'
  ]
  )
  .factory( 'Customer', [ '$resource', 'API_URL', ( $resource, API_URL ) => {

    return $resource(
      API_URL + 'Customer/:customerId',
      {customerId: '@customerId'}
    );
  }]
  );