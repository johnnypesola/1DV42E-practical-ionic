'use strict';

angular.module( 'BookingSystem.calendarWeekDirective',

  // Dependencies
  []
)

  // Controller
  .controller( 'CalendarWeekCtrl', [ '$rootScope', '$scope', '$state', 'LocationBooking', 'BookingHelper', ( $rootScope, $scope, $state, LocationBooking, BookingHelper ) => {

    /* Init vars */
    $scope.days = [];
    //$scope.bookings = $scope.bookings || [];

    // Set scope time to guaranteed start of week, in case this was missed in parent.
    $scope.weekDateStart = moment( $scope.date ).startOf( 'isoWeek' );
    // const weekDateEnd = moment( $scope.date ).endOf( 'isoWeek' );

    /* Private methods START */

    const filterDayBookings = function( dayStartTime, dayEndTime, booking ){

      // Check if booking is withing day start time and day end time
      return BookingHelper.doBookingsCollide(
        booking.StartTime,
        booking.EndTime,
        dayStartTime,
        dayEndTime
      );
    };

    const setDayBookings = function( dayDate ){

      let dayNum;
      for ( dayNum = 0; dayNum < 7; dayNum++ ) {

        // Convert day times to moment objects
        const dayStartTime = moment( $scope.days[ dayNum ].date );
        const dayEndTime = moment( dayStartTime ).endOf( 'day' );

        // Filter bookings for day
        const bookings = $scope.bookings.filter( filterDayBookings.bind( null, dayStartTime, dayEndTime ) );

        $scope.days[ dayNum ].bookings = [];

        // Break reference
        bookings.forEach( ( booking ) => {

          $scope.days[ dayNum ].bookings.push( JSON.parse( JSON.stringify( booking ) ) );

        });
      }
    };

    const setDayDates = function() {
      let dayNum = 0;
      for ( let dayDate = moment( $scope.weekDateStart ); dayNum < 7; dayDate.add( 1, 'days' ) ) {
        $scope.days[ dayNum ] = {};
        $scope.days[ dayNum ].date = dayDate.format();
        dayNum++;
      }
    };

    const hideAllAddButtons = function( msg ) {
      $scope.$broadcast( 'hideAllAddButtons', true );
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.hideAddButtons = function( something ) {

      hideAllAddButtons();
    };

    /* Public Methods END */

    /* Initialization START */

    setDayDates();

    // Add a watch on bookings. Passed from parent controller.
    $scope.$watch( 'bookings', ( newValue ) => {

      if ( newValue !== undefined ) {
        setDayBookings();
      }
    });

    /* Initialization END */

  }]
  )

  .directive( 'calendarWeek', [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: function( element, attr ){
        return 'templates/directives/calendar-week.html';
      },
      scope: {
        date: '=',
        bookings: '=',
        bookingsType: '='
      },
      link: function ( scope, element, attrs ) {

      },
      controller: 'CalendarWeekCtrl'
    };
  }]
);