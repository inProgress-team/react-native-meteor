import { Settings } from '../collections';

export default function() {
  if (Meteor.isClient) {
    Meteor.subscribe('settings');
  }

  if (Meteor.isServer) {
    Meteor.publish('settings', function() {
      return Settings.find({});
    });
  }
};
