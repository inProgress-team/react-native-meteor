import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Meteor, { connectMeteor, MeteorListView } from 'react-native-meteor';
import Button from '../components/button';

class MeteorListViewComponent extends Component {

  renderRow(item) {
    return (
      <View style={styles.row}>
        <Text style={styles.rowText}>{item.name}</Text>
        <TouchableOpacity onPress={() => Meteor.call('removeItem', item._id)}>
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
        <View style={styles.buttonContainer}>
          <Button text="Add Item" onPress={() => Meteor.call('addItem')} />
        </View>

        <MeteorListView
          collection="items"
          style={styles.container}
          // selector={{}}
          options={{sort: {createdAt: -1}}}
          renderRow={this.renderRow}
        />
      </View>
    );
  }
}

MeteorListViewComponent.propTypes = {
  itemsReady: PropTypes.bool.isRequired
};

export default MeteorListViewComponent;

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
