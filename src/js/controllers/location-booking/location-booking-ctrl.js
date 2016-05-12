'use strict';

angular.module( 'BookingSystem.locationBooking',

  // Dependencies
  [ 'ngMessages' ]
  )

  // Controller
  .controller( 'LocationBookingViewCtrl', [ '$rootScope', '$scope', '$state', 'LocationBooking', ( $rootScope, $scope, $state, LocationBooking ) => {

    /* Init vars */
    $scope.weekDate = moment();

    /* Private methods START */

    const getLocationBookings = function () {

      const locationBookings = LocationBooking.query();

      // In case LocationBooking cannot be fetched, display an error to user.
      locationBookings.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Lokalbokningar kunde inte hämtas, var god försök igen.'
        };
      })

      .then( ( locationBookings ) => {
        $scope.locationBookings = locationBookings;
      });
    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */
    $scope.$on( '$ionicView.enter', ( event, data ) => {

      console.log( 'fetched new bookings' );

      getLocationBookings();
    });

    /* Initialization END */

  }]
)

  .controller( 'LocationBookingDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', 'LocationBooking', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, LocationBooking ) => {

    /* Init vars */

    const modalTemplateUrl = 'templates/modals/locationBooking-delete.html';
    $scope.editMode = false;
    $scope.locationBookingBackup = {};

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

    const getLocationBooking = function () {

      const locationBooking = LocationBooking.get(
        {
          locationBookingId: $stateParams.locationBookingId
        }
      );

      // In case locationBooking cannot be fetched, display an error to user.
      locationBooking.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Möblering kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.locationBooking = locationBooking;
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.startEditMode = function () {
      const $scope = this;

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.locationBookingBackup = angular.copy( $scope.locationBooking );
    };

    $scope.endEditMode = function () {
      const $scope = this;

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {
      const $scope = this;

      $scope.isEditMode = false;
      $scope.locationBooking = $scope.locationBookingBackup;
    };

    $scope.saveLocationBooking = function() {

      const $scope = this;

      // Save locationBooking
      LocationBooking.save(
        {
          LocationBookingId: $stateParams.locationBookingId,
          Name: $scope.locationBooking.Name
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Möbleringen "' + $scope.locationBooking.Name + '" sparades med ett lyckat resultat'
          };

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Det finns redan en möblering som heter "' + $scope.locationBooking.Name +
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
              message: 'Möbleringen "' + $scope.locationBooking.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };

            history.back();
          }
        });
    };

    $scope.deleteLocationBooking = function() {

      // Delete locationBooking
      LocationBooking.delete(
        {
          locationBookingId: $stateParams.locationBookingId
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Möbleringen "' + $scope.locationBooking.Name + '" raderades med ett lyckat resultat'
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
              message: 'Möbleringen "' + $scope.locationBooking.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };
          }

          history.back();
        });
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();
    getLocationBooking();

    /* Initialization END */

  }]
  )

  .controller( 'LocationBookingCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'LocationBooking', 'Location', 'BookingHelper', 'LocationFurnituring', 'Customer', ( $rootScope, $stateParams, $scope, $state, LocationBooking, Location, BookingHelper, LocationFurnituring, Customer ) => {

    /* Init vars */
    $scope.locationBooking = {
      Provisional: true
    };
    $scope.furnituring = [];

    /* Private methods START */

    const initDate = function() {

      // Initialize date if its not set in incoming state params.
      // It does not matter if its a normal date object or moment.js object. Make it a regular date object either way.
      // We need to make it to a regular date object since that's what angular material date picker requires.
      if ( $state.params.date ) {

        $scope.bookingStartDate = moment( $state.params.date ).toDate();
        $scope.bookingStartHour = moment( $state.params.date ).hour();
        $scope.bookingStartMinute = moment( $state.params.date ).minute();

        $scope.bookingEndDate = moment( $state.params.date ).toDate();
        $scope.bookingEndHour = moment( $state.params.date ).hour() + 1;
        $scope.bookingEndMinute = moment( $state.params.date ).minute();

      } else {

        $scope.bookingStartDate = new Date();
        $scope.bookingStartHour = 8;
        $scope.bookingStartMinute = 0;

        $scope.bookingEndDate = new Date();
        $scope.bookingEndHour = 9;
        $scope.bookingEndMinute = 0;
      }
    };

    const initTimeSelectData = function() {

      $scope.selectHours = BookingHelper.getHoursForSelect();
      $scope.selectMinutes = BookingHelper.getMinutesForSelect();};

    const getLocations = function() {

      $scope.locations = Location.query();
    };

    const getLocationFurniturings = function() {

      $scope.furniturings = LocationFurnituring.query();
    };

    const getCustomers = function(){

      $scope.customers = Customer.query();
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.updateFurniturings = function() {

      // Get all available furniturings for selected location
      if ( $scope.locationBooking.LocationId ){
        $scope.furniturings = LocationFurnituring.queryForLocation(
          {
            locationId: $scope.locationBooking.LocationId
          }
        );

        // If furniturings could not be fetched
        $scope.furniturings.$promise.catch( () => {
          $rootScope.FlashMessage = {
            type: 'error',
            message: 'Möbleringar för vald lokal kunde inte hämtas.'
          };
        })

        // If furniturings were fetch successfully
        .then( () => {
          // $scope.showInfoAboutNoFurniturings = !$scope.furniturings.length;
        });
      }
      else {
        $scope.furnituring = [];
      }
    };

    $scope.checkEndDate = function() {

      if (
        $scope.bookingEndDate !== undefined && $scope.bookingStartDate !== undefined &&
        $scope.bookingEndDate.getTime() < $scope.bookingStartDate.getTime()
      ) {

        $scope.bookingEndDate = $scope.bookingStartDate;
      }
    };

    $scope.saveLocationBooking = function() {

      const $scope = this;

      // Save locationBooking
      LocationBooking.save(
        {
          LocationBookingId: 0,
          Name: $scope.locationBooking.Name
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Möbleringen "' + $scope.locationBooking.Name + '" skapades med ett lyckat resultat'
          };

          history.back();

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Det finns redan en möblering som heter "' + $scope.locationBooking.Name +
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

    initDate();
    getLocations();
    getLocationFurniturings();
    getCustomers();
    initTimeSelectData();

    /* Initialization END */

  }]
);