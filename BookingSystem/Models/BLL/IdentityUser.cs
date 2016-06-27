using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class IdentityUser : IUser<int>
    {
        [Required(ErrorMessage = "Id is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "Id is out of range.")]
        public int Id { get; set; }

        [Required(ErrorMessage = "UserName is required.")]
        [RegularExpression(ValidationExtensions.USER_NAME_REGEXP, ErrorMessage = "UserName string can only contain letters and spaces and the following characters: _-.,~@^")]
        [StringLength(50, ErrorMessage = "UserName string length surpassed the limit of 50.")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "FirstName is required.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "FirstName string can only contain letters and spaces and the following characters: &_-")]
        [StringLength(50, ErrorMessage = "FirstName string length surpassed the limit of 50.")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "SurName is required.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "SurName string can only contain letters and spaces and the following characters: &_-")]
        [StringLength(50, ErrorMessage = "SurName string length surpassed the limit of 50.")]
        public string SurName { get; set; }

        [StringLength(50, ErrorMessage = "EmailAddress string length surpassed the limit of 50.")]
        [EmailAddress(ErrorMessage = "Could not validate EmailAddress.")]
        public string EmailAddress { get; set; }

        [Required(ErrorMessage = "PasswordHash is required.")]
        [StringLength(256, ErrorMessage = "PasswordHash string length surpassed the limit of 256.")]
        public string PasswordHash { get; set; }

        [StringLength(20, ErrorMessage = "CellPhoneNumber string length surpassed the limit of 20.")]
        [RegularExpression(ValidationExtensions.PHONE_NUMBER_REGEXP, ErrorMessage = "CellPhoneNumber string can only contain numbers and spaces and the following characters: -")]
        public string CellPhoneNumber { get; set; }

        [StringLength(50, ErrorMessage = "ImageSrc must not exceed 50 chars.")]
        [RegularExpression(ValidationExtensions.IMG_PATH_REGEXP, ErrorMessage = "ImageSrc is invalid")]
        public string ImageSrc { get; set; }

        public int AccessFailedCount { get; set; }

        public bool IsLockedOut { get; set; }
    }
}