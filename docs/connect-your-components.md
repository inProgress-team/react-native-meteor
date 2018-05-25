# Connect your components

The `withTracker` function now replaces the previous function `createContainer`, however it remains as part of the package for backwards compatibility.

## withTracker

A HOC function, which allows you to create a container component which provides data to your presentational components.

### Example

```javascript
import Meteor, { withTracker } from 'react-native-meteor';


class Orders extends Component {
  render() {
    const { pendingOrders } = this.props;

    //...
    );
  }
}

export default withTracker(params => {
  return {
    pendingOrders: Meteor.collection('orders').find({ status: "pending" }),
  };
})(Orders);
```

## createContainer (Deprecated)

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

export default createContainer(params => {
  return {
    pendingOrders: Meteor.collection('orders').find({ status: "pending" }),
  };
}, Orders);
```

## connectMeteor && getMeteorData (Deprecated)

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
    const { pendingOrders } = this.data;

    //...
    );
  }
}
```
