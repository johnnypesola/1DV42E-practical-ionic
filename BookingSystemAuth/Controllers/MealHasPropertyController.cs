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
    [Authorize]
    public class MealHasPropertyController : ApiController
    {
        // Set up Service.
        MealHasPropertyService mealHasPropertyService = new MealHasPropertyService();

        // GET: api/MealHasProperty
        [Route("api/MealHasProperty")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<MealHasProperty> mealHasPropertys = mealHasPropertyService.GetMealHasPropertys();

                if (mealHasPropertys == null)
                {
                    return NotFound();
                }

                return Ok(mealHasPropertys);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/MealHasProperty/5
        [Route("api/MealHasProperty/{MealId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int MealId)
        {
            try
            {
                MealHasProperty mealHasProperty = mealHasPropertyService.GetMealHasProperty(MealId);
                if (mealHasProperty == null)
                {
                    return NotFound();
                }
                return Ok(mealHasProperty);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/MealHasProperty
        [Route("api/MealHasProperty")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(MealHasProperty mealHasProperty)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save mealHasProperty
            try
            {
                mealHasPropertyService.SaveMealHasProperty(mealHasProperty);
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
            return Ok(mealHasProperty); //CreatedAtRoute("DefaultApi", new { id = mealHasProperty.MealHasPropertyId }, mealHasProperty);
        }

        // POST: api/MealHasProperty/meal
        [Route("api/MealHasProperty/meal")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(MealHasProperty[] mealHasPropertys)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save mealHasProperty
            try
            {
                mealHasPropertyService.SaveMealHasPropertys(mealHasPropertys);
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
            return Ok(mealHasPropertys); //CreatedAtRoute("DefaultApi", new { id = mealHasProperty.MealHasPropertyId }, mealHasProperty);
        }

        // DELETE: api/MealHasProperty/5/5
        [Route("api/MealHasProperty/{MealId:int}/{MealPropertyId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int MealId, int MealPropertyId)
        {
            try
            {
                // Delete info from database
                mealHasPropertyService.MealHasPropertyDelete(MealId, MealPropertyId);
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

        // DELETE: api/MealHasProperty/5/5
        [Route("api/MealHasProperty/{MealId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int MealId)
        {
            try
            {
                // Delete info from database
                mealHasPropertyService.MealHasPropertyDelete(MealId);
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

        // GET: all meal properties for specific meal
        [Route("api/MealHasProperty/meal/{MealId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult GetForMeal(int MealId)
        {
            try
            {
                IEnumerable<MealHasProperty> mealHasPropertys = mealHasPropertyService.GetMealHasPropertys(MealId);

                if (mealHasPropertys == null)
                {
                    return NotFound();
                }
                return Ok(mealHasPropertys);
            }
            catch
            {
                return InternalServerError();
            }

        }
    }
}
