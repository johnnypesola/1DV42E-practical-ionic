/**
 * Created by Johanna Larsson on 2016-04-24.
 */
'use strict';
angular.module( 'BookingSystem.customers',

  //Dependencies
  []
  )

  // List controller
  .controller( 'CustomersListCtrl', [ '$rootScope', '$scope', '$state', 'Customer', ( $rootScope, $scope, $state, Customer ) => {

    /* Init vars */

    /* Private methods START */

    const getCustomers = function() {

      const customers = Customer.query();

      // In case customers cannot be fetched, display an error to user.
      customers.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Kunder kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.customers = customers;
    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( '$ionicView.enter', ( event, data ) => {
      getCustomers();
    });

    /* Initialization END */

  }]
  )

  //Edit controller
  .controller( 'CustomerDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$ionicModal', '$state', 'Customer', 'CustomerImage', 'API_IMG_PATH_URL', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $ionicModal, $state, Customer, CustomerImage, API_IMG_PATH_URL ) => {
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
      $rootScope.FlashMessage = {
        type: 'success',
        message: 'Kunden "' + $scope.customer.Name + '" sparades med ett lyckat resultat'
      };

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

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Kunden kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.customer = customer;

    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.startEditMode = function () {
      const $scope = this;

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.customerBackup = angular.copy( $scope.customer );
    };

    $scope.endEditMode = function () {
      const $scope = this;

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {
      const $scope = this;

      $scope.isEditMode = false;
      $scope.customer = $scope.customerBackup;
    };

    $scope.saveCustomer = function() {

      const $scope = this;

      // Save customer
      Customer.save(
        {
          CustomerId: $stateParams.customerId,
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

                $rootScope.FlashMessage = {
                  type: 'error',
                  message: 'Kunden sparades, men det gick inte att ladda upp och spara den önskade bilden.'
                };
              });
          }
          else {

            saveSuccess();
          }

          // Something went wrong
        }).catch( ( response ) => {

        // If there there was a foreign key reference
          if ( response.status === 409 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Det finns redan en kund som heter "' + $scope.customer.Name +
              '". Två kunder kan inte heta lika.'
            };
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när kunden skulle sparas'
            };
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Kunden "' + $scope.customer.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };

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

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Kunden "' + $scope.customer.Name + '" raderades med ett lyckat resultat'
          };

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
            $rootScope.FlashMessage = {
              type: 'error',
              message:    'Kunden kan inte raderas eftersom det finns' +
              ' en bokning som refererar till kunden'
            };
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när kunden skulle tas bort'
            };
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Kunden "' + $scope.customer.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };
          }

          history.back();
        });
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();
    getCustomer();

    /* Initialization END */
  }]
  )

  //Create controller
  .controller( 'CustomerCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'Customer', 'CustomerImage', ( $rootScope, $stateParams, $scope, $state, Customer, CustomerImage ) => {

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
      $rootScope.FlashMessage = {
        type: 'success',
        message: 'Kunden "' + $scope.customer.Name + '" sparades med ett lyckat resultat'
      };

      // Redirect
      history.back();
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

                $rootScope.FlashMessage = {
                  type: 'error',
                  message: 'Kunden "' + $scope.customer.Name + '" skapades, men det gick inte att ladda upp och spara den önskade bilden.'
                };

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
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Det finns redan en kund som heter "' + $scope.customer.Name +
              '". Två kunder kan inte heta lika.'
            };
          }

          // If there was a problem with the in-data
          else {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när kunden skulle sparas'
            };
          }
        });
    };

    /* Public Methods END */

    /* Initialization START */

    /* Initialization END */

  }]
  );
