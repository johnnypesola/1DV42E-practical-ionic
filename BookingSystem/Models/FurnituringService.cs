using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class FurnituringService
    {
        // Fields
        private FurnituringDAL _furnituringDAL;

        // Properties
        private FurnituringDAL FurnituringDAL
        {
            get
            {
                return _furnituringDAL ?? (_furnituringDAL = new FurnituringDAL());
            }
        }

        // Methods
        public void FurnituringDelete(Furnituring Furnituring)
        {
            FurnituringDelete(Furnituring.FurnituringId);
        }

        public void FurnituringDelete(int FurnituringId)
        {
            if (FurnituringId < 0)
            {
                throw new FormatException("Invalid FurnituringId");
            }

            // Check that the Furnituring exists before deletion
            Furnituring Furnituring = FurnituringDAL.GetFurnituringById(FurnituringId);

            // If there is no Furnituring
            if (Furnituring == null)
            {
                throw new DataBaseEntryNotFoundException("Furnituring does not exist");
            }

            // Delete Furnituring
            FurnituringDAL.DeleteFurnituring(FurnituringId);

        }

        public Furnituring GetFurnituring(int FurnituringId)
        {
            if (FurnituringId < 0)
            {
                throw new ApplicationException("Invalid FurnituringId");
            }

            return FurnituringDAL.GetFurnituringById(FurnituringId);
        }

        public IEnumerable<Furnituring> GetFurniturings()
        {
            return FurnituringDAL.GetFurniturings();
        }


        public void SaveFurnituring(Furnituring Furnituring)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (Furnituring.Validate(out validationResults))
            {
                // If a new Furnituring should be created
                if (Furnituring.FurnituringId == 0)
                {
                    FurnituringDAL.InsertFurnituring(Furnituring);
                }
                // Existing Furnituring should be updated
                else
                {
                    // Check that the Furnituring exists before update
                    if (FurnituringDAL.GetFurnituringById(Furnituring.FurnituringId) == null)
                    {
                        throw new DataBaseEntryNotFoundException();
                    }

                    // Update Furnituring
                    FurnituringDAL.UpdateFurnituring(Furnituring);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("Furnituring object contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }

    }
}