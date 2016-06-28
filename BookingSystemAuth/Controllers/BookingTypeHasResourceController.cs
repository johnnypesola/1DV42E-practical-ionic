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
    public class BookingTypeHasResourceController : ApiController
    {
        // Set up Service.
        BookingTypeHasResourceService bookingTypeHasResourceService = new BookingTypeHasResourceService();

        // GET: api/BookingTypeHasResource
        [Route("api/BookingTypeHasResource")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<BookingTypeHasResource> bookingTypeHasResources = bookingTypeHasResourceService.GetBookingTypeHasResources();

                if (bookingTypeHasResources == null)
                {
                    return NotFound();
                }

                return Ok(bookingTypeHasResources);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/BookingTypeHasResource/5
        [Route("api/BookingTypeHasResource/{BookingTypeId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int BookingTypeId)
        {
            try
            {
                BookingTypeHasResource bookingTypeHasResource = bookingTypeHasResourceService.GetBookingTypeHasResource(BookingTypeId);
                if (bookingTypeHasResource == null)
                {
                    return NotFound();
                }
                return Ok(bookingTypeHasResource);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/BookingTypeHasResource
        [Route("api/BookingTypeHasResource")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(BookingTypeHasResource bookingTypeHasResource)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save bookingTypeHasResource
            try
            {
                bookingTypeHasResourceService.SaveBookingTypeHasResource(bookingTypeHasResource);
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
            return Ok(bookingTypeHasResource); //CreatedAtRoute("DefaultApi", new { id = bookingTypeHasResource.BookingTypeHasResourceId }, bookingTypeHasResource);
        }

        // POST: api/BookingTypeHasResource/resource
        [Route("api/BookingTypeHasResource/resource")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(BookingTypeHasResource[] bookingTypeHasResources)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save bookingTypeHasResource
            try
            {
                bookingTypeHasResourceService.SaveBookingTypeHasResources(bookingTypeHasResources);
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
            return Ok(bookingTypeHasResources); //CreatedAtRoute("DefaultApi", new { id = bookingTypeHasResource.BookingTypeHasResourceId }, bookingTypeHasResource);
        }

        // DELETE: api/BookingTypeHasResource/5/5
        [Route("api/BookingTypeHasResource/{BookingTypeId:int}/{ResourceId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int BookingTypeId, int ResourceId)
        {
            try
            {
                // Delete info from database
                bookingTypeHasResourceService.BookingTypeHasResourceDelete(BookingTypeId, ResourceId);
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

        // DELETE: api/BookingTypeHasResource/5/5
        [Route("api/BookingTypeHasResource/{BookingTypeId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int BookingTypeId)
        {
            try
            {
                // Delete info from database
                bookingTypeHasResourceService.BookingTypeHasResourceDelete(BookingTypeId);
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

        // GET: all resource for specific booking type
        [Route("api/BookingTypeHasResource/resource/{BookingTypeId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult GetForBookingType(int BookingTypeId)
        {
            try
            {
                IEnumerable<BookingTypeHasResource> bookingTypeHasResources = bookingTypeHasResourceService.GetBookingTypeHasResources(BookingTypeId);

                if (bookingTypeHasResources == null)
                {
                    return NotFound();
                }
                return Ok(bookingTypeHasResources);
            }
            catch
            {
                return InternalServerError();
            }

        }
    }
}
