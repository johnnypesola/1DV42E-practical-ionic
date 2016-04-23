/**
 * Created by Johanna Larsson on 2016-04-21.
 */
'use strict';

angular.module( 'BookingSystem.resourcesServices',

  // Dependencies
  [
    'ngResource'
  ]
  )
  .factory( 'Resource', [ '$resource', 'API_URL', ( $resource, API_URL ) => {

    return $resource(
      API_URL + 'Resource/:resourceId',
      {resourceId: '@resourceId'}
    );
  }]
  );