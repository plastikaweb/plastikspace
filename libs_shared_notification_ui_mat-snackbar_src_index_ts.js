"use strict";
(self["webpackChunknasa_images"] = self["webpackChunknasa_images"] || []).push([["libs_shared_notification_ui_mat-snackbar_src_index_ts"],{

/***/ 4727:
/*!*********************************************************************************************************************************!*\
  !*** ./libs/shared/notification/ui/mat-snackbar/src/lib/notification-ui-mat-snackbar/notification-ui-mat-snackbar.component.ts ***!
  \*********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationUiMatSnackbarComponent: () => (/* binding */ NotificationUiMatSnackbarComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material/icon */ 9370);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/snack-bar */ 4645);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3499);





function NotificationUiMatSnackbarComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "mat-icon", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](ctx);
  }
}
function NotificationUiMatSnackbarComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function NotificationUiMatSnackbarComponent_Conditional_4_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r1.dismiss());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵattribute"]("aria-label", ctx_r1.data.ariaLabel);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx, " ");
  }
}
class NotificationUiMatSnackbarComponent {
  #snackBarRef = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__.MatSnackBarRef);
  data = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_2__.MAT_SNACK_BAR_DATA);
  dismiss() {
    this.#snackBarRef.dismiss();
  }
  static ɵfac = function NotificationUiMatSnackbarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NotificationUiMatSnackbarComponent)();
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
    type: NotificationUiMatSnackbarComponent,
    selectors: [["plastik-shared-notification-ui-mat-snackbar"]],
    decls: 5,
    vars: 3,
    consts: [[1, "flex", "flex-row", "justify-between", "items-center", "gap-sm"], ["matSnackBarLabel", "", 1, "flex", "flex-row", "justify-start", "items-center", "gap-sm"], ["aria-hidden", "true", 1, "basis-5", "md:basis-2"], [1, "text-balance", 3, "innerHTML"], ["mat-button", "", "matSnackBarAction", ""], ["mat-button", "", "matSnackBarAction", "", 3, "click"]],
    template: function NotificationUiMatSnackbarComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵconditionalCreate"](2, NotificationUiMatSnackbarComponent_Conditional_2_Template, 2, 1, "mat-icon", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "p", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵconditionalCreate"](4, NotificationUiMatSnackbarComponent_Conditional_4_Template, 2, 2, "button", 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        let tmp_0_0;
        let tmp_2_0;
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵconditional"]((tmp_0_0 = ctx.data.icon) ? 2 : -1, tmp_0_0);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("innerHTML", ctx.data.message, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeHtml"]);
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵconditional"]((tmp_2_0 = ctx.data.action) ? 4 : -1, tmp_2_0);
      }
    },
    dependencies: [_angular_material_icon__WEBPACK_IMPORTED_MODULE_1__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_1__.MatIcon],
    encapsulation: 2,
    changeDetection: 0
  });
}

/***/ }),

/***/ 5681:
/*!*********************************************************************************************************************************!*\
  !*** ./libs/shared/notification/ui/mat-snackbar/src/lib/notification-ui-mat-snackbar/notification-ui-mat-snackbar.directive.ts ***!
  \*********************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationUiMatSnackbarDirective: () => (/* binding */ NotificationUiMatSnackbarDirective)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 560);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 310);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 4040);
/* harmony import */ var _angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core/rxjs-interop */ 5768);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/snack-bar */ 4645);
/* harmony import */ var _notification_ui_mat_snackbar_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./notification-ui-mat-snackbar.component */ 4727);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 3499);






class NotificationUiMatSnackbarDirective {
  plastikSnackbar = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.input)(null, ...(ngDevMode ? [{
    debugName: "plastikSnackbar"
  }] : []));
  sendDismiss = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.output)();
  #snackBar = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__.MatSnackBar);
  #defaultSnackBarConfig = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_5__.MAT_SNACK_BAR_DEFAULT_OPTIONS);
  #currentSnackBarRef;
  afterDismissed = (0,_angular_core_rxjs_interop__WEBPACK_IMPORTED_MODULE_4__.toSignal)(this.#currentSnackBarRef?.afterDismissed() || rxjs__WEBPACK_IMPORTED_MODULE_0__.EMPTY);
  constructor() {
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.effect)(() => {
      const notification = this.plastikSnackbar();
      if (notification) {
        this.open(notification);
      } else {
        this.dismissCurrentSnackBar();
      }
    });
    if (this.afterDismissed()) {
      this.sendDismiss.emit();
      this.#currentSnackBarRef = undefined;
    }
  }
  ngOnDestroy() {
    this.dismissCurrentSnackBar();
  }
  dismissCurrentSnackBar() {
    if (this.#currentSnackBarRef) {
      this.#currentSnackBarRef?.dismiss();
      this.#currentSnackBarRef = undefined;
    }
  }
  open(config) {
    this.dismissCurrentSnackBar();
    const finalConfig = {
      ...this.#defaultSnackBarConfig,
      ...config
    };
    // Wait for next tick to ensure previous snackbar is fully dismissed
    const snackBarConfig = {
      ...this.addNotificationMatSnackBarConfig(finalConfig),
      ...this.addTypeStyling(finalConfig)
    };
    this.#currentSnackBarRef = this.#snackBar.openFromComponent(_notification_ui_mat_snackbar_component__WEBPACK_IMPORTED_MODULE_6__.NotificationUiMatSnackbarComponent, snackBarConfig);
  }
  addNotificationMatSnackBarConfig({
    duration,
    verticalPosition,
    horizontalPosition,
    ...data
  }) {
    return {
      duration,
      verticalPosition,
      horizontalPosition,
      data
    };
  }
  addTypeStyling({
    containerClass,
    type
  }) {
    return {
      panelClass: [...(containerClass || ''), 'message-box', `message-box-${type?.toLowerCase()}`]
    };
  }
  static ɵfac = function NotificationUiMatSnackbarDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NotificationUiMatSnackbarDirective)();
  };
  static ɵdir = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineDirective"]({
    type: NotificationUiMatSnackbarDirective,
    selectors: [["", "plastikSnackbar", ""]],
    inputs: {
      plastikSnackbar: [1, "plastikSnackbar"]
    },
    outputs: {
      sendDismiss: "sendDismiss"
    }
  });
}

/***/ }),

/***/ 6097:
/*!***************************************************************!*\
  !*** ./libs/shared/notification/ui/mat-snackbar/src/index.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationUiMatSnackbarDirective: () => (/* reexport safe */ _lib_notification_ui_mat_snackbar_notification_ui_mat_snackbar_directive__WEBPACK_IMPORTED_MODULE_0__.NotificationUiMatSnackbarDirective)
/* harmony export */ });
/* harmony import */ var _lib_notification_ui_mat_snackbar_notification_ui_mat_snackbar_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/notification-ui-mat-snackbar/notification-ui-mat-snackbar.directive */ 5681);


/***/ })

}]);
//# sourceMappingURL=libs_shared_notification_ui_mat-snackbar_src_index_ts.js.map