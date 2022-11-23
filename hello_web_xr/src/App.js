import React, { Component } from 'react';
import Viewer from './viewer/Viewer'
import './App.css';

class App extends Component {

  render() {
    return (
      <div id='container'>
        <Viewer></Viewer>
      </div>
    )
  }
}
export default App;
