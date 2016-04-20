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
      $scope.editMode = false;
      $scope.furnituringBackup = {};

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

      $scope.startEditMode = function () {
        const $scope = this;

        $scope.isEditMode = true;

        // Make backup of data if in editMode.
        $scope.furnituringBackup = angular.copy( $scope.furnituring );
      };

      $scope.endEditMode = function () {
        const $scope = this;

        $scope.isEditMode = false;
      };

      $scope.abortEditMode = function() {
        const $scope = this;

        $scope.isEditMode = false;
        $scope.furnituring = $scope.furnituringBackup;
      };

      $scope.saveFurnituring = function() {

        const $scope = this;

        // Save furnituring
        Furnituring.save(
          {
            FurnituringId: $stateParams.furnituringId,
            Name: $scope.furnituring.Name
          }
        ).$promise

          // If everything went ok
          .then( ( response ) => {

            $scope.endEditMode();

            $rootScope.FlashMessage = {
              type: 'success',
              message: 'Möbleringen "' + $scope.furnituring.Name + '" sparades med ett lyckat resultat'
            };

            // Something went wrong
          }).catch( ( response ) => {

            // If there there was a foreign key reference
            if ( response.status === 409 ){
              $rootScope.FlashMessage = {
                type: 'error',
                message: 'Det finns redan en möblering som heter "' + $scope.furnituring.Name +
                '". Två möbleringar kan inte heta lika.'
              };
            }

            // If there was a problem with the in-data
            else if ( response.status === 400 || response.status === 500 ){
              $rootScope.FlashMessage = {
                type: 'error',
                message: 'Ett oväntat fel uppstod när möbleringen skulle sparas'
              };
            }

            // If the entry was not found
            if ( response.status === 404 ) {
              $rootScope.FlashMessage = {
                type: 'error',
                message: 'Möbleringen "' + $scope.furnituring.Name + '" existerar inte längre. Hann kanske någon radera den?'
              };

              history.back();
            }
          });
      };

      /* Public Methods END */

      /* Initialization START */

      getFurnituring();

      /* Initialization END */

    }]
    );

