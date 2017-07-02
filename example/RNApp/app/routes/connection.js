
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import Meteor, { connectMeteor } from 'react-native-meteor';

import Button from '../components/button';
import connect from '../connect';

class Connection extends Component {

  handleConnectPress() {
    connect();
  }

  handleDisconnectPress() {
    Meteor.disconnect()
  }

  render() {
    const { status } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Connected: <Text style={styles.normal}>{status.connected.toString()}</Text>
        </Text>
        <Text style={styles.text}>
          Status: <Text style={styles.normal}>{status.status}</Text>
        </Text>

        <View style={styles.buttonContainer}>
          <Button text="Connect" onPress={this.handleConnectPress} />
        </View>
        <View style={styles.buttonContainer}>
          <Button text="Disconnect" onPress={this.handleDisconnectPress} />
        </View>
      </View>
    );
  }
}

Connection.propTypes = {
  status: PropTypes.object.isRequired
};

export default Connection;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 16
  },
  text: {
    fontSize: 16,
    fontWeight: '600'
  },
  normal: {
    fontWeight: '400'
  },
  buttonContainer: {
    marginVertical: 8
  }
});
