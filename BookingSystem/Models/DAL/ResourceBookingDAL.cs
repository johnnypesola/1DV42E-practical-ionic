using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class ResourceBookingDAL : DALBase
    {
        public bool IsResourceBooked(Booking booking)
        {
            //// Create connection object
            //using (this.CreateConnection())
            //{
            //    try
            //    {
            //        SqlCommand cmd;

            //        // Connect to database and execute given stored procedure
            //        cmd = this.Setup("appSchema.usp_ResourceBookedCheck", DALOptions.closedConnection);

            //        // Add parameters for Stored procedure
            //        if (booking.BookingId > 0)
            //        {
            //            cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = booking.BookingId;
            //        }
            //        cmd.Parameters.Add("@ResourceId", SqlDbType.Int).Value = booking.ResourceId;
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

        public void DeleteResourceBooking(int resourceBookingId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_ResourceBookingDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@ResourceBookingId", SqlDbType.Int).Value = resourceBookingId;

                    // Try to delete resource from database.
                    cmd.ExecuteNonQuery();
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<ResourceBooking> GetResourceBookingsForPeriod(DateTime startTime, DateTime endTime)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<ResourceBooking> resourceBookingsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    resourceBookingsReturnList = new List<ResourceBooking>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_ResourceBookingsForPeriod", DALOptions.closedConnection);

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
                            resourceBookingsReturnList.Add(new ResourceBooking
                            {
                                ResourceBookingId = reader.GetSafeInt32(reader.GetOrdinal("ResourceBookingId")),
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                BookingName = reader.GetSafeString(reader.GetOrdinal("BookingName")),
                                Provisional = reader.GetBoolean(reader.GetOrdinal("Provisional")),
                                ResourceId = reader.GetSafeInt32(reader.GetOrdinal("ResourceId")),
                                ResourceName = reader.GetSafeString(reader.GetOrdinal("ResourceName")),
                                ResourceCount = reader.GetSafeInt16(reader.GetOrdinal("ResourceCount")),
                                ResourceImageSrc = reader.GetSafeString(reader.GetOrdinal("ResourceImageSrc")),

                                StartTime = reader.GetSafeDateTime(reader.GetOrdinal("StartTime")),
                                EndTime = reader.GetSafeDateTime(reader.GetOrdinal("EndTime")),

                                MinutesMarginBeforeBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginBeforeBooking")),
                                MinutesMarginAfterBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginAfterBooking")),

                                CalculatedBookingPrice = reader.GetSafeDecimal(reader.GetOrdinal("CalculatedBookingPrice")),
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    resourceBookingsReturnList.TrimExcess();

                    // Return list
                    return resourceBookingsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertResourceBooking(ResourceBooking resourceBooking)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_ResourceBookingCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = resourceBooking.BookingId;
                    cmd.Parameters.Add("@ResourceId", SqlDbType.Int).Value = resourceBooking.ResourceId;
                    cmd.Parameters.Add("@ResourceCount", SqlDbType.Int).Value = resourceBooking.ResourceCount;
                    cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = resourceBooking.StartTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = resourceBooking.EndTime;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into booking object.
                    resourceBooking.BookingId = (int)cmd.Parameters["@InsertId"].Value;
                }
                catch (Exception exception)
                {
                    if (exception.Message == "The resource is already booked at the given time.")
                    {
                        throw new DoubleBookingException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateResourceBooking(ResourceBooking resourceBooking)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_ResourceBookingUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@ResourceBookingId", SqlDbType.Int).Value = resourceBooking.ResourceBookingId;
                    cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = resourceBooking.BookingId;
                    cmd.Parameters.Add("@ResourceId", SqlDbType.Int).Value = resourceBooking.ResourceId;
                    cmd.Parameters.Add("@ResourceCount", SqlDbType.Int).Value = resourceBooking.ResourceCount;
                    cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = resourceBooking.StartTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = resourceBooking.EndTime;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "The resource is already booked at the given time.")
                    {
                        throw new DoubleBookingException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<ResourceBooking> GetResourceBookings(int? BookingId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<ResourceBooking> resourceBookingsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    resourceBookingsReturnList = new List<ResourceBooking>(50);


                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_ResourceBookingList");

                    // Get resources for BookingId if defined
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
                            // Create new Resource object from database values and add to list
                            resourceBookingsReturnList.Add(new ResourceBooking
                            {
                                ResourceBookingId = reader.GetSafeInt32(reader.GetOrdinal("ResourceBookingId")),
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                ResourceId = reader.GetSafeInt32(reader.GetOrdinal("ResourceId")),
                                ResourceName = reader.GetSafeString(reader.GetOrdinal("ResourceName")),
                                ResourceImageSrc = reader.GetSafeString(reader.GetOrdinal("ResourceImageSrc")),
                                ResourceCount = reader.GetSafeInt16(reader.GetOrdinal("ResourceCount")),
                                StartTime = reader.GetSafeDateTime(reader.GetOrdinal("StartTime")),
                                EndTime = reader.GetSafeDateTime(reader.GetOrdinal("EndTime")),
                                CalculatedBookingPrice = reader.GetSafeDecimal(reader.GetOrdinal("CalculatedBookingPrice")),
                                CustomerId = reader.GetSafeInt32(reader.GetOrdinal("CustomerId")),
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    resourceBookingsReturnList.TrimExcess();

                    // Return list
                    return resourceBookingsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public ResourceBooking GetResourceBookingById(int resourceBookingId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_ResourceBookingList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@ResourceBookingId", SqlDbType.Int).Value = resourceBookingId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new Booking object from database values and return a reference
                            return new ResourceBooking
                            {
                                ResourceBookingId = reader.GetSafeInt32(reader.GetOrdinal("ResourceBookingId")),
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                ResourceId = reader.GetSafeInt32(reader.GetOrdinal("ResourceId")),
                                ResourceName = reader.GetSafeString(reader.GetOrdinal("ResourceName")),
                                ResourceImageSrc = reader.GetSafeString(reader.GetOrdinal("ResourceImageSrc")),
                                ResourceCount = reader.GetSafeInt16(reader.GetOrdinal("ResourceCount")),
                                StartTime = reader.GetSafeDateTime(reader.GetOrdinal("StartTime")),
                                EndTime = reader.GetSafeDateTime(reader.GetOrdinal("EndTime")),
                                CalculatedBookingPrice = reader.GetSafeDecimal(reader.GetOrdinal("CalculatedBookingPrice")),
                                CustomerId = reader.GetSafeInt32(reader.GetOrdinal("CustomerId")),
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