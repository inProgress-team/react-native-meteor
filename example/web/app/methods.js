// if you import this on the client, it will be a stub
// if you import this on the server, it will be the real method
// use Meteor.call as normal to consume it.

/* global Meteor */


Meteor.methods({
  sayHello() {
    console.log(this.userId);
    return 'Hello from Meteor method!';
  },
});
