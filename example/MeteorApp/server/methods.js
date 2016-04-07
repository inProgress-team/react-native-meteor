Meteor.methods({
  'addItem': function() {
    const i = Items.find().count();
    Items.insert({
      completed: false,
      createdAt: new Date(),
      name: `Item #${i}`
    });
  },

  'removeItem': function(_id) {
    Items.remove({_id: _id});
  }
});
