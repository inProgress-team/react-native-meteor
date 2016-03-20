import React from 'react';
//import {Posts} from './collections';
//import {createPosts, createUsers} from './fixtures';
import './methods';
import { createUsers, createSettings, createImages } from './fixtures';

import publications from './publications';
publications();

if(Meteor.users.find().count()===0) {
  createUsers();
  createSettings();
  createImages();
}


console.log('\n\nRunning on server only');;
