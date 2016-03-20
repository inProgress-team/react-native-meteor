/* global ReactMeteorData */
import React, {Component} from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link, browserHistory } from 'react-router';

export default class Header extends Component {
  render() {
    return (
      <Navbar inverse fixedTop fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <a onClick={()=>{browserHistory.push('/')}}>React Native Meteor</a>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav>
            <NavItem eventKey={1} onClick={()=>{browserHistory.push('/todos')}}>
              Todos
            </NavItem>
            <NavItem eventKey={1} onClick={()=>{browserHistory.push('/image')}}>
              CollectionFS
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
