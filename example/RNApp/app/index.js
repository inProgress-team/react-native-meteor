import React, { Component, View, Text } from 'react-native';

import SignIn from './containers/signIn';
import SignOut from './containers/signOut';

// import ddpClient from './ddp';
import Meteor, { connectMeteor } from 'react-native-meteor';

@connectMeteor
export default class RNApp extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   connected: false,
    //   signedIn: false
    // };
    this.data = {
      status: {},
      user: null
    }
  }

  // componentWillMount() {
  //   ddpClient.connect((error, wasReconnect) => {
  //     if (error) {
  //       this.setState({connected: false});
  //     } else {
  //       this.setState({connected: true});
  //       ddpClient.loginWithToken((err, res) => {
  //         if (!err) this.handleSignedInStatus(true);
  //       });
  //     }
  //   });
  // }

  componentWillMount() {
    const url = 'http://localhost:3000/websocket';
    Meteor.connect(url);
  }

  getMeteorData() {
    return {
      status: Meteor.status(),
      user: Meteor.user()
    };
  }

  // handleSignedInStatus(status = false) {
  //   this.setState({ signedIn: status });
  // }

  render() {
    const { status, user } = this.data;
    if (status.connected && user) {
      return (
        <SignOut
          // changedSignedIn={(status) => this.handleSignedInStatus(status)}
          />
      );
    } else if (status.connected) {
      return (
        <SignIn
          connected={status.connected}
          // changedSignedIn={(status) => this.handleSignedInStatus(status)}
          />
      );
    } else {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Connecting to Server...</Text>
        </View>
      )
    }
  }
}
