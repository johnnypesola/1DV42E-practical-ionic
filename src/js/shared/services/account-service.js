'use strict';

angular.module( 'BookingSystem.accountServices',

  [
    'ngResource'
  ]
)
  .factory( 'Account', ['$resource', '$http', '$httpParamSerializer', 'API_URL', 'API_LOGIN_URL', 'API_LOGOUT_URL', ( $resource, $http, $httpParamSerializer, API_URL, API_LOGIN_URL, API_LOGOUT_URL ) => {

    return {

      login : function( username, password ) {

        return $http.post( API_LOGIN_URL,
          $httpParamSerializer({
            grant_type: 'password',
            UserName: username,
            Password: password
          }),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
          }
        );
      },

      logout : function () {
        return $http.post( API_LOGOUT_URL );
      },

      getInfo : function() {
        return $http.get(
          API_URL + 'Account/GetInfo'
        );
      },

      changeInfo : function( data ) {
        return $http(
          {
            method: 'POST',
            url: API_URL + 'Account/ChangeInfo/',
            data: data
          }
        );
      }
    };
  }]
)

  .factory( 'AccountImage', ['$http', 'API_URL', ( $http, API_URL ) => {

    return {
      upload : function( imageData ) {
        return $http(
          {
            method: 'POST',
            url: API_URL + 'Account/Image/',
            data: imageData,
            headers: {'Content-Type': undefined}
          }
        );
      }
    };
  }]
);