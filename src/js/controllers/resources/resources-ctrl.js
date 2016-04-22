/**
 * Created by Johanna Larsson on 2016-04-21.
 */
'use strict';

angular.module( 'BookingSystem.resources',

  // Dependencies
  []
  )

  //Controller
  .controller( 'ResourcesListCtrl', [ '$rootScope', '$scope', '$state', 'Resource', ($rootScope, $scope, $state, Resource) => {

    /* Init vars */

    /* Private methods START */

    const getResources = function () {

      const resources = Resource.query();

      // In case resources cannot be fetched, display an error to user.
      resources.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Resurser kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.resources = resources;

    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */

    getResources();

    /* Initialization END */
  }]
  )

  .controller( 'ResourceDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', '$state', 'Resource', ($rootScope, $scope, $stateParams, $state, Resource ) => {
    /* Init vars */

    $scope.isEditMode = false;
    $scope.resourceBackup = {};

    /* Private methods START */

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

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Resursen "' + $scope.resource.Name + '" sparades med ett lyckat resultat'
          };

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

    /* Public Methods END */

    /* Initialization START */

    getResource();

    /* Initialization END */
  }]
  );