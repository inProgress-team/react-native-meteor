'use strict';


import React, {
  Component,
  StyleSheet,
  View
} from 'react-native';

import Meteor, { connectMeteor } from 'react-native-meteor';
import Button from 'react-native-button';

@connectMeteor
export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }
  getMeteorData() {
    return {
      settings: Meteor.collection('settings').findOne()
    };
  }
  render() {
    const { show } = this.state;
    const { settings } = this.data;
    console.log(settings);
    return (
      <View style={styles.container}>
        <View style={{marginTop: 25}}>
        <Button containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'green'}}
                 style={{fontSize: 20, color: 'white'}} onPress={()=>{Meteor.call('sayHello')} }
          >
            Say hello
          </Button>
        <Button containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: 'green'}}
                 style={{fontSize: 20, color: 'white'}} onPress={()=>{this.setState({show: !show})}}
          >
            Show : {!show && 'false'}
            {show && 'true'}
          </Button>
        </View>
        {show && <SettingsShow />}
      </View>
    );
  }
}



@connectMeteor
class SettingsShow extends Component {
  startMeteorSubscriptions() {
    Meteor.subscribe('settings');
  }
  render() {
    return null;
  }
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  }
});
