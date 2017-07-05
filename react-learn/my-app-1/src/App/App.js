import React, { Component } from 'react';
import logo from './logo.svg';
import bgImg from './bg.jpg';
import './App.css';
import Label from '../Label/Label.js';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar>
          hhh
        </Navbar>
        <div className="App-header">
          <img src={bgImg} className="App-img" alt=""/>
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Label></Label>
        <Jumbotron></Jumbotron>
        <Button>aaaaaaaa</Button>
      </div>
    );
  }
}

export default App;
