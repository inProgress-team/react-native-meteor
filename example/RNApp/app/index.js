import React, { Component, View, Text, StyleSheet } from 'react-native';

import SignIn from './containers/signIn';
import SignOut from './containers/signOut';
import Items from './containers/items';
import Tabs from 'react-native-tabs';

import Meteor, { connectMeteor } from 'react-native-meteor';

@connectMeteor
export default class RNApp extends Component {
  constructor(props) {
    super(props);

    this.data = {
      status: {},
      user: null
    }
    this.state = {
      // page: 'account'
      page: 'items'
    }
  }

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

  renderAccountPage() {
    const { status, user } = this.data;
    if (user) {
      return <SignOut />;
    } else {
      return <SignIn />;
    }
  }

  render() {
    const { status, user } = this.data;
    const { page } = this.state;

    if (!status.connected) {
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text>Connecting to Server...</Text>
        </View>
      );
    }

    let SelectedComponent = null;

    if (page === 'account') {
      SelectedComponent = this.renderAccountPage();
    } else if (page === 'items') {
      SelectedComponent = <Items />;
    }

    return (
      <View style={styles.container}>
        {SelectedComponent}
        <Tabs
          selected={this.state.page}
          style={styles.tabStyle}
          selectedStyle={styles.tabSelectedStyle}
          onSelect={el=>this.setState({page:el.props.name})}
        >
            <Text name="account">Account</Text>
            <Text name="items">Items</Text>
        </Tabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B5998',
  },
  tabStyle: {
    backgroundColor:'white',
    borderTopWidth:2,
    borderTopColor:'red',
    height: 50
  },
  tabSelectedStyle: {
    color:'red'
  }
});
