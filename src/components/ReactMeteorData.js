import React from 'react';
import EJSON from 'ejson';

import Data from '../Data';
import MeteorDataManager from './MeteorDataManager';

const ReactMeteorData = {
  componentWillMount() {
    Data.waitDdpReady(() => {
      if (this.getMeteorData) {
        this.data = {};
        this._meteorDataManager = new MeteorDataManager(this);
        const newData = this._meteorDataManager.calculateData();
        this._meteorDataManager.updateData(newData);
      }
    });
  },

  componentWillUpdate(nextProps, nextState) {
    if (this.startMeteorSubscriptions) {
      if (
        !EJSON.equals(this.state, nextState) ||
        !EJSON.equals(this.props, nextProps)
      ) {
        this._meteorSubscriptionsManager._meteorDataChangedCallback();
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
  },

  componentWillUnmount() {
    if (this._meteorDataManager) {
      this._meteorDataManager.dispose();
    }

    if (this._meteorSubscriptionsManager) {
      this._meteorSubscriptionsManager.dispose();
    }
  },
};

export { ReactMeteorData };

class ReactComponent extends React.Component {}
Object.assign(ReactComponent.prototype, ReactMeteorData);
class ReactPureComponent extends React.PureComponent {}
Object.assign(ReactPureComponent.prototype, ReactMeteorData);

export default function connect(options) {
  let expandedOptions = options;
  if (typeof options === 'function') {
    expandedOptions = {
      getMeteorData: options,
    };
  }

  const { getMeteorData, pure = true } = expandedOptions;

  const BaseComponent = pure ? ReactPureComponent : ReactComponent;
  return WrappedComponent =>
    class ReactMeteorDataComponent extends BaseComponent {
      getMeteorData() {
        return getMeteorData(this.props);
      }
      render() {
        return <WrappedComponent {...this.props} {...this.data} />;
      }
    };
}
