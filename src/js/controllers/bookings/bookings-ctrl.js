'use strict';

angular.module( 'BookingSystem.bookings',

  // Dependencies
  []
  )

  // Controller
  .controller( 'BookingListCtrl', [ '$rootScope', '$scope', '$state', 'Booking', '$mdToast', ( $rootScope, $scope, $state, Booking, $mdToast ) => {

    /* Init vars */

    /* Private methods START */

    const getBookings = function () {

      const bookings = Booking.query();

      // In case booking cannot be fetched, display an error to user.
      bookings.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Bokningstillfällen kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
        );
      });

      $scope.bookings = bookings;
    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */
    $scope.$on( '$ionicView.enter', ( event, data ) => {
      getBookings();
    });

    /* Initialization END */

  }]
  )

  .controller( 'BookingDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', '$ionicModal', 'Booking', 'API_IMG_PATH_URL', '$mdToast', 'Customer', 'PHOTO_MISSING_SRC', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, $ionicModal, Booking, API_IMG_PATH_URL, $mdToast, Customer, PHOTO_MISSING_SRC ) => {

    /* Init vars */
    const modalTemplateUrl = 'templates/modals/booking-delete.html';
    $scope.editMode = false;
    $scope.bookingBackup = {};
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;
    $scope.customerImageSrc = PHOTO_MISSING_SRC;

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
          $scope.booking.Discount *= 100;
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

            history.back();
          }
        });
    };

    $scope.deleteBooking = function() {

      // Delete booking
      Booking.delete(
        {
          bookingId: $stateParams.bookingId
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $mdToast.show( $mdToast.simple()
            .content( 'Bokningstillfället "' + $scope.booking.Name + '" raderades med ett lyckat resultat' )
            .position( 'top right' )
          );

          history.back();
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

          history.back();
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
