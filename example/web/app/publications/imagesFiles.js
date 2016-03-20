import { ImagesFiles } from '../collections';

export default function() {
  if (Meteor.isClient) {
    Meteor.subscribe('imagesFiles');
  }

  if (Meteor.isServer) {
    Meteor.publish('imagesFiles', function() {
      return ImagesFiles.find({});
    });
  }
};