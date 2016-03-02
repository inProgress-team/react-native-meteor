import { Todos } from '../collections';

export default function() {
  if (Meteor.isClient) {
    Meteor.subscribe('todos');
  }

  if (Meteor.isServer) {
    Meteor.publish('todos', function(done) {
      if(done===undefined) return Todos.find({});
      
      return Todos.find({done: done});
    });
  }
};
