import Trackr from 'trackr';
import Data from '../Data';

// A class to keep the state and utility methods needed to manage
// the Meteor data for a component.
class MeteorDataManager {
  constructor(component) {
    this.component = component;
    this.computation = null;
    this.oldData = null;
    this._meteorDataDep = new Trackr.Dependency();
    this._meteorDataChangedCallback = () => {
      this._meteorDataDep.changed();
    };

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
      return Trackr.autorun(c => {
        this._meteorDataDep.depend();
        if (c.firstRun) {
          const savedSetState = component.setState;
          try {
            component.setState = () => {
              throw new Error(
                "Can't call `setState` inside `getMeteorData` as this could cause an endless" +
                  ' loop. To respond to Meteor data changing, consider making this component' +
                  ' a "wrapper component" that only fetches data and passes it in as props to' +
                  ' a child component. Then you can use `componentWillReceiveProps` in that' +
                  ' child component.'
              );
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
          } catch (e) {
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

    if (!(newData && typeof newData === 'object')) {
      throw new Error('Expected object returned from getMeteorData');
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

export default MeteorDataManager;
