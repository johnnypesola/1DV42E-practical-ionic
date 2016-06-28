using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class BookingTypeHasLocationService
    {
        // Fields
        private BookingTypeHasLocationDAL _bookingTypeHasLocationDAL;

        // Properties
        private BookingTypeHasLocationDAL BookingTypeHasLocationDAL
        {
            get
            {
                return _bookingTypeHasLocationDAL ?? (_bookingTypeHasLocationDAL = new BookingTypeHasLocationDAL());
            }
        }

        // Methods
        public void BookingTypeHasLocationDelete(BookingTypeHasLocation BookingTypeHasLocation)
        {
            BookingTypeHasLocationDelete(BookingTypeHasLocation.BookingTypeId, BookingTypeHasLocation.LocationId);
        }

        public void BookingTypeHasLocationDelete(int BookingTypeId, int? LocationId = null)
        {
            if (BookingTypeId < 0 || LocationId != null && LocationId < 0)
            {
                throw new FormatException("Invalid BookingTypeId or LocationId");
            }

            // Check that the BookingTypeHasLocation exists before deletion
            BookingTypeHasLocation BookingTypeHasLocation = BookingTypeHasLocationDAL.GetBookingTypeHasLocationById(BookingTypeId, LocationId);

            // If there is no BookingTypeHasLocation
            if (BookingTypeHasLocation == null)
            {
                throw new DataBaseEntryNotFoundException("BookingTypeHasLocation does not exist");
            }

            // Delete BookingTypeHasLocation
            BookingTypeHasLocationDAL.DeleteBookingTypeHasLocation(BookingTypeId, LocationId);

        }

        public BookingTypeHasLocation GetBookingTypeHasLocation(int BookingTypeId)
        {
            if (BookingTypeId < 0)
            {
                throw new ApplicationException("Invalid BookingTypeId");
            }

            return BookingTypeHasLocationDAL.GetBookingTypeHasLocationById(BookingTypeId);
        }

        public IEnumerable<BookingTypeHasLocation> GetBookingTypeHasLocations(int? BookingTypeId = null)
        {
            return BookingTypeHasLocationDAL.GetBookingTypeHasLocations(BookingTypeId);
        }

        public void SaveBookingTypeHasLocation(BookingTypeHasLocation BookingTypeHasLocation)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (BookingTypeHasLocation.Validate(out validationResults))
            {
                // Check that the BookingTypeHasLocation exists
                BookingTypeHasLocation BookingTypeHasLocationCheck = BookingTypeHasLocationDAL.GetBookingTypeHasLocationById(BookingTypeHasLocation.BookingTypeId, BookingTypeHasLocation.LocationId);

                // If a new BookingTypeHasLocation should be created
                if (BookingTypeHasLocationCheck == null)
                {
                    BookingTypeHasLocationDAL.InsertBookingTypeHasLocation(BookingTypeHasLocation);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("BookingTypeHasLocation object contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }

        public void SaveBookingTypeHasLocations(BookingTypeHasLocation[] BookingTypeHasLocations)
        {
            foreach (BookingTypeHasLocation BookingTypeHasLocation in BookingTypeHasLocations)
            {
                this.SaveBookingTypeHasLocation(BookingTypeHasLocation);
            }
        }
    }
}