import React, { Component } from 'react-native';

import SignIn from './containers/signIn';
import SignOut from './containers/signOut';

// import ddpClient from './ddp';

export default class RNApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      signedIn: false
    };
  }

  componentWillMount() {
    // ddpClient.connect((error, wasReconnect) => {
    //   if (error) {
    //     this.setState({connected: false});
    //   } else {
    //     this.setState({connected: true});
    //     ddpClient.loginWithToken((err, res) => {
    //       if (!err) this.handleSignedInStatus(true);
    //     });
    //   }
    // });
  }

  handleSignedInStatus(status = false) {
    this.setState({ signedIn: status });
  }

  render() {
    let { connected, signedIn } = this.state;
    if (connected && signedIn) {
      return (
        <SignOut
          changedSignedIn={(status) => this.handleSignedInStatus(status)}
          />
      );
    } else {
      return (
        <SignIn
          connected={connected}
          changedSignedIn={(status) => this.handleSignedInStatus(status)}
          />
      );
    }
  }
}
