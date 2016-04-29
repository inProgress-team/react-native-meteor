
import base64 from 'base-64';
import Data from '../Data';

export default (name, file)=> {
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
      const fileName = getImageInfos(params).name;
      return Data.getUrl().replace('ws://', 'http://').replace('wss://', 'https://')+'/cfs/files/'+name+'/'+file._id+'/'+fileName+'?store='+getStoreName(params)+(token ? '&token='+base64.encode(JSON.stringify({authToken: token})) : "");
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