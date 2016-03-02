'use strict';

console.disableYellowBox = true;


import React, {
  Component,
  StyleSheet,
  Text,
  View,
  ScrollView,
  SegmentedControlIOS,
  TabBarIOS
} from 'react-native';

import Meteor, { connectMeteor } from 'react-native-meteor';


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
    Meteor.subscribe('todos', this.state.done);
  }
  changeDone(state) {
    if(state=='Done') {
      this.setState({done: true});
    } else {
      this.setState({done: false});
    }
  }
  render() {
    const { todos } = this.data;
    return (
      <View style={styles.container}>
        <View style={{marginBottom: 10, marginTop: 25}}>
          <SegmentedControlIOS selectedIndex={0} onValueChange={this.changeDone.bind(this)} style={{width: 150}} values={['Undone', 'Done']} />
        </View>
        <ScrollView style={{flex: 1}}>
          {todos.map(todo=>{
            return (
              <View key={todo._id}>
                <Text>{todo.title}</Text>
              </View>
            )
          })}
        </ScrollView>
      </View>
    );
  }
}
connectMeteor(Todos)
export default Todos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
});
