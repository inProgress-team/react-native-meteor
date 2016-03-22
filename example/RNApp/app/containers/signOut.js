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
      user: Meteor.user()
    };
  }

  handleSignOut() {
    Meteor.logout();
  }

  render() {
    const { user } = this.data;
    let email;

    if (user) {
      email = user.emails[0].address;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.main}>
          Sign Out Screen
        </Text>
        <Text>{email}</Text>
        <Button text="Sign Out" onPress={() => this.handleSignOut()}/>
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
