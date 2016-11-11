using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class MealDAL : DALBase
    {
        public void DeleteMeal(int MealId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@MealId", SqlDbType.Int).Value = MealId;

                    // Try to delete Meal from database.
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

        public Meal GetMealById(int MealId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@MealId", SqlDbType.Int).Value = MealId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new Meal object from database values and return a reference
                            return new Meal
                            {
                                MealId = reader.GetSafeInt16(reader.GetOrdinal("MealId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc"))
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

        public IEnumerable<Meal> GetMeals()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Meal> MealsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    MealsReturnList = new List<Meal>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_MealList");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Meal object from database values and add to list
                            MealsReturnList.Add(new Meal
                            {
                                MealId = reader.GetSafeInt16(reader.GetOrdinal("MealId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    MealsReturnList.TrimExcess();

                    // Return list
                    return MealsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<Meal> GetMealsPageWise(string sortColumn, int pageSize, int pageIndex, out int totalRowCount)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Meal> mealsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    mealsReturnList = new List<Meal>(pageSize);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_MealList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@SortOrder", SqlDbType.VarChar, 25).Value = sortColumn;
                    cmd.Parameters.Add("@PageIndex", SqlDbType.Int).Value = pageIndex;
                    cmd.Parameters.Add("@PageSize", SqlDbType.Int).Value = pageSize;
                    cmd.Parameters.Add("@TotalRowCount", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Meal object from database values and add to list
                            mealsReturnList.Add(new Meal
                            {
                                MealId = reader.GetSafeInt16(reader.GetOrdinal("MealId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc"))
                            });
                        }
                    }

                    // Get total row count
                    totalRowCount = Convert.ToInt32(cmd.Parameters["@TotalRowCount"].Value);

                    // Remove unused list rows, free memory.
                    mealsReturnList.TrimExcess();

                    // Return list
                    return mealsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertMeal(Meal Meal)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = Meal.Name;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.SmallInt).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into Meal object.
                    Meal.MealId = (Int16)cmd.Parameters["@InsertId"].Value;
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

        public void UpdateMeal(Meal Meal)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@MealId", SqlDbType.SmallInt).Value = Meal.MealId;
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = Meal.Name;
                    cmd.Parameters.Add("@ImageSrc", SqlDbType.VarChar, 50).Value = Meal.ImageSrc;

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