'use strict';

describe('Filter: percent', function () {

  // load the filter's module
  beforeEach(module('iUtltimateApp'));

  // initialize a new instance of the filter before each test
  var percent;
  beforeEach(inject(function ($filter) {
    percent = $filter('percent');
  }));

  it('should return the input prefixed with "percent filter:"', function () {
    var text = 'angularjs';
    expect(percent(text)).toBe('percent filter: ' + text);
  });

});
