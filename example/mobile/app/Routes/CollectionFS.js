'use strict';

console.disableYellowBox = true;


import React, {
  Component,
  StyleSheet,
  Image,
  Text,
  View
} from 'react-native';

import Meteor, { connectMeteor } from 'react-native-meteor';

import Button from 'react-native-button';


@connectMeteor
export default class CollectionFS extends Component {
  startMeteorSubscriptions() {
    Meteor.subscribe('imagesFiles');
  }
  getMeteorData() {
    return {
      image: Meteor.FSCollection('imagesFiles').findOne()
    }
  }
  render() {
    const { image } = this.data;

    console.log(image && image.url());
    return (
      <View style={styles.container}>
        <Text>You have to be logged to see this image (see publish method). CollectionFS url() generate an authToken and it is checked in this example.</Text>

        {image &&
          <Image
            style={{height: 400, width: 400}}
            source={{uri: image.url({store: 'anotherStore'})}}
          />
        }

        <Image />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
