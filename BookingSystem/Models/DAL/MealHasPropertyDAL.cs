using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class MealHasPropertyDAL : DALBase
    {
        public void DeleteMealHasProperty(int MealId, int? MealPropertyId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealHasPropertyDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@MealId", SqlDbType.SmallInt).Value = MealId;
                    if (MealPropertyId != null)
                    {
                        cmd.Parameters.Add("@MealPropertyId", SqlDbType.SmallInt).Value = MealPropertyId;
                    }

                    // Try to delete MealHasProperty from database.
                    cmd.ExecuteNonQuery();
                }
                catch (Exception)
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public MealHasProperty GetMealHasPropertyById(int MealId, int? MealPropertyId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealHasPropertyList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@MealId", SqlDbType.SmallInt).Value = MealId;
                    if(MealPropertyId != null)
                    {
                        cmd.Parameters.Add("@MealPropertyId", SqlDbType.SmallInt).Value = MealPropertyId;
                    }

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new MealHasProperty object from database values and return a reference
                            return new MealHasProperty
                            {
                                MealId = reader.GetSafeInt16(reader.GetOrdinal("MealId")),
                                MealPropertyId = reader.GetSafeInt16(reader.GetOrdinal("MealPropertyId")),
                                MealName = reader.GetSafeString(reader.GetOrdinal("MealName")),
                                MealPropertyName = reader.GetSafeString(reader.GetOrdinal("MealPropertyName"))
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

        public IEnumerable<MealHasProperty> GetMealHasPropertys(int? MealId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<MealHasProperty> MealHasPropertysReturnList;
                    SqlCommand cmd;

                    // Create list object
                    MealHasPropertysReturnList = new List<MealHasProperty>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_MealHasPropertyList");

                    // Add parameter for Stored procedure
                    if (MealId != null)
                    {
                        cmd.Parameters.Add("@MealId", SqlDbType.SmallInt).Value = MealId;
                    }

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new MealHasProperty object from database values and add to list
                            MealHasPropertysReturnList.Add(new MealHasProperty
                            {
                                MealId = reader.GetSafeInt16(reader.GetOrdinal("MealId")),
                                MealPropertyId = reader.GetSafeInt16(reader.GetOrdinal("MealPropertyId")),
                                MealName = reader.GetSafeString(reader.GetOrdinal("MealName")),
                                MealPropertyName = reader.GetSafeString(reader.GetOrdinal("MealPropertyName"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    MealHasPropertysReturnList.TrimExcess();

                    // Return list
                    return MealHasPropertysReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertMealHasProperty(MealHasProperty MealHasProperty)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealHasPropertyCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@MealId", SqlDbType.SmallInt).Value = MealHasProperty.MealId;
                    cmd.Parameters.Add("@MealPropertyId", SqlDbType.SmallInt).Value = MealHasProperty.MealPropertyId;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "The meal already has that property.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateMealHasProperty(MealHasProperty MealHasProperty)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealHasPropertyUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@MealId", SqlDbType.SmallInt).Value = MealHasProperty.MealId;
                    cmd.Parameters.Add("@MealPropertyId", SqlDbType.SmallInt).Value = MealHasProperty.MealPropertyId;

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