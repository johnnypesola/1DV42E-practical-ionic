describe('module: BookingSystem.furnituring', function() {

  // Load app
  beforeEach(module('BookingSystem'));

  // Load modules
  beforeEach(module('BookingSystem.furnituring'));

  // Root variables
  var FurnituringListCtrl, FurnituringCreateCtrl, FurnituringEditCtrl;
  var testCurrentDateObj;
  var $scope;
  var $location;
  var $rootScope;

  // Mock booking service module
  beforeEach(function () {
    module(function($provide) {
      $provide.factory('Furnituring', function($q) {
        return {
          get : jasmine.createSpy('get').and.callFake(function() {

            // Generate a promise object for mocked return data.
            return TestHelper.addPromiseToObject(TestHelper.JSON.getFurnituring, $q);
          }),
          query : jasmine.createSpy('query').and.callFake(function() {

            // Generate a promise object for mocked return data.
            return TestHelper.addPromiseToObject(TestHelper.JSON.queryFurnituring, $q);
          }),
          save : jasmine.createSpy('save').and.callFake(function() {

            // Generate a promise object for mocked return data.
            return TestHelper.addPromiseToObject({}, $q);
          }),
          delete : jasmine.createSpy('delete').and.callFake(function() {

            // Generate a promise object for mocked return data.
            return TestHelper.addPromiseToObject({}, $q);
          })
        }
      });
    });
  });


  // Shared testing function. avoid DRY

  // Init root test variables
  beforeEach(inject(function($controller, _Furnituring_, _$location_, $rootScope) {
    $location = _$location_;
    $scope = $rootScope;

    FurnituringCreateCtrl = $controller('FurnituringCreateCtrl', {
      $scope: $scope,
      Furnituring: _Furnituring_,
      $rootScope: $rootScope
    });

  }));


  // Actual tests

  describe('FurnituringCreateCtrl controller', function(){

    it('should call history.back() and create a FlashMessage after successful Furnituring creation', inject(function($rootScope, $controller, _Furnituring_) {

      // Spy on existing controller method
      spyOn(history, 'back');

      // Mock scope variable
      $scope.furnituring = { Name : 'Test' };

      // Exec method to be tested
      $scope.saveFurnituring();

      // Check that furnituring was saved
      expect(_Furnituring_.save).toHaveBeenCalledWith({
        FurnituringId: 0,
        Name: 'Test'
      });

      $scope.$digest();

      // Check that FlashMessage exists
      expect($rootScope.FlashMessage).toBeDefined();

      console.log('here');

      // Check that page was redirected was called
      expect(history.back).toHaveBeenCalled();
    }));

    /*

    it('should create a FlashMessage after duplicate Furnituring creation', inject(function($rootScope, $controller, _Furnituring_, $q) {

      // Alter save to return unsuccessful response
      _Furnituring_.save = jasmine.createSpy('save').and.callFake(function() {

        // Generate a promise object for mocked return data.
        return TestHelper.addPromiseToObject({}, $q, '409', 'There is already a Furnituring with the given name.');
      });

      // Spy on existing controller method
      spyOn(history, 'back');

      // Mock scope variable
      $scope.furnituring = { Name : 'Test' };

      // Exec method to be tested
      $scope.save();

      $scope.$digest();

      // Check that FlashMessage exists
      expect($rootScope.FlashMessage).toBeDefined();

      // Check that FlashMessage exists
      expect($rootScope.FlashMessage.message).toEqual('Det finns redan en möblering som heter "Test". Två möbleringar kan inte heta lika.');

      // Check that redirection was NOT called
      expect(history.back).not.toHaveBeenCalled();
    }));

    it('should create a FlashMessage after unsuccessful Furnituring creation', inject(function($rootScope, $controller, _Furnituring_, $q) {

      // Alter save to return unsuccessful response
      _Furnituring_.save = jasmine.createSpy('save').and.callFake(function() {

        // Generate a promise object for mocked return data.
        return TestHelper.addPromiseToObject({}, $q, '500');
      });

      // Spy on existing controller method
      spyOn(history, 'back');

      // Mock scope variable
      $scope.furnituring = { Name : 'Test' };

      // Exec method to be tested
      $scope.save();

      $scope.$digest();

      // Check that FlashMessage exists
      expect($rootScope.FlashMessage).toBeDefined();

      // Check that FlashMessage exists
      expect($rootScope.FlashMessage.message).toEqual('Ett oväntat fel uppstod när möbleringen skulle sparas');

      // Check that redirection was NOT called
      expect(history.back).not.toHaveBeenCalled();
    }));

    // Tests END
     */

  });

});