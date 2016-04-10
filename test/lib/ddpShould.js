"use strict";
import DDP from '../../lib/ddp';

describe('ddp', function() {

  let validOptions;
  const endpoint = 'ws://localhost:3000/websocket';
  let server;

  before(function() {
    server = new SocketServer(endpoint);
  });

  beforeEach(function() {
      validOptions = {
        SocketConstructor: WebSocket,
        endpoint
      };
  });

  it('should throw an error if not passed a socketConstructor', function() {
    (function() {
      let ddp = new DDP({});
    }).should.throw(Error);
  });
  
  it('should throw an error given no endpoint', function() {
    (function() {
      let ddp = new DDP({
        SocketConstructor: WebSocket
      }); 
    }).should.throw(Error);
  });
  
  it('should start in the disconnected state', function() {
    let ddp = new DDP(validOptions);
    ddp.status.should.equal('disconnected');
  });

  it('should start with autoreconnect true given no autoReconnect parameter', function() {
    let ddp = new DDP(validOptions);
    ddp.autoReconnect.should.equal(true);
  });

  it('should start with autoreconnect false given autoReconnect parameter set to false', function() {
    validOptions.autoReconnect = false;
    let ddp = new DDP(validOptions);
    ddp.autoReconnect.should.equal(false);
  });

  it('should start with autoconnect true given no autoConnect parameter', function() {
    let ddp = new DDP(validOptions);
    ddp.autoConnect.should.equal(true);
  });

  it('should start with autoconnect false given autoReconnect parameter set to false', function() {
    validOptions.autoConnect = false;
    let ddp = new DDP(validOptions);
    ddp.autoConnect.should.equal(false);
  });



});
