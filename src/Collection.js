import Tracker from 'trackr';
import EJSON from 'ejson';
import _ from 'underscore';

import Data from './Data';
import Random from '../lib/Random';
import call from './Call';
import { isPlainObject } from "../lib/utils.js";

export class Collection {
  constructor(name, options = { }) {
    if (!Data.db[name]) Data.db.addCollection(name);

    this._collection = Data.db[name];
    this._cursoredFind = options.cursoredFind;
    this._name = name;
    this._transform = wrapTransform(options.transform);
  }

  find(selector, options) {
    let result;

    if(typeof selector == 'string') {
      if(options) {
        result = this._collection.findOne({_id: selector}, options);
      } else {
        result = this._collection.get(selector);
      }

      if (result) result = [ result ];
    } else {
      result = this._collection.find(selector, options);
    }

    if (result && this._transform) result = result.map(this._transform);

    if (this._cursoredFind) {
      result = result || [ ];

      result.fetch = () => result;
      result.count = () => result.length;
    }

    return result;
  }

  findOne(selector, options) {
    const result = this.find(selector, options);

    return result ? result[0] : result;
  }

  insert(item, callback = ()=>{}) {
    let id;

    if('_id' in item) {
      if(!item._id || typeof item._id != 'string') {
        return callback("Meteor requires document _id fields to be non-empty strings");
      }
      id = item._id;
    } else {
      id = item._id = Random.id();
    }

    if(this._collection.get(id)) return callback({error: 409, reason: `Duplicate key _id with value ${id}`});

    this._collection.upsert(item);
    Data.waitDdpConnected(()=>{
      call(`/${this._name}/insert`, item, err => {
        if(err) {
          this._collection.del(id);
          return callback(err);
        }

        callback(null, id);
      });
    });

    return id;
  }

  update(id, modifier, options={}, callback=()=>{}) {
    if(typeof options == 'function') {
      callback = options;
      options = {};
    }

    if(!this._collection.get(id)) return callback({
      error: 409,
      reason: `Item not found in collection ${this._name} with id ${id}`
    });

    Data.waitDdpConnected(()=>{
      call(`/${this._name}/update`, {_id: id}, modifier, err => {
        if(err) {
          return callback(err);
        }

        callback(null, id);
      });
    });
  }

  remove(id, callback = ()=>{}) {
    const element = this.findOne(id);

    if(element) {
      this._collection.del(element._id);

      Data.waitDdpConnected(()=>{
        call(`/${this._name}/remove`, {_id: id}, (err, res) => {
          if(err) {
            this._collection.upsert(element);
            return callback(err);
          }
          callback(null, res);
        });
      });
    } else {
      callback(`No document with _id : ${id}`);
    }
  }
}

//From Meteor core

// Wrap a transform function to return objects that have the _id field
// of the untransformed document. This ensures that subsystems such as
// the observe-sequence package that call `observe` can keep track of
// the documents identities.
//
// - Require that it returns objects
// - If the return value has an _id field, verify that it matches the
//   original _id field
// - If the return value doesn't have an _id field, add it back.
function wrapTransform(transform) {
  if (! transform)
    return null;

  // No need to doubly-wrap transforms.
  if (transform.__wrappedTransform__)
    return transform;

  var wrapped = function (doc) {
    if (!_.has(doc, '_id')) {
      // XXX do we ever have a transform on the oplog's collection? because that
      // collection has no _id.
      throw new Error("can only transform documents with _id");
    }

    var id = doc._id;
    // XXX consider making tracker a weak dependency and checking Package.tracker here
    var transformed = Tracker.nonreactive(function () {
      return transform(doc);
    });

    if (!isPlainObject(transformed)) {
      throw new Error("transform must return object");
    }

    if (_.has(transformed, '_id')) {
      if (!EJSON.equals(transformed._id, id)) {
        throw new Error("transformed document can't have different _id");
      }
    } else {
      transformed._id = id;
    }
    return transformed;
  };
  wrapped.__wrappedTransform__ = true;
  return wrapped;
};