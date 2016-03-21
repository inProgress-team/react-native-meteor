var sinon = require('sinon');
var chai = require('chai');
var should = chai.should();
var mockWebSocket = require('mock-socket').WebSocket;
var mockServer = require('mock-socket').Server;

global.sinon    = sinon;
global.should   = should;
global.WebSocket = mockWebSocket;
global.SocketServer = mockServer;
