using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class MealPropertyService
    {
        // Fields
        private MealPropertyDAL _mealPropertyDAL;

        // Properties
        private MealPropertyDAL MealPropertyDAL
        {
            get
            {
                return _mealPropertyDAL ?? (_mealPropertyDAL = new MealPropertyDAL());
            }
        }

        // Methods
        public void MealPropertyDelete(MealProperty MealProperty)
        {
            MealPropertyDelete(MealProperty.MealPropertyId);
        }

        public void MealPropertyDelete(int MealPropertyId)
        {
            if (MealPropertyId < 0)
            {
                throw new FormatException("Invalid MealPropertyId");
            }

            // Check that the MealProperty exists before deletion
            MealProperty MealProperty = MealPropertyDAL.GetMealPropertyById(MealPropertyId);

            // If there is no MealProperty
            if (MealProperty == null)
            {
                throw new DataBaseEntryNotFoundException("MealProperty does not exist");
            }

            // Delete MealProperty
            MealPropertyDAL.DeleteMealProperty(MealPropertyId);

        }

        public MealProperty GetMealProperty(int MealPropertyId)
        {
            if (MealPropertyId < 0)
            {
                throw new ApplicationException("Invalid MealPropertyId");
            }

            return MealPropertyDAL.GetMealPropertyById(MealPropertyId);
        }

        public IEnumerable<MealProperty> GetMealProperties()
        {
            return MealPropertyDAL.GetMealProperties();
        }


        public void SaveMealProperty(MealProperty MealProperty)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (MealProperty.Validate(out validationResults))
            {
                // If a new MealProperty should be created
                if (MealProperty.MealPropertyId == 0)
                {
                    MealPropertyDAL.InsertMealProperty(MealProperty);
                }
                // Existing MealProperty should be updated
                else
                {
                    // Check that the MealProperty exists before update
                    if (MealPropertyDAL.GetMealPropertyById(MealProperty.MealPropertyId) == null)
                    {
                        throw new DataBaseEntryNotFoundException();
                    }

                    // Update MealProperty
                    MealPropertyDAL.UpdateMealProperty(MealProperty);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("MealProperty object contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }
    }
}