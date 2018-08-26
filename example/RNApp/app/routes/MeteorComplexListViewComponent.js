import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Meteor, { MeteorComplexListView } from 'react-native-meteor';

class MeteorComplexListViewComponent extends Component {

  renderRow(item) {
    return (
      <View style={styles.row}>
        <Text style={styles.rowText}>{item.name}</Text>
        <TouchableOpacity>
          <Text style={[styles.rowText, styles.deleteText]}>X</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { itemsReady } = this.props;

    if (!itemsReady) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      )
    }


    return (
      <View style={styles.container}>
        <MeteorComplexListView
          style={styles.container}
          elements={()=>{return Meteor.collection('items').find()}}
          renderRow={this.renderRow}
        />
      </View>
    );

  }
}

export default MeteorComplexListViewComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC'
  },
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCCCCC',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowText: {
    fontSize: 16
  },
  deleteText: {
    color: 'red',
    fontWeight: '700'
  }
});
