'use strict';

angular.module( 'BookingSystem.resourceBooking',

// Dependencies
[ 'ngMessages' ]
)

// Controller
.controller( 'ResourceBookingViewCtrl', [ '$rootScope', '$scope', '$state', 'ResourceBooking', '$interval', 'DATA_SYNC_INTERVAL_TIME', '$ionicGesture', '$mdToast', 'DEFAULT_CALENDAR_ZOOM', ( $rootScope, $scope, $state, ResourceBooking, $interval, DATA_SYNC_INTERVAL_TIME, $ionicGesture, $mdToast, DEFAULT_CALENDAR_ZOOM ) => {

  /* Init vars */
  const updateIntervalTime = DATA_SYNC_INTERVAL_TIME;
  let updateInterval = null, weekStartDate = null, weekEndDate = null;
  $scope.zoom = DEFAULT_CALENDAR_ZOOM;
  $scope.weekDate = moment();

  /* Private methods START */

  const setupWeekStartAndEndDates = function ( offset = 0, timeType = 'weeks' ) {

    // Add or subtract offset weeks from current weekdate object.
    if ( offset > 0 ) {
      $scope.weekDate = moment( $scope.weekDate ).add( offset, timeType );
    } else if ( offset < 0 ) {
      $scope.weekDate = moment( $scope.weekDate ).subtract( Math.abs( offset ), timeType );
    }

    weekStartDate = moment( $scope.weekDate ).startOf( 'week' );
    weekEndDate = moment( $scope.weekDate ).endOf( 'week' );
  };

  const getResourceBookings = function () {

    const resourceBookings = ResourceBooking.queryLessForPeriod({

      fromDate: weekStartDate.format( 'YYYY-MM-DD' ),
      toDate: weekEndDate.format( 'YYYY-MM-DD' )
    });

    // const resourceBookings = ResourceBooking.query();

    // In case ResourceBooking cannot be fetched, display an error to user.
    resourceBookings.$promise.catch( () => {

      $mdToast.show( $mdToast.simple()
        .content( 'Resursbokningar kunde inte hämtas, var god försök igen.' )
        .position( 'top right' )
        .theme( 'warn' )
      );
    })

      .then( ( resourceBookings ) => {
        $scope.resourceBookings = resourceBookings;
      });
  };

  const startUpdateInterval = function (){

    updateInterval = $interval( () => {

      getResourceBookings();

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

    getResourceBookings();
  };

  $scope.toPreviousWeek = function() {
    setupWeekStartAndEndDates( -1 );

    getResourceBookings();
  };

  $scope.toNextMonth = function() {
    setupWeekStartAndEndDates( 1, 'month' );

    getResourceBookings();
  };

  $scope.toPreviousMonth = function() {
    setupWeekStartAndEndDates( -1, 'month' );

    getResourceBookings();
  };

  /* Public Methods END */

  /* Initialization START */

  $scope.$on( '$ionicView.beforeEnter', ( event, data ) => {

    setupWeekStartAndEndDates();
    getResourceBookings();
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

.controller( 'ResourceBookingDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', 'ResourceBooking', '$mdToast', 'Resource', 'Customer', 'BookingHelper', '$q', '$ionicHistory', 'API_IMG_PATH_URL', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, ResourceBooking, $mdToast, Resource, Customer, BookingHelper, $q, $ionicHistory, API_IMG_PATH_URL ) => {

  /* Init vars */

  const modalTemplateUrl = 'templates/modals/resource-booking-delete.html';
  $scope.editMode = false;
  $scope.resourceBookingBackup = {};
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

  const getResourceBooking = function () {

    const resourceBooking = ResourceBooking.get(
      {
        resourceBookingId: $stateParams.id
      }
    );

    // In case resourceBooking cannot be fetched, display an error to user.
    resourceBooking.$promise.catch( () => {

      $mdToast.show( $mdToast.simple()
        .content( 'Resursbokning kunde inte hämtas, var god försök igen.' )
        .position( 'top right' )
        .theme( 'warn' )
      );
    });

    $scope.resourceBooking = resourceBooking;

    // Return promise
    return resourceBooking.$promise;
  };

  const initDate = function() {

    const startTime = $scope.resourceBooking.StartTime;
    const endTime = $scope.resourceBooking.EndTime;

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

  const getResources = function() {

    if ( areDateVariablesDefined() ){

      const startMomentDate = addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute );
      const endMomentDate = addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute );

      Resource.queryFreeForPeriod(
        {
          fromDate: startMomentDate.format( 'YYYY-MM-DD' ),
          fromTime: startMomentDate.format( 'HH:mm' ),
          toDate: endMomentDate.format( 'YYYY-MM-DD' ),
          toTime: endMomentDate.format( 'HH:mm' ),
          resourceBookingId: $scope.resourceBooking.ResourceBookingId
        }
      ).$promise

        // Success
        .then( ( response ) => {

          // Add free resources to scope
          $scope.resources = response;

          // Set selected resource from fetched resource
          $scope.setSelectedResourceFromId( $scope.resourceBooking.ResourceId );
        })

        // Could not get free resources
        .catch( ( response ) => {

          $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när uppgifter om lediga resurser skulle hämtas' )
            .position( 'top right' )
            .theme( 'warn' )
          );
        });
    }
  };

  const getCustomer = function(){

    const customer = Customer.get(
      {
        customerId: $scope.resourceBooking.CustomerId
      }
    );

    customer.$promise.catch( () => {

      $mdToast.show( $mdToast.simple()
          .content( 'Kund kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
          .theme( 'warn' )
      );
    });

    $scope.customer = customer;

    return customer.$promise;
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
    $scope.resourceBookingBackup = angular.copy( $scope.resourceBooking );
  };

  $scope.endEditMode = function () {
    const $scope = this;

    $scope.isEditMode = false;
  };

  $scope.abortEditMode = function() {
    const $scope = this;

    $scope.isEditMode = false;
    $scope.resourceBooking = $scope.resourceBookingBackup;
  };

  $scope.deleteResourceBooking = function() {

    // Delete resourceBooking
    ResourceBooking.delete(
      {
        resourceBookingId: $stateParams.id
      }
    ).$promise

      // If everything went ok
      .then( ( response ) => {

        $mdToast.show( $mdToast.simple()
          .content( 'Resursbokningen raderades med ett lyckat resultat' )
          .position( 'top right' )
          .theme( 'success' )
        );

        history.back();
      })
      // Something went wrong
      .catch( ( response ) => {

        // If there was a problem with the in-data
        if ( response.status === 400 || response.status === 500 ){

          $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när Resursbokningen skulle tas bort' )
            .position( 'top right' )
            .theme( 'warn' )
          );
        }

        // If the entry was not found
        if ( response.status === 404 ) {

          $mdToast.show( $mdToast.simple()
            .content( 'Resursbokningen existerar inte längre. Hann kanske någon radera den?' )
            .position( 'top right' )
            .theme( 'warn' )
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

    // Get free resources for this new time.
    getResources();
  };

  $scope.saveResourceBooking = function(){

    const $scope = this;
    const deferred = $q.defer();
    const promise = deferred.promise;

    // Save resourceBooking
    ResourceBooking.save(
      {
        BookingId: $scope.resourceBooking.BookingId,
        ResourceBookingId: $scope.resourceBooking.ResourceBookingId,
        ResourceId: $scope.resourceBooking.ResourceId,
        ResourceCount: $scope.resourceBooking.ResourceCount,
        StartTime: addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).format(),
        EndTime: addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).format(),
        Provisional: $scope.resourceBooking.Provisional
      }
    ).$promise

      // If everything went ok
      .then( ( response ) => {

        $mdToast.show( $mdToast.simple()
          .content( 'Resursbokningen sparades med ett lyckat resultat' )
          .position( 'top right' )
          .theme( 'success' )
        );

        // Resolve promise
        deferred.resolve();

        $ionicHistory.goBack();

        // Something went wrong
      }).catch( ( response ) => {

        // If there there was a foreign key reference
        if ( response.status === 409 ){

          $mdToast.show( $mdToast.simple()
            .content( 'Alla resurser av denna typ är tyvärr redan bokade under vald tidsram.' )
            .position( 'top right' )
            .theme( 'warn' )
          );
        }

        // If there was a problem with the in-data
        else {

          $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när resursbokningen skulle sparas' )
            .position( 'top right' )
            .theme( 'warn' )
          );
        }
      });

    return promise;
  };

  $scope.setSelectedResourceFromId = function( resourceId ){

    $scope.selectedResource = $scope.resources.find( ( resource ) => {

      return resource.ResourceId === Number( resourceId );
    });
  };

  /* Public Methods END */

  /* Initialization START */

  setupModal();
  getResourceBooking().then( () => {
    initDate();
    getCustomer().then( () => {
      getResources();
    });
  });
  initTimeSelectData();

  /* Initialization END */

}]
)

.controller( 'ResourceBookingCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'ResourceBooking', 'Resource', 'BookingHelper', 'Customer', '$q', '$mdToast', '$ionicHistory', 'API_IMG_PATH_URL', 'PHOTO_MISSING_SRC', ( $rootScope, $stateParams, $scope, $state, ResourceBooking, Resource, BookingHelper, Customer, $q, $mdToast, $ionicHistory, API_IMG_PATH_URL, PHOTO_MISSING_SRC ) => {

  /* Init vars */
  $scope.resourceBooking = {
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

      $scope.bookingStartDate = moment( $state.params.startTime ).toDate();
      $scope.bookingStartHour = moment( $state.params.startTime ).hour();
      $scope.bookingStartMinute = moment( $state.params.startTime ).minute();

      $scope.bookingEndDate = moment( $state.params.endTime ).toDate();
      $scope.bookingEndHour = moment( $state.params.endTime ).hour();
      $scope.bookingEndMinute = moment( $state.params.endTime ).add( 59, 'minutes' ).minute();

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

  const getResources = function() {

    // Create promise
    const deferred = $q.defer();

    if ( areDateVariablesDefined() ){

      const startMomentDate = addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute );
      const endMomentDate = addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute );

      Resource.queryFreeForPeriod(
        {
          fromDate: startMomentDate.format( 'YYYY-MM-DD' ),
          fromTime: startMomentDate.format( 'HH:mm' ),
          toDate: endMomentDate.format( 'YYYY-MM-DD' ),
          toTime: endMomentDate.format( 'HH:mm' )
        }
      ).$promise

        // Success
        .then( ( response ) => {

          // Add free resources to scope
          $scope.resources = response;

          // Resolve promise
          deferred.resolve();
        })

        // Could not get free resources
        .catch( ( response ) => {

          $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när uppgifter om lediga resurser skulle hämtas' )
            .position( 'top right' )
            .theme( 'warn' )
          );

          // Reject promise
          deferred.reject();
        });
    }

    return deferred.promise;
  };

  const getCustomers = function(){

    const customers = Customer.query();

    customers.$promise.catch( () => {

      $mdToast.show( $mdToast.simple()
        .content( 'Kunder kunde inte hämtas, var god försök igen.' )
        .position( 'top right' )
        .theme( 'warn' )
      );
    });

    $scope.customers = customers;
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
        .theme( 'warn' )
      );
    })
    .then( () => {
      updateCustomerImageSrc();
    });

    $scope.customer = customer;
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

      $scope.resourceBooking.BookingId = $state.params.bookingId;

      deferred.resolve();

      // There is no booking container, create one
    } else {

      BookingHelper.createBookingContainer( $scope.resourceBooking )

        // If everything went ok
        .then( ( createdBooking ) => {

          // Make created booking accessible from other metods
          $scope.resourceBooking.BookingId = createdBooking.BookingId;

          // Resolve promise
          deferred.resolve();

          // Something went wrong
        }).catch( ( response ) => {

          $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när bokningstillfället skulle sparas' )
            .position( 'top right' )
            .theme( 'warn' )
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

    // Get free resources for this new time.
    getResources();
  };

  $scope.saveResourceBooking = function(){

    const $scope = this;
    const deferred = $q.defer();
    const promise = deferred.promise;

    createBookingContainerIfNeeded()
      .then( () => {

        // Save resourceBooking
        ResourceBooking.save(
          {
            BookingId: $scope.resourceBooking.BookingId,
            ResourceBookingId: 0,
            ResourceId: $scope.resourceBooking.Resource.ResourceId,
            ResourceCount: $scope.resourceBooking.ResourceCount,
            StartTime: addTimeToDate( $scope.bookingStartDate, $scope.bookingStartHour, $scope.bookingStartMinute ).format(),
            EndTime: addTimeToDate( $scope.bookingEndDate, $scope.bookingEndHour, $scope.bookingEndMinute ).format(),
            Provisional: $scope.resourceBooking.Provisional
          }
        ).$promise

          // If everything went ok
          .then( ( response ) => {

            $mdToast.show( $mdToast.simple()
              .content( ' Resursbokningen skapades med ett lyckat resultat' )
              .position( 'top right' )
              .theme( 'success' )
            );

            // Resolve promise
            deferred.resolve();

            $ionicHistory.goBack();

            // Something went wrong
          }).catch( ( response ) => {

            // If there there was a foreign key reference
            if ( response.status === 409 ){

              $mdToast.show( $mdToast.simple()
                .content( 'Resursen är tyvärr redan bokad under vald tidsram.' )
                .position( 'top right' )
                .theme( 'warn' )
              );
            }

            // If there was a problem with the in-data
            else {
              $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när resursbokningen skulle sparas' )
                .position( 'top right' )
                .theme( 'warn' )
              );
            }
          });
      });

    return promise;
  };

  /* Public Methods END */

  /* Initialization START */

  initDate();
  getResources().then( () => {
    if ( $state.params.customerId ){
      getCustomer();
    } else {
      getCustomers();
    }
  });

  initTimeSelectData();

  /* Initialization END */

}]
);