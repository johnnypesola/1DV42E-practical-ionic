using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class MealBooking
    {
        [Required(ErrorMessage = "MealBookingId is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "MealBookingId is out of range.")]
        public int MealBookingId { get; set; }

        [Required(ErrorMessage = "BookingId is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "BookingId is out of range.")]
        public int BookingId { get; set; }

        [Required(ErrorMessage = "Provisional is required.")]
        public bool Provisional { get; set; }

        [Required(ErrorMessage = "MealId is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "MealId is out of range.")]
        public int MealId { get; set; }

        [Required(ErrorMessage = "MealCount is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "MealCount is out of range.")]
        public int MealCount { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "LocationId is out of range.")]
        public int? LocationId { get; set; }

        [StringLength(200, ErrorMessage = "DeliveryAddress must not exceed 200 chars.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "DeliveryAddress must be alphanumeric and may also contain the following chars: &_-.,@")]
        public string DeliveryAddress { get; set; }

        [Required(ErrorMessage = "StartTime is required.")]
        public DateTime StartTime { get; set; }

        [Required(ErrorMessage = "EndTime is required.")]
        public DateTime EndTime { get; set; }

        [StringLength(200, ErrorMessage = "Notes must not exceed 200 chars.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Notes must be alphanumeric and may also contain the following chars: &_-.,@")]
        public string Notes { get; set; }

        // Extra datafields retrieved from database/stored procedure
        public string LocationName { get; set; }

        public string MealName { get; set; }

        public string MealImageSrc { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "CustomerId is out of range.")]
        public int CustomerId { get; set; }
        
    }
}