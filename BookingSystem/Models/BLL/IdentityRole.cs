using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class IdentityRole : IRole<int>
    {
        [Required(ErrorMessage = "Id is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Id is out of range.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Name string can only contain letters and spaces and the following characters: &_-")]
        [StringLength(50, ErrorMessage = "Name string length surpassed the limit of 50.")]
        public string Name { get; set; }
    }
}