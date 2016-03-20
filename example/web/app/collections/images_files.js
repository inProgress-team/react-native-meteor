
const ImagesFiles = new FS.Collection("imagesFiles", {
  stores: [
    new FS.Store.GridFS("imagesFiles"),
    new FS.Store.GridFS("anotherStore")
  ]
});

const allow = function(userId) {
  return !!userId;
};

ImagesFiles.allow({
  download: allow
});

export default ImagesFiles;