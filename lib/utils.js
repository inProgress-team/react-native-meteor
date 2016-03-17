var i = 0;
export function uniqueId () {
    return (i++).toString();
}

export function contains (array, element) {
    return array.indexOf(element) !== -1;
}

export function trimString (str) {
  if (typeof str !== 'string') return;
  return str.replace(/^\s+|\s+$/gm,'');
}
