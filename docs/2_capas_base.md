# El mapa sin datos. Añadir una capa base
Como hemos visto antes, hemos podido ver datos en el momento que hemos añadido la capa de OpenStreetMap. Uno de los primeros retos con los que se enfrenta uno al crear visores web es el crear un mapa con una capa base. Hasta ahora el uso de Google Maps ha difundido la imagen del mapa con las diferentes capas que Google proporciona, satélite, terreno y mapas.

Utilizando las librerías de mapas libres como Ol y Leeaflet, podremos realizar visores similares utilizando los servicios de mapas globales más comunes como son Bing o Google Maps.

## Bing Maps
En julio del 2010 Microsoft firmo un acuerdo con DigitalGlobe, un proveedor de imágenes satelitales para generar una ortofoto aerea de cobertura global dentro del programa Ortho Aerial de la compañia.

Estas compañías de servicios de mapas generalmente funcionan con pago por consumo de porción de mapa (tesela), y habrá que generar un token de identificación para poder consumir sus servicios.

Para obtener una key que nos permita el uso de estos datos iremos a [https://www.bingmapsportal.com/](https://www.bingmapsportal.com/).

!!! tip
    Para uso durante el curso podréis usar la key AqU3C-Sa7exTZ1zqoy25oXm8H0MFgMxG3_ZKV87ZVZcX27RIzUrNQ5rQOV1DKt3t

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