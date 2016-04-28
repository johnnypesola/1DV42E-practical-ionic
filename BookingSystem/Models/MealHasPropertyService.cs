using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class MealHasPropertyService
    {
        // Fields
        private MealHasPropertyDAL _mealHasPropertyDAL;

        // Properties
        private MealHasPropertyDAL MealHasPropertyDAL
        {
            get
            {
                return _mealHasPropertyDAL ?? (_mealHasPropertyDAL = new MealHasPropertyDAL());
            }
        }

        // Methods
        public void MealHasPropertyDelete(MealHasProperty MealHasProperty)
        {
            MealHasPropertyDelete(MealHasProperty.MealId, MealHasProperty.MealPropertyId);
        }

        public void MealHasPropertyDelete(int MealId, int? MealPropertyId = null)
        {
            if (MealId < 0 || MealPropertyId != null && MealPropertyId < 0)
            {
                throw new FormatException("Invalid MealId or MealPropertyId");
            }

            // Check that the MealHasProperty exists before deletion
            MealHasProperty MealHasProperty = MealHasPropertyDAL.GetMealHasPropertyById(MealId, MealPropertyId);

            // If there is no MealHasProperty
            if (MealHasProperty == null)
            {
                throw new DataBaseEntryNotFoundException("MealHasProperty does not exist");
            }

            // Delete MealHasProperty
            MealHasPropertyDAL.DeleteMealHasProperty(MealId, MealPropertyId);

        }

        public MealHasProperty GetMealHasProperty(int MealId)
        {
            if (MealId < 0)
            {
                throw new ApplicationException("Invalid MealId");
            }

            return MealHasPropertyDAL.GetMealHasPropertyById(MealId);
        }

        public IEnumerable<MealHasProperty> GetMealHasPropertys(int? MealId = null)
        {
            return MealHasPropertyDAL.GetMealHasPropertys(MealId);
        }

        public void SaveMealHasProperty(MealHasProperty MealHasProperty)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (MealHasProperty.Validate(out validationResults))
            {
                // Check that the MealHasProperty exists
                MealHasProperty MealHasPropertyCheck = MealHasPropertyDAL.GetMealHasPropertyById(MealHasProperty.MealId, MealHasProperty.MealPropertyId);

                // If a new MealHasProperty should be created
                if (MealHasPropertyCheck == null)
                {
                    MealHasPropertyDAL.InsertMealHasProperty(MealHasProperty);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("MealHasProperty object contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }

        public void SaveMealHasPropertys(MealHasProperty[] MealHasPropertys)
        {
            foreach (MealHasProperty MealHasProperty in MealHasPropertys)
            {
                this.SaveMealHasProperty(MealHasProperty);
            }
        }
    }
}