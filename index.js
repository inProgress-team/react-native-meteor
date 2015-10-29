var DDP = require("ddp.js");

var ddp;

var onCallbacks = [];
var callCallbacksOn = function (eventName) {
  ddp.on(eventName, function (message) {
    var callbacks = onCallbacks.filter(function (callback) {
      if(callback.eventName == eventName) return true;
      return false;
    }).map(function (callback) {
      return callback.callback;
    });
    callbacks.forEach(function (callback) {
      callback(message);
    });
  });
}

module.exports = {
  connect: function (endpoint) {
    ddp = new DDP({
      endpoint: endpoint,
      SocketConstructor: WebSocket
    });

    callCallbacksOn("connected");
  },
  on: function (event, callback) {
    onCallbacks.push({
      eventName: event,
      callback: callback
    });
  },
  unsuscribe: function (id) {
    ddp.unsub(id);
  },
  suscribe: function (id, params, change) {
    if(change===undefined) {
      change = params;
      params = [];
    }
    var subId = ddp.sub(id, params);
    var doneLoading = false;
    var items = [];

    ddp.on("added", function (message) {
      if(message.collection == id) {
        message.fields.id = message.id;
        items.push(message.fields);
        if(doneLoading) {
          change(items);
        }
      }
    });

    ddp.on("changed", function (message) {
      if(message.collection == id) {
        items = items.map(function (item) {
          if(item.id==message.id) return {
            ...item,
            ...message.fields
          }
          return item;
        });
        change(items);
      }
    });
    ddp.on("removed", function (message) {
      if(message.collection == id) {
        items = items.filter(function (item) {
          if(item.id==message.id) return false;
          return true;
        });
        change(items);
      }
    });
    ddp.on("nosub", function (message) {
      doneLoading = true;
      change(items);
    });
  }
};
