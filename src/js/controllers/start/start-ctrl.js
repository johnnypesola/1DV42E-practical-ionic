'use strict';

angular.module( 'BookingSystem.start',

// Dependencies
  [ 'ngMessages' ]
  )

  // Controller
  .controller( 'StartViewCtrl', [ '$rootScope', '$scope', '$state', 'Booking', 'LocationBooking', 'ResourceBooking', 'MealBooking', '$interval', 'DATA_SYNC_INTERVAL_TIME', '$ionicGesture', '$mdToast', 'DEFAULT_CALENDAR_ZOOM', '$stateParams', '$ionicHistory', '$ionicModal', 'MODAL_ANIMATION', 'BOOKING_TYPES', ( $rootScope, $scope, $state, Booking, LocationBooking, ResourceBooking, MealBooking, $interval, DATA_SYNC_INTERVAL_TIME, $ionicGesture, $mdToast, DEFAULT_CALENDAR_ZOOM, $stateParams, $ionicHistory, $ionicModal, MODAL_ANIMATION, BOOKING_TYPES ) => {

  }]
);
