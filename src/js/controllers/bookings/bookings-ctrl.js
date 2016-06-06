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

      const bookings = Booking.query();

      // In case booking cannot be fetched, display an error to user.
      bookings.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Bokningstillfällen kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.bookings = bookings;

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

  .controller( 'BookingDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', 'Booking', 'API_IMG_PATH_URL', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, Booking, API_IMG_PATH_URL ) => {

    /* Init vars */
    const modalTemplateUrl = 'templates/modals/booking-delete.html';
    $scope.editMode = false;
    $scope.bookingBackup = {};
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;

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
    };

    const getBooking = function () {

      const booking = Booking.get(
        {
          bookingId: $stateParams.id
        }
      );

      // In case booking cannot be fetched, display an error to user.
      booking.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Bokningstillfälle kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.booking = booking;
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.startEditMode = function () {
      const $scope = this;

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.bookingBackup = angular.copy( $scope.booking );
    };

    $scope.endEditMode = function () {
      const $scope = this;

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {
      const $scope = this;

      $scope.isEditMode = false;
      $scope.booking = $scope.bookingBackup;
    };

    $scope.saveBooking = function() {

      const $scope = this;

      // Save booking
      Booking.save(
        {
          BookingId: $stateParams.bookingId,
          Name: $scope.booking.Name
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Bokningstillfället "' + $scope.booking.Name + '" sparades med ett lyckat resultat'
          };

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
              message: 'Bokningstillfället "' + $scope.booking.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };

            history.back();
          }
        });
    };

    $scope.deleteBooking = function() {

      // Delete booking
      Booking.delete(
        {
          bookingId: $stateParams.bookingId
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Bokningstillfället "' + $scope.booking.Name + '" raderades med ett lyckat resultat'
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
              message:    'Bokningstillfället kan inte raderas eftersom det finns' +
              ' en lokalbokning, resursbokning eller en måltidsbokning som refererar till bokningstillfället'
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
              message: 'Bokningstillfället "' + $scope.booking.Name + '" existerar inte längre. Hann kanske någon radera den?'
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
    $scope.booking = {};

    /* Private methods START */

    /* Private Methods END */

    /* Public Methods START */

    $scope.saveBooking = function() {

      const $scope = this;

      // Save booking
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
            message: 'Bokningstillfället "' + $scope.booking.Name + '" skapades med ett lyckat resultat'
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