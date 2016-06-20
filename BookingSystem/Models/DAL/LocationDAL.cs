using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class LocationDAL : DALBase
    {
        public void DeleteLocation(int locationId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = locationId;

                    // Try to delete location from database.
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

        public IEnumerable<Location> SearchFor(SearchContainer searchContainer)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Location> locationsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    locationsReturnList = new List<Location>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_LocationList");

                    // Add variable for stored procedure
                    switch (searchContainer.ColumnName)
                    {
                        case "Name":
                            cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = searchContainer.SearchValue;
                            break;
                        case "MaxPeople":
                            cmd.Parameters.Add("@MaxPeople", SqlDbType.SmallInt).Value = Int16.Parse(searchContainer.SearchValue);
                            break;
                        case "BookingPricePerHour":
                            cmd.Parameters.Add("@BookingPricePerHour", SqlDbType.Decimal).Value = decimal.Parse(searchContainer.SearchValue);
                            break;
                    }

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Location object from database values and add to list
                            locationsReturnList.Add(new Location
                            {
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                MaxPeople = reader.GetSafeInt16(reader.GetOrdinal("MaxPeople")),
                                GPSLongitude = reader.GetSafeDecimal(reader.GetOrdinal("GPSLongitude")),
                                GPSLatitude = reader.GetSafeDecimal(reader.GetOrdinal("GPSLatitude")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                BookingPricePerHour = reader.GetSafeDecimal(reader.GetOrdinal("BookingPricePerHour")),
                                TotalBookings = reader.GetSafeInt32(reader.GetOrdinal("TotalBookings")),
                                TotalBookingValue = reader.GetSafeDecimal(reader.GetOrdinal("TotalBookingValue")),
                                MinutesMarginBeforeBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginBeforeBooking")),
                                MinutesMarginAfterBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginAfterBooking"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    locationsReturnList.TrimExcess();

                    // Return list
                    return locationsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public Location GetLocationById(int locationId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = locationId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new Location object from database values and return a reference
                            return new Location
                            {
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                MaxPeople = reader.GetSafeInt16(reader.GetOrdinal("MaxPeople")),
                                GPSLongitude = reader.GetSafeDecimal(reader.GetOrdinal("GPSLongitude")),
                                GPSLatitude = reader.GetSafeDecimal(reader.GetOrdinal("GPSLatitude")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                BookingPricePerHour = reader.GetSafeDecimal(reader.GetOrdinal("BookingPricePerHour")),
                                TotalBookings = reader.GetSafeInt32(reader.GetOrdinal("TotalBookings")),
                                TotalBookingValue = reader.GetSafeDecimal(reader.GetOrdinal("TotalBookingValue")),
                                MinutesMarginBeforeBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginBeforeBooking")),
                                MinutesMarginAfterBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginAfterBooking"))
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

        public IEnumerable<Location> GetLocations()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Location> locationsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    locationsReturnList = new List<Location>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_LocationListSimple");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Location object from database values and add to list
                            locationsReturnList.Add(new Location
                            {
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                MaxPeople = reader.GetSafeInt16(reader.GetOrdinal("MaxPeople")),
                                GPSLongitude = reader.GetSafeDecimal(reader.GetOrdinal("GPSLongitude")),
                                GPSLatitude = reader.GetSafeDecimal(reader.GetOrdinal("GPSLatitude")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                BookingPricePerHour = reader.GetSafeDecimal(reader.GetOrdinal("BookingPricePerHour")),
                                TotalBookings = reader.GetSafeInt32(reader.GetOrdinal("TotalBookings"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    locationsReturnList.TrimExcess();

                    // Return list
                    return locationsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<Location> GetLocationsFreeForPeriod(DateTime startTime, DateTime endTime, int locationBookingExceptionId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Location> locationsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    locationsReturnList = new List<Location>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_LocationsFreeForPeriod");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = startTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = endTime;
                    cmd.Parameters.Add("@ExceptionId", SqlDbType.Int).Value = locationBookingExceptionId;

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Location object from database values and add to list
                            locationsReturnList.Add(new Location
                            {
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                MaxPeople = reader.GetSafeInt16(reader.GetOrdinal("MaxPeople")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                BookingPricePerHour = reader.GetSafeDecimal(reader.GetOrdinal("BookingPricePerHour"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    locationsReturnList.TrimExcess();

                    // Return list
                    return locationsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<Location> GetLocationsPageWise(string sortColumn, int pageSize, int pageIndex, out int totalRowCount)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Location> locationsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    locationsReturnList = new List<Location>(pageSize);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_LocationList", DALOptions.closedConnection);

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
                            // Create new Location object from database values and add to list
                            locationsReturnList.Add(new Location
                            {
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                MaxPeople = reader.GetSafeInt16(reader.GetOrdinal("MaxPeople")),
                                GPSLongitude = reader.GetSafeDecimal(reader.GetOrdinal("GPSLongitude")),
                                GPSLatitude = reader.GetSafeDecimal(reader.GetOrdinal("GPSLatitude")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                BookingPricePerHour = reader.GetSafeDecimal(reader.GetOrdinal("BookingPricePerHour")),
                                TotalBookings = reader.GetSafeInt32(reader.GetOrdinal("TotalBookings")),
                                TotalBookingValue = reader.GetSafeDecimal(reader.GetOrdinal("TotalBookingValue")),
                                MinutesMarginBeforeBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginBeforeBooking")),
                                MinutesMarginAfterBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginAfterBooking"))
                            });
                        }
                    }

                    // Get total row count
                    totalRowCount = Convert.ToInt32(cmd.Parameters["@TotalRowCount"].Value);

                    // Remove unused list rows, free memory.
                    locationsReturnList.TrimExcess();

                    // Return list
                    return locationsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertLocation(Location location)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = location.Name;
                    cmd.Parameters.Add("@MaxPeople", SqlDbType.SmallInt).Value = location.MaxPeople;
                    cmd.Parameters.Add("@GPSLongitude", SqlDbType.Decimal).Value = location.GPSLongitude;
                    cmd.Parameters.Add("@GPSLatitude", SqlDbType.Decimal).Value = location.GPSLatitude;
                    cmd.Parameters.Add("@ImageSrc", SqlDbType.VarChar, 50).Value = location.ImageSrc;
                    cmd.Parameters.Add("@BookingPricePerHour", SqlDbType.Decimal).Value = location.BookingPricePerHour;
                    cmd.Parameters.Add("@MinutesMarginBeforeBooking", SqlDbType.SmallInt).Value = location.MinutesMarginBeforeBooking;
                    cmd.Parameters.Add("@MinutesMarginAfterBooking", SqlDbType.SmallInt).Value = location.MinutesMarginAfterBooking;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into location object.
                    location.LocationId = (int)cmd.Parameters["@InsertId"].Value;
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a location with the given name.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateLocation(Location location)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_LocationUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = location.LocationId;
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = location.Name;
                    cmd.Parameters.Add("@MaxPeople", SqlDbType.SmallInt).Value = location.MaxPeople;
                    cmd.Parameters.Add("@GPSLongitude", SqlDbType.Decimal).Value = location.GPSLongitude;
                    cmd.Parameters.Add("@GPSLatitude", SqlDbType.Decimal).Value = location.GPSLatitude;
                    cmd.Parameters.Add("@ImageSrc", SqlDbType.VarChar, 50).Value = location.ImageSrc;
                    cmd.Parameters.Add("@BookingPricePerHour", SqlDbType.Decimal).Value = location.BookingPricePerHour;
                    cmd.Parameters.Add("@MinutesMarginBeforeBooking", SqlDbType.SmallInt).Value = location.MinutesMarginBeforeBooking;
                    cmd.Parameters.Add("@MinutesMarginAfterBooking", SqlDbType.Decimal).Value = location.MinutesMarginAfterBooking;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a location with the given name.")
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