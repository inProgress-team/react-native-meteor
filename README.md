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

Meteor-like methods for React Native. **Currently in v1.0.0-beta16** ! For old docs, see [v0.6.2 documentation](https://github.com/inProgress-team/react-native-meteor/tree/0.6.2) (classic ddp interface).

## What is it for ?

The purpose of this library is :
* to set up and maintain a ddp connection with a ddp server, freeing the developer from having to do it on their own.
* be fully compatible with react-native and help react-native developers.
* **to match with [Meteor documentation](http://docs.meteor.com/) used with React.**

## Install

    npm i --save react-native-meteor@latest

[!! See detailed installation guide](https://github.com/inProgress-team/react-native-meteor/blob/master/docs/Install.md)

## Example usage

```javascript

import { View, Text, Component } from 'react-native';
import Meteor, { connectMeteor, MeteorListView } from 'react-native-meteor';

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
    Meteor.subscribe('settings');
  }
  getMeteorData() {
    return {
      settings: Meteor.collection('settings').findOne()
    };
  }
  renderRow(todo) {
    return (
      <Text>{todo.title}</Text>
    );
  }
  render() {
    const { settings } = this.data;

    <View>
      <Text>{settings.title}</Text>
        <MeteorListView
          collection="todos"
          selector={{done: true}}
          options={{sort: {createdAt: -1}}}
          renderRow={this.renderRow}
        />
    </View>

  }
}
```

# connectMeteor

## startMeteorSubscriptions

Inside this method, you can create subscriptions (see below) when component is mounted. It will automatically unsubscribe if the component is unmounted.

* [Meteor.subscribe](http://docs.meteor.com/#/full/meteor_subscribe)

## getMeteorData

Inside getMeteorData, you can access any Meteor reactive data source, which means :

* Meteor.collection(collectionName)
  * [.find(selector, options)](http://docs.meteor.com/#/full/find)
  * [.findOne(selector, options)](http://docs.meteor.com/#/full/findone)
* [Meteor.user()](http://docs.meteor.com/#/full/meteor_user)
* [Meteor.userId()](http://docs.meteor.com/#/full/meteor_userid)
* [Meteor.status()](http://docs.meteor.com/#/full/meteor_status)
* [Meteor.loggingIn()](http://docs.meteor.com/#/full/meteor_loggingin)

# Additionals collection methods

* Meteor.collection(collectionName)
  * [.insert(doc, callback)](http://docs.meteor.com/#/full/insert)
  * [.update(id, modifier, [options], [callback])](http://docs.meteor.com/#/full/update) (not implemented yet)
  * [.upsert(id, modifier, [options], [callback])](http://docs.meteor.com/#/full/upsert) (not implemented yet)
  * [.remove(id, callback(err, countRemoved))](http://docs.meteor.com/#/full/remove)
* Meteor.FSCollection(collectionName) : Helper for [Meteor-CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS). Full documentation [here](https://github.com/inProgress-team/react-native-meteor/blob/master/docs/FSCollection.md)

# MeteorListView Component

Same as [ListView](https://facebook.github.io/react-native/docs/listview.html) Component but does not need dataSource and accepts three arguments :

- `collection` **string** *required*
- `selector` [**string** / **object**]
- `options` **object**

### Example usage

```javascript
<MeteorListView
  collection="todos"
  selector={{done: true}}
  options={{sort: {createdAt: -1}}}
  renderRow={this.renderItem}
/>
```

# API

## Meteor DDP connection

#### Meteor.connect(endpoint, options)

Connect to a DDP server. You only have to do this once in your app.

#### Arguments

- `url` **string** *required*
- `options` **object** Available options are :
  - autoConnect **boolean** [true] whether to establish the connection to the server upon instantiation. When false, one can manually establish the connection with the Meteor.ddp.connect method.
  - autoReconnect **boolean** [true] whether to try to reconnect to the server when the socket connection closes, unless the closing was initiated by a call to the disconnect method.
  - reconnectInterval **number** [10000] the interval in ms between reconnection attempts.

#### Meteor.disconnect()

Disconnect from the DDP server.

## Meteor methods

* [Meteor.call](http://docs.meteor.com/#/full/meteor_call)
* [Meteor.loginWithPassword](http://docs.meteor.com/#/full/meteor_loginwithpassword) (Please note that user is auto-resigned in - like in Meteor Web applications - thanks to React Native AsyncStorage.)
* [Meteor.logout](http://docs.meteor.com/#/full/meteor_logout)
* [Meteor.logoutOtherClients](http://docs.meteor.com/#/full/meteor_logoutotherclients)

## Meteor.Accounts

* [Accounts.createUser](http://docs.meteor.com/#/full/accounts_createuser)
* [Accounts.changePassword](http://docs.meteor.com/#/full/accounts_forgotpassword)
* [Accounts.forgotPassword](http://docs.meteor.com/#/full/accounts_changepassword)

## Meteor.ddp

Once connected to the ddp server, you can access every method available in [ddp.js](https://github.com/mondora/ddp.js/).
* Meteor.ddp.on('connected')
* Meteor.ddp.on('added')
* Meteor.ddp.on('changed')
* ...

# TODO

- [X] [Helper for Meteor-CollectionFS](https://github.com/inProgress-team/react-native-meteor/issues/18)
- [ ] [Accounts Methods 0/4](https://github.com/inProgress-team/react-native-meteor/issues/30)
- [ ] [Meteor user methods 0/2](https://github.com/inProgress-team/react-native-meteor/issues/31)
- [ ] [Update and upsert methods 0/2](https://github.com/inProgress-team/react-native-meteor/issues/24)
- [X] [When disconnected, minimongo insert is pushing data to view but not send to server when reconnecting.](https://github.com/inProgress-team/react-native-meteor/issues/29)

Pull Requests are welcome ! :)
