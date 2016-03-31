import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';

import Button from '../components/button';
import Meteor, { connectMeteor, MeteorListView } from 'react-native-meteor';

const WIDTH = Dimensions.get('window').width;

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
      <View style={styles.row}>
        <Text>{item.name}</Text>
      </View>
    );
  }

  render() {
    const { items } = this.data;

    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.main]}>Items Screen</Text>
        <Text style={[styles.text, styles.sub]}>Total Items Count: {items.length}</Text>
        <MeteorListView
          collection="items"
          selector={{}}
          options={{sort: {createdAt: -1}}}
          renderRow={this.renderItem}
          />
        <View style={styles.buttons}>
          <Button text="Add Item" onPress={() => this.handleAddItem()}/>
          <Button text="Remove Item" onPress={() => this.handleRemoveItem()}/>
        </View>
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
  sub: {
    marginBottom: 8
  },
  buttons: {
    flexDirection: 'row',
    marginBottom: 50,
    width: WIDTH,
    justifyContent: 'center'
  },
  text: {
    color: '#fff',
    fontWeight: '500'
  },
  row: {
    flex: 1,
    width: WIDTH,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 1
  }
});
