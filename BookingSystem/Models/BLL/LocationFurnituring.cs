using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class LocationFurnituring
    {
        [Required(ErrorMessage = "LocationId is required.")]
        [Range(0, Int32.MaxValue, ErrorMessage = "LocationId is out of range.")]
        public int LocationId { get; set; }

        [Required(ErrorMessage = "FurnituringId is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "FurnituringId is out of range.")]
        public int FurnituringId { get; set; }

        [Required(ErrorMessage = "MaxPeople is required.")]
        [Range(0, Int32.MaxValue, ErrorMessage = "MaxPeople is out of range.")]
        public int MaxPeople { get; set; }

        // Extra datafields retrieved from database/stored procedure
        public string LocationName { get; set; }

        public string FurnituringName { get; set; }
    }
}