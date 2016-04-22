using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class BookingTypeDAL : DALBase
    {
        public void DeleteBookingType(int BookingTypeId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.Int).Value = BookingTypeId;

                    // Try to delete BookingType from database.
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

        public BookingType GetBookingTypeById(int BookingTypeId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.Int).Value = BookingTypeId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new BookingType object from database values and return a reference
                            return new BookingType
                            {
                                BookingTypeId = reader.GetSafeInt16(reader.GetOrdinal("BookingTypeId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                HasLocation = reader.GetSafeBoolean(reader.GetOrdinal("HasLocation")),
                                MinutesMarginBeforeBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginBeforeBooking")),
                                MinutesMarginAfterBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginAfterBooking")),

                                BookingTypeCount = reader.GetSafeInt32(reader.GetOrdinal("BookingTypeCount"))
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

        public IEnumerable<BookingType> GetBookingTypes()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<BookingType> BookingTypesReturnList;
                    SqlCommand cmd;

                    // Create list object
                    BookingTypesReturnList = new List<BookingType>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_BookingTypeList");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new BookingType object from database values and add to list
                            BookingTypesReturnList.Add(new BookingType
                            {
                                BookingTypeId = reader.GetSafeInt16(reader.GetOrdinal("BookingTypeId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                HasLocation = reader.GetSafeBoolean(reader.GetOrdinal("HasLocation")),
                                MinutesMarginBeforeBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginBeforeBooking")),
                                MinutesMarginAfterBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginAfterBooking")),

                                BookingTypeCount = reader.GetSafeInt32(reader.GetOrdinal("BookingTypeCount"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    BookingTypesReturnList.TrimExcess();

                    // Return list
                    return BookingTypesReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<BookingType> GetBookingTypesPageWise(string sortColumn, int pageSize, int pageIndex, out int totalRowCount)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<BookingType> bookingTypesReturnList;
                    SqlCommand cmd;

                    // Create list object
                    bookingTypesReturnList = new List<BookingType>(pageSize);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_BookingTypeList", DALOptions.closedConnection);

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
                            // Create new BookingType object from database values and add to list
                            bookingTypesReturnList.Add(new BookingType
                            {
                                BookingTypeId = reader.GetSafeInt16(reader.GetOrdinal("BookingTypeId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                HasLocation = reader.GetSafeBoolean(reader.GetOrdinal("HasLocation")),
                                MinutesMarginBeforeBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginBeforeBooking")),
                                MinutesMarginAfterBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginAfterBooking")),

                                BookingTypeCount = reader.GetSafeInt32(reader.GetOrdinal("BookingTypeCount"))
                            });
                        }
                    }

                    // Get total row count
                    totalRowCount = Convert.ToInt32(cmd.Parameters["@TotalRowCount"].Value);

                    // Remove unused list rows, free memory.
                    bookingTypesReturnList.TrimExcess();

                    // Return list
                    return bookingTypesReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertBookingType(BookingType BookingType)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = BookingType.Name;
                    cmd.Parameters.Add("@HasLocation", SqlDbType.Bit).Value = BookingType.HasLocation;
                    cmd.Parameters.Add("@MinutesMarginBeforeBooking", SqlDbType.SmallInt).Value = BookingType.MinutesMarginBeforeBooking;
                    cmd.Parameters.Add("@MinutesMarginAfterBooking", SqlDbType.SmallInt).Value = BookingType.MinutesMarginAfterBooking;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into BookingType object.
                    BookingType.BookingTypeId = (int)cmd.Parameters["@InsertId"].Value;
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a bookingtype with the given name.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateBookingType(BookingType BookingType)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = BookingType.BookingTypeId;
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = BookingType.Name;
                    cmd.Parameters.Add("@HasLocation", SqlDbType.Bit).Value = BookingType.HasLocation;
                    cmd.Parameters.Add("@MinutesMarginBeforeBooking", SqlDbType.SmallInt).Value = BookingType.MinutesMarginBeforeBooking;
                    cmd.Parameters.Add("@MinutesMarginAfterBooking", SqlDbType.SmallInt).Value = BookingType.MinutesMarginAfterBooking;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a bookingtype with the given name.")
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