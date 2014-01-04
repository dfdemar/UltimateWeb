'use strict';

describe('Directive: titleBar', function () {

  // load the directive's module
  beforeEach(module('beta2App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<title-bar></title-bar>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the titleBar directive');
  }));
});
