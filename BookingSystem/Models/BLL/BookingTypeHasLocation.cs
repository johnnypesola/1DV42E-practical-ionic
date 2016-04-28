using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class BookingTypeHasLocation
    {
        [Required(ErrorMessage = "BookingTypeId is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "BookingTypeId is out of range.")]
        public int BookingTypeId { get; set; }

        [Required(ErrorMessage = "LocationId is required.")]
        [Range(0, Int32.MaxValue, ErrorMessage = "LocationId is out of range.")]
        public int LocationId { get; set; }

        [Range(0, Int16.MaxValue, ErrorMessage = "FurnituringId is out of range.")]
        public int FurnituringId { get; set; }

        // Extra datafields retrieved from database/stored procedure
        public string BookingTypeName { get; set; }

        public string LocationName { get; set; }

        public string FurnituringName { get; set; }
    }
}