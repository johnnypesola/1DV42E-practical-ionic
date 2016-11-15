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
    [Authorize]
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

        // GET: api/Resource/paginate/1/10
        [Route("api/Resource/paginate/{Index:int}/{PageSize:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int Index, int PageSize)
        {
            const string sortByColumn = "Name ASC";
            int count = 0;

            try
            {
                IEnumerable<Resource> resources = resourceService.GetPageWise(sortByColumn, PageSize, Index, out count);

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

        // GET: api/Resource/free/2015-01-01/2015-01-02
        // GET: api/Resource/free/2015-01-01/2015-01-02?fromTime=10.00&toTime=10.00
        [Route("api/Resource/free/{fromDate:datetime}/{toDate:datetime}/{resourceBookingExceptionId:int?}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(string fromDate, string toDate, string fromTime = "00:00:00", string toTime = "23:59:59", int resourceBookingExceptionId = 0)
        {
            DateTime startTime, endTime;

            try
            {
                startTime = Convert.ToDateTime(String.Format("{0} {1}", fromDate, fromTime));
                endTime = Convert.ToDateTime(String.Format("{0} {1}", toDate, toTime));

                IEnumerable<Resource> resources = resourceService.GetResourcesFreeForPeriod(startTime, endTime, resourceBookingExceptionId);
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
            ImageService imageService = new ImageService();
            Resource deletedResource;

            try
            {
                // Delete info from database
                deletedResource = resourceService.ResourceDelete(ResourceId);

                // Delete image
                imageService.DeleteImage(deletedResource.ImageSrc);
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

                // Remove old image, if one exists
                imageService.DeleteImage(resource.ImageSrc);

                // Save image
                UploadImagePath = imageService.SaveImage(IMAGE_PATH, base64string, ResourceId);

                // Attach path to object
                resource.ImageSrc = UploadImagePath;

                // Save location
                resourceService.SaveResource(resource);

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
