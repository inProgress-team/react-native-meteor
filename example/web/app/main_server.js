import React from 'react';
//import {Posts} from './collections';
//import {createPosts, createUsers} from './fixtures';
import './methods';
import { createUsers, createSettings } from './fixtures';

import todos from './publications/todos';
import settings from './publications/settings';
todos();
settings();

if(Meteor.users.find().count()===0) {
  createUsers();
  createSettings();
}

console.log('\n\nRunning on server only');;
