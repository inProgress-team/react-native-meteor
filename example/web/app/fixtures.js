/* global Accounts */

import { Settings, ImagesFiles } from 'collections';

export function createUsers() {
  console.log('Creating fake users');

  const id = Accounts.createUser({
    username: 'User',
    password: 'password',
    profile: {},
  });

  Accounts.addEmail(id, 'contact@in-progress.io', true)
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