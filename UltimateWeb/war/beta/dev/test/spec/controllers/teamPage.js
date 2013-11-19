'use strict';

describe('Controller: TeampageCtrl', function () {

  // load the controller's module
  beforeEach(module('iUtltimateApp'));

  var TeampageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TeampageCtrl = $controller('TeampageCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
