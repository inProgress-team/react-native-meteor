[![Dependency Status](https://david-dm.org/inProgress-team/react-native-meteor.svg)](https://david-dm.org/inProgress-team/react-native-meteor)
[![devDependency Status](https://david-dm.org/inProgress-team/react-native-meteor/dev-status.svg)](https://david-dm.org/inProgress-team/react-native-meteor#info=devDependencies)

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

    meteor.connect('http://inprogresstest.meteor.com/websocket');

    meteor.on('connected', function () {
      console.log('connected');
    });

    meteor.suscribe('tasks', function (tasks) {
      self.setState({
        dataSource: self.state.dataSource.cloneWithRows(tasks),
        loaded: true
      });
    });
 },
 componentWillUnmount: function () {
   meteor.unsuscribe('tasks');
 }
});
```
## Public API

### connect(url)

Connect to a ddp server. You have to this only once in your app.

#### Arguments

- `url` **string** *required*



### suscribe(name, params, callback)

Subscribes to a server publication.

#### Arguments

- `name` **string** *required* : name of the server publication

- `params` **array** *optional* : parameters to pass to the server publish function.

- `callback` **function** *required* : callback called when there is a change in the publication. Returns all elements.

### unsuscribe(name)

Unsubscribes to a server publication.

#### Arguments

- `name` **string** *required* : name of the server publication
