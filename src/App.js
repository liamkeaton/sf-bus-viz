import React, { Component } from 'react';
import { json } from 'd3';

import './App.css';
import Map from './Map';
import RouteControl from './RouteControl';

import arteries from './sfmaps/arteries';
import freeways from './sfmaps/freeways';
import neighborhoods from './sfmaps/neighborhoods';
import streets from './sfmaps/streets';

const busDataUrl = 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni';

class App extends Component {
  intervals = [];
  refreshRate = 15000;
  mapWidth = 800;
  mapHeight = 800;
  busDataUrl = 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni';

  constructor(props) {
    super(props);
    this.updateRoutes = this.updateRoutes.bind(this);

    this.state = {
      busses: null,
      routes: new Set(),
      layers: [
        {name: 'neighborhoods', data: neighborhoods},
        {name: 'streets', data: streets},
        {name: 'arteries', data: arteries},
        {name: 'freeways', data: freeways},
      ]
    }
  }
  componentDidMount() {
    // Once mounted fetch the bus data and refresh according to the refresh rate
    this.fetchBusData();
    this.intervals.push(setInterval(() => this.fetchBusData(), this.refreshRate));
  }
  componentWillUnmount() {
    // Clean up the intervals on unmount
    this.intervals.forEach((i) => clearInterval(i));
  }
  fetchBusData() {
    // @todo Before this can be implemented need to merge old data
    // Use the last time so the API only sends changed records
    // let lastTime = '';
    // if (this.state.busses !== null) {
    //   lastTime = '&t=' + this.state.busses.lastTime.time;
    // }

    // Request the data and update the state
    json(busDataUrl, (data) => {
      this.setState({busses: data});
    });
  }
  updateRoutes(routes) {
    this.setState({routes: routes});
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">San Francisco Bus Visualisation</h1>
        </header>
        <section className="App-control">
          {this.state.busses !== null &&
          <RouteControl busses={this.state.busses} routes={this.state.routes} updateRoutes={this.updateRoutes} />
          }
        </section>
        <section className="App-map">
          <Map width={this.mapWidth} height={this.mapHeight} layers={this.state.layers} busses={this.state.busses} routes={this.state.routes} refreshRate={this.refreshRate} />
        </section>
      </div>
    );
  }
}

export default App;
