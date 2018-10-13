/**
 * @module olgm/layer/Google
 */
import LayerGroup from 'ol/layer/Group.js';

/**
 * @typedef {Object} Options
 * @property {boolean} [visible=true] Visibility.
 * @property {google.maps.MapTypeId<(number|string)>|string|undefined} [mapTypeId=google.maps.MapTypeId.ROADMAP] The type of google map
 * @property {Array<google.maps.MapTypeStyle>|undefined} [styles] Google map styling
 */

/**
 * @classdesc
 * An ol3 layer object serving the purpose of being added to the ol3 map
 * as dummy layer. The `mapTypeId` defines which Google Maps map type the
 * layer represents.
 * @api
 */
var GoogleLayer = (function (LayerGroup) {
  function GoogleLayer(opt_options) {
    LayerGroup.call(this, opt_options);
    var options = opt_options ? opt_options : {};

    /**
     * @type {google.maps.MapTypeId<(number|string)>|string}
     * @private
     */
    this.mapTypeId_ = options.mapTypeId !== undefined ? options.mapTypeId :
      google.maps.MapTypeId.ROADMAP;

    /**
     * @type {?Array<google.maps.MapTypeStyle>}
     * @private
     */
    this.styles_ = options.styles ? options.styles : null;

  }

  if ( LayerGroup ) GoogleLayer.__proto__ = LayerGroup;
  GoogleLayer.prototype = Object.create( LayerGroup && LayerGroup.prototype );
  GoogleLayer.prototype.constructor = GoogleLayer;


  /**
   * @return {google.maps.MapTypeId<(number|string)>|string} map type id
   * @api
   */
  GoogleLayer.prototype.getMapTypeId = function getMapTypeId () {
    return this.mapTypeId_;
  };


  /**
   * @return {?Array<google.maps.MapTypeStyle>} map styles
   */
  GoogleLayer.prototype.getStyles = function getStyles () {
    return this.styles_;
  };

  return GoogleLayer;
}(LayerGroup));
export default GoogleLayer;

//# sourceMappingURL=Google.js.map