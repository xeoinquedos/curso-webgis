# El mapa sin datos. Añadir una capa base
Como hemos visto antes, hemos podido ver datos en el momento que hemos añadido la capa de OpenStreetMap. Uno de los primeros retos con los que se enfrenta uno al crear visores web es el crear un mapa con una capa base. Hasta ahora el uso de Google Maps ha difundido la imagen del mapa con las diferentes capas que Google proporciona, satélite, terreno y mapas.

Utilizando las librerías de mapas libres como Ol y Leeaflet, podremos realizar visores similares utilizando los servicios de mapas globales más comunes como son Bing o Google Maps.

## Bing Maps
En julio del 2010 Microsoft firmo un acuerdo con DigitalGlobe, un proveedor de imágenes satelitales para generar una ortofoto aerea de cobertura global dentro del programa Ortho Aerial de la compañia.

Estas compañías de servicios de mapas generalmente funcionan con pago por consumo de porción de mapa (tesela), y habrá que generar un token de identificación para poder consumir sus servicios.

Para obtener una key que nos permita el uso de estos datos iremos a [https://www.bingmapsportal.com/](https://www.bingmapsportal.com/).

!!! tip
    Para uso durante el curso podréis usar la key **AqU3C-Sa7exTZ1zqoy25oXm8H0MFgMxG3_ZKV87ZVZcX27RIzUrNQ5rQOV1DKt3t**

Siguiendo con el ejemplo anterior, sustituiremos la capa de OSM por la nueva de Bing y añadiremos un control que nos permita cambiar entre las diferentes tipos de capas de Bing

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Bing Maps</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">

  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
      let map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: [0, 0],
          zoom: 1
        })
      });
    </script>
  </body>
</html>
```

Hasta ahora nada nuevo. Hemos creado un mapa con una vista centrada en las coordenadas latitud 0 y longitud 0 y con un nivel de zoom 1 que será el más grande, donde podremos ver todo el mundo.

Lo siguiente como habíamos visto sería insertar la capa de Bing Maps. En este caso haremos una colección con todas las capas que Bing nos ofrece para poder ir seleccionandolas una a una. 

```html hl_lines="12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 35"
<!DOCTYPE html>
<html>
  <head>
    <title>Bing Maps</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">

  </head>
  <body>
    <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
        let styles = [
            'Road',
            'Aerial',
            'AerialWithLabels'
        ];
        let layers = [];
        let i, ii;
        for (i = 0, ii = styles.length; i < ii; ++i) {
            layers.push(new ol.layer.Tile({
                visible: false,
                preload: Infinity,
                source: new ol.source.BingMaps({
                    key: 'AqU3C-Sa7exTZ1zqoy25oXm8H0MFgMxG3_ZKV87ZVZcX27RIzUrNQ5rQOV1DKt3t',
                    imagerySet: styles[i]
                })
            }));
        }
        let map = new ol.Map({
            target: 'map',
            view: new ol.View({
                center: [0, 0],
                zoom: 1
            }),
            layers: layers
        });
    </script>
  </body>
</html>
```

Podemos observar que repetimos la manera de crear una capa. Si nos damos cuenta, otro concepto importante en la creación de la capa será el de `source` o fuente de datos, que será de donde la capa se nutre de la información que va a representar.
Observamos el uso de dos nuevas propiedades de la capa, `visible` que nos indica si la capa se ve o no se ve, en este caso, como es `false` las capas no se verán, y la propiedad `preload` que irá cargando porciones de mapa a baja resolución entre cambios de nivel de zoom.

De momento tendremos un mapa con unas capas sin visibilidad. Ahora crearemos un control que nos permita seleccionar la capa que deseemos y la haga visible.

```html hl_lines="9 10 11 12 13 43 44 45 46 47 48 49 50 51"
<!DOCTYPE html>
<html>
  <head>
    <title>Bing Maps</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">

  </head>
  <body>
    <select id="layer-select">
       <option value="Aerial">Aerial</option>
       <option value="AerialWithLabels" selected>Aerial with labels</option>
       <option value="Road">Road (static)</option>
    </select>
    <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
        let styles = [
            'Road',
            'Aerial',
            'AerialWithLabels'
        ];
        let layers = [];
        let i, ii;
        for (i = 0, ii = styles.length; i < ii; ++i) {
            layers.push(new ol.layer.Tile({
                visible: false,
                preload: Infinity,
                source: new ol.source.BingMaps({
                    key: 'AqU3C-Sa7exTZ1zqoy25oXm8H0MFgMxG3_ZKV87ZVZcX27RIzUrNQ5rQOV1DKt3t',
                    imagerySet: styles[i]
                })
            }));
        }
        let map = new ol.Map({
            target: 'map',
            view: new ol.View({
                center: [0, 0],
                zoom: 1
            }),
            layers: layers
        });
        
        let select = document.getElementById('layer-select');
        const onChange = () => {
            let style = select.value;
            for (let i = 0, ii = layers.length; i < ii; ++i) {
                layers[i].setVisible(styles[i] === style);
            }
        }
        select.addEventListener('change', onChange);
        onChange();
    </script>
  </body>
</html>
```

## Google Maps
Google ha hecho mucho hincapie en que los desarrolladores usen sus librerías para el consumo de sus servicios. Aun así, se han ido articulando caminos para poder hacer uso de sus servicios de mapas desde librerías externas. En el caso de OpenLayers, en su versión actual 5.2.0, la gente de [Mapgears](http://www.mapgears.com/) han implementado una librería que permite realizar este uso de los servicios de Google desde OL. Como en el caso de Bing, será necesario obtener una key para poder acceder a los mapas. 

!!! tip
    Documentación para la creación de API keys de Google [https://developers.google.com/maps/documentation/javascript/get-api-key](https://developers.google.com/maps/documentation/javascript/get-api-key)

!!! tip
    Para el curso se podrá utilizar la key **AIzaSyCqPQ0dabDFcqSrjGVLvWGyDU3RSgAXayo**

Para hacer uso de esta librería necesitaremos tener un gestor de paquetes como `npm` con el que importar la librería de Mapgears. Para ello crearemos una carpeta `ol-googlemaps` y dentro de ella arrancaremos nuestro proyecto usando `npm`

```bash
$ mkdir ol-googlemaps
$ cd ol-googlemaps
$ npm init
```

Una vez terminado el proceso de creación de nuestro proyecto instalaremos las dependencias del mismo, `openlayers` y `olgm`

```bash
$ npm install ol olgm
```

Para poder hacer uso de las librerías deberemos instalar una herramienta que nos permita este uso

```bash
$ npm install --save-dev parcel-bundler
```

Dentro de la carpeta `ol-googlemaps` crearemos un archivo `index.js`:

```JavaScript
import 'ol/ol.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 0
  })
});
```

y seguidamente un fichero `index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Using Parcel with OpenLayers</title>
    <style>
      html, body, #map {
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="./index.js"></script>
  </body>
</html>
```

Ahora crearemos las tareas de creación del visor mediante el uso de la herramienta. Para ello añadimos en el archivo `package.json` que se habrá creado tras la ejecución del comando `npm init` lo siguiente:

```JSON hl_lines="8 9"
{
  "name": "ol-googlemaps",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "parcel index.html",
    "build": "parcel build --public-url . index.html"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "ol": "^5.2.0",
    "olgm": "^1.0.0-beta.4"
  }
}
```

si ahora ejecutamos `npm start` podremos ver el visor en [http://localhost:1234/](http://localhost:1234/)

Añadiremos la capa de Google haciendo uso de la librería de Mapgears:

```JavaScript hl_lines="4 5 6 8 10 15 23 24"
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
```

Es posible que nos encontremos problemas a la hora de consumir los servicios de mapas de Google debido a las restricciones de uso de las Keys.

## Mapbox
Mapbox es un proveedor de mapas en línea personalizados para sitios web y aplicaciones como Foursquare, Lonely Planet, Facebook, el Financial Times, The Weather Channel y Snapchat. Desde 2010, ha ampliado rápidamente el nicho de mapas personalizados, como respuesta a la opción limitada que ofrecen los proveedores de mapas, como Google Maps. Mapbox es el creador, o un colaborador significativo de algunas bibliotecas y aplicaciones de mapeo de código abierto, incluida la especificación MBTiles, el IDE de cartografía TileMill, la biblioteca JavaScript Leaflet y el lenguaje y analizador de estilo de mapas CartoCSS.

Vamos a ver como es posible usar los mapas de Mapbox con OL. Para ello, como ya es común en este tipo de servicios donde el modelo de negocio es proveer un servicio web, deberemos darnos de alta y obtener un token con el que acceder a sus servicios.

!!! tip
    Para obtener el token [https://www.mapbox.com/](https://www.mapbox.com/).
    Durante el curso se podrá utilizar el token *pk.eyJ1IjoibWljaG9nYXIiLCJhIjoiY2ptN3UzNXJnMDhpcDNrbm9tczlibDMzbCJ9.zr2VPbydp2PhiAG5UxVn4w*

Siguiendo con la dinámica, crearemos una carpeta `ol-mapbox` donde crearemos un archivo `ìndex.html` con el contenido necesario para empezar con un nuevo visor.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Mapbox y OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
      let map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: [0, 0],
          zoom: 2
        })
      });
    </script>
  </body>
</html>
```

Ahora añadiremos la capa de Mapbox, en este caso será la capa `mapbox/street-v1`.

```html hl_lines="17 18 19 20 21 22 23"
<!DOCTYPE html>
<html>
  <head>
    <title>Mapbox y OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
      let map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: [0, 0],
          zoom: 2
        }),
        layers: [
          new ol.layer.Tile({
            source: new ol.source.XYZ({
              url: 'https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWljaG9nYXIiLCJhIjoiY2ptN3UzNXJnMDhpcDNrbm9tczlibDMzbCJ9.zr2VPbydp2PhiAG5UxVn4w'
            })
          })
        ]
      });
    </script>
  </body>
</html>
```

Mapbox nos ofrece la posibilidad de crear nuestros propios estilos y pone a disposición algunos. Siguiendo con el ejemplo de Bing, crearemos un selector que nos permita visualizar algunos de estos estilos. Primero crearemos una colección con los nombres de los estilos de los que disponemos en Mapbox y la lógica para crear cada capa. 

```html hl_lines="11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 37"
<!DOCTYPE html>
<html>
  <head>
    <title>Mapbox y OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
  </head>
  <body>
    <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
      let styles = [
          'basic',
          'streets',
          'bright',
          'light',
          'dark',
          'satellite'
      ];
      let layers = [];
      let i, ii;
      for (i = 0, ii = styles.length; i < ii; ++i) {
          layers.push(new ol.layer.Tile({
              visible: false,
              preload: Infinity,
              source: new ol.source.XYZ({
                url: `https://api.mapbox.com/styles/v1/mapbox/${styles[i]}-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWljaG9nYXIiLCJhIjoiY2ptN3UzNXJnMDhpcDNrbm9tczlibDMzbCJ9.zr2VPbydp2PhiAG5UxVn4w`
              })
          })
        )
      }
      let map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: [0, 0],
          zoom: 2
        }),
        layers
      });
    </script>
  </body>
</html>
```

Ahora crearemos el selector de capas y la lógica que nos permita seleccionar la capa que deseamos ver.

``` html hl_lines="32 33 34 35 45 46 47 48 49 50 51 52"
<!DOCTYPE html>
<html>
  <head>
    <title>Mapbox y OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
  </head>
  <body>
    <select id="layer-select"></select>
    <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
      const select = document.getElementById('layer-select')
      let styles = [
          'basic',
          'streets',
          'bright',
          'light',
          'dark',
          'satellite'
      ];
      let layers = [];
      let i, ii;
      for (i = 0, ii = styles.length; i < ii; ++i) {
        const url = `https://api.mapbox.com/styles/v1/mapbox/${styles[i]}-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWljaG9nYXIiLCJhIjoiY2ptN3UzNXJnMDhpcDNrbm9tczlibDMzbCJ9.zr2VPbydp2PhiAG5UxVn4w`
          layers.push(new ol.layer.Tile({
              visible: false,
              preload: Infinity,
              source: new ol.source.XYZ({
                url
              })
          }));
        const option = document.createElement('option');
        const val = document.createTextNode(styles[i]);
        option.appendChild(val);
        select.appendChild(option);
      }
      let map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: [0, 0],
          zoom: 2
        }),
        layers
      });
      const onChange = () => {
          let style = select.value;
          for (let i = 0, ii = layers.length; i < ii; ++i) {
            layers[i].setVisible(styles[i] === style);
          }
      }
      select.addEventListener('change', onChange);
      onChange();
    </script>
  </body>
</html>
```