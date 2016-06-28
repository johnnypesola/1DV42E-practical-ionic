using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BookingSystemAuth
{
    public class DataBaseEntryNotFoundException : Exception
    {
        public DataBaseEntryNotFoundException(){}

        public DataBaseEntryNotFoundException(string message)
            : base(message){}

        public DataBaseEntryNotFoundException(string message, Exception inner)
            : base(message, inner){}
    }

    public class DoubleBookingException : Exception
    {
        public DoubleBookingException(){}

        public DoubleBookingException(string message)
            : base(message) {}

        public DoubleBookingException(string message, Exception inner)
            : base(message, inner) {}
    }

    public class ApprovedException : Exception
    {
        public ApprovedException() { }

        public ApprovedException(string message)
            : base(message) { }

        public ApprovedException(string message, Exception inner)
            : base(message, inner) { }
    }
}