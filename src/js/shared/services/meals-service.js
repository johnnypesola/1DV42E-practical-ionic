/**
 * Created by Johanna Larsson on 2016-04-20.
 */
'use strict';

angular.module( 'BookingSystem.mealsServices',

  // Dependencies
  [
    'ngResource'
  ]
)
  .factory( 'Meal', [ '$resource', 'API_URL', ( $resource, API_URL ) => {

    return $resource(
      API_URL + 'Meal/:mealId',
      {mealId: '@mealId'}
    );
  }]
  )

  .factory( 'MealHasPropertyHelper', ['MealHasProperty', 'MealProperty', ( MealHasProperty, MealProperty ) => {
    return {

      // Get location specific mealProperties and all mealProperties combined. (specific mealProperties selected)
      // For use in checkboxes and such.
      getCombined : ( mealId ) => {

        // Get all available mealProperties
        const mealProperties = MealProperty.query();

        // Get saved mealProperties for this locations
        const mealHasProperty = MealHasProperty.queryForMealProperty({mealPropertyId: mealPropertyId});

        // When all available mealProperties have been fetched
        mealProperties.$promise.finally( () => {

          // When a meal's available mealProperties have been fetched
          mealHasProperty.$promise.finally( () => {

            // Mark saved mealProperties for this meal as selected
            mealProperties.forEach( ( availableMealProperty ) => {
              let match = false,
                i;

              // If there are any existing mealHasProperties, mark them as selected
              for ( i = 0; i < mealHasProperty.length; i++ ){
                if ( availableMealProperty.MealPropertyId === mealHasProperty[i].MealPropertyId ) {
                  availableMealProperty.Selected = true;

                  match = true;
                  break;
                }
              }

              if ( !match ){
                availableMealProperty.Selected = false;
              }
            });
          });
        });

        // Return mealProperties with promise
        return mealProperties;
      }
    };
  }]
  );