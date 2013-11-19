'use strict';

describe('Service: statHelpers', function () {

  // load the service's module
  beforeEach(module('iUtltimateApp'));

  // instantiate service
  var statHelpers;
  beforeEach(inject(function (_statHelpers_) {
    statHelpers = _statHelpers_;
  }));

  it('should do something', function () {
    expect(!!statHelpers).toBe(true);
  });

});
