using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;


namespace BookingSystem.Models
{
    public class CalendarBookingDay
    {
        //[RegularExpression(ValidationExtensions.SMALLDATETIME_REGEXP, ErrorMessage = "StartTime has to be a smalldate time string")]
        public DateTime StartTime { get; set; }

        //[RegularExpression(ValidationExtensions.SMALLDATETIME_REGEXP, ErrorMessage = "EndTime has to be a smalldate time string")]
        public DateTime EndTime { get; set; }

        [RegularExpression(ValidationExtensions.BOOKING_TYPE_REGEXP, ErrorMessage = "Type has to be one of the following: location, meal, resource, all")]
        public String Type { get; set; }
    }
}