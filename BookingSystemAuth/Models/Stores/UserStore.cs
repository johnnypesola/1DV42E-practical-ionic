using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace BookingSystemAuth.Models
{
    public class UserStore : IUserStore<IdentityUser, int> , IUserRoleStore<IdentityUser, int>, IUserPasswordStore<IdentityUser, int>, IUserEmailStore<IdentityUser, int>
    {
        // Fields
        private UserDAL _userDAL;

        // Properties
        private UserDAL UserDAL
        {
            get
            {
                return _userDAL ?? (_userDAL = new UserDAL());
            }
            set
            {
                _userDAL = value;
            }
        }

        // Constructors
        public UserStore()
        {
            // UserDAL userDAL = new UserDAL();
            // new UserStore(userDAL);
        }

        public UserStore(UserDAL userDAL)
        {
            // UserDAL = userDAL;
        }

        // Methods
        public Task CreateAsync(IdentityUser user)
        {
            if(user == null)
            {
                throw new ArgumentNullException();
            }

            UserDAL.InsertUser(user);

            return Task.FromResult<object>(null);
        }

        public Task DeleteAsync(IdentityUser user)
        {
            if(user != null)
            {
                UserDAL.DeleteUser(user.Id);
            }

            return Task.FromResult<object>(null);
        }

        public Task<IdentityUser> FindByIdAsync(int userId)
        {
            IdentityUser user;

            user = UserDAL.GetUserById(userId);

            if(user != null)
            {
                return Task.FromResult<IdentityUser>(user);
            }

            return Task.FromResult<IdentityUser>(null);
        }

        public Task<IdentityUser> FindByNameAsync(string userName)
        {
            IdentityUser user;

            if (string.IsNullOrEmpty(userName))
            {
                throw new ArgumentException();
            }

            user = UserDAL.GetUserByUserName(userName);

            if (user != null)
            {
                return Task.FromResult<IdentityUser>(user);
            }

            return Task.FromResult<IdentityUser>(null);
        }

        public Task UpdateAsync(IdentityUser user) {

            if (user == null)
            {
                throw new ArgumentNullException();
            }

            UserDAL.UpdateUser(user);

            return Task.FromResult<object>(null);
        }

        public Task AddToRoleAsync(IdentityUser user, string roleName)
        {
            UserDAL.InsertUserRole(user.Id, roleName);

            return Task.FromResult<object>(null);
        }

        public Task RemoveFromRoleAsync(IdentityUser user, string roleName)
        {
            if (user != null)
            {
                UserDAL.DeleteUserRole(user.Id, roleName);
            }

            return Task.FromResult<object>(null);
        }

        public Task<IList<string>> GetRolesAsync(IdentityUser user)
        {
            List<string> rolesList;

            if (user != null)
            {
                rolesList = UserDAL.GetUserRoles(user.Id).ToList();

                return Task.FromResult<IList<string>>(rolesList);
            }

            return Task.FromResult<IList<string>>(null);
        }

        public Task<bool> IsInRoleAsync(IdentityUser user, string roleName)
        {
            List<string> rolesList;
            bool hasRole = false;

            if (user != null)
            {
                rolesList = UserDAL.GetUserRoles(user.Id).ToList();

                foreach (string role in rolesList)
                {
                    if (role == roleName)
                    {
                        hasRole = true;
                        break;
                    }
                }
            }

            return Task.FromResult<bool>(hasRole);
        }

        public void Dispose() {

            if (UserDAL != null)
            {
                UserDAL.Dispose();
                UserDAL = null;
            }
        }

        public Task SetPasswordHashAsync(IdentityUser user, string passwordHash)
        {
            user.PasswordHash = passwordHash;

            return Task.FromResult<Object>(null);
        }

        public Task<string> GetPasswordHashAsync(IdentityUser user)
        {
            IdentityUser userFromDB = UserDAL.GetUserById(user.Id);

            return Task.FromResult<string>(userFromDB.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(IdentityUser user)
        {
            var hasPassword = !string.IsNullOrEmpty(UserDAL.GetUserById(user.Id).PasswordHash);

            return Task.FromResult<bool>(Boolean.Parse(hasPassword.ToString()));
        }

        public Task SetEmailAsync(IdentityUser user, string email)
        {
            user.EmailAddress = email;
            UserDAL.UpdateUser(user);

            return Task.FromResult(0);
        }

        public Task<string> GetEmailAsync(IdentityUser user)
        {
            return Task.FromResult(user.EmailAddress);
        }

        public Task<bool> GetEmailConfirmedAsync(IdentityUser user)
        {
            return Task.FromResult(false); // Not truly implemented
        }

        public Task SetEmailConfirmedAsync(IdentityUser user, bool confirmed)
        {
            user.EmailAddressConfirmed = confirmed;
            UserDAL.UpdateUser(user);

            return Task.FromResult(0);
        }

        public Task<IdentityUser> FindByEmailAsync(string email)
        {
            if (String.IsNullOrEmpty(email))
            {
                throw new ArgumentNullException();
            }

            IdentityUser result = UserDAL.GetUserByEmailAddress(email);
            if (result != null)
            {
                return Task.FromResult<IdentityUser>(result);
            }

            return Task.FromResult<IdentityUser>(null);
        }

        // Not part of identity below
        public Task<IList<IdentityUser>> GetUsers()
        {
            List<IdentityUser> usersList = UserDAL.GetUsers().ToList();

            return Task.FromResult<IList<IdentityUser>>(usersList);
        }
    }
}