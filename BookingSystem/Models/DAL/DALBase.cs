using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace BookingSystem.Models
{
    public abstract class DALBase
    {
    // Fields
        static private string _connectionString;
        protected const string DAL_ERROR_MSG = "An error occured in DAL.";

    // Properties
        static protected SqlConnection connection { get; set; }

        protected enum DALOptions { openConnection, closedConnection };

    // Constructor
        static DALBase()
        {
            // Get connection string from Web.config
            _connectionString = WebConfigurationManager.ConnectionStrings["BookingSystemConnectionString"].ConnectionString;
        }

    // Methods
        protected SqlConnection CreateConnection()
        {
            // Create connection and store it in this object
            connection = new SqlConnection(_connectionString);

            // Return a reference
            return connection;
        }


        protected SqlCommand Setup(string commandName, DALOptions options = DALOptions.openConnection)
        {
            SqlCommand cmd;

            // Create Sql command object
            cmd = new SqlCommand(commandName, connection);

            // Set Type to StoreProcedure, which we will be executing.
            cmd.CommandType = CommandType.StoredProcedure;

            // Open connection to database if opted for.
            if (DALOptions.openConnection == options)
            {
                connection.Open();
            }

            return cmd;
        }
    }
}