'use strict';

angular.module( 'BookingSystem.furnituring',

    // Dependencies
    []
    )

    // Controller
    .controller( 'FurnituringListCtrl', [ '$scope', '$state', ( $scope, $state ) => {

      /* Init vars */
      // $scope.markerServicesArray = [];

      /* Private methods START */

      const getMarkerServices = function () {
        // $scope.markerServicesArray = Markers.getServices();
      };

      /* Private Methods END */

      /* Public Methods START */

      /* Public Methods END */

      /* Initialization START */

      getMarkerServices();

      // Every time this view is left, do some stuff.
      $scope.$on( '$ionicView.leave', ( scopes, states ) => {

      });

      /* Initialization END */

    }]
    );

