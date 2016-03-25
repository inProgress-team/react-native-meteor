'use strict';

console.disableYellowBox = true;


import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import Meteor, { connectMeteor, MeteorListView } from 'react-native-meteor';
import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/MaterialIcons';

@connectMeteor
export default class FullTodos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      done: false
    };
  }
  startMeteorSubscriptions() {
    Meteor.subscribe('todos');
  }
  changeDone() {
    this.setState({done: !this.state.done});
  }
  renderItem(todo) {
    return (
      <View key={todo._id} style={styles.item}>
        <Text style={{flex: 1}}>{todo.title}</Text>
      </View>
    )
  }
  render() {
    const { done } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          <Button containerStyle={styles.button} style={styles.buttonText} onPress={this.changeDone.bind(this)} >
            {done && 'Done'}
            {!done && 'Undone'}
          </Button>
        </View>
        <MeteorListView
          collection="todos"
          selector={{done: done}}
          renderRow={this.renderItem.bind(this)}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flex: 1,
    flexDirection: 'row'
  },
  buttonsContainer: {
    marginTop: 25,
    marginHorizontal: 10
  },
  button: {
    paddingVertical: 8,
    height:40,
    overflow:'hidden',
    borderRadius:4,
    backgroundColor: '#00BC8C',
    marginBottom: 5
  },
  buttonText: {
    fontSize: 18, color: 'white'
  }
});
