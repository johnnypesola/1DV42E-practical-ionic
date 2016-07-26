using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using BookingSystemAuth.Models;
using System;

namespace BookingSystemAuth
{
    // Configure the application user manager used in this application. UserManager is defined in ASP.NET Identity and is used by the application.

    public class ApplicationUserManager : UserManager<IdentityUser, int>
    {
        // Fields
        private UserStore _userStore;

        // Properties
        private UserStore UserStore
        {
            get
            {
                return _userStore ?? (_userStore = new UserStore());
            }
        }

        // Constructor
        public ApplicationUserManager(IUserStore<IdentityUser, int> store)
            : base(store)
        {
        }

        // Public methods
        public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
        {
            var userStore = new ApplicationUserManager(new UserStore());

            // Configure validation logic for usernames
            userStore.UserValidator = new UserValidator<IdentityUser, int>(userStore)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };
            // Configure validation logic for passwords
            userStore.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = false,
                RequireDigit = false,
                RequireLowercase = false,
                RequireUppercase = false,
            };

            // Configure user lockout
            userStore.UserLockoutEnabledByDefault = true;
            userStore.DefaultAccountLockoutTimeSpan = TimeSpan.FromHours(1);
            userStore.MaxFailedAccessAttemptsBeforeLockout = 10;

            var dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                userStore.UserTokenProvider = new DataProtectorTokenProvider<IdentityUser, int>(dataProtectionProvider.Create("ASP.NET Identity"));
            }

            return userStore;
        }
    }
}
