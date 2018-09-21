# El mapa sin datos. Añadir una capa base

{!leaflet/header.md!}

## Bing Maps

### Instanciamos un mapa que nos permita ver todo el mundo

!!! warning "Atención"
    Otra de las grandes diferencias entre Leaflet y OpenLayers es que si bien ambos tienen una arquitectura muy basada en la integración de funcionalidades mediante plugins, en OpenLayers muchos de estos plugins son mantenidos por el propio core, mientras que Leaflet prefiere mantenerse más ligero y los plugins son mantenidos por la comunidad.
  
En Leaflet no tenemos un origen de datos `Bing` o `Google`, pero existen plugins como [leaflet-bing-layer](https://github.com/digidem/leaflet-bing-layer) que extienden las clases nativas de Leaflet como [Leaflet.TileLayer](https://leafletjs.com/reference-1.3.4.html#tilelayer) para proporcionar esa funcionalidad de forma sencilla.

En el siguiente ejemplo instanciamos un mapa con unos límites que nos permitan ver todo el mundo y añadimos el plugin para Bing.


```html hl_lines="20 23 24"
{!leaflet/curso-webgis/lf-bing/index.1.html!}
```

### Instanciamos las capas de Bing

```html
{!leaflet/curso-webgis/lf-bing/index.2.html!}
```

¿Todavía no vemos nada?. Hemos instanciado las capas pero no las hemos añadido al mapa. Podríamos añadirlas como en los ejemplos anteriores con `map.addLayer`. Pero si descomentamos la línea `layers: baseLayers` empezaremos a ver algo.

La siguiente pregunta es ¿que capa estoy viendo?. Si has copiado el ejemplo tal cual será la capa `AerialWithLabels`, pero si abres la pestaña de `Network` y exploras el `Preview` de las llamadas verás que se están pidiendo imágenes de las tres capas. **¿Intenta responder a porqué sólo estás viendo `AerialWithLabels`?**. Pista: Prueba a cambiar el orden de los elementos del array `styles`.

!!! warning "Atención"

    Al contario que en OpenLayers en Leaflet no es habitual manejar el concepto de que una capa esté añadida al mapa pero no se visualice `visible: false`. En Leaflet para dejar de visualizar una capa lo más habitual es eliminarla del mapa. 
    
    Existen otras opciones como jugar con los [pane](https://leafletjs.com/reference-1.3.4.html#map-pane) en los que se pinta la capa, pero mejor no entrar ahí,...

### Añadimos un control sencillo para seleccionar la capa

```html
{!leaflet/curso-webgis/lf-bing/index.3.html!}
```

Vuelve a abrir la pestaña de `Network` al moverte sobre el mapa. Ahora no añadimos todas las capas si no sólo la que hemos seleccionado, y eliminamos las demás del mapa. De este modo sólo pedimos al servidor lo que nos interesa.

### Extra. El selector de capas nativo de leaflet

En lugar de usar código a medida para el selector de capas hemos usado [usamos el de Leaflet](https://leafletjs.com/examples/layers-control/). Hay muchos [plugins de este estilo](https://leafletjs.com/plugins.html#layer-switching-controls) que aportan opciones adicionales. Jugaremos más con controles de capas en capítulos posteriores.


```html
{!leaflet/curso-webgis/lf-bing/index.4.html!}
```

!!! warning "Atención"

    Un par de conceptos importantes en este ejemplo. 
    
    El control de leaflet hace que sólo una capa base puede estar activa a la vez en un mapa. Mientras que puedes tener tantos overlays como quieras.
    
    Añadimos una capa base de forma inicial para que al cargar el mapa se vea algo. También podríamos haberlo hecho con `map.addLayer(baseLayers[0])`. En el ejemplo anterior se forzaba esta situación llamando a `onChange()` a mano.
    
    


## Google Maps

Usaremos el plugin [Leaflet.GridLayer.GoogleMutant](https://gitlab.com/IvanSanchez/Leaflet.GridLayer.GoogleMutant) para visualizar capas de Google.

Debemos incluir el js del plugin y el js de la API Google Maps. Además usamos el selector de capas de Leaflet.

```html
{!leaflet/curso-webgis/lf-google/index.html!}
```

## Mapbox

Primero añadiremos una simple capa de Mapbox.

En este caso usamos la opción de L.tileLayer que nos permite usar placeholders en la configuración de la url, que pasamos al constructor mediante el parámetro de `options`. Es lo que estamos haciendo en este caso con el `accessToken` y el identificador de estilo del mapa a usar.

```html
{!leaflet/curso-webgis/lf-mapbox/index.1.html!}
```

## Escoger entre varios estilos de capas de Mapbox

Similar a los ejemplos de Google y Bing, Mapbox también nos ofrece la opción de cargar distintos estilos/capas. La variable `styles` contiene el nombre de algunos de estos estilos.

A continuación construímos un array `baseLayers` con una instancia de L.TileLayer por cada estilo. Instanciamos un mapa "mundial".

Y por darle un poco de chicha, empleamos un nuevo plugin de selección de capas: [Leaflet.BaseMaps](https://github.com/consbio/Leaflet.Basemaps). En la documentación del plugin se especifica que añade al mapa al primer elemento de la lista por lo que no es necesario hacerlo a mano.

```html
{!leaflet/curso-webgis/lf-mapbox/index.html!}
```

!!! warning "Atención"
    Te has fijado en los parámetros de tileX, tileY, tileZ del plugin. Recuperan una tile concreta del servidor de mapas que se usará como previsualización, ie:
    
    https://api.mapbox.com/styles/v1/mapbox/basic-v9/tiles/256/1/0/0?access_token=pk.eyJ1IjoibWljaG9nYXIiLCJhIjoiY2ptN3UzNXJnMDhpcDNrbm9tczlibDMzbCJ9.zr2VPbydp2PhiAG5UxVn4w
    
    Veremos el formato XYZ más adelante pero prueba a cambiar esos números y ver que pasa.


## Servicios de mapas locales. PNOA


### PNOA

Instanciamos un mapa en una posición en la que se muestre Vigo.

```html
{!leaflet/curso-webgis/lf-pnoa/index.1.html!}
```

Y añadimos la capa.

```html
{!leaflet/curso-webgis/lf-pnoa/index.html!}
```

Leaflet tiene su propio tipo de capa [WMS](https://leafletjs.com/reference-1.3.4.html#tilelayer-wms) para acceder a este tipo de servicios. Tan sólo debemos conocer la url base y la(s) capa(s) que queremos solicitar.

Si tienes interés en WMS el [tutorial de Leaflet](https://leafletjs.com/examples/wms/wms.html al respecto contiene mucha información de interés
    
Si buscas una forma fácil de añadir más WMS de España [este es tu plugin](https://github.com/sigdeletras/Leaflet.Spain.WMS).

!!! warning "¿Por qué en Leaflet no he tenido que transformar las coordenadas geográficas?"
    Leaflet usa por defecto internamente el CRS EPSG:3857 (coordenadas proyectadas, esos números tan grandes). Pero sus métodos para obtener y setear los límites de la vista, la posición del centro del mapa, etc... funcionan todos con coordenadas geográficas. Leaflet hace la transformación de coordenadas de forma transparente para el usuario en este caso.
    
    https://github.com/Leaflet/Leaflet/blob/master/src/layer/tile/TileLayer.WMS.js#L106