using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class MealBookingService
    {
        // Fields
        private MealBookingDAL _mealBookingDAL;
        private SharedDAL _sharedDAL;
        private MealHasPropertyDAL _mealHasPropertyDAL;

        // Properties
        private MealBookingDAL MealBookingDAL
        {
            get
            {
                return _mealBookingDAL ?? (_mealBookingDAL = new MealBookingDAL());
            }
        }
        private MealHasPropertyDAL MealHasPropertyDAL
        {
            get
            {
                return _mealHasPropertyDAL ?? (_mealHasPropertyDAL = new MealHasPropertyDAL());
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
            return SharedDAL.CheckDayBookingsForPeriod(startTime, endTime, "meal");
        }

        public IQueryable<MealBooking> GetForPeriod(DateTime startTime, DateTime endTime)
        {
            return MealBookingDAL.GetMealBookingsForPeriod(startTime, endTime).AsQueryable();
        }

        public void SaveMealBooking(MealBooking mealBooking)
        {
            // Preparare validation return data
            ICollection<ValidationResult> validationResults;

            // Try to validate given data
            if (mealBooking.Validate(out validationResults))
            {
                // If a new booking should be created
                if (mealBooking.MealBookingId == 0)
                {
                    MealBookingDAL.InsertMealBooking(mealBooking);
                }
                // Existing booking should be updated
                else
                {
                    // Check that the booking exists before update
                    if (MealBookingDAL.GetMealBookingById(mealBooking.MealBookingId) == null)
                    {
                        throw new ApplicationException("The meal booking that was to be updated does not exist anymore.");
                    }

                    // Update booking
                    MealBookingDAL.UpdateMealBooking(mealBooking);
                }
            }
            // Validation failed
            else
            {
                // Create exception
                ApplicationException exception = new ApplicationException("The meal booking contained invalid values.");

                // Add validation data to exception.
                exception.Data.Add("ValidationResults", validationResults);

                throw exception;
            }
        }

        public MealBooking GetMealBooking(int MealBookingId)
        {
            MealBooking mealBooking;

            if (MealBookingId < 0)
            {
                throw new ApplicationException("Invalid MealBookingId");
            }

            // Get MealBooking
            mealBooking = MealBookingDAL.GetMealBookingById(MealBookingId);

            // Get MealHas Properties
            mealBooking.MealHasProperties = MealHasPropertyDAL.GetMealHasPropertys(mealBooking.MealId);

            return mealBooking;
        }

        public IEnumerable<MealBooking> GetMealBookings(int? BookingId = null)
        {
            return MealBookingDAL.GetMealBookings(BookingId);
        }

        public void MealBookingDelete(int MealBookingId)
        {
            if (MealBookingId < 0)
            {
                throw new FormatException("Invalid MealBookingId");
            }

            // Check that the Meal exists before deletion
            MealBooking MealBooking = MealBookingDAL.GetMealBookingById(MealBookingId);

            // If there is no Meal
            if (MealBooking == null)
            {
                throw new DataBaseEntryNotFoundException("The Meal booking does not exist");
            }

            // Delete Meal
            MealBookingDAL.DeleteMealBooking(MealBookingId);
        }
    }

    /*
     *                 // Check that the meal is not allready booked/busy.
                if (BookingDAL.IsMealBooked(booking))
                {
                    throw new ApplicationException("Lokalen är tyvärr redan bokad under denna tillfälle.");
                }
     */
}