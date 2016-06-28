using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystemAuth.Models
{
    public class BookingTypeHasMeal
    {
        [Required(ErrorMessage = "BookingTypeId is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "BookingTypeId is out of range.")]
        public int BookingTypeId { get; set; }

        [Required(ErrorMessage = "MealId is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "MealId is out of range.")]
        public int MealId { get; set; }

        // Extra datafields retrieved from database/stored procedure
        public string BookingTypeName { get; set; }

        public string MealName { get; set; }
    }
}