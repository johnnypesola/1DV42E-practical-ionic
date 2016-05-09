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
    .controller( 'CalendarDayCtrl', ['$scope', '$element', '$attrs', '$rootScope', '$location', '$q', function( $scope, $element, $attrs, $rootScope, $location, $q ) {

      /* Declare variables START */
      const momentDate = moment( $scope.date );

      $scope.dayNumber = momentDate.format( 'D' );
      $scope.dayName = momentDate.format( 'ddd' );
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
        console.log( 'Should open dialog to create an event for date and hour', hour );
      };

      /* Public methods END */

      /* Initialization START */

      setupHours();

      // Listen to when AddButton should hide
      $scope.$on( 'hideAllAddButtons', ( event, msg ) => {

        $scope.hideAddButton();

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
          hideAddButton: '='
        },
        link: function ( scope, element, attrs ) {

        },
        controller: 'CalendarDayCtrl'
      };
    }]
    )

    .controller( 'CalendarTimeCtrl', ['$scope', function( $scope ) {

      /* Declare variables START */

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