using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class BookingTypeHasMealService
    {
        // Fields
        private BookingTypeHasMealDAL _bookingTypeHasMealDAL;

        // Properties
        private BookingTypeHasMealDAL BookingTypeHasMealDAL
        {
            get
            {
                return _bookingTypeHasMealDAL ?? (_bookingTypeHasMealDAL = new BookingTypeHasMealDAL());
            }
        }

        // Methods
        public void BookingTypeHasMealDelete(BookingTypeHasMeal BookingTypeHasMeal)
        {
            BookingTypeHasMealDelete(BookingTypeHasMeal.BookingTypeId, BookingTypeHasMeal.MealId);
        }

        public void BookingTypeHasMealDelete(int BookingTypeId, int? MealId = null)
        {
            if (BookingTypeId < 0 || MealId != null && MealId < 0)
            {
                throw new FormatException("Invalid BookingTypeId or MealId");
            }

            // Check that the BookingTypeHasMeal exists before deletion
            BookingTypeHasMeal BookingTypeHasMeal = BookingTypeHasMealDAL.GetBookingTypeHasMealById(BookingTypeId, MealId);

            // If there is no BookingTypeHasMeal
            if (BookingTypeHasMeal == null)
            {
                throw new DataBaseEntryNotFoundException("BookingTypeHasMeal does not exist");
            }

            // Delete BookingTypeHasMeal
            BookingTypeHasMealDAL.DeleteBookingTypeHasMeal(BookingTypeId, MealId);

        }

        public BookingTypeHasMeal GetBookingTypeHasMeal(int BookingTypeId)
        {
            if (BookingTypeId < 0)
            {
                throw new ApplicationException("Invalid BookingTypeId");
            }

            return BookingTypeHasMealDAL.GetBookingTypeHasMealById(BookingTypeId);
        }

        public IEnumerable<BookingTypeHasMeal> GetBookingTypeHasMeals(int? BookingTypeId = null)
        {
            return BookingTypeHasMealDAL.GetBookingTypeHasMeals(BookingTypeId);
        }

        public void SaveBookingTypeHasMeal(BookingTypeHasMeal BookingTypeHasMeal)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (BookingTypeHasMeal.Validate(out validationResults))
            {
                // Check that the BookingTypeHasMeal exists
                BookingTypeHasMeal BookingTypeHasMealCheck = BookingTypeHasMealDAL.GetBookingTypeHasMealById(BookingTypeHasMeal.BookingTypeId, BookingTypeHasMeal.MealId);

                // If a new BookingTypeHasMeal should be created
                if (BookingTypeHasMealCheck == null)
                {
                    BookingTypeHasMealDAL.InsertBookingTypeHasMeal(BookingTypeHasMeal);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("BookingTypeHasMeal object contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }

        public void SaveBookingTypeHasMeals(BookingTypeHasMeal[] BookingTypeHasMeals)
        {
            foreach (BookingTypeHasMeal BookingTypeHasMeal in BookingTypeHasMeals)
            {
                this.SaveBookingTypeHasMeal(BookingTypeHasMeal);
            }
        }
    }
}