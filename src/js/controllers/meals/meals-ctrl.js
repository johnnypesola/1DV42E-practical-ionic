'use strict';

angular.module( 'BookingSystem.meals',

  //Dependencies
  []
  )

  //Controller
  .controller( 'MealsListCtrl', [ '$rootScope', '$scope', '$state', 'Meal', ( $rootScope, $scope, $state, Meal ) => {

    /* Init vars */

    /* Private methods START */

    const getMeals = function() {

      const meals = Meal.query();

      // In case meals cannot be fetched, display an error to user.
      meals.$promise.catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Måltider kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.meals = meals;
    };

    /* Private Methods END */

    /* Public Methods START */

    /* Public Methods END */

    /* Initialization START */

    $scope.$on( '$ionicView.enter', ( event, data ) => {
      getMeals();
    });

    /* Initialization END */

  }]
  )

  //Edit controller
  .controller( 'MealDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$ionicModal', '$state', 'Meal', 'MealProperty','MealHasProperty', ( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $ionicModal, $state, Meal, MealProperty, MealHasProperty ) => {
      /* Init vars */

    const modalTemplateUrl = 'templates/modals/meals-delete.html';
    $scope.isEditMode = false;
    $scope.mealBackup = {};

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

    const getMeal = function () {

      const meal = Meal.get(
        {
          mealId: $stateParams.mealId
        }
      );

      // In case meal cannot be fetched, display an error to user.
      meal.$promise.then( () => {
        meal.mealProperties = MealHasProperty.queryForMealProperty(
          {
            mealPropertyId: $stateParams.mealPropertyId
          }
        );
      })
      .catch( () => {

        $rootScope.FlashMessage = {
          type: 'error',
          message: 'Måltid kunde inte hämtas, var god försök igen.'
        };
      });

      $scope.meal = meal;

    };

    const getAllMealProperties = function() {
      $scope.mealProperties = MealProperty.query();
    };

    /*
    const saveMealProperties = function(){
      let mealPropertiesToSave;
      const postDataArray = [];

      // Delete previous meal properties
      const mealPropertyResource = MealHasProperty.removeForMealProperty(
        {
          mealId: $scope.meal.MealId
        }
      );

      // After previous meal properties were deleted. Save new meal properties for meal
      mealPropertyResource.$promise.finally( () => {

        // Filter out meal properties to save
        mealPropertiesToSave = $scope.mealProperties.filter( ( mealProperty ) => {
          return mealProperty.Selected;
        });

        // Process each and every one of the meal properties
        mealPropertiesToSave.forEach( ( mealProperty ) => {

          postDataArray.push({
            MealId: $stateParams.mealId,
            MealPropertyId: mealProperty.MealPropertyId
          });
        });

        // Save
        MealHasProperty.saveForMealProperty( postDataArray );
      });

      // Return promise
      return mealPropertyResource.$promise;

    };
    */

    /* Private Methods END */

    /* Public Methods START */

    $scope.startEditMode = function () {
      const $scope = this;

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.mealBackup = angular.copy( $scope.meal );
    };

    $scope.endEditMode = function () {
      const $scope = this;

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {
      const $scope = this;

      $scope.isEditMode = false;
      $scope.meal = $scope.mealBackup;
    };

    $scope.saveMeal = function() {

      const $scope = this;

      // Save resource
      Meal.save(
        {
          MealId: $stateParams.mealId,
          Name: $scope.meal.Name
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();
          saveMealProperties( response.MealId )

          .then( () => {

            $rootScope.FlashMessage = {
              type: 'success',
              message: 'Måltiden "' + $scope.meal.Name + '" sparades med ett lyckat resultat'
            };

          }).catch( () => {

            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Uppgifter om måltiden sparades, men kostinformationen kunde inte sparas. Var god försök igen.'
            };
          });

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Det finns redan en måltid som heter "' + $scope.meal.Name +
              '". Två måltider kan inte heta lika.'
            };
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när måltiden skulle sparas'
            };
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Måltiden "' + $scope.meal.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };

            history.back();
          }
        });
    };

    $scope.deleteMeal = function() {

      // Delete meal
      Meal.delete(
        {
          mealId: $stateParams.mealId
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Måltiden "' + $scope.meal.Name + '" raderades med ett lyckat resultat'
          };

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
            $rootScope.FlashMessage = {
              type: 'error',
              message:    'Måltiden kan inte raderas eftersom det finns' +
              ' en lokalbokning eller en lokalmåltid som refererar till måltiden'
            };
          }

          // If there was a problem with the in-data
          else if ( response.status === 400 || response.status === 500 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när måltiden skulle tas bort'
            };
          }

          // If the entry was not found
          if ( response.status === 404 ) {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Måltiden "' + $scope.meal.Name + '" existerar inte längre. Hann kanske någon radera den?'
            };
          }

          history.back();
        });
    };

    /* Public Methods END */

    /* Initialization START */

    setupModal();
    getMeal();
    getAllMealProperties();

    /* Initialization END */
  }]
  )

  //Create controller
  .controller( 'MealCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'Meal', ( $rootScope, $stateParams, $scope, $state, Meal ) => {

    /* Init vars */
    $scope.meal = {};

    /* Private methods START */

    /* Private Methods END */

    /* Public Methods START */

    $scope.saveMeal = function() {

      const $scope = this;

      // Save meal
      Meal.save(
        {
          MealId: 0,
          Name: $scope.meal.Name
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $rootScope.FlashMessage = {
            type: 'success',
            message: 'Måltiden "' + $scope.meal.Name + '" skapades med ett lyckat resultat'
          };

          history.back();

          // Something went wrong
        }).catch( ( response ) => {

          // If there there was a foreign key reference
          if ( response.status === 409 ){
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Det finns redan en måltid som heter "' + $scope.meal.Name +
              '". Två måltider kan inte heta lika.'
            };
          }

          // If there was a problem with the in-data
          else {
            $rootScope.FlashMessage = {
              type: 'error',
              message: 'Ett oväntat fel uppstod när måltiden skulle sparas'
            };
          }
        });
    };

    /* Public Methods END */

    /* Initialization START */

    /* Initialization END */

  }]
  );
