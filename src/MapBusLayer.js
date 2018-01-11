import React, { Component } from 'react';
import { select, transition, easeLinear } from 'd3';
import './MapBusLayer.css';

class MapBusLayer extends Component {
  constructor(props){
    super(props)
    this.createMapLayer = this.createMapLayer.bind(this)
    this.generateBusClasses = this.generateBusClasses.bind(this)
  }
  componentDidMount() {
    this.createMapLayer()
  }
  componentDidUpdate() {
    this.createMapLayer()
  }
  createMapLayer() {
    // Merge data with existing data using the vehicle id as key
    let busses = select(this.node).selectAll('circle')
      .data(this.props.data.vehicle, (d) => d.id);

    // Setup transition using the passed data refresh rate
    let t = transition().ease(easeLinear).duration(this.props.refreshRate);

    // Draw new busses
    busses
      .enter()
      .append('circle')
      .attr('cx', d => this.props.projection([d.lon, d.lat])[0])
      .attr('cy', d => this.props.projection([d.lon, d.lat])[1])
      .attr('r', d => '2px')
      .attr('class', this.generateBusClasses)

    // Transition existing ones
    busses
      .transition(t)
      .attr('cx', d => this.props.projection([d.lon, d.lat])[0])
      .attr('cy', d => this.props.projection([d.lon, d.lat])[1])
      .attr('r', d => '2px')
      .attr('class', this.generateBusClasses)
  }
  generateBusClasses(d) {
    const baseClass = 'bus route route-' + d.routeTag;
    if (!this.props.routes.has(d.routeTag)) {
      return baseClass + ' route-hidden';
    } else if (d.speedKmHr <= 0) {
      return baseClass + ' bus-stopped route-shown';
    } else {
      return baseClass + ' bus-moving route-shown';
    }
  }
  render() {
    return <g ref={node => this.node = node}></g>
  }
}
export default MapBusLayer;
