using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class BookingTypeHasLocationDAL : DALBase
    {
        public void DeleteBookingTypeHasLocation(int BookingTypeId, int? LocationId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasLocationDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = BookingTypeId;
                    if (LocationId != null)
                    {
                        cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = LocationId;
                    }

                    // Try to delete BookingTypeHasLocation from database.
                    cmd.ExecuteNonQuery();
                }
                catch (Exception)
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public BookingTypeHasLocation GetBookingTypeHasLocationById(int BookingTypeId, int? LocationId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasLocationList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = BookingTypeId;
                    if(LocationId != null)
                    {
                        cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = LocationId;
                    }

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new BookingTypeHasLocation object from database values and return a reference
                            return new BookingTypeHasLocation
                            {
                                BookingTypeId = reader.GetSafeInt16(reader.GetOrdinal("BookingTypeId")),
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                FurnituringId = reader.GetSafeInt16(reader.GetOrdinal("FurnituringId")),
                                LocationName = reader.GetSafeString(reader.GetOrdinal("LocationName")),
                                BookingTypeName = reader.GetSafeString(reader.GetOrdinal("BookingTypeName")),
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

        public IEnumerable<BookingTypeHasLocation> GetBookingTypeHasLocations(int? BookingTypeId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<BookingTypeHasLocation> BookingTypeHasLocationsReturnList;
                    SqlCommand cmd;

                    // Create list object
                    BookingTypeHasLocationsReturnList = new List<BookingTypeHasLocation>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_BookingTypeHasLocationList");

                    // Add parameter for Stored procedure
                    if (BookingTypeId != null)
                    {
                        cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = BookingTypeId;
                    }

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new BookingTypeHasLocation object from database values and add to list
                            BookingTypeHasLocationsReturnList.Add(new BookingTypeHasLocation
                            {
                                BookingTypeId = reader.GetSafeInt16(reader.GetOrdinal("BookingTypeId")),
                                LocationId = reader.GetSafeInt32(reader.GetOrdinal("LocationId")),
                                FurnituringId = reader.GetSafeInt16(reader.GetOrdinal("FurnituringId")),
                                LocationName = reader.GetSafeString(reader.GetOrdinal("LocationName")),
                                BookingTypeName = reader.GetSafeString(reader.GetOrdinal("BookingTypeName")),
                                FurnituringName = reader.GetSafeString(reader.GetOrdinal("FurnituringName"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    BookingTypeHasLocationsReturnList.TrimExcess();

                    // Return list
                    return BookingTypeHasLocationsReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertBookingTypeHasLocation(BookingTypeHasLocation BookingTypeHasLocation)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasLocationCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = BookingTypeHasLocation.BookingTypeId;
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = BookingTypeHasLocation.LocationId;
                    cmd.Parameters.Add("@FurnituringId", SqlDbType.SmallInt).Value = BookingTypeHasLocation.FurnituringId;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "The booking type already has that location.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateBookingTypeHasLocation(BookingTypeHasLocation BookingTypeHasLocation)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasLocationUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = BookingTypeHasLocation.BookingTypeId;
                    cmd.Parameters.Add("@LocationId", SqlDbType.Int).Value = BookingTypeHasLocation.LocationId;
                    cmd.Parameters.Add("@FurnituringId", SqlDbType.SmallInt).Value = BookingTypeHasLocation.FurnituringId;


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