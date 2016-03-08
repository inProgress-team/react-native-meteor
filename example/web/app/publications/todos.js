import { Todos } from '../collections';

export default function() {
  if (Meteor.isClient) {
    Meteor.subscribe('todos');
  }

  if (Meteor.isServer) {
    Meteor.publish('todos', function(done) {
      if(typeof done == 'boolean') return Todos.find({done: done});
      if(done===undefined) return Todos.find({});

      //done is an object, just check that EJSON is working ;) => type == 'object' (date)
      console.log(done.createdAt && typeof done.createdAt.$gt);
      return Todos.find({});

    });
  }
};
