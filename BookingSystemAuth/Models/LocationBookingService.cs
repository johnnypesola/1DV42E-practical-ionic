using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class LocationBookingService
    {
        // Fields
        private LocationBookingDAL _locationBookingDAL;
        private SharedDAL _sharedDAL;

        // Properties
        private LocationBookingDAL LocationBookingDAL
        {
            get
            {
                return _locationBookingDAL ?? (_locationBookingDAL = new LocationBookingDAL());
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
            return SharedDAL.CheckDayBookingsForPeriod(startTime, endTime, "location");
        }

        public IQueryable<LocationBooking> GetForPeriod(DateTime startTime, DateTime endTime)
        {
            return LocationBookingDAL.GetLocationBookingsForPeriod(startTime, endTime).AsQueryable();
        }

        public IQueryable<LocationBooking> GetForLocationForPeriod(int locationId, DateTime startTime, DateTime endTime)
        {
            return LocationBookingDAL.GetLocationBookingsForPeriod(startTime, endTime, locationId).AsQueryable();
        }

        public void SaveLocationBooking(LocationBooking locationBooking)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (locationBooking.Validate(out validationResults))
            {
                // If a new booking should be created
                if (locationBooking.LocationBookingId == 0)
                {
                    LocationBookingDAL.InsertLocationBooking(locationBooking);
                }
                // Existing booking should be updated
                else
                {
                    // Check that the booking exists before update
                    if (LocationBookingDAL.GetLocationBookingById(locationBooking.LocationBookingId) == null)
                    {
                        throw new ApplicationException("The location booking that was to be updated does not exist anymore.");
                    }

                    // Update booking
                    LocationBookingDAL.UpdateLocationBooking(locationBooking);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("The location booking contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }

        public LocationBooking GetLocationBooking(int LocationBookingId)
        {
            if (LocationBookingId < 0)
            {
                throw new ApplicationException("Invalid LocationBookingId");
            }

            return LocationBookingDAL.GetLocationBookingById(LocationBookingId);
        }

        public IEnumerable<LocationBooking> GetLocationBookings(int? BookingId = null)
        {
            return LocationBookingDAL.GetLocationBookings(BookingId);
        }

        public void LocationBookingDelete(int LocationBookingId)
        {
            if (LocationBookingId < 0)
            {
                throw new FormatException("Invalid LocationBookingId");
            }

            // Check that the Location exists before deletion
            LocationBooking LocationBooking = LocationBookingDAL.GetLocationBookingById(LocationBookingId);

            // If there is no Location
            if (LocationBooking == null)
            {
                throw new DataBaseEntryNotFoundException("The Location booking does not exist");
            }

            // Delete Location
            LocationBookingDAL.DeleteLocationBooking(LocationBookingId);
        }
    }

    /*
     *                 // Check that the location is not allready booked/busy.
                if (BookingDAL.IsLocationBooked(booking))
                {
                    throw new ApplicationException("Lokalen är tyvärr redan bokad under denna tillfälle.");
                }
     */
}