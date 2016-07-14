'use strict';

angular.module( 'BookingSystem.usersServices',

  [
    'ngResource'
  ]
)
  .factory( 'User', ['$resource', 'API_URL', ( $resource, API_URL ) => {

    return $resource(
      API_URL + 'User/:userId',
      {userId: '@userId'},
      {
        changePasswordForUser: {
          url: API_URL + 'User/password/:userId',
          id: '@id',
          method: 'POST',
          params: {
            userId: '@userId'
          }
        }
      }
    );
  }]
)

  .factory( 'UserImage', ['$http', 'API_URL', ( $http, API_URL ) => {

    return {
      upload : function( imageData, userId ) {

        return $http(
          {
            method: 'POST',
            url: API_URL + 'User/image/' + userId,
            data: imageData,
            headers: {'Content-Type': undefined}
          }
        );
      }
    };
  }]
);