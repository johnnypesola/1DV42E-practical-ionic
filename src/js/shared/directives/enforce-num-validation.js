// Declare module
angular.module( 'BookingSystem.enforceNumValidationDirective',

  // Dependencies
  [
  ]
)

.directive( 'enforceNumValidation', () => {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    link: function( scope, element, attr ) {
      element.bind( 'change', () => {

        const parseIntRadix = 10;
        const currentValue = element.val();
        const regEx = attr.pattern + '/g';
        const minValue = parseInt( attr.min, parseIntRadix );
        const maxValue = parseInt( attr.max, parseIntRadix );
        let newValue = 0;

        // Enforce regexp
        newValue = parseInt( currentValue.replace( regEx, '' ), parseIntRadix );

        if ( newValue < minValue ) {
          newValue = minValue;

        } else if ( newValue > maxValue ) {
          newValue = maxValue;

        } else if ( isNaN( newValue ) ) {
          newValue = minValue;
        }

        // Assign new value
        scope.ngModel = newValue;

        scope.$apply();
      });
    }
  };
});