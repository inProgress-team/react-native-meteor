# API

## Reactive variables

These variables can be used inside getMeteorData or createContainer. They will be populated into your component if they change.

* [Meteor.subscribe()](http://docs.meteor.com/#/full/meteor_subscribe)
* Meteor.collection(collectionName, options)
  * [.find(selector, options)](http://docs.meteor.com/#/full/find)
  * [.findOne(selector, options)](http://docs.meteor.com/#/full/findone)
* [Meteor.user()](http://docs.meteor.com/#/full/meteor_user)
* [Meteor.userId()](http://docs.meteor.com/#/full/meteor_userid)
* [Meteor.status()](http://docs.meteor.com/#/full/meteor_status)
* [Meteor.loggingIn()](http://docs.meteor.com/#/full/meteor_loggingin)
* [ReactiveDict()](https://atmospherejs.com/meteor/reactive-dict)

## Additionals collection methods

These methods (except update) work offline. That means that elements are correctly updated offline, and when you reconnect to ddp, Meteor calls are taken care of.

* Meteor.collection(collectionName, options)
  * [.insert(doc, callback)](http://docs.meteor.com/#/full/insert)
  * [.update(id, modifier, [options], [callback])](http://docs.meteor.com/#/full/update)
  * [.remove(id, callback(err, countRemoved))](http://docs.meteor.com/#/full/remove)

## ListView Components

### MeteorListView Component

Same as [ListView](https://facebook.github.io/react-native/docs/listview.html) Component but does not need dataSource and accepts three arguments :

* `collection` **string** _required_
* `selector` [**string** / **object**]
* `options` **object**
* `listViewRef` [**string** / **function**] ref to ListView component.

#### Example usage

```javascript
<MeteorListView
  collection="todos"
  selector={{ done: true }}
  options={{ sort: { createdAt: -1 } }}
  renderRow={this.renderItem}
  //...other listview props
/>
```

## MeteorComplexListView Component

Same as [ListView](https://facebook.github.io/react-native/docs/listview.html) Component but does not need dataSource and accepts one argument. You may need it if you make complex requests combining multiples collections.

* `elements` **function** _required_ : a reactive function which returns an array of elements.
* `listViewRef` [**string** / **function**] ref to ListView component.

### Example usage

```javascript
<MeteorComplexListView
  elements={() => {
    return Meteor.collection('todos').find();
  }}
  renderRow={this.renderItem}
  //...other listview props
/>
```

## Meteor Collections

### Meteor.subscribe

[Meteor.subscribe()](http://docs.meteor.com/#/full/meteor_subscribe) returns an handle. If the component which called subscribe is unmounted, the subscription is automatically canceled.

### Meteor.collection(collectionName, options)

You need pass the `cursoredFind` option when you get your collection if you want to use cursor-like method:

```javascript
Meteor.collection("collectionName", { cursoredFind: true })
```

Or you can simply use `find()` to get an array of documents. The option default to false for backward compatibility. Cursor methods are available to share code more easily between a react-native app and a standard Meteor app.

## Meteor DDP connection

### Meteor.connect(endpoint, options)

Connect to a DDP server. You only have to do this once in your app.

_Arguments_

* `url` **string** _required_
* `options` **object** Available options are :
  * autoConnect **boolean** [true] whether to establish the connection to the server upon instantiation. When false, one can manually establish the connection with the Meteor.ddp.connect method.
  * autoReconnect **boolean** [true] whether to try to reconnect to the server when the socket connection closes, unless the closing was initiated by a call to the disconnect method.
  * reconnectInterval **number** [10000] the interval in ms between reconnection attempts.

### Meteor.disconnect()

Disconnect from the DDP server.

## Meteor methods

* [Meteor.call](http://docs.meteor.com/#/full/meteor_call)
* [Meteor.loginWithPassword](http://docs.meteor.com/#/full/meteor_loginwithpassword) (Please note that user is auto-resigned in - like in Meteor Web applications - thanks to React Native AsyncStorage.)
* [Meteor.logout](http://docs.meteor.com/#/full/meteor_logout)
* [Meteor.logoutOtherClients](http://docs.meteor.com/#/full/meteor_logoutotherclients)

## Availables packages

### Convenience packages

Example `import { composeWithTracker } from 'react-native-meteor';`

* EJSON
* Tracker
* composeWithTracker: If you want to use [react-komposer](https://github.com/kadirahq/react-komposer), you can use react-native-meteor compatible composeWithTracker
* Accounts (see below)

### ReactiveDict

See [documentation](https://atmospherejs.com/meteor/reactive-dict).

### Meteor.Accounts

`import { Accounts } from 'react-native-meteor';`

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
