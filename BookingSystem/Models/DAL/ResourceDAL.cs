using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class ResourceDAL : DALBase
    {
        public void DeleteResource(int ResourceId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_ResourceDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@ResourceId", SqlDbType.Int).Value = ResourceId;

                    // Try to delete Resource from database.
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

        public Resource GetResourceById(int ResourceId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_ResourceList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@ResourceId", SqlDbType.Int).Value = ResourceId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new Resource object from database values and return a reference
                            return new Resource
                            {
                                ResourceId = reader.GetSafeInt32(reader.GetOrdinal("ResourceId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                Count = reader.GetSafeInt16(reader.GetOrdinal("Count")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                BookingPricePerHour = reader.GetSafeDecimal(reader.GetOrdinal("BookingPricePerHour")),
                                MinutesMarginBeforeBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginBeforeBooking")),
                                MinutesMarginAfterBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginAfterBooking")),
                                WeekEndCount = reader.GetSafeInt16(reader.GetOrdinal("WeekEndCount")),
                                TotalBookings = reader.GetSafeInt32(reader.GetOrdinal("TotalBookings")),
                                TotalBookingValue = reader.GetSafeDecimal(reader.GetOrdinal("TotalBookingValue"))
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

        public IEnumerable<Resource> GetResources()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Resource> ResourcesReturnList;
                    SqlCommand cmd;

                    // Create list object
                    ResourcesReturnList = new List<Resource>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_ResourceListSimple");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Resource object from database values and add to list
                            ResourcesReturnList.Add(new Resource
                            {
                                ResourceId = reader.GetSafeInt32(reader.GetOrdinal("ResourceId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                Count = reader.GetSafeInt16(reader.GetOrdinal("Count")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                BookingPricePerHour = reader.GetSafeDecimal(reader.GetOrdinal("BookingPricePerHour")),
                                MinutesMarginBeforeBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginBeforeBooking")),
                                MinutesMarginAfterBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginAfterBooking")),
                                WeekEndCount = reader.GetSafeInt16(reader.GetOrdinal("WeekEndCount")),
                                TotalBookings = reader.GetSafeInt32(reader.GetOrdinal("TotalBookings"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    ResourcesReturnList.TrimExcess();

                    // Return list
                    return ResourcesReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<Resource> GetResourcesFreeForPeriod(DateTime startTime, DateTime endTime, int resourceBookingExceptionId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Resource> resourcesReturnList;
                    SqlCommand cmd;

                    // Create list object
                    resourcesReturnList = new List<Resource>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_ResourcesFreeForPeriod");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@StartTime", SqlDbType.SmallDateTime).Value = startTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.SmallDateTime).Value = endTime;
                    cmd.Parameters.Add("@ExceptionId", SqlDbType.Int).Value = resourceBookingExceptionId;

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Location object from database values and add to list
                            resourcesReturnList.Add(new Resource
                            {
                                ResourceId = reader.GetSafeInt32(reader.GetOrdinal("ResourceId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                Count = reader.GetSafeInt16(reader.GetOrdinal("Count")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                BookingPricePerHour = reader.GetSafeDecimal(reader.GetOrdinal("BookingPricePerHour")),
                                WeekEndCount = reader.GetSafeInt16(reader.GetOrdinal("WeekEndCount"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    resourcesReturnList.TrimExcess();

                    // Return list
                    return resourcesReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<Resource> GetResourcesPageWise(string sortColumn, int pageSize, int pageIndex, out int totalRowCount)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Resource> resourcesReturnList;
                    SqlCommand cmd;

                    // Create list object
                    resourcesReturnList = new List<Resource>(pageSize);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_ResourceList", DALOptions.closedConnection);

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
                            // Create new Resource object from database values and add to list
                            resourcesReturnList.Add(new Resource
                            {
                                ResourceId = reader.GetSafeInt32(reader.GetOrdinal("ResourceId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                Count = reader.GetSafeInt16(reader.GetOrdinal("Count")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                BookingPricePerHour = reader.GetSafeDecimal(reader.GetOrdinal("BookingPricePerHour")),
                                MinutesMarginBeforeBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginBeforeBooking")),
                                MinutesMarginAfterBooking = reader.GetSafeInt16(reader.GetOrdinal("MinutesMarginAfterBooking")),
                                WeekEndCount = reader.GetSafeInt16(reader.GetOrdinal("WeekEndCount"))
                            });
                        }
                    }

                    // Get total row count
                    totalRowCount = Convert.ToInt32(cmd.Parameters["@TotalRowCount"].Value);

                    // Remove unused list rows, free memory.
                    resourcesReturnList.TrimExcess();

                    // Return list
                    return resourcesReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertResource(Resource Resource)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_ResourceCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = Resource.Name;
                    cmd.Parameters.Add("@Count", SqlDbType.SmallInt).Value = Resource.Count;
                    cmd.Parameters.Add("@ImageSrc", SqlDbType.VarChar, 50).Value = Resource.ImageSrc;
                    cmd.Parameters.Add("@BookingPricePerHour", SqlDbType.Decimal).Value = Resource.BookingPricePerHour;
                    cmd.Parameters.Add("@MinutesMarginBeforeBooking", SqlDbType.SmallInt).Value = Resource.MinutesMarginBeforeBooking;
                    cmd.Parameters.Add("@MinutesMarginAfterBooking", SqlDbType.SmallInt).Value = Resource.MinutesMarginAfterBooking;
                    cmd.Parameters.Add("@WeekEndCount", SqlDbType.SmallInt).Value = Resource.WeekEndCount;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into Resource object.
                    Resource.ResourceId = (int)cmd.Parameters["@InsertId"].Value;
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a resource with the given name.")
                    {
                        throw new DuplicateNameException(exception.Message);
                    }
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateResource(Resource Resource)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_ResourceUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@ResourceId", SqlDbType.SmallInt).Value = Resource.ResourceId;
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = Resource.Name;
                    cmd.Parameters.Add("@Count", SqlDbType.SmallInt).Value = Resource.Count;
                    cmd.Parameters.Add("@ImageSrc", SqlDbType.VarChar, 50).Value = Resource.ImageSrc;
                    cmd.Parameters.Add("@BookingPricePerHour", SqlDbType.Decimal).Value = Resource.BookingPricePerHour;
                    cmd.Parameters.Add("@MinutesMarginBeforeBooking", SqlDbType.SmallInt).Value = Resource.MinutesMarginAfterBooking;
                    cmd.Parameters.Add("@MinutesMarginAfterBooking", SqlDbType.SmallInt).Value = Resource.MinutesMarginAfterBooking;
                    cmd.Parameters.Add("@WeekEndCount", SqlDbType.SmallInt).Value = Resource.WeekEndCount;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch (Exception exception)
                {
                    if (exception.Message == "There is already a resource with the given name.")
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