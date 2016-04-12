import React, { Component, StyleSheet } from 'react-native';
import Meteor, { connectMeteor } from 'react-native-meteor';
import ExNavigator from '@exponent/react-native-navigator';
import Router from './router';
import connect from './connect';

@connectMeteor
export default class RNApp extends Component {
  componentWillMount() {
    connect();
  }

  render() {
    return (
      <ExNavigator
        initialRoute={Router.getList()}
        style={styles.container}
        sceneStyle={styles.sceneStyle}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sceneStyle: {
    paddingTop: 64
  }
});
