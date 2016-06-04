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
    'BookingSystem.calendarWeekDirective',
    'BookingSystem.bookingHelperServices',
    'BookingSystem.imageUploaderDirective',
    'BookingSystem.locationsServices',
    'BookingSystem.ngMinMaxDirectives',
    'BookingSystem.filters',
    'BookingSystem.bookingServices',
    'BookingSystem.resourceBooking',
    'BookingSystem.resourceBookingServices',
    'ngMaterial',
    'ngResource',
    'ngMessages'
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

  // Moment.js locale settngs
  moment.locale( 'sv' );
}] );

// Constants
BookingSystem.constant( 'API_URL', 'http://bokning.vvfors.se/api/' );
// BookingSystem.constant( 'API_URL', 'http://localhost:6796/api/' );
BookingSystem.constant( 'API_IMG_PATH_URL', 'http://bokning.vvfors.se/' );
BookingSystem.constant( 'UPLOAD_IMG_MAX_WIDTH', '400' );
BookingSystem.constant( 'UPLOAD_IMG_MAX_HEIGHT', '400' );
BookingSystem.constant( 'PHOTO_MISSING_SRC', 'img/photo_missing.svg' );
BookingSystem.constant( 'DEFAULT_MAP_ZOOM', 5 );
BookingSystem.constant( 'DEFAULT_LATITUDE', 59.2792 );
BookingSystem.constant( 'DEFAULT_LONGITUDE', 15.2361 );
BookingSystem.constant( 'MODAL_ANIMATION', 'slide-in-up' );
BookingSystem.constant( 'DATA_SYNC_INTERVAL_TIME', 60000 * 5 ); // Every 5 minutes
BookingSystem.constant( 'DEFAULT_CALENDAR_ZOOM', 2 );

// Routes
BookingSystem.config( ['$stateProvider', '$urlRouterProvider', '$mdDateLocaleProvider', ( $stateProvider, $urlRouterProvider, $mdDateLocaleProvider ) => {
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

  // Resource Bookings

    .state( 'app.resource-booking-view', {
      url: '/resource-booking-view',
      views: {
        'menuContent': {
          templateUrl: 'templates/resource-booking/resource-booking-view.html',
          controller: 'ResourceBookingViewCtrl'
        }
      }
    })

    .state( 'app.resource-booking-details', {
      url: '/resource-booking-details',
      params: {
        id: null
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/resource-booking/resource-booking-details.html',
          controller: 'ResourceBookingDetailsCtrl'
        }
      }
    })

    .state( 'app.resource-booking-create', {
      url: '/resource-booking-create',
      params: {
        date: null,
        locationId: null
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/resource-booking/resource-booking-create.html',
          controller: 'ResourceBookingCreateCtrl'
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

    .state( 'app.location-booking-details', {
      url: '/location-booking-details',
      params: {
        id: null
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/location-booking/location-booking-details.html',
          controller: 'LocationBookingDetailsCtrl'
        }
      }
    })

    .state( 'app.location-booking-create', {
      url: '/location-booking-create',
      params: {
        date: null,
        locationId: null
      },
      views: {
        'menuContent': {
          templateUrl: 'templates/location-booking/location-booking-create.html',
          controller: 'LocationBookingCreateCtrl'
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
  })

  .state( 'app.location-details', {
    url: '/location-details/:locationId',
    views: {
      'menuContent': {
        templateUrl: 'templates/locations/location-details.html',
        controller: 'LocationDetailsCtrl'
      }
    }
  })

  .state( 'app.location-create', {
    url: '/location-create',
    views: {
      'menuContent': {
        templateUrl: 'templates/locations/location-create.html',
        controller: 'LocationCreateCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise( '/app/start' );
}]
);

// Locatization configuration for Angular Material ( Swedish localization. )
BookingSystem.config( ['$mdDateLocaleProvider', ( $mdDateLocaleProvider ) => {

  $mdDateLocaleProvider.months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
  $mdDateLocaleProvider.shortMonths = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  $mdDateLocaleProvider.days = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
  $mdDateLocaleProvider.shortDays = ['Sö', 'Må', 'Ti', 'On', 'To', 'Fr', 'Lö'];

  // Can change week display to start on Monday.
  $mdDateLocaleProvider.firstDayOfWeek = 1;

  // Example uses moment.js to parse and format dates.
  $mdDateLocaleProvider.parseDate = function( dateString ) {
    const m = moment( dateString, 'L', true );
    return m.isValid() ? m.toDate() : new Date( NaN );
  };
  $mdDateLocaleProvider.formatDate = function( date ) {
    return moment( date ).format( 'L' );
  };
  $mdDateLocaleProvider.monthHeaderFormatter = function( date ) {
    return $mdDateLocaleProvider.shortMonths[date.getMonth()] + ' ' + date.getFullYear();
  };
  // In addition to date display, date components also need localized messages
  // for aria-labels for screen-reader users.
  $mdDateLocaleProvider.weekNumberFormatter = function( weekNumber ) {
    return 'Vecka ' + weekNumber;
  };
  $mdDateLocaleProvider.msgCalendar = 'Kalender';
  $mdDateLocaleProvider.msgOpenCalendar = 'Öppna kalender';
}]
);

// Controller for nav bar
BookingSystem.controller( 'NavigationCtrl', ['$scope', '$state', ( $scope, $state ) => {

}]
);

  // Fix for double triggering of ng-click, caused by angular material design.
BookingSystem.config( ['$mdGestureProvider', ( $mdGestureProvider ) => {
  $mdGestureProvider.skipClickHijack();
}]
);
