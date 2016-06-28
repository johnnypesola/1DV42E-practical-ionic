using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class BookingTypeService
    {
        // Fields
        private BookingTypeDAL _bookingTypeDAL;

        // Properties
        private BookingTypeDAL BookingTypeDAL
        {
            get
            {
                return _bookingTypeDAL ?? (_bookingTypeDAL = new BookingTypeDAL());
            }
        }

        // Methods
        public void BookingTypeDelete(BookingType BookingType)
        {
            BookingTypeDelete(BookingType.BookingTypeId);
        }

        public void BookingTypeDelete(int BookingTypeId)
        {
            if (BookingTypeId < 0)
            {
                throw new FormatException("Invalid BookingTypeId");
            }

            // Check that the BookingType exists before deletion
            BookingType BookingType = BookingTypeDAL.GetBookingTypeById(BookingTypeId);

            // If there is no BookingType
            if (BookingType == null)
            {
                throw new DataBaseEntryNotFoundException("BookingType does not exist");
            }

            // Delete BookingType
            BookingTypeDAL.DeleteBookingType(BookingTypeId);

        }

        public BookingType GetBookingType(int BookingTypeId)
        {
            if (BookingTypeId < 0)
            {
                throw new ApplicationException("Invalid BookingTypeId");
            }

            return BookingTypeDAL.GetBookingTypeById(BookingTypeId);
        }

        public IEnumerable<BookingType> GetBookingTypes()
        {
            return BookingTypeDAL.GetBookingTypes();
        }

        public IEnumerable<BookingType> GetPageWise(string sortColumn, int pageSize, int pageIndex, out int totalRowCount)
        {
            return BookingTypeDAL.GetBookingTypesPageWise(sortColumn, pageSize, pageIndex, out totalRowCount);
        }

        public void SaveBookingType(BookingType BookingType)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (BookingType.Validate(out validationResults))
            {
                // If a new BookingType should be created
                if (BookingType.BookingTypeId == 0)
                {
                    BookingTypeDAL.InsertBookingType(BookingType);
                }
                // Existing BookingType should be updated
                else
                {
                    // Check that the BookingType exists before update
                    if (BookingTypeDAL.GetBookingTypeById(BookingType.BookingTypeId) == null)
                    {
                        throw new DataBaseEntryNotFoundException();
                    }

                    // Update BookingType
                    BookingTypeDAL.UpdateBookingType(BookingType);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("BookingType object contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }
    }
}