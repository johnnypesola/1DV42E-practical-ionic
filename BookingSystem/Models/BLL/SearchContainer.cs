using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystem.Models
{
    public class SearchContainer
    {
        [Required(ErrorMessage = "ColumnName is required.")]
        [StringLength(50, ErrorMessage = "ColumnName must not exceed 50 chars.")]
        [RegularExpression(ValidationExtensions.COLUMN_NAME_REGEXP, ErrorMessage = "ColumnName must be alphanumeric")]
        public string ColumnName { get; set; }

        [Required(ErrorMessage = "SearchValue is required.")]
        [StringLength(50, ErrorMessage = "SearchValue must not exceed 50 chars.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "SearchValue must be alphanumeric and may also contain the following chars: &_-.,@")]
        public string SearchValue { get; set; }
    }
}