'use strict';

describe('Service: filterMessage', function () {

  // load the service's module
  beforeEach(module('iUtltimateApp'));

  // instantiate service
  var filterMessage;
  beforeEach(inject(function (_filterMessage_) {
    filterMessage = _filterMessage_;
  }));

  it('should do something', function () {
    expect(!!filterMessage).toBe(true);
  });

});
