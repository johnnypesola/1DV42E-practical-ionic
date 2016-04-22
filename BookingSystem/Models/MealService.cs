using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class MealService
    {
        // Fields
        private MealDAL _mealDAL;

        // Properties
        private MealDAL MealDAL
        {
            get
            {
                return _mealDAL ?? (_mealDAL = new MealDAL());
            }
        }

        // Methods
        public void MealDelete(Meal Meal)
        {
            MealDelete(Meal.MealId);
        }

        public void MealDelete(int MealId)
        {
            if (MealId < 0)
            {
                throw new FormatException("Invalid MealId");
            }

            // Check that the Meal exists before deletion
            Meal Meal = MealDAL.GetMealById(MealId);

            // If there is no Meal
            if (Meal == null)
            {
                throw new DataBaseEntryNotFoundException("Meal does not exist");
            }

            // Delete Meal
            MealDAL.DeleteMeal(MealId);

        }

        public Meal GetMeal(int MealId)
        {
            if (MealId < 0)
            {
                throw new ApplicationException("Invalid MealId");
            }

            return MealDAL.GetMealById(MealId);
        }

        public IEnumerable<Meal> GetMeals()
        {
            return MealDAL.GetMeals();
        }


        public void SaveMeal(Meal Meal)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (Meal.Validate(out validationResults))
            {
                // If a new Meal should be created
                if (Meal.MealId == 0)
                {
                    MealDAL.InsertMeal(Meal);
                }
                // Existing Meal should be updated
                else
                {
                    // Check that the Meal exists before update
                    if (MealDAL.GetMealById(Meal.MealId) == null)
                    {
                        throw new DataBaseEntryNotFoundException();
                    }

                    // Update Meal
                    MealDAL.UpdateMeal(Meal);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("Meal object contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }
    }
}