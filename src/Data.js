import minimongo from 'minimongo-cache';
process.nextTick = setImmediate;

export default {
  endpoint: null,
  options: null,
  ddp: null,
  subscriptions: {},
  db: new minimongo(),
  calls: [],
  hasBeenConnected: false,

  _cbs: [],
  onChange(cb) {
    this.db.on('change', cb);
    this.ddp.on('connected', cb);
    this.ddp.on('disconnected', cb);
    this.on('loggingIn', cb);
  },
  offChange() {
    this.db.off('change', cb);
    this.ddp.off('connected', cb);
    this.ddp.off('disconnected', cb);
    this.off('loggingIn', cb);
  },
  on(eventName, cb) {
    this._cbs.push({
      eventName: eventName,
      callback: cb
    });
  },
  off(eventName, cb) {
    this._cbs.splice(this._cbs.findIndex(_cb=>_cb.callback == cb && _cb.eventName == eventName), 1);
  },
  _notifyLoggingIn() {
    this._cbs.map(cb=>{
      if(cb.eventName=='loggingIn' && typeof cb.callback=='function') {
        cb.callback();
      }
    });
  }
}
