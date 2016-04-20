'use strict';

angular.module( 'BookingSystem.furnituring',

    // Dependencies
    []
    )

    // Controller
    .controller( 'FurnituringListCtrl', [ '$rootScope', '$scope', '$state', 'Furnituring', ( $rootScope, $scope, $state, Furnituring ) => {

      /* Init vars */
      console.log( 'FurnituringListCtrl' );

      /* Private methods START */

      const getFurniturings = function () {

        console.log( 'Hämtar saker!' );

        const furniturings = Furnituring.query();

        // In case furnituring cannot be fetched, display an error to user.
        furniturings.$promise.catch( () => {

          $rootScope.FlashMessage = {
            type: 'error',
            message: 'Möbleringar kunde inte hämtas, var god försök igen.'
          };
        });

        $scope.furniturings = furniturings;

      };

      /* Private Methods END */

      /* Public Methods START */

      /* Public Methods END */

      /* Initialization START */

      getFurniturings();

      /* Initialization END */

    }]
    );

