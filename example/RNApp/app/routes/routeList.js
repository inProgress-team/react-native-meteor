
import React, { Component } from 'react';
import { View, Text, ListView, StyleSheet, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

const ROUTE_LIST = [
  { name: 'Meteor Connection', route: 'getMeteorConnection' },
  { name: 'Accounts', route: 'getAccounts' },
  { name: 'Meteor List View', route: 'getMeteorListView' },
  { name: 'Meteor Complex List View', route: 'getMeteorComplexListView' },
  { name: 'Edit Item', route: 'getEditItem' }
];

class RouteList extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(ROUTE_LIST),
    };
  }

  onPress(row) {
    Actions[row.route]();
  }

  renderRow(row) {
    return (
      <TouchableOpacity style={styles.row} onPress={() => this.onPress(row)}>
        <Text style={styles.rowText}>{row.name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
    );
  }
}

export default RouteList;

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC',
    padding: 16
  },
  rowText: {
    fontSize: 16
  }
});
