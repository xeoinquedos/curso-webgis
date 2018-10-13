/**
 * @module olgm/herald/Source
 */
import Herald from './Herald.js';

var SourceHerald = (function (Herald) {
  function SourceHerald(ol3map, gmap) {
    Herald.call(this, ol3map, gmap);

    /**
     * Flag that determines whether the GoogleMaps map is currently active, i.e.
     * is currently shown and has the OpenLayers map added as one of its control.
     * @type {boolean}
     * @protected
     */
    this.googleMapsIsActive_ = false;
  }

  if ( Herald ) SourceHerald.__proto__ = Herald;
  SourceHerald.prototype = Object.create( Herald && Herald.prototype );
  SourceHerald.prototype.constructor = SourceHerald;


  /**
   * Watch the layer. This adds the layer to the list of layers the herald is
   * listening to, so that it can display it using Google Maps as soon as the
   * layer becomes visible.
   * @param {module:ol/layer/Base} layer layer to watch
   * @abstract
   * @api
   */
  SourceHerald.prototype.watchLayer = function watchLayer (layer) {};


  /**
   * Stop watching the layer. This removes the layer from the list of layers the
   * herald is listening to, and restores its original opacity.
   * @param {module:ol/layer/Base} layer layer to unwatch
   * @abstract
   * @api
   */
  SourceHerald.prototype.unwatchLayer = function unwatchLayer (layer) {};


  /**
   * Set the googleMapsIsActive value to true or false
   * @param {boolean} active whether or not google maps is active
   * @api
   */
  SourceHerald.prototype.setGoogleMapsActive = function setGoogleMapsActive (active) {
    this.googleMapsIsActive = active;
  };


  /**
   * Find the index of a layer in the ol3 map's layers
   * @param {module:ol/layer/Base} layer layer to find in ol3's layers array
   * @returns {number} suggested zIndex for that layer
   * @api
   */
  SourceHerald.prototype.findIndex = function findIndex (layer) {
    var layers = this.ol3map.getLayers().getArray();
    var layerIndex = layers.indexOf(layer);
    var zIndex = layer.getZIndex();

    if (zIndex != 0) {
      layerIndex = zIndex;
    }

    return layerIndex;
  };

  return SourceHerald;
}(Herald));
export default SourceHerald;

//# sourceMappingURL=Source.js.map