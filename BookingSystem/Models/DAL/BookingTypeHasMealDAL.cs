using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class BookingTypeHasMealDAL : DALBase
    {
        public void DeleteBookingTypeHasMeal(int BookingTypeId, int? MealId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasMealDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = BookingTypeId;
                    if (MealId != null)
                    {
                        cmd.Parameters.Add("@MealId", SqlDbType.SmallInt).Value = MealId;
                    }

                    // Try to delete BookingTypeHasMeal from database.
                    cmd.ExecuteNonQuery();
                }
                catch (Exception)
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public BookingTypeHasMeal GetBookingTypeHasMealById(int BookingTypeId, int? MealId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasMealList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.Int).Value = BookingTypeId;
                    if(MealId != null)
                    {
                        cmd.Parameters.Add("@MealId", SqlDbType.SmallInt).Value = MealId;
                    }

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new BookingTypeHasMeal object from database values and return a reference
                            return new BookingTypeHasMeal
                            {
                                BookingTypeId = reader.GetSafeInt16(reader.GetOrdinal("BookingTypeId")),
                                MealId = reader.GetSafeInt16(reader.GetOrdinal("MealId")),
                                MealName = reader.GetSafeString(reader.GetOrdinal("MealName")),
                                BookingTypeName = reader.GetSafeString(reader.GetOrdinal("BookingTypeName"))
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

        public IEnumerable<BookingTypeHasMeal> GetBookingTypeHasMeals(int? BookingTypeId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<BookingTypeHasMeal> BookingTypeHasMealsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    BookingTypeHasMealsReturnList = new List<BookingTypeHasMeal>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_BookingTypeHasMealList");

                    // Add parameter for Stored procedure
                    if (BookingTypeId != null)
                    {
                        cmd.Parameters.Add("@BookingTypeId", SqlDbType.Int).Value = BookingTypeId;
                    }

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new BookingTypeHasMeal object from database values and add to list
                            BookingTypeHasMealsReturnList.Add(new BookingTypeHasMeal
                            {
                                BookingTypeId = reader.GetSafeInt16(reader.GetOrdinal("BookingTypeId")),
                                MealId = reader.GetSafeInt16(reader.GetOrdinal("MealId")),
                                MealName = reader.GetSafeString(reader.GetOrdinal("MealName")),
                                BookingTypeName = reader.GetSafeString(reader.GetOrdinal("BookingTypeName"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    BookingTypeHasMealsReturnList.TrimExcess();

                    // Return list
                    return BookingTypeHasMealsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertBookingTypeHasMeal(BookingTypeHasMeal BookingTypeHasMeal)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasMealCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.Int).Value = BookingTypeHasMeal.BookingTypeId;
                    cmd.Parameters.Add("@MealId", SqlDbType.SmallInt).Value = BookingTypeHasMeal.MealId;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "The booking type already has that meal.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateBookingTypeHasMeal(BookingTypeHasMeal BookingTypeHasMeal)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasMealUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.Int).Value = BookingTypeHasMeal.BookingTypeId;
                    cmd.Parameters.Add("@MealId", SqlDbType.SmallInt).Value = BookingTypeHasMeal.MealId;

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