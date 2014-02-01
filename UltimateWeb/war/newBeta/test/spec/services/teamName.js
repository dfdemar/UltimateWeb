'use strict';

describe('Service: Teamname', function () {

  // load the service's module
  beforeEach(module('newBetaApp'));

  // instantiate service
  var Teamname;
  beforeEach(inject(function (_Teamname_) {
    Teamname = _Teamname_;
  }));

  it('should do something', function () {
    expect(!!Teamname).toBe(true);
  });

});
