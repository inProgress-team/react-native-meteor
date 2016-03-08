[![GitHub version](https://badge.fury.io/gh/inProgress-team%2Freact-native-meteor.svg)](https://badge.fury.io/gh/inProgress-team%2Freact-native-meteor)
[![npm version](https://badge.fury.io/js/react-native-meteor.svg)](http://badge.fury.io/js/react-native-meteor)
[![Dependency Status](https://david-dm.org/inProgress-team/react-native-meteor.svg)](https://david-dm.org/inProgress-team/react-native-meteor)
[![devDependency Status](https://david-dm.org/inProgress-team/react-native-meteor/dev-status.svg)](https://david-dm.org/inProgress-team/react-native-meteor#info=devDependencies)
[![MIT][license-badge]][license]
[![bitHound Score][bithound-badge]][bithound]

[bithound-badge]: https://www.bithound.io/github/inProgress-Team/react-native-meteor/badges/score.svg
[bithound]: https://www.bithound.io/github/inProgress-Team/react-native-meteor
[license-badge]: https://img.shields.io/dub/l/vibe-d.svg
[license]: https://github.com/inProgress-team/react-native-meteor/blob/master/LICENSE

# react-native-meteor

Meteor-like methods for React Native. **Currently in v1.0.0-beta5** ! For old docs, see [v0.6.2 documentation](https://github.com/inProgress-team/react-native-meteor/tree/0.6.2) (classic ddp interface).

## What is it for ?

The purpose of this library is :
* to set up and maintain a ddp connection with a ddp server, freeing the developer from having to do it on their own.
* be fully compatible with react-native and help react-native developers.
* **to match with [Meteor documentation](http://docs.meteor.com/) used with React.**

## Install

    npm i --save react-native-meteor

[!! See detailed installation guide](https://github.com/inProgress-team/react-native-meteor/blob/master/docs/Install.md)

## Example usage

```javascript

import { View, Text, Component } from 'react-native';
import Meteor, { connectMeteor } from 'react-native-meteor';

/*
* Uses decorators (see detailed installation to activate it)
* Or use :

  class Todos extends Component {
    ...
  }
  connectMeteor(Todos);
  export default Todos;

*/

@connectMeteor
export default class App extends Component {
  componentWillMount() {
    const url = 'http://192.168.X.X:3000/websocket';
    Meteor.connect(url);
  }
  startMeteorSubscriptions() {
    Meteor.subscribe('todos');
  }
  getMeteorData() {
    return {
      todos: Meteor.collection('todos').find()
    };
  }
  render() {
    const { todos } = this.data;

    {todos.map(todo=>{
      return (
        <View key={todo._id}>
          <Text>{todo.title}</Text>
        </View>
      )
    })}

  }
}
```

# connectMeteor

## startMeteorSubscriptions

Inside this method, you can create subscriptions (see below) when component is mounted. It will automatically unsubscribe if the component is unmounted.

#### [Meteor.subscribe](http://docs.meteor.com/#/full/meteor_subscribe)
##### Example usage

your server side:
```javascript
Meteor.publish('todos', function(done, options){
    return Todos.find({ done: done }, options);
});
```

your react-native client code:
```javascript
//Meteor subscribe can be used like on meteor official site
Meteor.subscribe('todos', true, {limit: 10, sort: {createdAt: -1}});
```


## getMeteorData

Inside getMeteorData, you can access any Meteor reactive data source, which means :

* Meteor.collection(collectionName)
  * [.find(selector, options)](http://docs.meteor.com/#/full/find)
  * [.findOne(selector, options)](http://docs.meteor.com/#/full/findone)
  * [.findOne(id)](http://docs.meteor.com/#/full/findone)
* [Meteor.user()](http://docs.meteor.com/#/full/meteor_user)
* [Meteor.userId()](http://docs.meteor.com/#/full/meteor_userid)
* [Meteor.status()](http://docs.meteor.com/#/full/meteor_status)
* [Meteor.loggingIn()](http://docs.meteor.com/#/full/meteor_loggingin)

# API

## Meteor.connect(endpoint, options)

Connect to a DDP server. You only have to do this once in your app.

#### Arguments

- `url` **string** *required*
- `options` **object** Available options are :
  - autoConnect **boolean** [true] whether to establish the connection to the server upon instantiation. When false, one can manually establish the connection with the Meteor.ddp.connect method.
  - autoReconnect **boolean** [true] whether to try to reconnect to the server when the socket connection closes, unless the closing was initiated by a call to the disconnect method.
  - reconnectInterval **number** [10000] the interval in ms between reconnection attempts.

## Meteor.disconnect()

Disconnect from the DDP server.

## Meteor methods

* [Meteor.loginWithPassword](http://docs.meteor.com/#/full/meteor_loginwithpassword) (Please note that user is auto-resigned in - like in Meteor Web applications - thanks to React Native AsyncStorage.)
* [Meteor.logout](http://docs.meteor.com/#/full/meteor_logout)
* [Meteor.call](http://docs.meteor.com/#/full/meteor_call)


## Meteor.ddp

Once connected to the ddp server, you can access every method available in [ddp.js](https://github.com/mondora/ddp.js/).
* Meteor.ddp.on('connected')
* Meteor.ddp.on('added')
* Meteor.ddp.on('changed')
* ...

# TODO

- [ ] [EJSON parameters support in subscribe and call](https://github.com/inProgress-team/react-native-meteor/issues/7)

Pull Requests are welcome ! :)
