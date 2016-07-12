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
using System.Web;
using System.IO;

namespace BookingSystemAuth.Controllers
{
    //[EnableCors(origins: "*", headers: "*", methods: "*")]
    public class CustomerController : ApiController
    {
        // Shared variables
        const string IMAGE_PATH = "Content/upload/img/customer";

        // Set up Service.
        CustomerService customerService = new CustomerService();

        // GET: api/Customer
        [Route("api/Customer")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<Customer> customers = customerService.GetCustomers();

                if (customers == null)
                {
                    return NotFound();
                }

                return Ok(customers);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/Customer/5
        [Route("api/Customer/{CustomerId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int CustomerId)
        {
            try
            {
                Customer customer = customerService.GetCustomer(CustomerId);
                if (customer == null)
                {
                    return NotFound();
                }
                return Ok(customer);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/Customer/search/ColumnName?value=hello
        [Route("api/Customer/search/{columnName}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(string columnName, string value)
        {
            SearchContainer searchContainer;
            try
            {

                // Construct a search container object
                searchContainer = new SearchContainer { ColumnName = columnName, SearchValue = value };

                // Get customers
                IEnumerable<Customer> customers = customerService.SearchFor(searchContainer);

                if (customers == null)
                {
                    return NotFound();
                }

                return Ok(customers);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/Customer
        [Route("api/Customer")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(Customer customer)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save customer
            try
            {
                customerService.SaveCustomer(customer);
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
            return Ok(customer); //CreatedAtRoute("DefaultApi", new { id = customer.CustomerId }, customer);
        }

        // DELETE: api/Customer/5
        [Route("api/Customer/{CustomerId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int CustomerId)
        {
            string imageFile;
            Customer deletedCustomer;

            try
            {
                // Delete info from database
                deletedCustomer = customerService.DeleteCustomer(CustomerId);

                // Get image path
                imageFile = HttpContext.Current.Server.MapPath(String.Format(@"~/{0}", deletedCustomer.ImageSrc));

                // Remove uploaded file if it exists
                if (File.Exists(imageFile))
                {
                    File.Delete(imageFile);
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


        // POST a picture for a customer
        [Route("api/Customer/image/{CustomerId:int}")]
        [AcceptVerbs("POST")]
        [HttpPost]
        public IHttpActionResult Post(int CustomerId)
        {
            string base64string;
            JObject returnData;
            ImageService imageService = new ImageService();
            string UploadImagePath;

            try
            {
                // Check that location with specific Id exists
                Customer customer = customerService.GetCustomer(CustomerId);
                if (customer == null)
                {
                    return NotFound();
                }

                // Process image data
                base64string = Request.Content.ReadAsStringAsync().Result;

                // Save image
                UploadImagePath = imageService.SaveImage(IMAGE_PATH, base64string, CustomerId);

                // Attach path to object
                customer.ImageSrc = UploadImagePath;

                // Save location
                customerService.SaveCustomer(customer);

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
