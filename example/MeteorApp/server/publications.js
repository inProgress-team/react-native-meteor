import { Items } from '../lib/items';

Meteor.publish('items', function() {
  return Items.find();
});
