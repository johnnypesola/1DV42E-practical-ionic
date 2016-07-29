// Ionic BookingSystem App

const BookingSystem = angular
  .module( 'BookingSystem', [
    'ionic',
    'ngMaterial',
    'ngResource',
    'ngMessages',

    // Settings
    'BookingSystem.start',
    'BookingSystem.routes',
    'BookingSystem.constants',
    'BookingSystem.ngMaterialSettings',
    'BookingSystem.httpSettings',

    // Controllers
    'BookingSystem.login',
    'BookingSystem.meals',
    'BookingSystem.resources',
    'BookingSystem.bookings',
    'BookingSystem.locations',
    'BookingSystem.furnituring',
    'BookingSystem.customers',
    'BookingSystem.mealProperties',
    'BookingSystem.locationBooking',
    'BookingSystem.resourceBooking',
    'BookingSystem.mealBooking',
    'BookingSystem.bookingTypes',
    'BookingSystem.users',
    'BookingSystem.account',

    // Services
    'BookingSystem.authService',
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
    'BookingSystem.usersServices',
    'BookingSystem.accountServices',

    // Directives
    'BookingSystem.calendarDaysHeaderDirective',
    'BookingSystem.calendarWeekDirective',
    'BookingSystem.imageUploaderDirective',
    'BookingSystem.ngMinMaxDirectives',
    'BookingSystem.calendarDayDirective',
    'BookingSystem.imageShowOnLoadDirective',

    // Filters
    'BookingSystem.filters'
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
  $rootScope.USERNAME_REGEXP = /^[0-9a-zA-Z\-_&\.,~\^@()/%\s\!]*$/;
  $rootScope.NUMERIC_SPACE_REGEXP = /^[0-9\s\+\-]*$/;
  $rootScope.NUMERIC_STRICT_REGEXP = /^[0-9]*$/;
  $rootScope.NUMERIC_DOT_REGEXP = /^[0-9]*[\.]?[0-9]*?$/;

}] );

// Controller for nav bar
BookingSystem.controller( 'NavigationCtrl', ['$scope', '$state', 'API_IMG_PATH_URL', 'AuthService', ( $scope, $state, API_IMG_PATH_URL, AuthService ) => {

  $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;
}]
);