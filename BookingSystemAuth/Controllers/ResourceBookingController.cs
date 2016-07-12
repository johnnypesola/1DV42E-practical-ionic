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
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ResourceBookingBookingController : ApiController
    {
        
        // Set up Service.
        ResourceBookingService resourceBookingService = new ResourceBookingService();  

        // GET: api/ResourceBooking
        [Route("api/ResourceBooking")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<ResourceBooking> resourceBookings = resourceBookingService.GetResourceBookings();

                if (resourceBookings == null)
                {
                    return NotFound();
                }

                return Ok(resourceBookings);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/ResourceBooking/5
        [Route("api/ResourceBooking/{ResourceBookingId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int ResourceBookingId)
        {
            try
            {
                ResourceBooking resourceBooking = resourceBookingService.GetResourceBooking(ResourceBookingId);
                if (resourceBooking == null)
                {
                    return NotFound();
                }
                return Ok(resourceBooking);
            }
            catch
            {
                return InternalServerError();
            }
            
        }

        // Get info if there are any bookings for a period
        [Route("api/ResourceBooking/period/{fromDate:datetime}/{toDate:datetime}/{moreOrLess}")]
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
                    IEnumerable<ResourceBooking> bookings = resourceBookingService.GetForPeriod(startTime.StartOfDay(), endTime.EndOfDay());

                    if (bookings == null)
                    {
                        return NotFound();
                    }

                    return Ok(bookings);
                }
                else if (moreOrLess == "less")
                {
                    // Get bookings
                    IEnumerable<CalendarBookingDay> bookings = resourceBookingService.CheckDayBookingsForPeriod(startTime.StartOfDay(), endTime.EndOfDay());

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

        // POST: api/ResourceBooking
        [Route("api/ResourceBooking")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(ResourceBooking resourceBooking)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save resourceBooking
            try
            {
                resourceBookingService.SaveResourceBooking(resourceBooking);
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
            return Ok(resourceBooking);
        }

        // DELETE: api/ResourceBooking/5
        [Route("api/ResourceBooking/{ResourceBookingId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int ResourceBookingId)
        {
            try
            {
                resourceBookingService.ResourceBookingDelete(ResourceBookingId);
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
