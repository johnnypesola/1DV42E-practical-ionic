'use strict';
( function(){

  angular.module( 'BookingSystem.imageShowOnLoadDirective',

    // Dependencies
    []
  )

    .directive( 'showOnLoad', () => {
      return {
        link: function( scope, element ) {
          element.on( 'load', () => {
            scope.$apply( () => {
              scope.imageVisible = true;
            });
          });
        }
      };
    });
}()
);
