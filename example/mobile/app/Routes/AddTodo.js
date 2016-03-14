'use strict';

console.disableYellowBox = true;


import React, {
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Meteor, { connectMeteor } from 'react-native-meteor';

import Button from 'react-native-button';


@connectMeteor
export default class AddTodo extends Component {
  add() {
    const item = {
      title: 'yo'
    };

    Meteor.collection('todos').insert(item, (err, item)=> {
      console.log(err, item);
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.add.bind(this)}>Add Todo</Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
