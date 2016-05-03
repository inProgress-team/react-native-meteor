'use strict';

import React, {
  Component,
  PropTypes,
  ListView
} from 'react-native';


import Data from '../Data';


export default class MeteorListView extends Component {
  static propTypes = {
    elements: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired
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
    const { elements } = props;

    const elems = elements();
    this.setState({
      ds: this.state.ds.cloneWithRows(elems)
    });

  }
  componentWillMount() {

    const { elements } = this.props;

    this.onChange = ()=>{
      const elems = elements();
      this.setState({
        ds: this.state.ds.cloneWithRows(elems)
      });
    };

    this.onChange();
    Data.onChange(this.onChange);

  }
  componentWillUnmount() {
    Data.offChange(this.onChange);
  }
  getListViewRef() {
    return this._listView;
  }
  render() {
    const { ds } = this.state;

    return (
      <ListView
        {...this.props}
        dataSource={ds}
        ref={(r) => this._listView = r}
      />
    );
  }
}