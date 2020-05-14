'use strict';

/**
 * Module dependenices
 */

const clone = require('shallow-clone');
const typeOf = require('kind-of');
const isPlainObject = require('is-plain-object');
const isSubset = require('is-subset');

function cloneDeep(val, filter, instanceClone = true, pkey = '') {
  switch (typeOf(val)) {
    case 'object':
      return cloneObjectDeep(val, filter, instanceClone, pkey);
    case 'array':
      return cloneArrayDeep(val, filter, instanceClone, pkey);
    default: {
      return clone(val);
    }
  }
}

function cloneObjectDeep(val, filter, instanceClone, pkey) {
  if (typeof instanceClone === 'function') {
    return instanceClone(val);
  }
  if (instanceClone || isPlainObject(val)) {
    const res = new val.constructor();
    for (let key in val) {
      const npkey = pkey === '' ? key : `${pkey}.${key}`;
      const result = cloneDeep(val[key], filter, instanceClone, npkey);
      let cloning = true;
      if (filter.key === npkey) {
        if (typeOf(result) === 'object' || typeOf(result) === 'array') {
          cloning = isSubset(result, filter.value);
        } else {
          cloning = filter.value === result;
        }
      }
      if (cloning) res[key] = result;

    }
    return res;
  }
  return val;
}

function cloneArrayDeep(val, filter, instanceClone, pkey) {
  const res = [];
  const npkey = `${pkey}[]`;
  let ix = 0;
  for (let i = 0; i < val.length; i++) {
    const result = cloneDeep(val[i], filter, instanceClone, npkey);
    let cloning = true;
    if (filter.key === npkey) {
      if (typeOf(result) === 'object' || typeOf(result) === 'array') {
        cloning = isSubset(result, filter.value);
      } else {
        cloning = filter.value === result;
      }
    }
    if (cloning) {
      res[ix] = result;
      ix++;
    }
  }
  return res;
}

/**
 * Expose `cloneDeep`
 */

module.exports = cloneDeep;
