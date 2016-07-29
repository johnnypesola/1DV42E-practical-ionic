angular.module( 'BookingSystem.routes',

  []
)

  // Routes
  .config( ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', ( $stateProvider, $urlRouterProvider, $ionicConfigProvider ) => {
    $stateProvider

      .state( 'app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html'
        // controller: 'AppCtrl'
      })

      // Start

      .state( 'app.start', {
        url: '/start',
        views: {
          'menuContent': {
            templateUrl: 'templates/start/start.html',
            controller: 'StartViewCtrl'
          }
        }
      })

      // Account

      .state( 'app.account', {
        cache: false,
        url: '/account',
        views: {
          'menuContent': {
            templateUrl: 'templates/account/account.html',
            controller: 'AccountCtrl'
          }
        }
      })

      // Users

      .state( 'app.users-list', {
        url: '/user-list',
        views: {
          'menuContent': {
            templateUrl: 'templates/users/users-list.html',
            controller: 'UsersListCtrl'
          }
        }
      })

      .state( 'app.user-details', {
        url: '/user-details/:userId',
        views: {
          'menuContent': {
            templateUrl: 'templates/users/user-details.html',
            controller: 'UserDetailsCtrl'
          }
        }
      })

      .state( 'app.user-create', {
        cache: false,
        url: '/user-create',
        views: {
          'menuContent': {
            templateUrl: 'templates/users/user-create.html',
            controller: 'UserCreateCtrl'
          }
        }
      })

      // Bookings

      .state( 'app.booking-details', {
        url: '/booking-details',
        params: {
          id: null
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/booking/booking-details.html',
            controller: 'BookingDetailsCtrl'
          }
        }
      })

      .state( 'app.booking-view', {
        url: '/booking-view',
        params: {
          bookingType: 'booking',
          weekDate: null
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/booking/booking-view.html',
            controller: 'BookingViewCtrl'
          }
        }
      })

      // Meal Bookings

      .state( 'app.meal-booking-view', {
        url: '/meal-booking-view',
        views: {
          'menuContent': {
            templateUrl: 'templates/meal-booking/meal-booking-view.html',
            controller: 'MealBookingViewCtrl'
          }
        }
      })

      .state( 'app.meal-booking-details', {
        url: '/meal-booking-details',
        params: {
          id: null
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/meal-booking/meal-booking-details.html',
            controller: 'MealBookingDetailsCtrl'
          }
        }
      })

      .state( 'app.meal-booking-create', {
        cache: false,
        url: '/meal-booking-create',
        params: {
          date: null,
          bookingId: null,
          customerId: null
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/meal-booking/meal-booking-create.html',
            controller: 'MealBookingCreateCtrl'
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
        cache: false,
        url: '/resource-booking-create',
        params: {
          date: null,
          bookingId: null,
          customerId: null
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
        cache: false,
        url: '/location-booking-create',
        params: {
          date: null,
          bookingId: null,
          customerId: null
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
        cache: false,
        url: '/furnituring-create',
        views: {
          'menuContent': {
            templateUrl: 'templates/furnituring/furnituring-create.html',
            controller: 'FurnituringCreateCtrl'
          }
        }
      })

      // MealProperties

      .state( 'app.meal-properties-list', {
        url: '/meal-properties-list',
        views: {
          'menuContent': {
            templateUrl: 'templates/meal-properties/meal-properties-list.html',
            controller: 'MealPropertyListCtrl'
          }
        }
      })

      .state( 'app.meal-property-details', {
        url: '/meal-property-details/:mealPropertyId',
        views: {
          'menuContent': {
            templateUrl: 'templates/meal-properties/meal-property-details.html',
            controller: 'MealPropertyDetailsCtrl'
          }
        }
      })

      .state( 'app.meal-property-create', {
        cache: false,
        url: '/meal-property-create',
        views: {
          'menuContent': {
            templateUrl: 'templates/meal-properties/meal-property-create.html',
            controller: 'MealPropertyCreateCtrl'
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
        cache: false,
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
        cache: false,
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
        cache: false,
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
        cache: false,
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
        cache: false,
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

    // Disable animation between views
    $ionicConfigProvider.views.transition( 'none' );
  }]
);