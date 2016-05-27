'use strict';
( function(){

  // Shared functions
  const isValueEmpty = function( value ) {
    return angular.isUndefined( value ) || value === '' || value === null || value === undefined;
  };

  angular.module( 'BookingSystem.ngMinMaxDirectives',

    // Dependencies
    []
    )

    .directive( 'ngMin', () => {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function( scope, elem, attr, ctrl ) {

          scope.$watch( attr.ngMin, () => {
            ctrl.$setViewValue( ctrl.$viewValue );
          });

          const minValidator = function( value ) {
            const min = scope.$eval( attr.ngMin ) || 0;
            if ( !isValueEmpty( value ) && value < min ) {
              ctrl.$setValidity( 'ngMin', false );
              return undefined;
            }

            ctrl.$setValidity( 'ngMin', true );
            return value;
          };

          ctrl.$parsers.push( minValidator );
          ctrl.$formatters.push( minValidator );
        }
      };
    })

    .directive( 'ngMax', () => {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function ( scope, elem, attr, ctrl ) {

          scope.$watch( attr.ngMax, () => {
            ctrl.$setViewValue( ctrl.$viewValue );
          });
          const maxValidator = function ( value ) {
            const max = scope.$eval( attr.ngMax ) || Infinity;
            if ( !isValueEmpty( value ) && value > max ) {
              ctrl.$setValidity( 'ngMax', false );
              return undefined;
            }

            ctrl.$setValidity( 'ngMax', true );
            return value;
          };

          ctrl.$parsers.push( maxValidator );
          ctrl.$formatters.push( maxValidator );
        }
      };
    });
}()
);
