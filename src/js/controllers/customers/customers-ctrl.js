/**
 * Created by Johanna Larsson on 2016-04-24.
 */
'use strict';
angular.module( 'BookingSystem.customers',

  //Dependencies
  []
  )

  // List controller
  .controller( 'CustomersListCtrl', [ '$rootScope', '$scope', '$state', 'Customer', '$mdToast', ( $rootScope, $scope, $state, Customer, $mdToast ) => {

    /* Init vars */

    /* Private methods START */

    const getCustomers = function() {

      const customers = Customer.query();

      // In case customers cannot be fetched, display an error to user.
      customers.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Kunder kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
          .theme( 'error' )
        );
      });

      $scope.customers = customers;
    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( '$ionicView.beforeEnter', ( event, data ) => {
      getCustomers();
    });

    /* Initialization END */

  }]
  )

  //Edit controller
  .controller( 'CustomerDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$ionicModal', '$state', 'Customer', 'CustomerImage', 'API_IMG_PATH_URL', '$mdToast', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $ionicModal, $state, Customer, CustomerImage, API_IMG_PATH_URL, $mdToast ) => {
    /* Init vars */

    const modalTemplateUrl = 'templates/modals/customers-delete.html';
    $scope.isEditMode = false;
    $scope.customerBackup = {};
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

    const uploadImage = function( CustomerId ){

      return CustomerImage.upload( $scope.customer.ImageForUpload, CustomerId );

    };

    const saveSuccess = function() {
      // Display success message
      $mdToast.show( $mdToast.simple()
        .content( 'Kunden "' + $scope.customer.Name + '" sparades med ett lyckat resultat' )
        .position( 'top right' )
        .theme( 'success' )
      );

      // Redirect
      history.back();
    };

    const getCustomer = function () {

      const customer = Customer.get(
        {
          customerId: $stateParams.customerId
        }
      );

      // In case customer cannot be fetched, display an error to user.
      customer.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Kunden kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
          .theme( 'error' )
        );
      });

      $scope.customer = customer;

      return customer.$promise;
    };

    const getCustomers = function(){

      const customers = Customer.query();

      customers.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
            .content( 'Kunder kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
            .theme( 'error' )
        );
      });

      $scope.customers = customers;
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.startEditMode = function () {

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.customerBackup = angular.copy( $scope.customer );
    };

    $scope.endEditMode = function () {

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {

      $scope.isEditMode = false;
      $scope.customer = $scope.customerBackup;
    };

    $scope.saveCustomer = function() {

      const $scope = this;

      const emailAddress = $scope.customer.EmailAddress.length > 1 ? $scope.customer.EmailAddress : null;

      // Save customer
      Customer.save(
        {
          CustomerId: $stateParams.customerId,
          Name: $scope.customer.Name,
          Address: $scope.customer.Address,
          PostNumber: $scope.customer.PostNumber,
          City: $scope.customer.City,
          EmailAddress: emailAddress,
          PhoneNumber: $scope.customer.PhoneNumber,
          CellPhoneNumber: $scope.customer.CellPhoneNumber,
          ParentCustomerId: $scope.customer.ParentCustomerId,
          ImageSrc: $scope.customer.ImageSrc,
          Notes: $scope.customer.Notes
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();

          // Upload image
          if ( typeof $scope.customer.ImageForUpload !== 'undefined' ){

            uploadImage( response.CustomerId )

              // Image upload successful
              .success( () => {
                saveSuccess();
              })
              // Image upload failed
              .error( () => {

                $mdToast.show( $mdToast.simple()
                  .content( 'Kunden sparades, men det gick inte att ladda upp och spara den önskade bilden.' )
                  .position( 'top right' )
                  .theme( 'error' )
                );
              });
          }
          else {

            saveSuccess();
          }

          // Something went wrong
        }).catch( ( response ) => {

        // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Det finns redan en kund som heter "' + $scope.customer.Name +
                '". Två kunder kan inte heta lika.' )
              .position( 'top right' )
              .theme( 'error' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när kunden skulle sparas' )
              .position( 'top right' )
              .theme( 'error' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
              .content( 'Kunden "' + $scope.customer.Name + '" existerar inte längre. Hann kanske någon radera den?' )
              .position( 'top right' )
              .theme( 'error' )
            );

            history.back();
          }
        });
    };

    $scope.deleteCustomer = function() {

      // Delete customer
      Customer.delete(
        {
          customerId: $stateParams.customerId
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $mdToast.show( $mdToast.simple()
            .content( 'Kunden "' + $scope.customer.Name + '" raderades med ett lyckat resultat' )
            .position( 'top right' )
            .theme( 'success' )
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
              .content( 'Kunden kan inte raderas eftersom det finns' +
                ' en bokning som refererar till kunden' )
              .position( 'top right' )
              .theme( 'error' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när kunden skulle tas bort' )
              .position( 'top right' )
              .theme( 'error' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
              .content( 'Kunden "' + $scope.customer.Name + '" existerar inte längre. Hann kanske någon radera den?' )
              .position( 'top right' )
              .theme( 'error' )
            );
            $rootScope.FlashMessage = {
              type: 'error',
              message: ''
            };
          }

          history.back();
        });
    };

    $scope.fixPostFormat = function() {

      if ( !$scope.customer.PostNumber ) {
        return;
      }

      // Add space if needed
      if ( $scope.customer.PostNumber.length >= 5 && $scope.customer.PostNumber[3] !== ' ' ) {
        $scope.customer.PostNumber = $scope.customer.PostNumber.substring( 0, 3 ) + ' ' + $scope.customer.PostNumber.substring( 3 );
      }

      // Limit length
      if ( $scope.customer.PostNumber.length > 6 ) {
        $scope.customer.PostNumber = $scope.customer.PostNumber.substring( 0, 6 );
      }
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();
    getCustomer().then( () => getCustomers() );

    /* Initialization END */
  }]
  )

  //Create controller
  .controller( 'CustomerCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'Customer', 'CustomerImage', '$mdToast', ( $rootScope, $stateParams, $scope, $state, Customer, CustomerImage, $mdToast ) => {

    /* Init vars */
    $scope.customer = {};

    /* Private methods START */

    // Upload image
    const uploadImage = ( CustomerId ) => {

      return CustomerImage.upload( $scope.customer.ImageForUpload, CustomerId );

    };

    // Display success message
    const saveSuccess = () => {

      // Display success message
      $mdToast.show( $mdToast.simple()
        .content( 'Kunden "' + $scope.customer.Name + '" sparades med ett lyckat resultat' )
        .position( 'top right' )
        .theme( 'success' )
      );

      // Redirect
      history.back();
    };

    const getCustomers = function(){

      const customers = Customer.query();

      customers.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
            .content( 'Kunder kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
            .theme( 'error' )
        );
      });

      $scope.customers = customers;
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.saveCustomer = function() {

      const $scope = this;

      // Save customer
      Customer.save(
        {
          CustomerId: 0,
          Name: $scope.customer.Name,
          Address: $scope.customer.Address,
          PostNumber: $scope.customer.PostNumber,
          City: $scope.customer.City,
          EmailAddress: $scope.customer.EmailAddress,
          PhoneNumber: $scope.customer.PhoneNumber,
          CellPhoneNumber: $scope.customer.CellPhoneNumber,
          ParentCustomerId: $scope.customer.ParentCustomerId,
          ImageSrc: $scope.customer.ImageSrc,
          Notes: $scope.customer.Notes
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          if ( typeof $scope.customer.ImageForUpload !== 'undefined' ) {

            // Upload image
            uploadImage( response.CustomerId )

              // Image upload successful
              .success( ( data ) => {

                saveSuccess();
              })
              // Image upload failed
              .error( () => {

                $mdToast.show( $mdToast.simple()
                  .content( 'Kunden "' + $scope.customer.Name + '" skapades, men det gick inte att ladda upp och spara den önskade bilden.' )
                  .position( 'top right' )
                  .theme( 'error' )
                );

                // Redirect
                history.back();
              });

          } else {
            saveSuccess();
          }

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Det finns redan en kund som heter "' + $scope.customer.Name +
                '". Två kunder kan inte heta lika.' )
              .position( 'top right' )
              .theme( 'success' )
            );
          }

          // If there was a problem with the in-data
          else {
            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när kunden skulle sparas' )
              .position( 'top right' )
              .theme( 'error' )
            );
          }
        });
    };

    $scope.fixPostFormat = function() {

      if ( !$scope.customer.PostNumber ) {
        return;
      }

      // Add space if needed
      if ( $scope.customer.PostNumber.length >= 5 && $scope.customer.PostNumber[3] !== ' ' ) {
        $scope.customer.PostNumber = $scope.customer.PostNumber.substring( 0, 3 ) + ' ' + $scope.customer.PostNumber.substring( 3 );
      }

      // Limit length
      if ( $scope.customer.PostNumber.length > 6 ) {
        $scope.customer.PostNumber = $scope.customer.PostNumber.substring( 0, 6 );
      }
    };

    /* Public Methods END */

    /* Initialization START */

    getCustomers();

    /* Initialization END */

  }]
  );
