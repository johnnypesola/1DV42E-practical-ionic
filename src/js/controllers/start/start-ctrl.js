'use strict';

angular.module( 'BookingSystem.start',

// Dependencies
  [ 'ngMessages' ]
  )

  // Controller
  .controller( 'StartViewCtrl', [ '$rootScope', '$scope', '$state', 'Booking', 'LocationBooking', 'ResourceBooking', 'MealBooking', '$interval', 'DATA_SYNC_INTERVAL_TIME', '$ionicGesture', '$mdToast', 'DEFAULT_CALENDAR_ZOOM', '$stateParams', '$ionicHistory', ( $rootScope, $scope, $state, Booking, LocationBooking, ResourceBooking, MealBooking, $interval, DATA_SYNC_INTERVAL_TIME, $ionicGesture, $mdToast, DEFAULT_CALENDAR_ZOOM, $stateParams, $ionicHistory ) => {

    /* Init vars */
    const updateIntervalTime = DATA_SYNC_INTERVAL_TIME;
    let updateInterval = null, weekStartDate = null, weekEndDate = null;
    $scope.zoom = DEFAULT_CALENDAR_ZOOM;
    $scope.weekDate = moment();
    $scope.bookingTypes = {
      booking : 'booking',
      location : 'location-booking',
      resource : 'resource-booking',
      meal : 'meal-booking'
    };
    $scope.bookingsType = $scope.bookingTypes.booking; // $stateParams.bookingType;

    /* Private methods START */

    const setupWeekStartAndEndDates = function ( offset = 0 ) {

      // Add or subtract offset weeks from current weekdate object.
      if ( offset > 0 ) {
        $scope.weekDate = moment( $scope.weekDate ).add( 1, 'weeks' );
      } else if ( offset < 0 ) {
        $scope.weekDate = moment( $scope.weekDate ).subtract( 1, 'weeks' );
      }

      weekStartDate = moment( $scope.weekDate ).startOf( 'week' );
      weekEndDate = moment( $scope.weekDate ).endOf( 'week' );
    };

    const setCalendarTitle = function () {

      switch ( $scope.bookingsType ) {
        case $scope.bookingTypes.booking:
          $scope.calendarTitle = 'Bokningstillfällen';
          break;
        case $scope.bookingTypes.location:
          $scope.calendarTitle = 'Lokalbokningar';
          break;
        case $scope.bookingTypes.resource:
          $scope.calendarTitle = 'Resursbokningar';
          break;
        case $scope.bookingTypes.meal:
          $scope.calendarTitle = 'Måltidsbokningar';
          break;
        default:
          $scope.calendarTitle = 'Bokningstillfällen';
      }
    };

    const getBookings = function () {

      let bookings;

      switch ( $scope.bookingsType ) {

        // If its a booking
        case $scope.bookingTypes.booking:

          bookings = Booking.queryLessForPeriod({
            fromDate: weekStartDate.format( 'YYYY-MM-DD' ),
            toDate: weekEndDate.format( 'YYYY-MM-DD' )
          });
          break;

        // If its a location booking
        case $scope.bookingTypes.location:

          bookings = LocationBooking.queryLessForPeriod({
            fromDate: weekStartDate.format( 'YYYY-MM-DD' ),
            toDate: weekEndDate.format( 'YYYY-MM-DD' )
          });
          break;

        // If its a resource booking
        case $scope.bookingTypes.resource:

          bookings = ResourceBooking.queryLessForPeriod({
            fromDate: weekStartDate.format( 'YYYY-MM-DD' ),
            toDate: weekEndDate.format( 'YYYY-MM-DD' )
          });
          break;

        // If its a meal booking
        case $scope.bookingTypes.meal:
          bookings = MealBooking.queryLessForPeriod({
            fromDate: weekStartDate.format( 'YYYY-MM-DD' ),
            toDate: weekEndDate.format( 'YYYY-MM-DD' )
          });
          break;

        default:
          bookings = {};
      }

      // const bookings = Booking.query();

      // In case Booking cannot be fetched, display an error to user.
      bookings.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Bokningar kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
        );
      })

      .then( ( bookings ) => {
        $scope.bookings = bookings;
      });
    };

    const startUpdateInterval = function (){

      updateInterval = $interval( () => {

        getBookings();

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

      getBookings();
    };

    $scope.toPreviousWeek = function() {
      setupWeekStartAndEndDates( -1 );

      getBookings();
    };

    $scope.changeBookingTypeTo = function( bookingTypeStr ) {

      // We are actually in parent scope at the moment. Therefore we need to broadcast.
      $scope.$broadcast( 'changed-booking-type', { bookingType: bookingTypeStr });

    };

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( 'changed-booking-type', ( event, args ) => {

      $scope.bookingsType = args.bookingType;
      getBookings();
    });

    $scope.$on( '$ionicView.enter', ( event, data ) => {

      setupWeekStartAndEndDates();
      getBookings();
      startUpdateInterval();
      setCalendarTitle();
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
);
