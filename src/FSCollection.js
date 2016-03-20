import Collection from './Collection';
import Data from './Data';

export default function(name) {

  const Meteor = this;

  const collectionName = 'cfs.'+name+'.filerecord';
  const setProperties = file => {
    const getStoreName = (params = {store: name}) => {
      return params.store;
    };
    const getImageInfos = params => {
      if(!params || !params.store) return file.original || {};
      return file.copies[params.store] || {};
    };
    const getType = params => {
      return getImageInfos(params).type;
    };
    return {
      ...file,
      url: params => {
        return Data.getUrl()+'/cfs/files/'+name+'/'+file._id+'?store='+getStoreName(params)+(Meteor._tokenIdSaved ? '&token='+btoa(JSON.stringify({authToken: Meteor._tokenIdSaved})) : "");
      },
      isImage: params => {
        const type = getType(params);
        return type && type.indexOf('image/')===0;
      },
      isAudio: params => {
        const type = getType(params);
        return type && type.indexOf('audio/')===0;
      },
      isVideo: params => {
        const type = getType(params);
        return type && type.indexOf('video/')===0;
      },
      isUploaded: params => {
        return !!(getImageInfos(params).updatedAt);
      },
      name: params => {
        return getImageInfos(params).name;
      },
      extension: params => {
        const imageName = getImageInfos(params).name;
        if(!imageName) return;
        return imageName.substring(imageName.lastIndexOf('.')+1);
      },
      size: params => {
        return getImageInfos(params).size;
      },
      type: getType,
      updatedAt: params=>{
        return getImageInfos(params).updatedAt;
      }
    }
  }

  return {
    find(selector, options) {
      const elems = Collection(collectionName).find(selector, options);
      return elems.map(elem=>{
        return setProperties(elem);
      });
    },
    findOne(selector, options) {
      const elem = Collection(collectionName).findOne(selector, options);
      return elem && setProperties(elem);
    },
    insert: Collection(collectionName).insert,
    update: Collection(collectionName).update,
    remove: Collection(collectionName).remove
  };
}