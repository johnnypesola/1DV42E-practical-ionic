using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystemAuth.Models
{
    public class SharedDAL : DALBase
    {
        public IEnumerable<CalendarBookingDay> CheckDayBookingsForPeriod(DateTime startTime, DateTime endTime, String type)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    // Declare List of objects
                    List<CalendarBookingDay> calendarBookingDayReturnList;
                    SqlCommand cmd;

                    // Create list object
                    calendarBookingDayReturnList = new List<CalendarBookingDay>(100);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_BookingCheckDays", DALOptions.closedConnection);

                    // Add parameters for Stored procedure
                    cmd.Parameters.Add("@StartTime", SqlDbType.VarChar, 19).Value = startTime;
                    cmd.Parameters.Add("@EndTime", SqlDbType.VarChar, 19).Value = endTime;
                    cmd.Parameters.Add("@Type", SqlDbType.VarChar, 10).Value = type;

                    // Open DB connection
                    connection.Open();

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            calendarBookingDayReturnList.Add(
                                new CalendarBookingDay
                                {
                                    // Create new Booking object from database values and add to list
                                    StartTime = reader.GetSafeDateTime(reader.GetOrdinal("StartTime")),
                                    EndTime = reader.GetSafeDateTime(reader.GetOrdinal("EndTime")),
                                    Provisional = reader.GetSafeBoolean(reader.GetOrdinal("Provisional")),
                                    Type = reader.GetSafeString(reader.GetOrdinal("Type")),
                                    Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                    Id = reader.GetSafeInt32(reader.GetOrdinal("Id"))
                                }
                            );
                        }
                    }

                    // Remove unused list rows, free memory.
                    calendarBookingDayReturnList.TrimExcess();

                    // Return list
                    return calendarBookingDayReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }
    }
}