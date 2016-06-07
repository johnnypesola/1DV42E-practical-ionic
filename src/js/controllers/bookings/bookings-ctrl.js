'use strict';

angular.module( 'BookingSystem.bookings',

  // Dependencies
  []
  )

  // Controller
  .controller( 'BookingViewCtrl', [ '$rootScope', '$scope', '$state', 'Booking', 'LocationBooking', 'ResourceBooking', 'MealBooking', '$interval', 'DATA_SYNC_INTERVAL_TIME', '$ionicGesture', '$mdToast', 'DEFAULT_CALENDAR_ZOOM', '$stateParams', '$ionicHistory', '$ionicModal', 'MODAL_ANIMATION', 'BOOKING_TYPES', ( $rootScope, $scope, $state, Booking, LocationBooking, ResourceBooking, MealBooking, $interval, DATA_SYNC_INTERVAL_TIME, $ionicGesture, $mdToast, DEFAULT_CALENDAR_ZOOM, $stateParams, $ionicHistory, $ionicModal, MODAL_ANIMATION, BOOKING_TYPES ) => {

    /* Init vars */
    const modalTemplateUrl = 'templates/modals/booking-create-choose-type.html';
    const updateIntervalTime = DATA_SYNC_INTERVAL_TIME;
    let updateInterval = null, weekStartDate = null, weekEndDate = null;
    $scope.zoom = DEFAULT_CALENDAR_ZOOM;
    $scope.weekDate = moment();
    $scope.bookingTypes = BOOKING_TYPES;
    $scope.bookingsType = $scope.bookingTypes.booking;

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

    const setCalendarTitle = function () {

      switch ( $scope.bookingsType ) {
        case $scope.bookingTypes.booking:
          $scope.calendarTitle = 'Bokningstillfällen';
          break;
        case $scope.bookingTypes.location:
          $scope.calendarTitle = 'Lokalbokningar';
          break;
        case $scope.bookingTypes.resource:
          $scope.calendarTitle = 'Resursbokningar';
          break;
        case $scope.bookingTypes.meal:
          $scope.calendarTitle = 'Måltidsbokningar';
          break;
        default:
          $scope.calendarTitle = 'Bokningstillfällen';
      }
    };

    const getBookings = function () {

      let bookings;

      switch ( $scope.bookingsType ) {

        // If its a booking
        case $scope.bookingTypes.booking:

          bookings = Booking.queryLessForPeriod({
            fromDate: weekStartDate.format( 'YYYY-MM-DD' ),
            toDate: weekEndDate.format( 'YYYY-MM-DD' )
          });
          break;

        // If its a location booking
        case $scope.bookingTypes.location:

          bookings = LocationBooking.queryLessForPeriod({
            fromDate: weekStartDate.format( 'YYYY-MM-DD' ),
            toDate: weekEndDate.format( 'YYYY-MM-DD' )
          });
          break;

        // If its a resource booking
        case $scope.bookingTypes.resource:

          bookings = ResourceBooking.queryLessForPeriod({
            fromDate: weekStartDate.format( 'YYYY-MM-DD' ),
            toDate: weekEndDate.format( 'YYYY-MM-DD' )
          });
          break;

        // If its a meal booking
        case $scope.bookingTypes.meal:
          bookings = MealBooking.queryLessForPeriod({
            fromDate: weekStartDate.format( 'YYYY-MM-DD' ),
            toDate: weekEndDate.format( 'YYYY-MM-DD' )
          });
          break;

        default:
          bookings = {};
      }

      // const bookings = Booking.query();

      // In case Booking cannot be fetched, display an error to user.
      bookings.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
            .content( 'Bokningar kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
        );
      })

        .then( ( bookings ) => {
          $scope.bookings = bookings;
        });
    };

    const startUpdateInterval = function (){

      updateInterval = $interval( () => {

        getBookings();

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

      getBookings();
    };

    $scope.toPreviousWeek = function() {
      setupWeekStartAndEndDates( -1 );

      getBookings();
    };

    $scope.changeBookingTypeTo = function( bookingTypeStr ) {

      // We are actually in parent scope at the moment. Therefore we need to broadcast.
      $scope.$broadcast( 'changed-booking-type', { bookingType: bookingTypeStr });

    };

    $scope.createBookingOfType = function( bookingTypeStr ) {

      // Redirect to edit view
      $state.go( 'app.' + bookingTypeStr + '-create' );

      $scope.modal.hide();
    };

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( 'changed-booking-type', ( event, args ) => {

      $scope.bookingsType = args.bookingType;
      getBookings();
    });

    $scope.$on( '$ionicView.enter', ( event, data ) => {

      setupWeekStartAndEndDates();
      getBookings();
      startUpdateInterval();
      setCalendarTitle();
      setupModal();
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

  .controller( 'BookingDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', 'Booking', 'API_IMG_PATH_URL', '$mdToast', 'Customer', 'PHOTO_MISSING_SRC', '$ionicHistory', 'BOOKING_TYPES', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, Booking, API_IMG_PATH_URL, $mdToast, Customer, PHOTO_MISSING_SRC, $ionicHistory, BOOKING_TYPES ) => {

    /* Init vars */
    const modalTemplateUrl = 'templates/modals/booking-delete.html';
    $scope.editMode = false;
    $scope.bookingBackup = {};
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;
    $scope.customerImageSrc = PHOTO_MISSING_SRC;
    $scope.bookingTypes = BOOKING_TYPES;

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

    const getCustomers = function(){

      const customers = Customer.query();

      customers.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
            .content( 'Kunder kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
        );
      });

      $scope.customers = customers;
    };

    const getBooking = function () {

      const booking = Booking.get(
        {
          bookingId: $stateParams.id
        }
      );

      // In case booking cannot be fetched, display an error to user.
      booking.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Bokningstillfälle kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
        );
      })

        .then( () => {

          // Setup discount value
          $scope.booking.Discount *= 100;

          // Setup correct customer image to be displayed
          $scope.updateCustomerImageSrc();
        });

      $scope.booking = booking;
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.updateCustomerImageSrc = function() {

      const currentCustomer = $scope.customers.find( ( customer ) => {

        return customer.CustomerId === Number( $scope.booking.CustomerId );
      });

      $scope.customerImageSrc = (
        currentCustomer.ImageSrc !== null && currentCustomer.ImageSrc.length > 1 ? API_IMG_PATH_URL + currentCustomer.ImageSrc : PHOTO_MISSING_SRC
      );
    };

    $scope.startEditMode = function () {
      const $scope = this;

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.bookingBackup = angular.copy( $scope.booking );
    };

    $scope.endEditMode = function () {
      const $scope = this;

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {
      const $scope = this;

      $scope.$parent.isEditMode = false;
      $scope.booking = $scope.bookingBackup;
    };

    $scope.saveBooking = function() {

      const $scope = this;

      // Save booking
      Booking.save(
        {
          BookingTypeId: 1, // TODO: Implement booking types
          BookingId: $stateParams.id,
          CustomerId: $scope.booking.CustomerId,
          NumberOfPeople: $scope.booking.NumberOfPeople,
          Notes: $scope.booking.Notes,
          Discount: ( $scope.booking.Discount / 100 )
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();

          $mdToast.show( $mdToast.simple()
            .content( 'Bokningstillfället sparades med ett lyckat resultat' )
            .position( 'top right' )
          );

          $ionicHistory.goBack();

          // Something went wrong
        }).catch( ( response ) => {

          // If there was a problem with the in-data
          if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när bokningstillfället skulle sparas' )
              .position( 'top right' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
              .content( 'Bokningstillfället existerar inte längre. Hann kanske någon radera den?' )
              .position( 'top right' )
            );

            $ionicHistory.goBack();
          }
        });
    };

    $scope.deleteBooking = function() {

      // Delete booking
      Booking.delete(
        {
          bookingId: $stateParams.id
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $mdToast.show( $mdToast.simple()
            .content( 'Bokningstillfället raderades med ett lyckat resultat' )
            .position( 'top right' )
          );

          $ionicHistory.goBack();
        })
        // Something went wrong
        .catch( ( response ) => {

          // If there there was a foreign key reference
          if (
            response.status === 400 &&
            response.data.Message !== 'undefined' &&
            response.data.Message === 'Foreign key references exists'
          ){
            $mdToast.show( $mdToast.simple()
              .content( 'Bokningstillfället kan inte raderas eftersom det finns' +
                ' en lokalbokning, resursbokning eller en måltidsbokning som refererar till bokningstillfället' )
              .position( 'top right' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när bokningstillfället skulle tas bort' )
              .position( 'top right' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
              .content( 'Bokningstillfället "' + $scope.booking.Name + '" existerar inte längre. Hann kanske någon radera den?' )
              .position( 'top right' )
            );
          }

          $ionicHistory.goBack();
        });
    };

    $scope.createBookingOfType = function( bookingTypeStr ) {

      // Redirect to create view
      $state.go( 'app.' + bookingTypeStr + '-create', {
        bookingId: $stateParams.id
      });
    };

    $scope.showBooking = function( id, bookingTypeStr ) {

      // Redirect to edit view
      $state.go( 'app.' + bookingTypeStr + '-details', {
        id: id
      });
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();
    getBooking();
    getCustomers();

    /* Initialization END */

  }]
  )

  .controller( 'BookingCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'Booking', '$mdToast', ( $rootScope, $stateParams, $scope, $state, Booking, $mdToast ) => {

    /* Init vars */
    $scope.booking = {};

    /* Private methods START */

    /* Private Methods END */

    /* Public Methods START */

    $scope.saveBooking = function() {

      const $scope = this;

      // Save booking
      Booking.save(
        {
          BookingId: 0,
          Name: $scope.booking.Name
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $mdToast.show( $mdToast.simple()
            .content( 'Bokningstillfället "' + $scope.booking.Name + '" skapades med ett lyckat resultat' )
            .position( 'top right' )
          );

          history.back();

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Det finns redan ett bokningstillfälle som heter "' + $scope.booking.Name +
                '". Två bokningstillfällen kan inte heta lika.' )
              .position( 'top right' )
            );
          }

          // If there was a problem with the in-data
          else {
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när bokningstillfället skulle sparas' )
              .position( 'top right' )
            );
          }
        });
    };

    /* Public Methods END */

    /* Initialization START */

    /* Initialization END */

  }]
  );
