/**
 * Created by Johanna Larsson on 2016-05-13.
 */
'use strict';

angular.module( 'BookingSystem.locations',

  // Dependencies
  [
    'uiGmapgoogle-maps' // Google maps API
  ]
  )

  // Config for module
  .config( ['$stateProvider', 'uiGmapGoogleMapApiProvider', ( $stateProvider, uiGmapGoogleMapApiProvider ) => {

    // Google maps API
    uiGmapGoogleMapApiProvider.configure({
      //    key: 'your api key',
      v: '3.17',
      libraries: 'weather,geometry,visualization',
      language: 'sv'
    });
  }]
  )

  // Controller
  .controller( 'LocationsListCtrl', [ '$rootScope', '$scope', '$state', '$mdToast', 'Location', 'API_IMG_PATH_URL', ( $rootScope, $scope, $state, $mdToast, Location, API_IMG_PATH_URL ) => {

    /* Init vars */
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;

    /* Private methods START */

    const getLocations = function () {

      const locations = Location.query();

      // In case locations cannot be fetched, display an error to user.
      locations.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Lokaler och platser kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
          .theme( 'warn' )
        );
      });

      $scope.locations = locations;

    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */
    $scope.$on( '$ionicView.beforeEnter', ( event, data ) => {

      getLocations();
    });

    /* Initialization END */

  }]
  )

  //Edit
  .controller( 'LocationDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', '$mdToast', 'Location', 'LocationImage', 'API_IMG_PATH_URL', 'DEFAULT_MAP_ZOOM', 'DEFAULT_LONGITUDE', 'DEFAULT_LATITUDE', 'LocationFurnituring', '$q', 'Furnituring', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, $mdToast, Location, LocationImage, API_IMG_PATH_URL, DEFAULT_MAP_ZOOM, DEFAULT_LONGITUDE, DEFAULT_LATITUDE, LocationFurnituring, $q, Furnituring ) => {

    /* Init vars */

    const selectLocationFurnituringModalTemplateUrl = 'templates/modals/select-location-furnituring.html';
    const deleteModalTemplateUrl = 'templates/modals/location-delete.html';
    const googleMapsTemplateUrl = 'templates/modals/google-maps.html';

    $scope.locationBackup = {};
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;
    $scope.markers = [];
    $scope.mapsWillRefresh = false;

    /* Private methods START */
    const setupDeleteModal = function(){

      const deferred = $q.defer();

      $ionicModal.fromTemplateUrl( deleteModalTemplateUrl, {
        scope: $scope,
        animation: MODAL_ANIMATION
      })
        .then( ( response ) => {

          $scope.deleteModal = response;

          deferred.resolve();
        });

      // Cleanup the modal when we're done with it!
      $scope.$on( '$destroy', () => {
        $scope.deleteModal.remove();
      });

      return deferred.promise;
    };

    const setupSelectLocationFurnituringModal = function(){

      const deferred = $q.defer();

      $ionicModal.fromTemplateUrl( selectLocationFurnituringModalTemplateUrl, {
        scope: $scope,
        animation: MODAL_ANIMATION
      })
        .then( ( response ) => {

          $scope.selectModal = response;

          deferred.resolve();
        });

      // Cleanup the modal when we're done with it!
      $scope.$on( '$destroy', () => {

        $scope.selectModal.remove();
      });

      return deferred.promise;
    };

    const setupGoogleMapsModal = function(){

      const deferred = $q.defer();

      $ionicModal.fromTemplateUrl( googleMapsTemplateUrl, {
        scope: $scope,
        animation: MODAL_ANIMATION
      })
        .then( ( response ) => {

          $scope.mapsModal = response;

          deferred.resolve();
        });

      // Cleanup the modal when we're done with it!
      $scope.$on( '$destroy', () => {
        $scope.mapsModal.remove();
      });

      return deferred.promise;
    };

    const uploadImage = function( LocationId ){

      return LocationImage.upload( $scope.location.ImageForUpload, LocationId );

    };

    const saveSuccess = function() {
      // Display success message
      $mdToast.show( $mdToast.simple()
          .content( 'Lokalen/Platsen "' + $scope.location.Name + '" sparades med ett lyckat resultat' )
          .position( 'top right' )
          .theme( 'success' )
      );

      // Redirect
      history.back();
    };

    const moveMarkerOnClick = function( map, eventName, args ) {

      if ( $scope.isEditMode ) {

        // Refresh location variables
        $scope.location.GPSLatitude = args[0].latLng.lat();
        $scope.location.GPSLongitude = args[0].latLng.lng();

        // Refresh map marker variables
        $scope.markers[0].coords = {
          latitude : args[0].latLng.lat(),
          longitude : args[0].latLng.lng()
        };

        $scope.$apply();
      }
    };

    const initMapVariables = function() {

      $scope.map = {
        center: {
          latitude: DEFAULT_LATITUDE,
          longitude: DEFAULT_LONGITUDE
        },
        zoom: DEFAULT_MAP_ZOOM,
        bounds: {},
        events: {
          click: function ( map, eventName, args ) {

            // Only do stuff if we are in edit mode
            moveMarkerOnClick( map, eventName, args );
          }
        }
      };
    };

    // Convert markers from data fetched from backend to match google maps format.
    const convertMarkers = function() {

      $scope.markers[0] =
      {
        id: $scope.location.LocationId,
        coords: {
          latitude: $scope.location.GPSLatitude,
          longitude: $scope.location.GPSLongitude
        }
      };
    };

    const getAllFurniturings = function() {
      $scope.furniturings = Furnituring.query();

      return $scope.furniturings.$promise;
    };

    const processFurniturings = function() {

      // Loop for all furniturings
      $scope.furniturings.forEach( ( furnituring ) => {

        // Loop for furniturings accociated with location
        $scope.location.furniturings.forEach( ( locationHasThisFurnituring ) => {

          // If location has this furnituring.
          if ( furnituring.FurnituringId === locationHasThisFurnituring.FurnituringId ){

            // Mark furnituring as selected
            furnituring.isSelected = true;

            // Defines default max number of people for furnituring if not defined or if its higher than max value for location
            if ( !furnituring.MaxPeople || furnituring.MaxPeople > $scope.location.MaxPeople ){

              furnituring.MaxPeople = locationHasThisFurnituring.MaxPeople || $scope.location.MaxPeople;
            }
          }
        });
      });
    };

    const getFurnituringsForLocation = function() {

      $scope.location.furniturings = LocationFurnituring.queryForLocation(
        {
          locationId: $stateParams.locationId
        });

      return $scope.location.furniturings.$promise;
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
            .theme( 'warn' )
        );
      });

      $scope.location = location;

      return location.$promise;
    };

    const isMaxPeopleForLocationFurnituringsMissing = function() {

      let isMissing = false;
      const newFurnituringsArray = [];

      $scope.location.furniturings.forEach( ( furnituring ) => {

        // Check if there are any elements where max people property is missing or where its value is undefined/null.
        if ( !( 'MaxPeople' in furnituring ) || furnituring.MaxPeople === undefined || furnituring.MaxPeople === null ) {

          isMissing = true;
        } else {

          newFurnituringsArray.push( furnituring );
        }
      });

      if ( isMissing ) {

        // Missing values detected. Overwrite location furniturings array with safe array elements.
        $scope.location.furniturings = newFurnituringsArray;
      }

      return isMissing;
    };

    const filterSelectedFurnituringForLocation = function() {

      // Filter out furniturings that are not selected.
      const newFurnituringsArray = [];

      $scope.furniturings.forEach( ( furnituring ) => {

        if ( furnituring.isSelected ) {
          newFurnituringsArray.push({
            LocationId: $stateParams.locationId,
            FurnituringId: furnituring.FurnituringId,
            MaxPeople: furnituring.MaxPeople,
            FurnituringName: furnituring.Name
          });
        }
      });

      $scope.location.furniturings = newFurnituringsArray;
    };

    const removeOldFurnituringsForLocation = function() {

      return LocationFurnituring.removeForLocation({
        locationId: $stateParams.locationId
      }).$promise;
    };

    const saveFurnituringsForLocation = function() {

      const deferred = $q.defer();
      const postDataArray = [];

      removeOldFurnituringsForLocation()
        .finally( () => {

          $scope.location.furniturings.forEach( ( furnituring ) => {

            postDataArray.push({
              LocationId: $stateParams.locationId,
              FurnituringId: furnituring.FurnituringId,
              MaxPeople: furnituring.MaxPeople
            });
          });

          LocationFurnituring.saveForLocation( postDataArray ).$promise
            .then( () => {

              // Resolve promise
              deferred.resolve();
            });
        });

      return deferred.promise;
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.showSelectModal = function() {

      processFurniturings();

      // Show modal
      $scope.selectModal.show();
    };

    $scope.startEditMode = function () {

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.locationBackup = angular.copy( $scope.location );
    };

    $scope.endEditMode = function () {

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {

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
          GPSLatitude: $scope.location.GPSLatitude,
          GPSLongitude: $scope.location.GPSLongitude,
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
                    .theme( 'warn' )
                );
              });
          }

          saveFurnituringsForLocation()
            .then( () => {

              saveSuccess();

            }).catch( () => {

              $mdToast.show( $mdToast.simple()
                  .content( 'Uppgifter om lokalen sparades, men lokalens möbleringar kunde inte sparas. Var god försök igen.' )
                  .position( 'top right' )
                  .theme( 'warn' )
              );
            });

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Det finns redan en lokal/plats som heter "' + $scope.location.Name +
                '". Två lokaler eller platser kan inte heta lika.' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när lokalen/platsen skulle sparas' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
                .content( 'Lokalen/platsen "' + $scope.location.Name + '" existerar inte längre. Hann kanske någon radera den?' )
                .position( 'top right' )
                .theme( 'warn' )
            );

            history.back();
          }
        });
    };

    $scope.showMapsModal = function() {

      $scope.mapsModal.show()
        .then( () => {

          if ( $scope.location.GPSLatitude !== 0 && $scope.location.GPSLongitude !== 0 ) {

            $scope.map.center = {
              latitude: $scope.location.GPSLatitude,
              longitude: $scope.location.GPSLongitude
            };

            $scope.map.zoom = 15;
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
                .content( 'Lokalen/platsen kan inte raderas eftersom det finns' +
                ' en bokning eller en lokalmöblering som refererar till lokalen/platsen' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när lokalen/platsen skulle tas bort' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
                .content( 'Lokalen/platsen "' + $scope.location.Name + '" existerar inte längre. Hann kanske någon radera den?' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          history.back();
        });
    };

    /* Public Methods END */

    /* Initialization START */

    setupDeleteModal()
      .then( () => {
        return setupSelectLocationFurnituringModal();
      })
      .then( () => {
        return setupGoogleMapsModal();
      })
      .then( () => {
        return getLocation();
      })
      .then( () => {
        return getAllFurniturings();
      })
      .then( () => {
        return getFurnituringsForLocation();
      });

    initMapVariables();

    // Add watch on $scope.map.bounds to check (every time it changes) if return boundary data is received from google maps
    $scope.$watch(

      // Get $scope.map.bounds on change
      () => {
        return $scope.map.bounds;
      },

      // Do the following on change
      ( nv, ov ) => {

        // Only need to regenerate once
        if ( !ov.southwest && nv.southwest ) {

          convertMarkers();
        }
      },
      true
    );

    // Watch locations max people count for changes, decrease the furniturings max people count if needed.
    $scope.$watch( 'location.MaxPeople', ( newValue ) => {

      if ( $scope.location && $scope.location.furniturings ) {

        $scope.location.furniturings.forEach( ( furnituring ) => {

          // If furnituring max people exceeds location limit, or if its undefined.
          if ( furnituring.MaxPeople > $scope.location.MaxPeople || furnituring.MaxPeople === undefined ) {

            // Lower the furniturings max people count to locations max people count.
            furnituring.MaxPeople = $scope.location.MaxPeople;
          }
        });
      }
    });

    // Execute action on hide modal
    $scope.$on( 'modal.hidden', () => {

      filterSelectedFurnituringForLocation();

      if ( isMaxPeopleForLocationFurnituringsMissing() ){

        $mdToast.show( $mdToast.simple()
            .content( 'Uppgifter om max antal personer var ogiltig för en eller flera möbleringar. Var god försök igen.' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      }
    });

    /* Initialization END */

  }]
  )

  //Create
  .controller( 'LocationCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', '$mdToast', 'Location', 'LocationImage', 'DEFAULT_LATITUDE', 'DEFAULT_LONGITUDE', 'DEFAULT_MAP_ZOOM', '$ionicModal', 'MODAL_ANIMATION', 'Furnituring', 'LocationFurnituring', '$q', ( $rootScope, $stateParams, $scope, $state, $mdToast, Location, LocationImage, DEFAULT_LATITUDE, DEFAULT_LONGITUDE, DEFAULT_MAP_ZOOM, $ionicModal, MODAL_ANIMATION, Furnituring, LocationFurnituring, $q ) => {

    /* Init vars */
    $scope.location = {
      GPSLatitude: 0,
      GPSLongitude: 0
    };
    $scope.markers = [];

    const selectLocationFurnituringModalTemplateUrl = 'templates/modals/select-location-furnituring.html';
    const googleMapsTemplateUrl = 'templates/modals/google-maps.html';

    /* Private methods START */

    const setupSelectLocationFurnituringModal = function(){

      const deferred = $q.defer();

      $ionicModal.fromTemplateUrl( selectLocationFurnituringModalTemplateUrl, {
        scope: $scope,
        animation: MODAL_ANIMATION
      })
        .then( ( response ) => {

          $scope.selectModal = response;

          deferred.resolve();
        });

      // Cleanup the modal when we're done with it!
      $scope.$on( '$destroy', () => {

        $scope.selectModal.remove();
      });

      return deferred.promise;
    };

    const uploadImage = function( LocationId ){

      return LocationImage.upload( $scope.location.ImageForUpload, LocationId );

    };

    const saveSuccess = function() {
      // Display success message
      $mdToast.show( $mdToast.simple()
        .content( 'Lokalen/Platsen "' + $scope.location.Name + '" sparades med ett lyckat resultat' )
        .position( 'top right' )
        .theme( 'success' )
      );

      // Redirect
      history.back();
    };

    const setupGoogleMapsModal = function(){

      $ionicModal.fromTemplateUrl( googleMapsTemplateUrl, {
        scope: $scope,
        animation: MODAL_ANIMATION
      })
        .then( ( response ) => {

          $scope.mapsModal = response;
        });

      // Cleanup the modal when we're done with it!
      $scope.$on( '$destroy', () => {
        $scope.mapsModal.remove();
      });
    };

    const moveMarkerOnClick = function( map, eventName, args ) {

      // Refresh location variables
      $scope.location.GPSLatitude = args[0].latLng.lat();
      $scope.location.GPSLongitude = args[0].latLng.lng();

      // Refresh map marker variables
      $scope.markers[0].coords = {
        latitude : args[0].latLng.lat(),
        longitude : args[0].latLng.lng()
      };

      $scope.$apply();
    };

    const initMapVariables = function() {

      $scope.map = {
        center: {
          latitude: DEFAULT_LATITUDE,
          longitude: DEFAULT_LONGITUDE
        },
        zoom: DEFAULT_MAP_ZOOM,
        bounds: {},
        // options: { mapTypeId: google.maps.MapTypeId.SATELLITE }, // Make satellite view default
        events: {
          click: function ( map, eventName, args ) {

            // Only do stuff if we are in edit mode
            moveMarkerOnClick( map, eventName, args );
          }
        }
      };
    };

    const filterSelectedFurnituringForLocation = function() {

      // Filter out furniturings that are not selected.
      const newFurnituringsArray = [];

      $scope.furniturings.forEach( ( furnituring ) => {

        if ( furnituring.isSelected ) {
          newFurnituringsArray.push({
            LocationId: $stateParams.locationId,
            FurnituringId: furnituring.FurnituringId,
            MaxPeople: furnituring.MaxPeople,
            FurnituringName: furnituring.Name
          });
        }
      });

      $scope.location.furniturings = newFurnituringsArray;
    };

    const isMaxPeopleForLocationFurnituringsMissing = function() {

      let isMissing = false;
      const newFurnituringsArray = [];

      $scope.location.furniturings.forEach( ( furnituring ) => {

        // Check if there are any elements where max people property is missing or where its value is undefined/null.
        if ( !( 'MaxPeople' in furnituring ) || furnituring.MaxPeople === undefined || furnituring.MaxPeople === null ) {

          isMissing = true;
        } else {

          newFurnituringsArray.push( furnituring );
        }
      });

      if ( isMissing ) {

        // Missing values detected. Overwrite location furniturings array with safe array elements.
        $scope.location.furniturings = newFurnituringsArray;
      }

      return isMissing;
    };

    // Convert markers from data fetched from backend to match google maps format.
    const initMarkers = function() {

      $scope.markers[0] =
      {
        id: 0,
        coords: {
          latitude: $scope.location.GPSLatitude,
          longitude: $scope.location.GPSLongitude
        }
      };

      // Make sure that there is valid GPS values, then we apply specific marker settings
      if (
        $scope.location.GPSLatitude !== 0 &&
        $scope.location.GPSLongitude !== 0
      )
      {
        $scope.map.center = {
          latitude: $scope.location.GPSLatitude + latitudeOffset,
          longitude: $scope.location.GPSLongitude + longitudeOffset
        };
        $scope.map.zoom = 17;
      }

    };

    const getAllFurniturings = function() {
      $scope.furniturings = Furnituring.query();

      return $scope.furniturings.$promise;
    };

    const saveFurnituringsForLocation = function( locationId ) {

      const deferred = $q.defer();
      const postDataArray = [];

      $scope.location.furniturings.forEach( ( furnituring ) => {

        postDataArray.push({
          LocationId: locationId,
          FurnituringId: furnituring.FurnituringId,
          MaxPeople: furnituring.MaxPeople
        });
      });

      LocationFurnituring.saveForLocation( postDataArray ).$promise
        .then( () => {

          // Resolve promise
          deferred.resolve();
        });

      return deferred.promise;
    };

    const processFurniturings = function() {

      $scope.furniturings.forEach( ( furnituring ) => {

        // Defines default max number of people for furnituring if not defined.
        if ( !furnituring.MaxPeople ){
          furnituring.MaxPeople = $scope.location.MaxPeople;
        }
      });
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.showSelectModal = function() {

      processFurniturings();

      // Show modal
      $scope.selectModal.show();
    };

    $scope.saveLocation = function() {

      const $scope = this;

      // Save location
      Location.save(
        {
          LocationId: 0,
          Name: $scope.location.Name,
          MaxPeople: $scope.location.MaxPeople,
          ImageSrc: $scope.location.ImageSrc,
          GPSLatitude: $scope.location.GPSLatitude,
          GPSLongitude: $scope.location.GPSLongitude,
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
                  .theme( 'warn' )
                );
              });
          }

          saveFurnituringsForLocation( response.LocationId )
            .then( () => {

              saveSuccess();

            }).catch( () => {

              $mdToast.show( $mdToast.simple()
                  .content( 'Uppgifter om lokalen sparades, men lokalens möbleringar kunde inte sparas. Var god försök igen.' )
                  .position( 'top right' )
                  .theme( 'warn' )
              );
            });

        // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Det finns redan en lokal eller plats som heter "' + $scope.location.Name +
                '". Två lokaler/platser kan inte heta lika.' )
              .position( 'top right' )
              .theme( 'warn' )
            );
          }

          // If there was a problem with the in-data
          else {
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när lokalen/platsen skulle sparas' )
              .position( 'top right' )
              .theme( 'warn' )
            );
          }
        });
    };

    /* Public Methods END */

    /* Initialization START */

    setupSelectLocationFurnituringModal()
      .then( () => {
        return setupGoogleMapsModal();
      })
      .then( () => {
        return getAllFurniturings();
      });

    initMapVariables();

    // Add watch on $scope.map.bounds to check (every time it changes) if return boundary data is received from google maps
    $scope.$watch(

      // Get $scope.map.bounds on change
      () => {return $scope.map.bounds;},

      // Do the following on change
      ( nv, ov ) => {

        // Only need to regenerate once
        if ( !ov.southwest && nv.southwest ) {

          initMarkers();
        }
      },
      true
    );

    // Watch locations max people count for changes, decrease the furniturings max people count if needed.
    $scope.$watch( 'location.MaxPeople', ( newValue ) => {

      if ( $scope.location && $scope.location.furniturings ) {

        $scope.location.furniturings.forEach( ( furnituring ) => {

          // If furnituring max people exceeds location limit, or if its undefined.
          if ( furnituring.MaxPeople > $scope.location.MaxPeople || furnituring.MaxPeople === undefined ) {

            // Lower the furniturings max people count to locations max people count.
            furnituring.MaxPeople = $scope.location.MaxPeople;
          }
        });
      }
    });

    // Execute action on hide modal
    $scope.$on( 'modal.hidden', () => {

      filterSelectedFurnituringForLocation();

      if ( isMaxPeopleForLocationFurnituringsMissing() ){

        $mdToast.show( $mdToast.simple()
            .content( 'Uppgifter om max antal personer var ogiltig för en eller flera möbleringar. Var god försök igen.' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      }
    });

    /* Initialization END */

  }]
  );