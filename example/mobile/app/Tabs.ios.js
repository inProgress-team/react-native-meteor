'use strict';

console.disableYellowBox = true;


import React, {
  Component,
  TabBarIOS
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

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
  selectTab(index) {
    this.setState({selectedTab: index});
  }
  render() {
    const { selectedTab } = this.state;
    //https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/Bars.html
    return (
      <TabBarIOS
        translucent={true}>
        <Icon.TabBarItem
          iconName="list"
          title="Todos"
          selected={selectedTab === 0}
          onPress={this.selectTab.bind(this, 0)}>
          <Todos />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="list"
          title="Todos ListView"
          selected={selectedTab === 1}
          onPress={this.selectTab.bind(this, 1)}>
          <TodosListView />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Status"
          iconName="security"
          selected={selectedTab === 2}
          onPress={this.selectTab.bind(this, 2)}>
          <Status />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}
