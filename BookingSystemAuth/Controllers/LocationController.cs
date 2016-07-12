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
    public class LocationController : ApiController
    {
        // Shared variables
        const string IMAGE_PATH = "Content/upload/img/location";

        // Set up Service.
        LocationService locationService = new LocationService();

        // GET: api/Location
        [Route("api/Location")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<Location> locations = locationService.GetLocations();

                if (locations == null)
                {
                    return NotFound();
                }

                return Ok(locations);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/Location/5
        [Route("api/Location/{LocationId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int LocationId)
        {
            try
            {
                Location location = locationService.GetLocation(LocationId);
                if (location == null)
                {
                    return NotFound();
                }
                return Ok(location);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/Location/free/2015-01-01/2015-01-02
        // GET: api/Location/free/2015-01-01/2015-01-02?fromTime=10.00&toTime=10.00
        [Route("api/Location/free/{fromDate:datetime}/{toDate:datetime}/{locationBookingExceptionId:int?}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(string fromDate, string toDate, string fromTime = "00:00:00", string toTime = "23:59:59", int locationBookingExceptionId = 0)
        {
            DateTime startTime, endTime;

            try
            {
                startTime = Convert.ToDateTime(String.Format("{0} {1}", fromDate, fromTime));
                endTime = Convert.ToDateTime(String.Format("{0} {1}", toDate, toTime));

                IEnumerable<Location> locations = locationService.GetLocationsFreeForPeriod(startTime, endTime, locationBookingExceptionId);
                if (locations == null)
                {
                    return NotFound();
                }
                return Ok(locations);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/Location/search/ColumnName?value=hello
        [Route("api/Location/search/{columnName}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(string columnName, string value)
        {
            SearchContainer searchContainer;
            try
            {

                // Construct a search container object
                searchContainer = new SearchContainer { ColumnName = columnName, SearchValue = value };

                // Get locations
                IEnumerable<Location> locations = locationService.SearchFor(searchContainer);

                if (locations == null)
                {
                    return NotFound();
                }

                return Ok(locations);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/Location
        [Route("api/Location")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(Location location)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save location
            try
            {
                locationService.SaveLocation(location);
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
            return Ok(location);
        }

        // DELETE: api/Location/5
        [Route("api/Location/{LocationId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int LocationId)
        {
            string imageFile;
            Location deletedLocation;

            try
            {
                // Delete info from database
                deletedLocation = locationService.LocationDelete(LocationId);

                // Get image path
                imageFile = HttpContext.Current.Server.MapPath(String.Format(@"~/{0}", deletedLocation.ImageSrc));

                // Remove uploaded file if it exists
                if(File.Exists(@imageFile))
                {
                    File.Delete(@imageFile);
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

        // POST a picture for a location
        [Route("api/Location/image/{LocationId:int}")]
        [AcceptVerbs("POST")]
        [HttpPost]
        public IHttpActionResult Post(int LocationId)
        {
            string base64string;
            JObject returnData;
            ImageService imageService = new ImageService();
            string UploadImagePath;

            try
            {
                // Check that location with specific Id exists
                Location location = locationService.GetLocation(LocationId);
                if (location == null)
                {
                    return NotFound();
                }

                // Process image data
                base64string = Request.Content.ReadAsStringAsync().Result;

                // Save image
                UploadImagePath = imageService.SaveImage(IMAGE_PATH, base64string, LocationId);

                // Attach path to object
                location.ImageSrc = UploadImagePath;

                // Save location
                locationService.SaveLocation(location);

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
