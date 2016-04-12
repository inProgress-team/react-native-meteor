import React from 'react-native';

import RouteList from './routes/routeList';
import Connection from './routes/connection';
import Accounts from './routes/accounts';
import MeteorListView from './routes/meteorListView';
import MeteorComplexListView from './routes/meteorComplexListView';
import EditItem from './routes/editItem';

const Router = {
  getList() {
    return {
      renderScene(nav) {
        return <RouteList navigator={nav} />
      },

      getTitle() {
        return 'Home';
      }
    }
  },

  getMeteorConnection() {
    return {
      renderScene(nav) {
        return <Connection navigator={nav} />
      },

      getTitle() {
        return 'Meteor Connection';
      }
    }
  },

  getAccounts() {
    return {
      renderScene(nav) {
        return <Accounts navigator={nav} />
      },

      getTitle() {
        return 'Accounts';
      }
    }
  },

  getMeteorListView() {
    return {
      renderScene(nav) {
        return <MeteorListView navigator={nav} />
      },

      getTitle() {
        return 'Meteor List View';
      }
    }
  },

  getMeteorComplexListView() {
    return {
      renderScene(nav) {
        return <MeteorComplexListView navigator={nav} />;
      },

      getTitle() {
        return 'Meteor Complex List View';
      }
    }
  },

  getEditItem() {
    return {
      renderScene(nav) {
        return <EditItem navigator={nav} />;
      },

      getTitle() {
        return 'Edit Item';
      }
    }
  }
};

export default Router;
