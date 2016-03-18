import SHA256 from 'crypto-js/sha256';

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
