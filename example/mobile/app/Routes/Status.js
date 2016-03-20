'use strict';

console.disableYellowBox = true;


import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import Meteor, { Accounts, connectMeteor } from 'react-native-meteor';

import Button from 'react-native-button';


@connectMeteor
export default class Status extends Component {
  getMeteorData() {
    return {
      status: Meteor.status(),
      user: Meteor.user(),
      userId: Meteor.userId(),
      loggingIn: Meteor.loggingIn()
    };
  }
  startMeteorSubscriptions() {
    Meteor.subscribe('test', Meteor.userId());
  }
  signin() {
    Meteor.loginWithPassword('User', 'password', (err, res)=>{
      if(err) return console.log(err);
    });
  }
  changePassword() {
    Accounts.changePassword('password1', 'password', err=>{
      if(err) return console.log(err);

      console.log('password changed');
    });
  }
  forgotPassword() {
    Accounts.forgotPassword({
      email: 'contact@in-progress.io'
    }, err=>{
      if(err) return console.log(err);

      console.log('password forgotten. Email incoming');
    });
  }
  createUser() {
    console.log(Accounts);
    Accounts.createUser({
      username: 'mokto',
      password: '123456'
    }, (err, res)=>{
      console.log(err, res);
    });
  }
  signout() {
    Meteor.logout();
  }
  render() {
    const { status, user, userId, loggingIn } = this.data;
    //console.log(status, user, userId, loggingIn);
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          DDP : {' '}
          {status.connected && 'Connected'}
          {!status.connected && 'Disconnected'}
        </Text>
        <View style={{alignItems: 'center'}}>

        {loggingIn &&
          <Button onPress={this.signin.bind(this)} containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'orange'}}
                     style={{fontSize: 20, color: 'white'}}>
            Logging in ...
          </Button>
        }


        {!loggingIn && !user &&
          <Button onPress={this.createUser.bind(this)} containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#00BC8C', marginBottom: 20}}
                     style={{fontSize: 20, color: 'white'}}>
            Create user (mokto///123456)
          </Button>
        }


          {!loggingIn && !user &&
            <Button onPress={this.signin.bind(this)} containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#00BC8C', marginBottom: 20}}
                       style={{fontSize: 20, color: 'white'}}>
              Sign in (User///password)
            </Button>
          }
          {!loggingIn && !user &&
            <Button onPress={this.forgotPassword.bind(this)} containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#00BC8C'}}
                       style={{fontSize: 20, color: 'white'}}>
              Forgot Password
            </Button>
          }

          {!loggingIn && user &&
            <Button onPress={this.signout.bind(this)} containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'red', marginBottom: 20}}
                       style={{fontSize: 20, color: 'white'}}>
              Sign out
            </Button>
          }
          {!loggingIn && user &&
            <Button onPress={this.changePassword.bind(this)} containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#00BC8C'}}
                       style={{fontSize: 20, color: 'white'}}>
              Change password
            </Button>
          }

          {user &&
            <Text style={styles.welcome}>{user.username} / {userId}</Text>
          }
        </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
