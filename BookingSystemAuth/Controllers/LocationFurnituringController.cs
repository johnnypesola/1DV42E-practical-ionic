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
    public class LocationFurnituringController : ApiController
    {
        // Set up Service.
        LocationFurnituringService locationFurnituringService = new LocationFurnituringService();

        // GET: api/LocationFurnituring
        [Route("api/LocationFurnituring")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<LocationFurnituring> locationFurniturings = locationFurnituringService.GetLocationFurniturings();

                if (locationFurniturings == null)
                {
                    return NotFound();
                }

                return Ok(locationFurniturings);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/LocationFurnituring/5
        [Route("api/LocationFurnituring/{LocationId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int LocationId)
        {
            try
            {
                LocationFurnituring locationFurnituring = locationFurnituringService.GetLocationFurnituring(LocationId);
                if (locationFurnituring == null)
                {
                    return NotFound();
                }
                return Ok(locationFurnituring);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/LocationFurnituring
        [Route("api/LocationFurnituring")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(LocationFurnituring locationFurnituring)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save locationFurnituring
            try
            {
                locationFurnituringService.SaveLocationFurnituring(locationFurnituring);
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
            return Ok(locationFurnituring); //CreatedAtRoute("DefaultApi", new { id = locationFurnituring.LocationFurnituringId }, locationFurnituring);
        }

        // POST: api/LocationFurnituring/location
        [Route("api/LocationFurnituring/location")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(LocationFurnituring[] locationFurniturings)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save locationFurnituring
            try
            {
                locationFurnituringService.SaveLocationFurniturings(locationFurniturings);
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
            return Ok(locationFurniturings); //CreatedAtRoute("DefaultApi", new { id = locationFurnituring.LocationFurnituringId }, locationFurnituring);
        }

        // DELETE: api/LocationFurnituring/5/5
        [Route("api/LocationFurnituring/{LocationId:int}/{FurnituringId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int LocationId, int FurnituringId)
        {
            try
            {
                // Delete info from database
                locationFurnituringService.LocationFurnituringDelete(LocationId, FurnituringId);
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

        // DELETE: api/LocationFurnituring/5
        [Route("api/LocationFurnituring/{LocationId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int LocationId)
        {
            try
            {
                // Delete info from database
                locationFurnituringService.LocationFurnituringDelete(LocationId);
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
        [Route("api/LocationFurnituring/location/{LocationId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult GetForLocation(int LocationId)
        {
            try
            {
                IEnumerable<LocationFurnituring> locationFurniturings = locationFurnituringService.GetLocationFurniturings(LocationId);

                if (locationFurniturings == null)
                {
                    return NotFound();
                }
                return Ok(locationFurniturings);
            }
            catch
            {
                return InternalServerError();
            }

        }
    }
}
