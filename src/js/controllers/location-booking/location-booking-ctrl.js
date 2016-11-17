'use strict';

angular.module( 'BookingSystem.locationBooking',

  // Dependencies
  [ 'ngMessages' ]
  )

  // Controller
  .controller( 'LocationBookingViewCtrl', [ '$rootScope', '$scope', '$state', 'LocationBooking', '$interval', 'DATA_SYNC_INTERVAL_TIME', '$ionicGesture', '$mdToast', 'DEFAULT_CALENDAR_ZOOM', ( $rootScope, $scope, $state, LocationBooking, $interval, DATA_SYNC_INTERVAL_TIME, $ionicGesture, $mdToast, DEFAULT_CALENDAR_ZOOM ) => {

    /* Init vars */
    const updateIntervalTime = DATA_SYNC_INTERVAL_TIME;
    let updateInterval = null, weekStartDate = null, weekEndDate = null;
    $scope.zoom = DEFAULT_CALENDAR_ZOOM;
    $scope.weekDate = moment();

    /* Private methods START */

    const setupWeekStartAndEndDates = function ( offset = 0, timeType = 'weeks' ) {

      // Add or subtract offset weeks from current weekdate object.
      if ( offset > 0 ) {
        $scope.weekDate = moment( $scope.weekDate ).add( offset, timeType );
      } else if ( offset < 0 ) {
        $scope.weekDate = moment( $scope.weekDate ).subtract( Math.abs( offset ), timeType );
      }

      weekStartDate = moment( $scope.weekDate ).startOf( 'week' );
      weekEndDate = moment( $scope.weekDate ).endOf( 'week' );
    };

    const getLocationBookings = function () {

      const locationBookings = LocationBooking.queryLessForPeriod({

        fromDate: weekStartDate.format( 'YYYY-MM-DD' ),
        toDate: weekEndDate.format( 'YYYY-MM-DD' )
      });

      // In case LocationBooking cannot be fetched, display an error to user.
      locationBookings.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Lokalbokningar kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
          .theme( 'warn' )
        );
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

    const setupGestures = function() {

      const element = angular.element( document.querySelector( '#booking-view-content' ) );

      $ionicGesture.on( 'pinch', ( e ) => {

        e.gesture.srcEvent.preventDefault();

        $scope.$apply( () => {

          // Change zoom value after pinch value.
          $scope.zoom = e.gesture.scale;
        });

      }, element );

      $ionicGesture.on( 'swipeleft', ( e ) => {

        $scope.toNextWeek();

        $scope.$apply();

        // Broadcast to children that a swipe occured
        $scope.$broadcast( 'swipe-occurred' );

      }, element );

      $ionicGesture.on( 'swiperight', ( e ) => {

        $scope.toPreviousWeek();

        $scope.$apply();

        // Broadcast to children that a swipe occured
        $scope.$broadcast( 'swipe-occurred' );

      }, element );
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.toNextWeek = function() {
      setupWeekStartAndEndDates( 1 );

      getLocationBookings();
    };

    $scope.toPreviousWeek = function() {
      setupWeekStartAndEndDates( -1 );

      getLocationBookings();
    };

    $scope.toNextMonth = function() {
      setupWeekStartAndEndDates( 1, 'month' );

      getLocationBookings();
    };

    $scope.toPreviousMonth = function() {
      setupWeekStartAndEndDates( -1, 'month' );

      getLocationBookings();
    };

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( '$ionicView.beforeEnter', ( event, data ) => {

      setupWeekStartAndEndDates();
      getLocationBookings();
      startUpdateInterval();
    });

    $scope.$on( '$ionicView.loaded', ( event, data ) => {

      setupGestures();
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

    /* Initialization END */

  }]
)

  .controller( 'LocationBookingDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', 'LocationBooking', '$mdToast', 'Location', 'Customer', 'BookingHelper', '$q', '$ionicHistory', 'API_IMG_PATH_URL', 'LocationFurnituring', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, LocationBooking, $mdToast, Location, Customer, BookingHelper, $q, $ionicHistory, API_IMG_PATH_URL, LocationFurnituring ) => {

    /* Init vars */

    const modalTemplateUrl = 'templates/modals/location-booking-delete.html';
    $scope.editMode = false;
    $scope.locationBookingBackup = {};
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

    const getLocationBooking = function () {

      const locationBooking = LocationBooking.get(
        {
          locationBookingId: $stateParams.id
        }
      );

      // In case locationBooking cannot be fetched, display an error to user.
      locationBooking.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
            .content( 'Lokalbokning kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      });

      $scope.locationBooking = locationBooking;

      // Return promise
      return locationBooking.$promise;
    };

    const initDate = function() {

      const startTime = $scope.locationBooking.StartTime;
      const endTime = $scope.locationBooking.EndTime;

      $scope.bookingStartDate = moment( startTime ).toDate();
      $scope.bookingStartHour = moment( startTime ).hour();
      $scope.bookingStartMinute = moment( startTime ).minute();

      $scope.bookingEndDate = moment( endTime ).toDate();
      $scope.bookingEndHour = moment( endTime ).hour();
      $scope.bookingEndMinute = moment( endTime ).minute();
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

      const deferred = $q.defer();
      const promise = deferred.promise;

      if ( areDateVariablesDefined() ){

        const startMomentDate = addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute );
        const endMomentDate = addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute );

        Location.queryFreeForPeriod(
          {
            locationBookingId: $scope.locationBooking.LocationBookingId,
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

            deferred.resolve();
          })

          // Could not get free locations
          .catch( ( response ) => {

            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när uppgifter om lediga lokaler skulle hämtas' )
              .position( 'top right' )
              .theme( 'warn' )
            );

            deferred.reject();
          });
      } else {

        deferred.reject();
      }

      return promise;
    };

    const getLocationFurniturings = function () {

      if ( $scope.locationBooking.LocationId ){
        $scope.furniturings = LocationFurnituring.queryForLocation(
          {
            locationId: $scope.locationBooking.LocationId
          }
        );

        // If furniturings could not be fetched
        $scope.furniturings.$promise.catch( () => {

          $mdToast.show( $mdToast.simple()
              .content( 'Möbleringar för vald lokal kunde inte hämtas.' )
              .position( 'top right' )
              .theme( 'warn' )
          );
        });
      }
      else {
        $scope.furnituring = [];
      }

      // return promise
      return $scope.furniturings.$promise;
    };

    const initSelectedFurnituring = function () {

      if ( !$scope.locationBooking.SelectedFurnituring ) {

        getLocationFurniturings()
          .then( () => {

            // After we get all the furniturings for the locations, select the right one.
            $scope.locationBooking.SelectedFurnituring = $scope.furniturings.find( ( furnituring ) => {

              return furnituring.FurnituringId === $scope.locationBooking.FurnituringId;

            });
          });
      }
    };

    const getCustomer = function(){

      const customer = Customer.get(
        {
          customerId: $scope.locationBooking.CustomerId
        }
      );

      customer.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
            .content( 'Kund kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      });

      $scope.customer = customer;

      return customer.$promise;
    };

    const addTimeToDate = function( dateObj, hour, minute ) {

      return moment( dateObj )
        .hour( hour )
        .minute( minute );
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

    $scope.deleteLocationBooking = function() {

      // Delete locationBooking
      LocationBooking.delete(
        {
          locationBookingId: $stateParams.id
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $mdToast.show( $mdToast.simple()
              .content( 'Lokalbokningen raderades med ett lyckat resultat' )
              .position( 'top right' )
              .theme( 'success' )
          );

          history.back();
        })
        // Something went wrong
        .catch( ( response ) => {

          // If there was a problem with the in-data
          if ( response.status === 400 || response.status === 500 ){

            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när Lokalbokningen skulle tas bort' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {

            $mdToast.show( $mdToast.simple()
                .content( 'Lokalbokningen existerar inte längre. Hann kanske någon radera den?' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          history.back();
        });
    };

    $scope.updateFurniturings = function() {

      // Get all available furniturings for selected location
      getLocationFurniturings();
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

      // Set a furnituring if if there is a furnituring at all.
      const furnituringId = ( $scope.locationBooking.SelectedFurnituring ? $scope.locationBooking.SelectedFurnituring.FurnituringId : null );

      // Save locationBooking
      LocationBooking.save(
        {
          BookingId: $scope.locationBooking.BookingId,
          LocationBookingId: $scope.locationBooking.LocationBookingId,
          LocationId: $scope.locationBooking.LocationId,
          FurnituringId: furnituringId,
          StartTime: addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).format(),
          EndTime: addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).format(),
          NumberOfPeople: $scope.locationBooking.NumberOfPeople,
          Provisional: $scope.locationBooking.Provisional
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $mdToast.show( $mdToast.simple()
              .content( 'Lokal/plats-bokningen sparades med ett lyckat resultat' )
              .position( 'top right' )
              .theme( 'success' )
          );

          // Resolve promise
          deferred.resolve();

          // Redirect
          history.back();

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){

            $mdToast.show( $mdToast.simple()
                .content( 'Lokalen är tyvärr redan bokad under vald tidsram.' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          // If there was a problem with the in-data
          else {

            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när lokal/plats-bokningen skulle sparas' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }
        });

      return promise;
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();
    getLocationBooking().then( () => {
      initDate();
      getCustomer().then( () => {
        getLocations().then( () => {
          initSelectedFurnituring();
        });
      });
    });
    initTimeSelectData();

    /* Initialization END */
  }]
  )

  .controller( 'LocationBookingCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'LocationBooking', 'Location', 'BookingHelper', 'LocationFurnituring', 'Customer', '$q', '$mdToast', '$ionicHistory', 'API_IMG_PATH_URL', 'PHOTO_MISSING_SRC', ( $rootScope, $stateParams, $scope, $state, LocationBooking, Location, BookingHelper, LocationFurnituring, Customer, $q, $mdToast, $ionicHistory, API_IMG_PATH_URL, PHOTO_MISSING_SRC ) => {

    /* Init vars */
    $scope.locationBooking = {
      Provisional: true,
      BookingTypeId: 1
    };
    $scope.furnituring = [];
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;
    $scope.customerImageSrc = PHOTO_MISSING_SRC;

    /* Private methods START */

    const initDate = function() {

      // Initialize date if its not set in incoming state params.
      // It does not matter if its a normal date object or moment.js object. Make it a regular date object either way.
      // We need to make it to a regular date object since that's what angular material date picker requires.
      if ( $state.params.startTime && $state.params.endTime ) {

        $scope.bookingStartDate = moment( $state.params.startTime ).toDate();
        $scope.bookingStartHour = moment( $state.params.startTime ).hour();
        $scope.bookingStartMinute = moment( $state.params.startTime ).minute();

        $scope.bookingEndDate = moment( $state.params.endTime ).toDate();
        $scope.bookingEndHour = moment( $state.params.endTime ).hour();
        $scope.bookingEndMinute = moment( $state.params.endTime ).minute();

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

      // Create promise
      const deferred = $q.defer();

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

            // Resolve promise
            deferred.resolve();
          })

          // Could not get free locations
          .catch( ( response ) => {

            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när uppgifter om lediga lokaler skulle hämtas' )
              .position( 'top right' )
              .theme( 'warn' )
            );

            // Reject promise
            deferred.reject();
          });
      }

      return deferred.promise;
    };

    const getCustomers = function(){

      const customers = Customer.query();

      customers.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
            .content( 'Kunder kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      });

      $scope.customers = customers;
    };

    const updateCustomerImageSrc = function() {

      $scope.customerImageSrc = (
        $scope.customer.ImageSrc !== null && $scope.customer.ImageSrc.length > 1 ? API_IMG_PATH_URL + $scope.customer.ImageSrc : PHOTO_MISSING_SRC
      );
    };

    const getCustomer = function(){

      const customer = Customer.get(
        {
          customerId: $state.params.customerId
        }
      );

      customer.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Kund kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
          .theme( 'warn' )
        );
      })
        .then( () => {
          updateCustomerImageSrc();
        });

      $scope.customer = customer;
    };

    const addTimeToDate = function( dateObj, hour, minute ) {

      return moment( dateObj )
        .hour( hour )
        .minute( minute );
    };

    const createBookingContainerIfNeeded = function () {

      // Create promise
      const deferred = $q.defer();

      // If there is already a booking container which is passed as state param.
      if ( $state.params.bookingId !== null ) {

        $scope.locationBooking.BookingId = $state.params.bookingId;

        deferred.resolve();

      // There is no booking container, create one
      } else {

        BookingHelper.createBookingContainer( $scope.locationBooking )

          // If everything went ok
          .then( ( createdBooking ) => {

            // Make created booking accessible from other metods
            $scope.locationBooking.BookingId = createdBooking.BookingId;

            // Resolve promise
            deferred.resolve();

            // Something went wrong
          }).catch( ( response ) => {

            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när bokningstillfället skulle skapas' )
                .position( 'top right' )
                .theme( 'warn' )
            );

            deferred.reject();
          });
      }

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

          $mdToast.show( $mdToast.simple()
            .content( 'Möbleringar för vald lokal kunde inte hämtas.' )
            .position( 'top right' )
            .theme( 'warn' )
          );
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

      createBookingContainerIfNeeded()
        .then( () => {

          // Set a furnituring if if there is a furnituring at all.
          const furnituringId = ( $scope.locationBooking.SelectedFurnituring ? $scope.locationBooking.SelectedFurnituring.FurnituringId : null );

          // Prepare date variables
          const startTime = addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).format();
          const endTime = addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).format();

          // Save locationBooking
          LocationBooking.save(
            {
              BookingId: $scope.locationBooking.BookingId,
              LocationBookingId: 0,
              LocationId: $scope.locationBooking.LocationId,
              FurnituringId: furnituringId,
              StartTime: startTime,
              EndTime: endTime,
              NumberOfPeople: $scope.locationBooking.NumberOfPeople,
              Provisional: $scope.locationBooking.Provisional
            }
            ).$promise

              // If everything went ok
              .then( ( response ) => {

                $mdToast.show( $mdToast.simple()
                  .content( 'Lokal/plats-bokningen skapades med ett lyckat resultat' )
                  .position( 'top right' )
                  .theme( 'success' )
                );

                // Resolve promise
                deferred.resolve();

                // Redirect
                history.back();

                // Something went wrong
              }).catch( ( response ) => {

                // If there there was a foreign key reference
                if ( response.status === 409 ){

                  $mdToast.show( $mdToast.simple()
                    .content( 'Lokalen är tyvärr redan bokad under vald tidsram.' )
                    .position( 'top right' )
                    .theme( 'warn' )
                  );
                }

                // If there was a problem with the in-data
                else {
                  $mdToast.show( $mdToast.simple()
                    .content( 'Ett oväntat fel uppstod när lokal/plats-bokningen skulle sparas' )
                    .position( 'top right' )
                    .theme( 'warn' )
                  );
                }
              });
        });

      return promise;
    };

    /* Public Methods END */

    /* Initialization START */

    initDate();
    getLocations().then( () => {

      if ( $state.params.customerId ){
        getCustomer();
      } else {
        getCustomers();
      }

    });
    initTimeSelectData();

    /* Initialization END */

  }]
);