'use strict';

angular.module( 'BookingSystem.calendarDayHeaderDirective',

  // Dependencies
  []
  )

  // Controller
  .controller( 'CalendarDayHeaderCtrl', [ '$rootScope', '$scope', ( $rootScope, $scope ) => {

    // Init values
    const calendarDayMomentDate = moment( $scope.date );
    $scope.isCurrentDay = moment().format( 'YYYY-MM-DD' ) === calendarDayMomentDate.format( 'YYYY-MM-DD' );
    $scope.dayNumber = calendarDayMomentDate.format( 'D' );
    $scope.dayName = calendarDayMomentDate.format( 'ddd' );
  }]
  )

  .directive( 'calendarDayHeader', [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: function( element, attr ){
        return 'templates/directives/calendar-day-header.html';
      },
      scope: {
        date: '='
      },
      controller: 'CalendarDayHeaderCtrl'
    };
  }]
  );