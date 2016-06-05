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
  )

  .factory( 'CustomerImage', ['$http', 'API_URL', ( $http, API_URL ) => {

    return {
      upload : function( imageData, customerId ) {

        return $http(
          {
            method: 'POST',
            url: API_URL + 'Customer/image/' + customerId,
            data: imageData,
            headers: {'Content-Type': undefined}
          }
        );
      }
    };
  }]
  );
