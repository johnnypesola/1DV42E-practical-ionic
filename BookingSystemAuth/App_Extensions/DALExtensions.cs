using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystemAuth
{
    public static class DALExtensions
    {
        // Custom Safe SqlDataReader methods, with null checks
        public static string GetSafeString(this SqlDataReader reader, int columnIndex)
        {
            return (!reader.IsDBNull(columnIndex) ? reader.GetString(columnIndex) : String.Empty);
        }

        public static int GetSafeInt32(this SqlDataReader reader, int columnIndex)
        {
            return (!reader.IsDBNull(columnIndex) ? reader.GetInt32(columnIndex) : 0);
        }

        public static int? GetSafeNullableInt32(this SqlDataReader reader, int columnIndex)
        {
            if (!reader.IsDBNull(columnIndex))
            {
                return reader.GetInt32(columnIndex);
            }
            else
            {
                return null;
            }
        }

        public static int GetSafeInt16(this SqlDataReader reader, int columnIndex)
        {
            return (!reader.IsDBNull(columnIndex) ? reader.GetInt16(columnIndex) : 0);
        }

        public static decimal GetSafeDecimal(this SqlDataReader reader, int columnIndex)
        {
            return (!reader.IsDBNull(columnIndex) ? reader.GetDecimal(columnIndex) : 0);
        }

        public static double GetSafeDouble(this SqlDataReader reader, int columnIndex)
        {
            return (!reader.IsDBNull(columnIndex) ? reader.GetDouble(columnIndex) : 0);
        }

        public static DateTime GetSafeDateTime(this SqlDataReader reader, int columnIndex)
        {
            return (!reader.IsDBNull(columnIndex) ? reader.GetDateTime(columnIndex) : new DateTime() );
        }

        public static DateTime? GetSafeNullableDateTime(this SqlDataReader reader, int columnIndex)
        {
            if (!reader.IsDBNull(columnIndex))
            {
                return reader.GetDateTime(columnIndex);
            }
            else
            {
                return null;
            }
        }

        public static bool GetSafeBoolean(this SqlDataReader reader, int columnIndex)
        {
            return (!reader.IsDBNull(columnIndex) ? reader.GetBoolean(columnIndex) : false);
        }

        public static bool? GetSafeNullableBoolean(this SqlDataReader reader, int columnIndex)
        {
            if (!reader.IsDBNull(columnIndex))
            {
                return reader.GetBoolean(columnIndex);
            }
            else
            {
                return null;
            }
        }

    }
}