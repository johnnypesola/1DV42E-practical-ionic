using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class LocationBookingDAL : DALBase
    {
        public bool IsLocationBooked(Booking booking)
        {
         
            
            //// Create connection object
            //using (this.CreateConnection())
            //{
            //    try
            //    {
            //        SqlCommand cmd;

            //        // Connect to database and execute given stored procedure
            //        cmd = this.Setup("appSchema.usp_LocationBookedCheck", DALOptions.closedConnection);

            //        // Add parameters for Stored procedure
            //        if (booking.BookingId > 0)
            //        {
            //            cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = booking.BookingId;
            //        }
            //        cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = booking.LocationId;
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

        public void DeleteLocationBooking(int locationBookingId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationBookingDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@LocationBookingId", SqlDbType.Int).Value = locationBookingId;

                    // Try to delete location from database.
                    cmd.ExecuteNonQuery();
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<LocationBooking> GetLocationBookingsForPeriod(DateTime startTime, DateTime endTime)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<LocationBooking> locationBookingsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    locationBookingsReturnList = new List<LocationBooking>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_LocationBookingsForPeriod", DALOptions.closedConnection);

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
                            locationBookingsReturnList.Add(new LocationBooking
                            {
                                LocationBookingId = reader.GetSafeInt32(reader.GetOrdinal("LocationBookingId")),
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                BookingName = reader.GetSafeString(reader.GetOrdinal("BookingName")),
                                Provisional = reader.GetBoolean(reader.GetOrdinal("Provisional")),
                                LocationName = reader.GetSafeString(reader.GetOrdinal("LocationName")),
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                LocationImageSrc = reader.GetSafeString(reader.GetOrdinal("LocationImageSrc")),
                                NumberOfPeople = reader.GetSafeInt16(reader.GetOrdinal("NumberOfPeople")),
                                MaxPeople = reader.GetSafeInt32(reader.GetOrdinal("MaxPeople")),
                                FurnituringId = reader.GetSafeInt16(reader.GetOrdinal("FurnituringId")),
                                FurnituringName = reader.GetSafeString(reader.GetOrdinal("FurnituringName")),
                                StartTime = reader.GetSafeDateTime(reader.GetOrdinal("StartTime")),
                                EndTime = reader.GetSafeDateTime(reader.GetOrdinal("EndTime")),
                                MinutesMarginAfterBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginAfterBooking")),
                                CalculatedBookingPrice = reader.GetSafeDecimal(reader.GetOrdinal("CalculatedBookingPrice")),
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    locationBookingsReturnList.TrimExcess();

                    // Return list
                    return locationBookingsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertLocationBooking(LocationBooking locationBooking)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationBookingCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = locationBooking.BookingId;
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = locationBooking.LocationId;
                    cmd.Parameters.Add("@FurnituringId", SqlDbType.Int).Value = locationBooking.FurnituringId;
                    cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = locationBooking.StartTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = locationBooking.EndTime;
                    cmd.Parameters.Add("@NumberOfPeople", SqlDbType.SmallInt).Value = locationBooking.NumberOfPeople;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into booking object.
                    locationBooking.BookingId = (int)cmd.Parameters["@InsertId"].Value;
                }
                catch (Exception exception)
                {
                    if (exception.Message == "The location is already booked at the given time.")
                    {
                        throw new DoubleBookingException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateLocationBooking(LocationBooking locationBooking)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationBookingUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@LocationBookingId", SqlDbType.Int).Value = locationBooking.LocationBookingId;
                    cmd.Parameters.Add("@BookingId", SqlDbType.Int).Value = locationBooking.BookingId;
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = locationBooking.LocationId;
                    cmd.Parameters.Add("@FurnituringId", SqlDbType.Int).Value = locationBooking.FurnituringId;
                    cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = locationBooking.StartTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = locationBooking.EndTime;
                    cmd.Parameters.Add("@NumberOfPeople", SqlDbType.SmallInt).Value = locationBooking.NumberOfPeople;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "The location is already booked at the given time.")
                    {
                        throw new DoubleBookingException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<LocationBooking> GetLocationBookings(int? BookingId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<LocationBooking> locationBookingsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    locationBookingsReturnList = new List<LocationBooking>(50);


                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_LocationBookingList");

                    // Get locations for BookingId if defined
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
                            // Create new Location object from database values and add to list
                            locationBookingsReturnList.Add(new LocationBooking
                            {
                                LocationBookingId = reader.GetSafeInt32(reader.GetOrdinal("LocationBookingId")),
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                FurnituringId = reader.GetSafeInt16(reader.GetOrdinal("FurnituringId")),
                                StartTime = reader.GetSafeDateTime(reader.GetOrdinal("StartTime")),
                                EndTime = reader.GetSafeDateTime(reader.GetOrdinal("EndTime")),
                                NumberOfPeople = reader.GetSafeInt16(reader.GetOrdinal("NumberOfPeople")),
                                MaxPeople = reader.GetSafeInt32(reader.GetOrdinal("MaxPeople")),
                                CalculatedBookingPrice = reader.GetSafeDecimal(reader.GetOrdinal("CalculatedBookingPrice")),

                                LocationName = reader.GetSafeString(reader.GetOrdinal("LocationName")),
                                FurnituringName = reader.GetSafeString(reader.GetOrdinal("FurnituringName"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    locationBookingsReturnList.TrimExcess();

                    // Return list
                    return locationBookingsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public LocationBooking GetLocationBookingById(int locationBookingId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationBookingList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@LocationBookingId", SqlDbType.Int).Value = locationBookingId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new Booking object from database values and return a reference
                            return new LocationBooking
                            {
                                LocationBookingId = reader.GetSafeInt32(reader.GetOrdinal("LocationBookingId")),
                                BookingId = reader.GetSafeInt32(reader.GetOrdinal("BookingId")),
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                LocationImageSrc = reader.GetSafeString(reader.GetOrdinal("LocationImageSrc")),
                                FurnituringId = reader.GetSafeInt16(reader.GetOrdinal("FurnituringId")),
                                StartTime = reader.GetSafeDateTime(reader.GetOrdinal("StartTime")),
                                EndTime = reader.GetSafeDateTime(reader.GetOrdinal("EndTime")),
                                NumberOfPeople = reader.GetSafeInt16(reader.GetOrdinal("NumberOfPeople")),
                                MaxPeople = reader.GetSafeInt32(reader.GetOrdinal("MaxPeople")),
                                CalculatedBookingPrice = reader.GetSafeDecimal(reader.GetOrdinal("CalculatedBookingPrice")),

                                LocationName = reader.GetSafeString(reader.GetOrdinal("LocationName")),
                                FurnituringName = reader.GetSafeString(reader.GetOrdinal("FurnituringName"))
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