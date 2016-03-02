/* global ReactMeteorData */
import React, {Component} from 'react';

import './bootstrap.css';
import './App.css';

import Header from './Header.jsx';

import { Router, Route, Link, hashHistory } from 'react-router';
import Home from './Routes/Home.jsx';
export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        {this.props.children}
      </div>
    );
  }
}
