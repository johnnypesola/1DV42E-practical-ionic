/**
 * Created by Johanna Larsson on 2016-04-25.
 */
'use strict';

angular.module( 'BookingSystem.bookingTypes',

  // Dependencies
  []
  )

  // List controller
  .controller( 'BookingTypesListCtrl', [ '$rootScope', '$scope', '$state', 'BookingType', '$mdToast', ( $rootScope, $scope, $state, BookingType, $mdToast ) => {

    /* Init vars */

    /* Private methods START */

    const getBookingTypes = function() {

      const bookingTypes = BookingType.query();

      // In case customers cannot be fetched, display an error to user.
      bookingTypes.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Bokningstyper kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
        );
      });

      $scope.bookingTypes = bookingTypes;
    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( '$ionicView.beforeEnter', ( event, data ) => {
      getBookingTypes();
    });

    /* Initialization END */

  }]
  )

  //Edit controller
  .controller( 'BookingTypeDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$ionicModal', '$state', 'BookingType', '$mdToast', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $ionicModal, $state, BookingType, $mdToast ) => {

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

        $mdToast.show( $mdToast.simple()
          .content( 'Bokningstypen kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
          .theme( 'error' )
        );
      });

      $scope.bookingType = bookingType;

    };

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

          $mdToast.show( $mdToast.simple()
            .content( 'Bokningstypen "' + $scope.bookingType.Name + '" sparades med ett lyckat resultat' )
            .position( 'top right' )
            .theme( 'success' )
          );

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Det finns redan en bokningstyp som heter "' + $scope.bookingType.Name +
                '". Två boknigstyper kan inte heta lika.' )
              .position( 'top right' )
              .theme( 'error' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när bokningstypen skulle sparas' )
              .position( 'top right' )
              .theme( 'error' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
              .content( 'Bokningstypen "' + $scope.bookingType.Name + '" existerar inte längre. Hann kanske någon radera den?' )
              .position( 'top right' )
              .theme( 'error' )
            );

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

          $mdToast.show( $mdToast.simple()
            .content( 'Bokningstypen "' + $scope.bookingType.Name + '" raderades med ett lyckat resultat' )
            .position( 'top right' )
            .theme( 'success' )
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
              .content( 'Bokningstypen kan inte raderas eftersom det finns' +
                ' en bokning som refererar till bokningstypen' )
              .position( 'top right' )
              .theme( 'error' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när bokningstypen skulle tas bort' )
              .position( 'top right' )
              .theme( 'error' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
              .content( 'Bokningstypen "' + $scope.bookingType.Name + '" existerar inte längre. Hann kanske någon radera den?' )
              .position( 'top right' )
              .theme( 'error' )
            );
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
  .controller( 'BookingTypeCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'BookingType', '$mdToast', ( $rootScope, $stateParams, $scope, $state, BookingType, $mdToast ) => {

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

          $mdToast.show( $mdToast.simple()
            .content( 'Bokningstypen "' + $scope.bookingType.Name + '" skapades med ett lyckat resultat' )
            .position( 'top right' )
            .theme( 'success' )
          );

          history.back();

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Det finns redan en bokningstyp som heter "' + $scope.bookingType.Name +
                '". Två bokningstyper kan inte heta lika.' )
              .position( 'top right' )
              .theme( 'error' )
            );
          }

          // If there was a problem with the in-data
          else {
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när bokningstypen skulle sparas' )
              .position( 'top right' )
              .theme( 'error' )
            );
          }
        });
    };

    /* Public Methods END */

    /* Initialization START */

    /* Initialization END */

  }]
  );
