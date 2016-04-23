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
      $scope.$on( '$ionicView.enter', ( event, data ) => {
        getFurniturings();
      });

      /* Initialization END */

    }]
    )

    .controller( 'FurnituringDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', 'Furnituring', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, Furnituring ) => {

      /* Init vars */
      const modelTemplateUrl = 'templates/modals/furnituring-delete.html';
      $scope.editMode = false;
      $scope.furnituringBackup = {};

      /* Private methods START */
      const setupModal = function(){

        $ionicModal.fromTemplateUrl( modelTemplateUrl, {
          scope: $scope,
          animation: MODAL_ANIMATION
        })
          .then( ( response ) => {

            $scope.modal = response;
          });

        // Cleanup the modal when we're done with it!
        $scope.$on( '$destroy', () => {
          $scope.modal.remove();
        });

        // Execute action on hide modal
        // $scope.$on( 'modal.hidden', () => {
          // Execute action
        // });

        // Execute action on remove modal
        // $scope.$on( 'modal.removed', () => {
          // Execute action
        // });
      };

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

      $scope.deleteFurnituring = function() {

        // Delete furnituring
        Furnituring.delete(
          {
            furnituringId: $stateParams.furnituringId
          }
        ).$promise

          // If everything went ok
          .then( ( response ) => {

            $rootScope.FlashMessage = {
              type: 'success',
              message: 'Möbleringen "' + $scope.furnituring.Name + '" raderades med ett lyckat resultat'
            };

            history.back();
          })
          // Something went wrong
          .catch( ( response ) => {

            // If there there was a foreign key reference
            if (
              response.status === 400 &&
              response.data.Message !== 'undefined' &&
              response.data.Message === 'Foreign key references exists'
            ){
              $rootScope.FlashMessage = {
                type: 'error',
                message:    'Möbleringen kan inte raderas eftersom det finns' +
                ' en lokalbokning eller en lokalmöblering som refererar till möbleringen'
              };
            }

            // If there was a problem with the in-data
            else if ( response.status === 400 || response.status === 500 ){
              $rootScope.FlashMessage = {
                type: 'error',
                message: 'Ett oväntat fel uppstod när möbleringen skulle tas bort'
              };
            }

            // If the entry was not found
            if ( response.status === 404 ) {
              $rootScope.FlashMessage = {
                type: 'error',
                message: 'Möbleringen "' + $scope.furnituring.Name + '" existerar inte längre. Hann kanske någon radera den?'
              };
            }

            history.back();
          });
      };

      /* Public Methods END */

      /* Initialization START */

      setupModal();
      getFurnituring();

      /* Initialization END */

    }]
    )

    .controller( 'FurnituringCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'Furnituring', ( $rootScope, $stateParams, $scope, $state, Furnituring ) => {

      /* Init vars */
      $scope.furnituring = {};

      /* Private methods START */

      /* Private Methods END */

      /* Public Methods START */

      $scope.saveFurnituring = function() {

        const $scope = this;

        // Save furnituring
        Furnituring.save(
          {
            FurnituringId: 0,
            Name: $scope.furnituring.Name
          }
        ).$promise

          // If everything went ok
          .then( ( response ) => {

            $rootScope.FlashMessage = {
              type: 'success',
              message: 'Möbleringen "' + $scope.furnituring.Name + '" skapades med ett lyckat resultat'
            };

            history.back();

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
            else {
              $rootScope.FlashMessage = {
                type: 'error',
                message: 'Ett oväntat fel uppstod när möbleringen skulle sparas'
              };
            }
          });
      };

      /* Public Methods END */

      /* Initialization START */

      /* Initialization END */

    }]
    );