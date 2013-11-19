'use strict';

describe('Controller: LeadersCtrl', function () {

  // load the controller's module
  beforeEach(module('iUtltimateApp'));

  var LeadersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LeadersCtrl = $controller('LeadersCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
