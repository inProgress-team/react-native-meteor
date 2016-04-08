Meteor.startup(function () {
  if (Items.find().count() === 0) {
    let i = 0;
    let timestamp = (new Date()).getTime();
    while (i < 10) {
      Items.insert({
        name: `Item #${i}`,
        createdAt: new Date(timestamp),
        complete: false
      });
      timestamp += 1; // ensure unique timestamp
      i += 1;
    }
  }
});
