import React, {
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Button from '../components/button';
import Meteor, { connectMeteor, MeteorListView } from 'react-native-meteor';

@connectMeteor
export default class SignOut extends Component {
  constructor(props) {
    super(props);

    this.data = {
      items: []
    }
  }

  startMeteorSubscriptions() {
    Meteor.subscribe('items');
  }

  getMeteorData() {
    return {
      items: Meteor.collection('items').find()
    };
  }

  handleAddItem() {
    Meteor.call('addItem');
  }

  handleRemoveItem() {
    Meteor.call('removeItem');
  }

  renderItem(item) {
    return (
      <View>
        <Text>{item.name}</Text>
      </View>
    );
  }

  render() {
    const { items } = this.data;

    return (
      <View style={styles.container}>
        <Text style={styles.main}>Items Screen</Text>
        <Text>Total Items Count: {items.length}</Text>
        <View style={styles.buttons}>
          <Button text="Add Item" onPress={() => this.handleAddItem()}/>
          <Button text="Remove Item" onPress={() => this.handleRemoveItem()}/>
        </View>
        <MeteorListView
          collection="items"
          selector={{}}
          options={{sort: {createdAt: -1}}}
          renderRow={this.renderItem}
          />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  main: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 20
  },
  buttons: {
    flexDirection: 'row'
  }
});
