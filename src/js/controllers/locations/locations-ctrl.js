/**
 * Created by Johanna Larsson on 2016-05-13.
 */
'use strict';

angular.module( 'BookingSystem.locations',

  // Dependencies
  []
  )

  // Controller
  .controller( 'LocationsListCtrl', [ '$rootScope', '$scope', '$state', 'Location', ( $rootScope, $scope, $state, Location ) => {

    /* Init vars */

    /* Private methods START */

    const getLocations = function () {

      const locations = Location.query();

      // In case locations cannot be fetched, display an error to user.
      locations.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Lokaler och platser kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.locations = locations;

    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */
    $scope.$on( '$ionicView.enter', ( event, data ) => {
      getLocations();
    });

    /* Initialization END */

  }]
  )

  .controller( 'LocationDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', 'Location', 'LocationImage', 'API_IMG_PATH_URL', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, Location, LocationImage, API_IMG_PATH_URL ) => {

    /* Init vars */

    const modalTemplateUrl = 'templates/modals/location-delete.html';
    $scope.editMode = false;
    $scope.locationBackup = {};
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

    const uploadImage = function( LocationId ){

      return LocationImage.upload( $scope.location.ImageForUpload, LocationId );

    };

    const saveSuccess = function() {
      // Display success message
      $rootScope.FlashMessage = {
        type: 'success',
        message: 'Lokalen/Platsen "' + $scope.location.Name + '" sparades med ett lyckat resultat'
      };

      // Redirect
      history.back();
    };

    const getLocation = function () {

      const location = Location.get(
        {
          locationId: $stateParams.locationId
        }
      );

      // In case location cannot be fetched, display an error to user.
      location.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Lokal/plats kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.location = location;
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.startEditMode = function () {
      const $scope = this;

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.locationBackup = angular.copy( $scope.location );
    };

    $scope.endEditMode = function () {
      const $scope = this;

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {
      const $scope = this;

      $scope.isEditMode = false;
      $scope.location = $scope.locationBackup;
    };

    $scope.saveLocation = function() {

      const $scope = this;

      // Save location
      Location.save(
        {
          LocationId: $stateParams.locationId,
          Name: $scope.location.Name,
          MaxPeople: $scope.location.MaxPeople,
          ImageSrc: $scope.location.ImageSrc,
          BookingPricePerHour: $scope.location.BookingPricePerHour,
          MinutesMarginBeforeBooking: $scope.location.MinutesMarginBeforeBooking,
          MinutesMarginAfterBooking: $scope.location.MinutesMarginAfterBooking
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();

          // Upload image
          if ( typeof $scope.location.ImageForUpload !== 'undefined' ){

            uploadImage( response.LocationId )

            // Image upload successful
              .success( () => {
                saveSuccess();
              })
              // Image upload failed
              .error( () => {

                $rootScope.FlashMessage = {
                  type: 'error',
                  message: 'Lokalen/Platsen sparades, men det gick inte att ladda upp och spara den önskade bilden.'
                };
              });
          }
          else {

            saveSuccess();
          }

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Det finns redan en lokal/plats som heter "' + $scope.location.Name +
              '". Två lokaler eller platser kan inte heta lika.'
            };
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när lokalen/platsen skulle sparas'
            };
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Lokalen/platsen "' + $scope.furnituring.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };

            history.back();
          }
        });
    };

    $scope.deleteLocation = function() {

      // Delete location
      Location.delete(
        {
          locationId: $stateParams.locationId
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Lokalen/platsen "' + $scope.location.Name + '" raderades med ett lyckat resultat'
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
              message:    'Lokalen/platsen kan inte raderas eftersom det finns' +
              ' en bokning eller en lokalmöblering som refererar till lokalen/platsen'
            };
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när lokalen/platsen skulle tas bort'
            };
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Lokalen/platsen "' + $scope.furnituring.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };
          }

          history.back();
        });
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();
    getLocation();

    /* Initialization END */

  }]
  )

  .controller( 'LocationCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'Location', ( $rootScope, $stateParams, $scope, $state, Location ) => {

    /* Init vars */
    $scope.location = {};

    /* Private methods START */

    /* Private Methods END */

    /* Public Methods START */

    $scope.saveLocation = function() {

      const $scope = this;
      console.log( $scope.location );

      // Save furnituring
      Location.save(
        {
          LocationId: 0,
          Name: $scope.location.Name,
          MaxPeople: Number( $scope.location.MaxPeople ),
          ImageSrc: $scope.location.ImageSrc,
          BookingPricePerHour: Number( $scope.location.BookingPricePerHour ),
          MinutesMarginBeforeBooking: Number( $scope.location.MinutesMarginBeforeBooking ),
          MinutesMarginAfterBooking: Number( $scope.location.MinutesMarginAfterBooking )
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Lokalen/platsen "' + $scope.location.Name + '" skapades med ett lyckat resultat'
          };

          history.back();

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Det finns redan en lokal eller plats som heter "' + $scope.location.Name +
              '". Två lokaler/platser kan inte heta lika.'
            };
          }

          // If there was a problem with the in-data
          else {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när lokalen/platsen skulle sparas'
            };
          }
        });
    };

    /* Public Methods END */

    /* Initialization START */

    /* Initialization END */

  }]
  );