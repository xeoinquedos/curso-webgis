/**
 * @module olgm/gm/MapIcon
 */
import MapElement from './MapElement.js';

/**
 * @typedef {Object} Options
 * @property {boolean} [useCanvas] Whether or not we should draw on canvases when we can, instead of using the Google Maps API. This fixes z-index issues with labels on margers
 */

/**
 * @classdesc
 * @api
 */
var MapIcon = (function (MapElement) {
  function MapIcon(imageStyle, opt_options) {
    MapElement.call(this);

    /**
     * This object contains the ol3 style properties for the icon. We keep
     * it as an object because its properties can change, for example the size
     * is only defined after the image is done loading.
     * @type {module:ol/style/Icon}
     * @private
     */
    this.imageStyle_ = imageStyle;

    this.setValues(opt_options);
  }

  if ( MapElement ) MapIcon.__proto__ = MapElement;
  MapIcon.prototype = Object.create( MapElement && MapElement.prototype );
  MapIcon.prototype.constructor = MapIcon;


  /**
   * Listen to property changes and react accordingly
   * @param {string} prop property
   * @api
   * @override
   */
  MapIcon.prototype.changed = function changed (prop) {
    switch (prop) {
      case 'maxZoom':
      case 'minZoom':
      case 'offsetX':
      case 'offsetY':
      case 'position':
        this.draw();
        break;
      default:
        break;
    }
  };


  /**
   * Draws the icon to the canvas 2d context.
   * @private
   */
  MapIcon.prototype.drawCanvas_ = function drawCanvas_ () {
    var canvas = this.canvas_;
    if (!canvas) {
      return;
    }

    var image = this.imageStyle_.getImage(1);
    if (!image) {
      return;
    }

    var style = canvas.style;

    style.zIndex = /** @type {number} */ (this.get('zIndex'));

    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var anchor = this.imageStyle_.getAnchor() || [0, 0];
    var scale = this.imageStyle_.getScale() || 1;
    var rotation = this.imageStyle_.getRotation() || 0;
    var opacity = this.imageStyle_.getOpacity() || 1;

    var offsetX = anchor[0] * scale;
    var offsetY = anchor[1] * scale;

    var x = canvas.width / 2 - offsetX;
    var y = canvas.height / 2 - offsetY;

    ctx.translate(x + offsetX, y + offsetY);
    ctx.rotate(rotation);
    ctx.translate(-x - offsetX, -y - offsetY);
    ctx.globalAlpha = opacity;

    ctx.drawImage(image, x, y,
      image.width * scale, image.height * scale);
  };


  /**
   * Manage feature being added to the map
   * @api
   * @override
   */
  MapIcon.prototype.onAdd = function onAdd () {
    var canvas = this.canvas_ = document.createElement('canvas');
    var style = canvas.style;
    style.position = 'absolute';

    this.drawCanvas_();

    var panes = this.getPanes();
    if (panes) {
      panes.markerLayer.appendChild(canvas);
    }
  };

  return MapIcon;
}(MapElement));
export default MapIcon;

//# sourceMappingURL=MapIcon.js.map