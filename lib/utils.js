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
         && !(typeof v === 'number')
         && !(typeof v === 'string')
         && !(typeof v === 'boolean')
         && !(Array.isArray(v))
         && !(v === null)
         && !(v instanceof RegExp)
         && !(typeof v === 'function')
         && !(v instanceof Date)
         && !(EJSON.isBinary(v))
         && !(v instanceof MongoID.ObjectID)
};
