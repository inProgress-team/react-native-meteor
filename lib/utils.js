import SHA256 from 'crypto-js/sha256';
import _ from 'underscore';

var i = 0;
export function uniqueId() {
  return (i++).toString();
}

export function contains(array, element) {
  return array.indexOf(element) !== -1;
}

export function hashPassword(password) {
  return {
    digest: SHA256(password).toString(),
    algorithm: 'sha-256',
  };
}

//From Meteor core
var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};

// Populate the class2type map
_.each(
  'Boolean Number String Function Array Date RegExp Object Error'.split(' '),
  function(name, i) {
    class2type['[object ' + name + ']'] = name.toLowerCase();
  }
);

function type(obj) {
  if (obj == null) {
    return obj + '';
  }
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2type[toString.call(obj)] || 'object'
    : typeof obj;
}

function isWindow(obj) {
  /* jshint eqeqeq: false */
  return obj != null && obj == obj.window;
}

export function isPlainObject(obj) {
  var key;

  // Must be an Object.
  // Because of IE, we also have to check the presence of the constructor property.
  // Make sure that DOM nodes and window objects don't pass through, as well
  if (!obj || type(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
    return false;
  }

  try {
    // Not own constructor property must be Object
    if (
      obj.constructor &&
      !hasOwn.call(obj, 'constructor') &&
      !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')
    ) {
      return false;
    }
  } catch (e) {
    // IE8,9 Will throw exceptions on certain host objects #9897
    return false;
  }

  // Support: IE<9
  // Handle iteration over inherited properties before own properties.
  if (support.ownLast) {
    for (key in obj) {
      return hasOwn.call(obj, key);
    }
  }

  // Own properties are enumerated firstly, so to speed up,
  // if last one is own, then all properties are own.
  for (key in obj) {
  }

  return key === undefined || hasOwn.call(obj, key);
}
