import React, { Component, StyleSheet } from 'react-native';
import Meteor, { connectMeteor } from 'react-native-meteor';
import ExNavigator from '@exponent/react-native-navigator';
import Router from './router';

@connectMeteor
export default class RNApp extends Component {
  componentWillMount() {
    const url = 'http://localhost:3000/websocket';
    Meteor.connect(url);
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
