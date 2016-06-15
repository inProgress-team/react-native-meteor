import EJSON from 'ejson';

import Data from './Data';

const stringify = function (value) {
  if (value === undefined)
    return 'undefined';
  return EJSON.stringify(value);
};

const parse = function (serialized) {
  if (serialized === undefined || serialized === 'undefined')
    return undefined;
  return EJSON.parse(serialized);
};

export default class ReactiveDict {
  constructor(dictName) {
    this.keys = {};
    if (typeof dictName === 'object') {
      for(var i in dictName) {
        this.keys[i] = stringify(dictName[i])
      }
    }
  }
  set(keyOrObject, value) {
    if ((typeof keyOrObject === 'object') && (value === undefined)) {
      this._setObject(keyOrObject);
      return;
    }
    // the input isn't an object, so it must be a key
    // and we resume with the rest of the function
    const key = keyOrObject;

    value = stringify(value);

    let oldSerializedValue = 'undefined';
    if(Object.keys(this.keys).indexOf(key) != -1) {
      oldSerializedValue = this.keys[key];
    }
    if (value === oldSerializedValue)
      return;

    this.keys[key] = value;

    Data.notify('change');
  }
  setDefault(key, value) {
    // for now, explicitly check for undefined, since there is no
    // ReactiveDict.clear().  Later we might have a ReactiveDict.clear(), in which case
    // we should check if it has the key.
    if (this.keys[key] === undefined) {
      this.set(key, value);
    }
  }
  get(key) {
    return parse(this.keys[key]);
  }
  equals(key, value) {
    // We don't allow objects (or arrays that might include objects) for
    // .equals, because JSON.stringify doesn't canonicalize object key
    // order. (We can make equals have the right return value by parsing the
    // current value and using EJSON.equals, but we won't have a canonical
    // element of keyValueDeps[key] to store the dependency.) You can still use
    // "EJSON.equals(reactiveDict.get(key), value)".
    //
    // XXX we could allow arrays as long as we recursively check that there
    // are no objects
    if (typeof value !== 'string' &&
        typeof value !== 'number' &&
        typeof value !== 'boolean' &&
        typeof value !== 'undefined' &&
        !(value instanceof Date) &&
        !(ObjectID && value instanceof ObjectID) &&
        value !== null)
      throw new Error("ReactiveDict.equals: value must be scalar");

    const serializedValue = stringify(value);

    let oldValue = undefined;
    if(Object.keys(this.keys).indexOf(key) != -1) {
      oldValue = parse(this.keys[key])
    }
    return EJSON.equals(oldValue, value);
  }
  _setObject(object) {

    const keys = Object.keys(object);

    for(let i in keys) {
      this.set(i, keys[i]);
    }
  }
}
