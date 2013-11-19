'use strict';

describe('Directive: dropFunction', function () {

  // load the directive's module
  beforeEach(module('iUtltimateApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<drop-function></drop-function>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the dropFunction directive');
  }));
});
