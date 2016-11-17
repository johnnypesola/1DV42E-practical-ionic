'use strict';

angular.module( 'BookingSystem.meals',

  //Dependencies
  []
  )

  //Controller
  .controller( 'MealsListCtrl', [ '$rootScope', '$scope', '$state', 'Meal', '$mdToast', 'API_IMG_PATH_URL', 'PAGINATION_COUNT', ( $rootScope, $scope, $state, Meal, $mdToast, API_IMG_PATH_URL, PAGINATION_COUNT ) => {

    /* Init vars */
    $scope.API_IMG_PATH_URL = API_IMG_PATH_URL;
    $scope.noMoreItemsAvailable = false;
    $scope.meals = [];
    let pageNum = 1;

    /* Private methods START */

    /* Private Methods END */

    /* Public Methods START */

    $scope.loadMore = function() {

      const newItems = Meal.queryPagination({
        pageNum: pageNum,
        itemCount: PAGINATION_COUNT
      });

      newItems.$promise.then( () => {

        // If there aren't any more items
        if ( newItems.length === 0 || newItems.length < PAGINATION_COUNT ) {

          $scope.noMoreItemsAvailable = true;

        }

        newItems.forEach( ( newItem ) => {

          $scope.meals.push( newItem );
        });

        $scope.$broadcast( 'scroll.infiniteScrollComplete' );

      });

      pageNum++;
    };

    /* Public Methods END */

    /* Initialization START */

    /* Initialization END */

  }]
  )

  //Edit controller
  .controller( 'MealDetailsCtrl', [ '$rootScope', '$scope', '$stateParams', 'MODAL_ANIMATION', '$ionicModal', '$state', 'Meal', 'MealProperty','MealHasProperty', '$mdToast', 'API_IMG_PATH_URL', 'MealImage', '$q',( $rootScope, $scope, $stateParams, MODAL_ANIMATION, $ionicModal, $state, Meal, MealProperty, MealHasProperty, $mdToast, API_IMG_PATH_URL, MealImage, $q ) => {
    /* Init vars */

    const selectMealPropertiesModalTemplateUrl = 'templates/modals/select-meal-properties.html';
    const deleteModalTemplateUrl = 'templates/modals/meals-delete.html';
    const savePromisesArray = [];
    $scope.isEditMode = false;
    $scope.mealBackup = {};
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

    const setupSelectMealPropertyModal = function(){

      $ionicModal.fromTemplateUrl( selectMealPropertiesModalTemplateUrl, {
        scope: $scope,
        animation: MODAL_ANIMATION
      })
        .then( ( response ) => {

          $scope.selectModal = response;
        });

      // Cleanup the modal when we're done with it!
      $scope.$on( '$destroy', () => {
        $scope.selectModal.remove();
      });
    };

    const uploadImage = ( MealId ) => {

      const deferred = $q.defer();

      if ( typeof $scope.meal.ImageForUpload !== 'undefined' ) {

        const result = MealImage.upload( $scope.meal.ImageForUpload, MealId );

        // Image upload failed
        result.error( () => {

          $mdToast.show( $mdToast.simple()
              .content( 'Måltiden "' + $scope.meal.Name + '" sparades, men det gick inte att ladda upp och spara den önskade bilden.' )
              .position( 'top right' )
              .theme( 'warn' )
          );
        });

        savePromisesArray.push( result );

        return result;
      }

      savePromisesArray.push( deferred.promise );

      // Return resolved promise if no image is available for upload
      deferred.resolve();

      return deferred.promise;
    };

    const saveSuccess = function() {
      // Display success message
      $mdToast.show( $mdToast.simple()
          .content( 'Måltiden "' + $scope.meal.Name + '" sparades med ett lyckat resultat' )
          .position( 'top right' )
          .theme( 'success' )
      );
    };

    const getMeal = function () {

      const deferred = $q.defer();

      const meal = Meal.get(
        {
          mealId: $stateParams.mealId
        }
      );

      meal.$promise.catch( () => {
        $mdToast.show( $mdToast.simple()
            .content( 'Måltid kunde inte hämtas, var god försök igen.' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      })

        .then( () => {

          // Resolve promise
          deferred.resolve();
        })

        // In case meal cannot be fetched, display an error to user.
        .catch( () => {
          $mdToast.show( $mdToast.simple()
              .content( 'Måltidsegenskaper kunde inte hämtas, var god försök igen.' )
              .position( 'top right' )
              .theme( 'warn' )
          );
        });

      $scope.meal = meal;

      return deferred.promise;
    };

    const getAllMealProperties = function() {
      $scope.mealProperties = MealProperty.query();

      return $scope.mealProperties.$promise;
    };

    const processMealProperties = function() {

      $scope.mealProperties.forEach( ( mealProperty ) => {

        const match = $scope.meal.mealProperties.some( ( mealHasThisProperty ) => {

          return mealProperty.Name === mealHasThisProperty.MealPropertyName;
        });

        mealProperty.isSelected = match;
      });
    };

    const getMealSpecificProperties = function() {

      $scope.meal.mealProperties = MealHasProperty.queryForMeal(
        {
          mealId: $stateParams.mealId
        }
      );

      return $scope.meal.mealProperties.$promise;

    };

    const saveMealProperties = function(){

      const deferred = $q.defer();
      const postDataArray = [];

      // Delete previous meal properties
      const mealPropertyResource = MealHasProperty.removeForMeal(
        {
          mealId: $scope.meal.MealId
        }
      );

      // After previous meal properties were deleted. Save new meal properties for meal
      mealPropertyResource.$promise.finally( () => {

        // Process each and every one of the meal properties
        $scope.meal.mealProperties.forEach( ( mealProperty ) => {

          postDataArray.push({
            MealId: $stateParams.mealId,
            MealPropertyId: mealProperty.MealPropertyId
          });
        });

        // Save
        MealHasProperty.saveForMeal( postDataArray ).$promise

          .then( () => {
            deferred.resolve();
          })

          .catch( () => {
            $mdToast.show( $mdToast.simple()
                .content( 'Uppgifter om måltiden sparades, men måltidsegenskaper kunde inte sparas. Var god försök igen.' )
                .position( 'top right' )
                .theme( 'warn' )
            );

            deferred.reject();
          });
      });

      savePromisesArray.push( deferred.promise );

      // Return promise
      return deferred.promise;
    };

    const handleSaveErrors = function( response ) {

      // If there there was a foreign key reference
      if ( response.status === 409 ){
        $mdToast.show( $mdToast.simple()
            .content( 'Det finns redan en måltid som heter "' + $scope.meal.Name +
            '". Två måltider kan inte heta lika.' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      }

      // If there was a problem with the in-data
      else if ( response.status === 400 || response.status === 500 ){
        $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när måltiden skulle sparas' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      }

      // If the entry was not found
      if ( response.status === 404 ) {
        $mdToast.show( $mdToast.simple()
            .content( 'Måltiden "' + $scope.meal.Name + '" existerar inte längre. Hann kanske någon radera den?' )
            .position( 'top right' )
            .theme( 'warn' )
        );

        history.back();
      }
    };

    const handleDeleteErrors = function( response ) {

      // If there there was a foreign key reference
      if (
        response.status === 400 &&
        response.data.Message !== 'undefined' &&
        response.data.Message === 'Foreign key references exists'
      ){
        $mdToast.show( $mdToast.simple()
            .content( 'Måltiden kan inte raderas eftersom det finns' +
            ' en lokalbokning eller en lokalmåltid som refererar till måltiden' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      }

      // If there was a problem with the in-data
      else if ( response.status === 400 || response.status === 500 ){
        $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när måltiden skulle tas bort' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      }

      // If the entry was not found
      if ( response.status === 404 ) {
        $mdToast.show( $mdToast.simple()
            .content( 'Måltiden "' + $scope.meal.Name + '" existerar inte längre. Hann kanske någon radera den?' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      }

      history.back();
    };

    /* Private Methods END */

    /* Public Methods START */

    $scope.startEditMode = function () {

      $scope.isEditMode = true;

      // Make backup of data if in editMode.
      $scope.mealBackup = angular.copy( $scope.meal );
    };

    $scope.endEditMode = function () {

      $scope.isEditMode = false;
    };

    $scope.abortEditMode = function() {

      $scope.isEditMode = false;
      $scope.meal = $scope.mealBackup;
    };

    $scope.saveMeal = function() {

      const $scope = this;

      // Save resource
      Meal.save(
        {
          MealId: $stateParams.mealId,
          Name: $scope.meal.Name,
          ImageSrc: $scope.meal.ImageSrc
        }
      ).$promise

        // If everything went ok
        .then( ( response ) => {

          $scope.endEditMode();

          // Upload image
          uploadImage( response.MealId )

            .finally( () => {

              return saveMealProperties( response.MealId );
            })
            .finally( () => {

              // Redirect
              history.back();
            });

          // Only show success message if all save promises resolved without errors.
          $q.all( savePromisesArray )
            .then( () => {

              saveSuccess();
            });

        // Something went wrong
        }).catch( ( response ) => {

          handleSaveErrors( response );
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

          $mdToast.show( $mdToast.simple()
              .content( 'Måltiden "' + $scope.meal.Name + '" raderades med ett lyckat resultat' )
              .position( 'top right' )
              .theme( 'success' )
          );

          history.back();
        })
        // Something went wrong
        .catch( ( response ) => {

          handleDeleteErrors( response );
        });
    };

    $scope.toggleMealPropertyToMeal = function( mealProperty ) {

      const newMealPropertyList = [];
      let match = false;

      $scope.meal.mealProperties.forEach( ( mealPropertyInMeal ) => {

        if ( mealPropertyInMeal.MealPropertyId === mealProperty.MealPropertyId ) {

          match = true;
        } else {

          newMealPropertyList.push( mealPropertyInMeal );
        }
      });

      if ( !match ) {
        newMealPropertyList.push({
          MealPropertyId: mealProperty.MealPropertyId,
          MealPropertyName: mealProperty.Name
        });
      }

      $scope.meal.mealProperties = newMealPropertyList;
    };

    /* Public Methods END */

    /* Initialization START */

    setupDeleteModal();
    setupSelectMealPropertyModal();

    getMeal()
      .then( () => {
        return getAllMealProperties();
      })
      .then( () => {
        return getMealSpecificProperties();
      })
      .then( () => {
        processMealProperties();
      });

    /* Initialization END */
  }]
  )

  //Create controller
  .controller( 'MealCreateCtrl', [ '$rootScope', '$stateParams', '$scope', '$state', 'Meal', '$mdToast', 'MealImage', 'MODAL_ANIMATION', '$ionicModal', 'MealProperty', 'MealHasProperty', '$q', ( $rootScope, $stateParams, $scope, $state, Meal, $mdToast, MealImage, MODAL_ANIMATION, $ionicModal, MealProperty, MealHasProperty, $q ) => {

    /* Init vars */
    const selectMealPropertiesModalTemplateUrl = 'templates/modals/select-meal-properties.html';
    const savePromisesArray = [];
    $scope.meal = {
      mealProperties: []
    };
    $scope.isEditMode = true;

    /* Private methods START */

    const setupSelectMealPropertyModal = function(){

      $ionicModal.fromTemplateUrl( selectMealPropertiesModalTemplateUrl, {
        scope: $scope,
        animation: MODAL_ANIMATION
      })
        .then( ( response ) => {

          $scope.selectModal = response;
        });

      // Cleanup the modal when we're done with it!
      $scope.$on( '$destroy', () => {
        $scope.selectModal.remove();
      });
    };

    const uploadImage = ( MealId ) => {

      const deferred = $q.defer();

      if ( typeof $scope.meal.ImageForUpload !== 'undefined' ) {

        const result = MealImage.upload( $scope.meal.ImageForUpload, MealId );

        // Image upload failed
        result.error( () => {

          $mdToast.show( $mdToast.simple()
              .content( 'Måltiden "' + $scope.meal.Name + '" skapades, men det gick inte att ladda upp och spara den önskade bilden.' )
              .position( 'top right' )
              .theme( 'warn' )
          );
        });

        savePromisesArray.push( result );

        return result;
      }

      savePromisesArray.push( deferred.promise );

      // Return resolved promise if no image is available for upload
      deferred.resolve();

      return deferred.promise;
    };

    const getAllMealProperties = function() {
      $scope.mealProperties = MealProperty.query();

      return $scope.mealProperties.$promise;
    };

    const saveSuccess = () => {

      // Display success message
      $mdToast.show( $mdToast.simple()
          .content( 'Måltiden "' + $scope.meal.Name + '" sparades med ett lyckat resultat' )
          .position( 'top right' )
          .theme( 'success' )
      );
    };

    const saveMealProperties = function( mealId ){

      const postDataArray = [];

      // Process each and every one of the meal properties
      $scope.meal.mealProperties.forEach( ( mealProperty ) => {

        postDataArray.push({
          MealId: mealId,
          MealPropertyId: mealProperty.MealPropertyId
        });
      });

      // Save
      const result = MealHasProperty.saveForMeal( postDataArray );

      result.$promise.catch( () => {

        $mdToast.show( $mdToast.simple()
            .content( 'Uppgifter om måltiden sparades, men måltidsegenskaper kunde inte sparas. Var god försök igen.' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      });

      savePromisesArray.push( result.$promise );

      // Return promise
      return result.$promise;
    };

    const handleSaveErrors = function( response ) {

      // If there there was a foreign key reference
      if ( response.status === 409 ){
        $mdToast.show( $mdToast.simple()
            .content( 'Det finns redan en måltid som heter "' + $scope.meal.Name +
            '". Två måltider kan inte heta lika.' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      }

      // If there was a problem with the in-data
      else {
        $mdToast.show( $mdToast.simple()
            .content( 'Ett oväntat fel uppstod när måltiden skulle sparas' )
            .position( 'top right' )
            .theme( 'warn' )
        );
      }
    };

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

          // Upload image
          uploadImage( response.MealId )

            .finally( () => {

              return saveMealProperties( response.MealId );
            })
            .finally( () => {

              // Redirect
              history.back();
            });

          // Only show success message if all save promises resolved without errors.
          $q.all( savePromisesArray )
            .then( () => {

              saveSuccess();
            });

          // Something went wrong
        }).catch( ( response ) => {

          handleSaveErrors( response );
        });
    };

    $scope.toggleMealPropertyToMeal = function( mealProperty ) {

      const newMealPropertyList = [];
      let match = false;

      $scope.meal.mealProperties.forEach( ( mealPropertyInMeal ) => {

        if ( mealPropertyInMeal.MealPropertyId === mealProperty.MealPropertyId ) {

          match = true;
        } else {

          newMealPropertyList.push( mealPropertyInMeal );
        }
      });

      if ( !match ) {
        newMealPropertyList.push({
          MealPropertyId: mealProperty.MealPropertyId,
          MealPropertyName: mealProperty.Name
        });
      }

      $scope.meal.mealProperties = newMealPropertyList;
    };

    /* Public Methods END */

    /* Initialization START */

    setupSelectMealPropertyModal();
    getAllMealProperties();

    /* Initialization END */

  }]
  );
