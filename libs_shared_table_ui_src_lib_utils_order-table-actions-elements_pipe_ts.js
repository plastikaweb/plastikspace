"use strict";
(self["webpackChunknasa_images"] = self["webpackChunknasa_images"] || []).push([["libs_shared_table_ui_src_lib_utils_order-table-actions-elements_pipe_ts"],{

/***/ 3614:
/*!*********************************************************************************!*\
  !*** ./libs/shared/table/ui/src/lib/utils/order-table-actions-elements.pipe.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OrderTableActionsElementsPipe: () => (/* binding */ OrderTableActionsElementsPipe)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 3499);

class OrderTableActionsElementsPipe {
  transform(list) {
    if (!list) {
      throw new Error('An Array List is required to use OrderArrayElementsPipe');
    }
    return list.sort((a, b) => (a.value.order || 0) - (b.value.order || 0));
  }
  static ɵfac = function OrderTableActionsElementsPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || OrderTableActionsElementsPipe)();
  };
  static ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefinePipe"]({
    name: "orderTableActionsElements",
    type: OrderTableActionsElementsPipe,
    pure: true
  });
}

/***/ })

}]);
//# sourceMappingURL=libs_shared_table_ui_src_lib_utils_order-table-actions-elements_pipe_ts.js.map