'use strict';

console.disableYellowBox = true;


import React, {
  Component,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import meteor from 'react-native-meteor';
import Meteor, { MeteorMixin } from './meteor/Meteor';
import reactMixin from 'react-mixin';


@reactMixin.decorate(MeteorMixin)
export default class App extends Component {
  startMeteorSubscriptions() {
    //Meteor.subscribe('subitem');
  }
  render() {
    return null;
  }
}
