import EJSON from "ejson";

import Collection from './Collection';
import Data from './Data';



EJSON.addType('FS.File', function(value) {
  return {
    getFileRecord() {
      const collection = Data.db['cfs.'+value.collectionName+'.filerecord'];

      const item = collection && collection.get(value._id);

      if(!item) return value;

      return setProperties(value.collectionName, item);
    }
  };
});

export default function(name) {

  const collectionName = 'cfs.'+name+'.filerecord';


  return {
    find(selector, options) {
      const elems = Collection(collectionName).find(selector, options);
      return elems.map(elem=>{
        return setProperties(name, elem);
      });
    },
    findOne(selector, options) {
      const elem = Collection(collectionName).findOne(selector, options);
      return elem && setProperties(name, elem);
    },
    insert: Collection(collectionName).insert,
    update: Collection(collectionName).update,
    remove: Collection(collectionName).remove
  };
}







const setProperties = (name, file)=> {
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
      const token = Data._tokenIdSaved;
      return Data.getUrl()+'/cfs/files/'+name+'/'+file._id+'?store='+getStoreName(params)+(token ? '&token='+btoa(JSON.stringify({authToken: token})) : "");
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