using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace BookingSystem.Models
{
    public class UserStore : IUserStore<IdentityUser, int> , IUserRoleStore<IdentityUser, int>
    {
        // Properties
        public UserDAL UserDAL { get; private set; }
        public UserRoleDAL UserRoleDAL { get; private set; }

        // Constructors
        public UserStore()
        {
            new UserStore(new UserDAL(), new UserRoleDAL());
        }

        public UserStore(UserDAL userDAL, UserRoleDAL userRoleDAL)
        {
            UserDAL = userDAL;
            UserRoleDAL = userRoleDAL;
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
            UserRoleDAL.InsertUserRole(user.Id, roleName);

            return Task.FromResult<object>(null);
        }

        public Task RemoveFromRoleAsync(IdentityUser user, string roleName)
        {
            if (user != null)
            {
                UserRoleDAL.DeleteUserRole(user.Id, roleName);
            }

            return Task.FromResult<object>(null);
        }

        public Task<IList<string>> GetRolesAsync(IdentityUser user)
        {
            List<string> rolesList;

            if (user != null)
            {
                rolesList = UserRoleDAL.GetUserRoles(user.Id).ToList();

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
                rolesList = UserRoleDAL.GetUserRoles(user.Id).ToList();

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
    }
}