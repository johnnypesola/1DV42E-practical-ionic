using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class LocationService
    {
        // Fields
        private LocationDAL _locationDAL;

        // Properties
        private LocationDAL LocationDAL
        {
            get
            {
                return _locationDAL ?? (_locationDAL = new LocationDAL());
            }
        }

        // Methods
        public void LocationDelete(Location Location)
        {
            LocationDelete(Location.LocationId);
        }

        public void LocationDelete(int LocationId)
        {
            if (LocationId < 0)
            {
                throw new FormatException("Invalid LocationId");
            }

            // Check that the Location exists before deletion
            Location Location = LocationDAL.GetLocationById(LocationId);

            // If there is no Location
            if (Location == null)
            {
                throw new DataBaseEntryNotFoundException("Location does not exist");
            }

            // Delete Location
            LocationDAL.DeleteLocation(LocationId);
        }

        public Location GetLocation(int LocationId)
        {
            if (LocationId < 0)
            {
                throw new ApplicationException("Invalid LocationId");
            }

            return LocationDAL.GetLocationById(LocationId);
        }

        public IEnumerable<Location> GetLocations()
        {
            return LocationDAL.GetLocations();
        }

        public IEnumerable<Location> SearchFor(SearchContainer searchContainer)
        {
            return LocationDAL.SearchFor(searchContainer);
        }

        public IEnumerable<Location> GetLocationsFreeForPeriod(DateTime startTime, DateTime endTime)
        {
            return LocationDAL.GetLocationsFreeForPeriod(startTime, endTime);
        }

        public IEnumerable<Location> GetPageWise(string sortColumn, int pageSize, int pageIndex, out int totalRowCount)
        {
            return LocationDAL.GetLocationsPageWise(sortColumn, pageSize, pageIndex, out totalRowCount);
        }

        public void SaveLocation(Location Location)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (Location.Validate(out validationResults))
            {
                // If a new Location should be created
                if (Location.LocationId == 0)
                {
                    LocationDAL.InsertLocation(Location);
                }
                // Existing Location should be updated
                else
                {
                    // Check that the Location exists before update
                    if (LocationDAL.GetLocationById(Location.LocationId) == null)
                    {
                        throw new DataBaseEntryNotFoundException();
                    }

                    // Update Location
                    LocationDAL.UpdateLocation(Location);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("Location object contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }

    }
}