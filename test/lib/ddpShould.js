"use strict";
import DDP from '../../lib/ddp';

describe('ddp', function() {

  it('should throw an error if not passed a socketConstructor', function() {
    (function() {
      let ddp = new DDP({});
      ddp.status.should.equal("disconnected");
    }).should.throw(Error);
  });
});
