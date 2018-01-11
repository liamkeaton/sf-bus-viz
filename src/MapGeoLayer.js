import React, { Component } from 'react';
import { select } from 'd3';
import './MapGeoLayer.css';

class MapGeoLayer extends Component {
  constructor(props){
    super(props)
    this.createMapLayer = this.createMapLayer.bind(this)
  }
  componentDidMount() {
    this.createMapLayer()
  }
  componentDidUpdate() {
    this.createMapLayer()
  }
  createMapLayer() {
    // Use the passed path function to draw using the geo data
    select(this.node).selectAll('path')
      .data(this.props.data.features)
      .enter()
      .append('path')
      .attr('class', this.props.name)
      .attr('d', this.props.path);
  }
  render() {
    return <g ref={node => this.node = node}></g>
  }
}
export default MapGeoLayer;
