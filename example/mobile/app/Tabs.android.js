'use strict';

console.disableYellowBox = true;


import React, {
  Component,
  View
} from 'react-native';

import { Tab, TabLayout } from 'react-native-android-tablayout';

import Todos from './Routes/Todos';
import TodosListView from './Routes/TodosListView';
import Status from './Routes/Status';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0
    };
  }
  selectTab(e) {
    this.setState({selectedTab: e.nativeEvent.position});
  }
  render() {
    const { selectedTab } = this.state;
    return (
      <View style={{flex: 1}}>
        <TabLayout selectedTab={selectedTab} onTabSelected={this.selectTab.bind(this)}>
          <Tab name="Todos List"/>
          <Tab name="Status"/>
        </TabLayout>
        <View style={{flex: 1}}>
          {selectedTab === 0 &&
            <TodosListView />
          }
          {selectedTab == 1 &&
            <Status />
          }
        </View>
      </View>
    );
  }
}
