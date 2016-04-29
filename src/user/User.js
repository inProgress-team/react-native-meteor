import { AsyncStorage } from 'react-native';

import Data from '../Data';
import { hashPassword } from '../../lib/utils';

const TOKEN_KEY = 'reactnativemeteor_usertoken';

module.exports = {
  user() {
    if(!this._userIdSaved) return null;

    return this.collection('users').findOne(this._userIdSaved);
  },
  userId() {
    if(!this._userIdSaved) return null;

    const user = this.collection('users').findOne(this._userIdSaved);
    return user && user._id;
  },
  _isLoggingIn: true,
  loggingIn() {
    return this._isLoggingIn;
  },
  logout(callback) {
    this.call("logout", err => {
      this.handleLogout();
      this.connect();

      typeof callback == 'function' && callback(err);
    });
  },
  handleLogout() {
    AsyncStorage.removeItem(TOKEN_KEY);
    Data._tokenIdSaved = null;
    this._userIdSaved = null;
  },
  loginWithGoogle(googleUser, callback) {
    this._startLoggingIn();
    this.call("login", {
      google: googleUser
    }, (err, result)=>{
      this._endLoggingIn();

      this._handleLoginCallback(err, result);

      typeof callback == 'function' && callback(err);
    });
  },
  loginWithPassword(selector, password, callback) {
    if (typeof selector === 'string') {
      if (selector.indexOf('@') === -1)
        selector = {username: selector};
      else
        selector = {email: selector};
    }

    this._startLoggingIn();
    this.call("login", {
        user: selector,
        password: hashPassword(password)
    }, (err, result)=>{
      this._endLoggingIn();

      this._handleLoginCallback(err, result);

      typeof callback == 'function' && callback(err);
    });
  },
  logoutOtherClients(callback = ()=>{}) {
    this.call('getNewToken', (err, res) => {
      if(err) return callback(err);

      this._handleLoginCallback(err, res);

      this.call('removeOtherTokens', err=>{
        callback(err);
      })
    });
  },
  _startLoggingIn() {
    this._isLoggingIn = true;
    Data.notify('loggingIn');
  },
  _endLoggingIn() {
    this._isLoggingIn = false;
    Data.notify('loggingIn');
  },
  _handleLoginCallback(err, result) {
    if(!err) {//save user id and token
      AsyncStorage.setItem(TOKEN_KEY, result.token);
      Data._tokenIdSaved = result.token;
      this._userIdSaved = result.id;
      Data.notify('onLogin');
    } else {
      Data.notify('onLoginFailure');
      this.handleLogout();
    }
    Data.notify('change');
  },
  async _loadInitialUser() {
    var value = null;
    try {
      value = await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
    } finally {
      Data._tokenIdSaved = value;
      if (value !== null){
        this._startLoggingIn();
        this.call('login', { resume: value }, (err, result) => {
          this._endLoggingIn();
          this._handleLoginCallback(err, result);
        });
      } else {
        this._endLoggingIn();
      }
    }

  }
}
