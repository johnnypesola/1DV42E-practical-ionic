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
using System.Net.Http;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;

namespace BookingSystemAuth.Controllers
{
    [Authorize(Users = "administrator")]
    public class UserController : BaseAuthController
    {
        // Shared variables
        const string IMAGE_PATH = "Content/upload/img/user";

        // Set up Service.
        private UserStore userStore = new UserStore();
        private ApplicationUserManager _userManager;

        public UserController()
        {
        }

        public UserController(ApplicationUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }

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
            // Try to save User
            try
            {
                IdentityUser userFromDB = null;

                // Check for bad values, done by the data annotations in the model class.
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Update existing user
                if (User.Id > 0)
                {
                    userFromDB = userStore.FindByIdAsync(User.Id).Result;

                    if (userFromDB == null)
                    {
                        return NotFound();
                    }

                    // We should not overwrite the password in a normal update action, only if a new password is set.
                    if(User.PasswordHash == null || User.PasswordHash.Length <= 1)
                    {
                        User.PasswordHash = userFromDB.PasswordHash;
                    }
                    else
                    {
                        // Hash new password
                        User.PasswordHash = UserManager.PasswordHasher.HashPassword(User.PasswordHash);
                    }                    

                    userStore.UpdateAsync(User);
                }
                else
                {
                    IdentityResult result = UserManager.CreateAsync(User, User.PasswordHash).Result;

                    if (!result.Succeeded)
                    {
                        if (!result.Succeeded)
                        {
                            return GetErrorResult(result);
                        }
                    }

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

            // Respond that the user was created and redirect
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
                IdentityResult result = UserManager.AddPasswordAsync(userId, model.NewPassword).Result;
                    
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
            ImageService imageService = new ImageService();

            try
            {
                IdentityUser User = userStore.FindByIdAsync(UserId).Result;
                if (User == null)
                {
                    return NotFound();
                }

                // Delete info from database
                userStore.DeleteAsync(User);

                // Delete image
                imageService.DeleteImage(User.ImageSrc);
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