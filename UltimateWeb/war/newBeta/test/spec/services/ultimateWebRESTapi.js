'use strict';

describe('Service: Ultimatewebrestapi', function () {

  // load the service's module
  beforeEach(module('newBetaApp'));

  // instantiate service
  var Ultimatewebrestapi;
  beforeEach(inject(function (_Ultimatewebrestapi_) {
    Ultimatewebrestapi = _Ultimatewebrestapi_;
  }));

  it('should do something', function () {
    expect(!!Ultimatewebrestapi).toBe(true);
  });

});
