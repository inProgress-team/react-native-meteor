# react-native-meteor

[![react-native-meteor](http://img.shields.io/npm/dm/react-native-meteor.svg)](https://www.npmjs.org/package/react-native-meteor) [![npm version](https://badge.fury.io/js/react-native-meteor.svg)](http://badge.fury.io/js/react-native-meteor) [![Dependency Status](https://david-dm.org/inProgress-team/react-native-meteor.svg)](https://david-dm.org/inProgress-team/react-native-meteor)

Meteor-like methods for React Native.

If you have questions, you can open a new issue in the repository or ask in the our Gitter chat:  
https://gitter.im/react-native-meteor/Lobby

## What is it for ?

The purpose of this library is :

* To set up and maintain a ddp connection with a ddp server, freeing the developer from having to do it on their own.
* Be fully compatible with react-native and help react-native developers.
* **To match with [Meteor documentation](http://docs.meteor.com/) used with React.**

## Install

```
yarn add react-native-meteor
```

or

```
npm i --save react-native-meteor
```

[!! See detailed installation guide](https://github.com/inProgress-team/react-native-meteor/blob/master/docs/Install.md)

## Compatibility notes

Upgraded packages to working in RN >= 0.57

Since RN 0.26.0 you have to use ws or wss protocol to connect to your meteor server. http is not working on Android.

It is recommended to always use the latest version of react-native-meteor compatible with your RN version:

* For RN > 0.49, use `react-native-meteor@latest`
* For RN > 0.45, use `react-native-meteor@1.1.x`
* For RN = 0.45, use `react-native-meteor@1.0.6`
* For RN < 0.45, you can use version `react-native-meteor@1.0.3` in case or problems.

## Example usage

```javascript
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Meteor, { withTracker, MeteorListView } from 'react-native-meteor';

Meteor.connect('ws://192.168.X.X:3000/websocket'); //do this only once

class App extends Component {
  renderRow(todo) {
    return <Text>{todo.title}</Text>;
  }
  render() {
    const { settings, todosReady } = this.props;

    return (
      <View>
        <Text>{settings.title}</Text>
        {!todosReady && <Text>Not ready</Text>}

        <MeteorListView
          collection="todos"
          selector={{ done: true }}
          options={{ sort: { createdAt: -1 } }}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

export default withTracker(params => {
  const handle = Meteor.subscribe('todos');
  Meteor.subscribe('settings');

  return {
    todosReady: handle.ready(),
    settings: Meteor.collection('settings').findOne(),
  };
})(App);
```

## Documentation

- Learn how to getting started from [connecting your components](docs/connect-your-components.md).
- The [API reference](docs/api.md) lists all public APIs.
- Visit the [How To ?](docs/how-to.md) section for further information.

## Author

* Théo Mathieu ([@Mokto](https://github.com/Mokto)) from [inProgress](https://in-progress.io)
* Nicolas Charpentier ([@charpeni](https://github.com/charpeni))

![image](https://user-images.githubusercontent.com/7189823/40546483-68c5e734-5ffd-11e8-8dd4-bdd11d9fbc93.png)

## Want to help ?

Pull Requests and issues reported are welcome! :)

## License

react-native-meteor is [MIT Licensed](LICENSE).
