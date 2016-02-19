

var callbacks = [];

module.exports = {
  on: function (eventName, collectionName, callback) {
    if(callback === undefined) {
      callback = collectionName;
      collectionName = '';
    }
    callbacks.push({
      eventName: eventName,
      collectionName: collectionName,
      callback: callback
    });
  },
  emit: function (eventName, collectionName, message) {
    if(message === undefined) {
      message = collectionName;
      collectionName = '';
    }

    var eventCallbacks = callbacks.filter(function (callback) {
      if(callback.eventName == eventName && callback.collectionName == collectionName) return true;
      return false;
    }).map(function (callback) {
      return callback.callback;
    });
    eventCallbacks.forEach(function (callback) {
      callback(message);
    });
  }
};
