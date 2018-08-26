import React, { Component } from 'react';
import Meteor, { withTracker } from 'react-native-meteor';
import AccountsComponent from '../routes/accounts';

export default AccountContainer = withTracker((ownProps) => {
  return {
    loggingIn: Meteor.loggingIn(),
    user: Meteor.user(),
    userId: Meteor.userId(),
  }
})(AccountsComponent);
