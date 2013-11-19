'use strict';

describe('Controller: PlayerpageCtrl', function () {

  // load the controller's module
  beforeEach(module('iUtltimateApp'));

  var PlayerpageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PlayerpageCtrl = $controller('PlayerpageCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
