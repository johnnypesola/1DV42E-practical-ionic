// Ionic BookingSystem App

const BookingSystem = angular
  .module( 'BookingSystem', [
    'ionic',
    'BookingSystem.routes',
    'BookingSystem.constants',
    'BookingSystem.httpSettings',
    'BookingSystem.ngMaterialSettings',

    'BookingSystem.furnituringServices',
    'BookingSystem.mealsServices',
    'BookingSystem.resourcesServices',
    'BookingSystem.locationBookingServices',
    'BookingSystem.mealPropertiesServices',
    'BookingSystem.locationsServices',
    'BookingSystem.customersServices',
    'BookingSystem.bookingTypesServices',
    'BookingSystem.imageResizeServices',
    'BookingSystem.bookingHelperServices',
    'BookingSystem.locationsServices',
    'BookingSystem.bookingServices',
    'BookingSystem.resourceBookingServices',
    'BookingSystem.mealBookingServices',

    'BookingSystem.meals',
    'BookingSystem.resources',
    'BookingSystem.locationBooking',
    'BookingSystem.locations',
    'BookingSystem.furnituring',

    'BookingSystem.customers',

    'BookingSystem.bookingTypes',
    'BookingSystem.filters',
    'BookingSystem.resourceBooking',
    'BookingSystem.calendarDaysHeaderDirective',
    'BookingSystem.start',
    'BookingSystem.mealBooking',
    'BookingSystem.mealProperties',
    'BookingSystem.bookings',

    'BookingSystem.calendarWeekDirective',
    'BookingSystem.imageUploaderDirective',
    'BookingSystem.ngMinMaxDirectives',
    'BookingSystem.calendarDayDirective',

    'ngMaterial',
    'ngResource',
    'ngMessages'
  ] );

BookingSystem.run( ['$ionicPlatform', '$rootScope', ( $ionicPlatform, $rootScope ) => {
  $ionicPlatform.ready( () => {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if ( window.cordova && window.cordova.plugins.Keyboard ) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar( true );
      cordova.plugins.Keyboard.disableScroll( true );

    }
    if ( window.StatusBar ) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  // Moment.js locale settngs
  moment.locale( 'sv' );

  // Global REGEXP
  $rootScope.TEXT_FIELD_REGEXP = /^[0-9a-zA-ZåäöÅÄÖé\-_&\.,~\^@()/%\s\!]*$/;
  $rootScope.NUMERIC_SPACE_REGEXP = /^[0-9\s\+\-]*$/;
  $rootScope.NUMERIC_STRICT_REGEXP = /^[0-9]*$/;
  $rootScope.NUMERIC_DOT_REGEXP = /^[0-9]*[\.]?[0-9]*?$/;

}] );

// Controller for nav bar
BookingSystem.controller( 'NavigationCtrl', ['$scope', '$state', ( $scope, $state ) => {

}]
);