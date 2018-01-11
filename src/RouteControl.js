import React, { Component } from 'react';
import './RouteControl.css';

class RouteControl extends Component {
  constructor(props){
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
    this.selectAll = this.selectAll.bind(this);
    this.unselectAll = this.unselectAll.bind(this);

    this.props.updateRoutes(this.fetchRoutes());
  }
  selectAll() {
    this.props.updateRoutes(this.fetchRoutes());
    return false;
  }
  unselectAll() {
    this.props.updateRoutes(new Set());
    return false;
  }
  changeHandler(event) {
    const value = event.target.value;
    const routes = this.props.routes;

    if (routes.has(value)) {
      routes.delete(value);
    } else {
      routes.add(value);
    }
    this.props.updateRoutes(routes)
  }
  fetchRoutes() {
    // Getting a unique set of routes
    // https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
    return new Set(this.props.busses.vehicle.map(item => item.routeTag));
  }
  render() {
    const uniqueRoutes = [...this.fetchRoutes()].sort();
    const routes = uniqueRoutes.map((route) => {
      return <li key={route}><label><input type='checkbox' value={route} checked={this.props.routes.has(route) ? 'checked' : ''} onChange={this.changeHandler} /> {route}</label></li>
    });

    return <div className='RouteControl'>
      <h2 className='RouteControl-title'>Routes</h2>
      <button onClick={this.selectAll}>Select all</button> / <button onClick={this.unselectAll}>Unselect all</button>
      <ul className='RouteControl-list'>
        {routes}
      </ul>
    </div>
  }
}
export default RouteControl;
