angular.module( 'BookingSystem.httpSettings',

  []
)

// Only send Basic Auth http headers to API_URL, not other URL:s.
.config( ['$httpProvider', ( $httpProvider ) => {

  // Do stuff in every http request
  $httpProvider.interceptors.push( [ '$q', '$rootScope', 'AuthService', '$injector', ( $q, $rootScope, AuthService, $injector ) => {

    return {

      // Only use Authentication header if we are connecting to the REST API.
      request: function ( config ) {

        $rootScope.isLoading = true;

        // If the base url of the request is the same as the API url
        if ( AuthService.apiUrlEqualsUrl( config.url ) ) {

          // If user is not logged in, reject with 401 unauthorized
          if ( !AuthService.isLoggedInCheck() ) {

            return $q.reject({
              config: config,
              status: 401
            });
          }

          // User is logged in, set http Authentication header
          config.headers.Authorization = AuthService.getAuthHeader();
        }

        return config;
      },

      requestError: function( response ) {

        $rootScope.isLoading = false;

        return response;
      },

      response: function( response ) {

        $rootScope.isLoading = false;

        return response;
      },

      // Check if we have been logged out from REST API for some reason.
      responseError: function( rejection ) {

        $rootScope.isLoading = false;

        if (
          AuthService.apiUrlEqualsUrl( rejection.config.url ) &&
          rejection.status === 401
        ) {

          // Remove credentials from local storage / cookies
          AuthService.clearCredentials();

          $rootScope.isLoggedIn = false;

          // Redirect to login
          // $injector.get( '$state' ).go( 'app.login' );

          AuthService.showLoginModal();
        }

        return $q.reject( rejection );
      }
    };
  }]
  );
}]
);