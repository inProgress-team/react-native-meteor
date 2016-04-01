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

class Todos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      done: false
    };
  }
  getMeteorData() {
    const handle = Meteor.subscribe('todos', this.state.done);

    return {
      ready: handle.ready()
    };
  }
  add() {

    const item = {
      title: 'Todo added'
    };

    Meteor.collection('todos').insert(item, (err, item)=> {
      console.log(err, item);
    });
  }
  changeDone() {
    this.setState({done: !this.state.done});
  }
  edit(todo) {
    Meteor.collection('todos').update(todo._id, {
      $set: {
        title: 'NEW TITLE'
      }
    }, err=>{
      console.log(err);
    });
  }
  remove(todo) {
    Meteor.collection('todos').remove(todo._id, err=>{
      console.log(err);
    });
  }
  renderItem(todo) {
    return (
      <View key={todo._id} style={styles.item}>
        <Text style={{flex: 1}}>{todo.title}</Text>
        <TouchableOpacity onPress={this.edit.bind(this, todo)}>
          <Icon name="mode-edit" size={30} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.remove.bind(this, todo)}>
          <Icon name="delete" size={30} />
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    const { ready } = this.data;
    const { done } = this.state;
    console.log('ready', ready);
    return (
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          <Button containerStyle={styles.button} style={styles.buttonText} onPress={this.add.bind(this)}>Add Todo</Button>
          <Button containerStyle={styles.button} style={styles.buttonText} onPress={this.changeDone.bind(this)} >
            {done && 'Done'}
            {!done && 'Undone'}
          </Button>
        </View>
        <MeteorListView
          collection="todos"
          renderRow={this.renderItem.bind(this)}
        />
      </View>
    );
  }
}
connectMeteor(Todos)
export default Todos;

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
