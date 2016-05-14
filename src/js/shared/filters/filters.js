angular.module( 'BookingSystem.filters',

  // Dependencies
  []
  )
  .filter( 'zpad', [ () => {

    return function( input, n ) {
      if ( input === undefined ) {
        input = '';
      }

      if ( input.length >= n ) {
        return input;
      }

      const zeros = '0'.repeat( n );
      return ( zeros + input ).slice( -1 * n );
    };
  }]
);