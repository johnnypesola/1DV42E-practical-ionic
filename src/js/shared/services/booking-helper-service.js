angular.module( 'BookingSystem.bookingHelperServices',

  // Dependencies
  []
)
  .factory( 'BookingHelper', [ () => {

    // Private functions

    function doBookingsCollide( sourceStartTime, sourceEndTime, targetStartTime, targetEndTime ) {

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
    }

    function setConcurrentBookingData( targetBooking, bookingsArray ) {

      const concurrentBookingsArray = [];
      let concurrentBookingIndex = 0;
      // let concurrentBookingsFalsePositiveCount = 0;
      // let i, j;

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

      // TODO: Figure out how many of the concurrent bookings are concurrent with eachother
      /*
      for ( i = 0; i < concurrentBookingsArray.length; i++ ){

        for ( j = 0; j < concurrentBookingsArray.length; j++ ){

          if (
            !doBookingsCollide(
              concurrentBookingsArray[i].StartTime,
              concurrentBookingsArray[i].EndTime,
              concurrentBookingsArray[j].StartTime,
              concurrentBookingsArray[j].EndTime
            )
          ){
            concurrentBookingsFalsePositiveCount++;
          }
        }
      }
      */

      // Set concurrent bookings count
      targetBooking.ConcurrentBookings = concurrentBookingsArray.length; // - concurrentBookingsFalsePositiveCount;

      console.log( concurrentBookingsFalsePositiveCount );

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
          return targetBooking.LocationBookingId === booking.LocationBookingId;
        });
      }

      // Get concurrent booking index
      targetBooking.ConcurrentBookingIndex = concurrentBookingIndex;

      // console.log( targetBooking );

    }

    // Public functions

    return {
      doBookingsCollide: doBookingsCollide,
      setConcurrentBookingData: setConcurrentBookingData
    };
  }]
);