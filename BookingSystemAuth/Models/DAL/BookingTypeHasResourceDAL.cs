using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class BookingTypeHasResourceDAL : DALBase
    {
        public void DeleteBookingTypeHasResource(int BookingTypeId, int? ResourceId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasResourceDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = BookingTypeId;
                    if (ResourceId != null)
                    {
                        cmd.Parameters.Add("@ResourceId", SqlDbType.Int).Value = ResourceId;
                    }

                    // Try to delete BookingTypeHasResource from database.
                    cmd.ExecuteNonQuery();
                }
                catch (Exception)
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public BookingTypeHasResource GetBookingTypeHasResourceById(int BookingTypeId, int? ResourceId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasResourceList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = BookingTypeId;
                    if(ResourceId != null)
                    {
                        cmd.Parameters.Add("@ResourceId", SqlDbType.Int).Value = ResourceId;
                    }

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new BookingTypeHasResource object from database values and return a reference
                            return new BookingTypeHasResource
                            {
                                BookingTypeId = reader.GetSafeInt16(reader.GetOrdinal("BookingTypeId")),
                                ResourceId = reader.GetSafeInt32(reader.GetOrdinal("ResourceId")),
                                ResourceCount = reader.GetSafeInt32(reader.GetOrdinal("ResourceCount")),
                                ResourceName = reader.GetSafeString(reader.GetOrdinal("ResourceName")),
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

        public IEnumerable<BookingTypeHasResource> GetBookingTypeHasResources(int? BookingTypeId = null)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<BookingTypeHasResource> BookingTypeHasResourcesReturnList;
                    SqlCommand cmd;

                    // Create list object
                    BookingTypeHasResourcesReturnList = new List<BookingTypeHasResource>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_BookingTypeHasResourceList");

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
                            // Create new BookingTypeHasResource object from database values and add to list
                            BookingTypeHasResourcesReturnList.Add(new BookingTypeHasResource
                            {
                                BookingTypeId = reader.GetSafeInt16(reader.GetOrdinal("BookingTypeId")),
                                ResourceId = reader.GetSafeInt32(reader.GetOrdinal("ResourceId")),
                                ResourceName = reader.GetSafeString(reader.GetOrdinal("ResourceName")),
                                BookingTypeName = reader.GetSafeString(reader.GetOrdinal("BookingTypeName"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    BookingTypeHasResourcesReturnList.TrimExcess();

                    // Return list
                    return BookingTypeHasResourcesReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertBookingTypeHasResource(BookingTypeHasResource BookingTypeHasResource)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasResourceCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = BookingTypeHasResource.BookingTypeId;
                    cmd.Parameters.Add("@ResourceId", SqlDbType.Int).Value = BookingTypeHasResource.ResourceId;
                    cmd.Parameters.Add("@ResourceCount", SqlDbType.Int).Value = BookingTypeHasResource.ResourceCount;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "The booking type already has that Resource.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateBookingTypeHasResource(BookingTypeHasResource BookingTypeHasResource)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_BookingTypeHasResourceUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@BookingTypeId", SqlDbType.SmallInt).Value = BookingTypeHasResource.BookingTypeId;
                    cmd.Parameters.Add("@ResourceId", SqlDbType.Int).Value = BookingTypeHasResource.ResourceId;
                    cmd.Parameters.Add("@ResourceCount", SqlDbType.Int).Value = BookingTypeHasResource.ResourceCount;


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