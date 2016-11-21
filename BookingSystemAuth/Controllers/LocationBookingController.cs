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
    public class LocationBookingBookingController : ApiController
    {
        
        // Set up Service.
        LocationBookingService locationBookingService = new LocationBookingService();

        // GET: api/LocationBooking
        [Route("api/LocationBooking")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<LocationBooking> locationBookings = locationBookingService.GetLocationBookings();

                if (locationBookings == null)
                {
                    return NotFound();
                }

                return Ok(locationBookings);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/LocationBooking/5
        [Route("api/LocationBooking/{LocationBookingId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int LocationBookingId)
        {
            try
            {
                LocationBooking locationBooking = locationBookingService.GetLocationBooking(LocationBookingId);
                if (locationBooking == null)
                {
                    return NotFound();
                }
                return Ok(locationBooking);
            }
            catch
            {
                return InternalServerError();
            }
            
        }

        // Get info if there are any bookings for a period
        [Route("api/LocationBooking/period/{fromDate:datetime}/{toDate:datetime}/{moreOrLess}")]
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
                    IEnumerable<LocationBooking> bookings = locationBookingService.GetForPeriod(startTime.StartOfDay(), endTime.EndOfDay());

                    if (bookings == null)
                    {
                        return NotFound();
                    }

                    return Ok(bookings);
                }
                else if (moreOrLess == "less")
                {
                    // Get bookings
                    IEnumerable<CalendarBookingDay> bookings = locationBookingService.CheckDayBookingsForPeriod(startTime.StartOfDay(), endTime.EndOfDay());

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

        // Get info if there are any bookings for a specific location for a period
        [Route("api/LocationBooking/location/{locationId:int}/period/{fromDate:datetime}/{toDate:datetime}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int locationId, string fromDate, string toDate)
        {
            DateTime startTime, endTime;

            try
            {
                startTime = Convert.ToDateTime(fromDate);
                endTime = Convert.ToDateTime(toDate);

                // Get bookings
                IEnumerable<LocationBooking> bookings = locationBookingService.GetForLocationForPeriod(locationId, startTime.StartOfDay(), endTime.EndOfDay());

                if (bookings == null)
                {
                    return NotFound();
                }

                return Ok(bookings);

            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/LocationBooking
        [Authorize]
        [Route("api/LocationBooking")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(LocationBooking locationBooking)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save locationBooking
            try
            {
                locationBookingService.SaveLocationBooking(locationBooking);
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
            return Ok(locationBooking);
        }

        // DELETE: api/LocationBooking/5
        [Authorize]
        [Route("api/LocationBooking/{LocationBookingId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int LocationBookingId)
        {
            try
            {
                locationBookingService.LocationBookingDelete(LocationBookingId);
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
