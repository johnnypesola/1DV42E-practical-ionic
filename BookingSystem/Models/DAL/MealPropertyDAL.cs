using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class MealPropertyDAL : DALBase
    {
        public void DeleteMealProperty(int MealPropertyId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealPropertyDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@MealPropertyId", SqlDbType.Int).Value = MealPropertyId;

                    // Try to delete MealProperty from database.
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

        public MealProperty GetMealPropertyById(int MealPropertyId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealPropertyList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@MealPropertyId", SqlDbType.Int).Value = MealPropertyId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new MealProperty object from database values and return a reference
                            return new MealProperty
                            {
                                MealPropertyId = reader.GetSafeInt16(reader.GetOrdinal("MealPropertyId")),
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

        public IEnumerable<MealProperty> GetMealProperties()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<MealProperty> MealPropertiesReturnList;
                    SqlCommand cmd;

                    // Create list object
                    MealPropertiesReturnList = new List<MealProperty>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_MealPropertyList");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new MealProperty object from database values and add to list
                            MealPropertiesReturnList.Add(new MealProperty
                            {
                                MealPropertyId = reader.GetSafeInt16(reader.GetOrdinal("MealPropertyId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    MealPropertiesReturnList.TrimExcess();

                    // Return list
                    return MealPropertiesReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertMealProperty(MealProperty MealProperty)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealPropertyCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = MealProperty.Name;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.SmallInt).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into MealProperty object.
                    MealProperty.MealPropertyId = (Int16)cmd.Parameters["@InsertId"].Value;
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a meal property with the given name.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateMealProperty(MealProperty MealProperty)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealPropertyUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@MealPropertyId", SqlDbType.SmallInt).Value = MealProperty.MealPropertyId;
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = MealProperty.Name;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a meal with the given name.")
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