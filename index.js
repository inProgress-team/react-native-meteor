var DDP = require("ddp.js");

var ddp = new DDP({
  endpoint: 'http://inprogresstest.meteor.com/websocket',
  SocketConstructor: WebSocket
});
ddp.on("connected", function () {
    console.log("Connected");
});

module.exports = {
  suscribe: function (collection, change) {
    var collection = "tasks";
    var subId = ddp.sub(collection, [{sort: {createdAt: -1}}]);
    var doneLoading = false;
    var items = [];

    ddp.on("added", function (message) {
      if(message.collection == collection) {
        message.fields.id = message.id;
        items.push(message.fields);
        if(doneLoading) {
          change(items);
        }
      }
    });

    ddp.on("changed", function (message) {
      if(message.collection == collection) {
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
      if(message.collection == collection) {
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
