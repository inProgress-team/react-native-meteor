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

import Meteor, { connectMeteor, MeteorListView } from 'react-native-meteor';

@connectMeteor
export default class TodosListView extends Component {
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
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        <MeteorListView
          collection="todos"
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
  },
  header: {
    height: 24
  }
});
