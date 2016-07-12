using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystemAuth.Models;
using System.Web.Http.Cors;
using System.Data;
using System.Text.RegularExpressions;

namespace BookingSystemAuth.Controllers
{
    [Authorize]
    public class MealBookingBookingController : ApiController
    {
        
        // Set up Service.
        MealBookingService mealBookingService = new MealBookingService();  

        // GET: api/MealBooking
        [Route("api/MealBooking")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<MealBooking> mealBookings = mealBookingService.GetMealBookings();

                if (mealBookings == null)
                {
                    return NotFound();
                }

                return Ok(mealBookings);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/MealBooking/5
        [Route("api/MealBooking/{MealBookingId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int MealBookingId)
        {
            try
            {
                MealBooking mealBooking = mealBookingService.GetMealBooking(MealBookingId);
                if (mealBooking == null)
                {
                    return NotFound();
                }
                return Ok(mealBooking);
            }
            catch
            {
                return InternalServerError();
            }
            
        }

        // Get info if there are any bookings for a period
        [Route("api/MealBooking/period/{fromDate:datetime}/{toDate:datetime}/{moreOrLess}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(string fromDate, string toDate, String moreOrLess)
        {
            DateTime startTime, endTime;

            try
            {
                startTime = Convert.ToDateTime(fromDate);
                endTime = Convert.ToDateTime(toDate);

                // Check how much data is requested
                if (moreOrLess == "more")
                {
                    // Get bookings
                    IEnumerable<MealBooking> bookings = mealBookingService.GetForPeriod(startTime.StartOfDay(), endTime.EndOfDay());

                    if (bookings == null)
                    {
                        return NotFound();
                    }

                    return Ok(bookings);
                }
                else if (moreOrLess == "less")
                {
                    // Get bookings
                    IEnumerable<CalendarBookingDay> bookings = mealBookingService.CheckDayBookingsForPeriod(startTime.StartOfDay(), endTime.EndOfDay());

                    if (bookings == null)
                    {
                        return NotFound();
                    }

                    return Ok(bookings);
                }
                else
                {
                    return NotFound();
                }
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/MealBooking
        [Route("api/MealBooking")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(MealBooking mealBooking)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save mealBooking
            try
            {
                mealBookingService.SaveMealBooking(mealBooking);
            }
            catch (DoubleBookingException)
            {
                return Conflict();
            }
            catch (ApprovedException exception)
            {
                return BadRequest(exception.Message);
            }
            catch
            {
                return InternalServerError();
            }

            // Respond that the booking was created and redirect
            return Ok(mealBooking);
        }

        // DELETE: api/MealBooking/5
        [Route("api/MealBooking/{MealBookingId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int MealBookingId)
        {
            try
            {
                mealBookingService.MealBookingDelete(MealBookingId);
            }
            catch (FormatException)
            {
                return BadRequest();
            }
            catch (DataBaseEntryNotFoundException)
            {
                return NotFound();
            }
            catch (ApprovedException exception)
            {
                return BadRequest(exception.Message);
            }
            catch
            {
                return InternalServerError();
            }

            return Ok();
        }
    }
}
