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

## Servicios de mapas locales. PNOA
Hasta ahora hemos hecho uso de servicios de datos mundiales. Todos ellos tienen cobertura global y son interesantes para aplicaciones que necesiten esa cobertura. Pero como hemos visto, en todos los casos el servicio era en pago por subscripción y en algunos casos, como en Google Maps, los datos no eran libres. 

¿Existen servicios de mapas a otros niveles?, por suerte existe el concepto de IDE, [Infraestructura de Datos Espaciales. Wikipedia](https://es.wikipedia.org/wiki/Infraestructura_de_Datos_Espaciales), que son organismos encargados de generar u publicar datos geográficos para distintos niveles administrativos. Así, podremos encontrar IDEs [nacionales](http://www.idee.es/estatal#1md), [autonómicas](http://mapas.xunta.gal/portada) e incluso [locales](https://ide.depo.gal/).

La mayoría de las IDEs tienen un catálogo de acceso a datos donde podremos encontrar los mapas que tienen publicados. En las IDEs los mapas se encuentran publicados con servicios [OGC. Wikipedia](https://en.wikipedia.org/wiki/Open_Geospatial_Consortium) que es el organismo encargado de velar por los estándares de comunicación de servicios de información geográfica. 

No es objetivo de este curso profundizar en los estándares de la OGC, pero si resulta inevitable hablar de ellos ya que será a través de estos como podremos acceder a mucha de la información geográfica que existe a nuestra disposición.

### PNOA
El [PNOA](http://pnoa.ign.es/), o Plan Nacional de Ortofografía Aerea, es un proyecto del [Instituto Geográfico Nacional](http://www.ign.es) que *"tiene como objetivo la obtención de ortofotografías aéreas digitales con resolución de 25 ó 50 cm y modelos digitales de elevaciones (MDE) de alta precisión de todo el territorio español, con un período de actualización de 2 ó 3 años, según las zonas"*.

Lo que tendremos a nuestra disposición son ortofotos de toda la península a mucha resolución que podran ser consumidas desde los servicios del IGN.

Para hacer esto, comenzaremos creando una carpeta `ol-pnoa` con nuestro esqueléto básico de OpenLayers, pero esta vez tendremos en cuenta que estamos utilizando un servicio de la Península Ibérica por lo que centraremos el mapa sobre esta.

```html hl_lines="14"
<!DOCTYPE html>
<html>
  <head>
    <title>PNOA y OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
      let map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: [-3.6832130, 40.2589448],
          zoom: 6
        })
      });
    </script>
  </body>
</html>
```

Después deberemos crear la capa que muestre el PNOA. Para ello haremos uso de uno de los servicios que nos proveé la OGC, el servicio WMS. Un servicio [WMS. IdeCanarias](https://www.idecanarias.es/documentacion/ogc_wms). Como ya hemos comentado antes, no es objetivo de este curso el profundizar en los detalles del estandar, simplemente aprenderemos como configurar una capa WMS usando la librería OpenLayers. Para empezar deberemos encontrar la URL del servicio. Habitualmente esto se realiza a través de los catálogos que las IDEs, por ejemplo el de la IDE Nacional, IDEE sería [esta búsqueda](http://www.idee.es/csw-inspire-idee/srv/spa/catalog.search#/search?any=PNOA)

![Catalogo IDEE](_images/catalogo_idee.png)

Y el dato que nos interesa sería [este](http://www.idee.es/csw-inspire-idee/srv/spa/catalog.search#/metadata/spaignPNOAMA)

![PNOA Máxima actualidad](_images/maxima_actualidad.png)

Para poder visualizar un servicio de este tipo en OpenLayers necesitaremos utilizar un tipo de capa que no habíamos utilizado hasta ahora, se trata del tipo [`ol.layer.Image`](https://openlayers.org/en/latest/apidoc/module-ol_layer_Image.html) con una fuente del tipo [`ol.source.ImageWMS`](https://openlayers.org/en/latest/apidoc/module-ol_source_ImageWMS.html).

Según la documentación, habrá dos objetos que necesitamos para configurar la fuente de datos, la `url` y los `params` donde al menos `LAYERS` será obligatorio.

Explicaremos un poco de donde se sacan estos datos. Para configurar un servicio WMS la API de OpenLayers nos pide, una URL, la del servicio y unos parámetros que como mínimo serán el nombre de la capa que queremos cargar. Siguiendo la búsqueda que hemos realizado antes, podemos ver un botón que nos indica

![Servicio WMS](_images/boton_wms.png)

Si pulsamos en ese botón, haremos una petición `GetCapabilities` del estandar WMS, que nos da la descripción del servicio en un hermoso XML

![](_images/200.gif)

Tras el susto inicial, deberemos inspeccionar el documento para obtener los datos que necesitamos para configurar la capa. El primer dato será la URL del servicio, en este caso la obtendremos del navegador ya que es la misma donde estamos haciendo la petición `GetCapabilities`

![URL](_images/url.png)

eliminando los parámetros de la consulta, tendremos la URL del servicio, en este caso `http://www.ign.es/wms-inspire/pnoa-ma?`

Para encontrar la capa que queremos utilizar, deberemos explorar el XML que nos devuelve. En este XML encontraremos una etiqueta de la forma

```xml hl_lines="2"
<Layer queryable="0">
<Name>OI.OrthoimageCoverage</Name>
<Title>Ortoimagen</Title>
<Abstract>
Cobertura ráster opaca de imágenes de satélite y ortofotos PNOA de máxima actualidad (MA). Rangos de visualización: Imagen Spot5 de 20 m de resolución hasta la escala aproximada 1:70 000; a partir de aquí ortofotografías PNOA MA de 0.25 m o 0.50 m de resolución, según la zona
</Abstract>
<KeywordList>
<Keyword>Ortofotografías</Keyword>
<Keyword>Ortofotos</Keyword>
<Keyword>PNOA</Keyword>
<Keyword>España</Keyword>
</KeywordList>
<EX_GeographicBoundingBox>
<westBoundLongitude>-19.00</westBoundLongitude>
<eastBoundLongitude>5.00</eastBoundLongitude>
<southBoundLatitude>27.00</southBoundLatitude>
<northBoundLatitude>44.00</northBoundLatitude>
</EX_GeographicBoundingBox>
<BoundingBox CRS="CRS:84" minx="-19.0" miny="27.0" maxx="5.0" maxy="44.0"/>
<BoundingBox CRS="EPSG:25830" minx="-1099673.713793886" miny="2986435.242554414" maxx="1295248.9457834428" maxy="4998012.359900884"/>
<BoundingBox CRS="EPSG:32630" minx="-1099673.7137993197" miny="2986435.2425578996" maxx="1295248.9457861297" maxy="4998012.359913771"/>
<BoundingBox CRS="EPSG:4258" minx="27.000000000763837" miny="-19.0" maxx="44.00000000094271" maxy="5.0"/>
<BoundingBox CRS="EPSG:4326" minx="27.0" miny="-19.0" maxx="44.0" maxy="5.0"/>
<BoundingBox CRS="EPSG:4230" minx="36.17" miny="-9.52" maxx="44.00" maxy="5.00"/>
<BoundingBox CRS="EPSG:25828" minx="102948.37120930111" miny="2986435.242554414" maxx="2508202.7078586714" maxy="5070480.910938781"/>
<BoundingBox CRS="EPSG:25829" minx="-495135.75545113813" miny="2988008.138364256" maxx="1897204.2192702503" maxy="4968139.496965927"/>
<BoundingBox CRS="EPSG:25831" minx="-1714549.1480570585" miny="2988008.138364256" maxx="698454.234216212" maxy="5113259.329838102"/>
<BoundingBox CRS="EPSG:32628" minx="102948.37120796047" miny="2986435.2425578996" maxx="2508202.7078655367" maxy="5070480.910951035"/>
<BoundingBox CRS="EPSG:32629" minx="-495135.75545450323" miny="2988008.1383677055" maxx="1897204.2192749865" maxy="4968139.496979078"/>
<BoundingBox CRS="EPSG:32631" minx="-1714549.148064664" miny="2988008.1383677055" maxx="698454.2342168819" maxy="5113259.329849991"/>
<BoundingBox CRS="EPSG:3857" minx="-2115070.325072198" miny="3123471.749104576" maxx="556597.4539663679" maxy="5465442.183322753"/>
<BoundingBox CRS="EPSG:23029" minx="453232.16" miny="4002993.85" maxx="1622799.23" maxy="4968233.16"/>
<BoundingBox CRS="EPSG:23030" minx="-86780.31" miny="4022622.27" maxx="1141492.98" maxy="4903175.90"/>
<BoundingBox CRS="EPSG:23031" minx="-628724.14" miny="4076330.91" maxx="660356.81" maxy="4873906.61"/>
<Attribution>
<Title>Sistema Cartográfico Nacional</Title>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.scne.esm"/>
</Attribution>
<Identifier authority="SCNE">OI.OrthoimageCoverage</Identifier>
<MetadataURL type="ISO19115:2003">
<Format>text/plain</Format>
<OnlineResource xlink:type="simple" xlink:href="http://www.ign.es/csw-inspire/srv/spa/csw?SERVICE=CSW&VERSION=2.0.2&REQUEST=GetRecordById&outputSchema=http://www.isotc211.org/2005/gmd&ElementSetName=full&ID=spaignPNOAMA"/>
</MetadataURL>
<Style>
<Name>default</Name>
<Title>Estilo por defecto de la ortoimagen</Title>
<Abstract>
La cobertura de ortoimágenes se renderizan como datos raster
</Abstract>
<LegendURL width="125" height="21">
<Format>image/png</Format>
<OnlineResource xmlns:xlink="http://www.w3.org/1999/xlink" xlink:type="simple" xlink:href="http://www.ign.es/wms-inspire/pnoa-ma?version=1.3.0&service=WMS&request=GetLegendGraphic&sld_version=1.1.0&layer=OI.OrthoimageCoverage&format=image/png&STYLE=default"/>
</LegendURL>
</Style>
</Layer>
```

Se trata de la descripción XML de una de las capas que nos ofrece el servicio. En este caso el valor que nos interesa para OpenLayers será el `Name`

Y ya tendríamos los datos necesarios para configurar una capa WMS en nuestro visor.

Siguiendo la configuración que necesitamos mediante OpenLayers, deberemos crear una capa con el PNOA, para ello

```html hl_lines="11 12 13 14 15 16 23 24 25"
<!DOCTYPE html>
<html>
  <head>
    <title>PNOA y OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
      const PNOA = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: 'http://www.ign.es/wms-inspire/pnoa-ma?',
          params: {'LAYERS': 'OI.OrthoimageCoverage'},
        })
      })
      let map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: [-3.6832130, 40.2589448],
          zoom: 6
        }),
      layers: [
        PNOA
      ]
      });
    </script>
  </body>
</html>
```

![URL](_images/no_pnoa.png)

!!! warning
    ¿Se ve el mapa?, probad a navegar sobre el mismo haciendo zoom y pan con el ratón, ¿lo encontráis?. ¿Sabeis que puede estar ocurriendo?.

Si inspeccionamos el mapa (Ctrl + Mayus + i en Chrome) y en la pestaña *Network*, veremos que se está realizando una petición al servicio del PNOA y que esta se está resolviendo correctamente.

![Network](_images/network.png)

La petición que se está realizando es esta

[http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=OI.OrthoimageCoverage&CRS=EPSG:3857&STYLES=&WIDTH=812&HEIGHT=407&BBOX=-993069.8714810099,-497757.9281930678,993069.8714810099,497757.9281930678](http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=OI.OrthoimageCoverage&CRS=EPSG%3A3857&STYLES=&WIDTH=812&HEIGHT=407&BBOX=-993069.8714810099%2C-497757.9281930678%2C993069.8714810099%2C497757.9281930678)

Que nos devuelve un fondo negro, sin embargo, si cambiamos alguno de estos datos, tendríamos una petición similar pero que si nos está devolviendo algo que podemos ver

[http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=OI.OrthoimageCoverage&CRS=EPSG:3857&STYLES=&WIDTH=1170&HEIGHT=585&BBOX=-1841826.633559607,4188749.150027659,1019975.705437392,5619650.319526158](http://www.ign.es/wms-inspire/pnoa-ma?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=OI.OrthoimageCoverage&CRS=EPSG%3A3857&STYLES=&WIDTH=1170&HEIGHT=585&BBOX=-1841826.633559607%2C4188749.150027659%2C1019975.705437392%2C5619650.319526158)

¿Cúal es la diferencia?. Si revisamos las URLs, veremos que están compuestas de parámetros por ejemplo, `REQUEST`, `FORMAT`, `LAYERS`, donde podemos ver algo que nos sonará, etc, todos definidos por el estandar, y encontraremos dos que son importantes para entender lo que está sucediendo, `CRS=EPSG:3827` y `BBOX=...`. 

`CRS` indica el sistema de coordenadas en el que se está realizando la petición, mientras que `BBOX` muestra las coordenadas del encuadre que se está visualizando. Si echamos un vistazo a las coordenadas. `-1841826.633559607,4188749.150027659,1019975.705437392,5619650.319526158`, veremos que se trata de unos números muy grandes, mientras que los que nosotros hemos usado para indicar el centro, son números mucho más pequeños, `-3.6832130, 40.2589448`. Esto en principio no resulta extraño si no se está acostumbrado a trabajar con coordenadas, pero lo que está pasando es que por defecto, OpenLayers utiliza las coordenadas [*Web Mercator* Wikipedia](https://en.wikipedia.org/wiki/Web_Mercator_projection), y ¿qué es la proyección *Web Mercator*?, pues es una proyección que se usa como estandar de facto en las aplicaciones web y es el que que están todos los servicios que hemos usado anteriormente. Sin embargo con las coordenadas que nosotros hemos indicado el centro están en el sistema [WGS:84](https://en.wikipedia.org/wiki/World_Geodetic_System), o lo que viene siendo coordenadas geográficas, las del GPS de toda la vida vamos.

Os dejamos un entretenido [video Youtube](https://www.youtube.com/watch?v=kIID5FDi2JQ) explicando lo que son las proyecciones y los problemas que hay con su uso.

Pero volvamos a nuestro problema. Si como os decimos, el mapa de OpenLayers está por defecto en el sistema *Web Mercator*, una manera de solucionar nuestro problema de centrado, es transformar las coordenadas del centro a ese sistema. Para ello podremos utilizar cualquiera de los infinitos servicios web que existen para ello, por ejemplo [epsg.io](http://epsg.io/transform#s_srs=4326&t_srs=3857). Si cambiamos las coordenadas a `Format: dm` e introducimos las coordenadas del centro, podremos obtener las mismas coordenadas transformadas. Si sustituimos esto en nuestro visor

```html hl_lines="20"
<!DOCTYPE html>
<html>
  <head>
    <title>PNOA y OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
      const PNOA = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: 'http://www.ign.es/wms-inspire/pnoa-ma?',
          params: {'LAYERS': 'OI.OrthoimageCoverage'},
        })
      })
      let map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: [-410013.40, 4903643.09],
          zoom: 6
        }),
      layers: [
        PNOA
      ]
      });
    </script>
  </body>
</html>
```

problema solucionado. Pero OpenLayers nos ofrece herramientas para poder realizar transformaciones usando la librería. Podríamos definir la proyección del mapa para que usase la que nosotros necesitamos, o podemos transformar las coordenadas usando las utilizades de proyección que tenemos disponibles. En este caso [`ol.proj.fromLonLat`](https://openlayers.org/en/latest/apidoc/module-ol_proj.html#.fromLonLat) nos permitirá transformar las coordenadas desde la proyección geográfica a cualquier sistema de coordenadas, por defecto *Web Mercator*

```html hl_lines="20"
<!DOCTYPE html>
<html>
  <head>
    <title>PNOA y OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
      const PNOA = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: 'http://www.ign.es/wms-inspire/pnoa-ma?',
          params: {'LAYERS': 'OI.OrthoimageCoverage'},
        })
      })
      let map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: ol.proj.fromLonLat([-3.6832130, 40.2589448]),
          zoom: 6
        }),
      layers: [
        PNOA
      ]
      });
    </script>
  </body>
</html>
```
