import SHA256 from 'crypto-js/sha256';
import EJSON from 'ejson';
import _ from "underscore";

var i = 0;
export function uniqueId () {
  return (i++).toString();
}

export function contains (array, element) {
  return array.indexOf(element) !== -1;
}

export function hashPassword (password) {
  return {
    digest: SHA256(password).toString(),
    algorithm: "sha-256"
  }
}

export function isPlainObject ( obj ) {
  return !!obj
         && !(typeof obj === 'number')
         && !(typeof obj === 'string')
         && !(typeof obj === 'boolean')
         && !(Array.isArray(obj))
         && !(obj === null)
         && !(obj instanceof RegExp)
         && !(typeof obj === 'function')
         && !(obj instanceof Date)
         && !(EJSON.isBinary(obj))
         && !(obj instanceof MongoID.ObjectID)
};
