import User from './User';
import Meteor from './Meteor';
import { hashPassword } from '../utils';

export default {
  createUser(options, callback) {
    if (options.username) options.username = options.username;
    if (options.email) options.email = options.email;

    // Replace password with the hashed password.
    options.password = hashPassword(options.password);

    User._startLoggingIn();
    Meteor.call("createUser", options, (err, result)=>{
      User._endLoggingIn();

      User._handleLoginCallback(err, result);

      typeof callback == 'function' && callback(err);
    });
  },
}
