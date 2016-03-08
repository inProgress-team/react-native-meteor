import Trackr from 'trackr';
import EJSON from 'ejson';
import Data from './Data';

export default {
  componentWillMount() {
    this.data = this.getMeteorData && this.getMeteorData();

    Data.waitDdpReady(()=>{

      this._meteorDataDep = new Trackr.Dependency();
      this._meteorFirstRun = true;

      Trackr.autorun((computation)=>{
        this._meteorComputation = computation;
        this._meteorDataDep.depend();

        if(this.startMeteorSubscriptions) {
          this.startMeteorSubscriptions();
        }

        enqueueMeteorDataUpdate(this);
      });

    });

  },
  componentWillUpdate(nextProps, nextState) {
    if (this._meteorCalledSetState) {
      // If this component update was triggered by the ReactMeteor.Mixin,
      // then we do not want to trigger the change event again, because
      // that would lead to an infinite update loop.
      this._meteorCalledSetState = false;
      return;
    }

    if (this._meteorDataDep) {
      this._meteorDataDep.changed();
    }
  },
  componentWillUnmount() {
    if (this._meteorComputation) {
      this._meteorComputation.stop();
      this._meteorComputation = null;
    }
    if(this._meteorChangeCallback) {
      Data.db.off('change', this._meteorChangeCallback);
      Data.ddp.off('connected', this._meteorChangeCallback);
      Data.ddp.off('disconnected', this._meteorChangeCallback);
      Data.off('loggingIn', this._meteorChangeCallback);
    }

  }
};

const updateData = function(component) {
  const oldData = component.data;

  const partialData = component.getMeteorData && component.getMeteorData();

  if(!EJSON.equals(oldData, partialData)) {
    component._meteorCalledSetState = true;
    component.data = partialData;
    component.forceUpdate();
  }
};


const enqueueMeteorDataUpdate = function(component) {
  const partialData = component.getMeteorData && component.getMeteorData();

  if (!partialData) {
    // The getMeteorData method can return a falsy value to avoid
    // triggering a state update.
    return;
  }

  if (component._meteorFirstRun) {
    // If it's the first time we've called enqueueMeteorDataUpdate since
    // the component was mounted, set the state synchronously.
    component._meteorFirstRun = false;
    component._meteorChangeCallback = () => { updateData(component); };

    updateData(component);


    Data.db.on('change', component._meteorChangeCallback);
    Data.ddp.on('connected', component._meteorChangeCallback);
    Data.ddp.on('disconnected', component._meteorChangeCallback);
    Data.on('loggingIn', component._meteorChangeCallback);

  }
}
