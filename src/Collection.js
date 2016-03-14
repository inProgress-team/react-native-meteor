import Data from './Data';
import Random from '../lib/Random';

export default function(name) {
  const Meteor = this;

  return {
    find(selector, options) {
      if(!Data.db || !Data.db[name]) return [];
      if(typeof selector == 'string') return this.find({_id: selector}, options);
      return Data.db[name].find(selector, options)

    },
    findOne(selector, options) {
      if(!Data.db || !Data.db[name]) return null;
      if(typeof selector == 'string') return this.findOne({_id: selector}, options);
      return Data.db[name] && Data.db[name].findOne(selector, options)

    },
    insert(item, callback = ()=>{}) {
      if(!Data.db[name]) { Data.db.addCollection(name) }

      const id = Random.id();
      const itemSaved = Data.db[name].upsert({...item, _id: id});

      Meteor.call('/'+name+'/insert', itemSaved, err => {
        if(err) {
          Data.db[name].del(id);
          return callback(err);
        }

        callback(null, id);
      });

      return id;
    },
    update(id, modifier, options={}, callback=()=>{}) {
      if(typeof options == 'function') {
        callback = options;
        options = {};
      }

      console.info('Update not impletemented yet');
    },
    upsert(id, modifier, options={}, callback=()=>{}) {
      if(typeof options == 'function') {
        callback = options;
        options = {};
      }

      console.info('Upsert not impletemented yet');
    },
    remove(id, callback = ()=>{}) {

      const element = this.findOne(id);
      if(element) {
        Data.db[name].del(element._id);

        Meteor.call('/'+name+'/remove', {_id: id}, (err, res) => {
          if(err) {
            Data.db[name].upsert(element);
            return callback(err);
          }
          callback(null, res);

        });

      } else {
        callback('No document with _id : ' + id);
      }
    }
  };
}