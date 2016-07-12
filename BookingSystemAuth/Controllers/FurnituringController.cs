using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystemAuth.Models;
using System.Web.Http.Cors;
using System.Data;

namespace BookingSystemAuth.Controllers
{
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class FurnituringController : ApiController
    {
        // Set up Service.
        FurnituringService furnituringService = new FurnituringService();  

        // GET: api/Furnituring
        [Route("api/Furnituring")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<Furnituring> furniturings = furnituringService.GetFurniturings();

                if (furniturings == null)
                {
                    return NotFound();
                }

                return Ok(furniturings);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/Furnituring/5
        [Route("api/Furnituring/{FurnituringId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int FurnituringId)
        {
            try
            {
                Furnituring furnituring = furnituringService.GetFurnituring(FurnituringId);
                if (furnituring == null)
                {
                    return NotFound();
                }
                return Ok(furnituring);
            }
            catch
            {
                return InternalServerError();
            }
            
        }

        // POST: api/Furnituring
        [Route("api/Furnituring")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(Furnituring furnituring)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save furnituring
            try
            {
                furnituringService.SaveFurnituring(furnituring);
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
            return Ok(furnituring); //CreatedAtRoute("DefaultApi", new { id = furnituring.FurnituringId }, furnituring);
        }

        // DELETE: api/Furnituring/5
        [Route("api/Furnituring/{FurnituringId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int FurnituringId)
        {
            try
            {
                furnituringService.FurnituringDelete(FurnituringId);
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
