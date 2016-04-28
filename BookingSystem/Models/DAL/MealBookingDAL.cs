using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class MealBookingDAL : DALBase
    {
        public bool IsMealBooked(Booking booking)
        {
         
            
            //// Create connection object
            //using (this.CreateConnection())
            //{
            //    try
            //    {
            //        SqlCommand cmd;

            //        // Connect to database and execute given stored procedure
            //        cmd = this.Setup("appSchema.usp_MealBookedCheck", DALOptions.closedConnection);

            //        // Add parameters for Stored procedure
            //        if (booking.BookingId > 0)
            //        {
            //            cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = booking.BookingId;
            //        }
            //        cmd.Parameters.Add("@MealId", SqlDbType.Int).Value = booking.MealId;
            //        cmd.Parameters.Add("@StartDate", SqlDbType.VarChar, 10).Value = booking.StartDate;
            //        cmd.Parameters.Add("@StartTime", SqlDbType.VarChar, 5).Value = booking.StartTime;
            //        cmd.Parameters.Add("@EndDate", SqlDbType.VarChar, 10).Value = booking.EndDate;
            //        cmd.Parameters.Add("@EndTime", SqlDbType.VarChar, 5).Value = booking.EndTime;

            //        // Open DB connection
            //        connection.Open();

            //        // Get and evaluate response from stored procedure
            //        object returnValue = cmd.ExecuteScalar();

            //        if (returnValue.ToString() == "1")
            //        {
            //            return true;
            //        }

            //        return false;
            //    }
            //    catch
            //    {
            //        throw new ApplicationException(DAL_ERROR_MSG);
            //    }
            //}

            return false;
        }

        public void DeleteMealBooking(int mealBookingId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealBookingDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@MealBookingId", SqlDbType.Int).Value = mealBookingId;

                    // Try to delete meal from database.
                    cmd.ExecuteNonQuery();
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<MealBooking> GetMealBookingsForPeriod(DateTime startTime, DateTime endTime)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<MealBooking> mealBookingsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    mealBookingsReturnList = new List<MealBooking>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_MealBookingsForPeriod", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = startTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = endTime;

                    // Open DB connection
                    connection.Open();

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Booking object from database values and add to list
                            mealBookingsReturnList.Add(new MealBooking
                            {
                                MealBookingId = reader.GetSafeInt32(reader.GetOrdinal("MealBookingId")),
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                BookingName = reader.GetSafeString(reader.GetOrdinal("BookingName")),
                                Provisional = reader.GetSafeBoolean(reader.GetOrdinal("Provisional")),
                                MealId = reader.GetSafeInt16(reader.GetOrdinal("MealId")),
                                MealName = reader.GetSafeString(reader.GetOrdinal("MealName")),
                                MealImageSrc = reader.GetSafeString(reader.GetOrdinal("MealImageSrc")),
                                MealCount = reader.GetSafeInt16(reader.GetOrdinal("MealCount")),

                                StartTime = reader.GetSafeDateTime(reader.GetOrdinal("StartTime")),
                                EndTime = reader.GetSafeDateTime(reader.GetOrdinal("EndTime"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    mealBookingsReturnList.TrimExcess();

                    // Return list
                    return mealBookingsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertMealBooking(MealBooking mealBooking)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealBookingCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = mealBooking.BookingId;
                    cmd.Parameters.Add("@Provisional", SqlDbType.Bit).Value = mealBooking.Provisional;
                    cmd.Parameters.Add("@MealId", SqlDbType.Int).Value = mealBooking.MealId;
                    cmd.Parameters.Add("@MealCount", SqlDbType.Int).Value = mealBooking.MealCount;
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = mealBooking.LocationId;
                    cmd.Parameters.Add("@DeliveryAddress", SqlDbType.VarChar, 200).Value = mealBooking.DeliveryAddress;
                    cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = mealBooking.StartTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = mealBooking.EndTime;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into booking object.
                    mealBooking.BookingId = (int)cmd.Parameters["@InsertId"].Value;
                }
                catch (Exception exception)
                {
                    if (exception.Message == "The meal is already booked at the given time.")
                    {
                        throw new DoubleBookingException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateMealBooking(MealBooking mealBooking)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealBookingUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@MealBookingId", SqlDbType.Int).Value = mealBooking.MealBookingId;
                    cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = mealBooking.BookingId;
                    cmd.Parameters.Add("@Provisional", SqlDbType.Bit).Value = mealBooking.Provisional;
                    cmd.Parameters.Add("@MealId", SqlDbType.Int).Value = mealBooking.MealId;
                    cmd.Parameters.Add("@MealCount", SqlDbType.Int).Value = mealBooking.MealCount;
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = mealBooking.LocationId;
                    cmd.Parameters.Add("@DeliveryAddress", SqlDbType.VarChar, 200).Value = mealBooking.DeliveryAddress;
                    cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = mealBooking.StartTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = mealBooking.EndTime;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "The meal is already booked at the given time.")
                    {
                        throw new DoubleBookingException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<MealBooking> GetMealBookings(int? BookingId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<MealBooking> mealBookingsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    mealBookingsReturnList = new List<MealBooking>(50);


                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_MealBookingList");

                    // Get meals for BookingId if defined
                    if (BookingId != null)
                    {
                        // Add parameter for Stored procedure
                        cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = BookingId;
                    }

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Meal object from database values and add to list
                            mealBookingsReturnList.Add(new MealBooking
                            {
                                MealBookingId = reader.GetSafeInt32(reader.GetOrdinal("MealBookingId")),
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                Provisional = reader.GetSafeBoolean(reader.GetOrdinal("Provisional")),
                                MealId = reader.GetSafeInt16(reader.GetOrdinal("MealId")),
                                MealName = reader.GetSafeString(reader.GetOrdinal("MealName")),
                                MealImageSrc = reader.GetSafeString(reader.GetOrdinal("MealImageSrc")),
                                MealCount = reader.GetSafeInt16(reader.GetOrdinal("MealCount")),

                                StartTime = reader.GetSafeDateTime(reader.GetOrdinal("StartTime")),
                                EndTime = reader.GetSafeDateTime(reader.GetOrdinal("EndTime"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    mealBookingsReturnList.TrimExcess();

                    // Return list
                    return mealBookingsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public MealBooking GetMealBookingById(int mealBookingId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_MealBookingList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@MealBookingId", SqlDbType.Int).Value = mealBookingId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new Booking object from database values and return a reference
                            return new MealBooking
                            {
                                MealBookingId = reader.GetSafeInt32(reader.GetOrdinal("MealBookingId")),
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                Provisional = reader.GetSafeBoolean(reader.GetOrdinal("Provisional")),
                                MealId = reader.GetSafeInt16(reader.GetOrdinal("MealId")),
                                MealName = reader.GetSafeString(reader.GetOrdinal("MealName")),
                                MealImageSrc = reader.GetSafeString(reader.GetOrdinal("MealImageSrc")),
                                MealCount = reader.GetSafeInt16(reader.GetOrdinal("MealCount")),

                                StartTime = reader.GetSafeDateTime(reader.GetOrdinal("StartTime")),
                                EndTime = reader.GetSafeDateTime(reader.GetOrdinal("EndTime"))
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
    }
}