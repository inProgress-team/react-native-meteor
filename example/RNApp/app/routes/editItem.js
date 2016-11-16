import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import Meteor from 'react-native-meteor';
import Button from '../components/button';

const { width } = Dimensions.get('window');

class EditItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: ''
    }
  }

  updateName() {
    const { name } = this.state;
    const { item } = this.props;
    Meteor.call('updateItemName', item._id, name);
  }

  handleRemove() {
    const { item } = this.props;
    Meteor.call('removeItem', item._id);
  }

  render() {
    let { item } = this.props;
    item = item || {};

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          defaultValue={item.name}
          onChangeText={(name) => this.setState({name})}
        />
        <View style={styles.buttonContainer}>
          <Button text="Save" onPress={this.updateName.bind(this)} />
        </View>
        <View style={styles.buttonContainer}>
          <Button text="Delete" onPress={this.handleRemove.bind(this)} />
        </View>
      </View>
    )
  }
}

export default EditItem;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 16
  },
  buttonContainer: {
    paddingVertical: 8
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    padding: 5,
    width: width - 32,
    backgroundColor: 'white'
  },
});
