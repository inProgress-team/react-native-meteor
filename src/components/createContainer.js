import React from 'react';
import EJSON from 'ejson';

import Data from '../Data';
import MeteorDataManager from './MeteorDataManager';

export default function createContainer(mapMeteorDataToProps, WrappedComponent) {
  class componentWithMeteorContainer extends React.Component {
    constructor(props) {
      super(props);

      this.getMeteorData = this.getMeteorData.bind(this);
    }

    getMeteorData() {
      return mapMeteorDataToProps(this.props);
    }

    componentWillMount() {
      Data.waitDdpReady(() => {
        if (this.getMeteorData) {
          this.data = {};
          this._meteorDataManager = new MeteorDataManager(this);
          const newData = this._meteorDataManager.calculateData();
          this._meteorDataManager.updateData(newData);
        }
      });
    }

    componentWillUpdate(nextProps, nextState) {
      if(this.startMeteorSubscriptions) {
        if(!EJSON.equals(this.state, nextState) || !EJSON.equals(this.props, nextProps)) {
          this._meteorSubscriptionsManager._meteorDataChangedCallback()
        }
      }
  
      if (this.getMeteorData) {
        const saveProps = this.props;
        const saveState = this.state;
        let newData;
        try {
          // Temporarily assign this.state and this.props,
          // so that they are seen by getMeteorData!
          // This is a simulation of how the proposed Observe API
          // for React will work, which calls observe() after
          // componentWillUpdate and after props and state are
          // updated, but before render() is called.
          // See https://github.com/facebook/react/issues/3398.
          this.props = nextProps;
          this.state = nextState;
          newData = this._meteorDataManager.calculateData();
        } finally {
          this.props = saveProps;
          this.state = saveState;
        }
  
        this._meteorDataManager.updateData(newData);
      }
    }

    componentWillUnmount() {
      if (this._meteorDataManager) {
        this._meteorDataManager.dispose();
      }
  
      if (this._meteorSubscriptionsManager) {
        this._meteorSubscriptionsManager.dispose();
      }
    }

    render() {
      return <WrappedComponent { ...this.props } { ...this.data } />;
    }
  }
  
  const newDisplayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  componentWithMeteorContainer.displayName = `WithMeteorContainer(${newDisplayName})`;

  return componentWithMeteorContainer;
}
