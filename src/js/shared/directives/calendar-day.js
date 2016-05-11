/**
 * Created by jopes on 2015-04-16.
 */

  // Declare module
  angular.module( 'BookingSystem.calendarDayDirective',

    // Dependencies
    [
    ]
  )

    // Directive specific controllers START
    .controller( 'CalendarDayCtrl', ['$scope', '$element', '$attrs', '$rootScope', '$location', '$q', '$state', 'BookingHelper', function( $scope, $element, $attrs, $rootScope, $location, $q, $state, BookingHelper ) {

      /* Declare variables START */
      const calendarDayMomentDate = moment( $scope.date );

      $scope.dayNumber = calendarDayMomentDate.format( 'D' );
      $scope.dayName = calendarDayMomentDate.format( 'ddd' );
      $scope.visibleAddButtonHour = null;

      /* Declare variables END */

      /* Private methods START */

      const setupHours = function(){

        let hour;
        const totalDayHours = 24;
        $scope.hoursArray = [];

        for ( hour = 0; hour < totalDayHours; hour++ ) {

          $scope.hoursArray.push( hour );

        }
      };

      const calculateStartHour = function( booking ) {

        const endTimeStartOfDay = moment( booking.EndTime ).startOf( 'day' );

        // If booking start on previous day or earlier.
        if (
          calendarDayMomentDate.date() !== moment( booking.StartTime ).date() &&
          moment( booking.StartTime ).isBefore( endTimeStartOfDay )
        ) {
          return 0;
        }

        return ( Number( moment( booking.StartTime ).format( 'H' ) ) + Number( moment( booking.StartTime ).format( 'mm' ) / 60 ) );
      };

      const calculateEndHour = function( booking ) {

        // If booking ends on next day or later.
        if ( moment( booking.EndTime ).isAfter( moment( calendarDayMomentDate ).endOf( 'day' ) ) ) {
          return 23.99;
        }

        return ( Number( moment( booking.EndTime ).format( 'H' ) ) + Number( moment( booking.EndTime ).format( 'mm' ) / 60 ) );
      };

      const setupBookings = function(){

        if ( $scope.bookings !== undefined ) {

          // Loop through all bookings for day.
          $scope.bookings.forEach( ( booking ) => {

            booking.StartHour = calculateStartHour( booking );
            booking.EndHour = calculateEndHour( booking );
            booking.Duration = ( booking.EndHour - booking.StartHour );

            // Make this booking aware of other concurrent bookings
            BookingHelper.setConcurrentBookingData( booking, $scope.bookings );
          });
        }
      };

      /* Private methods END */

      /* Public methods START */

      $scope.showAddHour = function( hour ){

        $scope.hideAllAddButtonsCallback();
        $scope.visibleAddButtonHour = hour;
      };

      $scope.hideAddButton = function() {

        $scope.visibleAddButtonHour = null;
      };

      $scope.createEventForHour = function( hour ) {

        calendarDayMomentDate.set({
          'hour': hour
        });

        // Redirect to create view
        $state.go( 'app.location-booking-create', {
          date: calendarDayMomentDate,
          locationId: null
        });

      };

      /* Public methods END */

      /* Initialization START */

      setupHours();

      // Listen to when AddButton should hide
      $scope.$on( 'hideAllAddButtons', ( event, msg ) => {

        $scope.hideAddButton();

      });

      // Add a watch on bookings. Passed from parent controller.
      $scope.$watch( 'bookings', ( newValue, oldValue ) => {

        if ( Array.isArray( newValue ) ) {

          setupBookings();
        }
      });

      /* Initialization END */
    }]
    )
    // Directive specific controllers END

    // Directives START
    .directive( 'calendarDay', [function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: function( element, attr ){
          return 'templates/directives/calendar-day.html';
        },
        scope: {
          date: '=',
          hideAllAddButtonsCallback: '&',
          hideAddButton: '=',
          bookings: '=',
          bookingsType: '='
        },
        link: function ( scope, element, attrs ) {

        },
        controller: 'CalendarDayCtrl'
      };
    }]
    )

    .controller( 'CalendarTimeCtrl', ['$scope', function( $scope ) {

      /* Declare variables START */
      $scope.weekNumber = moment( $scope.date ).isoWeek();

      /* Declare variables END */

      /* Private methods START */

      const setupHours = function(){

        let hour;
        const totalDayHours = 24;
        $scope.hoursArray = [];

        for ( hour = 1; hour < totalDayHours; hour++ ) {

          $scope.hoursArray.push( hour );

        }
      };

      /* Private methods END */

      /* Public methods START */

      /* Public methods END */

      /* Initialization START */

      setupHours();

      /* Initialization END */

    }]
    )

    .directive( 'calendarTime', [function() {
      return {
        restrict: 'E',
        replace: true,
        scope: {
          date: '='
        },
        templateUrl: function( element, attr ){
          return 'templates/directives/calendar-time.html';
        },
        controller: 'CalendarTimeCtrl'
      };
    }]
    )

    .filter( 'digits', () => {
      return function( input ) {
        if ( input < 10 ) {
          input = '0' + input;
        }

        return input;
      };
    }
    );