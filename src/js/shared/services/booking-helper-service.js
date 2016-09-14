angular.module( 'BookingSystem.bookingHelperServices',

  // Dependencies
  []
)
  .factory( 'BookingHelper', [ '$q', 'Booking', ( $q, Booking ) => {

    // Private functions

    const doBookingsCollide = function( sourceStartTime, sourceEndTime, targetStartTime, targetEndTime ) {

      // Convert to moment.js objects
      sourceStartTime = moment( sourceStartTime );
      sourceEndTime = moment( sourceEndTime );
      targetStartTime = moment( targetStartTime );
      targetEndTime = moment( targetEndTime );

      return (
        sourceStartTime.isBefore( targetEndTime ) && sourceEndTime.isAfter( targetEndTime ) ||
        sourceStartTime.isBefore( targetStartTime ) && sourceEndTime.isAfter( targetStartTime ) ||
        sourceStartTime.isSameOrAfter( targetStartTime ) && sourceEndTime.isSameOrBefore( targetEndTime )
      );
    };

    const setConcurrentBookingData = function( targetBooking, bookingsArray ) {

      const concurrentBookingsArray = [];
      let concurrentBookingIndex = 0;
      // let concurrentBookingsFalsePositiveCount = 0;
      let i;
      // let j;

      for ( i = 0; i < bookingsArray.length; i++ ){

        if (
            doBookingsCollide(
              targetBooking.StartTime,
              targetBooking.EndTime,
              bookingsArray[i].StartTime,
              bookingsArray[i].EndTime
            )
        ){

          concurrentBookingsArray.push( bookingsArray[i] );
        }
      }

      // Set concurrent bookings count
      targetBooking.ConcurrentBookings = concurrentBookingsArray.length; // - concurrentBookingsFalsePositiveCount;

      // Abort if no concurrent bookings were found
      if ( concurrentBookingsArray.length ) {

        // Sort bookings after StartTime
        concurrentBookingsArray.sort( ( bookingA, bookingB ) => {
          return (
            bookingA.StartTime >= bookingB.StartTime &&
            bookingA.EndTime <= bookingB.EndTime
          );
        });

        // Get concurrent booking index
        concurrentBookingIndex = concurrentBookingsArray.findIndex( ( booking ) => {
          return targetBooking.Id === booking.Id;
        });
      }

      // Get concurrent booking index
      targetBooking.ConcurrentBookingIndex = concurrentBookingIndex;
    };

    const getHoursForSelect = function(){

      const returnArray = [];

      for ( let i = 0; i <= 23; i++ ){
        returnArray.push( i );
      }

      return returnArray;
    };

    const getMinutesForSelect = function(){

      const returnArray = [];

      for ( let i = 0; i <= 59; i++ ){
        returnArray.push( i );
      }

      return returnArray;
    };

    const createBookingContainer = function( bookingInfoObj ){

      // Save booking
      return Booking.save(
        {
          BookingId: 0,
          Name: '',
          BookingTypeId: bookingInfoObj.BookingTypeId,
          CustomerId: bookingInfoObj.CustomerId,
          Provisional: 1,
          NumberOfPeople: bookingInfoObj.NumberOfPeople || 0,
          Discount: 0,
          CreatedByUserId: 1, //Temporary value, users not implemented
          ModifiedByUserId: 1, //Temporary value, users not implemented
          ResponsibleUserId: 1 //Temporary value, users not implemented
        }
      ).$promise;
    };

    // Public functions

    return {
      doBookingsCollide: doBookingsCollide,
      setConcurrentBookingData: setConcurrentBookingData,
      getHoursForSelect: getHoursForSelect,
      getMinutesForSelect: getMinutesForSelect,
      createBookingContainer: createBookingContainer
    };
  }]
);