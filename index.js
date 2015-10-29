var DDP = require("ddp.js");

var ddp = new DDP({
  endpoint: 'http://inprogresstest.meteor.com/websocket',
  SocketConstructor: WebSocket
});
ddp.on("connected", function () {
    console.log("Connected");
});

module.exports = {
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
