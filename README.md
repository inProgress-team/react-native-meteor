

# react-native-meteor
 [![react-native-meteor](http://img.shields.io/npm/dm/react-native-meteor.svg)](https://www.npmjs.org/package/react-native-meteor) [![npm version](https://badge.fury.io/js/react-native-meteor.svg)](http://badge.fury.io/js/react-native-meteor) [![Dependency Status](https://david-dm.org/inProgress-team/react-native-meteor.svg)](https://david-dm.org/inProgress-team/react-native-meteor)

Meteor-like methods for React Native.

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [react-native-meteor](#react-native-meteor)
	- [Compatibility notes](#compatibility-notes)
	- [What is it for ?](#what-is-it-for-)
	- [Install](#install)
	- [Example usage](#example-usage)
- [Connect your components](#connect-your-components)
	- [createContainer](#createcontainer)
		- [Example](#example)
	- [connectMeteor && getMeteorData](#connectmeteor-getmeteordata)
		- [Example](#example)
- [Reactive variables](#reactive-variables)
- [Additionals collection methods](#additionals-collection-methods)
- [ListView Components](#listview-components)
	- [MeteorListView Component](#meteorlistview-component)
		- [Example usage](#example-usage)
	- [MeteorComplexListView Component](#meteorcomplexlistview-component)
		- [Example usage](#example-usage)
- [API](#api)
	- [Meteor DDP connection](#meteor-ddp-connection)
		- [Meteor.connect(endpoint, options)](#meteorconnectendpoint-options)
		- [Meteor.disconnect()](#meteordisconnect)
	- [Meteor methods](#meteor-methods)
	- [Availables packages](#availables-packages)
		- [Convenience packages](#convenience-packages)
		- [ReactiveDict](#reactivedict)
		- [Meteor.Accounts](#meteoraccounts)
		- [FSCollection](#fscollection)
		- [Meteor.ddp](#meteorddp)
- [How To ?](#how-to-)
	- [react-native-router-flux](#react-native-router-flux)
- [Author](#author)
- [Want to help ?](#want-to-help-)

<!-- /TOC -->


## Compatibility notes

* Since RN 0.26.0 you have to use ws or wss protocol to connect to your meteor server. http is not working on Android.

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

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Meteor, { createContainer } from 'react-native-meteor';

Meteor.connect('ws://192.168.X.X:3000/websocket');//do this only once

class App extends Component {
  renderRow(todo) {
    return (
      <Text>{todo.title}</Text>
    );
  }
  render() {
    const { settings, todosReady } = this.props;

    <View>
      <Text>{settings.title}</Text>
        {!todosReady && <Text>Not ready</Text>}

        <MeteorListView
          collection="todos"
          selector={{done: true}}
          options={{sort: {createdAt: -1}}}
          renderRow={this.renderRow}
        />
    </View>

  }
}

export default createContainer(params=>{
  const handle = Meteor.subscribe('todos');
  Meteor.subscribe('settings');

  return {
    todosReady: handle.ready(),
    settings: Meteor.collection('settings').findOne()
  };
}, App)
```

# Connect your components

[Since Meteor 1.3, createContainer is the recommended way to populate your React Components](http://guide.meteor.com/v1.3/react.html#using-createContainer).

## createContainer

 Very similar to getMeteorData but your separate container components from presentational components.

### Example

```javascript
import Meteor, { createContainer } from 'react-native-meteor';


class Orders extends Component {
  render() {
    const { pendingOrders } = this.props;

    //...
    );
  }
}

export default createContainer(params=>{
  return {
    pendingOrders: Meteor.collection('orders').find({status: "pending"}),
  };
}, Orders)
```

## connectMeteor && getMeteorData

connectMeteor is a React Mixin which enables getMeteorData (the old way of populating meteor data into your components).

### Example

```javascript
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
class Orders extends Component {
  getMeteorData() {
    return {
      pendingOrders: Meteor.collection('orders').find({status: "pending"}),
    };
  }
  render() {
    const { pendingOrders } = this.props;

    //...
    );
  }
}
```

# Reactive variables

These variables can be used inside getMeteorData or createContainer. They will be populated into your component if they change.

* [Meteor.subscribe](http://docs.meteor.com/#/full/meteor_subscribe) : returns an handle. !! If the component which called subscribe is unmounted, the subscription is automatically canceled.
* Meteor.collection(collectionName)
  * [.find(selector, options)](http://docs.meteor.com/#/full/find)
  * [.findOne(selector, options)](http://docs.meteor.com/#/full/findone)
* [Meteor.user()](http://docs.meteor.com/#/full/meteor_user)
* [Meteor.userId()](http://docs.meteor.com/#/full/meteor_userid)
* [Meteor.status()](http://docs.meteor.com/#/full/meteor_status)
* [Meteor.loggingIn()](http://docs.meteor.com/#/full/meteor_loggingin)
* [ReactiveDict()](https://atmospherejs.com/meteor/reactive-dict)

# Additionals collection methods

These methods (except update) work offline. That means that elements are correctly updated offline, and when you reconnect to ddp, Meteor calls are taken care of.

* Meteor.collection(collectionName)
  * [.insert(doc, callback)](http://docs.meteor.com/#/full/insert)
  * [.update(id, modifier, [options], [callback])](http://docs.meteor.com/#/full/update)
  * [.remove(id, callback(err, countRemoved))](http://docs.meteor.com/#/full/remove)

# ListView Components
## MeteorListView Component

Same as [ListView](https://facebook.github.io/react-native/docs/listview.html) Component but does not need dataSource and accepts three arguments :

- `collection` **string** *required*
- `selector` [**string** / **object**]
- `options` **object**
- `listViewRef` [**string** / **function**] ref to ListView component.


### Example usage

```javascript
<MeteorListView
  collection="todos"
  selector={{done: true}}
  options={{sort: {createdAt: -1}}}
  renderRow={this.renderItem}
  //...other listview props
/>
```

## MeteorComplexListView Component

Same as [ListView](https://facebook.github.io/react-native/docs/listview.html) Component but does not need dataSource and accepts one argument. You may need it if you make complex requests combining multiples collections.

- `elements` **function** *required* : a reactive function which returns an array of elements.
- `listViewRef` [**string** / **function**] ref to ListView component.

### Example usage

```javascript
<MeteorComplexListView
  elements={()=>{return Meteor.collection('todos').find()}}
  renderRow={this.renderItem}
  //...other listview props
/>
```

# API

## Meteor DDP connection

### Meteor.connect(endpoint, options)

Connect to a DDP server. You only have to do this once in your app.

*Arguments*

- `url` **string** *required*
- `options` **object** Available options are :
  - autoConnect **boolean** [true] whether to establish the connection to the server upon instantiation. When false, one can manually establish the connection with the Meteor.ddp.connect method.
  - autoReconnect **boolean** [true] whether to try to reconnect to the server when the socket connection closes, unless the closing was initiated by a call to the disconnect method.
  - reconnectInterval **number** [10000] the interval in ms between reconnection attempts.

### Meteor.disconnect()

Disconnect from the DDP server.

## Meteor methods

* [Meteor.call](http://docs.meteor.com/#/full/meteor_call)
* [Meteor.loginWithPassword](http://docs.meteor.com/#/full/meteor_loginwithpassword) (Please note that user is auto-resigned in - like in Meteor Web applications - thanks to React Native AsyncStorage.)
* [Meteor.logout](http://docs.meteor.com/#/full/meteor_logout)
* [Meteor.logoutOtherClients](http://docs.meteor.com/#/full/meteor_logoutotherclients)

## Availables packages

###  Convenience packages
Example `import { composeWithTracker } from 'react-native-meteor';``

* EJSON
* Tracker
* composeWithTracker: If you want to use [react-komposer](https://github.com/kadirahq/react-komposer), you can use react-native-meteor compatible composeWithTracker
* Accounts (see below)

### ReactiveDict

See [documentation](https://atmospherejs.com/meteor/reactive-dict).


### Meteor.Accounts

`import { Accounts } from 'react-native-meteor';``

* [Accounts.createUser](http://docs.meteor.com/#/full/accounts_createuser)
* [Accounts.changePassword](http://docs.meteor.com/#/full/accounts_forgotpassword)
* [Accounts.forgotPassword](http://docs.meteor.com/#/full/accounts_changepassword)
* [Accounts.resetPassword](http://docs.meteor.com/#/full/accounts_resetpassword)
* [Accounts.onLogin](http://docs.meteor.com/#/full/accounts_onlogin)
* [Accounts.onLoginFailure](http://docs.meteor.com/#/full/accounts_onloginfailure)

### FSCollection

* Meteor.FSCollection(collectionName) : Helper for [Meteor-CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS). Full documentation [here](https://github.com/inProgress-team/react-native-meteor/blob/master/docs/FSCollection.md)
* This plugin also exposes a FSCollectionImagesPreloader component which helps you preload every image you want in CollectionFS (only available on ios)

```javascript
import { FSCollectionImagesPreloader } from 'react-native-meteor';

<FSCollectionImagesPreloader
  collection="imagesFiles"
  selector={{metadata.owner: XXX}}
/>
```

### Meteor.ddp

Once connected to the ddp server, you can access every method available in [ddp.js](https://github.com/mondora/ddp.js/).
* Meteor.ddp.on('connected')
* Meteor.ddp.on('added')
* Meteor.ddp.on('changed')
* ...

# How To ?

## react-native-router-flux

* You can use Switch with createContainer. Example :
```javascript
  componentWillMount() {
    this.scenes = Actions.create(
        <Scene key="root" component={createContainer(this.composer, Switch)} selector={this.selector} tabs={true}>
            <Scene key="loading" hideNavBar={true} component={Loading} />
            <Scene key="login" hideNavBar={true}>
              <Scene key="loginbis" component={Login} />
            </Scene>

            <Scene key="loggedIn" component={Layout}>
                <Scene key="main" hideNavBar={true}>
                    //...
                </Scene>
            </Scene>
        </Scene>
    );
  }
  composer() {
    return {
      connected: Meteor.status().connected,
      user: Meteor.user()
    }
  }
  selector(data, props) {
    if(!data.connected) {
      return "loading";
    } else if (!data.user) {
      return "login";
    } else {
      return "loggedIn";
    }
  }

```

# Author

* Théo Mathieu ([@Mokto](https://github.com/Mokto))
* From [inProgress](https://in-progress.io)

![inProgress](https://in-progress.io/wp-content/uploads/2016/04/LOGO-RESPONSIVE-IPG-01-copie-1.png?2a6543)

# Want to help ?

Pull Requests and issues reported are welcome ! :)
