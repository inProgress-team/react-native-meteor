import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Dimensions } from 'react-native';
import Meteor, { connectMeteor, Accounts } from 'react-native-meteor';
import Button from '../components/button';

const { width } = Dimensions.get('window');

@connectMeteor
class AccountsComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      error: null,
      oldPassword: '',
      newPassword: ''
    }
  }

  getMeteorData() {
    return {
      loggingIn: Meteor.loggingIn(),
      user: Meteor.user(),
      userId: Meteor.userId()
    }
  }

  renderLogout() {
    const changePassword = () => {
      Accounts.changePassword(this.state.oldPassword, this.state.newPassword, (error) => {
        if (error) {
          this.setState({ error: error.reason, oldPassword: '', newPassword: '' });
        } else {
          this.setState({ error: null, oldPassword: '', newPassword: '' });
        }
      });
    }

    return (
      <View>
        <View style={styles.buttonContainer}>
          <Button text="Logout" onPress={() => Meteor.logout()} />
        </View>
        <View style={styles.buttonContainer}>
          <Button text="Logout Other Clients" onPress={() => Meteor.logoutOtherClients()} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Old Password"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(password) => this.setState({oldPassword: password})}
          secureTextEntry={true}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(password) => this.setState({newPassword: password})}
          secureTextEntry={true}
        />
        <View style={styles.buttonContainer}>
          <Button text="Change Password" onPress={changePassword} />
        </View>

      </View>
    )
  }

  renderLogin() {
    const login = () => {
      Meteor.loginWithPassword(this.state.email, this.state.password, (err) => {
        if (err) {
          this.setState({ error: err.reason, email: '', password: '' });
        } else {
          this.setState({ error: null, email: '', password: '' });
        }
      });
    };

    return (
      <View style={styles.buttonContainer}>
        <Button text="Login" onPress={login} />
      </View>
    )
  }

  renderSignup() {
    const signup = () => {
      Accounts.createUser({email: this.state.email, password: this.state.password}, (err) => {
        if (err) {
          this.setState({ error: err.reason, email: '', password: '' });
        } else {
          this.setState({ error: null, email: '', password: '' });
        }
      });
    };

    return (
      <View style={styles.buttonContainer}>
        <Button text="Sign Up" onPress={signup} />
      </View>
    )
  }

  renderForgotPassword() {
    const forgotPassword = () => {
      Accounts.forgotPassword({ email: this.state.email }, (error) => {
        if (error) {
          this.setState({ error: error.reason, email: '', password: '' });
        } else {
          this.setState({ error: null, email: '', password: '' });
        }
      });
    };

    return (
      <View style={styles.buttonContainer}>
        <Button text="Forgot Password" onPress={forgotPassword} />
      </View>
    )
  }

  renderLoginAndSignup() {
    return (
      <View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(email) => this.setState({email})}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={(password) => this.setState({password})}
          secureTextEntry={true}
        />
        {this.renderLogin()}
        {this.renderSignup()}
        {this.renderForgotPassword()}
      </View>
    );
  }

  render() {
    const { loggingIn, userId, user } = this.data;
    const { error } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Logging In: <Text style={styles.normal}>{loggingIn.toString()}</Text>
        </Text>
        <Text style={styles.text}>
          User ID: <Text style={styles.normal}>{userId}</Text>
        </Text>
        <Text style={styles.text}>
          User: <Text style={styles.normal}>{user ? user.emails[0].address : null}</Text>
        </Text>
        <Text style={styles.errorText}>
          {error}
        </Text>
        {user ? this.renderLogout() : this.renderLoginAndSignup()}
      </View>
    );
  }
}

export default AccountsComponent;

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
  errorText: {
    fontSize: 16,
    color: 'red'
  },
  buttonContainer: {
    marginVertical: 8
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
  }
});
