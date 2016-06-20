'use strict';

angular.module( 'BookingSystem.mealBooking',

  // Dependencies
  [ 'ngMessages' ]
  )

  // Controller
  .controller( 'MealBookingViewCtrl', [ '$rootScope', '$scope', '$state', 'MealBooking', '$interval', 'DATA_SYNC_INTERVAL_TIME', '$ionicGesture', '$mdToast', 'DEFAULT_CALENDAR_ZOOM', ( $rootScope, $scope, $state, MealBooking, $interval, DATA_SYNC_INTERVAL_TIME, $ionicGesture, $mdToast, DEFAULT_CALENDAR_ZOOM ) => {

    /* Init vars */
    const updateIntervalTime = DATA_SYNC_INTERVAL_TIME;
    let updateInterval = null, weekStartDate = null, weekEndDate = null;
    $scope.zoom = DEFAULT_CALENDAR_ZOOM;
    $scope.weekDate = moment();

    /* Private methods START */

    const setupWeekStartAndEndDates = function ( offset = 0 ) {

      // Add or subtract offset weeks from current weekdate object.
      if ( offset > 0 ) {
        $scope.weekDate = moment( $scope.weekDate ).add( 1, 'weeks' );
      } else if ( offset < 0 ) {
        $scope.weekDate = moment( $scope.weekDate ).subtract( 1, 'weeks' );
      }

      weekStartDate = moment( $scope.weekDate ).startOf( 'week' );
      weekEndDate = moment( $scope.weekDate ).endOf( 'week' );
    };

    const getMealBookings = function () {

      const mealBookings = MealBooking.queryLessForPeriod({

        fromDate: weekStartDate.format( 'YYYY-MM-DD' ),
        toDate: weekEndDate.format( 'YYYY-MM-DD' )
      });

      // const mealBookings = MealBooking.query();

      // In case MealBooking cannot be fetched, display an error to user.
      mealBookings.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Måltidsbokningar kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
        );
      })

      .then( ( mealBookings ) => {
        $scope.mealBookings = mealBookings;
      });
    };

    const startUpdateInterval = function (){

      updateInterval = $interval( () => {

        getMealBookings();

      }, updateIntervalTime );

    };

    const setupGestures = function() {

      const element = angular.element( document.querySelector( '#booking-view-content' ) );

      $ionicGesture.on( 'pinch', ( e ) => {

        e.gesture.srcEvent.preventDefault();

        $scope.$apply( () => {

          // Change zoom value after pinch value.
          $scope.zoom = e.gesture.scale;
        });

      }, element );

      $ionicGesture.on( 'swipeleft', ( e ) => {

        $scope.toNextWeek();

        $scope.$apply();

        // Broadcast to children that a swipe occured
        $scope.$broadcast( 'swipe-occurred' );

      }, element );

      $ionicGesture.on( 'swiperight', ( e ) => {

        $scope.toPreviousWeek();

        $scope.$apply();

        // Broadcast to children that a swipe occured
        $scope.$broadcast( 'swipe-occurred' );

      }, element );
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.toNextWeek = function() {
      setupWeekStartAndEndDates( 1 );

      getMealBookings();
    };

    $scope.toPreviousWeek = function() {
      setupWeekStartAndEndDates( -1 );

      getMealBookings();
    };

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( '$ionicView.beforeEnter', ( event, data ) => {

      setupWeekStartAndEndDates();
      getMealBookings();
      startUpdateInterval();
    });

    $scope.$on( '$ionicView.loaded', ( event, data ) => {

      setupGestures();
    });

    // Destroy the update interval when controller is destroyed (when we leave this view)
    $scope.$on( '$ionicView.leave', ( event ) => {

      // Cancel local update interval
      if ( updateInterval ) {
        $interval.cancel( updateInterval );
      }

      // Broadcast to children to cancel update intervals
      $scope.$broadcast( 'leaving-view' );
    });

    /* Initialization END */

  }]
)

  .controller( 'MealBookingDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', 'MealBooking', '$mdToast', 'Meal', 'Customer', 'BookingHelper', '$q', '$ionicHistory', 'Location', 'API_IMG_PATH_URL', 'MealHasProperty', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, MealBooking, $mdToast, Meal, Customer, BookingHelper, $q, $ionicHistory, Location, API_IMG_PATH_URL, MealHasProperty ) => {

    /* Init vars */

    const modalTemplateUrl = 'templates/modals/meal-booking-delete.html';
    $scope.editMode = false;
    $scope.mealBookingBackup = {};
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;

    /* Private methods START */
    const setupModal = function(){

      $ionicModal.fromTemplateUrl( modalTemplateUrl, {
        scope: $scope,
        animation: MODAL_ANIMATION
      })
      .then( ( response ) => {

        $scope.modal = response;
      });

      // Cleanup the modal when we're done with it!
      $scope.$on( '$destroy', () => {
        $scope.modal.remove();
      });
    };

    const getMealBooking = function () {

      const mealBooking = MealBooking.get(
        {
          mealBookingId: $stateParams.id
        }
      );

      mealBooking.$promise.then( ( response ) => {

        $scope.mealProperties = response.MealHasProperties;
      })

        // In case mealBooking cannot be fetched, display an error to user.
        .catch( () => {

          $mdToast.show( $mdToast.simple()
              .content( 'Måltidsbokning kunde inte hämtas, var god försök igen.' )
              .position( 'top right' )
          );
        });

      $scope.mealBooking = mealBooking;

      // Return promise
      return mealBooking.$promise;
    };

    const initDate = function() {

      const startTime = $scope.mealBooking.StartTime;
      const endTime = $scope.mealBooking.EndTime;

      $scope.bookingStartDate = moment( startTime ).toDate();
      $scope.bookingStartHour = moment( startTime ).hour();
      $scope.bookingStartMinute = moment( startTime ).minute();

      $scope.bookingEndDate = moment( endTime ).toDate();
      $scope.bookingEndHour = moment( endTime ).hour();
      $scope.bookingEndMinute = moment( endTime ).minute();
    };

    const areDateVariablesDefined = function() {
      return (
        typeof $scope.bookingStartDate !== 'undefined' &&
        typeof $scope.bookingStartHour !== 'undefined' &&
        typeof $scope.bookingStartMinute !== 'undefined' &&
        typeof $scope.bookingEndDate !== 'undefined' &&
        typeof $scope.bookingEndHour !== 'undefined' &&
        typeof $scope.bookingEndMinute !== 'undefined'
      );
    };

    const initTimeSelectData = function() {

      $scope.selectHours = BookingHelper.getHoursForSelect();
      $scope.selectMinutes = BookingHelper.getMinutesForSelect();};

    const getLocations = function() {

      Location.query().$promise

        // Success
        .then( ( response ) => {

          // Add locations to scope
          $scope.locations = response;
        })

        // Could not get free locations
        .catch( ( response ) => {

          $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när lokaler skulle hämtas' )
            .position( 'top right' )
          );
        });
    };

    const getMeals = function() {

      $scope.meals = Meal.query();

      $scope.meals.$promise

        // Success
        .then( ( response ) => {

          // Add free meals to scope
          $scope.meals = response;
        })

        // Could not get free meals
        .catch( ( response ) => {

          $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när uppgifter om måltider skulle hämtas' )
            .position( 'top right' )
          );
        });

      return $scope.meals.$promise;
    };

    const getCustomer = function(){

      const customer = Customer.get(
        {
          customerId: $scope.mealBooking.CustomerId
        }
      );

      customer.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
            .content( 'Kund kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
        );
      });

      $scope.customer = customer;
    };

    const addTimeToDate = function( dateObj, hour, minute ) {

      return moment( dateObj )
        .hour( hour )
        .minute( minute );
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.startEditMode = function () {
      const $scope = this;

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.mealBookingBackup = angular.copy( $scope.mealBooking );
    };

    $scope.endEditMode = function () {
      const $scope = this;

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {
      const $scope = this;

      $scope.isEditMode = false;
      $scope.mealBooking = $scope.mealBookingBackup;
    };

    $scope.deleteMealBooking = function() {

      // Delete mealBooking
      MealBooking.delete(
        {
          mealBookingId: $stateParams.id
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $mdToast.show( $mdToast.simple()
              .content( 'Måltidsbokningen raderades med ett lyckat resultat' )
              .position( 'top right' )
          );

          history.back();
        })
        // Something went wrong
        .catch( ( response ) => {

          // If there was a problem with the in-data
          if ( response.status === 400 || response.status === 500 ){

            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när Måltidsbokningen skulle tas bort' )
                .position( 'top right' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {

            $mdToast.show( $mdToast.simple()
                .content( 'Måltidsbokningen existerar inte längre. Hann kanske någon radera den?' )
                .position( 'top right' )
            );
          }

          history.back();
        });
    };

    $scope.checkEndDate = function() {

      if ( !areDateVariablesDefined() ){
        return;
      }

      const startTimeToCompare = addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).toDate().getTime();

      const endTimeToCompare = addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).toDate().getTime();

      // If end date if before start date
      if (
        endTimeToCompare < startTimeToCompare
      ) {
        $scope.bookingEndDate = $scope.bookingStartDate;
        $scope.bookingEndHour = $scope.bookingStartHour;
        $scope.bookingEndMinute = $scope.bookingStartMinute + 15;
      }

      // Get free meals for this new time.
      getMeals();
    };

    $scope.saveMealBooking = function(){

      const $scope = this;
      const deferred = $q.defer();
      const promise = deferred.promise;

      // Save mealBooking
      MealBooking.save(
        {
          BookingId: $scope.mealBooking.BookingId,
          MealBookingId: $scope.mealBooking.MealBookingId,
          MealId: $scope.mealBooking.MealId,
          StartTime: addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).format(),
          EndTime: addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).format(),
          NumberOfPeople: $scope.mealBooking.NumberOfPeople,
          Provisional: $scope.mealBooking.Provisional,
          LocationId: $scope.mealBooking.LocationId,
          DeliveryAddress: $scope.mealBooking.DeliveryAddress,
          MealCount: $scope.mealBooking.MealCount,
          Notes: $scope.mealBooking.Notes
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $mdToast.show( $mdToast.simple()
              .content( 'Måltidsbokningen sparades med ett lyckat resultat' )
              .position( 'top right' )
          );

          // Resolve promise
          deferred.resolve();

          $ionicHistory.goBack();

          // Something went wrong
        }).catch( ( response ) => {

          $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när måltidsbokningen skulle sparas' )
              .position( 'top right' )
          );
        });

      return promise;
    };

    $scope.updateMealProperties = function() {

      // Get all available furniturings for selected location
      if ( $scope.mealBooking.MealId ){
        $scope.mealProperties = MealHasProperty.queryForMeal(
          {
            mealId: $scope.mealBooking.MealId
          }
        );

        // If mealProperties could not be fetched
        $scope.mealProperties.$promise.catch( () => {

          $mdToast.show( $mdToast.simple()
              .content( 'Måltidsegenskaper för vald måltid kunde inte hämtas.' )
              .position( 'top right' )
          );
        });
      }
      else {
        $scope.mealProperties = [];
      }
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();

    getMealBooking()
      .then( () => {
        initDate();
        return getMeals();
      })
      .then( () => {
        return getCustomer();
      })
      .then( () => {
        getLocations();
        initTimeSelectData();
      });

    /* Initialization END */

  }]
  )

  .controller( 'MealBookingCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'MealBooking', 'Meal', 'BookingHelper', 'Customer', '$q', '$mdToast', '$ionicHistory', 'Location', 'API_IMG_PATH_URL', 'PHOTO_MISSING_SRC', 'MealHasProperty', ( $rootScope, $stateParams, $scope, $state, MealBooking, Meal, BookingHelper, Customer, $q, $mdToast, $ionicHistory, Location, API_IMG_PATH_URL, PHOTO_MISSING_SRC, MealHasProperty ) => {

    /* Init vars */
    $scope.mealBooking = {
      Provisional: true,
      BookingTypeId: 1
    };
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;
    $scope.customerImageSrc = PHOTO_MISSING_SRC;

    /* Private methods START */

    const initDate = function() {

      // Initialize date if its not set in incoming state params.
      // It does not matter if its a normal date object or moment.js object. Make it a regular date object either way.
      // We need to make it to a regular date object since that's what angular material date picker requires.
      if ( $state.params.date ) {

        $scope.bookingStartDate = moment( $state.params.date ).toDate();
        $scope.bookingStartHour = moment( $state.params.date ).hour();
        $scope.bookingStartMinute = moment( $state.params.date ).minute();

        $scope.bookingEndDate = moment( $state.params.date ).toDate();
        $scope.bookingEndHour = moment( $state.params.date ).hour();
        $scope.bookingEndMinute = moment( $state.params.date ).add( 59, 'minutes' ).minute();

      } else {

        $scope.bookingStartDate = new Date();
        $scope.bookingStartHour = 8;
        $scope.bookingStartMinute = 0;

        $scope.bookingEndDate = new Date();
        $scope.bookingEndHour = 8;
        $scope.bookingEndMinute = 59;
      }
    };

    const areDateVariablesDefined = function() {
      return (
        typeof $scope.bookingStartDate !== 'undefined' &&
        typeof $scope.bookingStartHour !== 'undefined' &&
        typeof $scope.bookingStartMinute !== 'undefined' &&
        typeof $scope.bookingEndDate !== 'undefined' &&
        typeof $scope.bookingEndHour !== 'undefined' &&
        typeof $scope.bookingEndMinute !== 'undefined'
      );
    };

    const initTimeSelectData = function() {

      $scope.selectHours = BookingHelper.getHoursForSelect();
      $scope.selectMinutes = BookingHelper.getMinutesForSelect();};

    const getLocations = function() {

      const locations = Location.query();

      locations.$promise

        // Success
        .then( ( response ) => {

          // Add locations to scope
          $scope.locations = response;
        })

        // Could not get free locations
        .catch( ( response ) => {

          $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när lokaler skulle hämtas' )
            .position( 'top right' )
          );
        });

      return locations.$promise;
    };

    const getMeals = function() {

      $scope.meals = Meal.query();

      $scope.meals.$promise

        // Success
        .then( ( response ) => {

          // Add free meals to scope
          $scope.meals = response;
        })

        // Could not get free meals
        .catch( ( response ) => {

          $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när uppgifter om måltider skulle hämtas' )
            .position( 'top right' )
          );
        });

      return $scope.meals.$promise;
    };

    const getCustomers = function(){

      const customers = Customer.query();

      customers.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
            .content( 'Kunder kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
        );
      });

      $scope.customers = customers;

      return customers.$promise;
    };

    const updateCustomerImageSrc = function() {

      $scope.customerImageSrc = (
        $scope.customer.ImageSrc !== null && $scope.customer.ImageSrc.length > 1 ? API_IMG_PATH_URL + $scope.customer.ImageSrc : PHOTO_MISSING_SRC
      );
    };

    const getCustomer = function(){

      const customer = Customer.get(
        {
          customerId: $state.params.customerId
        }
      );

      customer.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Kund kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
        );
      })
      .then( () => {
        updateCustomerImageSrc();
      });

      $scope.customer = customer;

      return customer.$promise;
    };

    const addTimeToDate = function( dateObj, hour, minute ) {

      return moment( dateObj )
        .hour( hour )
        .minute( minute );
    };

    const createBookingContainerIfNeeded = function () {

      // Create promise
      const deferred = $q.defer();

      // If there is already a booking container which is passed as state param.
      if ( $state.params.bookingId !== null ) {

        $scope.mealBooking.BookingId = $state.params.bookingId;

        deferred.resolve();

        // There is no booking container, create one
      } else {

        BookingHelper.createBookingContainer( $scope.mealBooking )

          // If everything went ok
          .then( ( createdBooking ) => {

            // Make created booking accessible from other metods
            $scope.mealBooking.BookingId = createdBooking.BookingId;

            // Resolve promise
            deferred.resolve();

            // Something went wrong
          }).catch( ( response ) => {

            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när bokningstillfället skulle sparas' )
              .position( 'top right' )
            );

            deferred.reject();
          });
      }

      // Return promise
      return deferred.promise;
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.checkEndDate = function() {

      if ( !areDateVariablesDefined() ){
        return;
      }

      const startTimeToCompare = addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).toDate().getTime();

      const endTimeToCompare = addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).toDate().getTime();

      // If end date if before start date
      if (
        endTimeToCompare < startTimeToCompare
      ) {
        $scope.bookingEndDate = $scope.bookingStartDate;
        $scope.bookingEndHour = $scope.bookingStartHour;
        $scope.bookingEndMinute = $scope.bookingStartMinute + 15;
      }

      // Get free meals for this new time.
      getMeals();
    };

    $scope.saveMealBooking = function(){

      const $scope = this;
      const deferred = $q.defer();
      const promise = deferred.promise;

      createBookingContainerIfNeeded()
        .then( () => {

          // Save mealBooking
          MealBooking.save(
            {
              BookingId: $scope.mealBooking.BookingId,
              MealBookingId: 0,
              MealId: $scope.mealBooking.MealId,
              StartTime: addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).format(),
              EndTime: addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).format(),
              LocationId: $scope.mealBooking.LocationId,
              DeliveryAddress: $scope.mealBooking.DeliveryAddress,
              MealCount: $scope.mealBooking.MealCount,
              Provisional: $scope.mealBooking.Provisional,
              Notes: $scope.mealBooking.Notes
            }
            ).$promise

              // If everything went ok
              .then( ( response ) => {

                $mdToast.show( $mdToast.simple()
                  .content( 'Måltidsbokningen skapades med ett lyckat resultat' )
                  .position( 'top right' )
                );

                // Resolve promise
                deferred.resolve();

                $ionicHistory.goBack();

                // Something went wrong
              }).catch( ( response ) => {

                $mdToast.show( $mdToast.simple()
                  .content( 'Ett oväntat fel uppstod när måltidsbokningen skulle sparas' )
                  .position( 'top right' )
                );
              });
        });

      return promise;
    };

    $scope.updateMealProperties = function() {

      // Get all available furniturings for selected location
      if ( $scope.mealBooking.MealId ){
        $scope.mealProperties = MealHasProperty.queryForMeal(
          {
            mealId: $scope.mealBooking.MealId
          }
        );

        // If mealProperties could not be fetched
        $scope.mealProperties.$promise.catch( () => {

          $mdToast.show( $mdToast.simple()
              .content( 'Måltidsegenskaper för vald måltid kunde inte hämtas.' )
              .position( 'top right' )
          );
        });
      }
      else {
        $scope.mealProperties = [];
      }
    };

    /* Public Methods END */

    /* Initialization START */

    initDate();
    getMeals()
      .then( () => {

        return ( $state.params.customerId ? getCustomer() : getCustomers() );
      })
      .then( () => {
        getLocations();
        initTimeSelectData();
      });

    /* Initialization END */

  }]
);