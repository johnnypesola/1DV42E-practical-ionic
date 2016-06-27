using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;

namespace BookingSystem.Models
{
    public class UserStore : IUserStore<IdentityUser, int> //, IUserRoleStore<IdentityUser, int>
    {
        // Properties
        public UserDAL UserDAL { get; private set; }

        // Constructors
        public UserStore()
        {
            new UserStore(new UserDAL());
        }

        public UserStore(UserDAL userDAL)
        {
            UserDAL = userDAL;
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

        public void Dispose() {

            if (UserDAL != null)
            {
                UserDAL.Dispose();
                UserDAL = null;
            }

        }
        
    }
}