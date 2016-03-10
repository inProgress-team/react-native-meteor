'use strict';

import React, {
  Component,
  PropTypes,
  ListView
} from 'react-native';


import Data from './Data';


export default class MeteorListView extends Component {
  static propTypes = {
    collection: PropTypes.string.isRequired,
    selector: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
    options: PropTypes.oneOfType([ PropTypes.string, PropTypes.object ]),
    renderRow: PropTypes.func.isRequired
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
  componentWillMount() {
    const { collection, selector, options } = this.props;

    if(!Data.db[collection]) {
      Data.db.addCollection(collection)
    }

    const items = Data.db.observe(() => {
      return Data.db[collection].find(selector, options);
    });

    items.subscribe(results=>{
      this.setState({
        ds: this.state.ds.cloneWithRows(results)
      });
    });
  }
  render() {
    const { ds } = this.state;

    return (
      <ListView
        {...this.props}
        dataSource={ds}
      />
    );
  }
}