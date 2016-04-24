/**
 * Created by Johanna Larsson on 2016-04-24.
 */
'use strict';
angular.module( 'BookingSystem.customers',

  //Dependencies
  []
  )

  //Controller
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
  );