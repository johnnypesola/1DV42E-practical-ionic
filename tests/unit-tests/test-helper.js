/**
 * Created by jopes on 2015-05-01.
 */

// Create Namespaces
TestHelper = {};
TestHelper.JSON = {};


// Method: Generate a promise object for mocked return data.
TestHelper.addPromiseToObject = function(dataObj, q, mode, message) {
  var deferred, returnValue;

  mode = mode || 'success';
  message = message || '';

  deferred = q.defer();

  if(mode === 'success'){

    deferred.resolve(dataObj);
    returnValue = dataObj;
    returnValue.$promise = deferred.promise;
  }
  else {

    deferred.reject({status: mode, data: {Message: message}});
    returnValue = dataObj;
    returnValue.$promise = deferred.promise;
  }

  return returnValue
};

TestHelper.fakeHttpResponse = function(dataObj) {

  var returnValue;

  returnValue = dataObj;

  returnValue.success = function(callBack){

    callBack();

    return returnValue;
  };

  returnValue.then = function(callBack){

    callBack();

    return returnValue;
  };

  returnValue.error = function(callBack){

    callBack();

    return returnValue;
  };

  return returnValue;
};

// Test fixtures

// Bookings
TestHelper.JSON.getBookings = {"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0};
TestHelper.JSON.queryBookings = [{"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":10,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":26.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":29,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":5.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":58,"Name":"","BookingTypeId":0,"CustomerId":9,"Provisional":false,"NumberOfPeople":123,"Discount":0.00,"Notes":"En anteckning","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Kajsa Anka","MaxPeople":0,"CalculatedBookingPrice":2.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":60,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":300,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":23.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":61,"Name":"","BookingTypeId":0,"CustomerId":3,"Provisional":false,"NumberOfPeople":20,"Discount":0.00,"Notes":"hej","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Fagersta kommun","MaxPeople":0,"CalculatedBookingPrice":98.0,"TotalBookingValue":0.0,"PayMethodId":0}];
TestHelper.JSON.queryMoreForPeriodBookings = [{"StartTime":"2015-04-01T00:00:00","EndTime":"2015-04-01T00:00:00","Type":"location"}];
TestHelper.JSON.queryLessForPeriodBookings = [{"StartTime":"2015-01-01T00:00:00","EndTime":"2015-01-01T23:00:00","Type":"resource"},{"StartTime":"2015-01-02T00:00:00","EndTime":"2015-01-02T23:00:00","Type":"resource"},{"StartTime":"2015-04-01T00:00:00","EndTime":"2015-04-01T00:00:00","Type":"location"},{"StartTime":"2015-10-01T00:00:00","EndTime":"2015-10-01T00:00:00","Type":"meal"}];
TestHelper.JSON.queryDayBookings = [{"BookingId":7,"BookingName":"","CustomerId":1,"NumberOfPeople":10,"Provisional":false,"CustomerName":"Atlas Copco","TypeName":"Whiteboard","Type":"Resource","TypeId":3,"Count":5,"StartTime":"2015-01-01T00:00:00","EndTime":"2015-01-01T23:00:00"}];

TestHelper.JSON.createBooking = {"BookingId": 0,"Name": "Testbooking","CustomerId": 1,"NumberOfPeople": 10,"Provisional": false,Discount: 0.5,Notes: "Testnotes",BookingTypeId: 2, CreatedByUserId: 1, ModifiedByUserId: 1, ResponsibleUserId: 1 };

TestHelper.JSON.countEmpty = {count: 3};

// Location booking
TestHelper.JSON.createBookingForLocation = { BookingId : 0, Name : 'Testbooking', BookingTypeId : 2, CustomerId : 1, Provisional : false, NumberOfPeople : 16, Discount : 0, CreatedByUserId : 1, ModifiedByUserId : 1, ResponsibleUserId : 1 };
TestHelper.JSON.getLocationBooking = {"LocationBookingId":21,"BookingId":85,"NumberOfPeople":16,"StartTime":"2015-05-25T22:00:00","EndTime":"2015-05-25T23:59:00","BookingName":null,"Provisional":false,"LocationId":21,"LocationName":"Bergsvillan(huset)","LocationImageSrc":"Content/upload/img/location/21.jpg","FurnituringId":16,"FurnituringName":"Vardagsrum","MaxPeople":16,"MinutesMarginAfterBooking":0,"CalculatedBookingPrice":0.40};
TestHelper.JSON.queryLocationBooking = [{"LocationBookingId":21,"BookingId":85,"NumberOfPeople":16,"StartTime":"2015-05-25T22:00:00","EndTime":"2015-05-25T23:59:00","BookingName":"Kalle Ankas bokning","Provisional":true,"LocationId":21,"LocationName":"Bergsvillan(huset)","LocationImageSrc":"Content/upload/img/location/21.jpg","FurnituringId":16,"FurnituringName":"Vardagsrum","MaxPeople":16,"MinutesMarginAfterBooking":10,"CalculatedBookingPrice":0.40},{"LocationBookingId":14,"BookingId":83,"NumberOfPeople":5,"StartTime":"2015-05-26T06:00:00","EndTime":"2015-05-26T07:00:00","BookingName":"Namnet","Provisional":false,"LocationId":45,"LocationName":"Pengarbingen","LocationImageSrc":"","FurnituringId":1,"FurnituringName":"Rundmöblering","MaxPeople":10,"MinutesMarginAfterBooking":0,"CalculatedBookingPrice":20.00},{"LocationBookingId":15,"BookingId":83,"NumberOfPeople":5,"StartTime":"2015-05-26T08:00:00","EndTime":"2015-05-26T09:00:00","BookingName":"Namnet","Provisional":false,"LocationId":45,"LocationName":"Pengarbingen","LocationImageSrc":"","FurnituringId":1,"FurnituringName":"Rundmöblering","MaxPeople":10,"MinutesMarginAfterBooking":0,"CalculatedBookingPrice":20.00},{"LocationBookingId":12,"BookingId":82,"NumberOfPeople":5,"StartTime":"2015-05-26T08:00:00","EndTime":"2015-05-26T16:00:00","BookingName":"","Provisional":true,"LocationId":24,"LocationName":"Brukscafét","LocationImageSrc":"","FurnituringId":1,"FurnituringName":"Rundmöblering","MaxPeople":6,"MinutesMarginAfterBooking":0,"CalculatedBookingPrice":4000.00}];
TestHelper.JSON.createLocationBooking = { LocationBookingId : 0, BookingId : 85, NumberOfPeople : 16, StartTime : '2015-05-25T22:00:00', EndTime : '2015-05-25T23:59:00', LocationId : 21, SelectedFurnituring : { FurnituringId : 2 } };
TestHelper.JSON.createdLocationBooking = { LocationBookingId : 0, BookingId : 85, FurnituringId : 2, StartTime : '2015-05-05T10:00:00+02:00', EndTime : '2015-05-05T10:30:00+02:00', LocationId : 21, NumberOfPeople : 16 };


// BookingType
TestHelper.JSON.getBookingType = {"BookingTypeId":0,"Name":"(Ingen särskild)","HasLocation":false,"MinutesMarginBeforeBooking":0,"MinutesMarginAfterBooking":0,"BookingTypeCount":6};
TestHelper.JSON.queryBookingType = [{"BookingTypeId":0,"Name":"(Ingen särskild)","HasLocation":false,"MinutesMarginBeforeBooking":0,"MinutesMarginAfterBooking":0,"BookingTypeCount":6},{"BookingTypeId":9,"Name":"Begravning","HasLocation":true,"MinutesMarginBeforeBooking":0,"MinutesMarginAfterBooking":0,"BookingTypeCount":4},{"BookingTypeId":12,"Name":"hej hopp","HasLocation":true,"MinutesMarginBeforeBooking":0,"MinutesMarginAfterBooking":0,"BookingTypeCount":0},{"BookingTypeId":13,"Name":"hej hoppa","HasLocation":true,"MinutesMarginBeforeBooking":0,"MinutesMarginAfterBooking":0,"BookingTypeCount":0},{"BookingTypeId":11,"Name":"Konferensbokning","HasLocation":true,"MinutesMarginBeforeBooking":10,"MinutesMarginAfterBooking":10,"BookingTypeCount":0},{"BookingTypeId":14,"Name":"testbokningstyp","HasLocation":false,"MinutesMarginBeforeBooking":10,"MinutesMarginAfterBooking":20,"BookingTypeCount":0}];

TestHelper.JSON.createBookingType = {BookingTypeId: 0,Name: "Test booking type",HasLocation: false,MinutesMarginBeforeBooking: 9,MinutesMarginAfterBooking: 10};

// Furnituring
TestHelper.JSON.getFurnituring = {"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0};
TestHelper.JSON.queryFurnituring = [{"BookingId":7,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":1.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":10,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":26.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":29,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":10,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":5.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":58,"Name":"","BookingTypeId":0,"CustomerId":9,"Provisional":false,"NumberOfPeople":123,"Discount":0.00,"Notes":"En anteckning","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Kajsa Anka","MaxPeople":0,"CalculatedBookingPrice":2.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":60,"Name":"","BookingTypeId":0,"CustomerId":1,"Provisional":false,"NumberOfPeople":300,"Discount":0.00,"Notes":"","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Atlas Copco","MaxPeople":0,"CalculatedBookingPrice":23.0,"TotalBookingValue":0.0,"PayMethodId":0},{"BookingId":61,"Name":"","BookingTypeId":0,"CustomerId":3,"Provisional":false,"NumberOfPeople":20,"Discount":0.00,"Notes":"hej","CreatedByUserId":0,"ModifiedByUserId":0,"ResponsibleUserId":0,"CustomerName":"Fagersta kommun","MaxPeople":0,"CalculatedBookingPrice":98.0,"TotalBookingValue":0.0,"PayMethodId":0}];

// Location
TestHelper.JSON.getLocation = {"LocationId":21,"Name":"Bergsvillan","MaxPeople":50,"GPSLatitude":59.990940951137354,"GPSLongitude":15.807547867298126,"ImageSrc":"Content/upload/img/location/21.jpg","BookingPricePerHour":2000.00,"MinutesMarginAfterBooking":0,"TotalBookings":1,"TotalBookingValue":0.0};
TestHelper.JSON.queryLocation = [{"LocationId":21,"Name":"Bergsvillan","MaxPeople":50,"GPSLatitude":59.990940951137354,"GPSLongitude":15.807547867298126,"ImageSrc":"Content/upload/img/location/21.jpg","BookingPricePerHour":2000.00,"MinutesMarginAfterBooking":0,"TotalBookings":1,"TotalBookingValue":0.0},{"LocationId":24,"Name":"Brukscafét","MaxPeople":10,"GPSLatitude":60.005199064712158,"GPSLongitude":15.792786329984663,"ImageSrc":"","BookingPricePerHour":500.00,"MinutesMarginAfterBooking":0,"TotalBookings":0,"TotalBookingValue":0.0}];
TestHelper.JSON.queryForLocation = [{"LocationId":21,"FurnituringId":19,"MaxPeople":0,"LocationName":"Bergsvillan","FurnituringName":"Ommöbleringar"}];

// Location Furnituring
TestHelper.JSON.getLocationFurnituring = [{"LocationId":21,"FurnituringId":1,"MaxPeople":1600,"LocationName":"Bergsvillan(huset)","FurnituringName":"Rundmöblering"},{"LocationId":21,"FurnituringId":16,"MaxPeople":1888,"LocationName":"Bergsvillan(huset)","FurnituringName":"Vardagsrum"}]
TestHelper.JSON.queryLocationFurnituring = [{"LocationId":21,"FurnituringId":1,"MaxPeople":1600,"LocationName":"Bergsvillan(huset)","FurnituringName":"Rundmöblering"},{"LocationId":21,"FurnituringId":16,"MaxPeople":1888,"LocationName":"Bergsvillan(huset)","FurnituringName":"Vardagsrum"},{"LocationId":24,"FurnituringId":1,"MaxPeople":6,"LocationName":"Brukscafét","FurnituringName":"Rundmöblering"},{"LocationId":24,"FurnituringId":16,"MaxPeople":5,"LocationName":"Brukscafét","FurnituringName":"Vardagsrum"},{"LocationId":41,"FurnituringId":1,"MaxPeople":2,"LocationName":"123456","FurnituringName":"Rundmöblering"},{"LocationId":41,"FurnituringId":11,"MaxPeople":11,"LocationName":"123456","FurnituringName":"Utan möblering"},{"LocationId":41,"FurnituringId":19,"MaxPeople":6,"LocationName":"123456","FurnituringName":"Ommöbleringar"},{"LocationId":45,"FurnituringId":1,"MaxPeople":10,"LocationName":"Pengarbingen","FurnituringName":"Rundmöblering"},{"LocationId":45,"FurnituringId":11,"MaxPeople":10,"LocationName":"Pengarbingen","FurnituringName":"Utan möblering"},{"LocationId":45,"FurnituringId":16,"MaxPeople":5,"LocationName":"Pengarbingen","FurnituringName":"Vardagsrum"},{"LocationId":45,"FurnituringId":19,"MaxPeople":4,"LocationName":"Pengarbingen","FurnituringName":"Ommöbleringar"},{"LocationId":49,"FurnituringId":1,"MaxPeople":15,"LocationName":"hejhopp","FurnituringName":"Rundmöblering"},{"LocationId":49,"FurnituringId":19,"MaxPeople":17,"LocationName":"hejhopp","FurnituringName":"Ommöbleringar"}];

// Customer
TestHelper.JSON.getCustomer = {"CustomerId":1,"Name":"Atlas Copco","Address":null,"PostNumber":null,"City":"FAGERSTA","EmailAddress":null,"PhoneNumber":null,"CellPhoneNumber":null,"ParentCustomerId":0,"ParentCustomerName":"","Notes":null,"TotalBookings":0,"TotalBookingValue":0.0,"ChildCustomers":0};
TestHelper.JSON.queryCustomer = [{"CustomerId":1,"Name":"Atlas Copco","Address":null,"PostNumber":null,"City":"FAGERSTA","EmailAddress":null,"PhoneNumber":null,"CellPhoneNumber":null,"ParentCustomerId":0,"ParentCustomerName":"","Notes":null,"TotalBookings":0,"TotalBookingValue":0.0,"ChildCustomers":0},{"CustomerId":16,"Name":"Del av Atlas Copco","Address":null,"PostNumber":null,"City":"FAGERSTA","EmailAddress":null,"PhoneNumber":null,"CellPhoneNumber":null,"ParentCustomerId":1,"ParentCustomerName":"Atlas Copco","Notes":null,"TotalBookings":0,"TotalBookingValue":0.0,"ChildCustomers":0},{"CustomerId":4,"Name":"Ett namn","Address":null,"PostNumber":null,"City":"FAGERSTA","EmailAddress":null,"PhoneNumber":null,"CellPhoneNumber":null,"ParentCustomerId":0,"ParentCustomerName":"","Notes":null,"TotalBookings":0,"TotalBookingValue":0.0,"ChildCustomers":0}];

// Resource
TestHelper.JSON.getResource = {"ResourceId":4,"Name":"Testresursen","Count":10,"BookingPricePerHour":10.00,"MinutesMarginAfterBooking":0,"WeekEndCount":10,"TotalBookings":0,"TotalBookingValue":0.0};
TestHelper.JSON.queryResource = [{"ResourceId":4,"Name":"Testresursen","Count":10,"BookingPricePerHour":10.00,"MinutesMarginAfterBooking":0,"WeekEndCount":10,"TotalBookings":0,"TotalBookingValue":0.0},{"ResourceId":5,"Name":"Testresursen5","Count":10,"BookingPricePerHour":10.00,"MinutesMarginAfterBooking":0,"WeekEndCount":10,"TotalBookings":0,"TotalBookingValue":0.0},{"ResourceId":2,"Name":"Vaktmästare","Count":2,"BookingPricePerHour":1000.00,"MinutesMarginAfterBooking":20,"WeekEndCount":0,"TotalBookings":0,"TotalBookingValue":0.0},{"ResourceId":3,"Name":"Whiteboard","Count":10,"BookingPricePerHour":100.00,"MinutesMarginAfterBooking":15,"WeekEndCount":0,"TotalBookings":1,"TotalBookingValue":0.0}];

// Mock menu
TestHelper.JSON.MockedMenu = [
  {
    title: "Start",
    submenus: [
      {
        title: "Startsidan",
        location: "#/start"
      }
    ]
  },
  {
    title: "Kunder",
    location: "#/kunder/lista"
  }
];