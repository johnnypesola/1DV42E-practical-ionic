using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystemAuth.Models
{
    public class BookingTypeHasResource
    {
        [Required(ErrorMessage = "BookingTypeId is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "BookingTypeId is out of range.")]
        public int BookingTypeId { get; set; }

        [Required(ErrorMessage = "ResourceId is required.")]
        [Range(0, Int32.MaxValue, ErrorMessage = "ResourceId is out of range.")]
        public int ResourceId { get; set; }

        [Required(ErrorMessage = "ResourceCount is required.")]
        [Range(0, Int32.MaxValue, ErrorMessage = "ResourceCount is out of range.")]
        public int ResourceCount { get; set; }

        // Extra datafields retrieved from database/stored procedure
        public string BookingTypeName { get; set; }

        public string ResourceName { get; set; }
    }
}