import { Platform, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import reactMixin from 'react-mixin';
import Trackr from 'trackr';
import EJSON from 'ejson';
import DDP from '../lib/ddp.js';
import Random from '../lib/Random';

import Data from './Data';
import { Collection } from './Collection';
import call from './Call';

import Mixin from './components/Mixin';
import MeteorListView from './components/ListView';
import MeteorComplexListView from './components/ComplexListView';
import createContainer from './components/createContainer';
import withTracker from './components/ReactMeteorData';
import composeWithTracker from './components/composeWithTracker';

import FSCollection from './CollectionFS/FSCollection';
import FSCollectionImagesPreloader from './CollectionFS/FSCollectionImagesPreloader';

import ReactiveDict from './ReactiveDict';

import User from './user/User';
import Accounts from './user/Accounts';

module.exports = {
  composeWithTracker,
  Accounts,
  Tracker: Trackr,
  EJSON,
  MeteorListView,
  MeteorComplexListView,
  ReactiveDict,
  Collection,
  FSCollectionImagesPreloader:
    Platform.OS == 'android' ? View : FSCollectionImagesPreloader,
  collection(name, options) {
    return new Collection(name, options);
  },
  FSCollection,
  createContainer,
  withTracker,
  getData() {
    return Data;
  },
  connectMeteor(reactClass) {
    return reactMixin.onClass(reactClass, Mixin);
  },
  ...User,
  status() {
    return {
      connected: Data.ddp ? Data.ddp.status == 'connected' : false,
      status: Data.ddp ? Data.ddp.status : 'disconnected',
      //retryCount: 0
      //retryTime:
      //reason:
    };
  },
  call: call,
  disconnect() {
    if (Data.ddp) {
      Data.ddp.disconnect();
    }
  },
  _subscriptionsRestart() {
    for (var i in Data.subscriptions) {
      const sub = Data.subscriptions[i];
      Data.ddp.unsub(sub.subIdRemember);
      sub.subIdRemember = Data.ddp.sub(sub.name, sub.params);
    }
  },
  waitDdpConnected: Data.waitDdpConnected.bind(Data),
  reconnect() {
    Data.ddp && Data.ddp.connect();
  },
  connect(endpoint, options, callback) {
    if (!endpoint) endpoint = Data._endpoint;
    if (!options) options = Data._options;

    Data._endpoint = endpoint;
    Data._options = options;

    this.ddp = Data.ddp = new DDP({
      endpoint: endpoint,
      SocketConstructor: WebSocket,
      ...options,
    });

    NetInfo.isConnected.addEventListener('connectionChange', isConnected => {
      if (isConnected && Data.ddp.autoReconnect) {
        Data.ddp.connect();
      }
    });

    Data.ddp.on('connected', () => {
      // Clear the collections of any stale data in case this is a reconnect
      if (Data.db && Data.db.collections) {
        for (var collection in Data.db.collections) {
          Data.db[collection].remove({});
        }
      }

      Data.notify('change');

      console.info('Connected to DDP server.');
      this._loadInitialUser().then(() => {
        this._subscriptionsRestart();
        typeof callback == 'function' && callback(err);
      });
    });

    let lastDisconnect = null;
    Data.ddp.on('disconnected', () => {
      Data.notify('change');

      console.info('Disconnected from DDP server.');

      if (!Data.ddp.autoReconnect) return;

      if (!lastDisconnect || new Date() - lastDisconnect > 3000) {
        Data.ddp.connect();
      }

      lastDisconnect = new Date();
    });

    Data.ddp.on('added', message => {
      if (!Data.db[message.collection]) {
        Data.db.addCollection(message.collection);
      }
      Data.db[message.collection].upsert({
        _id: message.id,
        ...message.fields,
      });
    });

    Data.ddp.on('ready', message => {
      const idsMap = new Map();
      for (var i in Data.subscriptions) {
        const sub = Data.subscriptions[i];
        idsMap.set(sub.subIdRemember, sub.id);
      }
      for (var i in message.subs) {
        const subId = idsMap.get(message.subs[i]);
        if (subId) {
          const sub = Data.subscriptions[subId];
          sub.ready = true;
          sub.readyDeps.changed();
          sub.readyCallback && sub.readyCallback();
        }
      }
    });

    Data.ddp.on('changed', message => {
      const unset = {};
      if (message.cleared) {
        message.cleared.forEach(field => {
          unset[field] = null;
        });
      }

      Data.db[message.collection] &&
        Data.db[message.collection].upsert({
          _id: message.id,
          ...message.fields,
          ...unset,
        });
    });

    Data.ddp.on('removed', message => {
      Data.db[message.collection] &&
        Data.db[message.collection].del(message.id);
    });
    Data.ddp.on('result', message => {
      const call = Data.calls.find(call => call.id == message.id);
      if (typeof call.callback == 'function')
        call.callback(message.error, message.result);
      Data.calls.splice(Data.calls.findIndex(call => call.id == message.id), 1);
    });

    Data.ddp.on('nosub', message => {
      for (var i in Data.subscriptions) {
        const sub = Data.subscriptions[i];
        if (sub.subIdRemember == message.id) {
          console.warn('No subscription existing for', sub.name);
        }
      }
    });
  },
  subscribe(name) {
    var params = Array.prototype.slice.call(arguments, 1);
    var callbacks = {};
    if (params.length) {
      var lastParam = params[params.length - 1];
      if (typeof lastParam == 'function') {
        callbacks.onReady = params.pop();
      } else if (
        lastParam &&
        (typeof lastParam.onReady == 'function' ||
          typeof lastParam.onError == 'function' ||
          typeof lastParam.onStop == 'function')
      ) {
        callbacks = params.pop();
      }
    }

    // Is there an existing sub with the same name and param, run in an
    // invalidated Computation? This will happen if we are rerunning an
    // existing computation.
    //
    // For example, consider a rerun of:
    //
    //     Tracker.autorun(function () {
    //       Meteor.subscribe("foo", Session.get("foo"));
    //       Meteor.subscribe("bar", Session.get("bar"));
    //     });
    //
    // If "foo" has changed but "bar" has not, we will match the "bar"
    // subcribe to an existing inactive subscription in order to not
    // unsub and resub the subscription unnecessarily.
    //
    // We only look for one such sub; if there are N apparently-identical subs
    // being invalidated, we will require N matching subscribe calls to keep
    // them all active.

    let existing = false;
    for (var i in Data.subscriptions) {
      const sub = Data.subscriptions[i];
      if (sub.inactive && sub.name === name && EJSON.equals(sub.params, params))
        existing = sub;
    }

    let id;
    if (existing) {
      id = existing.id;
      existing.inactive = false;

      if (callbacks.onReady) {
        // If the sub is not already ready, replace any ready callback with the
        // one provided now. (It's not really clear what users would expect for
        // an onReady callback inside an autorun; the semantics we provide is
        // that at the time the sub first becomes ready, we call the last
        // onReady callback provided, if any.)
        if (!existing.ready) existing.readyCallback = callbacks.onReady;
      }
      if (callbacks.onStop) {
        existing.stopCallback = callbacks.onStop;
      }
    } else {
      // New sub! Generate an id, save it locally, and send message.

      id = Random.id();
      const subIdRemember = Data.ddp.sub(name, params);

      Data.subscriptions[id] = {
        id: id,
        subIdRemember: subIdRemember,
        name: name,
        params: EJSON.clone(params),
        inactive: false,
        ready: false,
        readyDeps: new Trackr.Dependency(),
        readyCallback: callbacks.onReady,
        stopCallback: callbacks.onStop,
        stop: function() {
          Data.ddp.unsub(this.subIdRemember);
          delete Data.subscriptions[this.id];
          this.ready && this.readyDeps.changed();

          if (callbacks.onStop) {
            callbacks.onStop();
          }
        },
      };
    }

    // return a handle to the application.
    var handle = {
      stop: function() {
        if (Data.subscriptions[id]) Data.subscriptions[id].stop();
      },
      ready: function() {
        if (!Data.subscriptions[id]) return false;

        var record = Data.subscriptions[id];
        record.readyDeps.depend();
        return record.ready;
      },
      subscriptionId: id,
    };

    if (Trackr.active) {
      // We're in a reactive computation, so we'd like to unsubscribe when the
      // computation is invalidated... but not if the rerun just re-subscribes
      // to the same subscription!  When a rerun happens, we use onInvalidate
      // as a change to mark the subscription "inactive" so that it can
      // be reused from the rerun.  If it isn't reused, it's killed from
      // an afterFlush.
      Trackr.onInvalidate(function(c) {
        if (Data.subscriptions[id]) {
          Data.subscriptions[id].inactive = true;
        }

        Trackr.afterFlush(function() {
          if (Data.subscriptions[id] && Data.subscriptions[id].inactive) {
            handle.stop();
          }
        });
      });
    }

    return handle;
  },
};
