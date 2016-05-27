'use strict';

angular.module( 'BookingSystem.locationBooking',

  // Dependencies
  [ 'ngMessages' ]
  )

  // Controller
  .controller( 'LocationBookingViewCtrl', [ '$rootScope', '$scope', '$state', 'LocationBooking', '$interval', 'DATA_SYNC_INTERVAL_TIME', '$ionicGesture', ( $rootScope, $scope, $state, LocationBooking, $interval, DATA_SYNC_INTERVAL_TIME, $ionicGesture ) => {

    /* Init vars */
    const updateIntervalTime = DATA_SYNC_INTERVAL_TIME;
    let updateInterval = null;
    $scope.weekDate = moment();
    $scope.zoom = 2;

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

    const startUpdateInterval = function (){

      updateInterval = $interval( () => {

        getLocationBookings();

      }, updateIntervalTime );

    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( '$ionicView.enter', ( event, data ) => {

      getLocationBookings();
      startUpdateInterval();
    });

    // Destroy the update interval when controller is destroyed (when we leave this view)
    $scope.$on( '$ionicView.leave', ( event ) => {

      // Cancel local update interval
      if ( updateInterval ) {
        $interval.cancel( updateInterval );
      }

      // Broadcast to children to cancel update intervals
      $scope.$broadcast( 'leaving-view' );
    });

    const element = angular.element( document.querySelector( '#booking-view-content' ) );

    $ionicGesture.on( 'pinch', ( e ) => {

      e.gesture.srcEvent.preventDefault();

      $scope.$apply( () => {

        $scope.zoom = e.gesture.scale;
      });

    }, element );

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
          message: 'Lokalbokning kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.locationBooking = locationBooking;
    };

    //

    const initDate = function() {

      // Initialize date if its not set in incoming state params.
      // It does not matter if its a normal date object or moment.js object. Make it a regular date object either way.
      // We need to make it to a regular date object since that's what angular material date picker requires.
      if ( $state.params.date ) {

        $scope.bookingStartDate = moment( $state.params.date ).toDate();
        $scope.bookingStartHour = moment( $state.params.date ).hour();
        $scope.bookingStartMinute = moment( $state.params.date ).minute();

        $scope.bookingEndDate = moment( $state.params.date ).toDate();
        $scope.bookingEndHour = moment( $state.params.date ).hour();
        $scope.bookingEndMinute = moment( $state.params.date ).add( 59, 'minutes' ).minute();

      } else {

        $scope.bookingStartDate = new Date();
        $scope.bookingStartHour = 8;
        $scope.bookingStartMinute = 0;

        $scope.bookingEndDate = new Date();
        $scope.bookingEndHour = 8;
        $scope.bookingEndMinute = 59;
      }
    };

    const areDateVariablesDefined = function() {
      return (
        typeof $scope.bookingStartDate !== 'undefined' &&
        typeof $scope.bookingStartHour !== 'undefined' &&
        typeof $scope.bookingStartMinute !== 'undefined' &&
        typeof $scope.bookingEndDate !== 'undefined' &&
        typeof $scope.bookingEndHour !== 'undefined' &&
        typeof $scope.bookingEndMinute !== 'undefined'
      );
    };

    const initTimeSelectData = function() {

      $scope.selectHours = BookingHelper.getHoursForSelect();
      $scope.selectMinutes = BookingHelper.getMinutesForSelect();};

    const getLocations = function() {

      $scope.locations = Location.query();

      if ( areDateVariablesDefined() ){

        const startMomentDate = addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute );
        const endMomentDate = addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute );

        Location.queryFreeForPeriod(
          {
            fromDate: startMomentDate.format( 'YYYY-MM-DD' ),
            fromTime: startMomentDate.format( 'HH:mm' ),
            toDate: endMomentDate.format( 'YYYY-MM-DD' ),
            toTime: endMomentDate.format( 'HH:mm' )
          }
        ).$promise

          // Success
          .then( ( response ) => {

            // Add free locations to scope
            $scope.locations = response;
          })

          // Could not get free locations
          .catch( ( response ) => {

            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när uppgifter om lediga lokaler skulle hämtas'
            };
          });
      }
    };

    const getCustomers = function(){

      $scope.customers = Customer.query();
    };

    const addTimeToDate = function( dateObj, hour, minute ) {

      return moment( dateObj )
        .hour( hour )
        .minute( minute );
    };

    const createBookingContainer = function () {

      // Create promise
      const deferred = $q.defer();

      BookingHelper.createBookingContainer( $scope.locationBooking )

        // If everything went ok
        .then( ( createdBooking ) => {

          // Make created booking accessible from other metods
          $scope.locationBooking.BookingId = createdBooking.BookingId;

          // Resolve promise
          deferred.resolve();

          // Something went wrong
        }).catch( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'error',
            message: 'Ett oväntat fel uppstod när bokningstillfället skulle sparas'
          };

          deferred.reject();
        });

      // Return promise
      return deferred.promise;
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

    //

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

      if ( !areDateVariablesDefined() ){
        return;
      }

      const startTimeToCompare = addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).toDate().getTime();

      const endTimeToCompare = addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).toDate().getTime();

      // If end date if before start date
      if (
        endTimeToCompare < startTimeToCompare
      ) {
        $scope.bookingEndDate = $scope.bookingStartDate;
        $scope.bookingEndHour = $scope.bookingStartHour;
        $scope.bookingEndMinute = $scope.bookingStartMinute + 15;
      }

      // Get free locations for this new time.
      getLocations();
    };

    $scope.saveLocationBooking = function(){

      const $scope = this;
      const deferred = $q.defer();
      const promise = deferred.promise;

      createBookingContainer()
        .then( () => {

          // Set a furnituring if if there is a furnituring at all.
          const furnituringId = ( $scope.locationBooking.SelectedFurnituring ? $scope.locationBooking.SelectedFurnituring.FurnituringId : null );

          // Save locationBooking
          LocationBooking.save(
            {
              BookingId: $scope.locationBooking.BookingId,
              LocationBookingId: 0,
              LocationId: $scope.locationBooking.LocationId,
              FurnituringId: furnituringId,
              StartTime: addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).format(), // moment( $scope.StartDate + ' ' + $scope.StartTime ).format(),
              EndTime: addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).format(), //moment( $scope.EndDate + ' ' + $scope.EndTime ).format(),
              NumberOfPeople: $scope.locationBooking.NumberOfPeople
            }
          ).$promise

            // If everything went ok
            .then( ( response ) => {

              $rootScope.FlashMessage = {
                type: 'success',
                message: 'Lokal/plats-bokningen skapades med ett lyckat resultat'
              };

              // Resolve promise
              deferred.resolve();

              // Something went wrong
            }).catch( ( response ) => {

              // If there there was a foreign key reference
              if ( response.status === 409 ){
                $rootScope.FlashMessage = {
                  type: 'error',
                  message: 'Lokalen är tyvärr redan bokad under vald tidsram.'
                };
              }

              // If there was a problem with the in-data
              else {
                $rootScope.FlashMessage = {
                  type: 'error',
                  message: 'Ett oväntat fel uppstod när lokal/plats-bokningen skulle sparas'
                };
              }
            });
        });

      return promise;
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();
    getLocationBooking();

    initDate();
    getLocations();
    getCustomers();
    initTimeSelectData();

    /* Initialization END */

  }]
  )

  .controller( 'LocationBookingCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'LocationBooking', 'Location', 'BookingHelper', 'LocationFurnituring', 'Customer', '$q', ( $rootScope, $stateParams, $scope, $state, LocationBooking, Location, BookingHelper, LocationFurnituring, Customer, $q ) => {

    /* Init vars */
    $scope.locationBooking = {
      Provisional: true,
      BookingTypeId: 1
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
        $scope.bookingEndHour = moment( $state.params.date ).hour();
        $scope.bookingEndMinute = moment( $state.params.date ).add( 59, 'minutes' ).minute();

      } else {

        $scope.bookingStartDate = new Date();
        $scope.bookingStartHour = 8;
        $scope.bookingStartMinute = 0;

        $scope.bookingEndDate = new Date();
        $scope.bookingEndHour = 8;
        $scope.bookingEndMinute = 59;
      }
    };

    const areDateVariablesDefined = function() {
      return (
        typeof $scope.bookingStartDate !== 'undefined' &&
        typeof $scope.bookingStartHour !== 'undefined' &&
        typeof $scope.bookingStartMinute !== 'undefined' &&
        typeof $scope.bookingEndDate !== 'undefined' &&
        typeof $scope.bookingEndHour !== 'undefined' &&
        typeof $scope.bookingEndMinute !== 'undefined'
      );
    };

    const initTimeSelectData = function() {

      $scope.selectHours = BookingHelper.getHoursForSelect();
      $scope.selectMinutes = BookingHelper.getMinutesForSelect();};

    const getLocations = function() {

      $scope.locations = Location.query();

      if ( areDateVariablesDefined() ){

        const startMomentDate = addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute );
        const endMomentDate = addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute );

        Location.queryFreeForPeriod(
          {
            fromDate: startMomentDate.format( 'YYYY-MM-DD' ),
            fromTime: startMomentDate.format( 'HH:mm' ),
            toDate: endMomentDate.format( 'YYYY-MM-DD' ),
            toTime: endMomentDate.format( 'HH:mm' )
          }
        ).$promise

          // Success
          .then( ( response ) => {

            // Add free locations to scope
            $scope.locations = response;
          })

          // Could not get free locations
          .catch( ( response ) => {

            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när uppgifter om lediga lokaler skulle hämtas'
            };
          });
      }
    };

    const getCustomers = function(){

      $scope.customers = Customer.query();
    };

    const addTimeToDate = function( dateObj, hour, minute ) {

      return moment( dateObj )
        .hour( hour )
        .minute( minute );
    };

    const createBookingContainer = function () {

      // Create promise
      const deferred = $q.defer();

      BookingHelper.createBookingContainer( $scope.locationBooking )

      // If everything went ok
      .then( ( createdBooking ) => {

        // Make created booking accessible from other metods
        $scope.locationBooking.BookingId = createdBooking.BookingId;

        // Resolve promise
        deferred.resolve();

        // Something went wrong
      }).catch( ( response ) => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Ett oväntat fel uppstod när bokningstillfället skulle sparas'
        };

        deferred.reject();
      });

      // Return promise
      return deferred.promise;
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

      if ( !areDateVariablesDefined() ){
        return;
      }

      const startTimeToCompare = addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).toDate().getTime();

      const endTimeToCompare = addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).toDate().getTime();

      // If end date if before start date
      if (
        endTimeToCompare < startTimeToCompare
      ) {
        $scope.bookingEndDate = $scope.bookingStartDate;
        $scope.bookingEndHour = $scope.bookingStartHour;
        $scope.bookingEndMinute = $scope.bookingStartMinute + 15;
      }

      // Get free locations for this new time.
      getLocations();
    };

    $scope.saveLocationBooking = function(){

      const $scope = this;
      const deferred = $q.defer();
      const promise = deferred.promise;

      createBookingContainer()
        .then( () => {

          // Set a furnituring if if there is a furnituring at all.
          const furnituringId = ( $scope.locationBooking.SelectedFurnituring ? $scope.locationBooking.SelectedFurnituring.FurnituringId : null );

          // Save locationBooking
          LocationBooking.save(
            {
              BookingId: $scope.locationBooking.BookingId,
              LocationBookingId: 0,
              LocationId: $scope.locationBooking.LocationId,
              FurnituringId: furnituringId,
              StartTime: addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).format(), // moment( $scope.StartDate + ' ' + $scope.StartTime ).format(),
              EndTime: addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).format(), //moment( $scope.EndDate + ' ' + $scope.EndTime ).format(),
              NumberOfPeople: $scope.locationBooking.NumberOfPeople
            }
            ).$promise

              // If everything went ok
              .then( ( response ) => {

                $rootScope.FlashMessage = {
                  type: 'success',
                  message: 'Lokal/plats-bokningen skapades med ett lyckat resultat'
                };

                // Resolve promise
                deferred.resolve();

                // Something went wrong
              }).catch( ( response ) => {

                // If there there was a foreign key reference
                if ( response.status === 409 ){
                  $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Lokalen är tyvärr redan bokad under vald tidsram.'
                  };
                }

                // If there was a problem with the in-data
                else {
                  $rootScope.FlashMessage = {
                    type: 'error',
                    message: 'Ett oväntat fel uppstod när lokal/plats-bokningen skulle sparas'
                  };
                }
              });
        });

      return promise;
    };

    /* Public Methods END */

    /* Initialization START */

    initDate();
    getLocations();
    getCustomers();
    initTimeSelectData();

    /* Initialization END */

  }]
);