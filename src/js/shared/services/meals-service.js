/**
 * Created by Johanna Larsson on 2016-04-20.
 */
'use strict';

angular.module( 'BookingSystem.mealsServices',

  // Dependencies
  [
    'ngResource'
  ]
)
  .factory( 'Meal', [ '$resource', 'API_URL', ( $resource, API_URL ) => {

    return $resource(
      API_URL + 'Meal/:mealId',
      {mealsId: '@mealId'}
    );
  }]
  );