angular.module( 'BookingSystem.httpSettings',

  []
)

// Only send Basic Auth http headers to API_URL, not other URL:s.
.config( ['$httpProvider', ( $httpProvider ) => {

  /*
   // Do stuff in every http request
   $httpProvider.interceptors.push( ( $q, $rootScope, AppSettings, AUTH_TOKEN_STR ) => {

   return {
   // Only use API Key and Auth if we are connecting to the REST API.
   request: function ( config ) {

   $rootScope.isLoading = true;

   // If the base url of the request is the same as the API url
   if ( AppSettings.apiUrlEqualsUrl( config.url ) ) {

   // Use API key
   config.url = config.url + AppSettings.getApiKeyUrl();

   // Use Authentication headers
   config.headers[AUTH_TOKEN_STR] = AppSettings.getToken();
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
   AppSettings.apiUrlEqualsUrl( rejection.config.url ) &&
   rejection.status === 401
   ) {
   // Remove token from local storage
   AppSettings.destroyToken();

   $rootScope.isLoggedIn = false;
   }

   return $q.reject( rejection );
   }
   };
   });
   */
}]
);