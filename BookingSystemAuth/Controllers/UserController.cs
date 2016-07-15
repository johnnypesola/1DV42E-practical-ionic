using BookingSystemAuth.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Data;
using System.IO;
using Microsoft.AspNet.Identity;

namespace BookingSystemAuth.Controllers
{
    [Authorize(Users = "administrator")]
    public class UserController : ApiController
    {
        // Shared variables
        const string IMAGE_PATH = "Content/upload/img/user";

        // Set up Service.
        UserStore userStore = new UserStore();
        ApplicationUserManager userManager = new ApplicationUserManager(new UserStore());

        // GET: api/User
        [Route("api/User")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get()
        {
            try
            {
                IEnumerable<IdentityUser> Users = userStore.GetUsers().Result;

                if (Users == null)
                {
                    return NotFound();
                }

                return Ok(Users);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // GET: api/User/5
        [Route("api/User/{UserId:int}")]
        [AcceptVerbs("GET")]
        public IHttpActionResult Get(int UserId)
        {
            try
            {
                IdentityUser User = userStore.FindByIdAsync(UserId).Result;
                if (User == null)
                {
                    return NotFound();
                }
                return Ok(User);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST: api/User
        [Route("api/User")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(IdentityUser User)
        {
            IdentityUser userFromDB = null;

            if (User.Id > 0)
            {
                userFromDB = userStore.FindByIdAsync(User.Id).Result;
            }

            if (userFromDB == null)
            {
                return NotFound();
            }

            // We should not overwrite the password in a normal update action.
            User.PasswordHash = userFromDB.PasswordHash;

            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save User
            try
            {
                userStore.UpdateAsync(User);
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
            return Ok(User);
        }

        // POST a new password for a user
        // api/User/passord/5
        [Route("api/User/password/{UserId:int}")]
        [AcceptVerbs("POST")]
        public IHttpActionResult Post(SetPasswordBindingModel model, int userId)
        {
            // Check for bad values, done by the data annotations in the model class.
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Try to save User
            try
            {
                // Get user
                IdentityUser userFromDB = userStore.FindByIdAsync(userId).Result;

                if (userFromDB == null)
                {
                    return NotFound();
                }

                // Save password
                IdentityResult result = userManager.AddPasswordAsync(userId, model.NewPassword).Result;
                    
                if (!result.Succeeded)
                {
                    return InternalServerError();
                }
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
            return Ok(User);
        }

        // DELETE: api/User/5
        [Route("api/User/{UserId:int}")]
        [AcceptVerbs("DELETE")]
        public IHttpActionResult Delete(int UserId)
        {
            string imageUser;

            try
            {
                IdentityUser User = userStore.FindByIdAsync(UserId).Result;
                if (User == null)
                {
                    return NotFound();
                }

                // Delete info from database
                userStore.DeleteAsync(User);

                // Get image path
                imageUser = HttpContext.Current.Server.MapPath(String.Format(@"~/{0}", User.ImageSrc));

                // Remove uploaded file if it exists
                if (File.Exists(@imageUser))
                {
                    File.Delete(@imageUser);
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

        // POST a picture for a user
        [Route("api/User/image/{UserId:int}")]
        [AcceptVerbs("POST")]
        [HttpPost]
        public IHttpActionResult Post(int UserId)
        {
            string base64string;
            JObject returnData;
            ImageService imageService = new ImageService();
            string UploadImagePath;

            try
            {
                // Check that user with specific Id exists
                IdentityUser user = userStore.FindByIdAsync(UserId).Result;
                if (user == null)
                {
                    return NotFound();
                }

                // Process image data
                base64string = Request.Content.ReadAsStringAsync().Result;

                // Save image
                UploadImagePath = imageService.SaveImage(IMAGE_PATH, base64string, UserId);

                // Attach path to object
                user.ImageSrc = UploadImagePath;

                // Save user
                userStore.UpdateAsync(user);

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