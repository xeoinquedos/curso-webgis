# 1. Creando un mapa.

{!leaflet/header.md!}

## Un esqueleto vacío

```html
{!leaflet/curso-webgis/lf-basic/index.1.html!}
```

## Añadimos la librería Leaflet desde un CDN

```html hl_lines="4 8"
{!leaflet/curso-webgis/lf-basic/index.2.html!}
```

## Instanciamos un objeto Map

En Leaflet prácticamente podemos crear todos los objetos de dos formas:

* Mediante `new`
* Mediante una [función factoría](https://leafletjs.com/examples/extending/extending-1-classes.html#factories). Esta forma de hacerlo es lo más habitual y la que usaremos durante el curso. Por eso usamos `L.map` y no new `L.Map`

!!! warning "Atención"
    * Al contrario que en OpenLayers la obtención de un objeto L.Map requiere que al menos le pasemos un [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) o un [id](https://developer.mozilla.org/en-US/docs/Web/API/Element/id)
    * Además de nuevo al contrario que en OpenLayers para que se muestre algún elemento en el DOM Leaflet exige conocer la propiedad `height' del elemento, que podemos especificar de la forma que queramos.

```html hl_lines="9 10 11 20"
{!leaflet/curso-webgis/lf-basic/index.3.html!}
```

Con esto veremos un espacio vacío y los controles de zoom

## Posición inicial del Mapa

Debemos indicar a Leaflet cual será la posición inicial del mapa. Hay muchas formas de hacer esto. Por ejemplo diciendo que [encaje el mapa dentro de unos límites](https://leafletjs.com/reference-1.3.4.html#map-fitbounds) (bounds), pero lo más habitual es mediante [setView](https://leafletjs.com/reference-1.3.4.html#map-example) o inicializando `Map` directamente con un `center` y un `zoom`.

```html hl_lines="21 22"
{!leaflet/curso-webgis/lf-basic/index.4.html!}
```

## Añadimos nuestra primera capa

El objeto Mapa por si sólo no contiene información geográfica. Debemos añadirle capas. Hay distintos tipos de capas que iremos viendo, por ahora añadiremos OSM. Y también un poco de css.

```html hl_lines="27 28 29 30"
{!leaflet/curso-webgis/lf-basic/index.5.html!}
```

!!! warning "Atención"
    Uops. ¿No estás viendo Vigo en el mapa, si no África?. Esta es una lección importante que repasaremos más adelante. No todos los "Sistemas de Coordenadas", ni todas las librerías entienden el mismo orden (x e y), (latitud, longitud) cuando usamos un array para especificar las coordenadas de un punto geográfico. 
    
    En este momento llega con decir que:
    
    * Cuando uses una librería debes asegurarte de que estás creando el array de coordenadas en el orden especificado por la librería o crear un objeto específico en lugar de un array. Por ejemplo leaflet tiene el objeto [L.latLng](https://leafletjs.com/reference-1.3.4.html#latlng)
    * Leaflet usa LatLong, mientras que OpenLayers usa [LongLat](https://openlayers.org/en/latest/doc/faq.html#why-is-the-order-of-a-coordinate-lon-lat-and-not-lat-lon-)

```html hl_lines="23"
{!leaflet/curso-webgis/lf-basic/index.html!}
```