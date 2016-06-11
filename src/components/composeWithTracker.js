import Trackr from 'trackr';
import { compose } from 'react-komposer';

import Data from '../Data';

export default function(reactiveFn, L, E, options) {
  const onPropsChange = (props, onData) => {
    let trackerCleanup;

    const _meteorDataDep = new Trackr.Dependency();
    const _meteorDataChangedCallback = ()=>{_meteorDataDep.changed()};

    Data.onChange(_meteorDataChangedCallback);

    const handler = Trackr.nonreactive(() => {
      return Trackr.autorun(() => {
        _meteorDataDep.depend();
        trackerCleanup = reactiveFn(props, onData);
      });
    });

    return () => {
      if (typeof (trackerCleanup) === 'function') {
        trackerCleanup();
      }
      Data.offChange(_meteorDataChangedCallback);
      return handler.stop();
    };
  };

  return compose(onPropsChange, L, E, options);
}