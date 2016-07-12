angular.module( 'BookingSystem.constants',

  []
)
  // .constant( 'API_URL', 'http://bokning.vvfors.se/api/' )
  .constant( 'API_URL', 'http://localhost:56147/api/' )
  .constant( 'API_LOGIN_URL', 'http://localhost:56147/Token' )
  .constant( 'API_LOGOUT_URL', 'http://localhost:56147/api/Account/Logout' )
  .constant( 'API_IMG_PATH_URL', 'http://bokning.vvfors.se/' )
  .constant( 'UPLOAD_IMG_MAX_WIDTH', '300' )
  .constant( 'UPLOAD_IMG_MAX_HEIGHT', '300' )
  .constant( 'PHOTO_MISSING_SRC', 'img/photo_missing.svg' )
  .constant( 'DEFAULT_MAP_ZOOM', 5 )
  .constant( 'DEFAULT_LATITUDE', 67.2792 )
  .constant( 'DEFAULT_LONGITUDE', 4.2361 )
  .constant( 'MODAL_ANIMATION', 'slide-in-up' )
  .constant( 'DATA_SYNC_INTERVAL_TIME', 60000 * 5 ) // Every 5 minutes
  .constant( 'DEFAULT_CALENDAR_ZOOM', 2 )
  .constant( 'BOOKING_TYPES', {
    booking : 'booking',
    location : 'location-booking',
    resource : 'resource-booking',
    meal : 'meal-booking'
  });