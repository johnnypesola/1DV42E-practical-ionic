/**
 * Created by Johanna Larsson on 2016-04-21.
 */
'use strict';

angular.module( 'BookingSystem.resources',

  // Dependencies
  []
  )

  //List controller
  .controller( 'ResourcesListCtrl', [ '$rootScope', '$scope', '$state', '$mdToast', 'Resource', ($rootScope, $scope, $state, $mdToast, Resource) => {

    /* Init vars */

    /* Private methods START */

    const getResources = function () {

      const resources = Resource.query();

      // In case resources cannot be fetched, display an error to user.
      resources.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Resurser kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
        );
      });

      $scope.resources = resources;

    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( '$ionicView.enter', ( event, data ) => {
      getResources();
    });

    /* Initialization END */
  }]
  )

  //Edit controller
  .controller( 'ResourceDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$ionicModal', '$state', 'Resource', 'ResourceImage',($rootScope, $scope, $stateParams, MODAL_ANIMATION, $ionicModal, $state, Resource, ResourceImage ) => {
    /* Init vars */

    const modelTemplateUrl = 'templates/modals/resources-delete.html';
    $scope.isEditMode = false;
    $scope.resourceBackup = {};

    /* Private methods START */

    const setupModal = function(){

      $ionicModal.fromTemplateUrl( modelTemplateUrl, {
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

    const uploadImage = function( ResourceId ){

      return ResourceImage.upload( $scope.resource.ImageForUpload, ResourceId );

    };

    const saveSuccess = function() {
      // Display success message
      $rootScope.FlashMessage = {
        type: 'success',
        message: 'Resursen "' + $scope.resource.Name + '" sparades med ett lyckat resultat'
      };

      // Redirect
      history.back();
    };

    const getResource = function () {

      const resource = Resource.get(
        {
          resourceId: $stateParams.resourceId
        }
      );

      // In case resource cannot be fetched, display an error to user.
      resource.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Resurs kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.resource = resource;

    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.startEditMode = function () {
      const $scope = this;

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.resourceBackup = angular.copy( $scope.resource );
    };

    $scope.endEditMode = function () {
      const $scope = this;

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {
      const $scope = this;

      $scope.isEditMode = false;
      $scope.resource = $scope.resourceBackup;
    };

    $scope.saveResource = function() {

      const $scope = this;

      // Save resource
      Resource.save(
        {
          ResourceId: $stateParams.resourceId,
          Name: $scope.resource.Name,
          Count: $scope.resource.Count,
          BookingPricePerHour: $scope.resource.BookingPricePerHour,
          MinutesMarginAfterBooking: $scope.resource.MinutesMarginAfterBooking,
          WeekEndCount: $scope.resource.WeekEndCount
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();

          // Upload image
          if ( typeof $scope.resource.ImageForUpload !== 'undefined' ){

            uploadImage( response.ResourceId )

            // Image upload successful
              .success( () => {
                saveSuccess();
              })
              // Image upload failed
              .error( () => {

                $rootScope.FlashMessage = {
                  type: 'error',
                  message: 'Resursen sparades, men det gick inte att ladda upp och spara den önskade bilden.'
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
            message: 'Det finns redan en resurs som heter "' + $scope.resource.Name +
            '". Två resurser kan inte heta lika.'
          };
        }

        // If there was a problem with the in-data
        else if ( response.status === 400 || response.status === 500 ){
          $rootScope.FlashMessage = {
            type: 'error',
            message: 'Ett oväntat fel uppstod när resursen skulle sparas'
          };
        }

        // If the entry was not found
        if ( response.status === 404 ) {
          $rootScope.FlashMessage = {
            type: 'error',
            message: 'Resursen "' + $scope.resource.Name + '" existerar inte längre. Hann kanske någon radera den?'
          };

          history.back();
        }
      });
    };

    $scope.deleteResource = function() {

      // Delete resource
      Resource.delete(
        {
          resourceId: $stateParams.resourceId
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Resursen "' + $scope.resource.Name + '" raderades med ett lyckat resultat'
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
              message:    'Resursen kan inte raderas eftersom det finns' +
              ' en lokalbokning eller en lokalresurs som refererar till resursen'
            };
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när resursen skulle tas bort'
            };
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Resursen "' + $scope.resource.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };
          }

          history.back();
        });
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();
    getResource();

    /* Initialization END */
  }]
  )

  //Create controller
  .controller( 'ResourceCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'Resource', ( $rootScope, $stateParams, $scope, $state, Resource ) => {

    /* Init vars */
    $scope.resource = {};

    /* Private methods START */

    /* Private Methods END */

    /* Public Methods START */

    $scope.saveResource = function() {

      const $scope = this;

      // Save resource
      Resource.save(
        {
          ResourceId: 0,
          Name: $scope.resource.Name,
          Count: $scope.resource.Count,
          BookingPricePerHour: $scope.resource.BookingPricePerHour,
          MinutesMarginAfterBooking: $scope.resource.MinutesMarginAfterBooking,
          WeekEndCount: $scope.resource.WeekEndCount
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Resursen "' + $scope.resource.Name + '" skapades med ett lyckat resultat'
          };

          history.back();

          // Something went wrong
        }).catch( ( response ) => {

        // If there there was a foreign key reference
        if ( response.status === 409 ){
          $rootScope.FlashMessage = {
            type: 'error',
            message: 'Det finns redan en resurs som heter "' + $scope.resource.Name +
            '". Två resurser kan inte heta lika.'
          };
        }

        // If there was a problem with the in-data
        else {
          $rootScope.FlashMessage = {
            type: 'error',
            message: 'Ett oväntat fel uppstod när resursen skulle sparas'
          };
        }
      });
    };

    /* Public Methods END */

    /* Initialization START */

    /* Initialization END */

  }]
  );
