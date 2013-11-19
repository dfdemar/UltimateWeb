'use strict';

describe('Controller: LinepageCtrl', function () {

  // load the controller's module
  beforeEach(module('iUtltimateApp'));

  var LinepageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LinepageCtrl = $controller('LinepageCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
