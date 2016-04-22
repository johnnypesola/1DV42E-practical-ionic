using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class Meal
    {
        [Required(ErrorMessage = "MealId is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "MealId is out of range.")]
        public int MealId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, ErrorMessage = "Name must not exceed 50 chars.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Name must be alphanumeric and may also contain the following chars: &_-.,@")]
        public string Name { get; set; }
    }
}