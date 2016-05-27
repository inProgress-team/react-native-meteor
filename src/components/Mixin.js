import Trackr from 'trackr';
import EJSON from 'ejson';
import Data from '../Data';

export default {
  componentWillMount() {

    Data.waitDdpReady(()=>{
      if(this.getMeteorData) {
        this.data = {};
        this._meteorDataManager = new MeteorDataManager(this);
        const newData = this._meteorDataManager.calculateData();
        this._meteorDataManager.updateData(newData);
      }
    });


  },
  componentWillUpdate(nextProps, nextState) {

    if(this.startMeteorSubscriptions) {
      if(!EJSON.equals(this.state, nextState) || !EJSON.equals(this.props, nextProps)) {
        this._meteorSubscriptionsManager._meteorDataChangedCallback()
      }
    }

    if(this.getMeteorData) {
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
    if(this._meteorDataManager) {
      this._meteorDataManager.dispose();
    }

    if(this._meteorSubscriptionsManager) {
      this._meteorSubscriptionsManager.dispose();
    }

  }
};


// A class to keep the state and utility methods needed to manage
// the Meteor data for a component.
class MeteorDataManager {
  constructor(component) {
    this.component = component;
    this.computation = null;
    this.oldData = null;
    this._meteorDataDep = new Trackr.Dependency();

    this._meteorDataChangedCallback = ()=>{this._meteorDataDep.changed()};

    Data.onChange(this._meteorDataChangedCallback);
  }

  dispose() {
    if (this.computation) {
      this.computation.stop();
      this.computation = null;
    }

    Data.offChange(this._meteorDataChangedCallback);
  }

  calculateData() {
    const component = this.component;

    if (!component.getMeteorData) {
      return null;
    }

    if (this.computation) {
      this.computation.stop();
      this.computation = null;
    }

    let data;
    // Use Tracker.nonreactive in case we are inside a Tracker Computation.
    // This can happen if someone calls `ReactDOM.render` inside a Computation.
    // In that case, we want to opt out of the normal behavior of nested
    // Computations, where if the outer one is invalidated or stopped,
    // it stops the inner one.

    this.computation = Trackr.nonreactive(() => {
      return Trackr.autorun((c) => {
        this._meteorDataDep.depend();
        if (c.firstRun) {
          const savedSetState = component.setState;
          try {
            component.setState = () => {
              throw new Error(
"Can't call `setState` inside `getMeteorData` as this could cause an endless" +
" loop. To respond to Meteor data changing, consider making this component" +
" a \"wrapper component\" that only fetches data and passes it in as props to" +
" a child component. Then you can use `componentWillReceiveProps` in that" +
" child component.");
            };

            data = component.getMeteorData();
          } finally {
            component.setState = savedSetState;
          }


        } else {
          // Stop this computation instead of using the re-run.
          // We use a brand-new autorun for each call to getMeteorData
          // to capture dependencies on any reactive data sources that
          // are accessed.  The reason we can't use a single autorun
          // for the lifetime of the component is that Tracker only
          // re-runs autoruns at flush time, while we need to be able to
          // re-call getMeteorData synchronously whenever we want, e.g.
          // from componentWillUpdate.
          c.stop();
          // Calling forceUpdate() triggers componentWillUpdate which
          // recalculates getMeteorData() and re-renders the component.
          try {
            component.forceUpdate();
          } catch(e) {
            console.error(e);
          }

        }
      });
    });

    return data;
  }

  updateData(newData) {
    const component = this.component;
    const oldData = this.oldData;

    if (! (newData && (typeof newData) === 'object')) {
      throw new Error("Expected object returned from getMeteorData");
    }
    // update componentData in place based on newData
    for (let key in newData) {
      component.data[key] = newData[key];
    }
    // if there is oldData (which is every time this method is called
    // except the first), delete keys in newData that aren't in
    // oldData.  don't interfere with other keys, in case we are
    // co-existing with something else that writes to a component's
    // this.data.
    if (oldData) {
      for (let key in oldData) {
        if (!(key in newData)) {
          delete component.data[key];
        }
      }
    }
    this.oldData = newData;
  }
}

