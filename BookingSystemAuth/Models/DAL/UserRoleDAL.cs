using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class UserRoleDAL : DALBase
    {
        public void DeleteUserRole(int UserId, string RoleName = "")
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_UserRoleDelete");

                    // Add parameters for Stored procedure
                    cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = UserId;
                    cmd.Parameters.Add("@RoleName", SqlDbType.VarChar, 50).Value = RoleName;

                    // Try to delete UserRole from database.
                    cmd.ExecuteNonQuery();
                }
                catch (Exception)
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public string GetUserRoleById(int UserId, int? RoleId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_UserRoleList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = UserId;
                    if (RoleId != null)
                    {
                        cmd.Parameters.Add("@RoleId", SqlDbType.SmallInt).Value = RoleId;
                    }

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Return rolename string
                            return reader.GetSafeString(reader.GetOrdinal("RoleName"));
                        }
                    }

                    return null;
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            } // Connection is closed here
        }

        public IEnumerable<string> GetUserRoles(int? UserId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<string> UserRolesReturnList;
                    SqlCommand cmd;

                    // Create list object
                    UserRolesReturnList = new List<string>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_UserRoleList");

                    // Add parameter for Stored procedure
                    if (UserId != null)
                    {
                        cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = UserId;
                    }

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Add rolename to list
                            UserRolesReturnList.Add(
                                reader.GetSafeString(reader.GetOrdinal("RoleName"))
                            );
                        }
                    }

                    // Remove unused list rows, free memory.
                    UserRolesReturnList.TrimExcess();

                    // Return list
                    return UserRolesReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertUserRole(int UserId, string RoleName)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_UserRoleCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = UserId;
                    cmd.Parameters.Add("@RoleName", SqlDbType.VarChar, 50).Value = RoleName;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a user role with the given data.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }
    }
}