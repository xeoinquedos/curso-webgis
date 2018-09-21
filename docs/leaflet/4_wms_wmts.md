# Y si los datos son enormes

{!leaflet/header.md!}

Poco que comentar en este ejemplo.

```html
{!leaflet/curso-webgis/lf-wms/index.html!}
```

Simplemente fíjate que hemos sacado el `attribution` del elemento `AccessConstraints` del [GetCapabilities](http://www.ign.es/wms-inspire/ign-base?request=GetCapabilities&service=WMS)

## WMTS

Si bien Leaflet no soporta el protocolo WMTS por defecto su uso básico, no es tan distinto del XYZ y podríamos desarrollar algo de código a medida mediante [L.TileLayer](https://leafletjs.com/reference-1.3.4.html#tilelayer).
    
Existe un plugin para [Leaflet](https://github.com/mylen/leaflet.TileLayer.WMTS) que no está demasiado desarrollado. Uno de sus problemas es que por defecto usa una matriz basada en EPSG:3857, y si la capa que queremos emplear no soporta esa proyección como es el caso hace falta un poco de matemáticas.

```html
{!leaflet/curso-webgis/lf-wmts/index.html!}
```
    
Queda como ejercicio para el lector hacer que este código funcione.

## XYZ

Construimos un esqueleto con una capa del PNOA

```html
{!leaflet/curso-webgis/lf-xyz/index.1.html!}
```

Y añadimos una capa XYZ

```html
{!leaflet/curso-webgis/lf-xyz/index.html!}
```

!!! warning "Atención"
    No ves la nueva capa. Recuerda que ya hemos pasado por esto.
    Un par de pistas:
    
    * Orden de visualización de capas
    * [Transparencias](https://leafletjs.com/reference-1.3.4.html#tilelayer-wms)