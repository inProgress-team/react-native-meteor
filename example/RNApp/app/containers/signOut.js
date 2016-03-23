import React, {
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Button from '../components/button';
import Meteor, { connectMeteor } from 'react-native-meteor';

@connectMeteor
export default class SignOut extends Component {
  constructor(props) {
    super(props);

    this.data = {
      user: null
    }
  }

  getMeteorData() {
    return {
      user: Meteor.user(),
      userId: Meteor.userId()
    };
  }

  handleSignOut() {
    Meteor.logout();
  }

  handleLogoutOtherClients() {
    Meteor.logoutOtherClients()
  }

  render() {
    const { user, userId } = this.data;
    let email;

    if (user) {
      email = user.emails[0].address;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.main}>
          Sign Out Screen
        </Text>
        <Text>User Email: {email}</Text>
        <Text>User ID: {userId}</Text>
        <Button text="Logout" onPress={() => this.handleSignOut()}/>
        <Button text="Logout other clients" onPress={() => this.handleLogoutOtherClients()}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  main: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  }
});
