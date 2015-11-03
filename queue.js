

var callbacks = [];

module.exports = {
  on: function (eventName, callback) {
    callbacks.push({
      eventName: eventName,
      callback: callback
    });
  },
  emit: function (eventName, message) {
    var eventCallbacks = callbacks.filter(function (callback) {
      if(callback.eventName == eventName) return true;
      return false;
    }).map(function (callback) {
      return callback.callback;
    });
    eventCallbacks.forEach(function (callback) {
      callback(message);
    });
  }
};
