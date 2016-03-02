import React from 'react';
//import {Posts} from './collections';
//import {createPosts, createUsers} from './fixtures';
import './methods';
import { createUsers } from './fixtures';

import publications from './publications/todos';
publications();

if(Meteor.users.find().count()===0) {
  createUsers();
}

console.log('\n\nRunning on server only');;
