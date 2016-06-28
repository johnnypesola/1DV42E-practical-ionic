using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class LocationFurnituringDAL : DALBase
    {
        public void DeleteLocationFurnituring(int LocationId, int? FurnituringId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationFurnituringDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = LocationId;
                    if (FurnituringId != null)
                    {
                        cmd.Parameters.Add("@FurnituringId", SqlDbType.SmallInt).Value = FurnituringId;
                    }

                    // Try to delete LocationFurnituring from database.
                    cmd.ExecuteNonQuery();
                }
                catch (Exception)
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public LocationFurnituring GetLocationFurnituringById(int LocationId, int? FurnituringId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationFurnituringList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = LocationId;
                    if(FurnituringId != null)
                    {
                        cmd.Parameters.Add("@FurnituringId", SqlDbType.SmallInt).Value = FurnituringId;
                    }

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new LocationFurnituring object from database values and return a reference
                            return new LocationFurnituring
                            {
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                FurnituringId = reader.GetSafeInt16(reader.GetOrdinal("FurnituringId")),
                                MaxPeople = reader.GetSafeInt32(reader.GetOrdinal("MaxPeople")),
                                FurnituringName = reader.GetSafeString(reader.GetOrdinal("FurnituringName")),
                                LocationName = reader.GetSafeString(reader.GetOrdinal("LocationName"))
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

        public IEnumerable<LocationFurnituring> GetLocationFurniturings(int? LocationId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<LocationFurnituring> LocationFurnituringsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    LocationFurnituringsReturnList = new List<LocationFurnituring>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_LocationFurnituringList");

                    // Add parameter for Stored procedure
                    if (LocationId != null)
                    {
                        cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = LocationId;
                    }

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new LocationFurnituring object from database values and add to list
                            LocationFurnituringsReturnList.Add(new LocationFurnituring
                            {
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                FurnituringId = reader.GetSafeInt16(reader.GetOrdinal("FurnituringId")),
                                MaxPeople = reader.GetSafeInt32(reader.GetOrdinal("MaxPeople")),
                                FurnituringName = reader.GetSafeString(reader.GetOrdinal("FurnituringName")),
                                LocationName = reader.GetSafeString(reader.GetOrdinal("LocationName"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    LocationFurnituringsReturnList.TrimExcess();

                    // Return list
                    return LocationFurnituringsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertLocationFurnituring(LocationFurnituring LocationFurnituring)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationFurnituringCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = LocationFurnituring.LocationId;
                    cmd.Parameters.Add("@FurnituringId", SqlDbType.SmallInt).Value = LocationFurnituring.FurnituringId;
                    cmd.Parameters.Add("@MaxPeople", SqlDbType.Int).Value = LocationFurnituring.MaxPeople;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a location furnituring with the given data.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateLocationFurnituring(LocationFurnituring LocationFurnituring)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationFurnituringUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = LocationFurnituring.LocationId;
                    cmd.Parameters.Add("@FurnituringId", SqlDbType.SmallInt).Value = LocationFurnituring.FurnituringId;
                    cmd.Parameters.Add("@MaxPeople", SqlDbType.Int).Value = LocationFurnituring.MaxPeople;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception)
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }
    }
}