'use strict';

describe('Controller: GamespageCtrl', function () {

  // load the controller's module
  beforeEach(module('iUtltimateApp'));

  var GamespageCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GamespageCtrl = $controller('GamespageCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
