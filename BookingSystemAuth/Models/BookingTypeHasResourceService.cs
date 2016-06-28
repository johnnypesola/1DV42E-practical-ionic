using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class BookingTypeHasResourceService
    {
        // Fields
        private BookingTypeHasResourceDAL _bookingTypeHasResourceDAL;

        // Properties
        private BookingTypeHasResourceDAL BookingTypeHasResourceDAL
        {
            get
            {
                return _bookingTypeHasResourceDAL ?? (_bookingTypeHasResourceDAL = new BookingTypeHasResourceDAL());
            }
        }

        // Methods
        public void BookingTypeHasResourceDelete(BookingTypeHasResource BookingTypeHasResource)
        {
            BookingTypeHasResourceDelete(BookingTypeHasResource.BookingTypeId, BookingTypeHasResource.ResourceId);
        }

        public void BookingTypeHasResourceDelete(int BookingTypeId, int? ResourceId = null)
        {
            if (BookingTypeId < 0 || ResourceId != null && ResourceId < 0)
            {
                throw new FormatException("Invalid BookingTypeId or ResourceId");
            }

            // Check that the BookingTypeHasResource exists before deletion
            BookingTypeHasResource BookingTypeHasResource = BookingTypeHasResourceDAL.GetBookingTypeHasResourceById(BookingTypeId, ResourceId);

            // If there is no BookingTypeHasResource
            if (BookingTypeHasResource == null)
            {
                throw new DataBaseEntryNotFoundException("BookingTypeHasResource does not exist");
            }

            // Delete BookingTypeHasResource
            BookingTypeHasResourceDAL.DeleteBookingTypeHasResource(BookingTypeId, ResourceId);

        }

        public BookingTypeHasResource GetBookingTypeHasResource(int BookingTypeId)
        {
            if (BookingTypeId < 0)
            {
                throw new ApplicationException("Invalid BookingTypeId");
            }

            return BookingTypeHasResourceDAL.GetBookingTypeHasResourceById(BookingTypeId);
        }

        public IEnumerable<BookingTypeHasResource> GetBookingTypeHasResources(int? BookingTypeId = null)
        {
            return BookingTypeHasResourceDAL.GetBookingTypeHasResources(BookingTypeId);
        }

        public void SaveBookingTypeHasResource(BookingTypeHasResource BookingTypeHasResource)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (BookingTypeHasResource.Validate(out validationResults))
            {
                // Check that the BookingTypeHasResource exists
                BookingTypeHasResource BookingTypeHasResourceCheck = BookingTypeHasResourceDAL.GetBookingTypeHasResourceById(BookingTypeHasResource.BookingTypeId, BookingTypeHasResource.ResourceId);

                // If a new BookingTypeHasResource should be created
                if (BookingTypeHasResourceCheck == null)
                {
                    BookingTypeHasResourceDAL.InsertBookingTypeHasResource(BookingTypeHasResource);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("BookingTypeHasResource object contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }

        public void SaveBookingTypeHasResources(BookingTypeHasResource[] BookingTypeHasResources)
        {
            foreach (BookingTypeHasResource BookingTypeHasResource in BookingTypeHasResources)
            {
                this.SaveBookingTypeHasResource(BookingTypeHasResource);
            }
        }
    }
}