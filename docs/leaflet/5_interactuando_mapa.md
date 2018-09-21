# 5. Interactuando con el mapa

{!leaflet/header.md!}

## Control de capas

Pendiente

## Algunos controles sencillos más

### Vista de pájaro

A este tipo de control se le suele llamar Overview, Vista de Pájaro, MiniMap, Localizador, ...

Hay varios plugins para Leaflet que añaden esta funcionalidad usaremos [Leaflet.MiniMap](https://github.com/Norkart/Leaflet-MiniMap). Al contrario que el plugin de Leaflet no es una representación exacta del mapa principal si no que le pasamos una capa que será la que se visualice en el localizador.

```html
{!leaflet/curso-webgis/lf-layerswitcher/index.2.html!}
```


### Posición del ratón

De nuevo existen bastantes plugins con distintas variantes de como mostrar las coordenadas del ratón, o del centro del mapa, o capturar las coordenadas al hacer click.

Es una implementación sencilla, que dejamos como deberes para casa. Simplemente añade un elemento html en el que pintar las coordenadas. Escucha el evento [mousemove](https://leafletjs.com/reference-1.3.4.html#map-mousemove). Y pinta o transforma a otras coordenadas la propiedad `latlng` del evento.

Hagamos un ejemplo con el plugin [Leaflet.Coordinates](https://github.com/MrMufflon/Leaflet.Coordinates)

```html
{!leaflet/curso-webgis/lf-layerswitcher/index.3.html!}
```


## Interactuando con el servidor

Fijate en que hemos usado el parámetro `transparent` para que podamos pintar dos capas `raster` una encima de otra sin que se oculten la una a la otra. Y el formato png, dado que jpeg, el formato por defecto no admite transparencia.

Los eventos en Leaflet funcionan de modo parecido a OpenLayers. En Leaflet escucharemos el [click](https://leafletjs.com/reference-1.3.4.html#map-click) que nos devolverá, un objeto [MouseEvent](https://leafletjs.com/reference-1.3.4.html#mouseevent), cuya propiedad `latlng` nos dará las coordenadas del punto. Pero getFeatureInfo espera unas coordenadas en pixeles correspondientes a la imagen.

Dado que no disponemos de un método nativo para obtener la url del getFeatureInfo debemos construírla a mano. Lo haremos en modo `hack`, no usar en producción.

```html
{!leaflet/curso-webgis/lf-getfeatureinfo/index.1.html!}
```

### Leaflet y un plugin de WMS

Hasta ahora habíamos empleado la clase de Leaflet L.TileLayer.WMS para interactuar con este tipo de servicios. Pero existe un plugin [Leaflet.wms](https://github.com/heigeo/leaflet.wms) que aporta algunas funcionalidades a mayores como el realizar de forma automática un getFeatureInfo y visualizar los resultados.

Prueba los ejemplos del plugin y pruébalo con la capa WMS que estamos usando.

```html
{!leaflet/curso-webgis/lf-getfeatureinfo/index.2.html!}
```

En este ejemplo sobreescribimos la funcionalidad relacionada con getFeatureInfo para mostrar los resultados en un iframe


## Interactuando en el cliente

Pedimos todas las features como GeoJSON a un servidor WFS

```html
{!leaflet/curso-webgis/lf-dataclient/index.1.html!}
```


En Leaflet no existe el concepto de interaction.Select. Lo más habitual cuando se quiere interactuar con features concretas de una capa, para por ejemplo poner un popup al pulsar sobre una feature, cambiar el color al pasar el botón por encima, ... se realiza añadiendo un listener a la interacción del usuario sobre esa Feature concreta.

Para ello Leaflet provee un hook `onEachFeature`, que es un método que recibe cada una de las features durante la carga de la capa y les aplica la función definida.

```html
{!leaflet/curso-webgis/lf-dataclient/index.html!}
```