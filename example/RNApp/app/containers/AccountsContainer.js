import React, { Component } from 'react';
import Meteor, { withTracker } from 'react-native-meteor';
import AccountsComponent from '../routes/AccountsComponent';

export default withTracker((ownProps) => {
  return {
    loggingIn: Meteor.loggingIn(),
    user: Meteor.user(),
    userId: Meteor.userId(),
  }
})(AccountsComponent);
