using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace BookingSystem.Models
{
    public class RoleDAL : DALBase
    {
        public void DeleteRole(int Id)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_RoleDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = Id;

                    // Try to delete Role from database.
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "Foreign key references exists")
                    {
                        throw new ApprovedException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IdentityRole GetRoleById(int Id)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_RoleList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@RoleId", SqlDbType.Int).Value = Id;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new Role object from database values and return a reference
                            return new IdentityRole
                            {
                                Id = reader.GetSafeInt32(reader.GetOrdinal("RoleId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name"))
                            };
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

        public IdentityRole GetRoleByName(string Name)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_RoleList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = Name;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new Role object from database values and return a reference
                            return new IdentityRole
                            {
                                Id = reader.GetSafeInt32(reader.GetOrdinal("RoleId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name"))
                            };
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

        public IEnumerable<IdentityRole> GetRoles()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<IdentityRole> RolesReturnList;
                    SqlCommand cmd;

                    // Create list object
                    RolesReturnList = new List<IdentityRole>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_RoleList");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Role object from database values and add to list
                            RolesReturnList.Add(new IdentityRole
                            {
                                Id = reader.GetSafeInt32(reader.GetOrdinal("RoleId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    RolesReturnList.TrimExcess();

                    // Return list
                    return RolesReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertRole(IdentityRole Role)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_RoleCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = Role.Name;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.SmallInt).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into Role object.
                    Role.Id = (Int16)cmd.Parameters["@InsertId"].Value;
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a role with the given name.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateRole(IdentityRole Role)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_RoleUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@RoleId", SqlDbType.VarChar, 50).Value = Role.Id;
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = Role.Name;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a role with the given name.")
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