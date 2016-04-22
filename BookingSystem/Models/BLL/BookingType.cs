using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class BookingType
    {
        [Required(ErrorMessage = "BookingTypeId is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "BookingTypeId is out of range.")]
        public int BookingTypeId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, ErrorMessage = "Name must not exceed 50 chars.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Name must be alphanumeric and may also contain the following chars: &_-.,@")]
        public string Name { get; set; }

        [Required(ErrorMessage = "HasLocation is required.")]
        public bool HasLocation { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "MinutesMarginBeforeBooking is out of range.")]
        public int MinutesMarginBeforeBooking { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "MinutesMarginAfterBooking is out of range.")]
        public int MinutesMarginAfterBooking { get; set; }

        // Extra datafields retrieved from database/stored procedure
        public int BookingTypeCount { get; set; }
    }
}