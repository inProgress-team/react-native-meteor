import Data from './Data';
import Random from '../lib/Random';

export default function(name) {
  const Meteor = this;
  if(!Data.db[name]) { Data.db.addCollection(name) }

  return {
    find(selector, options) {
      if(typeof selector == 'string') {
        if(options) {
          return [Data.db[name].findOne({_id: selector}, options)];
        } else {
          return [Data.db[name].get(selector)];
        }
      }
      return Data.db[name].find(selector, options);

    },
    findOne(selector, options) {

      if(typeof selector == 'string') {
        if(options) {
          return Data.db[name].findOne({_id: selector}, options);
        } else {
          return Data.db[name].get(selector);
        }
      }
      return Data.db[name] && Data.db[name].findOne(selector, options)

    },
    insert(item, callback = ()=>{}) {

      let id;

      if('_id' in item) {
        if(!item._id || typeof item._id != 'string') {
          return callback("Meteor requires document _id fields to be non-empty strings");
        }
        id = item._id;
      } else {
        id = item._id = Random.id();
      }

      if(Data.db[name].get(id)) return callback({error: 409, reason: "Duplicate key _id with value "+id});


      Data.db[name].upsert(item);

      Meteor.waitDdpConnected(()=>{
        Meteor.call('/'+name+'/insert', item, err => {
          if(err) {
            Data.db[name].del(id);
            return callback(err);
          }

          callback(null, id);
        });
      });


      return id;
    },
    update(id, modifier, options={}, callback=()=>{}) {

      if(typeof options == 'function') {
        callback = options;
        options = {};
      }

      if(!Data.db[name].get(id)) return callback({error: 409, reason: "Item not found in collection "+name+" with id "+id});

      Meteor.waitDdpConnected(()=>{
        Meteor.call('/'+name+'/update', {_id: id}, modifier, err => {
          if(err) {
            return callback(err);
          }

          callback(null, id);
        });
      });
    },
    remove(id, callback = ()=>{}) {

      const element = this.findOne(id);
      if(element) {
        Data.db[name].del(element._id);

        Meteor.waitDdpConnected(()=>{
          Meteor.call('/'+name+'/remove', {_id: id}, (err, res) => {
            if(err) {
              Data.db[name].upsert(element);
              return callback(err);
            }
            callback(null, res);

          });
        });

      } else {
        callback('No document with _id : ' + id);
      }
    }
  };
}