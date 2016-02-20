[![GitHub version](https://badge.fury.io/gh/inProgress-team%2Freact-native-meteor.svg)](https://badge.fury.io/gh/inProgress-team%2Freact-native-meteor)
[![npm version](https://badge.fury.io/js/react-native-meteor.svg)](http://badge.fury.io/js/react-native-meteor)
[![Dependency Status](https://david-dm.org/inProgress-team/react-native-meteor.svg)](https://david-dm.org/inProgress-team/react-native-meteor)
[![devDependency Status](https://david-dm.org/inProgress-team/react-native-meteor/dev-status.svg)](https://david-dm.org/inProgress-team/react-native-meteor#info=devDependencies)
[![react-native][rn-badge]][rn]
[![MIT][license-badge]][license]
[![bitHound Score][bithound-badge]][bithound]

[rn-badge]: https://img.shields.io/badge/react--native-v0.13.x-05A5D1.svg
[rn]: https://facebook.github.io/react-native
[bithound-badge]: https://www.bithound.io/github/inProgress-Team/react-native-meteor/badges/score.svg
[bithound]: https://www.bithound.io/github/inProgress-Team/react-native-meteor
[license-badge]: https://img.shields.io/dub/l/vibe-d.svg
[license]: https://github.com/inProgress-team/react-native-meteor/blob/master/LICENSE

# react-native-meteor

React-native meteor ddp adapter

## What is it for ?

The purpose of this library is :
* to set up and maintain a ddp connection with a ddp server, freeing the developer from having to do it on their own
* be fully compatible with react-native and help react-native developers

## Install

    npm i --save react-native-meteor

## Example usage

```javascript
var Example = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1!==row2,
      }),
      loaded: false,
    };
  },
  componentDidMount: function() {
    var self = this;

    meteor.connect('http://YOURIP:3000/websocket');

    meteor.on('connected', function () {
      console.log('connected');
    });

    this.tasksSub = meteor.subscribe('tasks', function (tasks) {
      self.setState({
        dataSource: self.state.dataSource.cloneWithRows(tasks),
        loaded: true
      });
    });
    
    meteor.on('added', 'tasks', function(task) {
        console.log('task added', task);
    });
    
    meteor.on('changed', 'tasks', function(task) {
        console.log('task changed', task);
    });
    
    meteor.on('removed', 'tasks', function(taskId) {
        console.log('task removed', taskId);
    });
 },
 componentWillUnmount: function () {
   meteor.unsubscribe(this.tasksSub);
 }
});
```
## Public API

### connect(url)

Connect to a ddp server. You have to this only once in your app.

#### Arguments

- `url` **string** *required*


### disconnect()

Disconnect from the ddp server.


### subscribe(name, collectionName, params, callback)

Subscribes to a server publication.

#### Arguments

- `name` **string** *required* : name of the server subscription

- `collectionName` **string** *optional* : name of the collection you subscribe (in case  the subscription name is different than collection name)

- `params` **array** *optional* : parameters to pass to the server publish function.

- `callback` **function** *required* : callback called when there is a change in the publication. Returns all elements.

### unsubscribe(id)

Unsubscribes to a server publication.

#### Arguments

- `id` **string** *required* : id of the server publication

### on(eventName, collectionName, callback)

Subscribe to DDP events.

#### Arguments

- `eventName` **string** *required* : Name of the event (`connected`, `disconnected`, `added`, `changed`, `removed`)

- `collectionName` **string** *optional* : collection name to specify when event name = added, changed or removed.

- `callback` **function** *required* : callback called when event is emitted. Returns : element (added), element (changed), id (removed)

### itemSubscribe(name, collectionName, id, callback)

Subscribes to an item in a collection (the collection need to be subscribed with same name and collection name parameter). Returns the subscriptionId.

#### Arguments

- `name` **string** *required* : name of the server subscription

- `collectionName` **string** *optional* : name of the collection you subscribe (in case  the subscription name is different than collection name)

- `id` **array** *required* : id of the item to subscribe to

- `callback` **function** *required* : callback called when there is a change to the item. Returns the element.

### itemUnsubscribe(name, collectionName, subId)

Unsubscribes to a item subscription.

#### Arguments

- `name` **string** *required* : name of the server subscription

- `collectionName` **string** *optional* : name of the collection you subscribe (in case  the subscription name is different than collection name)

- `subId` **string** *required* : id of the subscription


### method(name, [args], callback)

Call a method on the server

#### Arguments

- `name` **string** *required*
- `args` **array** *required*
- `callback` **method**


### loginWithEmail(email, password, callback)

Login to meteor server

#### Arguments

- `email` **string** *required*
- `password` **string** *required*
- `callback(err, result)` **method**

### loginWithUsername(username, password, callback)

Login to meteor server

#### Arguments

- `username` **string** *required*
- `password` **string** *required*
- `callback(err, result)` **method**

### loginWithToken(token, callback)

Login to meteor server via a token

#### Arguments

- `token` **string** *required*
- `callback(err, result)` **method**

### logout(callback)

Logout from meteor server
