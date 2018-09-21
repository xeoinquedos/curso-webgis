# 7. Extra 1. Un visor rápido con datos vectoriales de OSM usando uMap

¿Qué pasa si tengo mucha prisa, no se programar o quiero hacer una prueba?. ¿Puedo extraer datos de OSM y pintarlos en un mapa de forma rápida?

La respuesta a todas estas preguntas es sí. Existen decenas, ¿o centenares, o miles? de aplicaciones software libre, privativas y servicios para trabajar con información geográfica.

En este capítulo veremos de forma muy breve:

* Una de las posibles formas de obtener datos vectoriales de esa gran base de datos que es OSM (¡[OSM no es un mapa](http://psanxiao.com/osm-slides/2016-jornadas-cartografia-participativa.html#/16)!)
* Como generar un visor con [uMap](https://wiki.openstreetmap.org/wiki/UMap) en 10 minutos

## Obtener datos vectoriales de OSM mediante Overpass API

OSM no es sólo un mapa, es muchas cosas a la vez:

* Una comunidad
* Un conjunto de herramientas y tecnologías
* Una serie de servicios, de los que el más conocido es el "mapa" en sí

y sobre todo una base de datos de información geográfica libre y colaborativa.

Uno de los **servicios** que la **comunidad** ha generado para acceder a esa **base de datos** es [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API). Como el nombre indica es un `endpoint` al que podemos hacer peticiones HTTP en un lenguaje de consulta a medida.

Como usar Overpass API directamente puede ser un poco complicado las primeras veces otra de las **herramientas** de la que disponemos es [Overpass Turbo](https://wiki.openstreetmap.org/wiki/Overpass_turbo). Una especie de interfaz web con un asistente para la generación de consultas en el formato esperado por Overpass API.

El lenguaje de consulta es algo complicado pero está bien descrito en la wiki de OSM. Así que simplemente aproximémonos a él con un ejemplo.

Si somos firmes defensores del derecho de acceso al agua, probablemente estemos en contra de la privatización de este servicio y del gran timo del agua embotellada. Pero que hacer en esas calurosas tardes de verano en la que no tenemos acceso al grifo de nuestra casa. ¿Donde están las fuentes públicas de agua potable de mi ciudad?

1. Busquemos en la wiki de OSM si hay algún tag que represente 'fountain', 'drinking water' o algo que nos interese. [Respuesta](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Ddrinking_water).
2. Con el tag que debemos emplear para localizarlas en la mano acudamos a [Overpass Turbo](http://overpass-turbo.eu/)
3. mmm vaya, la consulta de ejemplo por defecto es justo lo que necesitamos. Juguemos un poco con los botones, y al final pulsemos en `Ejecutar`. [Respuesta](http://overpass-turbo.eu/s/C4K)
4. Ya que estamos, simplemente por curiosidad filtremos por aquellas fuentes que tienen un `name` definido. [Respuesta](http://overpass-turbo.eu/s/C4N)
5. Volvamos a la consulta anterior, y añadamos a nuestra fuentes de agua (`amenity:drinking_water`), las fuentes decorativas por si nos apetece remojarnos los pies
6. De nuevo en la wiki de osm buscaremos por [fountain](https://wiki.openstreetmap.org/wiki/Tag:amenity%3Dfountain)
7. Y construiremos una consulta que nos devuelva ambos tipos de fuentes. [Respuesta](http://overpass-turbo.eu/s/C4O)

Y que puedo hacer ahora que tengo la consulta. Además de visualizarlas en la propia página, Overpass Turbo nos da varias opciones de `Exportación`. Guardar el mapa como una imagen, obtener la consulta en un formato que pueda usar como payload de mi HTTP Request, descargar los datos como GeoJSON, ...

Juguemos con las opciones y guardemos la consulta con las opciones de `Compartir`

## Usando uMap

Otra de las herramientas que ha creado la comunidad de OSM es uMap una aplicación cuyo código con la [permisiva licencia WTFPL](https://en.wikipedia.org/wiki/WTFPL) está disponible en [GitHub](https://github.com/umap-project) y del que además se disponen "instancias as a service" [de forma gratuíta](https://umap.openstreetmap.fr/es/) y sin necesidad de login.

uMap es seguramente que son más rápidas de descubrir por uno mismo que leyendo una amplia descripción. Así que entra, juega con ella y [crea un mapa](https://umap.openstreetmap.fr/es/map/new/)


## OSM + uMap = Super Quick Map

Si ya has jugado un poco con uMap verás que es muy fácil incluír datos de OSM a partir de consultas. Por si te pierdes algunas guías de uso:

* [uMap Guide](https://wiki.openstreetmap.org/wiki/UMap/Guide)
* [Creating an always up to date map](http://www.mappa-mercia.org/2014/09/creating-an-always-up-to-date-map.html)
* [Easy web map creation with OpenStreetMap data using uMap and Overpass](http://geometalab.tumblr.com/post/130632772622/easy-web-map-creation-with-openstreetmap-data)

Prueba a crear un nuevo mapa en el que podamos ver las fuentes de agua potable y las decorativas con distintos iconos sobre una cartografía bonita. Podamos consultar su nombre. Podamos añadir nuevas fuentes, ...

Este es el que nosotros hemos creado. **¡Atención!** Este es un enlace anónimo que te permite editar nuestro mapa. Para que el resto de asistentes pueda jugar también con él, no lo edites directamente. En `Editar Ajustes del Map` en la barra de la derecha, busca `Opciones Avanzadas` y pulsa en `Clonar`. Ahora si puedes modificar el mapa.



