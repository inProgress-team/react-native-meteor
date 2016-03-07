'use strict';

console.disableYellowBox = true;


import React, {
  Component,
  StyleSheet,
  Text,
  View,

  TabBarIOS
} from 'react-native';

import Meteor from 'react-native-meteor';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Todos from './Routes/Todos';
import TodosListView from './Routes/TodosListView';
import Status from './Routes/Status';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0
    };
  }
  componentWillMount() {
    const url = 'http://'+this.props.serverUrl+':3000/websocket';
    Meteor.connect(url);

    Meteor.ddp.on('added', function(message) {
      console.log(message);
    });
  }
  render() {
    //https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/MobileHIG/Bars.html
    return (
      <TabBarIOS
        translucent={true}>
        <Icon.TabBarItem
          iconName="list"
          title="Todos"
          selected={this.state.selectedTab === 0}
          onPress={() => {this.setState({selectedTab: 0});}}>
          <Todos />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="list"
          title="Todos ListView"
          selected={this.state.selectedTab === 1}
          onPress={() => {this.setState({selectedTab: 1});}}>
          <TodosListView />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Status"
          iconName="security"
          selected={this.state.selectedTab === 2}
          onPress={() => {this.setState({selectedTab: 2});}}>
          <Status />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="More"
            iconName="list"
          selected={this.state.selectedTab === 3}
          onPress={() => {this.setState({selectedTab: 3});}}>
<View></View>
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}

/*


<View style={styles.container}>
  <TouchableHighlight onPress={()=>{this.setState({name: 1})}}>
    <Text style={styles.welcome}>
      Same pub
    </Text>
  </TouchableHighlight>
  <TouchableHighlight onPress={()=>{this.setState({name: 2})}}>
    <Text style={styles.welcome}>
      Diff pub
    </Text>
  </TouchableHighlight>
  <TouchableHighlight onPress={()=>{this.setState({subitem: !subitem})}}>
    <Text style={styles.welcome}>
      {subitem && 'Hide'}
      {!subitem && 'Show'}
      {' '}
      subitem
    </Text>
  </TouchableHighlight>
  {subitem &&
    <Subitem />
  }
</View>

*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
