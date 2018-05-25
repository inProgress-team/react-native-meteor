import connect from './ReactMeteorData';

let hasDisplayedWarning = false;

export default function createContainer(options, Component) {
  if (__DEV__ && !hasDisplayedWarning) {
    console.warn(
      'Warning: createContainer is deprecated, use withTracker instead.'
    );
    hasDisplayedWarning = true;
  }

  return connect(options)(Component);
}
