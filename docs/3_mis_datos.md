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
Si os fijáis de donde se aplica el estilo veréis que se aplica a nivel de capa. Una capa tiene una fuente de datos, y es la capa la que se encargará de aplicar los estilos a esa fuente de datos.

## El formato GeoJSON

El formato GeoJSON es una de las maneras más habituales en las que encontraréis los datos geográficos en la web. Existen otras alternaticas como el [KML Wikipedia](https://en.wikipedia.org/wiki/Keyhole_Markup_Language) o el [GML](https://en.wikipedia.org/wiki/Geography_Markup_Language) ambos basados en XML. Estos formatos también están disponibles, pero son más complejos y difíciles de usar, a la vez que utilizan más espacio para la representación del dato quedando en franco retroceso con respecto al GeoJSON. Algo similar a lo que está pasando entre el XML y el JSON.

La especificación del GeoJSON la podréis encontrar en [http://geojson.org/](http://geojson.org/) sin embargo, más allá de la misma, de manera sencilla podremos definir un GeoJSON similar al que usamos en el ejemplo anterior.

```json
{
  "type": "Feature",
    "properties": {
        "name": "Dinagat Islands"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [125.6, 10.1]
    }
}
```

Lo que hemos representado anteriormente se define como `Feature` que viene correspondiendo a un elemento que queramos definir geográficamente. En el caso anterior representámos una isla, pero bien podríamos representar un río

```JSON
{
	"type": "Feature",
	"properties": {
		"id": 1,
		"nombre": "Lagares"
	},
	"geometry": {
		"type": "LineString",
		"coordinates": [
			[
				[-8.779801248386176, 42.204426903310839],
				[-8.779541157795173, 42.203256495651324],
				[-8.778804234453997, 42.202823011332981],
				[-8.778847582885829, 42.201609255241635],
				[-8.777937265817318, 42.201045725627793],
				[-8.776203328543961, 42.201262467786961],
				[-8.775206314611779, 42.201392513082467],
				[-8.773905861656761, 42.201392513082467],
				[-8.772562060269909, 42.201305816218799],
				[-8.770958168292054, 42.201089074059624],
				[-8.768530656109354, 42.200959028764125],
				[-8.766840067267829, 42.201045725627793],
				[-8.766319886085823, 42.20121911935513],
				[-8.764022419198623, 42.201695952105304],
				[-8.761551558584088, 42.201565906809797],
				[-8.760554544651908, 42.201565906809797],
				[-8.75869056208305, 42.202259481719146],
				[-8.758300426196543, 42.202519572310145],
				[-8.756263049900349, 42.204210161151671],
				[-8.754442415763323, 42.204773690765514],
				[-8.752578433194463, 42.205987446856859],
				[-8.752578433194463, 42.205987446856859],
				[-8.750714450625605, 42.206030795288697]
			]
		]
	}
}
```

Si nos fijamos podremos ver los tipos de geometrías definidos por el `type`, las colecciones de coordenadas que forman la geometría, así como las diferentes propiedades alfanuméricas de los elementos.

Sin embargo, normalmente los datos aparecen unidos dentro de una colección, lo que en el estandar se llama `FeatureCollection`, que es la encargada de definir un grupo de `Features`.

```json hl_lines="2 10 11 38"
{
	"type": "FeatureCollection",
	"name": "illas",
	"crs": {
		"type": "name",
		"properties": {
			"name": "urn:ogc:def:crs:OGC:1.3:CRS84"
		}
	},
	"features": [{
			"type": "Feature",
			"properties": {
				"fid": 0,
				"Nombre": "Monteagudo"
			},
			"geometry": {
				"type": "Polygon",
				"coordinates": [
					[
						[-8.9177793069136, 42.250809725373166],
						[-8.911016951547506, 42.242486826461047],
						[-8.906855502091448, 42.23537768364028],
						[-8.90876283309214, 42.231216234184224],
						[-8.910496770365498, 42.217691523452032],
						[-8.917605913186264, 42.212663105359297],
						[-8.906508714636775, 42.21248971163196],
						[-8.898705996906667, 42.216824554815354],
						[-8.900960115362032, 42.226707997273493],
						[-8.895411516087288, 42.227228178455505],
						[-8.899572965543346, 42.236418046004296],
						[-8.90269405263539, 42.244220763734404],
						[-8.9177793069136, 42.250809725373166]
					]
				]
			}
		},
		{
			"type": "Feature",
			"properties": {
				"fid": 0,
				"Nombre": "San Martiño"
			},
			"geometry": {
				"type": "Polygon",
				"coordinates": [
					[
						[-8.908069258182797, 42.206941112357221],
						[-8.910843557820169, 42.205727356265868],
						[-8.910843557820169, 42.20087233190047],
						[-8.911537132729512, 42.195323732625724],
						[-8.90512156481809, 42.191855858079009],
						[-8.90061332790736, 42.194109976534371],
						[-8.89489133490528, 42.192549432988351],
						[-8.889862916812543, 42.190468708260319],
						[-8.8891693419032, 42.193243007897692],
						[-8.895238122359952, 42.198444819717764],
						[-8.904427989908747, 42.201392513082475],
						[-8.908069258182797, 42.206941112357221]
					]
				]
			}
		}
	]
}
```

En este ejemplo podemos ver como se crea una `FeatureCollection` que contiene dos `Features`

## El Servicio WFS, Web **Feature** Service

Siguiendo con los datos vectoriales, y continuando con los servicios de datos, veremos ligeramente el servicio WFS. El servicio [WFS Wikipedia](https://en.wikipedia.org/wiki/Web_Feature_Service) es un servicio que, mientras el servicio WMS devolvía imágenes generadas a partir de los datos, este servicio devolverá los datos originales. Solo está disponible para el dato vectorial. 

El OGC, al igual que con el servicio WMS, nos marca una serie de consultas que podremos realizar contra este tipo de servicios. Al ser servicios más pesados, el volumen de datos que devuelven puede ser muy grande, es más dificil encontrarlos dentro de las IDEs, pero aun así existen multitud de ellos.

Por ejemplo, para el siguiente ejemplo, utilizaremos el servicio WFS de ADIF. Para ello nos dirigiremos a la web de la [IDE](http://ideadif.adif.es/) de ADIF y dentro iremos a la zona de *Servicios WFS*.

Para utilizar un servicio WFS con OpenLayers, necesitaremos utilizar unos objetos ya conocidos. Pero antes, crearemos nuestra carpeta `ol-wfs` y dentro nuestra plantilla en el archivo `index.html`.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>WFS y OpenLayers</title>
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

Los objetos que vamos a utilizar serán, en primer lugar una fuente de datos de tipo vector `ol.source.Vector`, el formato `ol.format.GeoJSON`, la capa `ol.layer.VectorLayer` y los estilos `ol.style.Style`.

Como podemos ver, los objetos ya nos son conocidos, pero esta vez los configuraremos de diferente manera.

Lo primero definiremos la fuente de datos. Para ello utilizaremos el objeto `ol.source.Vector`, y le pasaremos la url del servicio WFS que queremos consumir.

La petición WFS tiene unos parámetros definidos, cuya explicación se escapa al contexto de este curso. Simplemente definiremos una petición y se explicará los parámetros mínimos necesarios. Lo primero que necesitaremos es la url base del servicio. En nuestro caso si desde la pestaña de servicios WFS vamos a *Capacidades* podremos ver una petición similar a la que realizamos con el formato WMS.

[http://ideadif.adif.es/gservices/Tramificacion/wfs?request=GetCapabilities](http://ideadif.adif.es/gservices/Tramificacion/wfs?request=GetCapabilities)

Al igual que en el caso del WMS lo que nos mostrará será una descripción de los datos que tenemos disponibles. Buscaremos la capa que queremos consultar, en nuestro caso `TramosFueraServicio` y podremos ver el nombre de la capa en el servidor al igual que en el caso del WMS

```XML hl_lines="2"
<FeatureType xmlns:Tramificacion="http://ideadif.adif.es/tramificacion">
<Name>Tramificacion:TramosFueraServicio</Name>
<Title>Tramos fuera de servicio</Title>
<Abstract/>
<ows:Keywords>
<ows:Keyword>Fuera_Servicio</ows:Keyword>
<ows:Keyword>features</ows:Keyword>
<ows:Keyword>Tramos</ows:Keyword>
<ows:Keyword>Fuera de servicio</ows:Keyword>
<ows:Keyword>IDEADIF</ows:Keyword>
<ows:Keyword>Adif</ows:Keyword>
<ows:Keyword>Tramificación común</ows:Keyword>
<ows:Keyword>Tramificación</ows:Keyword>
</ows:Keywords>
<DefaultCRS>urn:ogc:def:crs:EPSG::25830</DefaultCRS>
<ows:WGS84BoundingBox>
<ows:LowerCorner>-8.914655683594248 36.53235585913574</ows:LowerCorner>
<ows:UpperCorner>3.3319200917149243 43.65437766927871</ows:UpperCorner>
</ows:WGS84BoundingBox>
<MetadataURL xlink:href="http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/8385b48c-2bac-42ea-a319-054d6755af12"/>
<MetadataURL xlink:href="http://ideadif.adif.es/catalog/srv/spa/catalog.search#/metadata/7b6a0fdc-bcc4-40e9-a913-74fc6ef10914"/>
</FeatureType>
</FeatureTypeList>
```

Ahora definiremos la petición WFS que nos interesa siguiendo las normas del estandar.

[http://ideadif.adif.es/gservices/Tramificacion/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=Tramificacion:TramosFueraServicio&outputFormat=application/json&srsname=EPSG:3857](http://ideadif.adif.es/gservices/Tramificacion/wfs?service=WFS&version=1.1.0&request=GetFeature&typename=Tramificacion:TramosFueraServicio&outputFormat=application/json&srsname=EPSG:3857)

A tener en cuenta:

* `srsname` nos indica el sistema de coordenadas en el que queremos que el servicio nos devuelva los datos
* `typename` será el valor del nombre de la capa
* y en `ouputFormat` le indicamos al servidor en que formato queremos que nos devuelva los datos.

Para esto último, es importante comprobar en las [capacidades](http://ideadif.adif.es/gservices/Tramificacion/wfs?request=GetCapabilities) del servicio, que formatos tenemos disponibles

```XML hl_lines="21"
<ows:Operation name="GetFeature">
<ows:DCP>
<ows:HTTP>
<ows:Get xlink:href="http://ideadif.adif.es:80/gservices/Tramificacion/wfs"/>
<ows:Post xlink:href="http://ideadif.adif.es:80/gservices/Tramificacion/wfs"/>
</ows:HTTP>
</ows:DCP>
<ows:Parameter name="resultType">
<ows:AllowedValues>
<ows:Value>results</ows:Value>
<ows:Value>hits</ows:Value>
</ows:AllowedValues>
</ows:Parameter>
<ows:Parameter name="outputFormat">
<ows:AllowedValues>
<ows:Value>text/xml; subtype=gml/3.2</ows:Value>
<ows:Value>GML2</ows:Value>
<ows:Value>KML</ows:Value>
<ows:Value>SHAPE-ZIP</ows:Value>
<ows:Value>application/gml+xml; version=3.2</ows:Value>
<ows:Value>application/json</ows:Value>
<ows:Value>application/vnd.google-earth.kml xml</ows:Value>
<ows:Value>application/vnd.google-earth.kml+xml</ows:Value>
<ows:Value>csv</ows:Value>
<ows:Value>gml3</ows:Value>
<ows:Value>gml32</ows:Value>
<ows:Value>json</ows:Value>
<ows:Value>text/xml; subtype=gml/2.1.2</ows:Value>
<ows:Value>text/xml; subtype=gml/3.1.1</ows:Value>
</ows:AllowedValues>
</ows:Parameter>
<ows:Constraint name="PagingIsTransactionSafe">
<ows:NoValues/>
<ows:DefaultValue>FALSE</ows:DefaultValue>
</ows:Constraint>
<ows:Constraint name="CountDefault">
<ows:NoValues/>
<ows:DefaultValue>1000000</ows:DefaultValue>
</ows:Constraint>
</ows:Operation>

```

Con esto ya estamos preparados para configurar la capa WFS dentro de nuestro visor.

```html hl_lines="20 22 24"
<!DOCTYPE html>
<html>
  <head>
    <title>WFS y OpenLayers</title>
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
      const vectorSource = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
        url: function(extent) {
          return 'https://cors-anywhere.herokuapp.com/http://ideadif.adif.es/gservices/Tramificacion/wfs?service=WFS&version=1.1.0&' + 
		    'request=GetFeature&typename=Tramificacion:TramosFueraServicio&outputFormat=application/json&srsname=EPSG:3857&' +
           	'bbox=' + extent.join(',') + ',EPSG:3857';
        },
        strategy: ol.loadingstrategy.bbox
      });
      const tramos = new ol.layer.Vector({
        source: vectorSource,
        style: new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
          })
        })
      });
      let map = new ol.Map({
        target: 'map',
        view: new ol.View({
          center: ol.proj.fromLonLat([-8.8120584, 42.2154941]),
          zoom: 12
        }),
      layers: [
        PNOA,
	    tramos
      ]
      });
    </script>
  </body>
</html>
```
A resaltar varias cosas. La url del servicio tiene un añadido `https://cors-anywhere.herokuapp.com/`. Esto se encarga de actuar de proxy entre nuestro navegador y el servicio WFS para evitar un error por las [CORS](https://enable-cors.org/). Esto es algo muy común en el desarrollo web por lo que habrá que tenerlo en cuenta en el desarrollo de nuestros servicios.

Ahora la url se trata de una función en vez de una cadena de texto. Esto tiene que ver con la opción `strategy`, ya que lo que consigue el cliente es ir haciendo peticiones limitadas por un contorno en vez de hacer una petición con todas las geometrías del servicio.

Existen parámetros para limitar el número de objetos que queremos descargar del servicio WFS. Estos pueden ser `maxFeatures` o `count` el cual le indica un máximo de objetos a descargar y existe también la posibilidad de hacer filtros para obtener solo las features que nos interesan. Esto para un curso avanzado...

[Probar con Leaflet](./../leaflet/3_mis_datos)