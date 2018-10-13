/**
 * @module olgm/gm/ImageOverlay
 */
/**
 * @classdesc
 * @api
 */
var ImageOverlay = (function (superclass) {
  function ImageOverlay(src, size, topLeft) {
    superclass.call(this);

    /**
     * @type {string}
     * @private
     */
    this.src_ = src;

    /**
     * @type {Array<number>}
     * @private
     */
    this.size_ = size;

    /**
     * @type {google.maps.LatLng}
     * @private
     */
    this.topLeft_ = topLeft;

    /**
     * @type {HTMLElement}
     * @private
     */
    this.div_ = null;

    /**
     * @type {number}
     * @private
     */
    this.zIndex_ = 0;
  }

  if ( superclass ) ImageOverlay.__proto__ = superclass;
  ImageOverlay.prototype = Object.create( superclass && superclass.prototype );
  ImageOverlay.prototype.constructor = ImageOverlay;


  /**
   * Note: mark as `@api` to make the minimized version include this method.
   * @api
   * @override
   */
  ImageOverlay.prototype.onAdd = function onAdd () {
    var div = document.createElement('div');
    div.style.borderStyle = 'none';
    div.style.borderWidth = '0px';
    div.style.position = 'absolute';
    div.style.zIndex = this.zIndex_;

    // Create the img element and attach it to the div.
    var img = document.createElement('img');
    img.src = this.src_;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.position = 'absolute';
    div.appendChild(img);

    this.div_ = div;

    /**
     * Add the element to the "mapPane" pane. Normally we would put it in the
     * "overlayLayer" pane, but we want to be able to show it behind tile layers,
     * so we place them together in the same pane.
     */
    var panes = this.getPanes();
    panes.mapPane.appendChild(div);
  };


  /**
   * Note: mark as `@api` to make the minimized version include this method.
   * @api
   * @override
   */
  ImageOverlay.prototype.draw = function draw () {
    var div = this.div_;

    var sizeX = this.size_[0];
    var sizeY = this.size_[1];

    div.style.width = sizeX + 'px';
    div.style.height = sizeY + 'px';

    var overlayProjection = this.getProjection();
    var topLeftPx = overlayProjection.fromLatLngToDivPixel(this.topLeft_);

    var offsetX = topLeftPx.x;
    var offsetY = topLeftPx.y;

    // Adjust bad calculations when the view is larger than the world
    var worldWidth = overlayProjection.getWorldWidth();
    if (worldWidth < sizeX) {
      // Overlap of the map on each size
      var mapOverlap = Math.floor(sizeX / worldWidth) / 2;

      // For when only one map is overlapping
      var factor = Math.max(mapOverlap, 1);

      offsetX -= worldWidth * factor;
    }

    div.style.top = offsetY + 'px';
    div.style.left = offsetX + 'px';
  };


  /**
   * Set the zIndex for the div containing the image
   * @param {number} zIndex zIndex to set
   * @api
   */
  ImageOverlay.prototype.setZIndex = function setZIndex (zIndex) {
    this.zIndex_ = zIndex;
    if (this.div_) {
      this.div_.style.zIndex = zIndex;
    }
  };


  /**
   * Note: mark as `@api` to make the minimized version include this method.
   * @api
   * @override
   */
  ImageOverlay.prototype.onRemove = function onRemove () {
    if (this.div_) {
      this.div_.parentNode.removeChild(this.div_);
      this.div_ = null;
    }
  };

  return ImageOverlay;
}(((window.google && window.google.maps && google.maps.OverlayView) || Object)));
export default ImageOverlay;

//# sourceMappingURL=ImageOverlay.js.map