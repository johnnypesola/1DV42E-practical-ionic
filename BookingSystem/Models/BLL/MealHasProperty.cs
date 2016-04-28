using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class MealHasProperty
    {
        [Required(ErrorMessage = "MealId is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "MealId is out of range.")]
        public int MealId { get; set; }

        [Required(ErrorMessage = "MealPropertyId is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "MealPropertyId is out of range.")]
        public int MealPropertyId { get; set; }

        // Extra datafields retrieved from database/stored procedure
        public string MealName { get; set; }

        public string MealPropertyName { get; set; }
    }
}