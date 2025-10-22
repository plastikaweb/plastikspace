"use strict";
(self["webpackChunknasa_images"] = self["webpackChunknasa_images"] || []).push([["common"],{

/***/ 3670:
/*!****************************************************************!*\
  !*** ./libs/nasa-images/data-access/src/nasa-images.facade.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NasaImagesFacade: () => (/* binding */ NasaImagesFacade)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _plastik_core_cms_layout_data_access__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @plastik/core/cms-layout/data-access */ 2882);
/* harmony import */ var _plastik_core_router_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @plastik/core/router-state */ 3561);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 6663);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3499);





class NasaImagesFacade extends _plastik_core_router_state__WEBPACK_IMPORTED_MODULE_2__.RouterFacade {
  sidenavConfig = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_plastik_core_cms_layout_data_access__WEBPACK_IMPORTED_MODULE_1__.VIEW_CONFIG);
  routeInfo$ = this.routeName$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(name => this.sidenavConfig()?.find(routeData => routeData.name === name)));
  static ɵfac = /*@__PURE__*/(() => {
    let ɵNasaImagesFacade_BaseFactory;
    return function NasaImagesFacade_Factory(__ngFactoryType__) {
      return (ɵNasaImagesFacade_BaseFactory || (ɵNasaImagesFacade_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetInheritedFactory"](NasaImagesFacade)))(__ngFactoryType__ || NasaImagesFacade);
    };
  })();
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: NasaImagesFacade,
    factory: NasaImagesFacade.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 9274:
/*!****************************************************************************!*\
  !*** ./node_modules/@angular/cdk/fesm2022/unique-selection-dispatcher.mjs ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UniqueSelectionDispatcher: () => (/* binding */ UniqueSelectionDispatcher)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3499);



/**
 * Class to coordinate unique selection based on name.
 * Intended to be consumed as an Angular service.
 * This service is needed because native radio change events are only fired on the item currently
 * being selected, and we still need to uncheck the previous selection.
 *
 * This service does not *store* any IDs and names because they may change at any time, so it is
 * less error-prone if they are simply passed through when the events occur.
 */
class UniqueSelectionDispatcher {
  _listeners = [];
  /**
   * Notify other items that selection for the given name has been set.
   * @param id ID of the item.
   * @param name Name of the item.
   */
  notify(id, name) {
    for (let listener of this._listeners) {
      listener(id, name);
    }
  }
  /**
   * Listen for future changes to item selection.
   * @return Function used to deregister listener
   */
  listen(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter(registered => {
        return listener !== registered;
      });
    };
  }
  ngOnDestroy() {
    this._listeners = [];
  }
  static ɵfac = function UniqueSelectionDispatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || UniqueSelectionDispatcher)();
  };
  static ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: UniqueSelectionDispatcher,
    factory: UniqueSelectionDispatcher.ɵfac,
    providedIn: 'root'
  });
}
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__.setClassMetadata(UniqueSelectionDispatcher, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_1__.Injectable,
    args: [{
      providedIn: 'root'
    }]
  }], null, null);
})();


/***/ }),

/***/ 9810:
/*!***************************************************!*\
  !*** ./libs/nasa-images/data-access/src/index.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NasaImagesFacade: () => (/* reexport safe */ _nasa_images_facade__WEBPACK_IMPORTED_MODULE_0__.NasaImagesFacade)
/* harmony export */ });
/* harmony import */ var _nasa_images_facade__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nasa-images.facade */ 3670);


/***/ })

}]);
//# sourceMappingURL=common.js.map