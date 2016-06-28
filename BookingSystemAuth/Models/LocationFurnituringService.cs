using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class LocationFurnituringService
    {
        // Fields
        private LocationFurnituringDAL _locationFurnituringDAL;

        // Properties
        private LocationFurnituringDAL LocationFurnituringDAL
        {
            get
            {
                return _locationFurnituringDAL ?? (_locationFurnituringDAL = new LocationFurnituringDAL());
            }
        }

        // Methods
        public void LocationFurnituringDelete(LocationFurnituring LocationFurnituring)
        {
            LocationFurnituringDelete(LocationFurnituring.LocationId, LocationFurnituring.FurnituringId);
        }

        public void LocationFurnituringDelete(int LocationId, int? FurnituringId = null)
        {
            if (LocationId < 0 || FurnituringId != null && FurnituringId < 0)
            {
                throw new FormatException("Invalid LocationId or FurnituringId");
            }

            // Check that the LocationFurnituring exists before deletion
            LocationFurnituring LocationFurnituring = LocationFurnituringDAL.GetLocationFurnituringById(LocationId, FurnituringId);

            // If there is no LocationFurnituring
            if (LocationFurnituring == null)
            {
                throw new DataBaseEntryNotFoundException("LocationFurnituring does not exist");
            }

            // Delete LocationFurnituring
            LocationFurnituringDAL.DeleteLocationFurnituring(LocationId, FurnituringId);

        }

        public LocationFurnituring GetLocationFurnituring(int LocationId)
        {
            if (LocationId < 0)
            {
                throw new ApplicationException("Invalid LocationId");
            }

            return LocationFurnituringDAL.GetLocationFurnituringById(LocationId);
        }

        public IEnumerable<LocationFurnituring> GetLocationFurniturings(int? LocationId = null)
        {
            return LocationFurnituringDAL.GetLocationFurniturings(LocationId);
        }

        public void SaveLocationFurnituring(LocationFurnituring LocationFurnituring)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (LocationFurnituring.Validate(out validationResults))
            {
                // Check that the LocationFurnituring exists
                LocationFurnituring LocationFurnituringCheck = LocationFurnituringDAL.GetLocationFurnituringById(LocationFurnituring.LocationId, LocationFurnituring.FurnituringId);

                // If a new LocationFurnituring should be created
                if (LocationFurnituringCheck == null)
                {
                    LocationFurnituringDAL.InsertLocationFurnituring(LocationFurnituring);
                }
                // Existing LocationFurnituring should be updated
                else
                {
                    // Update LocationFurnituring
                    LocationFurnituringDAL.UpdateLocationFurnituring(LocationFurnituring);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("LocationFurnituring object contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }

        public void SaveLocationFurniturings(LocationFurnituring[] LocationFurniturings)
        {
            foreach (LocationFurnituring LocationFurnituring in LocationFurniturings)
            {
                this.SaveLocationFurnituring(LocationFurnituring);
            }
        }
    }
}