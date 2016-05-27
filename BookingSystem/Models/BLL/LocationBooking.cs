using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class LocationBooking
    {
        [Required(ErrorMessage = "LocationBookingId is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "LocationBookingId is out of range.")]
        public int LocationBookingId { get; set; }

        [Required(ErrorMessage = "BookingId is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "BookingId is out of range.")]
        public int BookingId { get; set; }

        [Required(ErrorMessage = "NumberOfPeople is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "NumberOfPeople is out of range.")]
        public int NumberOfPeople { get; set; }

        [Required(ErrorMessage = "StartTime is required.")]
        public DateTime StartTime { get; set; }

        [Required(ErrorMessage = "EndTime is required.")]
        public DateTime EndTime { get; set; }

        // Extra datafields retrieved from database/stored procedure
        public string BookingName { get; set; }

        public bool Provisional { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "LocationId is out of range.")]
        public int LocationId { get; set; }

        public string LocationName { get; set; }

        public string LocationImageSrc { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "FurnituringId is out of range.")]
        public int? FurnituringId { get; set; }

        public string FurnituringName { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "MaxPeople is out of range.")]
        public int MaxPeople { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "MinutesMarginBeforeBooking is out of range.")]
        public int MinutesMarginBeforeBooking { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "MinutesMarginAfterBooking is out of range.")]
        public int MinutesMarginAfterBooking { get; set; }

        public decimal CalculatedBookingPrice { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "CustomerId is out of range.")]
        public int CustomerId { get; set; }
    }
}