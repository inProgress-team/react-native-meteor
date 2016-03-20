

export const Users = Meteor.users;
export const Todos = require('./todos');
export const ImagesFiles = require('./images_files');
export const Settings = new Mongo.Collection('settings');
