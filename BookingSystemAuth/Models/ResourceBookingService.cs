using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class ResourceBookingService
    {
        // Fields
        private ResourceBookingDAL _resourceBookingDAL;
        private SharedDAL _sharedDAL;

        // Properties
        private ResourceBookingDAL ResourceBookingDAL
        {
            get
            {
                return _resourceBookingDAL ?? (_resourceBookingDAL = new ResourceBookingDAL());
            }
        }
        private SharedDAL SharedDAL
        {
            get
            {
                return _sharedDAL ?? (_sharedDAL = new SharedDAL());
            }
        }

        public IEnumerable<CalendarBookingDay> CheckDayBookingsForPeriod(DateTime startTime, DateTime endTime)
        {
            return SharedDAL.CheckDayBookingsForPeriod(startTime, endTime, "resource");
        }

        public IQueryable<ResourceBooking> GetForPeriod(DateTime startTime, DateTime endTime)
        {
            return ResourceBookingDAL.GetResourceBookingsForPeriod(startTime, endTime).AsQueryable();
        }

        public void SaveResourceBooking(ResourceBooking resourceBooking)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (resourceBooking.Validate(out validationResults))
            {
                // If a new booking should be created
                if (resourceBooking.ResourceBookingId == 0)
                {
                    ResourceBookingDAL.InsertResourceBooking(resourceBooking);
                }
                // Existing booking should be updated
                else
                {
                    // Check that the booking exists before update
                    if (ResourceBookingDAL.GetResourceBookingById(resourceBooking.ResourceBookingId) == null)
                    {
                        throw new ApplicationException("The resource booking that was to be updated does not exist anymore.");
                    }

                    // Update booking
                    ResourceBookingDAL.UpdateResourceBooking(resourceBooking);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("The resource booking contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }

        public ResourceBooking GetResourceBooking(int ResourceBookingId)
        {
            if (ResourceBookingId < 0)
            {
                throw new ApplicationException("Invalid ResourceBookingId");
            }

            return ResourceBookingDAL.GetResourceBookingById(ResourceBookingId);
        }

        public IEnumerable<ResourceBooking> GetResourceBookings(int? BookingId = null)
        {
            return ResourceBookingDAL.GetResourceBookings(BookingId);
        }

        public void ResourceBookingDelete(int ResourceBookingId)
        {
            if (ResourceBookingId < 0)
            {
                throw new FormatException("Invalid ResourceBookingId");
            }

            // Check that the Resource exists before deletion
            ResourceBooking ResourceBooking = ResourceBookingDAL.GetResourceBookingById(ResourceBookingId);

            // If there is no Resource
            if (ResourceBooking == null)
            {
                throw new DataBaseEntryNotFoundException("The Resource booking does not exist");
            }

            // Delete Resource
            ResourceBookingDAL.DeleteResourceBooking(ResourceBookingId);
        }
    }

    /*
     *                 // Check that the resource is not allready booked/busy.
                if (BookingDAL.IsResourceBooked(booking))
                {
                    throw new ApplicationException("Lokalen är tyvärr redan bokad under denna tillfälle.");
                }
     */
}