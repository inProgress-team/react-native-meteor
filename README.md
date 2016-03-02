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

Meteor-like methods for React Native. **Currently in v1.0.0-beta1** ! For old docs, see [v0.6.2 documentation](https://github.com/inProgress-team/react-native-meteor/tree/0.6.2) (classic ddp interface).

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

# MeteorMixin

## startMeteorSubscriptions

Inside this method, you can create subscriptions (see below) when component is mounted. It will automatically unsubscribe if the component is unmounted.

#### [Meteor.subscribe](http://docs.meteor.com/#/full/meteor_subscribe)


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

## Meteor.connect(endpoint)

Connect to a DDP server. You only have to do this once in your app.

#### Arguments

- `url` **string** *required*

## Meteor methods

* [Meteor.call](http://docs.meteor.com/#/full/meteor_call)
* [Meteor.loginWithPassword](http://docs.meteor.com/#/full/meteor_loginwithpassword) (Please note that user is auto-resigned in - like in Meteor Web applications - thanks to React Native AsyncStorage.)
* [Meteor.logout](http://docs.meteor.com/#/full/meteor_logout)
