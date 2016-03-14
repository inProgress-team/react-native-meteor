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
    return {
      todos: Meteor.collection('todos').find()
    };
  }
  startMeteorSubscriptions() {
    console.log(this.state.done);
    Meteor.subscribe('todos', this.state.done);
  }
  changeDone() {
    console.log('plouf');
    this.setState({done: !this.state.done});
  }
  edit(todo) {
    console.log('edit', todo);
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
    const { todos } = this.data;
    const { done } = this.state;
    console.log(todos);
    return (
      <View style={styles.container}>
        <View style={{marginTop: 25}}>
        <Button containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'green'}}
                 style={{fontSize: 20, color: 'white'}} onPress={this.changeDone.bind(this)}
          >
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
  }
});
