'use strict';

describe('Controller: LineCtrl', function () {

  // load the controller's module
  beforeEach(module('beta2App'));

  var LineCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LineCtrl = $controller('LineCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
