using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class ResourceService
    {
        // Fields
        private ResourceDAL _resourceDAL;

        // Properties
        private ResourceDAL ResourceDAL
        {
            get
            {
                return _resourceDAL ?? (_resourceDAL = new ResourceDAL());
            }
        }

        // Methods
        public void ResourceDelete(Resource Resource)
        {
            ResourceDelete(Resource.ResourceId);
        }

        public void ResourceDelete(int ResourceId)
        {
            if (ResourceId < 0)
            {
                throw new FormatException("Invalid ResourceId");
            }

            // Check that the Resource exists before deletion
            Resource Resource = ResourceDAL.GetResourceById(ResourceId);

            // If there is no Resource
            if (Resource == null)
            {
                throw new DataBaseEntryNotFoundException("Resource does not exist");
            }

            // Delete Resource
            ResourceDAL.DeleteResource(ResourceId);

        }

        public Resource GetResource(int ResourceId)
        {
            if (ResourceId < 0)
            {
                throw new ApplicationException("Invalid ResourceId");
            }

            return ResourceDAL.GetResourceById(ResourceId);
        }

        public IEnumerable<Resource> GetResources()
        {
            return ResourceDAL.GetResources();
        }

        public IEnumerable<Resource> GetResourcesFreeForPeriod(DateTime startTime, DateTime endTime)
        {
            return ResourceDAL.GetResourcesFreeForPeriod(startTime, endTime);
        }

        public IEnumerable<Resource> GetPageWise(string sortColumn, int pageSize, int pageIndex, out int totalRowCount)
        {
            return ResourceDAL.GetResourcesPageWise(sortColumn, pageSize, pageIndex, out totalRowCount);
        }

        public void SaveResource(Resource Resource)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (Resource.Validate(out validationResults))
            {
                // If a new Resource should be created
                if (Resource.ResourceId == 0)
                {
                    ResourceDAL.InsertResource(Resource);
                }
                // Existing Resource should be updated
                else
                {
                    // Check that the Resource exists before update
                    if (ResourceDAL.GetResourceById(Resource.ResourceId) == null)
                    {
                        throw new DataBaseEntryNotFoundException();
                    }

                    // Update Resource
                    ResourceDAL.UpdateResource(Resource);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("Resource object contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }
    }
}