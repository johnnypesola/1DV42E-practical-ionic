'use strict';

angular.module( 'BookingSystem.calendarDaysHeaderDirective',

  // Dependencies
  []
  )

  // Controller
  .controller( 'CalendarDaysHeaderCtrl', [ '$rootScope', '$scope', ( $rootScope, $scope ) => {

    /* Init vars */
    $scope.days = [];

    // Private functions
    const setDayDates = function() {

      // Set scope time to guaranteed start of week, in case this was missed in parent.
      $scope.weekDateStart = moment( $scope.date ).startOf( 'isoWeek' );

      let dayNum = 0;
      for ( let dayDate = moment( $scope.weekDateStart ); dayNum < 7; dayDate.add( 1, 'days' ) ) {

        $scope.days[ dayNum ] = {};
        $scope.days[ dayNum ].isCurrentDay = moment().format( 'YYYY-MM-DD' ) === dayDate.format( 'YYYY-MM-DD' );
        $scope.days[ dayNum ].dayNumber = dayDate.format( 'D' );
        $scope.days[ dayNum ].dayName = dayDate.format( 'ddd' );

        dayNum++;
      }
    };

    $scope.$watch( 'date', ( newValue, oldValue ) => {
      setDayDates();
    });
  }]
  )

  .directive( 'calendarDaysHeader', [function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: function( element, attr ){
        return 'templates/directives/calendar-days-header.html';
      },
      scope: {
        date: '='
      },
      controller: 'CalendarDaysHeaderCtrl'
    };
  }]
  );