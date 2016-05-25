'use strict';

import React, { Component, PropTypes } from 'react';
import { View, Image, StyleSheet } from 'react-native';


import Data from '../Data';
import setProperties from './setProperties';

export default class FSCollectionImagesPreloader extends Component {
  static propTypes = {
    collection: PropTypes.string.isRequired,
    selector: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ])
  };
  static defaultProps = {
    selector: {}
  };
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }
  componentWillMount() {
    const { collection, selector } = this.props;


    this.update = results=>{
      this.setState({
        items: results.map(elem=>setProperties(collection, elem))
      });
    };

    const collectionName = 'cfs.'+collection+'.filerecord';

    if(!Data.db[collectionName]) {
      Data.db.addCollection(collectionName)
    }

    this.items = Data.db.observe(() => {
      return Data.db[collectionName].find(selector);
    });

    this.items.subscribe(this.update);
  }
  componentWillUnmount() {
    this.items.dispose();
  }
  render() {
    const { items } = this.state;

    return (
      <View style={styles.hidden}>
        {items && items.map(item=>{
          return (
            <Image style={styles.hidden} key={item._id} source={{uri: item.url()}} />
          );
        })}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  hidden: {
    width: 1,
    height: 1,
    position: 'absolute',
    top: -100000,
    left: -10000,
    opacity: 0
  }
})