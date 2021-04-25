import React, { useRef, useEffect, useState } from 'react';
import './styles.css';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

import { CircularProgress } from '@chakra-ui/react';

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  'pk.eyJ1Ijoicm9iZXJ0YmFvIiwiYSI6ImNrbmJ4b2EyazB3a2kyb29vdmI4NnFhdHkifQ.eWUrs0-n2fF0u1XZhNbE4w';

const Mapp = () => {
  const mapContainer = useRef();
  const [lng, setLng] = useState(-77.0369);
  const [lat, setLat] = useState(38.9072);
  const [zoom, setZoom] = useState(11);
  const [snapshot, setSnapshot] = useState({});
  const [mapObj, setMapObj] = useState();

  // listener for update
  useEffect(() => {});

  // general use effect
  useEffect(() => {
    console.log('hi');
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: [lng, lat],
      zoom: zoom,
      antialias: true,
      pitch: 60,
    });

    map.on('load', () => {
      // map.addSource('mapbox-dem', {
      //   type: 'raster-dem',
      //   url: 'mapbox://mapbox.mapbox-terrain-dem-v2',
      //   tileSize: 512,
      //   maxZoom: 16,
      // });
      // map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      // skybox
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-sun-intensity': 15,
        },
      });

      // test 3d
      map.addSource('floorplan', {
        // GeoJSON Data source used in vector tiles, documented at
        // https://gist.github.com/ryanbaumann/a7d970386ce59d11c16278b90dde094d
        type: 'geojson',
        data:
          'https://docs.mapbox.com/mapbox-gl-js/assets/indoor-3d-map.geojson',
      });
      map.addLayer({
        id: 'room-extrusion',
        type: 'fill-extrusion',
        source: 'floorplan',
        paint: {
          // See the Mapbox Style Specification for details on data expressions.
          // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions

          // Get the fill-extrusion-color from the source 'color' property.
          'fill-extrusion-color': ['get', 'color'],

          // Get fill-extrusion-height from the source 'height' property.
          'fill-extrusion-height': ['get', 'height'],

          // Get fill-extrusion-base from the source 'base_height' property.
          'fill-extrusion-base': ['get', 'base_height'],

          // Make extrusions slightly opaque for see through indoor walls.
          'fill-extrusion-opacity': 0.5,
        },
      });

      // circles
      map.addSource('circles', {
        type: 'geojson',
        data: './health_neighborhoods1.geojson',
      });
      // map.addLayer({
      //   id: 'park-boundary',
      //   type: 'fill',
      //   source: 'circles',
      //   paint: {
      //     'fill-color': '#888888',
      //     'fill-opacity': 0.8,
      //   },
      //   filter: ['==', '$type', 'Polygon'],
      // });
      map.addLayer({
        id: 'outline',
        type: 'line',
        source: 'circles',
        layout: {},
        paint: {
          'line-color': '#000',
          'line-width': 8,
        },
      });
      map.addLayer({
        id: 'rwanda-shade',
        type: 'fill',
        source: 'circles',
        layout: {},
        paint: {
          'fill-color': [
            'let',
            'density',
            [
              '/',
              ['get', 'TOTAL_POPULATION'],
              ['/', ['get', 'SHAPEAREA'], 100],
            ],
            [
              'interpolate',
              ['linear'],
              ['zoom'],
              8,
              [
                'interpolate',
                ['linear'],
                ['var', 'density'],
                0,
                ['to-color', '#edf8e9'],
                1,
                ['to-color', '#006d2c'],
              ],
              10,
              [
                'interpolate',
                ['linear'],
                ['var', 'density'],
                0,
                ['to-color', '#eff3ff'],
                1,
                ['to-color', '#08519c'],
              ],
            ],
          ],
          'fill-opacity': 0.7,
        },
      });

      // color = income

      // size/height = cases per capita

      // vaccination data

      ///////
    });
    setMapObj(map);
    // map.on('sourcedataloading', function () {
    //   // loader visible
    // });
    // map.on('sourcedata', function (e) {
    //   // loader not visible
    //   setLoading(false);
    // });
    // map.on('load', function () {
    //   map.addSource('route', {
    //     type: 'geojson',
    //     data: './fiveyearcrashes.geojson',
    //   });

    //   map.addSource('kmeans', {
    //     type: 'geojson',
    //     data: './centroids.geojson',
    //   });

    //   map.addLayer({
    //     id: 'kk',
    //     type: 'circle',
    //     source: 'kmeans',
    //     paint: {
    //       'circle-radius': 35,
    //       'circle-color': 'orange',
    //     },
    //   });
    // });
    // map.on('click', '0', function (e) {
    //   console.log(e);
    //   console.log('help');
    //   var coordinates = e.features[0].geometry.coordinates.slice();
    //   // var description = e.features[0].properties.description;

    //   // Ensure that if the map is zoomed out such that multiple
    //   // copies of the feature are visible, the popup appears
    //   // over the copy being pointed to.
    //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    //   }
    //   console.log(coordinates);
    //   new mapboxgl.Popup().setLngLat(coordinates).setHTML('bruh').addTo(map);
    // });
    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    return () => map.remove();
  }, []);

  return (
    <div>
      {!!false ? <CircularProgress isIndeterminate color="green.300" /> : <></>}
      <>
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div className="map-container" ref={mapContainer} />
      </>
    </div>
  );
};

export default Mapp;
