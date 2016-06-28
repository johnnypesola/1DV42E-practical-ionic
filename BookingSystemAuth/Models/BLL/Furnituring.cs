using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystemAuth.Models
{
    public class Furnituring
    {
        [Required(ErrorMessage = "FurnituringId is required.")]
        [Range(0, Int16.MaxValue, ErrorMessage = "FurnituringId is out of range.")]
        public int FurnituringId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, ErrorMessage = "Name must not exceed 50 chars.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Name must be alphanumeric and may also contain the following chars: &_-.,@")]
        public string Name { get; set; }
    }
}