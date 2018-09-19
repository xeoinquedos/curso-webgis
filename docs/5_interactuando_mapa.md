# 5. Interactuando con el mapa

Hasta ahora todo lo que hemos realizado con OpenLayers es la visualización de datos. En este punto de curso, trabajaremos con la interacción del usuario con el mapa a través de los controles que la librería pone a nuestra disposición.

En primer lugar instalaremos algunos de los controles básicos para tener un primer acercamiento al uso de estos dentro de la librería.

## Control de capas

Uno de los primeros controles que necesitaremos dentro de nuestro visor es un Arbol de capas. Este es un control básico en muchos visores, ya que nos permite modificar la visualización de las capas que tenemos configuradas en nuestro visor. Hasta la versión 3 de la librería existía un control de este tipo por defecto, mientras que a partir de esa versión se definió mejor la manera de colaborar con terceras partes, y ahora existen plugins que permiten añadir más funcionalidad a la librería.

Un listado de los plugins que podemos usar con OL la podemos tener directamente en su [web](https://openlayers.org/3rd-party/)

Para nuestro caso, utilizaremos el [`OL-LayerSwitcher`](https://github.com/walkermatt/ol-layerswitcher), que nos aporta un arbol de capas fácilmente configurable.

Crearemos una carpeta `ol-layerswitcher` y dentro nuestra plantilla HTML en un archivo `index.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Control de Capas en OpenLayers</title>
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
          zoom: 11
        }),
      layers: [
        PNOA
      ]
      });
    </script>
  </body>
</html>
```

Primero instalaremos el plugin

```html hl_lines="6 11"
<!DOCTYPE html>
<html>
  <head>
    <title>Control de Capas en OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="https://unpkg.com/ol-layerswitcher@3.0.0/src/ol-layerswitcher.css" />
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script src="https://unpkg.com/ol-layerswitcher@3.0.0"></script>
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
            zoom: 11
            }),
        layers: [
            PNOA
        ]
        });
    </script>
  </body>
</html>
```

Seguidamente crearemos las capas necesarias que queramos visualizar

```html hl_lines="19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51"
<!DOCTYPE html>
<html>
  <head>
    <title>Control de Capas en OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="https://unpkg.com/ol-layerswitcher@3.0.0/src/ol-layerswitcher.css" />
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script src="https://unpkg.com/ol-layerswitcher@3.0.0"></script>
    <script>
        const PNOA = new ol.layer.Image({
            source: new ol.source.ImageWMS({
            url: 'http://www.ign.es/wms-inspire/pnoa-ma?',
            params: {'LAYERS': 'OI.OrthoimageCoverage'},
            })
        })
        // Nuevas capas
        const watercolor = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const labels = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'terrain-labels'
            })
        })
        const watercolorHidden = new ol.layer.Tile({
            title: 'Water color',
            type: 'base',
            visible: false,
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const osm = new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new ol.source.OSM()
        })
        const carreteras = new ol.layer.Image({
            title: "Carreteras",
            source: new ol.source.ImageWMS({
                url: 'http://www.ign.es/wms-inspire/ign-base?',
                params: {'LAYERS': 'IGNBaseOrto'},
            })
        })
        //       
        let map = new ol.Map({
            target: 'map',
            view: new ol.View({
            center: ol.proj.fromLonLat([-8.8120584, 42.2154941]),
            zoom: 11
            }),
        layers: [
            PNOA
        ]
        });
    </script>
  </body>
</html>
```

Podemos ver que estamos usando un nuevo tipo de fuente `ol.source.Stamen`. [Stamen](http://maps.stamen.com/) es una empresa muy relacionada con el OpenSource ,que también pone a disposición multiples servicios de teselas que pueden ser consumidos desde la librería. 

Seguidamente crearemos la estructura del arbol de capas. Dentro de un arbol de capas principalmente encontraremos las capas que definimos como base, aquellas que queremos que siempre esten visibles, y las capas superpuestas, `overlays` que son aquellas que podremos activar y desactivar cuando deseemos.

Para realizar estos grupos de capas, capas base y superpuestas, utilizaremos un objeto de la librería, el `ol.layer.group` que nos permite agrupar capas. Crearemos un grupo con dos de las capas anteriores para ir conciendo el control

```html hl_lines="30 31 32 33 34 35 36 37 38 39"
<!DOCTYPE html>
<html>
  <head>
    <title>Control de Capas en OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="https://unpkg.com/ol-layerswitcher@3.0.0/src/ol-layerswitcher.css" />
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script src="https://unpkg.com/ol-layerswitcher@3.0.0"></script>
    <script>
        const PNOA = new ol.layer.Image({
            source: new ol.source.ImageWMS({
            url: 'http://www.ign.es/wms-inspire/pnoa-ma?',
            params: {'LAYERS': 'OI.OrthoimageCoverage'},
            })
        })
        // Nuevas capas
        const watercolor = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const labels = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'terrain-labels'
            })
        })
        const waterWithLabels = new ol.layer.Group({
            title: "Watercolor con etiquetas",
                    type: 'base',
                    combine: true,
                    visible: false,
            layers: [
                watercolor, 
                labels
            ]
        })
        const watercolorHidden = new ol.layer.Tile({
            title: 'Water color',
            type: 'base',
            visible: false,
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const osm = new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new ol.source.OSM()
        })
        const carreteras = new ol.layer.Image({
            title: "Carreteras",
            source: new ol.source.ImageWMS({
                url: 'http://www.ign.es/wms-inspire/ign-base?',
                params: {'LAYERS': 'IGNBaseOrto'},
            })
        })
	//
        let map = new ol.Map({
            target: 'map',
            view: new ol.View({
            center: ol.proj.fromLonLat([-8.8120584, 42.2154941]),
            zoom: 11
            }),
        layers: [
            PNOA
        ]
        });
    </script>
  </body>
</html>
```

Ahora en `waterWithLabels` tendremos un grupo de capas formado por dos capas. La propiedad `combine` nos indica que las dos capas serán combinadas y la propiedad `type` nos indicará que son de tipo `baselayer`.

Ahora seguiremos configurando los grupos de capas que manejaremos desde el arbol.

```html hl_lines="56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 79 80"
<!DOCTYPE html>
<html>
  <head>
    <title>Control de Capas en OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="https://unpkg.com/ol-layerswitcher@3.0.0/src/ol-layerswitcher.css" />
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script src="https://unpkg.com/ol-layerswitcher@3.0.0"></script>
    <script>
        // Nuevas capas
        const watercolor = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const labels = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'terrain-labels'
            })
        })
        const waterWithLabels = new ol.layer.Group({
            title: "Watercolor con etiquetas",
                    type: 'base',
                    combine: true,
                    visible: false,
            layers: [
                watercolor, 
                labels
            ]
        })
        const watercolorHidden = new ol.layer.Tile({
            title: 'Water color',
            type: 'base',
            visible: false,
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const osm = new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new ol.source.OSM()
        })
        const carreteras = new ol.layer.Image({
            title: "Carreteras",
            source: new ol.source.ImageWMS({
                url: 'http://www.ign.es/wms-inspire/ign-base?',
                params: {'LAYERS': 'IGNBaseOrto'},
            })
        })
        //
        // Grupos del arbol
        const baseLayers = new ol.layer.Group({
            'title': 'Base maps',
            layers: [
                waterWithLabels,
                watercolorHidden,
                osm
            ]
        })
        const overlays = new ol.layer.Group({
                title: 'Overlays',
                layers: [
                    carreteras
                ]
	    })
        //
        let map = new ol.Map({
            target: 'map',
            view: new ol.View({
                center: ol.proj.fromLonLat([-8.8120584, 42.2154941]),
                zoom: 11
            }),
            layers: [
                baseLayers,
                overlays
            ]
        });
    </script>
  </body>
</html>
```

Ahora tendremos las capas configuradas en el control de capas, pero necesitaremos añadir el control al mapa para poder utilizarlo.

```html hl_lines="84 85 86 87"
<!DOCTYPE html>
<html>
  <head>
    <title>Control de Capas en OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="https://unpkg.com/ol-layerswitcher@3.0.0/src/ol-layerswitcher.css" />
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script src="https://unpkg.com/ol-layerswitcher@3.0.0"></script>
    <script>
        // Nuevas capas
        const watercolor = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const labels = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'terrain-labels'
            })
        })
        const waterWithLabels = new ol.layer.Group({
            title: "Watercolor con etiquetas",
                    type: 'base',
                    combine: true,
                    visible: false,
            layers: [
                watercolor, 
                labels
            ]
        })
        const watercolorHidden = new ol.layer.Tile({
            title: 'Water color',
            type: 'base',
            visible: false,
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const osm = new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new ol.source.OSM()
        })
        const carreteras = new ol.layer.Image({
            title: "Carreteras",
            source: new ol.source.ImageWMS({
                url: 'http://www.ign.es/wms-inspire/ign-base?',
                params: {'LAYERS': 'IGNBaseOrto'},
            })
        })
        //
        // Grupos del arbol
        const baseLayers = new ol.layer.Group({
            'title': 'Base maps',
            layers: [
                waterWithLabels,
                watercolorHidden,
                osm
            ]
        })
        const overlays = new ol.layer.Group({
                title: 'Overlays',
                layers: [
                    carreteras
                ]
	    })
        //
        let map = new ol.Map({
            target: 'map',
            view: new ol.View({
                center: ol.proj.fromLonLat([-8.8120584, 42.2154941]),
                zoom: 11
            }),
            layers: [
                baseLayers,
                overlays
            ]
        });

        const layerSwitcher = new ol.control.LayerSwitcher({
            tipLabel: 'Arbol de Capas'
        });
        map.addControl(layerSwitcher);
    </script>
  </body>
</html>
```

## Algunos controles sencillos más

Dentro de la librería disponemos de algunos controles sencillos de instalar. Estos serán por ejemplo el control de vista de pájaro, o el de posición de ratón. A continuación configuraremos ambos.

### Vista de pájaro

Sobre el ejemplo anterior del control de capas, añadiremos el control de Vista de pájaro. Este viene en la librería OpenLayers como `ol.control.OverviewMap`. Para instalar nuevos controles, deberemos insertarlos en una propiedad del mapa denominada `controls`

```html hl_lines="82 83 84"
<!DOCTYPE html>
<html>
  <head>
    <title>Control de Capas en OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="https://unpkg.com/ol-layerswitcher@3.0.0/src/ol-layerswitcher.css" />
  </head>
  <body>
     <div id="map" class="map"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script src="https://unpkg.com/ol-layerswitcher@3.0.0"></script>
    <script>
        // Nuevas capas
        const watercolor = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const labels = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'terrain-labels'
            })
        })
        const waterWithLabels = new ol.layer.Group({
            title: "Watercolor con etiquetas",
                    type: 'base',
                    combine: true,
                    visible: false,
            layers: [
                watercolor, 
                labels
            ]
        })
        const watercolorHidden = new ol.layer.Tile({
            title: 'Water color',
            type: 'base',
            visible: false,
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const osm = new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new ol.source.OSM()
        })
        const carreteras = new ol.layer.Image({
            title: "Carreteras",
            source: new ol.source.ImageWMS({
                url: 'http://www.ign.es/wms-inspire/ign-base?',
                params: {'LAYERS': 'IGNBaseOrto'},
            })
        })
        //
        // Grupos del arbol
        const baseLayers = new ol.layer.Group({
            'title': 'Base maps',
            layers: [
                waterWithLabels,
                watercolorHidden,
                osm
            ]
        })
        const overlays = new ol.layer.Group({
                title: 'Overlays',
                layers: [
                    carreteras
                ]
	    })
        //
        let map = new ol.Map({
            target: 'map',
            view: new ol.View({
                center: ol.proj.fromLonLat([-8.8120584, 42.2154941]),
                zoom: 11
            }),
            layers: [
                baseLayers,
                overlays
            ],
            controls: ol.control.defaults().extend([
                new ol.control.OverviewMap()
            ])
        });

        const layerSwitcher = new ol.control.LayerSwitcher({
            tipLabel: 'Arbol de Capas'
        });
        map.addControl(layerSwitcher);
    </script>
  </body>
</html>
```

### Posición del ratón

El control de posición del ratón nos permite obtener las coordenadas de la posición del ratón. Como el control anterior, se trata de un control que viene con la librería, en el objeto `ol.control.MousePosition`.

Para instalar el control, necesitaremos un sitio donde visualizar las coordenadas, así que lo primero crearemos esto.

```html hl_lines="10"
<!DOCTYPE html>
<html>
  <head>
    <title>Control de Capas en OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="https://unpkg.com/ol-layerswitcher@3.0.0/src/ol-layerswitcher.css" />
  </head>
  <body>
    <div id="map" class="map"></div>
    <div id="mouse-position"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script src="https://unpkg.com/ol-layerswitcher@3.0.0"></script>
    <script>
        // Nuevas capas
        const watercolor = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const labels = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'terrain-labels'
            })
        })
        const waterWithLabels = new ol.layer.Group({
            title: "Watercolor con etiquetas",
                    type: 'base',
                    combine: true,
                    visible: false,
            layers: [
                watercolor, 
                labels
            ]
        })
        const watercolorHidden = new ol.layer.Tile({
            title: 'Water color',
            type: 'base',
            visible: false,
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const osm = new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new ol.source.OSM()
        })
        const carreteras = new ol.layer.Image({
            title: "Carreteras",
            source: new ol.source.ImageWMS({
                url: 'http://www.ign.es/wms-inspire/ign-base?',
                params: {'LAYERS': 'IGNBaseOrto'},
            })
        })
        //
        // Grupos del arbol
        const baseLayers = new ol.layer.Group({
            'title': 'Base maps',
            layers: [
                waterWithLabels,
                watercolorHidden,
                osm
            ]
        })
        const overlays = new ol.layer.Group({
                title: 'Overlays',
                layers: [
                    carreteras
                ]
	    })
        //
        let map = new ol.Map({
            target: 'map',
            view: new ol.View({
                center: ol.proj.fromLonLat([-8.8120584, 42.2154941]),
                zoom: 11
            }),
            layers: [
                baseLayers,
                overlays
            ],
            controls: ol.control.defaults().extend([
                new ol.control.OverviewMap()
            ])
        });

        const layerSwitcher = new ol.control.LayerSwitcher({
            tipLabel: 'Arbol de Capas'
        });
        map.addControl(layerSwitcher);
    </script>
  </body>
</html>
```

Después configuraremos el control y lo añadiremos al mapa

```html hl_lines="73 74 75 76 77 78 79 80 81 94"
<!DOCTYPE html>
<html>
  <head>
    <title>Control de Capas en OpenLayers</title>
    <link rel="stylesheet" href="https://openlayers.org/en/v5.2.0/css/ol.css" type="text/css">
    <link rel="stylesheet" href="https://unpkg.com/ol-layerswitcher@3.0.0/src/ol-layerswitcher.css" />
  </head>
  <body>
    <div id="map" class="map"></div>
    <div id="mouse-position"></div>
    <script src="https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.2.0/build/ol.js"></script>
    <script src="https://unpkg.com/ol-layerswitcher@3.0.0"></script>
    <script>
        // Nuevas capas
        const watercolor = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const labels = new ol.layer.Tile({
            source: new ol.source.Stamen({
                layer: 'terrain-labels'
            })
        })
        const waterWithLabels = new ol.layer.Group({
            title: "Watercolor con etiquetas",
                    type: 'base',
                    combine: true,
                    visible: false,
            layers: [
                watercolor, 
                labels
            ]
        })
        const watercolorHidden = new ol.layer.Tile({
            title: 'Water color',
            type: 'base',
            visible: false,
            source: new ol.source.Stamen({
                layer: 'watercolor'
            })
        })
        const osm = new ol.layer.Tile({
            title: 'OSM',
            type: 'base',
            visible: true,
            source: new ol.source.OSM()
        })
        const carreteras = new ol.layer.Image({
            title: "Carreteras",
            source: new ol.source.ImageWMS({
                url: 'http://www.ign.es/wms-inspire/ign-base?',
                params: {'LAYERS': 'IGNBaseOrto'},
            })
        })
        //
        // Grupos del arbol
        const baseLayers = new ol.layer.Group({
            'title': 'Base maps',
            layers: [
                waterWithLabels,
                watercolorHidden,
                osm
            ]
        })
        const overlays = new ol.layer.Group({
                title: 'Overlays',
                layers: [
                    carreteras
                ]
	    })
        //
        // Control MousePosition
        const mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG:4326',
            className: 'custom-mouse-position',
            target: document.getElementById('mouse-position'),
            undefinedHTML: '&nbsp;'
        });
        //
        let map = new ol.Map({
            target: 'map',
            view: new ol.View({
                center: ol.proj.fromLonLat([-8.8120584, 42.2154941]),
                zoom: 11
            }),
            layers: [
                baseLayers,
                overlays
            ],
            controls: ol.control.defaults().extend([
                new ol.control.OverviewMap(),
                mousePositionControl
            ])
        });

        const layerSwitcher = new ol.control.LayerSwitcher({
            tipLabel: 'Arbol de Capas'
        });
        map.addControl(layerSwitcher);
    </script>
  </body>
</html>
```

## Interaccionando con el servidor