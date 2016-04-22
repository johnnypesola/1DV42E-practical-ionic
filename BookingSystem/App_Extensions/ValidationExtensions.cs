using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace BookingSystem
{
    public static class ValidationExtensions
    {
        // Regexp for recurring validation purposes
        public const string COLUMN_NAME_REGEXP = @"^[0-9a-zA-Z]*$";

        public const string TEXT_FIELD_REGEXP = @"^[0-9a-zA-ZåäöÅÄÖé\-_&\.,~\^@()/%\s\!]*$";

        public const string IMG_PATH_REGEXP = @"^Content/upload/img/([a-z_\-\s0-9\.]+)+\/([a-z_\-\s0-9\.]+)+\.(gif|png|jpg)$";

        public const string POST_NUMBER_REGEXP = @"^[0-9]{3}\s[0-9]{2}$";

        public const string PHONE_NUMBER_REGEXP = @"^[0-9\-\s]*$";

        public const string SMALLDATETIME_REGEXP = @"^[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$*"; // Not used

        public const string DATE_REGEXP = @"^[0-9]{4}-[0-9]{2}-[0-9]{2}$*";

        public const string TIME_REGEXP = @"^[0-9]{2}:[0-9]{2}$*";

        // Special validation
        public const string BOOKING_TYPE_REGEXP = @"^(location|resource|meal|all)";

        // Generic validation method (<T> declares its generic)
        public static bool Validate<T>(this T instance, out ICollection<ValidationResult> validationResults)
        {
            var validationContext = new ValidationContext(instance);
            validationResults = new List<ValidationResult>();
            return Validator.TryValidateObject(instance, validationContext, validationResults, true);
        }
    }

 
 }