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
    'BookingSystem.meals',
    'BookingSystem.mealsServices',
    'BookingSystem.mealPropertiesServices',
    'BookingSystem.resources',
    'BookingSystem.resourcesServices',
    'BookingSystem.locationBooking',
    'BookingSystem.locationBookingServices',
    'BookingSystem.locations',
    'BookingSystem.locationsServices',
    'BookingSystem.calendarDayDirective',
    'BookingSystem.customers',
    'BookingSystem.customersServices',
    'BookingSystem.bookingTypes',
    'BookingSystem.bookingTypesServices',
    'BookingSystem.imageResizeServices',
    'BookingSystem.imageUploaderDirective',
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
BookingSystem.constant( 'API_URL', 'http://bokning.vvfors.se/api/' );
BookingSystem.constant( 'API_IMG_PATH_URL', 'http://bokning.vvfors.se/' );
BookingSystem.constant( 'UPLOAD_IMG_MAX_WIDTH', '400' );
BookingSystem.constant( 'UPLOAD_IMG_MAX_HEIGHT', '400' );
BookingSystem.constant( 'PHOTO_MISSING_SRC', 'img/photo_missing.svg' );
BookingSystem.constant( 'DEFAULT_MAP_ZOOM', 5 );
BookingSystem.constant( 'DEFAULT_LATITUDE', 59.2792 );
BookingSystem.constant( 'DEFAULT_LONGITUDE', 15.2361 );
BookingSystem.constant( 'MODAL_ANIMATION', 'slide-in-up' );

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

  // Location Bookings

    .state( 'app.location-booking-view', {
      url: '/location-booking-view',
      views: {
        'menuContent': {
          templateUrl: 'templates/location-booking/location-booking-view.html',
          controller: 'LocationBookingViewCtrl'
        }
      }
    })

  // Furniturings

  .state( 'app.furnituring-list', {
    url: '/furnituring-list',
    views: {
      'menuContent': {
        templateUrl: 'templates/furnituring/furnituring-list.html',
        controller: 'FurnituringListCtrl'
      }
    }
  })

  .state( 'app.furnituring-details', {
    url: '/furnituring-details/:furnituringId',
    views: {
      'menuContent': {
        templateUrl: 'templates/furnituring/furnituring-details.html',
        controller: 'FurnituringDetailsCtrl'
      }
    }
  })

  .state( 'app.furnituring-create', {
    url: '/furnituring-create',
    views: {
      'menuContent': {
        templateUrl: 'templates/furnituring/furnituring-create.html',
        controller: 'FurnituringCreateCtrl'
      }
    }
  })

  //Meals

  .state( 'app.meals-list', {
    url: '/meals-list',
    views: {
      'menuContent': {
        templateUrl: 'templates/meals/meals-list.html',
        controller: 'MealsListCtrl'
      }
    }
  })

  .state( 'app.meal-details', {
    url: '/meal-details/:mealId',
    views: {
      'menuContent': {
        templateUrl: 'templates/meals/meal-details.html',
        controller: 'MealDetailsCtrl'
      }
    }
  })

  .state( 'app.meal-create', {
    url: '/meal-create',
    views: {
      'menuContent': {
        templateUrl: 'templates/meals/meal-create.html',
        controller: 'MealCreateCtrl'
      }
    }
  })

  //Resources

  .state( 'app.resources-list', {
    url: '/resources-list',
    views: {
      'menuContent': {
        templateUrl: 'templates/resources/resources-list.html',
        controller: 'ResourcesListCtrl'
      }
    }
  })

  .state( 'app.resource-details', {
    url: '/resource-details/:resourceId',
    views: {
      'menuContent': {
        templateUrl: 'templates/resources/resource-details.html',
        controller: 'ResourceDetailsCtrl'
      }
    }
  })

  .state( 'app.resource-create', {
    url: '/resource-create',
    views: {
      'menuContent': {
        templateUrl: 'templates/resources/resource-create.html',
        controller: 'ResourceCreateCtrl'
      }
    }
  })

  //Customers

  .state( 'app.customers-list', {
    url: '/customers-list',
    views: {
      'menuContent': {
        templateUrl: 'templates/customers/customers-list.html',
        controller: 'CustomersListCtrl'
      }
    }
  })

  .state( 'app.customer-details', {
    url: '/customer-details/:customerId',
    views: {
      'menuContent': {
        templateUrl: 'templates/customers/customer-details.html',
        controller: 'CustomerDetailsCtrl'
      }
    }
  })

  .state( 'app.customer-create', {
    url: '/customer-create',
    views: {
      'menuContent': {
        templateUrl: 'templates/customers/customer-create.html',
        controller: 'CustomerCreateCtrl'
      }
    }
  })

  //BookingType

  .state( 'app.bookingtypes-list', {
    url: '/bookingtypes-list',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookingtypes/bookingtypes-list.html',
        controller: 'BookingTypesListCtrl'
      }
    }
  })

  .state( 'app.bookingtype-details', {
    url: '/bookingtype-details/:bookingTypeId',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookingtypes/bookingtype-details.html',
        controller: 'BookingTypeDetailsCtrl'
      }
    }
  })

  .state( 'app.bookingtype-create', {
    url: '/bookingtype-create',
    views: {
      'menuContent': {
        templateUrl: 'templates/bookingtypes/bookingtype-create.html',
        controller: 'BookingTypeCreateCtrl'
      }
    }
  })

  //Locations
  .state( 'app.locations-list', {
    url: '/locations-list',
    views: {
      'menuContent': {
        templateUrl: 'templates/locations/locations-list.html',
        controller: 'LocationsListCtrl'
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
}]
);
