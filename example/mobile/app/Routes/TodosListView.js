'use strict';

console.disableYellowBox = true;


import React, {
  Component,
  StyleSheet,
  Text,
  View,
  ListView,
  TabBarIOS
} from 'react-native';

import Meteor, { connectMeteor } from 'react-native-meteor';

@connectMeteor
export default class TodosListView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ds: new ListView.DataSource({
        rowHasChanged: (row1, row2) => !_.isEqual(row1, row2),
      })
    };
  }
  getMeteorData() {
    return {
      todos: Meteor.collection('todos').find()
    };
  }
  startMeteorSubscriptions() {
    Meteor.subscribe('todos', {
       createdAt: {$gt: new Date()}
    });
  }
  renderItem(todo) {
    return (
      <View key={todo._id}>
        <Text>{todo.title}</Text>
      </View>
    )
  }
  render() {
    const { todos } = this.data;
    const { ds } = this.state;
    console.log(todos);
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        <ListView
          dataSource={ds.cloneWithRows(todos)}
          renderRow={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
});
