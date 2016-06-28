using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity;

namespace BookingSystemAuth.Models
{
    public class RoleStore : IRoleStore<IdentityRole, int>
    {

        // Properties
        public RoleDAL RoleDAL { get; private set; }

        // Constructors
        public RoleStore()
        {
            new RoleStore(new RoleDAL());
        }

        public RoleStore(RoleDAL roleDAL)
        {
            RoleDAL = roleDAL;
        }

        // Methods
        public Task CreateAsync(IdentityRole role)
        {
            if (role == null)
            {
                throw new ArgumentNullException();
            }

            RoleDAL.InsertRole(role);

            return Task.FromResult<object>(null);
        }

        public Task DeleteAsync(IdentityRole role)
        {
            if (role != null)
            {
                RoleDAL.DeleteRole(role.Id);
            }

            return Task.FromResult<object>(null);
        }

        public Task<IdentityRole> FindByIdAsync(int roleId)
        {
            IdentityRole role;

            role = RoleDAL.GetRoleById(roleId);

            if (role != null)
            {
                return Task.FromResult<IdentityRole>(role);
            }

            return Task.FromResult<IdentityRole>(null);
        }

        public Task<IdentityRole> FindByNameAsync(string roleName)
        {
            IdentityRole role;

            if (string.IsNullOrEmpty(roleName))
            {
                throw new ArgumentException();
            }

            role = RoleDAL.GetRoleByName(roleName);

            if (role != null)
            {
                return Task.FromResult<IdentityRole>(role);
            }

            return Task.FromResult<IdentityRole>(null);
        }

        public Task UpdateAsync(IdentityRole role)
        {
            if(role == null)
            {
                throw new ArgumentNullException();
            }

            RoleDAL.UpdateRole(role);
            
            return Task.FromResult<object>(null);
        }

        public void Dispose()
        {

            if (RoleDAL != null)
            {
                RoleDAL.Dispose();
                RoleDAL = null;
            }

        }
    }
}