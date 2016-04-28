using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using BookingSystem.Models;
using System.Data;

namespace BookingSystem.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class BookingTypeHasMealController : ApiController
    {
        // Set up Service.
        BookingTypeHasMealService bookingTypeHasMealService = new BookingTypeHasMealService();

        // GET: api/BookingTypeHasMeal
        [Route("api/BookingTypeHasMeal")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<BookingTypeHasMeal> bookingTypeHasMeals = bookingTypeHasMealService.GetBookingTypeHasMeals();

                if (bookingTypeHasMeals == null)
                {
                    return NotFound();
                }

                return Ok(bookingTypeHasMeals);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/BookingTypeHasMeal/5
        [Route("api/BookingTypeHasMeal/{BookingTypeId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int BookingTypeId)
        {
            try
            {
                BookingTypeHasMeal bookingTypeHasMeal = bookingTypeHasMealService.GetBookingTypeHasMeal(BookingTypeId);
                if (bookingTypeHasMeal == null)
                {
                    return NotFound();
                }
                return Ok(bookingTypeHasMeal);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/BookingTypeHasMeal
        [Route("api/BookingTypeHasMeal")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(BookingTypeHasMeal bookingTypeHasMeal)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save bookingTypeHasMeal
            try
            {
                bookingTypeHasMealService.SaveBookingTypeHasMeal(bookingTypeHasMeal);
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
            return Ok(bookingTypeHasMeal); //CreatedAtRoute("DefaultApi", new { id = bookingTypeHasMeal.BookingTypeHasMealId }, bookingTypeHasMeal);
        }

        // POST: api/BookingTypeHasMeal/location
        [Route("api/BookingTypeHasMeal/location")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(BookingTypeHasMeal[] bookingTypeHasMeals)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save bookingTypeHasMeal
            try
            {
                bookingTypeHasMealService.SaveBookingTypeHasMeals(bookingTypeHasMeals);
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
            return Ok(bookingTypeHasMeals); //CreatedAtRoute("DefaultApi", new { id = bookingTypeHasMeal.BookingTypeHasMealId }, bookingTypeHasMeal);
        }

        // DELETE: api/BookingTypeHasMeal/5/5
        [Route("api/BookingTypeHasMeal/{BookingTypeId:int}/{MealId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int BookingTypeId, int MealId)
        {
            try
            {
                // Delete info from database
                bookingTypeHasMealService.BookingTypeHasMealDelete(BookingTypeId, MealId);
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

        // DELETE: api/BookingTypeHasMeal/5/5
        [Route("api/BookingTypeHasMeal/{BookingTypeId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int BookingTypeId)
        {
            try
            {
                // Delete info from database
                bookingTypeHasMealService.BookingTypeHasMealDelete(BookingTypeId);
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

        // GET: all location furniturings for specific location
        [Route("api/BookingTypeHasMeal/location/{BookingTypeId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult GetForBookingType(int BookingTypeId)
        {
            try
            {
                IEnumerable<BookingTypeHasMeal> bookingTypeHasMeals = bookingTypeHasMealService.GetBookingTypeHasMeals(BookingTypeId);

                if (bookingTypeHasMeals == null)
                {
                    return NotFound();
                }
                return Ok(bookingTypeHasMeals);
            }
            catch
            {
                return InternalServerError();
            }

        }
    }
}
