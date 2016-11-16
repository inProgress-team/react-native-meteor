import React, { Component } from 'react';
import Meteor, { createContainer } from 'react-native-meteor';
import AccountsComponent from '../routes/accounts';

export default AccountContainer = createContainer((ownProps) => {
  return {
    loggingIn: Meteor.loggingIn(),
    user: Meteor.user(),
    userId: Meteor.userId(),
  }
}, AccountsComponent);
