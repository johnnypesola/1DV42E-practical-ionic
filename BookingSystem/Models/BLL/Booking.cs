using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class Booking
    {
        [Required(ErrorMessage = "BookingId is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "BookingId is out of range.")]
        public int BookingId { get; set; }

        [StringLength(50, ErrorMessage = "Name must not exceed 50 chars.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Name must be alphanumeric and may also contain the following chars: &_-.,@")]
        public string Name { get; set; }

        [Required(ErrorMessage = "BookingTypeId is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "BookingTypeId is out of range.")]
        public int? BookingTypeId { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "CustomerId is out of range.")]
        public int? CustomerId { get; set; }

        [Required(ErrorMessage = "Provisional is required.")]
        public bool Provisional { get; set; }

        [Required(ErrorMessage = "NumberOfPeople is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "NumberOfPeopleis out of range.")]
        public int NumberOfPeople { get; set; }

        [Range(0, 1, ErrorMessage = "Discount is out of range.")]
        public decimal Discount { get; set; }

        [StringLength(200, ErrorMessage = "Notes must not exceed 200 chars.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Notes must be alphanumeric and may also contain the following chars: &_-.,@")]
        public string Notes { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "CreatedByUserId is out of range.")]
        public int? CreatedByUserId { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "ModifiedByUserId is out of range.")]
        public int? ModifiedByUserId { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "ResponsibleUserId is out of range.")]
        public int? ResponsibleUserId { get; set; }



        // Extra datafields retrieved from database/stored procedure
        [StringLength(50, ErrorMessage = "CustomerName must not exceed 50 chars.")]
        public string CustomerName { get; set; }

        [StringLength(50, ErrorMessage = "BookingTypeName must not exceed 50 chars.")]
        public string BookingTypeName { get; set; }

        public decimal CalculatedBookingPrice { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        // Extra field for children arrays
        public IEnumerable<LocationBooking> LocationBookings { get; set; }

        public IEnumerable<ResourceBooking> ResourceBookings { get; set; }

        public IEnumerable<MealBooking> MealBookings { get; set; }
    }
}