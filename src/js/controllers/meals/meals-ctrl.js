'use strict';

angular.module( 'BookingSystem.meals',

  //Dependencies
  []
  )

  //Controller
  .controller( 'MealsListCtrl', [ '$rootScope', '$scope', '$state', 'Meal', ( $rootScope, $scope, $state, Meal ) => {

    /* Init vars */

    /* Private methods START */

    const getMeals = function() {

      const meals = Meal.query();

      // In case meals cannot be fetched, display an error to user.
      meals.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Måltider kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.meals = meals;
    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */

    getMeals();

    /* Initialization END */

  }]
  );
