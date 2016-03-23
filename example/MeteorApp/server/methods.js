Meteor.methods({
  'addItem': function() {
    const i = Items.find().count();
    Items.insert({
      completed: false,
      createdAt: new Date(),
      name: `Item #${i}`
    });
  },

  'removeItem': function() {
    const item = Items.findOne();
    Items.remove({_id: item._id});
  }
});
