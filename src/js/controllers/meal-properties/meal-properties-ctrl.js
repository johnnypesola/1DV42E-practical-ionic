'use strict';

angular.module( 'BookingSystem.mealProperties',

  //Dependencies
  []
)

  //Controller
  .controller( 'MealPropertyListCtrl', [ '$rootScope', '$scope', '$state', 'MealProperty', '$mdToast', ( $rootScope, $scope, $state, MealProperty, $mdToast ) => {

    /* Init vars */

    /* Private methods START */

    const getMealProperties = function() {

      const mealProperties = MealProperty.query();

      // In case meals cannot be fetched, display an error to user.
      mealProperties.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
            .content( 'Måltidsegenskaper kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
            .theme( 'error' )
        );
      });

      $scope.mealProperties = mealProperties;
    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( '$ionicView.beforeEnter', ( event, data ) => {
      getMealProperties();
    });

    /* Initialization END */

  }]
)

  //Edit controller
  .controller( 'MealPropertyDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$ionicModal', '$state', 'MealProperty','$mdToast', 'API_IMG_PATH_URL', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $ionicModal, $state, MealProperty, $mdToast, API_IMG_PATH_URL ) => {
    /* Init vars */

    const modalTemplateUrl = 'templates/modals/meal-property-delete.html';
    $scope.isEditMode = false;
    $scope.mealPropertyBackup = {};
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;

    /* Private methods START */

    const setupModal = function(){

      $ionicModal.fromTemplateUrl( modalTemplateUrl, {
        scope: $scope,
        animation: MODAL_ANIMATION
      })
        .then( ( response ) => {

          $scope.modal = response;
        });

      // Cleanup the modal when we're done with it!
      $scope.$on( '$destroy', () => {
        $scope.modal.remove();
      });
    };

    const saveSuccess = function() {
      // Display success message
      $mdToast.show( $mdToast.simple()
          .content( 'Måltidsegenskapen "' + $scope.mealProperty.Name + '" sparades med ett lyckat resultat' )
          .position( 'top right' )
          .theme( 'success' )
      );

      // Redirect
      history.back();
    };

    const getMealProperty = function () {

      const mealProperty = MealProperty.get(
        {
          mealPropertyId: $stateParams.mealPropertyId
        }
      );

      $scope.mealProperty = mealProperty;
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.startEditMode = function () {
      const $scope = this;

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.mealPropertyBackup = angular.copy( $scope.mealProperty );
    };

    $scope.endEditMode = function () {
      const $scope = this;

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {
      const $scope = this;

      $scope.isEditMode = false;
      $scope.mealProperty = $scope.mealPropertyBackup;

      console.log( $scope.mealPropertyBackup );
    };

    $scope.saveMealProperty = function() {

      const $scope = this;

      // Save resource
      MealProperty.save(
        {
          MealPropertyId: $stateParams.mealId,
          Name: $scope.mealProperty.Name
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();

          saveSuccess();

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Det finns redan en måltidsegenskap som heter "' + $scope.mealProperty.Name +
                '". Två måltidsegenskaper kan inte heta lika.' )
                .position( 'top right' )
                .theme( 'error' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när måltidsegenskapen skulle sparas' )
                .position( 'top right' )
                .theme( 'error' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
                .content( 'Måltidsegenskapen "' + $scope.mealProperty.Name + '" existerar inte längre. Hann kanske någon radera den?' )
                .position( 'top right' )
                .theme( 'error' )
            );

            history.back();
          }
        });
    };

    $scope.deleteMealProperty = function() {

      // Delete mealProperty
      MealProperty.delete(
        {
          mealPropertyId: $stateParams.mealPropertyId
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $mdToast.show( $mdToast.simple()
              .content( 'Måltidsegenskapen "' + $scope.mealProperty.Name + '" raderades med ett lyckat resultat' )
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
                .content( 'Måltidsegenskapen kan inte raderas eftersom det finns' +
                ' en måltid som refererar till måltidsegenskapen' )
                .position( 'top right' )
                .theme( 'error' )
            );
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när måltidsegenskapen skulle tas bort' )
                .position( 'top right' )
                .theme( 'error' )
            );
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $mdToast.show( $mdToast.simple()
                .content( 'Måltidsegenskapen "' + $scope.mealProperty.Name + '" existerar inte längre. Hann kanske någon radera den?' )
                .position( 'top right' )
                .theme( 'error' )
            );
          }

          history.back();
        });
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();
    getMealProperty();

    /* Initialization END */
  }]
)

  //Create controller
  .controller( 'MealPropertyCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'MealProperty', '$mdToast', ( $rootScope, $stateParams, $scope, $state, MealProperty, $mdToast ) => {

    /* Init vars */
    $scope.mealProperty = {};

    /* Private methods START */

    // Display success message
    const saveSuccess = () => {

      // Display success message
      $mdToast.show( $mdToast.simple()
          .content( 'Måltidsegenskapen "' + $scope.mealProperty.Name + '" sparades med ett lyckat resultat' )
          .position( 'top right' )
          .theme( 'success' )
      );

      // Redirect
      history.back();
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.saveMealProperty = function() {

      const $scope = this;

      // Save mealProperty
      MealProperty.save(
        {
          MealPropertyId: 0,
          Name: $scope.mealProperty.Name
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          saveSuccess();

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $mdToast.show( $mdToast.simple()
                .content( 'Det finns redan en måltidsegenskap som heter "' + $scope.mealProperty.Name +
                '". Två måltidsegenskaper kan inte heta lika.' )
                .position( 'top right' )
                .theme( 'error' )
            );
          }

          // If there was a problem with the in-data
          else {
            $mdToast.show( $mdToast.simple()
                .content( 'Ett oväntat fel uppstod när måltidsegenskapen skulle sparas' )
                .position( 'top right' )
                .theme( 'error' )
            );
          }
        });
    };

    /* Public Methods END */

    /* Initialization START */

    /* Initialization END */

  }]
);
