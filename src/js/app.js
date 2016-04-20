// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

const BookingSystem = angular
  .module( 'BookingSystem', [
    'ionic',
    'BookingSystem.controllers',
    'BookingSystem.furnituring',
    'BookingSystem.furnituringServices',
    'ngMaterial',
    'ngResource'
  ] );

BookingSystem.run( ['$ionicPlatform', ( $ionicPlatform ) => {
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
}] );

// Constants
// BookingSystem.constant( 'API_URL', 'http://www.pesola.se:8080/BookingSystem/api/' );
BookingSystem.constant( 'API_URL', 'http://192.168.1.4:8080/BookingSystem/api/' );
BookingSystem.constant( 'DEFAULT_MAP_ZOOM', 5 );
BookingSystem.constant( 'DEFAULT_LATITUDE', 59.2792 );
BookingSystem.constant( 'DEFAULT_LONGITUDE', 15.2361 );

// Routes
BookingSystem.config( ['$stateProvider', '$urlRouterProvider', ( $stateProvider, $urlRouterProvider ) => {
  $stateProvider

  .state( 'app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state( 'app.start', {
    url: '/start',
    views: {
      'menuContent': {
        templateUrl: 'templates/start.html'
      }
    }
  })

  .state( 'app.furnituring-list', {
    url: '/furnituring-list',
    views: {
      'menuContent': {
        templateUrl: 'templates/furnituring/furnituring-list.html',
        controller: 'FurnituringListCtrl'
      }
    }
  });

  // Old states below
  /*
  .state( 'app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state( 'app.browse', {
    url: '/browse',
    views: {
      'menuContent': {
        templateUrl: 'templates/browse.html'
      }
    }
  })
  .state( 'app.playlists', {
    url: '/playlists',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlists.html',
        controller: 'PlaylistsCtrl'
      }
    }
  })
  .state( 'app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  */

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise( '/app/start' );
}] );
