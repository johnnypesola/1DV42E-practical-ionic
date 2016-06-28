using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BookingSystemAuth.Models;
using System.Data;

namespace BookingSystemAuth.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class BookingTypeHasLocationController : ApiController
    {
        // Set up Service.
        BookingTypeHasLocationService bookingTypeHasLocationService = new BookingTypeHasLocationService();

        // GET: api/BookingTypeHasLocation
        [Route("api/BookingTypeHasLocation")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<BookingTypeHasLocation> bookingTypeHasLocations = bookingTypeHasLocationService.GetBookingTypeHasLocations();

                if (bookingTypeHasLocations == null)
                {
                    return NotFound();
                }

                return Ok(bookingTypeHasLocations);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/BookingTypeHasLocation/5
        [Route("api/BookingTypeHasLocation/{BookingTypeId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int BookingTypeId)
        {
            try
            {
                BookingTypeHasLocation bookingTypeHasLocation = bookingTypeHasLocationService.GetBookingTypeHasLocation(BookingTypeId);
                if (bookingTypeHasLocation == null)
                {
                    return NotFound();
                }
                return Ok(bookingTypeHasLocation);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/BookingTypeHasLocation
        [Route("api/BookingTypeHasLocation")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(BookingTypeHasLocation bookingTypeHasLocation)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save bookingTypeHasLocation
            try
            {
                bookingTypeHasLocationService.SaveBookingTypeHasLocation(bookingTypeHasLocation);
            }
            catch (DataBaseEntryNotFoundException)
            {
                return NotFound();
            }
            catch (DuplicateNameException)
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
            return Ok(bookingTypeHasLocation); //CreatedAtRoute("DefaultApi", new { id = bookingTypeHasLocation.BookingTypeHasLocationId }, bookingTypeHasLocation);
        }

        // POST: api/BookingTypeHasLocation/location
        [Route("api/BookingTypeHasLocation/location")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(BookingTypeHasLocation[] bookingTypeHasLocations)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save bookingTypeHasLocation
            try
            {
                bookingTypeHasLocationService.SaveBookingTypeHasLocations(bookingTypeHasLocations);
            }
            catch (DataBaseEntryNotFoundException)
            {
                return NotFound();
            }
            catch (DuplicateNameException)
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
            return Ok(bookingTypeHasLocations); //CreatedAtRoute("DefaultApi", new { id = bookingTypeHasLocation.BookingTypeHasLocationId }, bookingTypeHasLocation);
        }

        // DELETE: api/BookingTypeHasLocation/5/5
        [Route("api/BookingTypeHasLocation/{BookingTypeId:int}/{LocationId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int BookingTypeId, int LocationId)
        {
            try
            {
                // Delete info from database
                bookingTypeHasLocationService.BookingTypeHasLocationDelete(BookingTypeId, LocationId);
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

        // DELETE: api/BookingTypeHasLocation/5/5
        [Route("api/BookingTypeHasLocation/{BookingTypeId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int BookingTypeId)
        {
            try
            {
                // Delete info from database
                bookingTypeHasLocationService.BookingTypeHasLocationDelete(BookingTypeId);
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

        // GET: all location for specific booking type
        [Route("api/BookingTypeHasLocation/location/{BookingTypeId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult GetForBookingType(int BookingTypeId)
        {
            try
            {
                IEnumerable<BookingTypeHasLocation> bookingTypeHasLocations = bookingTypeHasLocationService.GetBookingTypeHasLocations(BookingTypeId);

                if (bookingTypeHasLocations == null)
                {
                    return NotFound();
                }
                return Ok(bookingTypeHasLocations);
            }
            catch
            {
                return InternalServerError();
            }

        }
    }
}
