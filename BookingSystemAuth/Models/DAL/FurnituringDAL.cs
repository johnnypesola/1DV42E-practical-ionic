using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class FurnituringDAL : DALBase
    {
        public void DeleteFurnituring(int FurnituringId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_FurnituringDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@FurnituringId", SqlDbType.Int).Value = FurnituringId;

                    // Try to delete Furnituring from database.
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

        public Furnituring GetFurnituringById(int FurnituringId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_FurnituringList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@FurnituringId", SqlDbType.Int).Value = FurnituringId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new Furnituring object from database values and return a reference
                            return new Furnituring
                            {
                                FurnituringId = reader.GetSafeInt16(reader.GetOrdinal("FurnituringId")),
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

        public IEnumerable<Furnituring> GetFurniturings()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Furnituring> FurnituringsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    FurnituringsReturnList = new List<Furnituring>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_FurnituringList");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Furnituring object from database values and add to list
                            FurnituringsReturnList.Add(new Furnituring
                            {
                                FurnituringId = reader.GetSafeInt16(reader.GetOrdinal("FurnituringId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    FurnituringsReturnList.TrimExcess();

                    // Return list
                    return FurnituringsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertFurnituring(Furnituring Furnituring)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_FurnituringCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = Furnituring.Name;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.SmallInt).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into Furnituring object.
                    Furnituring.FurnituringId = (Int16)cmd.Parameters["@InsertId"].Value;
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a furnituring with the given name.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateFurnituring(Furnituring Furnituring)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_FurnituringUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@FurnituringId", SqlDbType.SmallInt).Value = Furnituring.FurnituringId;
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = Furnituring.Name;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a furnituring with the given name.")
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