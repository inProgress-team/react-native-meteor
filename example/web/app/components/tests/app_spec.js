// See this for some tips with Meteor: https://medium.com/all-about-meteorjs/unit-test-react-components-in-meteor-a19d96684d7d

// If you import ../App you'll have to stub out Meteor, this is
// why it's important to use controller-views that just setup
// data and then the children can be very easily tested with
// just props and state. We'll use a local component for an example

import React from 'react/addons';
//import App from '../App';
//import $ from 'jquery'; // you could use jq to make life easier
import TestUtils from 'react-addons-test-utils';

const Simulate = TestUtils.Simulate;

// these should go into a spec helper module

function renderComponent(comp, props) {
  return TestUtils.renderIntoDocument(
    React.createElement(comp, props)
  );
}

function simulateClickOn(selector) {
  var button = this.$el.find(selector)[0];
  React.addons.TestUtils.Simulate.click(button);
}


const Post = React.createClass({
  getDefaultProps() {
    return {title: "Default Post Name"};
  },
  getInitialState() {
    return { isVisible: true };
  },
  handleHide() {
    this.setState({isVisible: false});
  },
  render() {
    let visibleClass = (this.state.isVisible) ? 'block' : 'hidden';
    return (
      <div className='Post' style={{display: visibleClass }}>
        <h1>{this.props.title}</h1>
        <article>
          How now brown cow
        </article>
        <button onClick={this.handleHide}>Hide</button>
      </div>
    );
  }
});


describe('Sample post component', () => {
  it('renders default post name without props', () => {
    let comp = renderComponent(Post, {});
    expect(comp.props.title).toEqual('Default Post Name');
  });

  it('renders correct post name with a name prop', () => {
    let comp = renderComponent(Post, {title: "Webpack is awesome!"});
    expect(comp.props.title).toEqual("Webpack is awesome!");
  });

  it("should have a default state of visible", () => {
    let comp = renderComponent(Post, {});
    expect(comp.state.isVisible).toEqual(true);
  });

  it("should hide when hide button is clicked", () => {
    let comp = renderComponent(Post, {});
    comp.handleHide();
    expect(comp.state.isVisible).toEqual(false);
  });
});
