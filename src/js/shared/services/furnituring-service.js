/**
 * Created by jopes on 2015-04-12.
 */

  // Declare module
  angular.module( 'BookingSystem.furnituringServices',

    // Dependencies
    [
      'ngResource'
    ]
  )

    .factory( 'Furnituring', [ '$resource', 'API_URL', ( $resource, API_URL ) => {

      return $resource(
        API_URL + 'Furnituring/:furnituringId',
        {furnituringId: '@furnituringId'},
        {
          // Paginate
          queryPagination: {
            url: API_URL + 'Furnituring/paginate/:pageNum/:itemCount',
            method: 'GET',
            isArray: true,
            params: {
              pageNum: '@pageNum',
              itemCount: '@itemCount'
            }
          }
        }
      );
    }]
    )

    .factory( 'LocationFurnituring', ['$resource', 'API_URL', ( $resource, API_URL ) => {

      return $resource(
        API_URL + 'LocationFurnituring/:locationId',
        {locationId: '@locationId'}, //furnituringId: '@furnituringId'
        {
          // Override delete, needs 2 id:s. Backend is a relational database table.
          remove: {
            url: API_URL + 'LocationFurnituring/:locationId/:furnituringId',
            id: '@id',
            method: 'DELETE',
            isArray: false,
            params: {
              locationId: '@locationId',
              furnituringId: '@furnituringId'
            }
          },

          // Delete all furniturings for specific location
          removeForLocation: {
            url: API_URL + 'LocationFurnituring/:locationId',
            id: '@id',
            method: 'DELETE',
            isArray: false,
            params: {
              locationId: '@locationId'
            }
          },

          // Get location furniturings for location
          queryForLocation: {
            url: API_URL + 'LocationFurnituring/location/:locationId',
            id: '@id',
            method: 'GET',
            isArray: true,
            params: {
              locationId: '@locationId'
            }
          },

          // POST location furniturings for location
          saveForLocation: {
            url: API_URL + 'LocationFurnituring/location',
            id: '@id',
            method: 'POST',
            isArray: true
          }
        }
      );
    }]
    );
