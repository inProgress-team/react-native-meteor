import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Items = new Mongo.Collection('items');

Meteor.methods({
  removeItem(id) {
    check(id, String);
    Items.remove(id);
  },
  addItem() {
    const i = Items.find().count();
    Items.insert({
      completed: false,
      createdAt: new Date(),
      name: `Item #${i}`
    });
  },
  updateItemName(itemId, name) {
    check(itemId, String);
    check(name, String);
    Items.update(itemId, {
      $set: {
        name,
      }
    });
  }
});