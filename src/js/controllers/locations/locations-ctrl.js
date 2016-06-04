/**
 * Created by Johanna Larsson on 2016-05-13.
 */
'use strict';

angular.module( 'BookingSystem.locations',

  // Dependencies
  []
  )

  // Controller
  .controller( 'LocationsListCtrl', [ '$rootScope', '$scope', '$state', '$mdToast', 'Location', ( $rootScope, $scope, $state, $mdToast, Location ) => {

    /* Init vars */

    /* Private methods START */

    const getLocations = function () {

      const locations = Location.query();

      // In case locations cannot be fetched, display an error to user.
      locations.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Lokaler och platser kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
        );
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

  //Edit
  .controller( 'LocationDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', '$mdToast', 'Location', 'LocationImage', 'API_IMG_PATH_URL', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, $mdToast, Location, LocationImage, API_IMG_PATH_URL ) => {

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
      $mdToast.show( $mdToast.simple()
        .content( 'Lokalen/Platsen "' + $scope.location.Name + '" sparades med ett lyckat resultat' )
        .position( 'top right' )
      );

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

        $mdToast.show( $mdToast.simple()
          .content( 'Lokal/plats kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
        );
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

                $mdToast.show( $mdToast.simple()
                  .content( 'Lokalen/Platsen sparades, men det gick inte att ladda upp och spara den önskade bilden.' )
                  .position( 'top right' )
                );
              });
          }
          else {

            saveSuccess();
          }

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Det finns redan en lokal/plats som heter "' + $scope.location.Name +
                '". Två lokaler eller platser kan inte heta lika.' )
              .position( 'top right' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när lokalen/platsen skulle sparas' )
              .position( 'top right' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
              .content( 'Lokalen/platsen "' + $scope.location.Name + '" existerar inte längre. Hann kanske någon radera den?' )
              .position( 'top right' )
            );

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

          $mdToast.show( $mdToast.simple()
            .content( 'Lokalen/platsen "' + $scope.location.Name + '" raderades med ett lyckat resultat' )
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
              .content( 'Lokalen/platsen kan inte raderas eftersom det finns' +
                ' en bokning eller en lokalmöblering som refererar till lokalen/platsen' )
              .position( 'top right' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när lokalen/platsen skulle tas bort' )
              .position( 'top right' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
              .content( 'Lokalen/platsen "' + $scope.location.Name + '" existerar inte längre. Hann kanske någon radera den?' )
              .position( 'top right' )
            );
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

  //Create
  .controller( 'LocationCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', '$mdToast', 'Location', 'LocationImage', ( $rootScope, $stateParams, $scope, $state, $mdToast, Location, LocationImage ) => {

    /* Init vars */
    $scope.location = {};

    /* Private methods START */

    const uploadImage = function( LocationId ){

      return LocationImage.upload( $scope.location.ImageForUpload, LocationId );

    };

    const saveSuccess = function() {
      // Display success message
      $mdToast.show( $mdToast.simple()
        .content( 'Lokalen/Platsen "' + $scope.location.Name + '" sparades med ett lyckat resultat' )
        .position( 'top right' )
      );

      // Redirect
      history.back();
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.saveLocation = function() {

      const $scope = this;

      // Save location
      Location.save(
        {
          LocationId: 0,
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

          // Upload image
          if ( typeof $scope.location.ImageForUpload !== 'undefined' ){

            uploadImage( response.LocationId )

            // Image upload successful
              .success( () => {
                saveSuccess();
              })
              // Image upload failed
              .error( () => {

                $mdToast.show( $mdToast.simple()
                  .content( 'Lokalen/Platsen sparades, men det gick inte att ladda upp och spara den önskade bilden.' )
                  .position( 'top right' )
                );
              });
          }
          else {

            saveSuccess();
          }

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Det finns redan en lokal eller plats som heter "' + $scope.location.Name +
                '". Två lokaler/platser kan inte heta lika.' )
              .position( 'top right' )
            );
          }

          // If there was a problem with the in-data
          else {
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när lokalen/platsen skulle sparas' )
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