import React, { useRef, useEffect, useState } from 'react';
import './styles.css';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

import { CircularProgress } from '@chakra-ui/react';

import {
  Slide,
  Box,
  Button,
  Divider,
  VStack,
  HStack,
  useDisclosure,
  Text,
  Tooltip,
} from '@chakra-ui/react';

mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  'pk.eyJ1Ijoicm9iZXJ0YmFvIiwiYSI6ImNrbmJ4b2EyazB3a2kyb29vdmI4NnFhdHkifQ.eWUrs0-n2fF0u1XZhNbE4w';

/**
 * Paint Constants
 */

// Neighborhood Region
const neighborhoodRegionColor = [
  'let',
  'bruh',
  ['/', ['get', 'TOTAL_POPULATION'], ['/', ['get', 'SHAPEAREA'], 100]],
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
];
// Centroids
const centroidFillColor = [
  'let',
  'density',
  ['get', 'AVERAGE_INCOME'],
  [
    'interpolate',
    ['linear'],
    ['var', 'density'],
    0,
    ['to-color', '#fa1100'],
    100000,
    ['to-color', '#00ffa2'],
  ],
];

const centroidSize = [
  'let',
  'density',
  ['/', ['get', 'POSITIVE_CASES'], ['get', 'TOTAL_POPULATION']],
  ['interpolate', ['linear'], ['var', 'density'], 0, 5, 1, 250],
];
// Wards
const wardRegionColor = [
  'let',
  'color',
  ['get', 'CORRELATION_VALUE'],
  [
    'interpolate',
    ['linear'],
    ['var', 'color'],
    -1,
    ['to-color', '#dae600'],
    1,
    ['to-color', '#262b01'],
  ],
];
const wardRegionActiveColor = [
  'let',
  'color',
  ['get', 'CORRELATION_VALUE'],
  ['interpolate', ['linear'], ['var', 'color'], 0, 0, 1, 1],
];
const wardHeight = ['*', ['to-number', ['get', 'PER_CAPITA_INCOME']], 0.1];
const wardExtrusionOpacity = [
  'interpolate',
  ['exponential', 0.5],
  ['zoom'],
  12,
  0.95,
  13,
  0,
];

const Map = () => {
  const mapContainer = useRef();
  const [lng, setLng] = useState(-77.0369);
  const [lat, setLat] = useState(38.9072);
  const [zoom, setZoom] = useState(11);
  const [snapshot, setSnapshot] = useState({});
  const [mapObj, setMapObj] = useState();
  const [hoveredWardID, setHoveredWardID] = useState('');
  const [hoveredRep, setHoveredRep] = useState('');
  const [hoveredPop, setHoveredPop] = useState('');
  const [hoveredIncome, setHoveredIncome] = useState('');
  const [hoveredCases, setHoveredCases] = useState('');

  const { isOpen, onToggle } = useDisclosure();

  // listener for update
  useEffect(() => {});

  // general use effect
  useEffect(() => {
    console.log('hi');
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: zoom,
      antialias: true,
      pitch: 60,
    });

    map.on('load', () => {
      /**
       * Skybox
       */
      map.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 90.0],
          'sky-atmosphere-color': '#1a1a1aEF',
          'sky-atmosphere-sun-intensity': 15,
        },
      });

      /**
       * Neighborhood Region
       */
      map.addSource('neighborhood', {
        type: 'geojson',
        data: './geojson/health_neighborhoods1.geojson',
      });
      map.addLayer({
        id: 'neighborhood-outline',
        type: 'line',
        source: 'neighborhood',
        layout: {},
        paint: {
          'line-color': '#000',
          'line-width': 8,
        },
      });
      map.addLayer({
        id: 'neighborhood-region',
        type: 'fill',
        source: 'neighborhood',
        layout: {},
        paint: {
          'fill-color': neighborhoodRegionColor,
          'fill-opacity': 0.7,
        },
      });

      /**
       * Neighborhood Centroids
       */
      map.addSource('neighborhood-centroids', {
        type: 'geojson',
        data: './geojson/centroids.geojson',
      });
      map.addLayer({
        id: 'income',
        type: 'circle',
        source: 'neighborhood-centroids',
        filter: ['==', '$type', 'Point'],
        paint: {
          'circle-radius': centroidSize,
          'circle-color': centroidFillColor,
        },
      });

      /**
       * Ward Regions
       */
      map.addSource('ward', {
        type: 'geojson',
        data: './geojson/wards.geojson',
      });
      map.addLayer({
        id: 'ward-outline',
        type: 'line',
        source: 'ward',
        layout: {},
        paint: {
          'line-color': '#fff',
          'line-width': 8,
        },
      });
      // map.addLayer({
      //   id: 'ward-region',
      //   type: 'fill',
      //   source: 'ward',
      //   layout: {},
      //   paint: {
      //     'fill-color': wardRegionColor,
      //     'fill-opacity': 0.3,
      //   },
      // });
      map.addLayer({
        id: 'ward-extrusion',
        type: 'fill-extrusion',
        source: 'ward',
        paint: {
          'fill-extrusion-color': wardRegionColor,
          'fill-extrusion-height': wardHeight,
          'fill-extrusion-opacity': wardExtrusionOpacity,
        },
      });
      map.addLayer({
        id: 'ward-extrusion-active',
        type: 'fill-extrusion',
        source: 'ward',
        paint: {
          'fill-extrusion-color': '#3cc',
          // 'fill-extrusion-color': wardRegionActiveColor,
          'fill-extrusion-height': wardHeight,
          'fill-extrusion-opacity': wardExtrusionOpacity,
        },
      });
      // vaccination data
      // ['interpolate', ['exponential', 0.5], ['zoom'], 12, 0.95, 13, 0];
      ///////
    });

    map.on('click', 'ward-extrusion', e => {
      console.log([
        e.features[0].properties.CENTER[0],
        e.features[0].properties.CENTER[1],
      ]);
      console.log('extrusion clicked!');
      map.flyTo({
        center: eval(e.features[0].properties.CENTER),
        pitch: 0,
        zoom: 13,
      });
    });

    map.on('mousemove', 'ward-extrusion', function (e) {
      if (e.features.length > 0) {
        // setHoveredWardID(e.features[0].properties.WARD.toString());
      }
      let prop = e.features[0].properties;
      let current = prop.WARD;
      if (hoveredWardID != current) {
        setHoveredWardID(current);
        setHoveredRep(prop.REP_NAME);
        setHoveredPop(prop.POP_2011_2015);
        setHoveredIncome(prop.PER_CAPITA_INCOME);
        setHoveredCases(prop.CASES);
      }
      // setHoveredWardID(parseInt(e.features[0].properties.WARD));
      // console.log(parseInt(e.features[0].properties.WARD));
      if (map.getLayer('ward-extrusion-active')) {
        map.setFilter('ward-extrusion-active', [
          '==',
          parseInt(e.features[0].properties.WARD),
          ['to-number', ['get', 'WARD']],
        ]);
      }
    });

    map.on('mouseleave', 'ward-extrusion', function () {
      // setHoveredWardID(5);
      if (hoveredWardID != null) {
        setHoveredWardID(null);
        setHoveredRep(null);
        setHoveredPop(null);
        setHoveredIncome(null);
        setHoveredCases(null);
      }
      if (map.getLayer('ward-extrusion-active')) {
        map.setFilter('ward-extrusion-active', [
          '==',
          -1,
          ['to-number', ['get', 'WARD']],
        ]);
      }
    });

    setMapObj(map);

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
        {/* <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div> */}
        <div className="map-container" ref={mapContainer} />
        <>
          <div className="togglle">
            <Button onClick={onToggle}>Toggle Data</Button>
          </div>
          <Slide
            direction="right"
            in={isOpen}
            style={{ zIndex: 10, width: '10%', height: '70vh', top: '300px' }}
          >
            <Box
              p="20px"
              m="10px"
              color="white"
              mt="4"
              bg="#1a1a1aEF"
              rounded="md"
              shadow="md"
            >
              <VStack
                divider={<Divider borderColor="gray.600" />}
                spacing={4}
                align="stretch"
                className="sidebarWrapper"
              >
                <Text className="sidebarHeader" fontSize="2xl">
                  Data
                </Text>
                <Text className="sidebarHeader" fontSize="2xl">
                  Current Ward : {hoveredWardID}
                </Text>
                <Text className="sidebarHeader" fontSize="2xl">
                  Ward Representative: {hoveredRep}
                </Text>
                <Text className="sidebarHeader" fontSize="2xl">
                  Population: {hoveredPop}
                </Text>
                <Text className="sidebarHeader" fontSize="2xl">
                  Average Income: {hoveredIncome}
                </Text>
                <Text className="sidebarHeader" fontSize="2xl">
                  COVID Cases: {hoveredCases}
                </Text>
              </VStack>
            </Box>
          </Slide>
        </>
      </>
    </div>
  );
};

export default Map;
