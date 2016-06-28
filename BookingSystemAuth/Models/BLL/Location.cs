using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace BookingSystemAuth.Models
{
    public class Location
    {
        [Required(ErrorMessage = "LocationId is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "LocationId is out of range.")]
        public int LocationId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Namn får endast innehåll alfanumreriska tecken och följande specialtecken: &_-.,@")]
        [StringLength(50, ErrorMessage = "Name must not exceed 50 chars.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "MaxPeople is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "MaxPeople is out of range.")]
        public int MaxPeople { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        [Range(-86, 86, ErrorMessage = "GPSLatitude is out of range.")]
        public decimal GPSLatitude { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        [Range(-180, 180, ErrorMessage = "GPSLongitude is out of range.")]
        public decimal GPSLongitude { get; set; }

        [StringLength(50, ErrorMessage = "ImageSrc must not exceed 50 chars.")]
        [RegularExpression(ValidationExtensions.IMG_PATH_REGEXP, ErrorMessage = "ImageSrc is invalid")]
        public string ImageSrc { get; set; }

        [Required(ErrorMessage = "BookingPricePerHour is required.")]
        [Range(0.00, int.MaxValue, ErrorMessage = "BookingPricePerHour is out of range.")]
        public decimal BookingPricePerHour { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "MinutesMarginBeforeBooking is out of range.")]
        public int MinutesMarginBeforeBooking { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "MinutesMarginAfterBooking is out of range.")]
        public int MinutesMarginAfterBooking { get; set; }

        // Extra datafields retrieved from database/stored procedure
        public int TotalBookings { get; set; }

        [DataType(DataType.Currency)]
        public decimal TotalBookingValue { get; set; }

    }
}