import minimongo from 'minimongo-cache';
process.nextTick = setImmediate;

export default {
  endpoint: null,
  options: null,
  ddp: null,
  subscriptions: {},
  db: new minimongo(),
  calls: [],

  waitDdpReady(cb) {
    if(this.ddp) {
      cb();
    } else {
      setTimeout(()=>{
        this.waitDdpReady(cb);
      }, 10);
    }
  },

  _cbs: [],
  on(eventName, cb) {
    this._cbs.push({
      eventName: eventName,
      callback: cb
    });
  },
  off(eventName, cb) {
    this._cbs.splice(this._cbs.findIndex(_cb=>_cb.callback == cb && _cb.eventName == eventName));
  },
  _notifyLoggingIn() {
    this._cbs.map(cb=>{
      if(cb.eventName=='loggingIn' && typeof cb.callback=='function') {
        cb.callback();
      }
    });
  }
}
