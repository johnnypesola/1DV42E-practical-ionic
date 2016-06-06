using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class CustomerDAL : DALBase
    {
        public void DeleteCustomer(int customerId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_CustomerDelete");

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Value = customerId;

                    // Try to delete customer from database.
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

        public IEnumerable<Customer> SearchFor(SearchContainer searchContainer)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Customer> customersReturnList;
                    SqlCommand cmd;

                    // Create list object
                    customersReturnList = new List<Customer>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_CustomerList");

                    // Add variable for stored procedure
                    switch (searchContainer.ColumnName)
                    {
                        case "CustomerId":
                            cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Value = searchContainer.SearchValue;
                            break;
                        case "Name":
                            cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = searchContainer.SearchValue;
                            break;
                        case "Address":
                            cmd.Parameters.Add("@Address", SqlDbType.VarChar, 40).Value = searchContainer.SearchValue;
                            break;
                        case "PostNumber":
                            cmd.Parameters.Add("@PostNumber", SqlDbType.VarChar, 6).Value = searchContainer.SearchValue;
                            break;
                        case "City":
                            cmd.Parameters.Add("@City", SqlDbType.VarChar, 30).Value = searchContainer.SearchValue;
                            break;
                        case "EmailAddress":
                            cmd.Parameters.Add("@EmailAddress", SqlDbType.VarChar, 50).Value = searchContainer.SearchValue;
                            break;
                        case "PhoneNumber":
                            cmd.Parameters.Add("@PhoneNumber", SqlDbType.VarChar, 20).Value = searchContainer.SearchValue;
                            break;
                        case "CellPhoneNumber":
                            cmd.Parameters.Add("@CellPhoneNumber", SqlDbType.VarChar, 20).Value = searchContainer.SearchValue;
                            break;
                        case "ParentCustomerName":
                            cmd.Parameters.Add("@ParentCustomerName", SqlDbType.VarChar, 50).Value = searchContainer.SearchValue;
                            break;
                        case "Notes":
                            cmd.Parameters.Add("@Notes", SqlDbType.VarChar, 200).Value = searchContainer.SearchValue;
                            break;
                    }

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Customer object from database values and add to list
                            customersReturnList.Add(new Customer
                            {
                                CustomerId = reader.GetSafeInt32(reader.GetOrdinal("CustomerId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                Address = reader.GetSafeString(reader.GetOrdinal("Address")),
                                PostNumber = reader.GetSafeString(reader.GetOrdinal("PostNumber")),
                                City = reader.GetSafeString(reader.GetOrdinal("City")),
                                EmailAddress = reader.GetSafeString(reader.GetOrdinal("EmailAddress")),
                                PhoneNumber = reader.GetSafeString(reader.GetOrdinal("PhoneNumber")),
                                CellPhoneNumber = reader.GetSafeString(reader.GetOrdinal("CellPhoneNumber")),
                                ParentCustomerId = reader.GetSafeInt32(reader.GetOrdinal("ParentCustomerId")),
                                ParentCustomerName = reader.GetSafeString(reader.GetOrdinal("ParentCustomerName")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                Notes = reader.GetSafeString(reader.GetOrdinal("Notes")),
                                TotalBookings = reader.GetSafeInt32(reader.GetOrdinal("TotalBookings")),
                                TotalBookingValue = reader.GetSafeDecimal(reader.GetOrdinal("TotalBookingValue")),
                                ChildCustomers = reader.GetSafeInt32(reader.GetOrdinal("ChildCustomers"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    customersReturnList.TrimExcess();

                    // Return list
                    return customersReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public Customer GetCustomerById(int customerId)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_CustomerList", DALOptions.closedConnection);

                    // Add parameter for Stored procedure
                    cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Value = customerId;

                    // Open connection to database
                    connection.Open();

                    // Try to read response from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if there is any return data to read
                        if (reader.Read())
                        {
                            // Create new Customer object from database values and return a reference
                            return new Customer
                            {
                                CustomerId = reader.GetSafeInt32(reader.GetOrdinal("CustomerId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                Address = reader.GetSafeString(reader.GetOrdinal("Address")),
                                PostNumber = reader.GetSafeString(reader.GetOrdinal("PostNumber")),
                                City = reader.GetSafeString(reader.GetOrdinal("City")),
                                EmailAddress = reader.GetSafeString(reader.GetOrdinal("EmailAddress")),
                                PhoneNumber = reader.GetSafeString(reader.GetOrdinal("PhoneNumber")),
                                CellPhoneNumber = reader.GetSafeString(reader.GetOrdinal("CellPhoneNumber")),
                                ParentCustomerId = reader.GetSafeInt32(reader.GetOrdinal("ParentCustomerId")),
                                ParentCustomerName = reader.GetSafeString(reader.GetOrdinal("ParentCustomerName")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                Notes = reader.GetSafeString(reader.GetOrdinal("Notes")),
                                TotalBookings = reader.GetSafeInt32(reader.GetOrdinal("TotalBookings")),
                                TotalBookingValue = reader.GetSafeDecimal(reader.GetOrdinal("TotalBookingValue")),
                                ChildCustomers = reader.GetSafeInt32(reader.GetOrdinal("ChildCustomers"))
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

        public IEnumerable<Customer> GetCustomers()
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Customer> customersReturnList;
                    SqlCommand cmd;

                    // Create list object
                    customersReturnList = new List<Customer>(50);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_CustomerListSimple");

                    // Get all data from stored procedure
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Get all data rows
                        while (reader.Read())
                        {
                            // Create new Customer object from database values and add to list
                            customersReturnList.Add(new Customer
                            {
                                CustomerId = reader.GetSafeInt32(reader.GetOrdinal("CustomerId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                City = reader.GetSafeString(reader.GetOrdinal("City")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                ParentCustomerId = reader.GetSafeInt32(reader.GetOrdinal("ParentCustomerId")),
                                ParentCustomerName = reader.GetSafeString(reader.GetOrdinal("ParentCustomerName"))
                            });
                        }
                    }

                    // Remove unused list rows, free memory.
                    customersReturnList.TrimExcess();

                    // Return list
                    return customersReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public IEnumerable<Customer> GetCustomersPageWise(string sortColumn, int pageSize, int pageIndex, out int totalRowCount)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    List<Customer> customersReturnList;
                    SqlCommand cmd;

                    // Create list object
                    customersReturnList = new List<Customer>(pageSize);

                    // Connect to database and execute given stored procedure
                    cmd = this.Setup("appSchema.usp_CustomerList", DALOptions.closedConnection);

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
                            // Create new Customer object from database values and add to list
                            customersReturnList.Add(new Customer
                            {
                                CustomerId = reader.GetSafeInt32(reader.GetOrdinal("CustomerId")),
                                Name = reader.GetSafeString(reader.GetOrdinal("Name")),
                                Address = reader.GetSafeString(reader.GetOrdinal("Address")),
                                PostNumber = reader.GetSafeString(reader.GetOrdinal("PostNumber")),
                                City = reader.GetSafeString(reader.GetOrdinal("City")),
                                EmailAddress = reader.GetSafeString(reader.GetOrdinal("EmailAddress")),
                                PhoneNumber = reader.GetSafeString(reader.GetOrdinal("PhoneNumber")),
                                CellPhoneNumber = reader.GetSafeString(reader.GetOrdinal("CellPhoneNumber")),
                                ParentCustomerId = reader.GetSafeInt32(reader.GetOrdinal("ParentCustomerId")),
                                ParentCustomerName = reader.GetSafeString(reader.GetOrdinal("ParentCustomerName")),
                                ImageSrc = reader.GetSafeString(reader.GetOrdinal("ImageSrc")),
                                Notes = reader.GetSafeString(reader.GetOrdinal("Notes")),
                                TotalBookings = reader.GetSafeInt32(reader.GetOrdinal("TotalBookings")),
                                TotalBookingValue = reader.GetSafeDecimal(reader.GetOrdinal("TotalBookingValue"))
                            });
                        }
                    }

                    // Get total row count
                    totalRowCount = Convert.ToInt32(cmd.Parameters["@TotalRowCount"].Value);

                    // Remove unused list rows, free memory.
                    customersReturnList.TrimExcess();

                    // Return list
                    return customersReturnList;
                }
                catch
                {
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void InsertCustomer(Customer customer)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_CustomerCreate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = customer.Name;
                    cmd.Parameters.Add("@Address", SqlDbType.VarChar, 40).Value = customer.Address;
                    cmd.Parameters.Add("@PostNumber", SqlDbType.VarChar, 6).Value = customer.PostNumber;
                    cmd.Parameters.Add("@City", SqlDbType.VarChar, 30).Value = customer.City;
                    cmd.Parameters.Add("@EmailAddress", SqlDbType.VarChar, 50).Value = customer.EmailAddress;
                    cmd.Parameters.Add("@PhoneNumber", SqlDbType.VarChar, 20).Value = customer.PhoneNumber;
                    cmd.Parameters.Add("@CellPhoneNumber", SqlDbType.VarChar, 20).Value = customer.CellPhoneNumber;
                    cmd.Parameters.Add("@ParentCustomerId", SqlDbType.Int).Value = customer.ParentCustomerId;
                    cmd.Parameters.Add("@ImageSrc", SqlDbType.VarChar, 50).Value = customer.ImageSrc;
                    cmd.Parameters.Add("@Notes", SqlDbType.VarChar, 200).Value = customer.Notes;

                    // Add out parameter for Stored procedure
                    cmd.Parameters.Add("@InsertId", SqlDbType.Int).Direction = ParameterDirection.Output;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();

                    // Place database insert id into customer object.
                    customer.CustomerId = (int)cmd.Parameters["@InsertId"].Value;
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }

        public void UpdateCustomer(Customer customer)
        {
            // Create connection object
            using (this.CreateConnection())
            {
                try
                {
                    SqlCommand cmd;

                    // Connect to database
                    cmd = this.Setup("appSchema.usp_CustomerUpdate", DALOptions.closedConnection);

                    // Add in parameters for Stored procedure
                    cmd.Parameters.Add("@CustomerId", SqlDbType.Int).Value = customer.CustomerId;
                    cmd.Parameters.Add("@Name", SqlDbType.VarChar, 50).Value = customer.Name;
                    cmd.Parameters.Add("@Address", SqlDbType.VarChar, 40).Value = customer.Address;
                    cmd.Parameters.Add("@PostNumber", SqlDbType.VarChar, 6).Value = customer.PostNumber;
                    cmd.Parameters.Add("@City", SqlDbType.VarChar, 30).Value = customer.City;
                    cmd.Parameters.Add("@EmailAddress", SqlDbType.VarChar, 50).Value = customer.EmailAddress;
                    cmd.Parameters.Add("@PhoneNumber", SqlDbType.VarChar, 20).Value = customer.PhoneNumber;
                    cmd.Parameters.Add("@CellPhoneNumber", SqlDbType.VarChar, 20).Value = customer.CellPhoneNumber;
                    cmd.Parameters.Add("@ParentCustomerId", SqlDbType.Int).Value = customer.ParentCustomerId;
                    cmd.Parameters.Add("@ImageSrc", SqlDbType.VarChar, 50).Value = customer.ImageSrc;
                    cmd.Parameters.Add("@Notes", SqlDbType.VarChar, 200).Value = customer.Notes;

                    // Open DB connection
                    connection.Open();

                    // Execute insert to database
                    cmd.ExecuteNonQuery();
                }
                catch
                {
                    // Throw exception
                    throw new ApplicationException(DAL_ERROR_MSG);
                }
            }
        }
    }
}