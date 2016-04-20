'use strict';

angular.module( 'BookingSystem.furnituring',

    // Dependencies
    []
    )

    // Controller
    .controller( 'FurnituringListCtrl', [ '$rootScope', '$scope', '$state', 'Furnituring', ( $rootScope, $scope, $state, Furnituring ) => {

      /* Init vars */

      /* Private methods START */

      const getFurniturings = function () {

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
    )

    .controller( 'FurnituringDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', '$state', 'Furnituring', ( $rootScope, $scope, $stateParams, $state, Furnituring ) => {

      /* Init vars */

      /* Private methods START */

      const getFurnituring = function () {

        const furnituring = Furnituring.get(
          {
            furnituringId: $stateParams.furnituringId
          }
        );

        // In case furnituring cannot be fetched, display an error to user.
        furnituring.$promise.catch( () => {

          $rootScope.FlashMessage = {
            type: 'error',
            message: 'Möblering kunde inte hämtas, var god försök igen.'
          };
        });

        $scope.furnituring = furnituring;

      };

      /* Private Methods END */

      /* Public Methods START */

      /* Public Methods END */

      /* Initialization START */

      getFurnituring();

      /* Initialization END */

    }]
    );

