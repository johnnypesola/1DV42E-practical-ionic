using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.SqlClient;

namespace BookingSystemAuth.Models
{
    public class UserDAL : DALBase
    {
        public void DeleteUser(int Id)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_UserDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = Id;

                    // Try to delete User from database.
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

        public IdentityUser GetUserById(int Id)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_UserList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@UserId", SqlDbType.Int).Value = Id;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new User object from database values and return a reference
                            return new IdentityUser
                            {
                                Id = reader.GetSafeInt32(reader.GetOrdinal("UserId")),
                                UserName = reader.GetSafeString(reader.GetOrdinal("UserName")),
                                FirstName = reader.GetSafeString(reader.GetOrdinal("FirstName")),
                                SurName = reader.GetSafeString(reader.GetOrdinal("SurName")),
                                EmailAddress = reader.GetSafeString(reader.GetOrdinal("EmailAddress")),
                                PasswordHash = reader.GetSafeString(reader.GetOrdinal("PasswordHash")),
                                CellPhoneNumber = reader.GetSafeString(reader.GetOrdinal("CellPhoneNumber")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                AccessFailedCount = reader.GetSafeInt32(reader.GetOrdinal("AccessFailedCount")),
                                IsLockedOut = reader.GetBoolean(reader.GetOrdinal("IsLockedOut"))
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

        public IdentityUser GetUserByUserName(string UserName)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_UserList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@UserName", SqlDbType.VarChar, 50).Value = UserName;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new User object from database values and return a reference
                            return new IdentityUser
                            {
                                Id = reader.GetSafeInt32(reader.GetOrdinal("UserId")),
                                UserName = reader.GetSafeString(reader.GetOrdinal("UserName")),
                                FirstName = reader.GetSafeString(reader.GetOrdinal("FirstName")),
                                SurName = reader.GetSafeString(reader.GetOrdinal("SurName")),
                                EmailAddress = reader.GetSafeString(reader.GetOrdinal("EmailAddress")),
                                PasswordHash = reader.GetSafeString(reader.GetOrdinal("PasswordHash")),
                                CellPhoneNumber = reader.GetSafeString(reader.GetOrdinal("CellPhoneNumber")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                AccessFailedCount = reader.GetSafeInt32(reader.GetOrdinal("AccessFailedCount")),
                                IsLockedOut = reader.GetBoolean(reader.GetOrdinal("IsLockedOut"))
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

        public IEnumerable<IdentityUser> GetUsers()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<IdentityUser> UsersReturnList;
                    SqlCommand cmd;

                    // Create list object
                    UsersReturnList = new List<IdentityUser>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_UserList");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new User object from database values and add to list
                            UsersReturnList.Add(new IdentityUser
                            {
                                Id = reader.GetSafeInt32(reader.GetOrdinal("UserId")),
                                UserName = reader.GetSafeString(reader.GetOrdinal("UserName")),
                                FirstName = reader.GetSafeString(reader.GetOrdinal("FirstName")),
                                SurName = reader.GetSafeString(reader.GetOrdinal("SurName")),
                                EmailAddress = reader.GetSafeString(reader.GetOrdinal("EmailAddress")),
                                PasswordHash = reader.GetSafeString(reader.GetOrdinal("PasswordHash")),
                                CellPhoneNumber = reader.GetSafeString(reader.GetOrdinal("CellPhoneNumber")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                AccessFailedCount = reader.GetSafeInt32(reader.GetOrdinal("AccessFailedCount")),
                                IsLockedOut = reader.GetBoolean(reader.GetOrdinal("IsLockedOut"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    UsersReturnList.TrimExcess();

                    // Return list
                    return UsersReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertUser(IdentityUser User)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_UserCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@FirstName", SqlDbType.VarChar, 50).Value = User.FirstName;
                    cmd.Parameters.Add("@SurName", SqlDbType.VarChar, 50).Value = User.SurName;
                    cmd.Parameters.Add("@UserName", SqlDbType.VarChar, 50).Value = User.UserName;
                    cmd.Parameters.Add("@EmailAddress", SqlDbType.VarChar, 50).Value = User.EmailAddress;
                    cmd.Parameters.Add("@PasswordHash", SqlDbType.VarChar, 256).Value = User.PasswordHash;
                    cmd.Parameters.Add("@CellPhoneNumber", SqlDbType.VarChar, 20).Value = User.CellPhoneNumber;
                    cmd.Parameters.Add("@ImageSrc", SqlDbType.VarChar, 50).Value = User.ImageSrc;
                    cmd.Parameters.Add("@AccessFailedCount", SqlDbType.Int).Value = User.AccessFailedCount;
                    cmd.Parameters.Add("@IsLockedOut", SqlDbType.Bit).Value = User.IsLockedOut;
                    
                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into User object.
                    User.Id = (Int16)cmd.Parameters["@InsertId"].Value;
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a user with the given name.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateUser(IdentityUser User)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_UserUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@UserId", SqlDbType.VarChar, 50).Value = User.Id;
                    cmd.Parameters.Add("@FirstName", SqlDbType.VarChar, 50).Value = User.FirstName;
                    cmd.Parameters.Add("@SurName", SqlDbType.VarChar, 50).Value = User.SurName;
                    cmd.Parameters.Add("@UserName", SqlDbType.VarChar, 50).Value = User.UserName;
                    cmd.Parameters.Add("@EmailAddress", SqlDbType.VarChar, 50).Value = User.EmailAddress;
                    cmd.Parameters.Add("@PasswordHash", SqlDbType.VarChar, 256).Value = User.PasswordHash;
                    cmd.Parameters.Add("@CellPhoneNumber", SqlDbType.VarChar, 20).Value = User.CellPhoneNumber;
                    cmd.Parameters.Add("@ImageSrc", SqlDbType.VarChar, 50).Value = User.ImageSrc;
                    cmd.Parameters.Add("@AccessFailedCount", SqlDbType.Int).Value = User.AccessFailedCount;
                    cmd.Parameters.Add("@IsLockedOut", SqlDbType.Bit).Value = User.IsLockedOut;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a user with the given name.")
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