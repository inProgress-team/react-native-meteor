'use strict';

console.disableYellowBox = true;


import React, {
  Component,
  TabBarIOS
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Todos from './Routes/Todos';
import FullTodos from './Routes/FullTodos';
import CollectionFS from './Routes/CollectionFS';
import Status from './Routes/Status';
import Settings from './Routes/Settings';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 4
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
          iconName="attach-file"
          title="CollectionFS"
          selected={selectedTab === 1}
          onPress={this.selectTab.bind(this, 1)}>
          <CollectionFS />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Status"
          iconName="security"
          selected={selectedTab === 2}
          onPress={this.selectTab.bind(this, 2)}>
          <Status />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Settings"
          iconName="settings"
          selected={selectedTab === 3}
          onPress={this.selectTab.bind(this, 3)}>
          <Settings />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="list"
          title="Full Todos"
          selected={selectedTab === 4}
          onPress={this.selectTab.bind(this, 4)}>
          <FullTodos />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}
