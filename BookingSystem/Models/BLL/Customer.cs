using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace BookingSystem.Models
{
    public class Customer
    {
        [Required(ErrorMessage = "CustomerId is required.")]
        [Range(0, int.MaxValue, ErrorMessage = "CustomerId is out of range.")]
        public int CustomerId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Name string can only contain letters and spaces and the following characters: &_-")]
        [StringLength(50, ErrorMessage = "Name string length surpassed the limit of 50.")]
        public string Name { get; set; }


        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Address string can only contain letters and spaces and the following characters: &_-")]
        [StringLength(40, ErrorMessage = " Address string length surpassed the limit of 40.")]
        public string Address { get; set; }

        [StringLength(6, ErrorMessage = "PostNumber string length surpassed the limit of 6.")]
        [RegularExpression(ValidationExtensions.POST_NUMBER_REGEXP, ErrorMessage = "PostNumber must be in the following format: '123 41'")]
        public string PostNumber { get; set; }

        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "City string can only contain letters and spaces and the following characters: &_-")]
        [StringLength(30, ErrorMessage = "City string length surpassed the limit of  30.")]
        public string City { get; set; }

        [StringLength(50, ErrorMessage = "EmailAddress string length surpassed the limit of 50.")]
        [EmailAddress(ErrorMessage = "Could not validate EmailAddress.")]
        public string EmailAddress { get; set; }

        [StringLength(20, ErrorMessage = "PhoneNumber string length surpassed the limit of 20.")]
        [RegularExpression(ValidationExtensions.PHONE_NUMBER_REGEXP, ErrorMessage = "PhoneNumber string can only contain numbers and spaces and the following characters: -")]
        public string PhoneNumber { get; set; }

        [StringLength(20, ErrorMessage = "CellPhoneNumber string length surpassed the limit of 20.")]
        [RegularExpression(ValidationExtensions.PHONE_NUMBER_REGEXP, ErrorMessage = "CellPhoneNumber string can only contain numbers and spaces and the following characters: -")]
        public string CellPhoneNumber { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "ParentCustomerId is out of range.")]
        public int? ParentCustomerId { get; set; }

        [StringLength(50, ErrorMessage = "ParentCustomerName string length surpassed the limit of 50.")]
        public string ParentCustomerName { get; set; }

        [StringLength(50, ErrorMessage = "ImageSrc must not exceed 50 chars.")]
        [RegularExpression(ValidationExtensions.IMG_PATH_REGEXP, ErrorMessage = "ImageSrc is invalid")]
        public string ImageSrc { get; set; }

        [StringLength(200, ErrorMessage = "Notes string length surpassed the limit of 200.")]
        [RegularExpression(ValidationExtensions.TEXT_FIELD_REGEXP, ErrorMessage = "Notes string can only contain letters and spaces and the following characters: &_-.,@()/%")]
        public string Notes { get; set; }

        public int TotalBookings { get; set; }

        [DataType(DataType.Currency)]
        public decimal TotalBookingValue { get; set; }

        public int ChildCustomers { get; set; }
    }
}