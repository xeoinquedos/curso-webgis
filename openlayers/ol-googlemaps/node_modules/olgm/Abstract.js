/**
 * @module olgm/Abstract
 */
var Abstract = function Abstract(ol3map, gmap) {
  /**
   * @type {module:ol/PluggableMap}
   * @protected
   */
  this.ol3map = ol3map;

  /**
   * @type {!google.maps.Map}
   * @protected
   */
  this.gmap = gmap;
};
export default Abstract;

//# sourceMappingURL=Abstract.js.map