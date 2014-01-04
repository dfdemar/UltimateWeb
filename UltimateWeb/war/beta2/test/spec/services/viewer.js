'use strict';

describe('Service: Viewer', function () {

  // load the service's module
  beforeEach(module('beta2App'));

  // instantiate service
  var Viewer;
  beforeEach(inject(function (_Viewer_) {
    Viewer = _Viewer_;
  }));

  it('should do something', function () {
    expect(!!Viewer).toBe(true);
  });

});
