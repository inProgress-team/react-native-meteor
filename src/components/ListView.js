'use strict';

import React, { Component, PropTypes } from 'react';
import { ListView } from 'react-native';

import Data from '../Data';


export default class MeteorListView extends Component {
  static propTypes = {
    collection: PropTypes.string.isRequired,
    selector: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
    options: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
    renderRow: PropTypes.func.isRequired,
    listViewRef: PropTypes.oneOfType([ PropTypes.func, PropTypes.string ])
  };
  static defaultProps = {
    selector: {}
  };
  constructor(props) {
    super(props);

    this.state = {
      ds: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1!==row2,
      })
    };
  }
  componentWillReceiveProps(props) {
    const { collection, selector, options } = props;

    this.update(Data.db[collection].find(selector, options));
  }
  componentWillMount() {
    const { collection, selector, options } = this.props;


    this.update = results=>{
      this.setState({
        ds: this.state.ds.cloneWithRows(results)
      });
    };


    if(!Data.db[collection]) {
      Data.db.addCollection(collection)
    }

    this.items = Data.db.observe(() => {
      return Data.db[collection].find(selector, options);
    });

    this.items.subscribe(this.update);
  }
  componentWillUnmount() {
    this.items.dispose();
  }
  render() {
    const { ds } = this.state;
    const { listViewRef, ...props } = this.props;

    return (
      <ListView
        {...props}
        ref={listViewRef}
        dataSource={ds}
      />
    );
  }
}