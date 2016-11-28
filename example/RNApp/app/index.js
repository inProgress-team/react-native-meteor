import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {Scene, Router} from 'react-native-router-flux';

import connect from './connect';

import RouteList from './routes/routeList';
import ConnectionContainer from './containers/connection';
import AccountsContainer from './containers/accounts';
import MeteorListViewContainer from './containers/meteorListView';
import MeteorComplexListViewContainer from './containers/meteorComplexListView';
import EditItemContainer from './containers/editItem';

export default class RNApp extends Component {

  componentWillMount() {
    connect();
  }

  render() {
    return (
      <Router getSceneStyle={()=>styles.sceneStyle}>
        <Scene key="root">
          <Scene key="routelist" component={RouteList} title="Home"/>

          <Scene key="getMeteorConnection" component={ConnectionContainer} title="Meteor Connection"/>
          <Scene key="getAccounts" component={AccountsContainer} title="Accounts"/>
          <Scene key="getMeteorListView" component={MeteorListViewContainer} title="Meteor List View"/>
          <Scene key="getMeteorComplexListView" component={MeteorComplexListViewContainer} title="Meteor Complex List View"/>
          <Scene key="getEditItem" component={EditItemContainer} title="Edit Item"/>
        </Scene>
      </Router>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  sceneStyle: {
    paddingTop: 64
  }
});
