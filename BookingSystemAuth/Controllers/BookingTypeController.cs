using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystemAuth.Models;
using System.Web.Http.Cors;
using System.Data;
using System.Drawing;
using System.IO;
using System.Web;
using Newtonsoft.Json.Linq;

namespace BookingSystemAuth.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class BookingTypeController : ApiController
    {

        // Set up Service.
        BookingTypeService bookingTypeService = new BookingTypeService();

        // GET: api/BookingType
        [Route("api/BookingType")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<BookingType> bookingTypes = bookingTypeService.GetBookingTypes();

                if (bookingTypes == null)
                {
                    return NotFound();
                }

                return Ok(bookingTypes);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/BookingType/5
        [Route("api/BookingType/{BookingTypeId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int BookingTypeId)
        {
            try
            {
                BookingType bookingType = bookingTypeService.GetBookingType(BookingTypeId);
                if (bookingType == null)
                {
                    return NotFound();
                }
                return Ok(bookingType);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/BookingType
        [Route("api/BookingType")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(BookingType bookingType)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save bookingType
            try
            {
                bookingTypeService.SaveBookingType(bookingType);
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
            return Ok(bookingType); //CreatedAtRoute("DefaultApi", new { id = bookingType.BookingTypeId }, bookingType);
        }

        // DELETE: api/BookingType/5
        [Route("api/BookingType/{BookingTypeId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int BookingTypeId)
        {
            try
            {
                // Delete info from database
                bookingTypeService.BookingTypeDelete(BookingTypeId);
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
