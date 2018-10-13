/**
 * @module olgm/gm/PanesOverlay
 */
/**
 * @classdesc
 * @api
 */
var PanesOverlay = (function (superclass) {
  function PanesOverlay(gmap) {
    superclass.call(this);

    this.setMap(gmap);
  }

  if ( superclass ) PanesOverlay.__proto__ = superclass;
  PanesOverlay.prototype = Object.create( superclass && superclass.prototype );
  PanesOverlay.prototype.constructor = PanesOverlay;


  /**
   * This function is the only reason this class exists. It returns the panes.
   * @return {google.maps.MapPanes|undefined} array of panes
   * @api
   */
  PanesOverlay.prototype.getMapPanes = function getMapPanes () {
    return this.getPanes();
  };


  /**
   * Override parent function, but do not do anything
   * @api
   * @override
   */
  PanesOverlay.prototype.onAdd = function onAdd () {

  };


  /**
   * Override parent function, but do not do anything
   * @api
   * @override
   */
  PanesOverlay.prototype.draw = function draw () {

  };


  /**
   * Override parent function, but do not do anything
   * @api
   * @override
   */
  PanesOverlay.prototype.onRemove = function onRemove () {

  };

  return PanesOverlay;
}(((window.google && window.google.maps && google.maps.OverlayView) || Object)));
export default PanesOverlay;

//# sourceMappingURL=PanesOverlay.js.map