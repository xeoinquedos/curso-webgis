# Mas allá de la capa base, añadiendo mis propios datos

{!leaflet/header.md!}

## Datos vectoriales

Creamos el esqueleto del visor con una capa base del PNOA

```html
{!leaflet/curso-webgis/lf-gml/index.1.html!}
```

### Cargamos un GeoJSON externo mediante script

Al contrario que OpenLayers Leaflet no tiene métodos "nativos" para acceder a una url externa que represente un GeoJSON. La persona que desarrolle el mapa es la responsable de pasar el contenido del GeoJSON a Leaflet.

Una de las formas más sencillas de hacer esto, es "convertir" el fichero GeoJSON en un fichero "javascript"
    
```javascript hl_lines="1"
vigo_geojson = 
    {
        "type": "FeatureCollection",
        "name": "vigo",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": [
        { "type": "Feature", 
            "properties": { "id": 1, "Nombre": "Vigo", "Poblacion": 500000 }, 
            "geometry": { "type": "Point", "coordinates": [ -8.733678516914864, 42.219577180236797 ] } 
        }
    }
```
    
y cargarlo como un script.

```html hl_lines="19 30"
{!leaflet/curso-webgis/lf-gml/index.2.html!}
```

### Leaflet, GeoJSON con geometrías "Punto", y los Marker

Otro punto que suele sorprender a la gente que se introduce en Leaflet, es como trata esta librería las features GeoJSON con una geometría de tipo `Point`.

Leaflet las interpreta por defecto como un objeto de tipo [L.Marker](https://leafletjs.com/reference-1.3.4.html#marker). Que en la práctica podemos considerar como iconos. Y por tanto su opción principal de estilo es cambiar el icono que empleamos para mostrarla.
    
Prueba a eliminar la llamada L.geoJSON del código y añadir un marcador simple al mapa en las mismas coordenadas:

```html
{!leaflet/curso-webgis/lf-gml/index.3.html!}
```

!!! warning "Atención"
    ¿No aparece el marcador? ¿Por qué será?


Tratemos de cambiar un poco el marcador por defecto. Si buscas iconos para tus mapas un buen punto para empezar es la librería [Maki de Mapbox](https://www.mapbox.com/maki-icons/).
    
Fijate en como hemos usado el className para poder usar css para modificar el estilo del elemento `img` con el Leaflet incrusta el icono en el mapa

```html
{!leaflet/curso-webgis/lf-gml/index.4.html!}
```

### Representar los `Point` como `CircleMarker`

Si queremos cambiar el ícono de nuestros puntos geojson, o usar otro tipo de representación "vectorial" para ellos como [L.CircleMarker](https://leafletjs.com/reference-1.3.4.html#circlemarker) es un pelín más complicado.

Leaflet proporciona un hook [pointToLayer](https://leafletjs.com/reference-1.3.4.html#geojson-pointtolayer) que se puede pasar en la creación de la capa geoJSON, esa función será llamada para cada feature de tipo punto de la capa.

```html
{!leaflet/curso-webgis/lf-gml/index.5.html!}
```

    
¿Y si quiero aplicar una simbología distinta en función de una variable alfnumérica? El [tutorial de Leaflet](https://leafletjs.com/examples/geojson/) lo explica, las funciones [style](https://leafletjs.com/reference-1.3.4.html#geojson-style), [pointToLayer](https://leafletjs.com/reference-1.3.4.html#geojson-pointtolayer) y [onEachFeature](https://leafletjs.com/reference-1.3.4.html#geojson-oneachfeature) son tus amigas. ¡Pruebalo!

### Obtener un GeoJSON por "url"

Hasta ahora estábamos cargando el GeoJSON como un script, pero es habitual que estos datos provengan de un servicio externo o queramos cargarlos mediante llamadas asíncronas.

Simplemente debemos recuperarlos de la forma que estamos acostumbrados por ejemplo [$.getJSON](https://api.jquery.com/jquery.getjson/) o con [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

```html
{!leaflet/curso-webgis/lf-gml/index.6.html!}
```

## El formato GeoJSON

## El Servicio WFS, Web **Feature** Service

Como explicamos al hablar de GeoJSON Leaflet no proporciona un método nativo para hacer peticiones ajax a este tipo de recursos.
    
Así que debemos obtener todas las features en la carga inicial, descargarlas dinámicamente mediante código a medida o usar algún tipo de plugin.
    
En [este tutorial](https://mappinggis.com/2016/06/anadir-servicio-wfs-leaflet/) puedes ver como usar un plugin de WFS.
    
Este [otro plugin](https://github.com/stefanocudini/leaflet-layerjson) permite la carga dinámica de GeoJSON en función de los movimientos del usuario por el mapa cacheando la respuesta. No es específico de WFS pero encaja bien en lo que hace OpenLayers.
    
En este tutorial vamos a hacer una implementación con código a medida muy simple a efectos de entender que es lo que está sucediendo. Hemos complicado un poco algunas partes del código, simplemente por entender la complejidad que puede llegar a tener trabajar con sistemas de coordenadas y la construcción de peticiones a servicios WFS.
    
En primer lugar construimos nuestro mapa como es habitual, pero en este caso añadiremos una capa GeoJSON vacía que rellenaremos en cada movimiento del usuario con nuevos datos.
    
Primero construiremos una URL base con la que hacer las peticiones al servicio WFS. Podríamos hacerlo simplemente concatenando y substituyendo strings o [usando alguna utilidad](https://leafletjs.com/reference-1.3.4.html#util) de Leaflet como hacen [en este ejemplo](http://jsfiddle.net/expedio/8r1ncv6a/). Usaremos "es6".
    
Para construír nuestra url necesitamos obtener los límites (bounds) de nuestro mapa. Aquí la cosa se complica un poco. Leaflet usa por defecto el EPSG:3857 (coordenadas proyectadas) pero las coordenadas que introducimos o nos devuelven los métodos son geográficas. Si hacemos una petición a un servicio WFS usando como parámetro `srsname: 'EPSG:3857'`, las coordenadas del bbox deben ir en proyectadas y no en geográficas. Por lo que debemos "transformar" las coordenadas
    
El orden concreto en que se deben especificar las coordenadas en un parámetro BBOX puede depender del protocolo, la versión, el EPSG y la implementación concreta del software. Probablemente lo mejor sea probar. Para el caso que nos ocupa, al parámetro [BBox del WFS](http://docs.geoserver.org/latest/en/user/services/wfs/reference.html#getfeature) dice:

> As for which corners of the bounding box to specify, the only requirement is for a 
> bottom corner (left or rightto be provided first. For example, bottom left and top right,
> or bottom right and top left.)

es decir en Geoserver se le pasa primero una cualquiera de las esquinas inferior y luego una superior.
    
El orden de las coordenadas en cada punto para [EPSG:3857](http://epsg.io/3857) es `este, norte`. Y además en el parámetro de `bbox` especificamos en que CRS estamos pasando las coordenadas para evitar errores.
    
Después pondremos un listener `moveend`, que escuche la interacción del usuario con el mapa, pan y zoom, y pida los nuevos datos tras cada movimiento.

```html
{!leaflet/curso-webgis/lf-wfs/index.1.html!}
```

!!! warning "Atención"
    Vale, y después de todo esto, porqué no veo nada. ¡[DuckDuckGo](https://duckduckgo.com/)¡ es tu amigo.

### Leaflet, GeoJSON y el CRS

A pesar de todo lo dicho, [el estándar GeoJSON](https://tools.ietf.org/html/rfc7946#section-4) dice que las capas deben ir en el CRS EPSG:4326, y por defecto Leaflet espera que las coordenadas vengan en este sistema.
    
Cuando hacemos una petición al WFS indicándole otro sistema de coordenadas (EPSG:3857), Leaflet las interpreta de forma incorrecta al ser coordenadas proyectadas.
    
Buf. Vale. Pero y entonces que hago:
    
* Si tu capa base admite el sistema EPSG:4326, la mayoría de los WMS lo harán, puedes usar ese CRS por defecto en Leaflet y todo es muy sencillo
* Si como capa base quieres usar un servicios de teselas típico como OSM o Google, vendrán siempre en 3857, por tanto tendrás que pedir las capas WFS en 4326 o [reproyectar al vuelo](https://gis.stackexchange.com/questions/189126/leaflet-geojson-with-projected-coordinates-3857) mediante alguna librería.
    
Hagamos lo primero en este ejemplo.

```html hl_lines="25 49 63"
{!leaflet/curso-webgis/lf-wfs/index.html!}
```
    

Si quieres continuar practicando:

* Prueba a hacer las peticiones a un servicio WFS sobre un mapa base de OSM
* Cachea y gestiona adecuadamente las llamadas
* En lugar de hacer peticiones inmediatamente tras cada movimiento, [espera a que el usuario acabe](https://leafletjs.com/reference-1.3.4.html#util-throttle)