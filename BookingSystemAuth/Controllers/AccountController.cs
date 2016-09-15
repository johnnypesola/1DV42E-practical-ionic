using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using BookingSystemAuth.Models;
using BookingSystemAuth.Providers;
using BookingSystemAuth.Results;
using Newtonsoft.Json.Linq;
using System.Data;

namespace BookingSystemAuth.Controllers
{
    [Authorize]
    [RoutePrefix("api/Account")]
    
    public class AccountController : BaseAuthController
    {
        // Set up Service.
        private UserStore userStore = new UserStore();

        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager,
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


        // POST api/Account/Logout
        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }

        // GET: api/Account/GetInfo
        [Route("GetInfo")]
        public IHttpActionResult Get()
        {
            int loggedInUserId;

            // Get logged in id
            Int32.TryParse(User.Identity.GetUserId(), out loggedInUserId);

            try
            {
                IdentityUser User = userStore.FindByIdAsync(loggedInUserId).Result;
                if (User == null)
                {
                    return NotFound();
                }

                // Hide Password hash
                User.PasswordHash = String.Empty;

                return Ok(User);
            }
            catch
            {
                return InternalServerError();
            }
        }

        // POST api/Account/ChangeInfo
        [Route("ChangeInfo")]
        public IHttpActionResult Post(IdentityUser PostedUser)
        {
            IdentityUser userFromDB = null;
            int loggedInUserId;
            string newPassword;

            // Get logged in id
            Int32.TryParse(User.Identity.GetUserId(), out loggedInUserId);

            try
            {
                // Force logged in Is
                PostedUser.Id = loggedInUserId;

                // Check for bad values, done by the data annotations in the model class.
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Try to find user in DB.
                userFromDB = userStore.FindByIdAsync(loggedInUserId).Result;

                if (userFromDB == null)
                {
                    return NotFound();
                }

                // Check that the user entered the correct current password
                if(!UserManager.CheckPassword(userFromDB, PostedUser.CurrentPasswordHash))
                {
                    return BadRequest();
                }

                // We should not overwrite the password in a normal update action, only if a new password is set.
                if (PostedUser.PasswordHash == null || PostedUser.PasswordHash.Length <= 1)
                {
                    PostedUser.PasswordHash = userFromDB.PasswordHash;
                }
                else
                {
                    // Hash new password
                    newPassword = UserManager.PasswordHasher.HashPassword(PostedUser.PasswordHash);

                    PostedUser.PasswordHash = newPassword;
                }

                userStore.UpdateAsync(PostedUser);
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
            return Ok(PostedUser);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

        // POST a picture for logged in user
        [Route("Image")]
        [AcceptVerbs("POST")]
        [HttpPost]
        public IHttpActionResult Post()
        {
            string base64string;
            JObject returnData;
            ImageService imageService = new ImageService();
            UserStore userStore = new UserStore();
            string UploadImagePath;
            const string IMAGE_PATH = "Content/upload/img/user";

            try
            {
                // Process image data
                base64string = Request.Content.ReadAsStringAsync().Result;

                // Get userId of logged in user
                int userId = int.Parse(User.Identity.GetUserId());

                // Get user from DB
                IdentityUser user = userStore.FindByIdAsync(userId).Result;

                // Remove old image, if one exists
                imageService.DeleteImage(user.ImageSrc);

                // Save image
                UploadImagePath = imageService.SaveImage(IMAGE_PATH, base64string, userId);

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
