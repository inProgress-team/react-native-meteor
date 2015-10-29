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
};



var subscriptions = [];


module.exports = {
  on: function (event, callback) {
    onCallbacks.push({
      eventName: event,
      callback: callback
    });
  },
  unsuscribe: function (id) {
    //unsubs.push(id);
    ddp.unsub(id);
    subscriptions = subscriptions.map(function (sub) {
      if(sub.id == id) {
        sub.removed = true;
      }
      return sub
    });
  },
  suscribe: function (name, collectionName, params, callback) {
    if(typeof collectionName != 'string') {
      params = collectionName;
      callback = params;
      collectionName = name;
    }
    if(callback===undefined) {
      callback = params;
      params = [];
    }
    var subId = ddp.sub(name, params);

    subscriptions.push({
      id: subId,
      collectionName: collectionName,
      name: name,
      callback: callback,
      ready: false,
      items: []
    });

    return subId;
  },

  connect: function (endpoint) {
    ddp = new DDP({
      endpoint: endpoint,
      SocketConstructor: WebSocket
    });
    callCallbacksOn("connected");

    ddp.on("added", function (message) {

      subscriptions = subscriptions.map(function (sub) {
        if(sub.collectionName == message.collection) {
          message.fields.id = message.id;
          sub.items.push(message.fields);
          if(sub.ready) {
            sub.callback(sub.items);
          }
        }
        return sub;
      })
    });

    ddp.on("ready", function (message) {
      subscriptions = subscriptions.map(function (sub) {
        if(sub.id == message.subs[0]) {
          sub.ready = true;
          sub.callback(sub.items);
        }
        return sub;
      });
    });

    ddp.on("nosub", function (message) {
      console.log('NO SUB');
      subscriptions = subscriptions.filter(function (sub) {
        if(sub.id == message.id) return false;
        return true;
      });
    });

    ddp.on("removed", function (message) {
      subscriptions = subscriptions.map(function (sub) {
        if(sub.collectionName == message.collection && !sub.removed) {
          sub.items = sub.items.filter(function (item) {
            if(item.id == message.id) return false;
            return true;
          });
          sub.callback(sub.items);
        }
        return sub;
      });
    });

    ddp.on("changed", function (message) {
      subscriptions = subscriptions.map(function (sub) {
        if(sub.collectionName == message.collection) {
          sub.items = sub.items.map(function (item) {
            if(item.id==message.id) return {
              ...item,
              ...message.fields
            }
            return item;
          });
          sub.callback(sub.items);
        }
        return sub;
      });
    });
  }
};
