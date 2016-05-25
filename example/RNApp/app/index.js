import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import Meteor, { connectMeteor } from 'react-native-meteor';
import {Scene, Router} from 'react-native-router-flux';

//import Router from './router';
import connect from './connect';

import RouteList from './routes/routeList';
import Connection from './routes/connection';
import Accounts from './routes/accounts';
import MeteorListView from './routes/meteorListView';
import MeteorComplexListView from './routes/meteorComplexListView';
import EditItem from './routes/editItem';

@connectMeteor
export default class RNApp extends Component {
  componentWillMount() {
    connect();
  }

  render() {
    return (
      <Router getSceneStyle={()=>styles.sceneStyle}>
        <Scene key="root">
          <Scene key="routelist" component={RouteList} title="Home"/>

          <Scene key="getMeteorConnection" component={Connection} title="Meteor Connection"/>
          <Scene key="getAccounts" component={Accounts} title="Accounts"/>
          <Scene key="getMeteorListView" component={MeteorListView} title="Meteor List View"/>
          <Scene key="getMeteorComplexListView" component={MeteorComplexListView} title="Meteor Complex List View"/>
          <Scene key="getEditItem" component={EditItem} title="Edit Item"/>
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
