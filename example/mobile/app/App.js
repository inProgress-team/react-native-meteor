'use strict';

console.disableYellowBox = true;


import React, {
  Component
} from 'react-native';

import Meteor from 'react-native-meteor';

import Tabs from './Tabs';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0
    };
  }
  componentWillMount() {
    const url = 'http://'+(this.props.serverUrl || '192.168.1.139')+':3000/websocket';
    Meteor.connect(url);

    Meteor.ddp.on('connected', function() {
      console.log('CONNECTED');
    });

  }
  render() {
    return (
      <Tabs />
    );
  }
}
