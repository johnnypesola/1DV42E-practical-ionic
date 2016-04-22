using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystem.Models;
using System.Web.Http.Cors;
using System.Data;

namespace BookingSystem.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class MealController : ApiController
    {
        // Set up Service.
        MealService mealService = new MealService();

        // GET: api/Meal
        [Route("api/Meal")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<Meal> meals = mealService.GetMeals();

                if (meals == null)
                {
                    return NotFound();
                }

                return Ok(meals);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/Meal/5
        [Route("api/Meal/{MealId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int MealId)
        {
            try
            {
                Meal meal = mealService.GetMeal(MealId);
                if (meal == null)
                {
                    return NotFound();
                }
                return Ok(meal);
            }
            catch
            {
                return InternalServerError();
            }

        }

        // POST: api/Meal
        [Route("api/Meal")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(Meal meal)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save meal
            try
            {
                mealService.SaveMeal(meal);
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
            return Ok(meal); //CreatedAtRoute("DefaultApi", new { id = meal.MealId }, meal);
        }

        // DELETE: api/Meal/5
        [Route("api/Meal/{MealId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int MealId)
        {
            try
            {
                mealService.MealDelete(MealId);
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
