angular.module( 'BookingSystem.ngMaterialSettings',

  ['ngMaterial']
)

// Localization configuration for Angular Material ( Swedish localization. )
.config( ['$mdDateLocaleProvider', '$mdGestureProvider', ( $mdDateLocaleProvider, $mdGestureProvider ) => {

  $mdDateLocaleProvider.months = ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'];
  $mdDateLocaleProvider.shortMonths = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  $mdDateLocaleProvider.days = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag'];
  $mdDateLocaleProvider.shortDays = ['Sö', 'Må', 'Ti', 'On', 'To', 'Fr', 'Lö'];

  // Can change week display to start on Monday.
  $mdDateLocaleProvider.firstDayOfWeek = 1;

  // Example uses moment.js to parse and format dates.
  $mdDateLocaleProvider.parseDate = function( dateString ) {
    const m = moment( dateString, 'L', true );
    return m.isValid() ? m.toDate() : new Date( NaN );
  };
  $mdDateLocaleProvider.formatDate = function( date ) {
    return moment( date ).format( 'L' );
  };
  $mdDateLocaleProvider.monthHeaderFormatter = function( date ) {
    return $mdDateLocaleProvider.shortMonths[date.getMonth()] + ' ' + date.getFullYear();
  };
  // In addition to date display, date components also need localized messages
  // for aria-labels for screen-reader users.
  $mdDateLocaleProvider.weekNumberFormatter = function( weekNumber ) {
    return 'Vecka ' + weekNumber;
  };
  $mdDateLocaleProvider.msgCalendar = 'Kalender';
  $mdDateLocaleProvider.msgOpenCalendar = 'Öppna kalender';
}]
)

// Fix for double triggering of ng-click, caused by angular material design.
.config( ['$mdGestureProvider', ( $mdGestureProvider ) => {
  $mdGestureProvider.skipClickHijack();
}]
)

// Custom mdToast themes
.config( ['$mdThemingProvider', ( $mdThemingProvider ) => {
  $mdThemingProvider.theme( 'warn' );
}]
);

