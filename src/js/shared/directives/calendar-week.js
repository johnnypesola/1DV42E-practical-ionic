'use strict';

angular.module( 'BookingSystem.calendarWeekDirective',

  // Dependencies
  []
)

  // Controller
  .controller( 'CalendarWeekCtrl', [ '$rootScope', '$scope', '$state', 'LocationBooking', ( $rootScope, $scope, $state, LocationBooking ) => {

    /* Init vars */
    $scope.mondayDate = moment( $scope.date );
    $scope.tuesdayDate = moment( $scope.date ).add( 1, 'day' );
    $scope.wednesdayDate = moment( $scope.date ).add( 2, 'days' );
    $scope.thursdayDate = moment( $scope.date ).add( 3, 'days' );
    $scope.fridayDate = moment( $scope.date ).add( 4, 'days' );
    $scope.saturdayDate = moment( $scope.date ).add( 5, 'days' );
    $scope.sundayDate = moment( $scope.date ).add( 6, 'days' );

    /* Private methods START */

    const getLocationBookings = function () {

      const LocationBookings = LocationBooking.query();

      // In case LocationBooking cannot be fetched, display an error to user.
      LocationBookings.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Möbleringar kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.LocationBookings = LocationBookings;

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
    $scope.$on( '$ionicView.enter', ( event, data ) => {
      getLocationBookings();
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
        date: '='
      },
      link: function ( scope, element, attrs ) {

      },
      controller: 'CalendarWeekCtrl'
    };
  }]
);