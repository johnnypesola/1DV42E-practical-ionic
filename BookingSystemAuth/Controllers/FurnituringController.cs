using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystemAuth.Models;
using System.Web.Http.Cors;
using System.Data;
using Newtonsoft.Json.Linq;

namespace BookingSystemAuth.Controllers
{
//    [Authorize]
    public class FurnituringController : ApiController
    {
        // Shared variables
        const string IMAGE_PATH = "Content/upload/img/furnituring";

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

        // GET: api/Furnituring/paginate/1/10
        [Route("api/Furnituring/paginate/{Index:int}/{PageSize:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int Index, int PageSize)
        {
            const string sortByColumn = "Name ASC";
            int count = 0;

            try
            {
                IEnumerable<Furnituring> furniturings = furnituringService.GetPageWise(sortByColumn, PageSize, Index, out count);

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
            ImageService imageService = new ImageService();
            Furnituring deletedFurnituring;

            try
            {
                // Delete info from database
                deletedFurnituring = furnituringService.FurnituringDelete(FurnituringId);

                // Delete image
                imageService.DeleteImage(deletedFurnituring.ImageSrc);
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

        // POST a picture for a furnituring
        [Route("api/Furnituring/image/{FurnituringId:int}")]
        [AcceptVerbs("POST")]
        [HttpPost]
        public IHttpActionResult Post(int FurnituringId)
        {
            string base64string;
            JObject returnData;
            ImageService imageService = new ImageService();
            string UploadImagePath;

            try
            {
                // Check that location with specific Id exists
                Furnituring furnituring = furnituringService.GetFurnituring(FurnituringId);
                if (furnituring == null)
                {
                    return NotFound();
                }

                // Process image data
                base64string = Request.Content.ReadAsStringAsync().Result;

                // Save image
                UploadImagePath = imageService.SaveImage(IMAGE_PATH, base64string, FurnituringId);

                // Attach path to object
                furnituring.ImageSrc = UploadImagePath;

                // Save location
                furnituringService.SaveFurnituring(furnituring);

                // Build return JSON object
                returnData = JObject.Parse(String.Format("{{ 'imgpath' : '{0}'}}", UploadImagePath));

                // Return path to uploaded image
                return Ok(returnData);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
