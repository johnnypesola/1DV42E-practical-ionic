using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class BookingService
    {

        // Fields
        private BookingDAL _bookingDAL;
        private SharedDAL _sharedDAL;

        // Properties
        private BookingDAL BookingDAL
        {
            get
            {
                return _bookingDAL ?? (_bookingDAL = new BookingDAL());
            }
        }
        private SharedDAL SharedDAL
        {
            get
            {
                return _sharedDAL ?? (_sharedDAL = new SharedDAL());
            }
        }

        // Methods
        public void Delete(Booking booking)
        {
            Delete(booking.BookingId);
        }

        public void Delete(int bookingId)
        {
            if (bookingId < 0)
            {
                throw new ApplicationException("Ogiltigt boknings-id påträffades vid borttagning.");
            }

            // Check that the booking exists before deletion
            Booking booking = BookingDAL.GetBookingById(bookingId);

            // If there is no booking
            if (booking == null)
            {
                throw new ApplicationException("Bokningen är redan borttagen.");
            }

            // Delete booking
            BookingDAL.DeleteBooking(bookingId);

        }

        public Booking Get(int bookingId)
        {
            if (bookingId < 0)
            {
                throw new ApplicationException("Ogiltigt boknings-ID påträffades vid hämtning.");
            }

            return BookingDAL.GetBookingById(bookingId);
        }

        public IEnumerable<Booking> Get()
        {
            return BookingDAL.GetBookings();
        }

        public IQueryable<Booking> GetForPeriod(DateTime startTime, DateTime endTime)
        {
            return BookingDAL.GetBookingsForPeriod(startTime, endTime).AsQueryable();
        }

        public IEnumerable<Booking> GetEmpty()
        {
            return BookingDAL.GetEmptyBookings();
        }

        public int GetEmptyBookingsCount()
        {
            return BookingDAL.GetEmptyBookingsCount();
        }

        public IEnumerable<Booking> SearchFor(SearchContainer searchContainer)
        {
            return BookingDAL.SearchFor(searchContainer);
        }

        public IEnumerable<CalendarBookingDay> CheckDaysForPeriod(DateTime startTime, DateTime endTime)
        {
            return SharedDAL.CheckDayBookingsForPeriod(startTime, endTime, "booking");
        }

        public IQueryable<Booking> GetPageWise(string sortColumns, int maximumRows, int startRowIndex)
        {
            // Calculate correct startpageIndex
            int startPageIndex = (startRowIndex / maximumRows) + 1;

            // Sort columns
            string sortColumnNames = (sortColumns != null ? sortColumns.Split(',')[0] : "");

            // Get bookings from DAL
            return BookingDAL.GetBookingsPageWise(sortColumnNames, maximumRows, startPageIndex).AsQueryable();
        }

        public void Save(Booking booking)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (booking.Validate(out validationResults))
            {
                // If a new booking should be created
                if (booking.BookingId == 0)
                {
                    BookingDAL.InsertBooking(booking);
                }
                // Existing booking should be updated
                else
                {
                    // Check that the booking exists before update
                    if (BookingDAL.GetBookingById(booking.BookingId) == null)
                    {
                        throw new ApplicationException("Bokningen som skulle uppdateras är tyvärr borttagen.");
                    }

                    // Update booking
                    BookingDAL.UpdateBooking(booking);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("Bokningsobjektet innehöll felaktiga värden. Var god försök igen.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }
    }
}