using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystemAuth.Models;
using System.Web.Http.Cors;
using System.Data;
using Microsoft.AspNet.Identity;

namespace BookingSystemAuth.Controllers
{
    // [IdentityBasicAuthentication] // Enable authentication via an ASP.NET Identity user name and password
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MealPropertyController : ApiController
    {
        // Set up Service.
        MealPropertyService mealPropertyService = new MealPropertyService();

        // GET: api/MealProperty
        [Route("api/MealProperty")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<MealProperty> mealProperties = mealPropertyService.GetMealProperties();

                if (mealProperties == null)
                {
                    return NotFound();
                }

                return Ok(mealProperties);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/MealProperty/5
        [Route("api/MealProperty/{MealPropertyId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int MealPropertyId)
        {
            try
            {
                MealProperty mealProperty = mealPropertyService.GetMealProperty(MealPropertyId);
                if (mealProperty == null)
                {
                    return NotFound();
                }
                return Ok(mealProperty);
            }
            catch
            {
                return InternalServerError();
            }

        }

        // POST: api/MealProperty
        [Route("api/MealProperty")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(MealProperty mealProperty)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save mealProperty
            try
            {
                mealPropertyService.SaveMealProperty(mealProperty);
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
            return Ok(mealProperty); //CreatedAtRoute("DefaultApi", new { id = mealProperty.MealPropertyId }, mealProperty);
        }

        // DELETE: api/MealProperty/5
        [Route("api/MealProperty/{MealPropertyId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int MealPropertyId)
        {
            try
            {
                mealPropertyService.MealPropertyDelete(MealPropertyId);
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
