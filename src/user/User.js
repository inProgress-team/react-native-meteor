import { AsyncStorage } from 'react-native';

import Data from '../Data';
import { hashPassword } from '../../lib/utils';
import call from '../Call';

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
    call("logout", err => {
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
  loginWithPassword(selector, password, callback) {
    if (typeof selector === 'string') {
      if (selector.indexOf('@') === -1)
        selector = {username: selector};
      else
        selector = {email: selector};
    }

    this._startLoggingIn();
    call("login", {
        user: selector,
        password: hashPassword(password)
    }, (err, result)=>{
      this._endLoggingIn();

      this._handleLoginCallback(err, result);

      typeof callback == 'function' && callback(err);
    });
  },
  logoutOtherClients(callback = ()=>{}) {
    call('getNewToken', (err, res) => {
      if(err) return callback(err);

      this._handleLoginCallback(err, res);

      call('removeOtherTokens', err=>{
        callback(err);
      })
    });
  },
  _login(user, callback) {
    this._startLoggingIn();
    this.call("login", user, (err, result)=>{
      this._endLoggingIn();

      this._handleLoginCallback(err, result);

      typeof callback == 'function' && callback(err);
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
  _loginWithToken(value) {
    Data._tokenIdSaved = value;
    if (value !== null){
      this._startLoggingIn();
      call('login', { resume: value }, (err, result) => {
        this._endLoggingIn();
        this._handleLoginCallback(err, result);
      });
    } else {
      this._endLoggingIn();
    }
  },
  getAuthToken() {
    return Data._tokenIdSaved;
  },
  async _loadInitialUser() {
    var value = null;
    try {
      value = await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
    } finally {
      this._loginWithToken(value);
    }

  }
}
