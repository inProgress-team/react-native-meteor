/* eslint-disable global-require, import/no-unresolved, no-empty, import/prefer-default-export */
let rn;

try {
  require('react-native');
  rn = true;
} catch (e) {}

const isReactNative = rn;

export default isReactNative;
