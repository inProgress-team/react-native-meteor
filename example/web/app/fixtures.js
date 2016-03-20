/* global Accounts */

import { Settings, ImagesFiles } from 'collections';

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

export function createSettings() {
  Settings.insert({
    param1: 'react-native-meteor'
  });
}


export function createImages() {
  const imageFile = new FS.File(Npm.require('fs').realpathSync(__meteor_bootstrap__.serverDir+'/../../../../../../app/opengraph.png'));
  ImagesFiles.insert(imageFile);

}