'use strict';

angular.module( 'BookingSystem.users',

  //Dependencies
  []
  )

  //Controller
  .controller( 'UsersListCtrl', [ '$rootScope', '$scope', '$state', 'User', '$mdToast', 'API_IMG_PATH_URL', ( $rootScope, $scope, $state, User, $mdToast, API_IMG_PATH_URL ) => {

    /* Init vars */
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;

    /* Private methods START */

    const getUsers = function() {

      const users = User.query();

      // In case users cannot be fetched, display an error to user.
      users.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
          .content( 'Användare kunde inte hämtas, var god försök igen.' )
          .position( 'top right' )
          .theme( 'warn' )
        );
      });

      $scope.users = users;
    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( '$ionicView.beforeEnter', ( event, data ) => {
      getUsers();
    });

    /* Initialization END */

  }]
  )

  //Edit controller

  .controller( 'UserDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$ionicModal', '$state', 'User', '$mdToast', 'API_IMG_PATH_URL', 'UserImage', '$q',( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $ionicModal, $state, User, $mdToast, API_IMG_PATH_URL, UserImage, $q ) => {
    /* Init vars */

    const deleteModalTemplateUrl = 'templates/modals/user-delete.html';
    $scope.isEditMode = false;
    $scope.userBackup = {};
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;

    /* Private methods START */

    const setupDeleteModal = function(){

      $ionicModal.fromTemplateUrl( deleteModalTemplateUrl, {
        scope: $scope,
        animation: MODAL_ANIMATION
      })
        .then( ( response ) => {

          $scope.deleteModal = response;
        });

      // Cleanup the modal when we're done with it!
      $scope.$on( '$destroy', () => {
        $scope.deleteModal.remove();
      });
    };

    const uploadImage = function( UserId ){

      return UserImage.upload( $scope.user.ImageForUpload, UserId );

    };

    const saveSuccess = function() {
      // Display success message
      $mdToast.show( $mdToast.simple()
          .content( 'Användaren "' + $scope.user.FirstName + ' ' + $scope.user.SurName + '" sparades med ett lyckat resultat' )
          .position( 'top right' )
          .theme( 'success' )
      );

      // Redirect
      history.back();
    };

    const getUser = function () {

      const deferred = $q.defer();

      const user = User.get(
        {
          userId: $stateParams.userId
        }
      );

      user.$promise.catch( () => {
        $mdToast.show( $mdToast.simple()
            .content( 'Användaren kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      })

        .then( () => {

          // Resolve promise
          deferred.resolve();
        });

      $scope.user = user;

      return deferred.promise;
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.startEditMode = function () {

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.userBackup = angular.copy( $scope.user );
    };

    $scope.endEditMode = function () {

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {

      $scope.isEditMode = false;
      $scope.user = $scope.userBackup;
    };

    $scope.saveUser = function() {

      const $scope = this;

      // Save resource
      User.save(
        {
          Id: $stateParams.userId,
          UserName: $scope.user.UserName,
          FirstName: $scope.user.FirstName,
          SurName: $scope.user.SurName,
          EmailAddress: $scope.user.EmailAddress,
          CellPhoneNumber: $scope.user.CellPhoneNumber,
          ImageSrc: $scope.user.ImageSrc,
          PasswordHash: $scope.user.Password
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();

          if ( typeof $scope.user.ImageForUpload !== 'undefined' ) {

            // Upload image
            uploadImage( response.Id )

              // Image upload failed
              .error( () => {

                $mdToast.show( $mdToast.simple()
                    .content( 'Användaren "' + $scope.user.FirstName + ' ' + $scope.user.SurName + '" sparades, men det gick inte att ladda upp och spara den önskade bilden.' )
                    .position( 'top right' )
                    .theme( 'warn' )
                );

                // Redirect
                history.back();
              });

          }

          saveSuccess();

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Det finns redan en användare med den angivna e-postadressen eller användarnamnet. Var god försök igen.' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när användaren skulle sparas' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
                .content( 'Användaren "' + $scope.user.FirstName + ' ' + $scope.user.SurName + '" existerar inte längre. Hann kanske någon radera den?' )
                .position( 'top right' )
                .theme( 'warn' )
            );

            history.back();
          }
        });
    };

    $scope.deleteUser = function() {

      // Delete user
      User.delete(
        {
          userId: $stateParams.userId
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $mdToast.show( $mdToast.simple()
              .content( 'Användaren "' + $scope.user.FirstName + ' ' + $scope.user.SurName + '" raderades med ett lyckat resultat' )
              .position( 'top right' )
              .theme( 'success' )
          );

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
            $mdToast.show( $mdToast.simple()
                .content( 'Användaren kan inte raderas eftersom det finns' +
                ' en eller flera bokningar som refererar till användaren' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när användaren skulle tas bort' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
                .content( 'Användaren "' + $scope.user.FirstName + ' ' + $scope.user.SurName + '" existerar inte längre. Hann kanske någon radera den?' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          history.back();
        });
    };

    /* Public Methods END */

    /* Initialization START */

    setupDeleteModal();

    getUser();

    /* Initialization END */
  }]
  )
  //Create controller
  .controller( 'UserCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'User', '$mdToast', 'UserImage', 'MODAL_ANIMATION', '$ionicModal', '$q', ( $rootScope, $stateParams, $scope, $state, User, $mdToast, UserImage, MODAL_ANIMATION, $ionicModal, $q ) => {

    /* Init vars */
    $scope.isEditMode = true;

    /* Private methods START */

    // Upload image
    const uploadImage = ( UserId ) => {

      return UserImage.upload( $scope.user.ImageForUpload, UserId );

    };

    const saveSuccess = ( user ) => {

      // Display success message
      $mdToast.show( $mdToast.simple()
          .content( 'Användaren "' + user.FirstName + ' ' + user.SurName + '" sparades med ett lyckat resultat' )
          .position( 'top right' )
          .theme( 'success' )
      );

      // Redirect
      history.back();
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.saveUser = function() {

      const $scope = this;

      // Save user
      User.save(
        {
          Id: 0,
          UserName: $scope.user.UserName,
          FirstName: $scope.user.FirstName,
          SurName: $scope.user.SurName,
          EmailAddress: $scope.user.EmailAddress,
          CellPhoneNumber: $scope.user.CellPhoneNumber,
          ImageSrc: $scope.user.ImageSrc,
          PasswordHash: $scope.user.Password
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          if ( typeof $scope.user.ImageForUpload !== 'undefined' ) {

            // Upload image
            uploadImage( response.Id )

              // Image upload failed
              .error( () => {

                $mdToast.show( $mdToast.simple()
                    .content( 'Användaren "' + $scope.user.FirstName + ' ' + $scope.user.SurName + '" skapades, men det gick inte att ladda upp och spara den önskade bilden.' )
                    .position( 'top right' )
                    .theme( 'warn' )
                );

                // Redirect
                history.back();
              })

              .then( () => {

                saveSuccess( $scope.user );
              });
          }
          else {
            saveSuccess( $scope.user );
          }

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
              .content( 'Det finns redan en användare med användarnamnet "' + $scope.user.UserName +
                '" eller e-postadressen "' + $scope.user.EmailAddress + '"' )
              .position( 'top right' )
              .theme( 'warn' )
            );
          }

          // If there was a problem with the in-data
          else {

            $mdToast.show( $mdToast.simple()
              .content( 'Ett oväntat fel uppstod när användaren skulle sparas' )
              .position( 'top right' )
              .theme( 'warn' )
            );
          }
        });
    };

    /* Public Methods END */

    /* Initialization START */

    /* Initialization END */

  }]
  );
