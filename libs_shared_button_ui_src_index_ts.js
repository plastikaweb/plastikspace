"use strict";
(self["webpackChunknasa_images"] = self["webpackChunknasa_images"] || []).push([["libs_shared_button_ui_src_index_ts"],{

/***/ 111:
/*!**************************************************************************************!*\
  !*** ./libs/shared/button/ui/src/lib/shared-button-ui/shared-button-ui.component.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharedButtonUiComponent: () => (/* binding */ SharedButtonUiComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 7737);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3499);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/button */ 5849);
/* harmony import */ var _ngrx_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/component */ 8525);
/* harmony import */ var _plastik_shared_button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @plastik/shared/button */ 2515);
/* harmony import */ var _plastik_shared_return_as_observable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @plastik/shared/return-as-observable */ 3187);
/* harmony import */ var angular_svg_icon__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! angular-svg-icon */ 7695);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 4131);










const _c0 = () => ({});
function SharedButtonUiComponent_Conditional_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainer"](0);
  }
}
function SharedButtonUiComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function SharedButtonUiComponent_Conditional_0_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r1);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r1.onClick());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, SharedButtonUiComponent_Conditional_0_ng_container_1_Template, 1, 0, "ng-container", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const content_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx_r1.config.classes || _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpureFunction0"](5, _c0))("disabled", ctx_r1.config.disabled);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵattribute"]("aria-label", ctx_r1.config.ariaLabel)("data-test", ctx_r1.config.dataTestId);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngTemplateOutlet", content_r3);
  }
}
function SharedButtonUiComponent_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "button content");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
}
function SharedButtonUiComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "a", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, SharedButtonUiComponent_Conditional_1_ng_container_1_Template, 2, 0, "ng-container", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    const content_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("href", ctx_r1.config.link, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵattribute"]("aria-label", ctx_r1.config.ariaLabel)("data-test", ctx_r1.config.dataTestId);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngTemplateOutlet", content_r3);
  }
}
function SharedButtonUiComponent_ng_template_2_For_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](2, "returnAsObservable");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](3, "ngrxPush");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const element_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](3, 3, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](2, 1, element_r4.content)));
  }
}
function SharedButtonUiComponent_ng_template_2_For_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "svg-icon", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](1, "returnAsObservable");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](2, "ngrxPush");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](3, "returnAsObservable");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](4, "ngrxPush");
  }
  if (rf & 2) {
    let tmp_13_0;
    let tmp_14_0;
    const element_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ((tmp_13_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](2, 4, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](1, 2, element_r4.content))) == null ? null : tmp_13_0.iconPath) || "")("svgClass", ((tmp_14_0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](4, 8, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](3, 6, element_r4.content))) == null ? null : tmp_14_0.svgClass) || "");
  }
}
function SharedButtonUiComponent_ng_template_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditionalCreate"](0, SharedButtonUiComponent_ng_template_2_For_1_Conditional_0_Template, 4, 5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditionalCreate"](1, SharedButtonUiComponent_ng_template_2_For_1_Conditional_1_Template, 5, 10, "svg-icon", 5);
  }
  if (rf & 2) {
    const element_r4 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditional"](element_r4.type === "text" ? 0 : -1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditional"](element_r4.type === "icon" ? 1 : -1);
  }
}
function SharedButtonUiComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrepeaterCreate"](0, SharedButtonUiComponent_ng_template_2_For_1_Template, 2, 2, null, null, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrepeaterTrackByIndex"]);
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrepeater"](ctx_r1.config.elements);
  }
}
class SharedButtonUiComponent {
  /**
   * @description A configuration object that passes a button configuration to build the button.
   * @param {ButtonConfig} config
   */
  config;
  /**
   * @description Emits the attached button action on button click.
   */
  sendAction = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
  onClick() {
    if (!(0,_plastik_shared_button__WEBPACK_IMPORTED_MODULE_4__.buttonHasALinkGuard)(this.config)) {
      this.sendAction.emit(this.config.doAction);
    }
  }
  static ɵfac = function SharedButtonUiComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SharedButtonUiComponent)();
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: SharedButtonUiComponent,
    selectors: [["plastik-shared-button"]],
    inputs: {
      config: "config"
    },
    outputs: {
      sendAction: "sendAction"
    },
    decls: 4,
    vars: 2,
    consts: [["content", ""], ["mat-button", "", 1, "button--rounded", 3, "ngClass", "disabled"], ["target", "_blank", 1, "block", 3, "href"], ["mat-button", "", 1, "button--rounded", 3, "click", "ngClass", "disabled"], [4, "ngTemplateOutlet"], [3, "src", "svgClass"]],
    template: function SharedButtonUiComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditionalCreate"](0, SharedButtonUiComponent_Conditional_0_Template, 2, 6, "button", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditionalCreate"](1, SharedButtonUiComponent_Conditional_1_Template, 2, 4, "a", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, SharedButtonUiComponent_ng_template_2_Template, 2, 0, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditional"](ctx.config.type === "button" ? 0 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditional"](ctx.config.type === "link" ? 1 : -1);
      }
    },
    dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_0__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_0__.NgTemplateOutlet, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButtonModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_2__.MatButton, angular_svg_icon__WEBPACK_IMPORTED_MODULE_6__.AngularSvgIconModule, angular_svg_icon__WEBPACK_IMPORTED_MODULE_6__.SvgIconComponent, _ngrx_component__WEBPACK_IMPORTED_MODULE_3__.PushPipe, _plastik_shared_return_as_observable__WEBPACK_IMPORTED_MODULE_5__.ReturnAsObservablePipe],
    encapsulation: 2,
    changeDetection: 0
  });
}

/***/ }),

/***/ 416:
/*!********************************************************!*\
  !*** ./libs/shared/button/entities/src/button.mock.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buttonAsLinkMock: () => (/* binding */ buttonAsLinkMock),
/* harmony export */   buttonMock: () => (/* binding */ buttonMock)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ 9797);

const buttonMock = {
  id: 1,
  type: 'button',
  elements: [{
    type: 'icon',
    content: {
      iconPath: 'assets/svg/go.svg'
    }
  }],
  ariaLabel: 'click here to go!',
  doAction: () => (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createAction)('[Action] go')
};
const buttonAsLinkMock = {
  id: 1,
  type: 'link',
  elements: [{
    type: 'text',
    content: 'GO'
  }, {
    type: 'icon',
    content: {
      iconPath: 'assets/svg/go.svg'
    }
  }],
  ariaLabel: 'click here to go!',
  link: ''
};

/***/ }),

/***/ 2515:
/*!**************************************************!*\
  !*** ./libs/shared/button/entities/src/index.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buttonAsLinkMock: () => (/* reexport safe */ _button_mock__WEBPACK_IMPORTED_MODULE_1__.buttonAsLinkMock),
/* harmony export */   buttonHasALinkGuard: () => (/* reexport safe */ _button__WEBPACK_IMPORTED_MODULE_0__.buttonHasALinkGuard),
/* harmony export */   buttonMock: () => (/* reexport safe */ _button_mock__WEBPACK_IMPORTED_MODULE_1__.buttonMock)
/* harmony export */ });
/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./button */ 2818);
/* harmony import */ var _button_mock__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./button.mock */ 416);



/***/ }),

/***/ 2818:
/*!***************************************************!*\
  !*** ./libs/shared/button/entities/src/button.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buttonHasALinkGuard: () => (/* binding */ buttonHasALinkGuard)
/* harmony export */ });
/**
 * @description Checks if button config is of type ButtonConfigAsLink.
 * @param { ButtonConfig } toBeDetermined The button instance to be checked.
 * @returns { boolean } Returns true if type button is a link.
 */
function buttonHasALinkGuard(toBeDetermined) {
  return toBeDetermined.type === 'link';
}

/***/ }),

/***/ 3187:
/*!*****************************************************************!*\
  !*** ./libs/shared/util/return-as-observable-pipe/src/index.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReturnAsObservablePipe: () => (/* reexport safe */ _lib_return_as_observable_pipe__WEBPACK_IMPORTED_MODULE_0__.ReturnAsObservablePipe)
/* harmony export */ });
/* harmony import */ var _lib_return_as_observable_pipe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/return-as-observable.pipe */ 4266);


/***/ }),

/***/ 4266:
/*!*****************************************************************************************!*\
  !*** ./libs/shared/util/return-as-observable-pipe/src/lib/return-as-observable.pipe.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ReturnAsObservablePipe: () => (/* binding */ ReturnAsObservablePipe)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 3583);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 7796);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 3499);


class ReturnAsObservablePipe {
  /**
   * @description Transforms a value or an Observable of a value into an Observable of the same type.
   * @param {unknown | Observable<unknown>} value The value or Observable to transform.
   * @returns { Observable<unknown> } An Observable of the same type as the input.
   */
  transform(value) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.isObservable)(value) ? value : (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)(value);
  }
  static ɵfac = function ReturnAsObservablePipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ReturnAsObservablePipe)();
  };
  static ɵpipe = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefinePipe"]({
    name: "returnAsObservable",
    type: ReturnAsObservablePipe,
    pure: true
  });
}

/***/ }),

/***/ 7754:
/*!********************************************!*\
  !*** ./libs/shared/button/ui/src/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharedButtonUiComponent: () => (/* reexport safe */ _lib_shared_button_ui_shared_button_ui_component__WEBPACK_IMPORTED_MODULE_0__.SharedButtonUiComponent)
/* harmony export */ });
/* harmony import */ var _lib_shared_button_ui_shared_button_ui_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/shared-button-ui/shared-button-ui.component */ 111);


/***/ })

}]);
//# sourceMappingURL=libs_shared_button_ui_src_index_ts.js.map