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

      // circles
      map.addSource('regions', {
        type: 'geojson',
        data: './health_neighborhoods1.geojson',
      });

      map.addLayer({
        id: 'outline',
        type: 'line',
        source: 'regions',
        layout: {},
        paint: {
          'line-color': '#000',
          'line-width': 8,
        },
      });
      map.addLayer({
        id: 'rwanda-shade',
        type: 'fill',
        source: 'regions',
        layout: {},
        paint: {
          'fill-color': [
            'let',
            'bruh',
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
                ['var', 'bruh'],
                0,
                ['to-color', '#edf8e9'],
                1,
                ['to-color', '#006d2c'],
              ],
              10,
              [
                'interpolate',
                ['linear'],
                ['var', 'bruh'],
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
      map.addSource('circle', {
        type: 'geojson',
        data: './centroids.geojson',
      });
      // map.addLayer({
      //   id: 'income',
      //   type: 'circle',
      //   source: 'circle',
      //   filter: ['==', '$type', 'Point'],
      //   paint: {
      //     'circle-radius': 5,
      //     'circle-color': '#fff',
      //   },
      // });
      map.addLayer({
        id: 'income',
        type: 'circle',
        source: 'circle',
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': [
            'let',
            'density',
            ['/', ['get', 'POSITIVE_CASES'], ['get', 'TOTAL_POPULATION']],
            [
              'interpolate',
              ['linear'],
              ['zoom'],
              8,
              ['interpolate', ['linear'], ['var', 'density'], 0, 5, 1, 250],
              10,
              ['interpolate', ['linear'], ['var', 'density'], 0, 5, 1, 250],
            ],
          ],
          'circle-color': [
            'let',
            'density',
            ['get', 'AVERAGE_INCOME'],
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
                ['to-color', '#fa1100'],
                100000,
                ['to-color', '#00ffa2'],
              ],
              10,
              [
                'interpolate',
                ['linear'],
                ['var', 'density'],
                0,
                ['to-color', '#fa1100'],
                100000,
                ['to-color', '#00ffa2'],
              ],
            ],
          ],
        },
      });
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
