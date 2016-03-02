import minimongo from 'minimongo-cache';
process.nextTick = setImmediate;

export default {
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

  _cbsLoggingIn: [],
  _subscribeLoggingIn(cb) {
    this._cbsLoggingIn.push(cb);
  },
  _unsubscribeLoggingIn(cb) {
    this._cbsLoggingIn.splice(this._cbsLoggingIn.indexOf(cb));
  },
  _notifyLoggingIn() {
    for(var i in this._cbsLoggingIn) {
      this._cbsLoggingIn[i]();
    }
  }
}
