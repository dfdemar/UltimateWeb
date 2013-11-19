'use strict';

describe('Directive: statTable', function () {

  // load the directive's module
  beforeEach(module('iUtltimateApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<stat-table></stat-table>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the statTable directive');
  }));
});
