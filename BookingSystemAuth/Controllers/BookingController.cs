using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystemAuth.Models;
using System.Web.Http.Cors;
using System.Text.RegularExpressions;
using Newtonsoft.Json.Linq;

namespace BookingSystemAuth.Controllers
{
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class BookingController : ApiController
    {
        public BookingService bookingService;
        public LocationBookingService locationBookingService;
        public ResourceBookingService resourceBookingService;
        public MealBookingService mealBookingService;

        // Constructor
        public BookingController()
        {
            bookingService = new BookingService();
            locationBookingService = new LocationBookingService();
            resourceBookingService = new ResourceBookingService();
            mealBookingService = new MealBookingService();
        }

        // Constructor for testing (mocking service)
        public BookingController(BookingService testService = null)
        {
            // Set up Service.
            if (testService != null)
            {
                bookingService = testService;
            } else {
                bookingService = new BookingService();
            }
        }

        // GET: api/Booking
        [Route("api/Booking")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<Booking> bookings = bookingService.Get();

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

        // GET: api/Booking/empty
        [Route("api/Booking/empty/{infoOrCount}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult GetEmpty(String infoOrCount)
        {
            try
            {
                IEnumerable<Booking> bookings;
                int bookingsCount;
                JObject returnData;

                // Check how much data is requested
                if (infoOrCount == "info")
                {
                    bookings = bookingService.GetEmpty();

                    if (bookings == null)
                    {
                        return NotFound();
                    }

                    return Ok(bookings);
                }
                else
                {
                    bookingsCount = bookingService.GetEmptyBookingsCount();

                    // Build return JSON object
                    returnData = JObject.Parse(String.Format("{{ 'count' : '{0}'}}", bookingsCount));

                    return Ok(returnData);
                }
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/Booking/5
        [Route("api/Booking/{BookingId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int BookingId)
        {
            try
            {
                // Get booking
                Booking booking = bookingService.Get(BookingId);

                if (booking == null)
                {
                    return NotFound();
                }

                // Create lists to contain bookings
                booking.LocationBookings = new List<LocationBooking>(50);
                booking.ResourceBookings = new List<ResourceBooking>(50);
                booking.MealBookings = new List<MealBooking>(50);

                // Get all types of bookings
                booking.LocationBookings = locationBookingService.GetLocationBookings(booking.BookingId);
                booking.ResourceBookings = resourceBookingService.GetResourceBookings(booking.BookingId);
                booking.MealBookings = mealBookingService.GetMealBookings(booking.BookingId);

                return Ok(booking);
            }
            catch
            {
                return InternalServerError();
            }
        }
         
        // Get info if there are any bookings for a period
        [Route("api/Booking/period/{fromDate:datetime}/{toDate:datetime}/{moreOrLess}")]
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
                    IEnumerable<Booking> bookings = bookingService.GetForPeriod(startTime.StartOfDay(), endTime.EndOfDay());

                    if (bookings == null)
                    {
                        return NotFound();
                    }

                    // Get location bookings for bookings.
                    foreach (Booking booking in bookings)
                    {
                        // Create list to cointain location bookings
                        booking.LocationBookings = new List<LocationBooking>(50);

                        // Get all location bookings
                        booking.LocationBookings = locationBookingService.GetLocationBookings(booking.BookingId);
                    }

                    return Ok(bookings);
                }
                else if (moreOrLess == "less")
                {
                    // Get bookings
                    IEnumerable<CalendarBookingDay> bookings = bookingService.CheckDaysForPeriod(startTime, endTime);

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

        
        // GET: api/Booking/search/ColumnName?value=hello
        [Route("api/Booking/search/{columnName}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(string columnName, string value)
        {
            SearchContainer searchContainer;
            try
            {
                
                // Construct a search container object
                searchContainer = new SearchContainer { ColumnName = columnName, SearchValue = value };

                // Get bookings
                IEnumerable<Booking> bookings = bookingService.SearchFor(searchContainer);

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
        

        // POST api/Booking
        [Route("api/Booking")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(Booking booking)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            // Try to save booking
            try
            {
                bookingService.Save(booking);
            }
            catch
            {
                return InternalServerError();
            }

            // Respond that the booking was created and redirect
            return Ok(booking);  //CreatedAtRoute("DefaultApi", new { id = booking.BookingId }, booking);

        }

        // DELETE: api/Booking/5
        [Route("api/Booking/{BookingId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int BookingId)
        {
            try
            {
                bookingService.Delete(BookingId);
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
