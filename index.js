var DDP = require("ddp.js");

var queue = require('./queue');

var ddp;
var subscriptions = [];

var loginWithEmailId,
    loginWithEmailCb;
  var loginWithUsernameId,
      loginWithUsernameCb;
var loginWithTokenId,
    loginWithTokenCb;

var methods = [];

module.exports = {
  on: queue.on,
  loginWithToken: function (token, callback) {
    loginWithTokenCb = callback;
    loginWithTokenId = ddp.method("login", [{ resume: token }]);
  },
  loginWithUsername: function (username, password, callback) {
    loginWithUsernameCb = callback;
    loginWithUsernameId = ddp.method("login", [{
        user: {
          username: username
        },
        password: password
    }]);
  },
  loginWithEmail: function (email, password, callback) {
    loginWithEmailCb = callback;
    loginWithEmailId = ddp.method("login", [{
        user: {
          email: email
        },
        password: password
    }]);
  },
  method: function (event, param, callback) {
    var id = ddp.method(event, param);
    methods.push({
      id: id,
      callback: callback
    });
  },
  unsuscribe: function (id) {
    ddp.unsub(id);
    subscriptions = subscriptions.map(function (sub) {
      if(sub.id == id) {
        sub.removed = true;
      }
      return sub;
    });
  },
  suscribe: function (name, collectionName, params, callback) {
    if(typeof collectionName != 'string') {
      callback = params;
      params = collectionName;
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
      items: [],
      itemsSubs: []
    });

    return subId;
  },
  itemSuscribe: function (name, collectionName, id, callback) {
    if(typeof callback == 'undefined') {
      callback = id;
      id = collectionName;
      collectionName = name;
    }
    var sub = subscriptions.find((subscription)=>{return name==subscription.name && collectionName == subscription.collectionName});
    if(sub) {
      var subId = parseInt(Math.random()*100000000000, 10);
      sub.itemsSubs.push({
        subId: subId,
        id: id,
        callback: callback
      });

      return subId;
    }
    return false;
  },
  itemUnsuscribe: function (name, collectionName, subId) {
    if(typeof subId == 'undefined') {
      subId = collectionName;
      collectionName = name;
    }
    var sub = subscriptions.find((subscription)=>{return name==subscription.name && collectionName == subscription.collectionName});
    for(var i in sub.itemsSubs) {
      if(sub.itemsSubs[i].subId == subId) {
        sub.itemsSubs.splice(i, 1);
      }
    }

  },

  connect: function (endpoint) {
    ddp = new DDP({
      endpoint: endpoint,
      SocketConstructor: WebSocket
    });
    ddp.on('connected', function () {
      queue.emit('connected');
    });
    ddp.on('disconnected', function () {
      queue.emit('disconnected');
    });

    ddp.on("result", function (message) {
      if (message.id === loginWithEmailId && typeof loginWithEmailCb == 'function') {
        if(message.error) {
          return loginWithEmailCb(message.error);
        }
        loginWithEmailCb(null, message.result);
        return;
      }
      if (message.id === loginWithUsernameId && typeof loginWithUsernameCb == 'function') {
        if(message.error) {
          return loginWithUsernameCb(message.error);
        }
        loginWithUsernameCb(null, message.result);
        return;
      }
      if (message.id === loginWithTokenId && typeof loginWithTokenCb == 'function') {
        if(message.error) {
          return loginWithTokenCb(message.error);
        }
        loginWithTokenCb(null, message.result);
        return;
      }
      var index;
      for(var i in methods) {
        var method = methods[i];
        if(message.id === method.id) {
          if(typeof method.callback == 'function') {
            if(message.error) {
              return method.callback(message.error);
            }
            method.callback(null, message.result);
          }
          //DELETE
          index = i;
        }
      }
      if(index) {
        methods.splice(index, 1);
      }
    });


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
      });
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
            if(item.id==message.id) {
              var res = {
                ...item,
                ...message.fields
              }
              //NOTIFY ITEMS subs
              sub.itemsSubs.map(subItem=>{
                if(subItem.id == res.id) {
                  subItem.callback(res);
                }
              });
              return res;
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
