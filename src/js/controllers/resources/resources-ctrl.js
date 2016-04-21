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

    /* Public Methods END */

    /* Initialization START */

    getResource();

    /* Initialization END */
  }]
  );