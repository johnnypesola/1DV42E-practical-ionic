angular.module( 'BookingSystem.authService',

  // Dependencies
  ['ngCookies']
)
  .service( 'AuthService', [ '$q', '$cookies', '$timeout', '$rootScope', 'API_URL', 'MODAL_ANIMATION', '$injector', '$http', 'Account', '$state', function( $q, $cookies, $timeout, $rootScope, API_URL, MODAL_ANIMATION, $injector, $http, Account, $state ) {

    // Init values
    const CURRENT_USER_STR = 'currentUser';
    const loginModalTemplateUrl = 'templates/modals/login.html';
    const that = this;
    let credentials = null;

    this.showLoginModal = function(){

      // Only init modal if there is no modal.
      if (
          $rootScope.loginModal === undefined ||
          $rootScope.loginModal === null ||
          $rootScope.loginModal !== undefined && $rootScope.loginModal.isShown !== undefined && !$rootScope.loginModal.isShown()
      ) {

        $rootScope.loginModal = {};

        // Inject ionic modal to avoid circular dependency.
        const ionicModal = $injector.get( '$ionicModal' );

        // Load modal template and set scope.
        ionicModal.fromTemplateUrl( loginModalTemplateUrl, {
          scope: $rootScope,
          animation: MODAL_ANIMATION,
          backdropClickToClose: false,
          hardwareBackButtonClose: false
        })
          .then( ( response ) => {

            // Store modal in root scope
            $rootScope.loginModal = response;

            // Show the modal when loaded.
            $rootScope.loginModal.show();
          });

        // Cleanup the modal when we're done with it
        $rootScope.$on( 'loginModal.hidden', () => {
          $rootScope.loginModal.remove();
        });

        $rootScope.$on( 'loginModal.removed', () => {
          $rootScope.loginModal = null;
        });
      }
    };

    this.login = function ( username, password ) {

      return Account.login( username, password );
    };

    this.logout = function () {

      const promise = Account.logout();

      promise.then( () => {
        that.clearCredentials();
      });

      return promise;
    };

    this.isLoggedInCheck = function () {

      // Try to get cookie credentials. Determine if user is logged in.
      const isLoggedIn = $cookies.get( CURRENT_USER_STR ) !== undefined;

      // Update rootscope variable if needed
      if ( $rootScope.isLoggedIn !== isLoggedIn ) {
        $rootScope.isLoggedIn = isLoggedIn;
      }

      // If auth token is valid
      return isLoggedIn;
    };

    this.setCredentials = function ( credentialsObj ) {

      credentials = credentialsObj;

      that.setRootScopeUserInfo( credentials );

      $cookies.putObject( CURRENT_USER_STR, credentialsObj );
    };

    this.getCredentials = function () {

      if ( credentials === null ) {

        credentials = $cookies.getObject( CURRENT_USER_STR );

        if ( credentials ) {
          that.setRootScopeUserInfo( credentials );
        }
      }

      return credentials;
    };

    this.setRootScopeUserInfo = function( userObj ) {

      // Store some not so sensitive values in rootScope
      $rootScope.userInfo = {
        id: userObj.id,
        userName: userObj.userName,
        firstName: userObj.firstName,
        surName: userObj.surName,
        imageSrc: userObj.imageSrc,
        emailAddress: userObj.emailAddress
      };
    };

    this.getAuthHeader = function() {

      let returnValue = false;
      const currentDateObj = new Date();

      // Get current logged in user from cookie
      const currentUser = that.getCredentials();

      // If user is logged in.
      if ( currentUser ) {

        const expiredDateObj = new Date( currentUser.expires );

        // Check that current user has token, and that it has not expired
        if (
          currentUser.token !== undefined &&
          currentDateObj < expiredDateObj
        ) {
          returnValue = 'Bearer ' + currentUser.token;
        }
        // Token has expired
        else {
          that.clearCredentials();
        }
      }

      return returnValue;
    };

    this.clearCredentials = function () {

      credentials = null;

      $rootScope.userInfo = null;

      // Clear credentials from cookie
      $cookies.remove( CURRENT_USER_STR );
    };

    this.apiUrlEqualsUrl = function( configUrl ){

      let apiUrlPartsArray, apiCompareUrl, currentCompareUrl;

      const urlPartsArray = configUrl.split( '/' );

      // If the url is a potential API url
      if ( urlPartsArray.length > 2 ) {

        apiUrlPartsArray = API_URL.split( '/' );

        // Build base urls to compare
        currentCompareUrl = urlPartsArray[0] + urlPartsArray[2] + urlPartsArray[3];
        apiCompareUrl = apiUrlPartsArray[0] + apiUrlPartsArray[2] + apiUrlPartsArray[3];

        // If the base url of the request is the same as the API url
        return currentCompareUrl === apiCompareUrl;
      }

      return false;
    };

    // Add rootScope auth functions
    $rootScope.loginFromModal = function( username, password ){

      // Inject ionic modal to avoid circular dependency.
      const mdToast = $injector.get( '$mdToast' );

      that.login( username, password )

        // Login successful
        .then( ( response ) => {

          $rootScope.loginModal.hide();

          // Display error message
          mdToast.show( mdToast.simple()
              .content( 'Du är nu inloggad' )
              .position( 'top right' )
          );

          // Save http header credentials
          that.setCredentials(
            {
              id: response.data.Id,
              userName: response.data.UserName,
              firstName: response.data.FirstName,
              surName: response.data.SurName,
              imageSrc: response.data.ImageSrc,
              emailAddress: response.data.EmailAddress,
              token: response.data.access_token,
              expires: response.data['.expires']
            }
          );

          // Redirect to start page
          $state.go( 'app.start' );
        })

        .catch( ( response ) => {

          // If wrong credentials were entered
          if ( response.data.error === 'invalid_grant' ) {

            // Display error message
            mdToast.show( mdToast.simple()
                .content( 'Felaktigt användarnamn eller lösenord' )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }
          else if ( response.data.error === 'account_locked' ) {

            // Display error message
            mdToast.show( mdToast.simple()
                .content( 'Du har gjort för många felaktiga inloggningar. Kontot är spärrat till och med ' + response.data.error_description )
                .position( 'top right' )
                .theme( 'warn' )
            );
          }
        });
    };

    $rootScope.abortLoginFromModal = function() {

      $rootScope.loginModal.hide();

      // Redirect to start page
      $state.go( 'app.start' );

    };

    $rootScope.logout = function() {

      // Inject ionic modal to avoid circular dependency.
      const mdToast = $injector.get( '$mdToast' );

      that.logout().then( () => {

        // Redirect to start page
        $state.go( 'app.start' );

        // Display message
        mdToast.show( mdToast.simple()
          .content( 'Du är nu utloggad' )
          .position( 'top right' )
        );
      });
    };

    $rootScope.showLogin = function() {

      that.showLoginModal();
    };

    // Init values
    that.getCredentials();
  }]
);