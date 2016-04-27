/**
 * Created by Johanna Larsson on 2016-04-25.
 */
'use strict';

angular.module( 'BookingSystem.bookingTypes',

  // Dependencies
  []
  )

  // List controller
  .controller( 'BookingTypesListCtrl', [ '$rootScope', '$scope', '$state', 'BookingType', ( $rootScope, $scope, $state, BookingType ) => {

    /* Init vars */

    /* Private methods START */

    const getBookingTypes = function() {

      const bookingTypes = BookingType.query();

      // In case customers cannot be fetched, display an error to user.
      bookingTypes.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Bokningstyper kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.bookingTypes = bookingTypes;
    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( '$ionicView.enter', ( event, data ) => {
      getBookingTypes();
    });

    /* Initialization END */

  }]
  )

  //Edit controller
  .controller( 'BookingTypeDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$ionicModal', '$state', 'BookingType', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $ionicModal, $state, BookingType ) => {

    /* Init vars */

    const modalTemplateUrl = 'templates/modals/bookingtypes-delete.html';
    $scope.isEditMode = false;
    $scope.bookingTypeBackup = {};

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

    const getBookingType = function () {

      const bookingType = BookingType.get(
        {
          bookingTypeId: $stateParams.bookingTypeId
        }
      );

      // In case bookingtype cannot be fetched, display an error to user.
      bookingType.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Bokningstypen kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.bookingType = bookingType;

    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.toggleHasLocation = function () {
      const $scope = this;
      console.log( $scope.bookingType.HasLocation );

      if ( $scope.bookingType.HasLocation === true ) {
        $scope.bookingType.HasLocation = false;
      }
      else {
        $scope.bookingType.HasLocation = true;
      }
    };

    $scope.startEditMode = function () {
      const $scope = this;

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.bookingTypeBackup = angular.copy( $scope.bookingType );
    };

    $scope.endEditMode = function () {
      const $scope = this;

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {
      const $scope = this;

      $scope.isEditMode = false;
      $scope.bookingType = $scope.bookingTypeBackup;
    };

    $scope.saveBookingType = function() {

      const $scope = this;

      // Save bookingtype
      BookingType.save(
        {
          BookingTypeId: $stateParams.bookingTypeId,
          Name: $scope.bookingType.Name
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Bokningstypen "' + $scope.bookingType.Name + '" sparades med ett lyckat resultat'
          };

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Det finns redan en bokningstyp som heter "' + $scope.bookingType.Name +
              '". Två boknigstyper kan inte heta lika.'
            };
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när bokningstypen skulle sparas'
            };
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Bokningstypen "' + $scope.bookingType.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };

            history.back();
          }
        });
    };

    $scope.deleteBookingType = function() {

      // Delete bookingtype
      BookingType.delete(
        {
          bookingTypeId: $stateParams.bookingTypeId
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Bokningstypen "' + $scope.bookingType.Name + '" raderades med ett lyckat resultat'
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
              message:    'Bokningstypen kan inte raderas eftersom det finns' +
              ' en bokning som refererar till bokningstypen'
            };
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när bokningstypen skulle tas bort'
            };
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Bokningstypen "' + $scope.bookingType.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };
          }

          history.back();
        });
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();
    getBookingType();

    /* Initialization END */
  }]
  )

  //Create controller
  .controller( 'BookingTypeCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'BookingType', ( $rootScope, $stateParams, $scope, $state, BookingType ) => {

    /* Init vars */
    $scope.bookingType = {};
    $scope.bookingType.HasLocation = false;

    /* Private methods START */

    /* Private Methods END */

    /* Public Methods START */

    $scope.toggleHasLocation = function () {
      const $scope = this;

      if ( $scope.bookingType.HasLocation === true ) {
        $scope.bookingType.HasLocation = false;
      }
      else {
        $scope.bookingType.HasLocation = true;
      }
    };

    $scope.saveBookingType = function() {

      const $scope = this;

      // Save bookingtype
      BookingType.save(
        {
          BookingTypeId: 0,
          Name: $scope.bookingType.Name,
          HasLocation: $scope.bookingType.HasLocation,
          MinutesMarginBeforeBooking: $scope.bookingType.MinutesMarginBeforeBooking,
          MinutesMarginAfterBooking: $scope.bookingType.MinutesMarginAfterBooking
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Bokningstypen "' + $scope.bookingType.Name + '" skapades med ett lyckat resultat'
          };

          history.back();

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Det finns redan en bokningstyp som heter "' + $scope.bookingType.Name +
              '". Två bokningstyper kan inte heta lika.'
            };
          }

          // If there was a problem with the in-data
          else {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när bokningstypen skulle sparas'
            };
          }
        });
    };

    /* Public Methods END */

    /* Initialization START */

    /* Initialization END */

  }]
  );