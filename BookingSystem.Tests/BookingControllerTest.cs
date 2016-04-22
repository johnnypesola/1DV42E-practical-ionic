using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using BookingSystem.Models;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using BookingSystem.Controllers;
using BookingSystem;
using System.Web.Http;
using System.Web.Http.Results;
using System.Linq;

namespace BookingSystem.Tests
{


    //[TestClass]
    //public class BookingControllerTest
    //{
    //    // Get specific booking
    //    [TestMethod]
    //    public void GetBookingThatExists()
    //    {

    //        // Create controller
    //        BookingController bookingController =  new BookingController(new MockBookingService());

    //        // Get all bookings
    //        //var bookings = bookingController.Get();

    //        // Act
    //        IHttpActionResult actionResult = bookingController.Get(10);
    //        var bookingResult = actionResult as OkNegotiatedContentResult<Booking>;

    //        // Assert
    //        Assert.IsNotNull(bookingResult);
    //        Assert.IsNotNull(bookingResult.Content);
    //        Assert.AreEqual(10, bookingResult.Content.BookingId);
    //    }

    //    // Get specific non existing booking
    //    [TestMethod]
    //    public void GetBookingThatDoesNotExists()
    //    {

    //        // Create controller
    //        BookingController bookingController =  new BookingController(new MockBookingService());

    //        // Act
    //        IHttpActionResult actionResult = bookingController.Get(11);

    //        // Assert
    //        Assert.IsInstanceOfType(actionResult, typeof(NotFoundResult));
    //    }

    //    [TestMethod]
    //    public void DeleteBookingThatExists()
    //    {

    //        // Create controller
    //        BookingController bookingController = new BookingController(new MockBookingService());

    //        // Act
    //        IHttpActionResult actionResult = bookingController.Delete(10);

    //        // Assert
    //        Assert.IsInstanceOfType(actionResult, typeof(OkResult));
    //    }

    //    [TestMethod]
    //    public void DeleteBookingThatDoesNotExists()
    //    {

    //        // Create controller
    //        BookingController bookingController = new BookingController(new MockBookingService());

    //        // Act
    //        IHttpActionResult actionResult = bookingController.Delete(11);

    //        // Assert
    //        Assert.IsInstanceOfType(actionResult, typeof(NotFoundResult));
    //    }

    //    /*
         
    //     [TestMethod]
    //    public void PostNewBooking()
    //    {
    //        // Arrange
    //        var mockRepository = new Mock<IProductRepository>();
    //        var controller = new Products2Controller(mockRepository.Object);

    //        // Act
    //        IHttpActionResult actionResult = controller.Post(new Product { Id = 10, Name = "Product1" });
    //        var createdResult = actionResult as CreatedAtRouteNegotiatedContentResult<Product>;

    //        // Assert
    //        Assert.IsNotNull(createdResult);
    //        Assert.AreEqual("DefaultApi", createdResult.RouteName);
    //        Assert.AreEqual(10, createdResult.RouteValues["id"]);
    //    }
    //     * 
    //     [TestMethod]
    //    public void PutBooking()
    //    {
    //        // Arrange
    //        var mockRepository = new Mock<IProductRepository>();
    //        var controller = new Products2Controller(mockRepository.Object);

    //        // Act
    //        IHttpActionResult actionResult = controller.Put(new Product { Id = 10, Name = "Product" });
    //        var contentResult = actionResult as NegotiatedContentResult<Product>;

    //        // Assert
    //        Assert.IsNotNull(contentResult);
    //        Assert.AreEqual(HttpStatusCode.Accepted, contentResult.StatusCode);
    //        Assert.IsNotNull(contentResult.Content);
    //        Assert.AreEqual(10, contentResult.Content.Id);
    //    }
    //     */
    //}

    //// Define mock service
    //class MockBookingService : IBookingService
    //{
    //    public Booking Get(Booking bookingObj)
    //    {
    //        return new Booking
    //        {
    //            BookingId = bookingObj.BookingId,
    //            Name = "hej",
    //            BookingTypeId = 10,
    //            CustomerId = 5,
    //            Provisional = true,
    //            NumberOfPeople = 100,
    //            Discount = 0,
    //            Notes = "some notes",
    //            CreatedByUserId = 10,
    //            ModifiedByUserId = 10,
    //            ResponsibleUserId = 5,
    //            CustomerName = "Some customer",
    //            MaxPeople = 100,
    //            CalculatedBookingPrice = 200,
    //            TotalBookingValue = 1999,
    //            PayMethodId = 1
    //        };
    //    }

    //    public Booking Get(int id)
    //    {
    //        if(id == 10)
    //        {
    //            return new Booking
    //            {
    //                BookingId = id,
    //                Name = "hej",
    //                BookingTypeId = 10,
    //                CustomerId = 5,
    //                Provisional = true,
    //                NumberOfPeople = 100,
    //                Discount = 0,
    //                Notes = "some notes",
    //                CreatedByUserId = 10,
    //                ModifiedByUserId = 10,
    //                ResponsibleUserId = 5,
    //                CustomerName = "Some customer",
    //                MaxPeople = 100,
    //                CalculatedBookingPrice = 200,
    //                TotalBookingValue = 1999,
    //                PayMethodId = 1
    //            };
    //        }
    //        else
    //        {
    //            return null;
    //        }
    //    }

    //    public IEnumerable<Booking> Get()
    //    {
    //        List<Booking> returnList = new List<Booking>();

    //        returnList.Add(
    //            new Booking
    //            {
    //                BookingId = 10,
    //                Name = "hej",
    //                BookingTypeId = 10,
    //                CustomerId = 5,
    //                Provisional = true,
    //                NumberOfPeople = 100,
    //                Discount = 0,
    //                Notes = "some notes",
    //                CreatedByUserId = 10,
    //                ModifiedByUserId = 10,
    //                ResponsibleUserId = 5,
    //                CustomerName = "Some customer",
    //                MaxPeople = 100,
    //                CalculatedBookingPrice = 200,
    //                TotalBookingValue = 1999,
    //                PayMethodId = 1
    //            });

    //        returnList.Add(
    //            new Booking
    //            {
    //                BookingId = 15,
    //                Name = "hoj",
    //                BookingTypeId = 5,
    //                CustomerId = 1,
    //                Provisional = false,
    //                NumberOfPeople = 50,
    //                Discount = 10,
    //                Notes = "some more notes",
    //                CreatedByUserId = 1,
    //                ModifiedByUserId = 1,
    //                ResponsibleUserId = 10,
    //                CustomerName = "Another customer",
    //                MaxPeople = 150,
    //                CalculatedBookingPrice = 250,
    //                TotalBookingValue = 2999,
    //                PayMethodId = 2
    //            });

    //        return returnList;
    //    }

    //    public void Save(Booking booking)
    //    {
    //        booking.BookingId = 56;
    //    }

    //    public void Delete(Booking booking)
    //    {
    //        this.Delete(booking.BookingId);
    //    }

    //    public void Delete(int id)
    //    {
    //        if (id != 10)
    //        {
    //            throw new DataBaseEntryNotFoundException("Booking does not exist");
    //        }
    //    }

    //    public IQueryable<BookingContainer> GetForPeriod(DateTime startTime, DateTime endTime)
    //    {
    //        List<BookingContainer> bookings = new List<BookingContainer>();

    //        bookings.Add(new BookingContainer
    //        {
    //            BookingId = 4,
    //            BookingName = "Testbookingname",
    //            CustomerId = 4,
    //            NumberOfPeople = 100,
    //            Provisional = true,
    //            CustomerName = "Test customer name",
    //            TypeName = "Test type name",
    //            Type = "Test type",
    //            TypeId = 1,
    //            Count = 10,
    //            StartTime = new DateTime(),
    //            EndTime = new DateTime()
    //        });

    //        return bookings.AsQueryable();
    //    }

    //    public IEnumerable<CalendarBookingDay> CheckDaysForPeriod(DateTime startTime, DateTime endTime, string type)
    //    {
    //        List<CalendarBookingDay> bookings = new List<CalendarBookingDay>();

    //        bookings.Add(new CalendarBookingDay{
    //            StartTime = new DateTime(),
    //            EndTime = new DateTime(),
    //        });

    //        return bookings.AsEnumerable();
    //    }

    //    public System.Linq.IQueryable<Booking> GetPageWise(string sortColumns, int maximumRows, int startRowIndex)
    //    {
    //        throw new NotImplementedException();
    //    }
    //}

}
