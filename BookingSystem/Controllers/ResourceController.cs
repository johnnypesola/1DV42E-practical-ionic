using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BookingSystem.Models;
using System.Web.Http.Cors;
using System.Data;
using System.Drawing;
using System.IO;
using System.Web;
using Newtonsoft.Json.Linq;

namespace BookingSystem.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ResourceController : ApiController
    {
        // Shared variables
        const string IMAGE_PATH = "Content/upload/img/resource";

        // Set up Service.
        ResourceService resourceService = new ResourceService();

        // GET: api/Resource
        [Route("api/Resource")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<Resource> resources = resourceService.GetResources();

                if (resources == null)
                {
                    return NotFound();
                }

                return Ok(resources);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/Resource/5
        [Route("api/Resource/{ResourceId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int ResourceId)
        {
            try
            {
                Resource resource = resourceService.GetResource(ResourceId);
                if (resource == null)
                {
                    return NotFound();
                }
                return Ok(resource);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/Resource
        [Route("api/Resource")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(Resource resource)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save resource
            try
            {
                resourceService.SaveResource(resource);
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
            return Ok(resource); //CreatedAtRoute("DefaultApi", new { id = resource.ResourceId }, resource);
        }

        // DELETE: api/Resource/5
        [Route("api/Resource/{ResourceId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int ResourceId)
        {
            string UploadImagePath, imageResource;

            try
            {
                // Delete info from database
                resourceService.ResourceDelete(ResourceId);

                // Get uploadpath
                UploadImagePath = HttpContext.Current.Server.MapPath(String.Format(@"~/{0}", IMAGE_PATH));

                // Build full image path
                imageResource = String.Format("{0}/{1}.jpg", UploadImagePath, ResourceId);

                // Remove uploaded file if it exists
                if (File.Exists(@imageResource))
                {
                    File.Delete(@imageResource);
                }
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

        // POST a picture for a resource
        [Route("api/Resource/image/{ResourceId:int}")]
        [AcceptVerbs("POST")]
        [HttpPost]
        public IHttpActionResult Post(int ResourceId)
        {
            string base64string;
            JObject returnData;
            ImageService imageService = new ImageService();
            string UploadImagePath;

            try
            {
                // Check that location with specific Id exists
                Resource resource = resourceService.GetResource(ResourceId);
                if (resource == null)
                {
                    return NotFound();
                }

                // Process image data
                base64string = Request.Content.ReadAsStringAsync().Result;

                // Save image
                UploadImagePath = imageService.SaveImage(IMAGE_PATH, base64string, ResourceId);

                // Attach path to object
                resource.ImageSrc = UploadImagePath;

                // Save location
                resourceService.SaveResource(resource);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }

            // Build return JSON object
            returnData = JObject.Parse(String.Format("{{ 'imgpath' : '{0}/{1}.jpg'}}", IMAGE_PATH, ResourceId));

            // Return path to uploaded image
            return Ok(returnData);
        }
    }
}
