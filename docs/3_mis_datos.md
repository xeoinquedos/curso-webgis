# Mas allá de la capa base, añadiendo mis propios datos

Hasta ahora hemos estado configurando capas que utilizábamos como base de nuestro mapa. Ahora queremos ir un paso más allá y mostrar datos por encima de esa capa base. De esta manera podríamos mostrar datos de carreteras, de rios, zonas de pesca o lo que nos sea interesante. 

La primera interacción la haremos mostrando datos vectoriales. ¿Qué son los datos vectoriales?. Dentro del mundo de los datos geográficos, existen dos tipos de datos importantes, los vectoriales y los raster. 

## Datos vectoriales
Estos datos están compuestos de una parte geométrica, donde se guarda la representación espacial, y de unos datos alfanuméricos, donde se guardarán los atributos del objeto, por ejemplo si se trata de una carretera estos podrían ser el tipo de carretera que es, el número de accidentes de esa carretera, el color con el que queremos que se visualice, etc, mientras que en la parte geométrica estaría el trazado de la carretera en si mismo. Los datos vectoriales serán puntos, lineas y polígonos con algunas variantes que no compenten en este curso.

Una representación de un dato vectorial podría ser, donde podremos ver la parte geométrica

```JSON hl_lines="8"
{
"type": "FeatureCollection",
"name": "vigo",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": [
    { "type": "Feature", 
        "properties": { "id": 1, "Nombre": "Vigo", "Poblacion": 500000 }, 
        "geometry": { "type": "Point", "coordinates": [ -8.733678516914864, 42.219577180236797 ] } 
    }
]}
```

y la parte alfanumérica

```JSON hl_lines="7"
{
"type": "FeatureCollection",
"name": "vigo",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": [
    { "type": "Feature", 
        "properties": { "id": 1, "Nombre": "Vigo", "Poblacion": 500000 }, 
        "geometry": { "type": "Point", "coordinates": [ -8.733678516914864, 42.219577180236797 ] } 
    }
]}
```

Este último es un dato vectorial en formato [GeoJSON Wikipedia](https://en.wikipedia.org/wiki/GeoJSON) un formato que es también parte del estandar desarrollado por la OGC y que no te hará

![](_images/200.gif)

Si ahora quisiéramos visualizar este archivo en un visor, lo primero que haremos será crear una carpeta `ol-gml` donde crearemos de nuevo nuestro archivo `index.html` con el esqueleto de nuestro visor y con alguna de las capas base que hemos visto anteriormente.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>GeoJSON y OpenLayers</title>
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
          center: ol.proj.fromLonLat([-8.8120584, 42.2154941]),
          zoom: 12
        }),
      layers: [
        PNOA
      ]
      });
    </script>
  </body>
</html>
```

Para poder visualizar nuestro dato vectorial, deberemos tener el mismo accesible desde nuestro visor. Para ello crearemos un archivo `vigo.gml` en la carpeta anterior `ol-gml` y copiaremos

```JSON
{
"type": "FeatureCollection",
"name": "vigo",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": [
    { "type": "Feature", 
        "properties": { "id": 1, "Nombre": "Vigo", "Poblacion": 500000 }, 
        "geometry": { "type": "Point", "coordinates": [ -8.733678516914864, 42.219577180236797 ] } 
    }
]}
```

Ahora si vamos a nuestro navegador a la ruta [http://localhost:8080/vigo.gml](http://localhost:8080/vigo.gml) este debería descargarnos el archivo que acabamos de crear.

Ahora añadiremos este dato a nuestro visor. Para ello utilizaremos una nueva capa con una nueva fuente de datos. 

```html hl_lines="17 18 19 20 21 22 31"
<!DOCTYPE html>
<html>
  <head>
    <title>GeoJSON y OpenLayers</title>
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
      const vigo = new ol.layer.Vector({
		source: new ol.source.Vector({
			url: "vigo.gml",
			format: new ol.format.GeoJSON()
		})
	  })
      let map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: ol.proj.fromLonLat([-8.8120584, 42.2154941]),
          zoom: 12
        }),
      layers: [
        PNOA,
        vigo
      ]
      });
    </script>
  </body>
</html>
```

Si inspeccionamos la pestaña *Network* de la herramienta de desarrollo del navegador, veremos que es realiza la petición al archivo *GeoJSON* correctamente, y veremos que se visualiza un círculo azul. Esto es debido a que las capas que hasta ahora hemos consumido tienen su propio estilo, es decir, los colores, etc de las geometrías ya están definidas. Sin embargo en el caso de nuestro dato vectorial, solo nos hemos descargado el dato y tendremos que simbolizarlo.

Tendremos que tener en cuenta el tipo de geometría que vamos a estilizar para saber que propiedades podemos usar. Por ejemplo, podremos definir el radio de un punto pero no de una línea, y cosas de este tipo. En nuestro caso como se trata de un punto, definiremos un círculo de color. Para ello creamos un estilo en OpenLayers de la siguiente manera

```html hl_lines="11 12 13 14 15 16 17 18 19 20 32"
<!DOCTYPE html>
<html>
  <head>
    <title>GeoJSON y OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script>
        const stroke = new ol.style.Stroke({color: 'black', width: 2});
        const fill = new ol.style.Fill({color: 'red'});

        const style = new ol.style.Style({
		    image: new ol.style.Circle({
			    fill,
			    stroke,
			radius: 30
            })
	    })
        const PNOA = new ol.layer.Image({
            source: new ol.source.ImageWMS({
            url: 'http://www.ign.es/wms-inspire/pnoa-ma?',
            params: {'LAYERS': 'OI.OrthoimageCoverage'},
            })
        })
        const vigo = new ol.layer.Vector({
            source: new ol.source.Vector({
                url: "vigo.geojson",
                format: new ol.format.GeoJSON()
            }),
            style
        })
        let map = new ol.Map({
            target: 'map',
            view: new ol.View({
            center: ol.proj.fromLonLat([-8.8120584, 42.2154941]),
            zoom: 12
            }),
        layers: [
            PNOA,
            vigo
        ]
      });
    </script>
  </body>
</html>
```
