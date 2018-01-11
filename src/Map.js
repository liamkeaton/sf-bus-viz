import React, { Component } from 'react';
import { geoMercator, geoPath, geoCentroid } from 'd3-geo';
import MapGeoLayer from './MapGeoLayer';
import MapBusLayer from './MapBusLayer';

class Map extends Component {
  projection = null;
  path = null;

  constructor(props){
    super(props);

    // Use the first layers data to create centroid
    const center = geoCentroid(props.layers[0].data);

    // Guess at the scale and offset
    let scale = 150;
    let offset = [props.width/2, props.height/2];

    // Create the projection and path based on this
    this.projection = geoMercator()
      .scale(scale)
      .center(center)
      .translate(offset);
    this.path = geoPath().projection(this.projection);

    // Calculate better scale and offset based on the data
    // https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
    const bounds = this.path.bounds(props.layers[0].data);
    const hscale = scale * props.width / (bounds[1][0] - bounds[0][0]);
    const vscale = scale * props.height / (bounds[1][1] - bounds[0][1]);
    scale = (hscale < vscale) ? hscale : vscale;
    offset = [props.width - (bounds[0][0] + bounds[1][0])/2, props.height - (bounds[0][1] + bounds[1][1])/2];

    // Update the projection and path
    this.projection
      .center(center)
      .scale(scale)
      .translate(offset);
    this.path
      .projection(this.projection);
  }

  render() {
    let layers = this.props.layers.map((layer) => {
      return <MapGeoLayer key={layer.name} path={this.path.bind(this)} {...layer} />
    });

    if (this.props.busses !== null) {
      layers.push(
        <MapBusLayer key='busses' projection={this.projection.bind(this)} data={this.props.busses} routes={this.props.routes} refreshRate={this.props.refreshRate} />
      );
    }

    return <svg ref={node => this.node = node} width={this.props.width} height={this.props.height}>
      {layers}
    </svg>
  }
}
export default Map;
