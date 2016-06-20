'use strict';

angular.module( 'BookingSystem.furnituring',

    // Dependencies
    []
    )

    // Controller
    .controller( 'FurnituringListCtrl', [ '$rootScope', '$scope', '$state', 'Furnituring', '$mdToast', ( $rootScope, $scope, $state, Furnituring, $mdToast ) => {

      /* Init vars */

      /* Private methods START */

      const getFurniturings = function () {

        const furniturings = Furnituring.query();

        // In case furnituring cannot be fetched, display an error to user.
        furniturings.$promise.catch( () => {

          $mdToast.show( $mdToast.simple()
            .content( 'Möbleringar kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
          );
        });

        $scope.furniturings = furniturings;

      };

      /* Private Methods END */

      /* Public Methods START */

      /* Public Methods END */

      /* Initialization START */
      $scope.$on( '$ionicView.beforeEnter', ( event, data ) => {
        getFurniturings();
      });

      /* Initialization END */

    }]
    )

    .controller( 'FurnituringDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', 'Furnituring', '$mdToast', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, Furnituring, $mdToast ) => {

      /* Init vars */

      const modalTemplateUrl = 'templates/modals/furnituring-delete.html';
      $scope.editMode = false;
      $scope.furnituringBackup = {};

      /* Private methods START */
      const setupModal = function(){

        $ionicModal.fromTemplateUrl( modalTemplateUrl, {
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

          $mdToast.show( $mdToast.simple()
            .content( 'Möblering kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
          );
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

            $mdToast.show( $mdToast.simple()
              .content( 'Möbleringen "' + $scope.furnituring.Name + '" sparades med ett lyckat resultat' )
              .position( 'top right' )
            );

            history.back();

            // Something went wrong
          }).catch( ( response ) => {

            // If there there was a foreign key reference
            if ( response.status === 409 ){
              $mdToast.show( $mdToast.simple()
                .content( 'Det finns redan en möblering som heter "' + $scope.furnituring.Name +
                  '". Två möbleringar kan inte heta lika.' )
                .position( 'top right' )
              );
            }

            // If there was a problem with the in-data
            else if ( response.status === 400 || response.status === 500 ){
              $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när möbleringen skulle sparas' )
                .position( 'top right' )
              );
            }

            // If the entry was not found
            if ( response.status === 404 ) {
              $mdToast.show( $mdToast.simple()
                .content( 'Möbleringen "' + $scope.furnituring.Name + '" existerar inte längre. Hann kanske någon radera den?' )
                .position( 'top right' )
              );

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

            $mdToast.show( $mdToast.simple()
              .content( 'Möbleringen "' + $scope.furnituring.Name + '" raderades med ett lyckat resultat' )
              .position( 'top right' )
            );

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
              $mdToast.show( $mdToast.simple()
                .content( 'Möbleringen kan inte raderas eftersom det finns' +
                  ' en lokalbokning eller en lokalmöblering som refererar till möbleringen' )
                .position( 'top right' )
              );
            }

            // If there was a problem with the in-data
            else if ( response.status === 400 || response.status === 500 ){
              $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när möbleringen skulle tas bort' )
                .position( 'top right' )
              );
            }

            // If the entry was not found
            if ( response.status === 404 ) {
              $mdToast.show( $mdToast.simple()
                .content( 'Möbleringen "' + $scope.furnituring.Name + '" existerar inte längre. Hann kanske någon radera den?' )
                .position( 'top right' )
              );
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

    .controller( 'FurnituringCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'Furnituring', '$mdToast', ( $rootScope, $stateParams, $scope, $state, Furnituring, $mdToast ) => {

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

            $mdToast.show( $mdToast.simple()
              .content( 'Möbleringen "' + $scope.furnituring.Name + '" skapades med ett lyckat resultat' )
              .position( 'top right' )
            );

            history.back();

            // Something went wrong
          }).catch( ( response ) => {

            // If there there was a foreign key reference
            if ( response.status === 409 ){
              $mdToast.show( $mdToast.simple()
                .content( 'Det finns redan en möblering som heter "' + $scope.furnituring.Name +
                  '". Två möbleringar kan inte heta lika.' )
                .position( 'top right' )
              );
            }

            // If there was a problem with the in-data
            else {
              $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när möbleringen skulle sparas' )
                .position( 'top right' )
              );
            }
          });
      };

      /* Public Methods END */

      /* Initialization START */

      /* Initialization END */

    }]
    );
