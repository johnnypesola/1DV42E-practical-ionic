using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class ResourceBooking
    {
        [Required(ErrorMessage = "ResourceBookingId is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "ResourceBookingId is out of range.")]
        public int ResourceBookingId { get; set; }

        [Required(ErrorMessage = "BookingId is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "BookingId is out of range.")]
        public int BookingId { get; set; }

        [Required(ErrorMessage = "ResourceCount is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "ResourceCount is out of range.")]
        public int ResourceCount { get; set; }

        [Required(ErrorMessage = "StartTime is required.")]
        public DateTime StartTime { get; set; }

        [Required(ErrorMessage = "EndTime is required.")]
        public DateTime EndTime { get; set; }

        // Extra datafields retrieved from database/stored procedure
        public string BookingName { get; set; }

        public bool Provisional { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "ResourceId is out of range.")]
        public int ResourceId { get; set; }

        public string ResourceName { get; set; }

        public string ResourceImageSrc { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "MaxPeople is out of range.")]
        public int MaxPeople { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "MinutesMarginBeforeBooking is out of range.")]
        public int MinutesMarginBeforeBooking { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "MinutesMarginAfterBooking is out of range.")]
        public int MinutesMarginAfterBooking { get; set; }

        public decimal CalculatedBookingPrice { get; set; }

    }
}