/* global Blaze */
import React, {component} from 'react';
import ReactDOM from 'react-dom';

export default class BlazeTemplate extends React.Component {
  static propTypes = {
    template: React.PropTypes.any.isRequired,
    component: React.PropTypes.any,
  }
  static defaultProps = {
    component: 'div',
  }
  // we don't want to re-render this component if parent changes
  shouldComponentUpdate() {
    return false;
  }
  componentDidMount() {
    let {template} = this.props;
    this.view = Blaze.render(template, ReactDOM.findDOMNode(this.refs.root));
  }
  componentWillUnmount() {
    Blaze.remove(this.view);
  }
  render() {
    let {component, ...props} = this.props;
    props.ref = 'root';
    return React.createElement(component, props);
  }
}
