import 'ol/ol.css';
import 'olgm/olgm.css';
import {Map, View} from 'ol';
import GoogleLayer from 'olgm/layer/Google.js';
import {defaults} from 'olgm/interaction.js';
import OLGoogleMaps from 'olgm/OLGoogleMaps.js';

var center = [0, 0];

const googleLayer = new GoogleLayer();

const map = new Map({
  target: 'map',
  layers: [
    googleLayer
  ],
  view: new View({
    center: [0, 0],
    zoom: 0
  })
});

var olGM = new OLGoogleMaps({map: map});
olGM.activate();
