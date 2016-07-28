'use strict';

angular.module( 'BookingSystem.account',

  //Dependencies
  []
  )

  // Edit settings controller

  .controller( 'AccountCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$state', 'Account', 'AccountImage', 'API_IMG_PATH_URL', '$q', '$mdToast', 'AuthService', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $state, Account, AccountImage, API_IMG_PATH_URL, $q, $mdToast, AuthService ) => {
    /* Init vars */

    $scope.isEditMode = false;
    $scope.userBackup = {};
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;

    /* Private methods START */

    const uploadImage = function(){

      return AccountImage.upload( $scope.user.ImageForUpload );

    };

    const saveSuccess = function() {

      // Display success message
      $mdToast.show( $mdToast.simple()
          .content( 'Uppgifterna sparades med ett lyckat resultat' )
          .position( 'top right' )
          .theme( 'success' )
      );
    };

    const saveLocalUserInfo = function () {

      // Update credentials
      const credentials = AuthService.getCredentials();

      credentials.userName = $scope.user.UserName;
      credentials.firstName = $scope.user.FirstName;
      credentials.surName = $scope.user.SurName;
      credentials.imageSrc = $scope.user.ImageSrc;
      credentials.emailAddress = $scope.user.EmailAddress;

      AuthService.setCredentials( credentials );

      AuthService.setRootScopeUserInfo( credentials );
    };

    const getUser = function () {

      const deferred = $q.defer();

      Account.getInfo()
        .then( ( response ) => {

          $scope.user = response.data;
        })

        .catch( () => {
          $mdToast.show( $mdToast.simple()
              .content( 'Uppgifter kunde inte hämtas, var god försök igen.' )
              .position( 'top right' )
              .theme( 'warn' )
          );
        })

        .then( () => {

          // Resolve promise
          deferred.resolve();
        });

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

      Account.changeInfo(
        {
          Id: $rootScope.userInfo.id,
          UserName: $scope.user.UserName,
          FirstName: $scope.user.FirstName,
          SurName: $scope.user.SurName,
          EmailAddress: $scope.user.EmailAddress,
          CellPhoneNumber: $scope.user.CellPhoneNumber,
          ImageSrc: $scope.user.ImageSrc,
          PasswordHash: $scope.user.NewPassword,
          CurrentPasswordHash: $scope.user.CurrentPassword
        }
      )

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();

          if ( typeof $scope.user.ImageForUpload !== 'undefined' ) {

            // Upload image
            uploadImage()

              .then(
                // Success
                ( response ) => {

                  // Update to new image path recieved from server
                  $scope.user.ImageSrc = response.data.imgpath;

                  saveLocalUserInfo();
                },

                // Error
                () => {

                  $mdToast.show( $mdToast.simple()
                      .content( 'Uppgifterna sparades, men det gick inte att ladda upp och spara den önskade bilden.' )
                      .position( 'top right' )
                      .theme( 'warn' )
                  );

                  saveLocalUserInfo();
                }
              );
          }
          else {
            saveLocalUserInfo();
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

          else if ( response.status === 400 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Du angav ett felaktigt befintligt lösenord. Var god försök igen.' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          else if ( response.status === 500 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när uppgifterna skulle sparas' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
                .content( 'Användaren som du är inloggad med existerar inte längre. Har kanske någon raderat den?' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }
        });
    };

    /* Public Methods END */

    /* Initialization START */

    getUser();

    /* Initialization END */
  }]
  );
