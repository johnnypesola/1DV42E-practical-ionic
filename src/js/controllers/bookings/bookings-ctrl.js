'use strict';

angular.module( 'BookingSystem.bookings',

  // Dependencies
  []
  )

  // Controller
  .controller( 'BookingListCtrl', [ '$rootScope', '$scope', '$state', 'Booking', ( $rootScope, $scope, $state, Booking ) => {

    /* Init vars */

    /* Private methods START */

    const getBookings = function () {

      const furniturings = Booking.query();

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
      getBookings();
    });

    /* Initialization END */

  }]
  )

  .controller( 'BookingDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', 'Booking', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, Booking ) => {

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

    const getBooking = function () {

      const furnituring = Booking.get(
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

    $scope.saveBooking = function() {

      const $scope = this;

      // Save furnituring
      Booking.save(
        {
          BookingId: $stateParams.furnituringId,
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
              message: 'Det finns redan ett bokningstillfälle som heter "' + $scope.furnituring.Name +
              '". Två bokningstillfällen kan inte heta lika.'
            };
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när bokningstillfället skulle sparas'
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

    $scope.deleteBooking = function() {

      // Delete furnituring
      Booking.delete(
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
              ' en lokalbokning eller en lokalmöblering som refererar till bokningstillfället'
            };
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när bokningstillfället skulle tas bort'
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
    getBooking();

    /* Initialization END */

  }]
  )

  .controller( 'BookingCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'Booking', ( $rootScope, $stateParams, $scope, $state, Booking ) => {

    /* Init vars */
    $scope.furnituring = {};

    /* Private methods START */

    /* Private Methods END */

    /* Public Methods START */

    $scope.saveBooking = function() {

      const $scope = this;

      // Save furnituring
      Booking.save(
        {
          BookingId: 0,
          Name: $scope.booking.Name
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Möbleringen "' + $scope.booking.Name + '" skapades med ett lyckat resultat'
          };

          history.back();

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Det finns redan ett bokningstillfälle som heter "' + $scope.booking.Name +
              '". Två bokningstillfällen kan inte heta lika.'
            };
          }

          // If there was a problem with the in-data
          else {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när bokningstillfället skulle sparas'
            };
          }
        });
    };

    /* Public Methods END */

    /* Initialization START */

    /* Initialization END */

  }]
  );