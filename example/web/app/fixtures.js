/* global Accounts */

export function createUsers() {
  console.log('Creating fake users');
  ['User'].forEach(function(name) {
    Accounts.createUser({
      username: name,
      password: 'password',
      profile: {},
    });
  });
}

import { Settings } from 'collections';

export function createSettings() {
  Settings.insert({
    param1: 'react-native-meteor'
  });
}