import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-M7EM4256.js";
import {
  FormGroupDirective,
  MatPseudoCheckbox,
  MatPseudoCheckboxModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm,
  Validators
} from "./chunk-JCW76IXC.js";
import {
  SelectionModel,
  UniqueSelectionDispatcher
} from "./chunk-5DTUJMY3.js";
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  CdkScrollableModule,
  MatButtonModule,
  MatIconButton,
  MatRipple,
  MatRippleModule,
  OVERLAY_DEFAULT_CONFIG,
  OverlayModule,
  ViewportRuler,
  coerceBooleanProperty,
  createRepositionScrollStrategy
} from "./chunk-Q3HLMZJC.js";
import {
  A,
  ActiveDescendantKeyManager,
  DOWN_ARROW,
  ENTER,
  ESCAPE,
  FocusMonitor,
  LEFT_ARROW,
  LiveAnnouncer,
  ObserversModule,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW,
  _IdGenerator,
  _StructuralStylesLoader,
  _animationsDisabled,
  addAriaReferencedId,
  hasModifierKey,
  removeAriaReferencedId
} from "./chunk-O5T33GSN.js";
import {
  _VisuallyHiddenLoader
} from "./chunk-ON7GGAEN.js";
import {
  getSupportedInputTypes
} from "./chunk-DH5OOHJ7.js";
import {
  _getEventTarget
} from "./chunk-OVMRMWIJ.js";
import {
  BidiModule,
  Directionality
} from "./chunk-DOKZBUCQ.js";
import {
  AutofillMonitor,
  TextFieldModule
} from "./chunk-ZJDM37HW.js";
import {
  _CdkPrivateStyleLoader
} from "./chunk-MDH5I3DC.js";
import {
  Platform
} from "./chunk-MHHILDTD.js";
import {
  NgTemplateOutlet
} from "./chunk-PTTPPMFB.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  EventEmitter,
  HostAttributeToken,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  NgZone,
  Observable,
  Output,
  Renderer2,
  RendererFactory2,
  ReplaySubject,
  Subject,
  Subscription,
  ViewChild,
  ViewEncapsulation,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  computed,
  contentChild,
  defer,
  effect,
  filter,
  forwardRef,
  inject,
  isSignal,
  map,
  merge,
  numberAttribute,
  pairwise,
  setClassMetadata,
  shareReplay,
  signal,
  startWith,
  switchMap,
  take,
  takeUntil,
  viewChild,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵariaProperty,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery,
  ɵɵviewQuerySignal
} from "./chunk-BYTVJWX3.js";

// node_modules/@angular/cdk/fesm2022/observers-private.mjs
var loopLimitExceededErrorHandler = (e) => {
  if (e instanceof ErrorEvent && e.message === "ResizeObserver loop limit exceeded") {
    console.error(`${e.message}. This could indicate a performance issue with your app. See https://github.com/WICG/resize-observer/blob/master/explainer.md#error-handling`);
  }
};
var SingleBoxSharedResizeObserver = class {
  _box;
  _destroyed = new Subject();
  _resizeSubject = new Subject();
  _resizeObserver;
  _elementObservables = /* @__PURE__ */ new Map();
  constructor(_box) {
    this._box = _box;
    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver((entries) => this._resizeSubject.next(entries));
    }
  }
  observe(target) {
    if (!this._elementObservables.has(target)) {
      this._elementObservables.set(target, new Observable((observer) => {
        const subscription = this._resizeSubject.subscribe(observer);
        this._resizeObserver?.observe(target, {
          box: this._box
        });
        return () => {
          this._resizeObserver?.unobserve(target);
          subscription.unsubscribe();
          this._elementObservables.delete(target);
        };
      }).pipe(filter((entries) => entries.some((entry) => entry.target === target)), shareReplay({
        bufferSize: 1,
        refCount: true
      }), takeUntil(this._destroyed)));
    }
    return this._elementObservables.get(target);
  }
  destroy() {
    this._destroyed.next();
    this._destroyed.complete();
    this._resizeSubject.complete();
    this._elementObservables.clear();
  }
};
var SharedResizeObserver = class _SharedResizeObserver {
  _cleanupErrorListener;
  _observers = /* @__PURE__ */ new Map();
  _ngZone = inject(NgZone);
  constructor() {
    if (typeof ResizeObserver !== "undefined" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      this._ngZone.runOutsideAngular(() => {
        const renderer = inject(RendererFactory2).createRenderer(null, null);
        this._cleanupErrorListener = renderer.listen("window", "error", loopLimitExceededErrorHandler);
      });
    }
  }
  ngOnDestroy() {
    for (const [, observer] of this._observers) {
      observer.destroy();
    }
    this._observers.clear();
    this._cleanupErrorListener?.();
  }
  observe(target, options) {
    const box = options?.box || "content-box";
    if (!this._observers.has(box)) {
      this._observers.set(box, new SingleBoxSharedResizeObserver(box));
    }
    return this._observers.get(box).observe(target);
  }
  static \u0275fac = function SharedResizeObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SharedResizeObserver)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _SharedResizeObserver,
    factory: _SharedResizeObserver.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SharedResizeObserver, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// node_modules/@angular/material/fesm2022/_form-field-chunk.mjs
var _c0 = ["notch"];
var _c1 = ["matFormFieldNotchedOutline", ""];
var _c2 = ["*"];
var _c3 = ["iconPrefixContainer"];
var _c4 = ["textPrefixContainer"];
var _c5 = ["iconSuffixContainer"];
var _c6 = ["textSuffixContainer"];
var _c7 = ["textField"];
var _c8 = ["*", [["mat-label"]], [["", "matPrefix", ""], ["", "matIconPrefix", ""]], [["", "matTextPrefix", ""]], [["", "matTextSuffix", ""]], [["", "matSuffix", ""], ["", "matIconSuffix", ""]], [["mat-error"], ["", "matError", ""]], [["mat-hint", 3, "align", "end"]], [["mat-hint", "align", "end"]]];
var _c9 = ["*", "mat-label", "[matPrefix], [matIconPrefix]", "[matTextPrefix]", "[matTextSuffix]", "[matSuffix], [matIconSuffix]", "mat-error, [matError]", "mat-hint:not([align='end'])", "mat-hint[align='end']"];
function MatFormField_ng_template_0_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 21);
  }
}
function MatFormField_ng_template_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 20);
    \u0275\u0275projection(1, 1);
    \u0275\u0275conditionalCreate(2, MatFormField_ng_template_0_Conditional_0_Conditional_2_Template, 1, 0, "span", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("floating", ctx_r0._shouldLabelFloat())("monitorResize", ctx_r0._hasOutline())("id", ctx_r0._labelId);
    \u0275\u0275attribute("for", ctx_r0._control.disableAutomaticLabeling ? null : ctx_r0._control.id);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.hideRequiredMarker && ctx_r0._control.required ? 2 : -1);
  }
}
function MatFormField_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, MatFormField_ng_template_0_Conditional_0_Template, 3, 5, "label", 20);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0._hasFloatingLabel() ? 0 : -1);
  }
}
function MatFormField_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 7);
  }
}
function MatFormField_Conditional_6_Conditional_1_ng_template_0_Template(rf, ctx) {
}
function MatFormField_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, MatFormField_Conditional_6_Conditional_1_ng_template_0_Template, 0, 0, "ng-template", 13);
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const labelTemplate_r2 = \u0275\u0275reference(1);
    \u0275\u0275property("ngTemplateOutlet", labelTemplate_r2);
  }
}
function MatFormField_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275conditionalCreate(1, MatFormField_Conditional_6_Conditional_1_Template, 1, 1, null, 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("matFormFieldNotchedOutlineOpen", ctx_r0._shouldLabelFloat());
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0._forceDisplayInfixLabel() ? 1 : -1);
  }
}
function MatFormField_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10, 2);
    \u0275\u0275projection(2, 2);
    \u0275\u0275elementEnd();
  }
}
function MatFormField_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11, 3);
    \u0275\u0275projection(2, 3);
    \u0275\u0275elementEnd();
  }
}
function MatFormField_Conditional_10_ng_template_0_Template(rf, ctx) {
}
function MatFormField_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, MatFormField_Conditional_10_ng_template_0_Template, 0, 0, "ng-template", 13);
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const labelTemplate_r2 = \u0275\u0275reference(1);
    \u0275\u0275property("ngTemplateOutlet", labelTemplate_r2);
  }
}
function MatFormField_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14, 4);
    \u0275\u0275projection(2, 4);
    \u0275\u0275elementEnd();
  }
}
function MatFormField_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15, 5);
    \u0275\u0275projection(2, 5);
    \u0275\u0275elementEnd();
  }
}
function MatFormField_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 16);
  }
}
function MatFormField_Case_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18);
    \u0275\u0275projection(1, 6);
    \u0275\u0275elementEnd();
  }
}
function MatFormField_Case_17_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-hint", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r0._hintLabelId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.hintLabel);
  }
}
function MatFormField_Case_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19);
    \u0275\u0275conditionalCreate(1, MatFormField_Case_17_Conditional_1_Template, 2, 2, "mat-hint", 22);
    \u0275\u0275projection(2, 7);
    \u0275\u0275element(3, "div", 23);
    \u0275\u0275projection(4, 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.hintLabel ? 1 : -1);
  }
}
var MatLabel = class _MatLabel {
  static \u0275fac = function MatLabel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatLabel)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatLabel,
    selectors: [["mat-label"]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatLabel, [{
    type: Directive,
    args: [{
      selector: "mat-label"
    }]
  }], null, null);
})();
var MAT_ERROR = new InjectionToken("MatError");
var MatError = class _MatError {
  id = inject(_IdGenerator).getId("mat-mdc-error-");
  constructor() {
  }
  static \u0275fac = function MatError_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatError)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatError,
    selectors: [["mat-error"], ["", "matError", ""]],
    hostAttrs: [1, "mat-mdc-form-field-error", "mat-mdc-form-field-bottom-align"],
    hostVars: 1,
    hostBindings: function MatError_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id);
      }
    },
    inputs: {
      id: "id"
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_ERROR,
      useExisting: _MatError
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatError, [{
    type: Directive,
    args: [{
      selector: "mat-error, [matError]",
      host: {
        "class": "mat-mdc-form-field-error mat-mdc-form-field-bottom-align",
        "[id]": "id"
      },
      providers: [{
        provide: MAT_ERROR,
        useExisting: MatError
      }]
    }]
  }], () => [], {
    id: [{
      type: Input
    }]
  });
})();
var MatHint = class _MatHint {
  align = "start";
  id = inject(_IdGenerator).getId("mat-mdc-hint-");
  static \u0275fac = function MatHint_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatHint)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatHint,
    selectors: [["mat-hint"]],
    hostAttrs: [1, "mat-mdc-form-field-hint", "mat-mdc-form-field-bottom-align"],
    hostVars: 4,
    hostBindings: function MatHint_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id);
        \u0275\u0275attribute("align", null);
        \u0275\u0275classProp("mat-mdc-form-field-hint-end", ctx.align === "end");
      }
    },
    inputs: {
      align: "align",
      id: "id"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatHint, [{
    type: Directive,
    args: [{
      selector: "mat-hint",
      host: {
        "class": "mat-mdc-form-field-hint mat-mdc-form-field-bottom-align",
        "[class.mat-mdc-form-field-hint-end]": 'align === "end"',
        "[id]": "id",
        "[attr.align]": "null"
      }
    }]
  }], null, {
    align: [{
      type: Input
    }],
    id: [{
      type: Input
    }]
  });
})();
var MAT_PREFIX = new InjectionToken("MatPrefix");
var MatPrefix = class _MatPrefix {
  set _isTextSelector(value) {
    this._isText = true;
  }
  _isText = false;
  static \u0275fac = function MatPrefix_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatPrefix)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatPrefix,
    selectors: [["", "matPrefix", ""], ["", "matIconPrefix", ""], ["", "matTextPrefix", ""]],
    inputs: {
      _isTextSelector: [0, "matTextPrefix", "_isTextSelector"]
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_PREFIX,
      useExisting: _MatPrefix
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatPrefix, [{
    type: Directive,
    args: [{
      selector: "[matPrefix], [matIconPrefix], [matTextPrefix]",
      providers: [{
        provide: MAT_PREFIX,
        useExisting: MatPrefix
      }]
    }]
  }], null, {
    _isTextSelector: [{
      type: Input,
      args: ["matTextPrefix"]
    }]
  });
})();
var MAT_SUFFIX = new InjectionToken("MatSuffix");
var MatSuffix = class _MatSuffix {
  set _isTextSelector(value) {
    this._isText = true;
  }
  _isText = false;
  static \u0275fac = function MatSuffix_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSuffix)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatSuffix,
    selectors: [["", "matSuffix", ""], ["", "matIconSuffix", ""], ["", "matTextSuffix", ""]],
    inputs: {
      _isTextSelector: [0, "matTextSuffix", "_isTextSelector"]
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_SUFFIX,
      useExisting: _MatSuffix
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSuffix, [{
    type: Directive,
    args: [{
      selector: "[matSuffix], [matIconSuffix], [matTextSuffix]",
      providers: [{
        provide: MAT_SUFFIX,
        useExisting: MatSuffix
      }]
    }]
  }], null, {
    _isTextSelector: [{
      type: Input,
      args: ["matTextSuffix"]
    }]
  });
})();
var FLOATING_LABEL_PARENT = new InjectionToken("FloatingLabelParent");
var MatFormFieldFloatingLabel = class _MatFormFieldFloatingLabel {
  _elementRef = inject(ElementRef);
  get floating() {
    return this._floating;
  }
  set floating(value) {
    this._floating = value;
    if (this.monitorResize) {
      this._handleResize();
    }
  }
  _floating = false;
  get monitorResize() {
    return this._monitorResize;
  }
  set monitorResize(value) {
    this._monitorResize = value;
    if (this._monitorResize) {
      this._subscribeToResize();
    } else {
      this._resizeSubscription.unsubscribe();
    }
  }
  _monitorResize = false;
  _resizeObserver = inject(SharedResizeObserver);
  _ngZone = inject(NgZone);
  _parent = inject(FLOATING_LABEL_PARENT);
  _resizeSubscription = new Subscription();
  constructor() {
  }
  ngOnDestroy() {
    this._resizeSubscription.unsubscribe();
  }
  getWidth() {
    return estimateScrollWidth(this._elementRef.nativeElement);
  }
  get element() {
    return this._elementRef.nativeElement;
  }
  _handleResize() {
    setTimeout(() => this._parent._handleLabelResized());
  }
  _subscribeToResize() {
    this._resizeSubscription.unsubscribe();
    this._ngZone.runOutsideAngular(() => {
      this._resizeSubscription = this._resizeObserver.observe(this._elementRef.nativeElement, {
        box: "border-box"
      }).subscribe(() => this._handleResize());
    });
  }
  static \u0275fac = function MatFormFieldFloatingLabel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormFieldFloatingLabel)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatFormFieldFloatingLabel,
    selectors: [["label", "matFormFieldFloatingLabel", ""]],
    hostAttrs: [1, "mdc-floating-label", "mat-mdc-floating-label"],
    hostVars: 2,
    hostBindings: function MatFormFieldFloatingLabel_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mdc-floating-label--float-above", ctx.floating);
      }
    },
    inputs: {
      floating: "floating",
      monitorResize: "monitorResize"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldFloatingLabel, [{
    type: Directive,
    args: [{
      selector: "label[matFormFieldFloatingLabel]",
      host: {
        "class": "mdc-floating-label mat-mdc-floating-label",
        "[class.mdc-floating-label--float-above]": "floating"
      }
    }]
  }], () => [], {
    floating: [{
      type: Input
    }],
    monitorResize: [{
      type: Input
    }]
  });
})();
function estimateScrollWidth(element) {
  const htmlEl = element;
  if (htmlEl.offsetParent !== null) {
    return htmlEl.scrollWidth;
  }
  const clone = htmlEl.cloneNode(true);
  clone.style.setProperty("position", "absolute");
  clone.style.setProperty("transform", "translate(-9999px, -9999px)");
  document.documentElement.appendChild(clone);
  const scrollWidth = clone.scrollWidth;
  clone.remove();
  return scrollWidth;
}
var ACTIVATE_CLASS = "mdc-line-ripple--active";
var DEACTIVATING_CLASS = "mdc-line-ripple--deactivating";
var MatFormFieldLineRipple = class _MatFormFieldLineRipple {
  _elementRef = inject(ElementRef);
  _cleanupTransitionEnd;
  constructor() {
    const ngZone = inject(NgZone);
    const renderer = inject(Renderer2);
    ngZone.runOutsideAngular(() => {
      this._cleanupTransitionEnd = renderer.listen(this._elementRef.nativeElement, "transitionend", this._handleTransitionEnd);
    });
  }
  activate() {
    const classList = this._elementRef.nativeElement.classList;
    classList.remove(DEACTIVATING_CLASS);
    classList.add(ACTIVATE_CLASS);
  }
  deactivate() {
    this._elementRef.nativeElement.classList.add(DEACTIVATING_CLASS);
  }
  _handleTransitionEnd = (event) => {
    const classList = this._elementRef.nativeElement.classList;
    const isDeactivating = classList.contains(DEACTIVATING_CLASS);
    if (event.propertyName === "opacity" && isDeactivating) {
      classList.remove(ACTIVATE_CLASS, DEACTIVATING_CLASS);
    }
  };
  ngOnDestroy() {
    this._cleanupTransitionEnd();
  }
  static \u0275fac = function MatFormFieldLineRipple_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormFieldLineRipple)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatFormFieldLineRipple,
    selectors: [["div", "matFormFieldLineRipple", ""]],
    hostAttrs: [1, "mdc-line-ripple"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldLineRipple, [{
    type: Directive,
    args: [{
      selector: "div[matFormFieldLineRipple]",
      host: {
        "class": "mdc-line-ripple"
      }
    }]
  }], () => [], null);
})();
var MatFormFieldNotchedOutline = class _MatFormFieldNotchedOutline {
  _elementRef = inject(ElementRef);
  _ngZone = inject(NgZone);
  open = false;
  _notch;
  ngAfterViewInit() {
    const element = this._elementRef.nativeElement;
    const label = element.querySelector(".mdc-floating-label");
    if (label) {
      element.classList.add("mdc-notched-outline--upgraded");
      if (typeof requestAnimationFrame === "function") {
        label.style.transitionDuration = "0s";
        this._ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => label.style.transitionDuration = "");
        });
      }
    } else {
      element.classList.add("mdc-notched-outline--no-label");
    }
  }
  _setNotchWidth(labelWidth) {
    const notch = this._notch.nativeElement;
    if (!this.open || !labelWidth) {
      notch.style.width = "";
    } else {
      const NOTCH_ELEMENT_PADDING = 8;
      const NOTCH_ELEMENT_BORDER = 1;
      notch.style.width = `calc(${labelWidth}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + ${NOTCH_ELEMENT_PADDING + NOTCH_ELEMENT_BORDER}px)`;
    }
  }
  _setMaxWidth(prefixAndSuffixWidth) {
    this._notch.nativeElement.style.setProperty("--mat-form-field-notch-max-width", `calc(100% - ${prefixAndSuffixWidth}px)`);
  }
  static \u0275fac = function MatFormFieldNotchedOutline_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormFieldNotchedOutline)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatFormFieldNotchedOutline,
    selectors: [["div", "matFormFieldNotchedOutline", ""]],
    viewQuery: function MatFormFieldNotchedOutline_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c0, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._notch = _t.first);
      }
    },
    hostAttrs: [1, "mdc-notched-outline"],
    hostVars: 2,
    hostBindings: function MatFormFieldNotchedOutline_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mdc-notched-outline--notched", ctx.open);
      }
    },
    inputs: {
      open: [0, "matFormFieldNotchedOutlineOpen", "open"]
    },
    attrs: _c1,
    ngContentSelectors: _c2,
    decls: 5,
    vars: 0,
    consts: [["notch", ""], [1, "mat-mdc-notch-piece", "mdc-notched-outline__leading"], [1, "mat-mdc-notch-piece", "mdc-notched-outline__notch"], [1, "mat-mdc-notch-piece", "mdc-notched-outline__trailing"]],
    template: function MatFormFieldNotchedOutline_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275domElement(0, "div", 1);
        \u0275\u0275domElementStart(1, "div", 2, 0);
        \u0275\u0275projection(3);
        \u0275\u0275domElementEnd();
        \u0275\u0275domElement(4, "div", 3);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldNotchedOutline, [{
    type: Component,
    args: [{
      selector: "div[matFormFieldNotchedOutline]",
      host: {
        "class": "mdc-notched-outline",
        "[class.mdc-notched-outline--notched]": "open"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: '<div class="mat-mdc-notch-piece mdc-notched-outline__leading"></div>\n<div class="mat-mdc-notch-piece mdc-notched-outline__notch" #notch>\n  <ng-content></ng-content>\n</div>\n<div class="mat-mdc-notch-piece mdc-notched-outline__trailing"></div>\n'
    }]
  }], null, {
    open: [{
      type: Input,
      args: ["matFormFieldNotchedOutlineOpen"]
    }],
    _notch: [{
      type: ViewChild,
      args: ["notch"]
    }]
  });
})();
var MatFormFieldControl = class _MatFormFieldControl {
  value = null;
  stateChanges;
  id;
  placeholder;
  ngControl = null;
  focused = false;
  empty = false;
  shouldLabelFloat = false;
  required = false;
  disabled = false;
  errorState = false;
  controlType;
  autofilled;
  userAriaDescribedBy;
  disableAutomaticLabeling;
  describedByIds;
  static \u0275fac = function MatFormFieldControl_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormFieldControl)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatFormFieldControl
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldControl, [{
    type: Directive
  }], null, null);
})();
function getMatFormFieldDuplicatedHintError(align) {
  return Error(`A hint was already declared for 'align="${align}"'.`);
}
function getMatFormFieldMissingControlError() {
  return Error("mat-form-field must contain a MatFormFieldControl.");
}
var MAT_FORM_FIELD = new InjectionToken("MatFormField");
var MAT_FORM_FIELD_DEFAULT_OPTIONS = new InjectionToken("MAT_FORM_FIELD_DEFAULT_OPTIONS");
var DEFAULT_APPEARANCE = "fill";
var DEFAULT_FLOAT_LABEL = "auto";
var DEFAULT_SUBSCRIPT_SIZING = "fixed";
var FLOATING_LABEL_DEFAULT_DOCKED_TRANSFORM = `translateY(-50%)`;
var MatFormField = class _MatFormField {
  _elementRef = inject(ElementRef);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _platform = inject(Platform);
  _idGenerator = inject(_IdGenerator);
  _ngZone = inject(NgZone);
  _defaults = inject(MAT_FORM_FIELD_DEFAULT_OPTIONS, {
    optional: true
  });
  _currentDirection;
  _textField;
  _iconPrefixContainer;
  _textPrefixContainer;
  _iconSuffixContainer;
  _textSuffixContainer;
  _floatingLabel;
  _notchedOutline;
  _lineRipple;
  _iconPrefixContainerSignal = viewChild("iconPrefixContainer", ...ngDevMode ? [{
    debugName: "_iconPrefixContainerSignal"
  }] : []);
  _textPrefixContainerSignal = viewChild("textPrefixContainer", ...ngDevMode ? [{
    debugName: "_textPrefixContainerSignal"
  }] : []);
  _iconSuffixContainerSignal = viewChild("iconSuffixContainer", ...ngDevMode ? [{
    debugName: "_iconSuffixContainerSignal"
  }] : []);
  _textSuffixContainerSignal = viewChild("textSuffixContainer", ...ngDevMode ? [{
    debugName: "_textSuffixContainerSignal"
  }] : []);
  _prefixSuffixContainers = computed(() => {
    return [this._iconPrefixContainerSignal(), this._textPrefixContainerSignal(), this._iconSuffixContainerSignal(), this._textSuffixContainerSignal()].map((container) => container?.nativeElement).filter((e) => e !== void 0);
  }, ...ngDevMode ? [{
    debugName: "_prefixSuffixContainers"
  }] : []);
  _formFieldControl;
  _prefixChildren;
  _suffixChildren;
  _errorChildren;
  _hintChildren;
  _labelChild = contentChild(MatLabel, ...ngDevMode ? [{
    debugName: "_labelChild"
  }] : []);
  get hideRequiredMarker() {
    return this._hideRequiredMarker;
  }
  set hideRequiredMarker(value) {
    this._hideRequiredMarker = coerceBooleanProperty(value);
  }
  _hideRequiredMarker = false;
  color = "primary";
  get floatLabel() {
    return this._floatLabel || this._defaults?.floatLabel || DEFAULT_FLOAT_LABEL;
  }
  set floatLabel(value) {
    if (value !== this._floatLabel) {
      this._floatLabel = value;
      this._changeDetectorRef.markForCheck();
    }
  }
  _floatLabel;
  get appearance() {
    return this._appearanceSignal();
  }
  set appearance(value) {
    const newAppearance = value || this._defaults?.appearance || DEFAULT_APPEARANCE;
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (newAppearance !== "fill" && newAppearance !== "outline") {
        throw new Error(`MatFormField: Invalid appearance "${newAppearance}", valid values are "fill" or "outline".`);
      }
    }
    this._appearanceSignal.set(newAppearance);
  }
  _appearanceSignal = signal(DEFAULT_APPEARANCE, ...ngDevMode ? [{
    debugName: "_appearanceSignal"
  }] : []);
  get subscriptSizing() {
    return this._subscriptSizing || this._defaults?.subscriptSizing || DEFAULT_SUBSCRIPT_SIZING;
  }
  set subscriptSizing(value) {
    this._subscriptSizing = value || this._defaults?.subscriptSizing || DEFAULT_SUBSCRIPT_SIZING;
  }
  _subscriptSizing = null;
  get hintLabel() {
    return this._hintLabel;
  }
  set hintLabel(value) {
    this._hintLabel = value;
    this._processHints();
  }
  _hintLabel = "";
  _hasIconPrefix = false;
  _hasTextPrefix = false;
  _hasIconSuffix = false;
  _hasTextSuffix = false;
  _labelId = this._idGenerator.getId("mat-mdc-form-field-label-");
  _hintLabelId = this._idGenerator.getId("mat-mdc-hint-");
  _describedByIds;
  get _control() {
    return this._explicitFormFieldControl || this._formFieldControl;
  }
  set _control(value) {
    this._explicitFormFieldControl = value;
  }
  _destroyed = new Subject();
  _isFocused = null;
  _explicitFormFieldControl;
  _previousControl = null;
  _previousControlValidatorFn = null;
  _stateChanges;
  _valueChanges;
  _describedByChanges;
  _outlineLabelOffsetResizeObserver = null;
  _animationsDisabled = _animationsDisabled();
  constructor() {
    const defaults = this._defaults;
    const dir = inject(Directionality);
    if (defaults) {
      if (defaults.appearance) {
        this.appearance = defaults.appearance;
      }
      this._hideRequiredMarker = Boolean(defaults?.hideRequiredMarker);
      if (defaults.color) {
        this.color = defaults.color;
      }
    }
    effect(() => this._currentDirection = dir.valueSignal());
    this._syncOutlineLabelOffset();
  }
  ngAfterViewInit() {
    this._updateFocusState();
    if (!this._animationsDisabled) {
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this._elementRef.nativeElement.classList.add("mat-form-field-animations-enabled");
        }, 300);
      });
    }
    this._changeDetectorRef.detectChanges();
  }
  ngAfterContentInit() {
    this._assertFormFieldControl();
    this._initializeSubscript();
    this._initializePrefixAndSuffix();
  }
  ngAfterContentChecked() {
    this._assertFormFieldControl();
    if (this._control !== this._previousControl) {
      this._initializeControl(this._previousControl);
      if (this._control.ngControl && this._control.ngControl.control) {
        this._previousControlValidatorFn = this._control.ngControl.control.validator;
      }
      this._previousControl = this._control;
    }
    if (this._control.ngControl && this._control.ngControl.control) {
      const validatorFn = this._control.ngControl.control.validator;
      if (validatorFn !== this._previousControlValidatorFn) {
        this._changeDetectorRef.markForCheck();
      }
    }
  }
  ngOnDestroy() {
    this._outlineLabelOffsetResizeObserver?.disconnect();
    this._stateChanges?.unsubscribe();
    this._valueChanges?.unsubscribe();
    this._describedByChanges?.unsubscribe();
    this._destroyed.next();
    this._destroyed.complete();
  }
  getLabelId = computed(() => this._hasFloatingLabel() ? this._labelId : null, ...ngDevMode ? [{
    debugName: "getLabelId"
  }] : []);
  getConnectedOverlayOrigin() {
    return this._textField || this._elementRef;
  }
  _animateAndLockLabel() {
    if (this._hasFloatingLabel()) {
      this.floatLabel = "always";
    }
  }
  _initializeControl(previousControl) {
    const control = this._control;
    const classPrefix = "mat-mdc-form-field-type-";
    if (previousControl) {
      this._elementRef.nativeElement.classList.remove(classPrefix + previousControl.controlType);
    }
    if (control.controlType) {
      this._elementRef.nativeElement.classList.add(classPrefix + control.controlType);
    }
    this._stateChanges?.unsubscribe();
    this._stateChanges = control.stateChanges.subscribe(() => {
      this._updateFocusState();
      this._changeDetectorRef.markForCheck();
    });
    this._describedByChanges?.unsubscribe();
    this._describedByChanges = control.stateChanges.pipe(startWith([void 0, void 0]), map(() => [control.errorState, control.userAriaDescribedBy]), pairwise(), filter(([[prevErrorState, prevDescribedBy], [currentErrorState, currentDescribedBy]]) => {
      return prevErrorState !== currentErrorState || prevDescribedBy !== currentDescribedBy;
    })).subscribe(() => this._syncDescribedByIds());
    this._valueChanges?.unsubscribe();
    if (control.ngControl && control.ngControl.valueChanges) {
      this._valueChanges = control.ngControl.valueChanges.pipe(takeUntil(this._destroyed)).subscribe(() => this._changeDetectorRef.markForCheck());
    }
  }
  _checkPrefixAndSuffixTypes() {
    this._hasIconPrefix = !!this._prefixChildren.find((p) => !p._isText);
    this._hasTextPrefix = !!this._prefixChildren.find((p) => p._isText);
    this._hasIconSuffix = !!this._suffixChildren.find((s) => !s._isText);
    this._hasTextSuffix = !!this._suffixChildren.find((s) => s._isText);
  }
  _initializePrefixAndSuffix() {
    this._checkPrefixAndSuffixTypes();
    merge(this._prefixChildren.changes, this._suffixChildren.changes).subscribe(() => {
      this._checkPrefixAndSuffixTypes();
      this._changeDetectorRef.markForCheck();
    });
  }
  _initializeSubscript() {
    this._hintChildren.changes.subscribe(() => {
      this._processHints();
      this._changeDetectorRef.markForCheck();
    });
    this._errorChildren.changes.subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });
    this._validateHints();
    this._syncDescribedByIds();
  }
  _assertFormFieldControl() {
    if (!this._control && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMatFormFieldMissingControlError();
    }
  }
  _updateFocusState() {
    const controlFocused = this._control.focused;
    if (controlFocused && !this._isFocused) {
      this._isFocused = true;
      this._lineRipple?.activate();
    } else if (!controlFocused && (this._isFocused || this._isFocused === null)) {
      this._isFocused = false;
      this._lineRipple?.deactivate();
    }
    this._elementRef.nativeElement.classList.toggle("mat-focused", controlFocused);
    this._textField?.nativeElement.classList.toggle("mdc-text-field--focused", controlFocused);
  }
  _syncOutlineLabelOffset() {
    afterRenderEffect({
      earlyRead: () => {
        if (this._appearanceSignal() !== "outline") {
          this._outlineLabelOffsetResizeObserver?.disconnect();
          return null;
        }
        if (globalThis.ResizeObserver) {
          this._outlineLabelOffsetResizeObserver ||= new globalThis.ResizeObserver(() => {
            this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset());
          });
          for (const el of this._prefixSuffixContainers()) {
            this._outlineLabelOffsetResizeObserver.observe(el, {
              box: "border-box"
            });
          }
        }
        return this._getOutlinedLabelOffset();
      },
      write: (labelStyles) => this._writeOutlinedLabelStyles(labelStyles())
    });
  }
  _shouldAlwaysFloat() {
    return this.floatLabel === "always";
  }
  _hasOutline() {
    return this.appearance === "outline";
  }
  _forceDisplayInfixLabel() {
    return !this._platform.isBrowser && this._prefixChildren.length && !this._shouldLabelFloat();
  }
  _hasFloatingLabel = computed(() => !!this._labelChild(), ...ngDevMode ? [{
    debugName: "_hasFloatingLabel"
  }] : []);
  _shouldLabelFloat() {
    if (!this._hasFloatingLabel()) {
      return false;
    }
    return this._control.shouldLabelFloat || this._shouldAlwaysFloat();
  }
  _shouldForward(prop) {
    const control = this._control ? this._control.ngControl : null;
    return control && control[prop];
  }
  _getSubscriptMessageType() {
    return this._errorChildren && this._errorChildren.length > 0 && this._control.errorState ? "error" : "hint";
  }
  _handleLabelResized() {
    this._refreshOutlineNotchWidth();
  }
  _refreshOutlineNotchWidth() {
    if (!this._hasOutline() || !this._floatingLabel || !this._shouldLabelFloat()) {
      this._notchedOutline?._setNotchWidth(0);
    } else {
      this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth());
    }
  }
  _processHints() {
    this._validateHints();
    this._syncDescribedByIds();
  }
  _validateHints() {
    if (this._hintChildren && (typeof ngDevMode === "undefined" || ngDevMode)) {
      let startHint;
      let endHint;
      this._hintChildren.forEach((hint) => {
        if (hint.align === "start") {
          if (startHint || this.hintLabel) {
            throw getMatFormFieldDuplicatedHintError("start");
          }
          startHint = hint;
        } else if (hint.align === "end") {
          if (endHint) {
            throw getMatFormFieldDuplicatedHintError("end");
          }
          endHint = hint;
        }
      });
    }
  }
  _syncDescribedByIds() {
    if (this._control) {
      let ids = [];
      if (this._control.userAriaDescribedBy && typeof this._control.userAriaDescribedBy === "string") {
        ids.push(...this._control.userAriaDescribedBy.split(" "));
      }
      if (this._getSubscriptMessageType() === "hint") {
        const startHint = this._hintChildren ? this._hintChildren.find((hint) => hint.align === "start") : null;
        const endHint = this._hintChildren ? this._hintChildren.find((hint) => hint.align === "end") : null;
        if (startHint) {
          ids.push(startHint.id);
        } else if (this._hintLabel) {
          ids.push(this._hintLabelId);
        }
        if (endHint) {
          ids.push(endHint.id);
        }
      } else if (this._errorChildren) {
        ids.push(...this._errorChildren.map((error) => error.id));
      }
      const existingDescribedBy = this._control.describedByIds;
      let toAssign;
      if (existingDescribedBy) {
        const exclude = this._describedByIds || ids;
        toAssign = ids.concat(existingDescribedBy.filter((id) => id && !exclude.includes(id)));
      } else {
        toAssign = ids;
      }
      this._control.setDescribedByIds(toAssign);
      this._describedByIds = ids;
    }
  }
  _getOutlinedLabelOffset() {
    if (!this._hasOutline() || !this._floatingLabel) {
      return null;
    }
    if (!this._iconPrefixContainer && !this._textPrefixContainer) {
      return ["", null];
    }
    if (!this._isAttachedToDom()) {
      return null;
    }
    const iconPrefixContainer = this._iconPrefixContainer?.nativeElement;
    const textPrefixContainer = this._textPrefixContainer?.nativeElement;
    const iconSuffixContainer = this._iconSuffixContainer?.nativeElement;
    const textSuffixContainer = this._textSuffixContainer?.nativeElement;
    const iconPrefixContainerWidth = iconPrefixContainer?.getBoundingClientRect().width ?? 0;
    const textPrefixContainerWidth = textPrefixContainer?.getBoundingClientRect().width ?? 0;
    const iconSuffixContainerWidth = iconSuffixContainer?.getBoundingClientRect().width ?? 0;
    const textSuffixContainerWidth = textSuffixContainer?.getBoundingClientRect().width ?? 0;
    const negate = this._currentDirection === "rtl" ? "-1" : "1";
    const prefixWidth = `${iconPrefixContainerWidth + textPrefixContainerWidth}px`;
    const labelOffset = `var(--mat-mdc-form-field-label-offset-x, 0px)`;
    const labelHorizontalOffset = `calc(${negate} * (${prefixWidth} + ${labelOffset}))`;
    const floatingLabelTransform = `var(--mat-mdc-form-field-label-transform, ${FLOATING_LABEL_DEFAULT_DOCKED_TRANSFORM} translateX(${labelHorizontalOffset}))`;
    const notchedOutlineWidth = iconPrefixContainerWidth + textPrefixContainerWidth + iconSuffixContainerWidth + textSuffixContainerWidth;
    return [floatingLabelTransform, notchedOutlineWidth];
  }
  _writeOutlinedLabelStyles(styles) {
    if (styles !== null) {
      const [floatingLabelTransform, notchedOutlineWidth] = styles;
      if (this._floatingLabel) {
        this._floatingLabel.element.style.transform = floatingLabelTransform;
      }
      if (notchedOutlineWidth !== null) {
        this._notchedOutline?._setMaxWidth(notchedOutlineWidth);
      }
    }
  }
  _isAttachedToDom() {
    const element = this._elementRef.nativeElement;
    if (element.getRootNode) {
      const rootNode = element.getRootNode();
      return rootNode && rootNode !== element;
    }
    return document.documentElement.contains(element);
  }
  static \u0275fac = function MatFormField_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormField)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatFormField,
    selectors: [["mat-form-field"]],
    contentQueries: function MatFormField_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuerySignal(dirIndex, ctx._labelChild, MatLabel, 5);
        \u0275\u0275contentQuery(dirIndex, MatFormFieldControl, 5)(dirIndex, MAT_PREFIX, 5)(dirIndex, MAT_SUFFIX, 5)(dirIndex, MAT_ERROR, 5)(dirIndex, MatHint, 5);
      }
      if (rf & 2) {
        \u0275\u0275queryAdvance();
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._formFieldControl = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._prefixChildren = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._suffixChildren = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._errorChildren = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._hintChildren = _t);
      }
    },
    viewQuery: function MatFormField_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuerySignal(ctx._iconPrefixContainerSignal, _c3, 5)(ctx._textPrefixContainerSignal, _c4, 5)(ctx._iconSuffixContainerSignal, _c5, 5)(ctx._textSuffixContainerSignal, _c6, 5);
        \u0275\u0275viewQuery(_c7, 5)(_c3, 5)(_c4, 5)(_c5, 5)(_c6, 5)(MatFormFieldFloatingLabel, 5)(MatFormFieldNotchedOutline, 5)(MatFormFieldLineRipple, 5);
      }
      if (rf & 2) {
        \u0275\u0275queryAdvance(4);
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._textField = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._iconPrefixContainer = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._textPrefixContainer = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._iconSuffixContainer = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._textSuffixContainer = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._floatingLabel = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._notchedOutline = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._lineRipple = _t.first);
      }
    },
    hostAttrs: [1, "mat-mdc-form-field"],
    hostVars: 38,
    hostBindings: function MatFormField_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mat-mdc-form-field-label-always-float", ctx._shouldAlwaysFloat())("mat-mdc-form-field-has-icon-prefix", ctx._hasIconPrefix)("mat-mdc-form-field-has-icon-suffix", ctx._hasIconSuffix)("mat-form-field-invalid", ctx._control.errorState)("mat-form-field-disabled", ctx._control.disabled)("mat-form-field-autofilled", ctx._control.autofilled)("mat-form-field-appearance-fill", ctx.appearance == "fill")("mat-form-field-appearance-outline", ctx.appearance == "outline")("mat-form-field-hide-placeholder", ctx._hasFloatingLabel() && !ctx._shouldLabelFloat())("mat-primary", ctx.color !== "accent" && ctx.color !== "warn")("mat-accent", ctx.color === "accent")("mat-warn", ctx.color === "warn")("ng-untouched", ctx._shouldForward("untouched"))("ng-touched", ctx._shouldForward("touched"))("ng-pristine", ctx._shouldForward("pristine"))("ng-dirty", ctx._shouldForward("dirty"))("ng-valid", ctx._shouldForward("valid"))("ng-invalid", ctx._shouldForward("invalid"))("ng-pending", ctx._shouldForward("pending"));
      }
    },
    inputs: {
      hideRequiredMarker: "hideRequiredMarker",
      color: "color",
      floatLabel: "floatLabel",
      appearance: "appearance",
      subscriptSizing: "subscriptSizing",
      hintLabel: "hintLabel"
    },
    exportAs: ["matFormField"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_FORM_FIELD,
      useExisting: _MatFormField
    }, {
      provide: FLOATING_LABEL_PARENT,
      useExisting: _MatFormField
    }])],
    ngContentSelectors: _c9,
    decls: 18,
    vars: 21,
    consts: [["labelTemplate", ""], ["textField", ""], ["iconPrefixContainer", ""], ["textPrefixContainer", ""], ["textSuffixContainer", ""], ["iconSuffixContainer", ""], [1, "mat-mdc-text-field-wrapper", "mdc-text-field", 3, "click"], [1, "mat-mdc-form-field-focus-overlay"], [1, "mat-mdc-form-field-flex"], ["matFormFieldNotchedOutline", "", 3, "matFormFieldNotchedOutlineOpen"], [1, "mat-mdc-form-field-icon-prefix"], [1, "mat-mdc-form-field-text-prefix"], [1, "mat-mdc-form-field-infix"], [3, "ngTemplateOutlet"], [1, "mat-mdc-form-field-text-suffix"], [1, "mat-mdc-form-field-icon-suffix"], ["matFormFieldLineRipple", ""], ["aria-atomic", "true", "aria-live", "polite", 1, "mat-mdc-form-field-subscript-wrapper", "mat-mdc-form-field-bottom-align"], [1, "mat-mdc-form-field-error-wrapper"], [1, "mat-mdc-form-field-hint-wrapper"], ["matFormFieldFloatingLabel", "", 3, "floating", "monitorResize", "id"], ["aria-hidden", "true", 1, "mat-mdc-form-field-required-marker", "mdc-floating-label--required"], [3, "id"], [1, "mat-mdc-form-field-hint-spacer"]],
    template: function MatFormField_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c8);
        \u0275\u0275template(0, MatFormField_ng_template_0_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
        \u0275\u0275elementStart(2, "div", 6, 1);
        \u0275\u0275listener("click", function MatFormField_Template_div_click_2_listener($event) {
          return ctx._control.onContainerClick($event);
        });
        \u0275\u0275conditionalCreate(4, MatFormField_Conditional_4_Template, 1, 0, "div", 7);
        \u0275\u0275elementStart(5, "div", 8);
        \u0275\u0275conditionalCreate(6, MatFormField_Conditional_6_Template, 2, 2, "div", 9);
        \u0275\u0275conditionalCreate(7, MatFormField_Conditional_7_Template, 3, 0, "div", 10);
        \u0275\u0275conditionalCreate(8, MatFormField_Conditional_8_Template, 3, 0, "div", 11);
        \u0275\u0275elementStart(9, "div", 12);
        \u0275\u0275conditionalCreate(10, MatFormField_Conditional_10_Template, 1, 1, null, 13);
        \u0275\u0275projection(11);
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(12, MatFormField_Conditional_12_Template, 3, 0, "div", 14);
        \u0275\u0275conditionalCreate(13, MatFormField_Conditional_13_Template, 3, 0, "div", 15);
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(14, MatFormField_Conditional_14_Template, 1, 0, "div", 16);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "div", 17);
        \u0275\u0275conditionalCreate(16, MatFormField_Case_16_Template, 2, 0, "div", 18)(17, MatFormField_Case_17_Template, 5, 1, "div", 19);
        \u0275\u0275elementEnd();
      }
      if (rf & 2) {
        let tmp_17_0;
        \u0275\u0275advance(2);
        \u0275\u0275classProp("mdc-text-field--filled", !ctx._hasOutline())("mdc-text-field--outlined", ctx._hasOutline())("mdc-text-field--no-label", !ctx._hasFloatingLabel())("mdc-text-field--disabled", ctx._control.disabled)("mdc-text-field--invalid", ctx._control.errorState);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(!ctx._hasOutline() && !ctx._control.disabled ? 4 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx._hasOutline() ? 6 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx._hasIconPrefix ? 7 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx._hasTextPrefix ? 8 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(!ctx._hasOutline() || ctx._forceDisplayInfixLabel() ? 10 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx._hasTextSuffix ? 12 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx._hasIconSuffix ? 13 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(!ctx._hasOutline() ? 14 : -1);
        \u0275\u0275advance();
        \u0275\u0275classProp("mat-mdc-form-field-subscript-dynamic-size", ctx.subscriptSizing === "dynamic");
        const subscriptMessageType_r3 = ctx._getSubscriptMessageType();
        \u0275\u0275advance();
        \u0275\u0275conditional((tmp_17_0 = subscriptMessageType_r3) === "error" ? 16 : tmp_17_0 === "hint" ? 17 : -1);
      }
    },
    dependencies: [MatFormFieldFloatingLabel, MatFormFieldNotchedOutline, NgTemplateOutlet, MatFormFieldLineRipple, MatHint],
    styles: ['.mdc-text-field {\n  display: inline-flex;\n  align-items: baseline;\n  padding: 0 16px;\n  position: relative;\n  box-sizing: border-box;\n  overflow: hidden;\n  will-change: opacity, transform, color;\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.mdc-text-field__input {\n  width: 100%;\n  min-width: 0;\n  border: none;\n  border-radius: 0;\n  background: none;\n  padding: 0;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  height: 28px;\n}\n.mdc-text-field__input::-webkit-calendar-picker-indicator, .mdc-text-field__input::-webkit-search-cancel-button {\n  display: none;\n}\n.mdc-text-field__input::-ms-clear {\n  display: none;\n}\n.mdc-text-field__input:focus {\n  outline: none;\n}\n.mdc-text-field__input:invalid {\n  box-shadow: none;\n}\n.mdc-text-field__input::placeholder {\n  opacity: 0;\n}\n.mdc-text-field__input::-moz-placeholder {\n  opacity: 0;\n}\n.mdc-text-field__input::-webkit-input-placeholder {\n  opacity: 0;\n}\n.mdc-text-field__input:-ms-input-placeholder {\n  opacity: 0;\n}\n.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {\n  opacity: 1;\n}\n.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {\n  opacity: 1;\n}\n.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {\n  opacity: 1;\n}\n.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {\n  opacity: 1;\n}\n.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder {\n  opacity: 0;\n}\n.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder {\n  opacity: 0;\n}\n.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder {\n  opacity: 0;\n}\n.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder {\n  opacity: 0;\n}\n.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input {\n  height: 100%;\n}\n.mdc-text-field--outlined .mdc-text-field__input {\n  display: flex;\n  border: none !important;\n  background-color: transparent;\n}\n.mdc-text-field--disabled .mdc-text-field__input {\n  pointer-events: auto;\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input {\n  color: var(--mat-form-field-filled-input-text-color, var(--mat-sys-on-surface));\n  caret-color: var(--mat-form-field-filled-caret-color, var(--mat-sys-primary));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {\n  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {\n  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {\n  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {\n  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {\n  color: var(--mat-form-field-outlined-input-text-color, var(--mat-sys-on-surface));\n  caret-color: var(--mat-form-field-outlined-caret-color, var(--mat-sys-primary));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {\n  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {\n  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {\n  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {\n  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {\n  caret-color: var(--mat-form-field-filled-error-caret-color, var(--mat-sys-error));\n}\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {\n  caret-color: var(--mat-form-field-outlined-error-caret-color, var(--mat-sys-error));\n}\n.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input {\n  color: var(--mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {\n  color: var(--mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mdc-text-field--disabled .mdc-text-field__input {\n    background-color: Window;\n  }\n}\n\n.mdc-text-field--filled {\n  height: 56px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n  border-top-left-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));\n  border-top-right-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) {\n  background-color: var(--mat-form-field-filled-container-color, var(--mat-sys-surface-variant));\n}\n.mdc-text-field--filled.mdc-text-field--disabled {\n  background-color: var(--mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent));\n}\n\n.mdc-text-field--outlined {\n  height: 56px;\n  overflow: visible;\n  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));\n  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);\n}\n[dir=rtl] .mdc-text-field--outlined {\n  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);\n  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));\n}\n\n.mdc-floating-label {\n  position: absolute;\n  left: 0;\n  transform-origin: left top;\n  line-height: 1.15rem;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: text;\n  overflow: hidden;\n  will-change: transform;\n}\n[dir=rtl] .mdc-floating-label {\n  right: 0;\n  left: auto;\n  transform-origin: right top;\n  text-align: right;\n}\n.mdc-text-field .mdc-floating-label {\n  top: 50%;\n  transform: translateY(-50%);\n  pointer-events: none;\n}\n.mdc-notched-outline .mdc-floating-label {\n  display: inline-block;\n  position: relative;\n  max-width: 100%;\n}\n.mdc-text-field--outlined .mdc-floating-label {\n  left: 4px;\n  right: auto;\n}\n[dir=rtl] .mdc-text-field--outlined .mdc-floating-label {\n  left: auto;\n  right: 4px;\n}\n.mdc-text-field--filled .mdc-floating-label {\n  left: 16px;\n  right: auto;\n}\n[dir=rtl] .mdc-text-field--filled .mdc-floating-label {\n  left: auto;\n  right: 16px;\n}\n.mdc-text-field--disabled .mdc-floating-label {\n  cursor: default;\n}\n@media (forced-colors: active) {\n  .mdc-text-field--disabled .mdc-floating-label {\n    z-index: 1;\n  }\n}\n.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label {\n  display: none;\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: var(--mat-form-field-filled-label-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {\n  color: var(--mat-form-field-filled-focus-label-text-color, var(--mat-sys-primary));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {\n  color: var(--mat-form-field-filled-hover-label-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label {\n  color: var(--mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {\n  color: var(--mat-form-field-filled-error-label-text-color, var(--mat-sys-error));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {\n  color: var(--mat-form-field-filled-error-focus-label-text-color, var(--mat-sys-error));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {\n  color: var(--mat-form-field-filled-error-hover-label-text-color, var(--mat-sys-on-error-container));\n}\n.mdc-text-field--filled .mdc-floating-label {\n  font-family: var(--mat-form-field-filled-label-text-font, var(--mat-sys-body-large-font));\n  font-size: var(--mat-form-field-filled-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-form-field-filled-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-form-field-filled-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: var(--mat-form-field-outlined-label-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {\n  color: var(--mat-form-field-outlined-focus-label-text-color, var(--mat-sys-primary));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {\n  color: var(--mat-form-field-outlined-hover-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label {\n  color: var(--mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {\n  color: var(--mat-form-field-outlined-error-label-text-color, var(--mat-sys-error));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {\n  color: var(--mat-form-field-outlined-error-focus-label-text-color, var(--mat-sys-error));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {\n  color: var(--mat-form-field-outlined-error-hover-label-text-color, var(--mat-sys-on-error-container));\n}\n.mdc-text-field--outlined .mdc-floating-label {\n  font-family: var(--mat-form-field-outlined-label-text-font, var(--mat-sys-body-large-font));\n  font-size: var(--mat-form-field-outlined-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-form-field-outlined-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-form-field-outlined-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n\n.mdc-floating-label--float-above {\n  cursor: auto;\n  transform: translateY(-106%) scale(0.75);\n}\n.mdc-text-field--filled .mdc-floating-label--float-above {\n  transform: translateY(-106%) scale(0.75);\n}\n.mdc-text-field--outlined .mdc-floating-label--float-above {\n  transform: translateY(-37.25px) scale(1);\n  font-size: 0.75rem;\n}\n.mdc-notched-outline .mdc-floating-label--float-above {\n  text-overflow: clip;\n}\n.mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  max-width: 133.3333333333%;\n}\n.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  transform: translateY(-34.75px) scale(0.75);\n}\n.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: 1rem;\n}\n\n.mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {\n  margin-left: 1px;\n  margin-right: 0;\n  content: "*";\n}\n[dir=rtl] .mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {\n  margin-left: 0;\n  margin-right: 1px;\n}\n\n.mdc-notched-outline {\n  display: flex;\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  text-align: left;\n  pointer-events: none;\n}\n[dir=rtl] .mdc-notched-outline {\n  text-align: right;\n}\n.mdc-text-field--outlined .mdc-notched-outline {\n  z-index: 1;\n}\n\n.mat-mdc-notch-piece {\n  box-sizing: border-box;\n  height: 100%;\n  pointer-events: none;\n  border: none;\n  border-top: 1px solid;\n  border-bottom: 1px solid;\n}\n.mdc-text-field--focused .mat-mdc-notch-piece {\n  border-width: 2px;\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-outline-color, var(--mat-sys-outline));\n  border-width: var(--mat-form-field-outlined-outline-width, 1px);\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-hover-outline-color, var(--mat-sys-on-surface));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-focus-outline-color, var(--mat-sys-primary));\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-error-outline-color, var(--mat-sys-error));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-error-hover-outline-color, var(--mat-sys-on-error-container));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-error-focus-outline-color, var(--mat-sys-error));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece {\n  border-width: var(--mat-form-field-outlined-focus-outline-width, 2px);\n}\n\n.mdc-notched-outline__leading {\n  border-left: 1px solid;\n  border-right: none;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n}\n.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {\n  width: max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));\n}\n[dir=rtl] .mdc-notched-outline__leading {\n  border-left: none;\n  border-right: 1px solid;\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n}\n\n.mdc-notched-outline__trailing {\n  flex-grow: 1;\n  border-left: none;\n  border-right: 1px solid;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n}\n[dir=rtl] .mdc-notched-outline__trailing {\n  border-left: 1px solid;\n  border-right: none;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n}\n\n.mdc-notched-outline__notch {\n  flex: 0 0 auto;\n  width: auto;\n}\n.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch {\n  max-width: min(var(--mat-form-field-notch-max-width, 100%), calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));\n}\n.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {\n  max-width: min(100%, calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));\n}\n.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {\n  padding-top: 1px;\n}\n.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {\n  padding-top: 2px;\n}\n.mdc-notched-outline--notched .mdc-notched-outline__notch {\n  padding-left: 0;\n  padding-right: 8px;\n  border-top: none;\n}\n[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {\n  padding-left: 8px;\n  padding-right: 0;\n}\n.mdc-notched-outline--no-label .mdc-notched-outline__notch {\n  display: none;\n}\n\n.mdc-line-ripple::before, .mdc-line-ripple::after {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  border-bottom-style: solid;\n  content: "";\n}\n.mdc-line-ripple::before {\n  z-index: 1;\n  border-bottom-width: var(--mat-form-field-filled-active-indicator-height, 1px);\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {\n  border-bottom-color: var(--mat-form-field-filled-active-indicator-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before {\n  border-bottom-color: var(--mat-form-field-filled-hover-active-indicator-color, var(--mat-sys-on-surface));\n}\n.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before {\n  border-bottom-color: var(--mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before {\n  border-bottom-color: var(--mat-form-field-filled-error-active-indicator-color, var(--mat-sys-error));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before {\n  border-bottom-color: var(--mat-form-field-filled-error-hover-active-indicator-color, var(--mat-sys-on-error-container));\n}\n.mdc-line-ripple::after {\n  transform: scaleX(0);\n  opacity: 0;\n  z-index: 2;\n}\n.mdc-text-field--filled .mdc-line-ripple::after {\n  border-bottom-width: var(--mat-form-field-filled-focus-active-indicator-height, 2px);\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after {\n  border-bottom-color: var(--mat-form-field-filled-focus-active-indicator-color, var(--mat-sys-primary));\n}\n.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {\n  border-bottom-color: var(--mat-form-field-filled-error-focus-active-indicator-color, var(--mat-sys-error));\n}\n\n.mdc-line-ripple--active::after {\n  transform: scaleX(1);\n  opacity: 1;\n}\n\n.mdc-line-ripple--deactivating::after {\n  opacity: 0;\n}\n\n.mdc-text-field--disabled {\n  pointer-events: none;\n}\n\n.mat-mdc-form-field-textarea-control {\n  vertical-align: middle;\n  resize: vertical;\n  box-sizing: border-box;\n  height: auto;\n  margin: 0;\n  padding: 0;\n  border: none;\n  overflow: auto;\n}\n\n.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font: inherit;\n  letter-spacing: inherit;\n  text-decoration: inherit;\n  text-transform: inherit;\n  border: none;\n}\n\n.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  line-height: normal;\n  pointer-events: all;\n  will-change: auto;\n}\n\n.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label {\n  cursor: inherit;\n}\n\n.mdc-text-field--no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,\n.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control {\n  height: auto;\n}\n\n.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color] {\n  height: 23px;\n}\n\n.mat-mdc-text-field-wrapper {\n  height: auto;\n  flex: auto;\n  will-change: auto;\n}\n\n.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {\n  padding-left: 0;\n  --mat-mdc-form-field-label-offset-x: -16px;\n}\n\n.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {\n  padding-right: 0;\n}\n\n[dir=rtl] .mat-mdc-text-field-wrapper {\n  padding-left: 16px;\n  padding-right: 16px;\n}\n[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {\n  padding-left: 0;\n}\n[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {\n  padding-right: 0;\n}\n\n.mat-form-field-disabled .mdc-text-field__input::placeholder {\n  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder {\n  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder {\n  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder {\n  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n\n.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n  opacity: 1;\n}\n\n.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label {\n  left: auto;\n  right: auto;\n}\n\n.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input {\n  display: inline-block;\n}\n\n.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch {\n  padding-top: 0;\n}\n\n.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {\n  border-left: 1px solid transparent;\n}\n\n[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {\n  border-left: none;\n  border-right: 1px solid transparent;\n}\n\n.mat-mdc-form-field-infix {\n  min-height: var(--mat-form-field-container-height, 56px);\n  padding-top: var(--mat-form-field-filled-with-label-container-padding-top, 24px);\n  padding-bottom: var(--mat-form-field-filled-with-label-container-padding-bottom, 8px);\n}\n.mdc-text-field--outlined .mat-mdc-form-field-infix, .mdc-text-field--no-label .mat-mdc-form-field-infix {\n  padding-top: var(--mat-form-field-container-vertical-padding, 16px);\n  padding-bottom: var(--mat-form-field-container-vertical-padding, 16px);\n}\n\n.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {\n  top: calc(var(--mat-form-field-container-height, 56px) / 2);\n}\n\n.mdc-text-field--filled .mat-mdc-floating-label {\n  display: var(--mat-form-field-filled-label-display, block);\n}\n\n.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  --mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--mat-form-field-container-height, 56px) / 2) * -1))\n    scale(var(--mat-mdc-form-field-floating-label-scale, 0.75));\n  transform: var(--mat-mdc-form-field-label-transform);\n}\n\n@keyframes _mat-form-field-subscript-animation {\n  from {\n    opacity: 0;\n    transform: translateY(-5px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.mat-mdc-form-field-subscript-wrapper {\n  box-sizing: border-box;\n  width: 100%;\n  position: relative;\n}\n\n.mat-mdc-form-field-hint-wrapper,\n.mat-mdc-form-field-error-wrapper {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  padding: 0 16px;\n  opacity: 1;\n  transform: translateY(0);\n  animation: _mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2);\n}\n\n.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,\n.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper {\n  position: static;\n}\n\n.mat-mdc-form-field-bottom-align::before {\n  content: "";\n  display: inline-block;\n  height: 16px;\n}\n\n.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before {\n  content: unset;\n}\n\n.mat-mdc-form-field-hint-end {\n  order: 1;\n}\n\n.mat-mdc-form-field-hint-wrapper {\n  display: flex;\n}\n\n.mat-mdc-form-field-hint-spacer {\n  flex: 1 0 1em;\n}\n\n.mat-mdc-form-field-error {\n  display: block;\n  color: var(--mat-form-field-error-text-color, var(--mat-sys-error));\n}\n\n.mat-mdc-form-field-subscript-wrapper,\n.mat-mdc-form-field-bottom-align::before {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: var(--mat-form-field-subscript-text-font, var(--mat-sys-body-small-font));\n  line-height: var(--mat-form-field-subscript-text-line-height, var(--mat-sys-body-small-line-height));\n  font-size: var(--mat-form-field-subscript-text-size, var(--mat-sys-body-small-size));\n  letter-spacing: var(--mat-form-field-subscript-text-tracking, var(--mat-sys-body-small-tracking));\n  font-weight: var(--mat-form-field-subscript-text-weight, var(--mat-sys-body-small-weight));\n}\n\n.mat-mdc-form-field-focus-overlay {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n  background-color: var(--mat-form-field-state-layer-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay {\n  opacity: var(--mat-form-field-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay {\n  opacity: var(--mat-form-field-focus-state-layer-opacity, 0);\n}\n\nselect.mat-mdc-form-field-input-control {\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  background-color: transparent;\n  display: inline-flex;\n  box-sizing: border-box;\n}\nselect.mat-mdc-form-field-input-control:not(:disabled) {\n  cursor: pointer;\n}\nselect.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option {\n  color: var(--mat-form-field-select-option-text-color, var(--mat-sys-neutral10));\n}\nselect.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled {\n  color: var(--mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--mat-sys-neutral10) 38%, transparent));\n}\n\n.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {\n  content: "";\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  border-top: 5px solid;\n  position: absolute;\n  right: 0;\n  top: 50%;\n  margin-top: -2.5px;\n  pointer-events: none;\n  color: var(--mat-form-field-enabled-select-arrow-color, var(--mat-sys-on-surface-variant));\n}\n[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {\n  right: auto;\n  left: 0;\n}\n.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after {\n  color: var(--mat-form-field-focus-select-arrow-color, var(--mat-sys-primary));\n}\n.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after {\n  color: var(--mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {\n  padding-right: 15px;\n}\n[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {\n  padding-right: 0;\n  padding-left: 15px;\n}\n\n@media (forced-colors: active) {\n  .mat-form-field-appearance-fill .mat-mdc-text-field-wrapper {\n    outline: solid 1px;\n  }\n}\n@media (forced-colors: active) {\n  .mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper {\n    outline-color: GrayText;\n  }\n}\n\n@media (forced-colors: active) {\n  .mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper {\n    outline: dashed 3px;\n  }\n}\n\n@media (forced-colors: active) {\n  .mat-mdc-form-field.mat-focused .mdc-notched-outline {\n    border: dashed 3px;\n  }\n}\n\n.mat-mdc-form-field-input-control[type=date], .mat-mdc-form-field-input-control[type=datetime], .mat-mdc-form-field-input-control[type=datetime-local], .mat-mdc-form-field-input-control[type=month], .mat-mdc-form-field-input-control[type=week], .mat-mdc-form-field-input-control[type=time] {\n  line-height: 1;\n}\n.mat-mdc-form-field-input-control::-webkit-datetime-edit {\n  line-height: 1;\n  padding: 0;\n  margin-bottom: -2px;\n}\n\n.mat-mdc-form-field {\n  --mat-mdc-form-field-floating-label-scale: 0.75;\n  display: inline-flex;\n  flex-direction: column;\n  min-width: 0;\n  text-align: left;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: var(--mat-form-field-container-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-form-field-container-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-form-field-container-text-size, var(--mat-sys-body-large-size));\n  letter-spacing: var(--mat-form-field-container-text-tracking, var(--mat-sys-body-large-tracking));\n  font-weight: var(--mat-form-field-container-text-weight, var(--mat-sys-body-large-weight));\n}\n.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above {\n  font-size: calc(var(--mat-form-field-outlined-label-text-populated-size) * var(--mat-mdc-form-field-floating-label-scale));\n}\n.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: var(--mat-form-field-outlined-label-text-populated-size);\n}\n[dir=rtl] .mat-mdc-form-field {\n  text-align: right;\n}\n\n.mat-mdc-form-field-flex {\n  display: inline-flex;\n  align-items: baseline;\n  box-sizing: border-box;\n  width: 100%;\n}\n\n.mat-mdc-text-field-wrapper {\n  width: 100%;\n  z-index: 0;\n}\n\n.mat-mdc-form-field-icon-prefix,\n.mat-mdc-form-field-icon-suffix {\n  align-self: center;\n  line-height: 0;\n  pointer-events: auto;\n  position: relative;\n  z-index: 1;\n}\n.mat-mdc-form-field-icon-prefix > .mat-icon,\n.mat-mdc-form-field-icon-suffix > .mat-icon {\n  padding: 0 12px;\n  box-sizing: content-box;\n}\n\n.mat-mdc-form-field-icon-prefix {\n  color: var(--mat-form-field-leading-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-form-field-disabled .mat-mdc-form-field-icon-prefix {\n  color: var(--mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n\n.mat-mdc-form-field-icon-suffix {\n  color: var(--mat-form-field-trailing-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-form-field-disabled .mat-mdc-form-field-icon-suffix {\n  color: var(--mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-form-field-invalid .mat-mdc-form-field-icon-suffix {\n  color: var(--mat-form-field-error-trailing-icon-color, var(--mat-sys-error));\n}\n.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix {\n  color: var(--mat-form-field-error-hover-trailing-icon-color, var(--mat-sys-on-error-container));\n}\n.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix {\n  color: var(--mat-form-field-error-focus-trailing-icon-color, var(--mat-sys-error));\n}\n\n.mat-mdc-form-field-icon-prefix,\n[dir=rtl] .mat-mdc-form-field-icon-suffix {\n  padding: 0 4px 0 0;\n}\n\n.mat-mdc-form-field-icon-suffix,\n[dir=rtl] .mat-mdc-form-field-icon-prefix {\n  padding: 0 0 0 4px;\n}\n\n.mat-mdc-form-field-subscript-wrapper .mat-icon,\n.mat-mdc-form-field label .mat-icon {\n  width: 1em;\n  height: 1em;\n  font-size: inherit;\n}\n\n.mat-mdc-form-field-infix {\n  flex: auto;\n  min-width: 0;\n  width: 180px;\n  position: relative;\n  box-sizing: border-box;\n}\n.mat-mdc-form-field-infix:has(textarea[cols]) {\n  width: auto;\n}\n\n.mat-mdc-form-field .mdc-notched-outline__notch {\n  margin-left: -1px;\n  -webkit-clip-path: inset(-9em -999em -9em 1px);\n  clip-path: inset(-9em -999em -9em 1px);\n}\n[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch {\n  margin-left: 0;\n  margin-right: -1px;\n  -webkit-clip-path: inset(-9em 1px -9em -999em);\n  clip-path: inset(-9em 1px -9em -999em);\n}\n\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label {\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input {\n  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder {\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder {\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder {\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder {\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before {\n  transition-duration: 75ms;\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after {\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,\n.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper {\n  animation-duration: 300ms;\n}\n\n.mdc-notched-outline .mdc-floating-label {\n  max-width: calc(100% + 1px);\n}\n\n.mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  max-width: calc(133.3333333333% + 1px);\n}\n'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormField, [{
    type: Component,
    args: [{
      selector: "mat-form-field",
      exportAs: "matFormField",
      host: {
        "class": "mat-mdc-form-field",
        "[class.mat-mdc-form-field-label-always-float]": "_shouldAlwaysFloat()",
        "[class.mat-mdc-form-field-has-icon-prefix]": "_hasIconPrefix",
        "[class.mat-mdc-form-field-has-icon-suffix]": "_hasIconSuffix",
        "[class.mat-form-field-invalid]": "_control.errorState",
        "[class.mat-form-field-disabled]": "_control.disabled",
        "[class.mat-form-field-autofilled]": "_control.autofilled",
        "[class.mat-form-field-appearance-fill]": 'appearance == "fill"',
        "[class.mat-form-field-appearance-outline]": 'appearance == "outline"',
        "[class.mat-form-field-hide-placeholder]": "_hasFloatingLabel() && !_shouldLabelFloat()",
        "[class.mat-primary]": 'color !== "accent" && color !== "warn"',
        "[class.mat-accent]": 'color === "accent"',
        "[class.mat-warn]": 'color === "warn"',
        "[class.ng-untouched]": '_shouldForward("untouched")',
        "[class.ng-touched]": '_shouldForward("touched")',
        "[class.ng-pristine]": '_shouldForward("pristine")',
        "[class.ng-dirty]": '_shouldForward("dirty")',
        "[class.ng-valid]": '_shouldForward("valid")',
        "[class.ng-invalid]": '_shouldForward("invalid")',
        "[class.ng-pending]": '_shouldForward("pending")'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: MAT_FORM_FIELD,
        useExisting: MatFormField
      }, {
        provide: FLOATING_LABEL_PARENT,
        useExisting: MatFormField
      }],
      imports: [MatFormFieldFloatingLabel, MatFormFieldNotchedOutline, NgTemplateOutlet, MatFormFieldLineRipple, MatHint],
      template: '<ng-template #labelTemplate>\n  <!--\n    MDC recommends that the text-field is a `<label>` element. This rather complicates the\n    setup because it would require every form-field control to explicitly set `aria-labelledby`.\n    This is because the `<label>` itself contains more than the actual label (e.g. prefix, suffix\n    or other projected content), and screen readers could potentially read out undesired content.\n    Excluding elements from being printed out requires them to be marked with `aria-hidden`, or\n    the form control is set to a scoped element for the label (using `aria-labelledby`). Both of\n    these options seem to complicate the setup because we know exactly what content is rendered\n    as part of the label, and we don\'t want to spend resources on walking through projected content\n    to set `aria-hidden`. Nor do we want to set `aria-labelledby` on every form control if we could\n    simply link the label to the control using the label `for` attribute.\n  -->\n  @if (_hasFloatingLabel()) {\n    <label\n      matFormFieldFloatingLabel\n      [floating]="_shouldLabelFloat()"\n      [monitorResize]="_hasOutline()"\n      [id]="_labelId"\n      [attr.for]="_control.disableAutomaticLabeling ? null : _control.id"\n    >\n      <ng-content select="mat-label"></ng-content>\n      <!--\n        We set the required marker as a separate element, in order to make it easier to target if\n        apps want to override it and to be able to set `aria-hidden` so that screen readers don\'t\n        pick it up.\n       -->\n      @if (!hideRequiredMarker && _control.required) {\n        <span\n          aria-hidden="true"\n          class="mat-mdc-form-field-required-marker mdc-floating-label--required"\n        ></span>\n      }\n    </label>\n  }\n</ng-template>\n\n<div\n  class="mat-mdc-text-field-wrapper mdc-text-field"\n  #textField\n  [class.mdc-text-field--filled]="!_hasOutline()"\n  [class.mdc-text-field--outlined]="_hasOutline()"\n  [class.mdc-text-field--no-label]="!_hasFloatingLabel()"\n  [class.mdc-text-field--disabled]="_control.disabled"\n  [class.mdc-text-field--invalid]="_control.errorState"\n  (click)="_control.onContainerClick($event)"\n>\n  @if (!_hasOutline() && !_control.disabled) {\n    <div class="mat-mdc-form-field-focus-overlay"></div>\n  }\n  <div class="mat-mdc-form-field-flex">\n    @if (_hasOutline()) {\n      <div matFormFieldNotchedOutline [matFormFieldNotchedOutlineOpen]="_shouldLabelFloat()">\n        @if (!_forceDisplayInfixLabel()) {\n          <ng-template [ngTemplateOutlet]="labelTemplate"></ng-template>\n        }\n      </div>\n    }\n\n    @if (_hasIconPrefix) {\n      <div class="mat-mdc-form-field-icon-prefix" #iconPrefixContainer>\n        <ng-content select="[matPrefix], [matIconPrefix]"></ng-content>\n      </div>\n    }\n\n    @if (_hasTextPrefix) {\n      <div class="mat-mdc-form-field-text-prefix" #textPrefixContainer>\n        <ng-content select="[matTextPrefix]"></ng-content>\n      </div>\n    }\n\n    <div class="mat-mdc-form-field-infix">\n      @if (!_hasOutline() || _forceDisplayInfixLabel()) {\n        <ng-template [ngTemplateOutlet]="labelTemplate"></ng-template>\n      }\n\n      <ng-content></ng-content>\n    </div>\n\n    @if (_hasTextSuffix) {\n      <div class="mat-mdc-form-field-text-suffix" #textSuffixContainer>\n        <ng-content select="[matTextSuffix]"></ng-content>\n      </div>\n    }\n\n    @if (_hasIconSuffix) {\n      <div class="mat-mdc-form-field-icon-suffix" #iconSuffixContainer>\n        <ng-content select="[matSuffix], [matIconSuffix]"></ng-content>\n      </div>\n    }\n  </div>\n\n  @if (!_hasOutline()) {\n    <div matFormFieldLineRipple></div>\n  }\n</div>\n\n<div aria-atomic="true" aria-live="polite"\n  class="mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align"\n  [class.mat-mdc-form-field-subscript-dynamic-size]="subscriptSizing === \'dynamic\'"\n>\n  @let subscriptMessageType = _getSubscriptMessageType();\n\n  @switch (subscriptMessageType) {\n    @case (\'error\') {\n      <div class="mat-mdc-form-field-error-wrapper">\n        <ng-content select="mat-error, [matError]"></ng-content>\n      </div>\n    }\n\n    @case (\'hint\') {\n      <div class="mat-mdc-form-field-hint-wrapper">\n        @if (hintLabel) {\n          <mat-hint [id]="_hintLabelId">{{hintLabel}}</mat-hint>\n        }\n        <ng-content select="mat-hint:not([align=\'end\'])"></ng-content>\n        <div class="mat-mdc-form-field-hint-spacer"></div>\n        <ng-content select="mat-hint[align=\'end\']"></ng-content>\n      </div>\n    }\n  }\n</div>\n',
      styles: ['.mdc-text-field {\n  display: inline-flex;\n  align-items: baseline;\n  padding: 0 16px;\n  position: relative;\n  box-sizing: border-box;\n  overflow: hidden;\n  will-change: opacity, transform, color;\n  border-top-left-radius: 4px;\n  border-top-right-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n}\n\n.mdc-text-field__input {\n  width: 100%;\n  min-width: 0;\n  border: none;\n  border-radius: 0;\n  background: none;\n  padding: 0;\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  height: 28px;\n}\n.mdc-text-field__input::-webkit-calendar-picker-indicator, .mdc-text-field__input::-webkit-search-cancel-button {\n  display: none;\n}\n.mdc-text-field__input::-ms-clear {\n  display: none;\n}\n.mdc-text-field__input:focus {\n  outline: none;\n}\n.mdc-text-field__input:invalid {\n  box-shadow: none;\n}\n.mdc-text-field__input::placeholder {\n  opacity: 0;\n}\n.mdc-text-field__input::-moz-placeholder {\n  opacity: 0;\n}\n.mdc-text-field__input::-webkit-input-placeholder {\n  opacity: 0;\n}\n.mdc-text-field__input:-ms-input-placeholder {\n  opacity: 0;\n}\n.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mdc-text-field--focused .mdc-text-field__input::placeholder {\n  opacity: 1;\n}\n.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {\n  opacity: 1;\n}\n.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {\n  opacity: 1;\n}\n.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {\n  opacity: 1;\n}\n.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder {\n  opacity: 0;\n}\n.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder {\n  opacity: 0;\n}\n.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder {\n  opacity: 0;\n}\n.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder {\n  opacity: 0;\n}\n.mdc-text-field--outlined .mdc-text-field__input, .mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input {\n  height: 100%;\n}\n.mdc-text-field--outlined .mdc-text-field__input {\n  display: flex;\n  border: none !important;\n  background-color: transparent;\n}\n.mdc-text-field--disabled .mdc-text-field__input {\n  pointer-events: auto;\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input {\n  color: var(--mat-form-field-filled-input-text-color, var(--mat-sys-on-surface));\n  caret-color: var(--mat-form-field-filled-caret-color, var(--mat-sys-primary));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {\n  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {\n  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {\n  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {\n  color: var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input {\n  color: var(--mat-form-field-outlined-input-text-color, var(--mat-sys-on-surface));\n  caret-color: var(--mat-form-field-outlined-caret-color, var(--mat-sys-primary));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder {\n  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder {\n  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder {\n  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder {\n  color: var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {\n  caret-color: var(--mat-form-field-filled-error-caret-color, var(--mat-sys-error));\n}\n.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input {\n  caret-color: var(--mat-form-field-outlined-error-caret-color, var(--mat-sys-error));\n}\n.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input {\n  color: var(--mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input {\n  color: var(--mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mdc-text-field--disabled .mdc-text-field__input {\n    background-color: Window;\n  }\n}\n\n.mdc-text-field--filled {\n  height: 56px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0;\n  border-top-left-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));\n  border-top-right-radius: var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) {\n  background-color: var(--mat-form-field-filled-container-color, var(--mat-sys-surface-variant));\n}\n.mdc-text-field--filled.mdc-text-field--disabled {\n  background-color: var(--mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent));\n}\n\n.mdc-text-field--outlined {\n  height: 56px;\n  overflow: visible;\n  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));\n  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);\n}\n[dir=rtl] .mdc-text-field--outlined {\n  padding-right: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);\n  padding-left: max(16px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));\n}\n\n.mdc-floating-label {\n  position: absolute;\n  left: 0;\n  transform-origin: left top;\n  line-height: 1.15rem;\n  text-align: left;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  cursor: text;\n  overflow: hidden;\n  will-change: transform;\n}\n[dir=rtl] .mdc-floating-label {\n  right: 0;\n  left: auto;\n  transform-origin: right top;\n  text-align: right;\n}\n.mdc-text-field .mdc-floating-label {\n  top: 50%;\n  transform: translateY(-50%);\n  pointer-events: none;\n}\n.mdc-notched-outline .mdc-floating-label {\n  display: inline-block;\n  position: relative;\n  max-width: 100%;\n}\n.mdc-text-field--outlined .mdc-floating-label {\n  left: 4px;\n  right: auto;\n}\n[dir=rtl] .mdc-text-field--outlined .mdc-floating-label {\n  left: auto;\n  right: 4px;\n}\n.mdc-text-field--filled .mdc-floating-label {\n  left: 16px;\n  right: auto;\n}\n[dir=rtl] .mdc-text-field--filled .mdc-floating-label {\n  left: auto;\n  right: 16px;\n}\n.mdc-text-field--disabled .mdc-floating-label {\n  cursor: default;\n}\n@media (forced-colors: active) {\n  .mdc-text-field--disabled .mdc-floating-label {\n    z-index: 1;\n  }\n}\n.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label {\n  display: none;\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: var(--mat-form-field-filled-label-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {\n  color: var(--mat-form-field-filled-focus-label-text-color, var(--mat-sys-primary));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {\n  color: var(--mat-form-field-filled-hover-label-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label {\n  color: var(--mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {\n  color: var(--mat-form-field-filled-error-label-text-color, var(--mat-sys-error));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {\n  color: var(--mat-form-field-filled-error-focus-label-text-color, var(--mat-sys-error));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {\n  color: var(--mat-form-field-filled-error-hover-label-text-color, var(--mat-sys-on-error-container));\n}\n.mdc-text-field--filled .mdc-floating-label {\n  font-family: var(--mat-form-field-filled-label-text-font, var(--mat-sys-body-large-font));\n  font-size: var(--mat-form-field-filled-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-form-field-filled-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-form-field-filled-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label {\n  color: var(--mat-form-field-outlined-label-text-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label {\n  color: var(--mat-form-field-outlined-focus-label-text-color, var(--mat-sys-primary));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label {\n  color: var(--mat-form-field-outlined-hover-label-text-color, var(--mat-sys-on-surface));\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label {\n  color: var(--mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label {\n  color: var(--mat-form-field-outlined-error-label-text-color, var(--mat-sys-error));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label {\n  color: var(--mat-form-field-outlined-error-focus-label-text-color, var(--mat-sys-error));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label {\n  color: var(--mat-form-field-outlined-error-hover-label-text-color, var(--mat-sys-on-error-container));\n}\n.mdc-text-field--outlined .mdc-floating-label {\n  font-family: var(--mat-form-field-outlined-label-text-font, var(--mat-sys-body-large-font));\n  font-size: var(--mat-form-field-outlined-label-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-form-field-outlined-label-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-form-field-outlined-label-text-tracking, var(--mat-sys-body-large-tracking));\n}\n\n.mdc-floating-label--float-above {\n  cursor: auto;\n  transform: translateY(-106%) scale(0.75);\n}\n.mdc-text-field--filled .mdc-floating-label--float-above {\n  transform: translateY(-106%) scale(0.75);\n}\n.mdc-text-field--outlined .mdc-floating-label--float-above {\n  transform: translateY(-37.25px) scale(1);\n  font-size: 0.75rem;\n}\n.mdc-notched-outline .mdc-floating-label--float-above {\n  text-overflow: clip;\n}\n.mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  max-width: 133.3333333333%;\n}\n.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  transform: translateY(-34.75px) scale(0.75);\n}\n.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above, .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: 1rem;\n}\n\n.mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {\n  margin-left: 1px;\n  margin-right: 0;\n  content: "*";\n}\n[dir=rtl] .mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after {\n  margin-left: 0;\n  margin-right: 1px;\n}\n\n.mdc-notched-outline {\n  display: flex;\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100%;\n  max-width: 100%;\n  height: 100%;\n  text-align: left;\n  pointer-events: none;\n}\n[dir=rtl] .mdc-notched-outline {\n  text-align: right;\n}\n.mdc-text-field--outlined .mdc-notched-outline {\n  z-index: 1;\n}\n\n.mat-mdc-notch-piece {\n  box-sizing: border-box;\n  height: 100%;\n  pointer-events: none;\n  border: none;\n  border-top: 1px solid;\n  border-bottom: 1px solid;\n}\n.mdc-text-field--focused .mat-mdc-notch-piece {\n  border-width: 2px;\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-outline-color, var(--mat-sys-outline));\n  border-width: var(--mat-form-field-outlined-outline-width, 1px);\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-hover-outline-color, var(--mat-sys-on-surface));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-focus-outline-color, var(--mat-sys-primary));\n}\n.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-error-outline-color, var(--mat-sys-error));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-error-hover-outline-color, var(--mat-sys-on-error-container));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece {\n  border-color: var(--mat-form-field-outlined-error-focus-outline-color, var(--mat-sys-error));\n}\n.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece {\n  border-width: var(--mat-form-field-outlined-focus-outline-width, 2px);\n}\n\n.mdc-notched-outline__leading {\n  border-left: 1px solid;\n  border-right: none;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n}\n.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading {\n  width: max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));\n}\n[dir=rtl] .mdc-notched-outline__leading {\n  border-left: none;\n  border-right: 1px solid;\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0;\n  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n}\n\n.mdc-notched-outline__trailing {\n  flex-grow: 1;\n  border-left: none;\n  border-right: 1px solid;\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n  border-top-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n  border-bottom-right-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n}\n[dir=rtl] .mdc-notched-outline__trailing {\n  border-left: 1px solid;\n  border-right: none;\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n  border-top-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n  border-bottom-left-radius: var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));\n}\n\n.mdc-notched-outline__notch {\n  flex: 0 0 auto;\n  width: auto;\n}\n.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch {\n  max-width: min(var(--mat-form-field-notch-max-width, 100%), calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));\n}\n.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {\n  max-width: min(100%, calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2));\n}\n.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {\n  padding-top: 1px;\n}\n.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch {\n  padding-top: 2px;\n}\n.mdc-notched-outline--notched .mdc-notched-outline__notch {\n  padding-left: 0;\n  padding-right: 8px;\n  border-top: none;\n}\n[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch {\n  padding-left: 8px;\n  padding-right: 0;\n}\n.mdc-notched-outline--no-label .mdc-notched-outline__notch {\n  display: none;\n}\n\n.mdc-line-ripple::before, .mdc-line-ripple::after {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  border-bottom-style: solid;\n  content: "";\n}\n.mdc-line-ripple::before {\n  z-index: 1;\n  border-bottom-width: var(--mat-form-field-filled-active-indicator-height, 1px);\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before {\n  border-bottom-color: var(--mat-form-field-filled-active-indicator-color, var(--mat-sys-on-surface-variant));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before {\n  border-bottom-color: var(--mat-form-field-filled-hover-active-indicator-color, var(--mat-sys-on-surface));\n}\n.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before {\n  border-bottom-color: var(--mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before {\n  border-bottom-color: var(--mat-form-field-filled-error-active-indicator-color, var(--mat-sys-error));\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before {\n  border-bottom-color: var(--mat-form-field-filled-error-hover-active-indicator-color, var(--mat-sys-on-error-container));\n}\n.mdc-line-ripple::after {\n  transform: scaleX(0);\n  opacity: 0;\n  z-index: 2;\n}\n.mdc-text-field--filled .mdc-line-ripple::after {\n  border-bottom-width: var(--mat-form-field-filled-focus-active-indicator-height, 2px);\n}\n.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after {\n  border-bottom-color: var(--mat-form-field-filled-focus-active-indicator-color, var(--mat-sys-primary));\n}\n.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after {\n  border-bottom-color: var(--mat-form-field-filled-error-focus-active-indicator-color, var(--mat-sys-error));\n}\n\n.mdc-line-ripple--active::after {\n  transform: scaleX(1);\n  opacity: 1;\n}\n\n.mdc-line-ripple--deactivating::after {\n  opacity: 0;\n}\n\n.mdc-text-field--disabled {\n  pointer-events: none;\n}\n\n.mat-mdc-form-field-textarea-control {\n  vertical-align: middle;\n  resize: vertical;\n  box-sizing: border-box;\n  height: auto;\n  margin: 0;\n  padding: 0;\n  border: none;\n  overflow: auto;\n}\n\n.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font: inherit;\n  letter-spacing: inherit;\n  text-decoration: inherit;\n  text-transform: inherit;\n  border: none;\n}\n\n.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  line-height: normal;\n  pointer-events: all;\n  will-change: auto;\n}\n\n.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label {\n  cursor: inherit;\n}\n\n.mdc-text-field--no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,\n.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control {\n  height: auto;\n}\n\n.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color] {\n  height: 23px;\n}\n\n.mat-mdc-text-field-wrapper {\n  height: auto;\n  flex: auto;\n  will-change: auto;\n}\n\n.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {\n  padding-left: 0;\n  --mat-mdc-form-field-label-offset-x: -16px;\n}\n\n.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {\n  padding-right: 0;\n}\n\n[dir=rtl] .mat-mdc-text-field-wrapper {\n  padding-left: 16px;\n  padding-right: 16px;\n}\n[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper {\n  padding-left: 0;\n}\n[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper {\n  padding-right: 0;\n}\n\n.mat-form-field-disabled .mdc-text-field__input::placeholder {\n  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder {\n  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder {\n  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder {\n  color: var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n\n.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n  opacity: 1;\n}\n\n.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label {\n  left: auto;\n  right: auto;\n}\n\n.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input {\n  display: inline-block;\n}\n\n.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch {\n  padding-top: 0;\n}\n\n.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {\n  border-left: 1px solid transparent;\n}\n\n[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch {\n  border-left: none;\n  border-right: 1px solid transparent;\n}\n\n.mat-mdc-form-field-infix {\n  min-height: var(--mat-form-field-container-height, 56px);\n  padding-top: var(--mat-form-field-filled-with-label-container-padding-top, 24px);\n  padding-bottom: var(--mat-form-field-filled-with-label-container-padding-bottom, 8px);\n}\n.mdc-text-field--outlined .mat-mdc-form-field-infix, .mdc-text-field--no-label .mat-mdc-form-field-infix {\n  padding-top: var(--mat-form-field-container-vertical-padding, 16px);\n  padding-bottom: var(--mat-form-field-container-vertical-padding, 16px);\n}\n\n.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label {\n  top: calc(var(--mat-form-field-container-height, 56px) / 2);\n}\n\n.mdc-text-field--filled .mat-mdc-floating-label {\n  display: var(--mat-form-field-filled-label-display, block);\n}\n\n.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  --mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--mat-form-field-container-height, 56px) / 2) * -1))\n    scale(var(--mat-mdc-form-field-floating-label-scale, 0.75));\n  transform: var(--mat-mdc-form-field-label-transform);\n}\n\n@keyframes _mat-form-field-subscript-animation {\n  from {\n    opacity: 0;\n    transform: translateY(-5px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n.mat-mdc-form-field-subscript-wrapper {\n  box-sizing: border-box;\n  width: 100%;\n  position: relative;\n}\n\n.mat-mdc-form-field-hint-wrapper,\n.mat-mdc-form-field-error-wrapper {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  padding: 0 16px;\n  opacity: 1;\n  transform: translateY(0);\n  animation: _mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2);\n}\n\n.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,\n.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper {\n  position: static;\n}\n\n.mat-mdc-form-field-bottom-align::before {\n  content: "";\n  display: inline-block;\n  height: 16px;\n}\n\n.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before {\n  content: unset;\n}\n\n.mat-mdc-form-field-hint-end {\n  order: 1;\n}\n\n.mat-mdc-form-field-hint-wrapper {\n  display: flex;\n}\n\n.mat-mdc-form-field-hint-spacer {\n  flex: 1 0 1em;\n}\n\n.mat-mdc-form-field-error {\n  display: block;\n  color: var(--mat-form-field-error-text-color, var(--mat-sys-error));\n}\n\n.mat-mdc-form-field-subscript-wrapper,\n.mat-mdc-form-field-bottom-align::before {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: var(--mat-form-field-subscript-text-font, var(--mat-sys-body-small-font));\n  line-height: var(--mat-form-field-subscript-text-line-height, var(--mat-sys-body-small-line-height));\n  font-size: var(--mat-form-field-subscript-text-size, var(--mat-sys-body-small-size));\n  letter-spacing: var(--mat-form-field-subscript-text-tracking, var(--mat-sys-body-small-tracking));\n  font-weight: var(--mat-form-field-subscript-text-weight, var(--mat-sys-body-small-weight));\n}\n\n.mat-mdc-form-field-focus-overlay {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  opacity: 0;\n  pointer-events: none;\n  background-color: var(--mat-form-field-state-layer-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay {\n  opacity: var(--mat-form-field-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n}\n.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay {\n  opacity: var(--mat-form-field-focus-state-layer-opacity, 0);\n}\n\nselect.mat-mdc-form-field-input-control {\n  -moz-appearance: none;\n  -webkit-appearance: none;\n  background-color: transparent;\n  display: inline-flex;\n  box-sizing: border-box;\n}\nselect.mat-mdc-form-field-input-control:not(:disabled) {\n  cursor: pointer;\n}\nselect.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option {\n  color: var(--mat-form-field-select-option-text-color, var(--mat-sys-neutral10));\n}\nselect.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled {\n  color: var(--mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--mat-sys-neutral10) 38%, transparent));\n}\n\n.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {\n  content: "";\n  width: 0;\n  height: 0;\n  border-left: 5px solid transparent;\n  border-right: 5px solid transparent;\n  border-top: 5px solid;\n  position: absolute;\n  right: 0;\n  top: 50%;\n  margin-top: -2.5px;\n  pointer-events: none;\n  color: var(--mat-form-field-enabled-select-arrow-color, var(--mat-sys-on-surface-variant));\n}\n[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after {\n  right: auto;\n  left: 0;\n}\n.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after {\n  color: var(--mat-form-field-focus-select-arrow-color, var(--mat-sys-primary));\n}\n.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after {\n  color: var(--mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {\n  padding-right: 15px;\n}\n[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control {\n  padding-right: 0;\n  padding-left: 15px;\n}\n\n@media (forced-colors: active) {\n  .mat-form-field-appearance-fill .mat-mdc-text-field-wrapper {\n    outline: solid 1px;\n  }\n}\n@media (forced-colors: active) {\n  .mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper {\n    outline-color: GrayText;\n  }\n}\n\n@media (forced-colors: active) {\n  .mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper {\n    outline: dashed 3px;\n  }\n}\n\n@media (forced-colors: active) {\n  .mat-mdc-form-field.mat-focused .mdc-notched-outline {\n    border: dashed 3px;\n  }\n}\n\n.mat-mdc-form-field-input-control[type=date], .mat-mdc-form-field-input-control[type=datetime], .mat-mdc-form-field-input-control[type=datetime-local], .mat-mdc-form-field-input-control[type=month], .mat-mdc-form-field-input-control[type=week], .mat-mdc-form-field-input-control[type=time] {\n  line-height: 1;\n}\n.mat-mdc-form-field-input-control::-webkit-datetime-edit {\n  line-height: 1;\n  padding: 0;\n  margin-bottom: -2px;\n}\n\n.mat-mdc-form-field {\n  --mat-mdc-form-field-floating-label-scale: 0.75;\n  display: inline-flex;\n  flex-direction: column;\n  min-width: 0;\n  text-align: left;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  font-family: var(--mat-form-field-container-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-form-field-container-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-form-field-container-text-size, var(--mat-sys-body-large-size));\n  letter-spacing: var(--mat-form-field-container-text-tracking, var(--mat-sys-body-large-tracking));\n  font-weight: var(--mat-form-field-container-text-weight, var(--mat-sys-body-large-weight));\n}\n.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above {\n  font-size: calc(var(--mat-form-field-outlined-label-text-populated-size) * var(--mat-mdc-form-field-floating-label-scale));\n}\n.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  font-size: var(--mat-form-field-outlined-label-text-populated-size);\n}\n[dir=rtl] .mat-mdc-form-field {\n  text-align: right;\n}\n\n.mat-mdc-form-field-flex {\n  display: inline-flex;\n  align-items: baseline;\n  box-sizing: border-box;\n  width: 100%;\n}\n\n.mat-mdc-text-field-wrapper {\n  width: 100%;\n  z-index: 0;\n}\n\n.mat-mdc-form-field-icon-prefix,\n.mat-mdc-form-field-icon-suffix {\n  align-self: center;\n  line-height: 0;\n  pointer-events: auto;\n  position: relative;\n  z-index: 1;\n}\n.mat-mdc-form-field-icon-prefix > .mat-icon,\n.mat-mdc-form-field-icon-suffix > .mat-icon {\n  padding: 0 12px;\n  box-sizing: content-box;\n}\n\n.mat-mdc-form-field-icon-prefix {\n  color: var(--mat-form-field-leading-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-form-field-disabled .mat-mdc-form-field-icon-prefix {\n  color: var(--mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n\n.mat-mdc-form-field-icon-suffix {\n  color: var(--mat-form-field-trailing-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-form-field-disabled .mat-mdc-form-field-icon-suffix {\n  color: var(--mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-form-field-invalid .mat-mdc-form-field-icon-suffix {\n  color: var(--mat-form-field-error-trailing-icon-color, var(--mat-sys-error));\n}\n.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix {\n  color: var(--mat-form-field-error-hover-trailing-icon-color, var(--mat-sys-on-error-container));\n}\n.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix {\n  color: var(--mat-form-field-error-focus-trailing-icon-color, var(--mat-sys-error));\n}\n\n.mat-mdc-form-field-icon-prefix,\n[dir=rtl] .mat-mdc-form-field-icon-suffix {\n  padding: 0 4px 0 0;\n}\n\n.mat-mdc-form-field-icon-suffix,\n[dir=rtl] .mat-mdc-form-field-icon-prefix {\n  padding: 0 0 0 4px;\n}\n\n.mat-mdc-form-field-subscript-wrapper .mat-icon,\n.mat-mdc-form-field label .mat-icon {\n  width: 1em;\n  height: 1em;\n  font-size: inherit;\n}\n\n.mat-mdc-form-field-infix {\n  flex: auto;\n  min-width: 0;\n  width: 180px;\n  position: relative;\n  box-sizing: border-box;\n}\n.mat-mdc-form-field-infix:has(textarea[cols]) {\n  width: auto;\n}\n\n.mat-mdc-form-field .mdc-notched-outline__notch {\n  margin-left: -1px;\n  -webkit-clip-path: inset(-9em -999em -9em 1px);\n  clip-path: inset(-9em -999em -9em 1px);\n}\n[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch {\n  margin-left: 0;\n  margin-right: -1px;\n  -webkit-clip-path: inset(-9em 1px -9em -999em);\n  clip-path: inset(-9em 1px -9em -999em);\n}\n\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label {\n  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input {\n  transition: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder {\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder {\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder {\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder {\n  transition: opacity 67ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder, .mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder {\n  transition-delay: 40ms;\n  transition-duration: 110ms;\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before {\n  transition-duration: 75ms;\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after {\n  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 180ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,\n.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper {\n  animation-duration: 300ms;\n}\n\n.mdc-notched-outline .mdc-floating-label {\n  max-width: calc(100% + 1px);\n}\n\n.mdc-notched-outline--upgraded .mdc-floating-label--float-above {\n  max-width: calc(133.3333333333% + 1px);\n}\n']
    }]
  }], () => [], {
    _textField: [{
      type: ViewChild,
      args: ["textField"]
    }],
    _iconPrefixContainer: [{
      type: ViewChild,
      args: ["iconPrefixContainer"]
    }],
    _textPrefixContainer: [{
      type: ViewChild,
      args: ["textPrefixContainer"]
    }],
    _iconSuffixContainer: [{
      type: ViewChild,
      args: ["iconSuffixContainer"]
    }],
    _textSuffixContainer: [{
      type: ViewChild,
      args: ["textSuffixContainer"]
    }],
    _floatingLabel: [{
      type: ViewChild,
      args: [MatFormFieldFloatingLabel]
    }],
    _notchedOutline: [{
      type: ViewChild,
      args: [MatFormFieldNotchedOutline]
    }],
    _lineRipple: [{
      type: ViewChild,
      args: [MatFormFieldLineRipple]
    }],
    _iconPrefixContainerSignal: [{
      type: ViewChild,
      args: ["iconPrefixContainer", {
        isSignal: true
      }]
    }],
    _textPrefixContainerSignal: [{
      type: ViewChild,
      args: ["textPrefixContainer", {
        isSignal: true
      }]
    }],
    _iconSuffixContainerSignal: [{
      type: ViewChild,
      args: ["iconSuffixContainer", {
        isSignal: true
      }]
    }],
    _textSuffixContainerSignal: [{
      type: ViewChild,
      args: ["textSuffixContainer", {
        isSignal: true
      }]
    }],
    _formFieldControl: [{
      type: ContentChild,
      args: [MatFormFieldControl]
    }],
    _prefixChildren: [{
      type: ContentChildren,
      args: [MAT_PREFIX, {
        descendants: true
      }]
    }],
    _suffixChildren: [{
      type: ContentChildren,
      args: [MAT_SUFFIX, {
        descendants: true
      }]
    }],
    _errorChildren: [{
      type: ContentChildren,
      args: [MAT_ERROR, {
        descendants: true
      }]
    }],
    _hintChildren: [{
      type: ContentChildren,
      args: [MatHint, {
        descendants: true
      }]
    }],
    _labelChild: [{
      type: ContentChild,
      args: [forwardRef(() => MatLabel), {
        isSignal: true
      }]
    }],
    hideRequiredMarker: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    floatLabel: [{
      type: Input
    }],
    appearance: [{
      type: Input
    }],
    subscriptSizing: [{
      type: Input
    }],
    hintLabel: [{
      type: Input
    }]
  });
})();

// node_modules/@angular/material/fesm2022/_option-chunk.mjs
var _c02 = ["*", [["mat-option"], ["ng-container"]]];
var _c12 = ["*", "mat-option, ng-container"];
var _c22 = ["text"];
var _c32 = [[["mat-icon"]], "*"];
var _c42 = ["mat-icon", "*"];
function MatOption_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-pseudo-checkbox", 1);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r0.disabled)("state", ctx_r0.selected ? "checked" : "unchecked");
  }
}
function MatOption_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-pseudo-checkbox", 3);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("disabled", ctx_r0.disabled);
  }
}
function MatOption_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("(", ctx_r0.group.label, ")");
  }
}
var MAT_OPTION_PARENT_COMPONENT = new InjectionToken("MAT_OPTION_PARENT_COMPONENT");
var MAT_OPTGROUP = new InjectionToken("MatOptgroup");
var MatOptgroup = class _MatOptgroup {
  label;
  disabled = false;
  _labelId = inject(_IdGenerator).getId("mat-optgroup-label-");
  _inert;
  constructor() {
    const parent = inject(MAT_OPTION_PARENT_COMPONENT, {
      optional: true
    });
    this._inert = parent?.inertGroups ?? false;
  }
  static \u0275fac = function MatOptgroup_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatOptgroup)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatOptgroup,
    selectors: [["mat-optgroup"]],
    hostAttrs: [1, "mat-mdc-optgroup"],
    hostVars: 3,
    hostBindings: function MatOptgroup_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("role", ctx._inert ? null : "group")("aria-disabled", ctx._inert ? null : ctx.disabled.toString())("aria-labelledby", ctx._inert ? null : ctx._labelId);
      }
    },
    inputs: {
      label: "label",
      disabled: [2, "disabled", "disabled", booleanAttribute]
    },
    exportAs: ["matOptgroup"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_OPTGROUP,
      useExisting: _MatOptgroup
    }])],
    ngContentSelectors: _c12,
    decls: 5,
    vars: 4,
    consts: [["role", "presentation", 1, "mat-mdc-optgroup-label", 3, "id"], [1, "mdc-list-item__primary-text"]],
    template: function MatOptgroup_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c02);
        \u0275\u0275domElementStart(0, "span", 0)(1, "span", 1);
        \u0275\u0275text(2);
        \u0275\u0275projection(3);
        \u0275\u0275domElementEnd()();
        \u0275\u0275projection(4, 1);
      }
      if (rf & 2) {
        \u0275\u0275classProp("mdc-list-item--disabled", ctx.disabled);
        \u0275\u0275domProperty("id", ctx._labelId);
        \u0275\u0275advance(2);
        \u0275\u0275textInterpolate1("", ctx.label, " ");
      }
    },
    styles: [".mat-mdc-optgroup {\n  color: var(--mat-optgroup-label-text-color, var(--mat-sys-on-surface-variant));\n  font-family: var(--mat-optgroup-label-text-font, var(--mat-sys-title-small-font));\n  line-height: var(--mat-optgroup-label-text-line-height, var(--mat-sys-title-small-line-height));\n  font-size: var(--mat-optgroup-label-text-size, var(--mat-sys-title-small-size));\n  letter-spacing: var(--mat-optgroup-label-text-tracking, var(--mat-sys-title-small-tracking));\n  font-weight: var(--mat-optgroup-label-text-weight, var(--mat-sys-title-small-weight));\n}\n\n.mat-mdc-optgroup-label {\n  display: flex;\n  position: relative;\n  align-items: center;\n  justify-content: flex-start;\n  overflow: hidden;\n  min-height: 48px;\n  padding: 0 16px;\n  outline: none;\n}\n.mat-mdc-optgroup-label.mdc-list-item--disabled {\n  opacity: 0.38;\n}\n.mat-mdc-optgroup-label .mdc-list-item__primary-text {\n  font-size: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  line-height: inherit;\n  font-family: inherit;\n  text-decoration: inherit;\n  text-transform: inherit;\n  white-space: normal;\n  color: inherit;\n}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatOptgroup, [{
    type: Component,
    args: [{
      selector: "mat-optgroup",
      exportAs: "matOptgroup",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "class": "mat-mdc-optgroup",
        "[attr.role]": '_inert ? null : "group"',
        "[attr.aria-disabled]": "_inert ? null : disabled.toString()",
        "[attr.aria-labelledby]": "_inert ? null : _labelId"
      },
      providers: [{
        provide: MAT_OPTGROUP,
        useExisting: MatOptgroup
      }],
      template: '<span\n  class="mat-mdc-optgroup-label"\n  role="presentation"\n  [class.mdc-list-item--disabled]="disabled"\n  [id]="_labelId">\n  <span class="mdc-list-item__primary-text">{{ label }} <ng-content></ng-content></span>\n</span>\n\n<ng-content select="mat-option, ng-container"></ng-content>\n',
      styles: [".mat-mdc-optgroup {\n  color: var(--mat-optgroup-label-text-color, var(--mat-sys-on-surface-variant));\n  font-family: var(--mat-optgroup-label-text-font, var(--mat-sys-title-small-font));\n  line-height: var(--mat-optgroup-label-text-line-height, var(--mat-sys-title-small-line-height));\n  font-size: var(--mat-optgroup-label-text-size, var(--mat-sys-title-small-size));\n  letter-spacing: var(--mat-optgroup-label-text-tracking, var(--mat-sys-title-small-tracking));\n  font-weight: var(--mat-optgroup-label-text-weight, var(--mat-sys-title-small-weight));\n}\n\n.mat-mdc-optgroup-label {\n  display: flex;\n  position: relative;\n  align-items: center;\n  justify-content: flex-start;\n  overflow: hidden;\n  min-height: 48px;\n  padding: 0 16px;\n  outline: none;\n}\n.mat-mdc-optgroup-label.mdc-list-item--disabled {\n  opacity: 0.38;\n}\n.mat-mdc-optgroup-label .mdc-list-item__primary-text {\n  font-size: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  line-height: inherit;\n  font-family: inherit;\n  text-decoration: inherit;\n  text-transform: inherit;\n  white-space: normal;\n  color: inherit;\n}\n"]
    }]
  }], () => [], {
    label: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var MatOptionSelectionChange = class {
  source;
  isUserInput;
  constructor(source, isUserInput = false) {
    this.source = source;
    this.isUserInput = isUserInput;
  }
};
var MatOption = class _MatOption {
  _element = inject(ElementRef);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _parent = inject(MAT_OPTION_PARENT_COMPONENT, {
    optional: true
  });
  group = inject(MAT_OPTGROUP, {
    optional: true
  });
  _signalDisableRipple = false;
  _selected = false;
  _active = false;
  _mostRecentViewValue = "";
  get multiple() {
    return this._parent && this._parent.multiple;
  }
  get selected() {
    return this._selected;
  }
  value;
  id = inject(_IdGenerator).getId("mat-option-");
  get disabled() {
    return this.group && this.group.disabled || this._disabled();
  }
  set disabled(value) {
    this._disabled.set(value);
  }
  _disabled = signal(false, ...ngDevMode ? [{
    debugName: "_disabled"
  }] : []);
  get disableRipple() {
    return this._signalDisableRipple ? this._parent.disableRipple() : !!this._parent?.disableRipple;
  }
  get hideSingleSelectionIndicator() {
    return !!(this._parent && this._parent.hideSingleSelectionIndicator);
  }
  onSelectionChange = new EventEmitter();
  _text;
  _stateChanges = new Subject();
  constructor() {
    const styleLoader = inject(_CdkPrivateStyleLoader);
    styleLoader.load(_StructuralStylesLoader);
    styleLoader.load(_VisuallyHiddenLoader);
    this._signalDisableRipple = !!this._parent && isSignal(this._parent.disableRipple);
  }
  get active() {
    return this._active;
  }
  get viewValue() {
    return (this._text?.nativeElement.textContent || "").trim();
  }
  select(emitEvent = true) {
    if (!this._selected) {
      this._selected = true;
      this._changeDetectorRef.markForCheck();
      if (emitEvent) {
        this._emitSelectionChangeEvent();
      }
    }
  }
  deselect(emitEvent = true) {
    if (this._selected) {
      this._selected = false;
      this._changeDetectorRef.markForCheck();
      if (emitEvent) {
        this._emitSelectionChangeEvent();
      }
    }
  }
  focus(_origin, options) {
    const element = this._getHostElement();
    if (typeof element.focus === "function") {
      element.focus(options);
    }
  }
  setActiveStyles() {
    if (!this._active) {
      this._active = true;
      this._changeDetectorRef.markForCheck();
    }
  }
  setInactiveStyles() {
    if (this._active) {
      this._active = false;
      this._changeDetectorRef.markForCheck();
    }
  }
  getLabel() {
    return this.viewValue;
  }
  _handleKeydown(event) {
    if ((event.keyCode === ENTER || event.keyCode === SPACE) && !hasModifierKey(event)) {
      this._selectViaInteraction();
      event.preventDefault();
    }
  }
  _selectViaInteraction() {
    if (!this.disabled) {
      this._selected = this.multiple ? !this._selected : true;
      this._changeDetectorRef.markForCheck();
      this._emitSelectionChangeEvent(true);
    }
  }
  _getTabIndex() {
    return this.disabled ? "-1" : "0";
  }
  _getHostElement() {
    return this._element.nativeElement;
  }
  ngAfterViewChecked() {
    if (this._selected) {
      const viewValue = this.viewValue;
      if (viewValue !== this._mostRecentViewValue) {
        if (this._mostRecentViewValue) {
          this._stateChanges.next();
        }
        this._mostRecentViewValue = viewValue;
      }
    }
  }
  ngOnDestroy() {
    this._stateChanges.complete();
  }
  _emitSelectionChangeEvent(isUserInput = false) {
    this.onSelectionChange.emit(new MatOptionSelectionChange(this, isUserInput));
  }
  static \u0275fac = function MatOption_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatOption)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatOption,
    selectors: [["mat-option"]],
    viewQuery: function MatOption_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c22, 7);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._text = _t.first);
      }
    },
    hostAttrs: ["role", "option", 1, "mat-mdc-option", "mdc-list-item"],
    hostVars: 11,
    hostBindings: function MatOption_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("click", function MatOption_click_HostBindingHandler() {
          return ctx._selectViaInteraction();
        })("keydown", function MatOption_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        });
      }
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id);
        \u0275\u0275attribute("aria-selected", ctx.selected)("aria-disabled", ctx.disabled.toString());
        \u0275\u0275classProp("mdc-list-item--selected", ctx.selected)("mat-mdc-option-multiple", ctx.multiple)("mat-mdc-option-active", ctx.active)("mdc-list-item--disabled", ctx.disabled);
      }
    },
    inputs: {
      value: "value",
      id: "id",
      disabled: [2, "disabled", "disabled", booleanAttribute]
    },
    outputs: {
      onSelectionChange: "onSelectionChange"
    },
    exportAs: ["matOption"],
    ngContentSelectors: _c42,
    decls: 8,
    vars: 5,
    consts: [["text", ""], ["aria-hidden", "true", 1, "mat-mdc-option-pseudo-checkbox", 3, "disabled", "state"], [1, "mdc-list-item__primary-text"], ["state", "checked", "aria-hidden", "true", "appearance", "minimal", 1, "mat-mdc-option-pseudo-checkbox", 3, "disabled"], [1, "cdk-visually-hidden"], ["aria-hidden", "true", "mat-ripple", "", 1, "mat-mdc-option-ripple", "mat-focus-indicator", 3, "matRippleTrigger", "matRippleDisabled"]],
    template: function MatOption_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c32);
        \u0275\u0275conditionalCreate(0, MatOption_Conditional_0_Template, 1, 2, "mat-pseudo-checkbox", 1);
        \u0275\u0275projection(1);
        \u0275\u0275elementStart(2, "span", 2, 0);
        \u0275\u0275projection(4, 1);
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(5, MatOption_Conditional_5_Template, 1, 1, "mat-pseudo-checkbox", 3);
        \u0275\u0275conditionalCreate(6, MatOption_Conditional_6_Template, 2, 1, "span", 4);
        \u0275\u0275element(7, "div", 5);
      }
      if (rf & 2) {
        \u0275\u0275conditional(ctx.multiple ? 0 : -1);
        \u0275\u0275advance(5);
        \u0275\u0275conditional(!ctx.multiple && ctx.selected && !ctx.hideSingleSelectionIndicator ? 5 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.group && ctx.group._inert ? 6 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("matRippleTrigger", ctx._getHostElement())("matRippleDisabled", ctx.disabled || ctx.disableRipple);
      }
    },
    dependencies: [MatPseudoCheckbox, MatRipple],
    styles: ['.mat-mdc-option {\n  -webkit-user-select: none;\n  user-select: none;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: flex;\n  position: relative;\n  align-items: center;\n  justify-content: flex-start;\n  overflow: hidden;\n  min-height: 48px;\n  padding: 0 16px;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  color: var(--mat-option-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-option-label-text-font, var(--mat-sys-label-large-font));\n  line-height: var(--mat-option-label-text-line-height, var(--mat-sys-label-large-line-height));\n  font-size: var(--mat-option-label-text-size, var(--mat-sys-body-large-size));\n  letter-spacing: var(--mat-option-label-text-tracking, var(--mat-sys-label-large-tracking));\n  font-weight: var(--mat-option-label-text-weight, var(--mat-sys-body-large-weight));\n}\n.mat-mdc-option:hover:not(.mdc-list-item--disabled) {\n  background-color: var(--mat-option-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {\n  background-color: var(--mat-option-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));\n  outline: 0;\n}\n.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {\n  background-color: var(--mat-option-selected-state-layer-color, var(--mat-sys-secondary-container));\n}\n.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {\n  color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));\n}\n.mat-mdc-option .mat-pseudo-checkbox {\n  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));\n}\n.mat-mdc-option.mdc-list-item {\n  align-items: center;\n  background: transparent;\n}\n.mat-mdc-option.mdc-list-item--disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {\n  opacity: 0.38;\n}\n.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {\n  padding-left: 32px;\n}\n[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {\n  padding-left: 16px;\n  padding-right: 32px;\n}\n.mat-mdc-option .mat-icon,\n.mat-mdc-option .mat-pseudo-checkbox-full {\n  margin-right: 16px;\n  flex-shrink: 0;\n}\n[dir=rtl] .mat-mdc-option .mat-icon,\n[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {\n  margin-right: 0;\n  margin-left: 16px;\n}\n.mat-mdc-option .mat-pseudo-checkbox-minimal {\n  margin-left: 16px;\n  flex-shrink: 0;\n}\n[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {\n  margin-right: 16px;\n  margin-left: 0;\n}\n.mat-mdc-option .mat-mdc-option-ripple {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-option .mdc-list-item__primary-text {\n  white-space: normal;\n  font-size: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  line-height: inherit;\n  font-family: inherit;\n  text-decoration: inherit;\n  text-transform: inherit;\n  margin-right: auto;\n}\n[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {\n  margin-right: 0;\n  margin-left: auto;\n}\n@media (forced-colors: active) {\n  .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {\n    content: "";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  [dir=rtl] .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-option-multiple {\n  --mat-list-list-item-selected-container-color: var(--mat-list-list-item-container-color, transparent);\n}\n\n.mat-mdc-option-active .mat-focus-indicator::before {\n  content: "";\n}\n'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatOption, [{
    type: Component,
    args: [{
      selector: "mat-option",
      exportAs: "matOption",
      host: {
        "role": "option",
        "[class.mdc-list-item--selected]": "selected",
        "[class.mat-mdc-option-multiple]": "multiple",
        "[class.mat-mdc-option-active]": "active",
        "[class.mdc-list-item--disabled]": "disabled",
        "[id]": "id",
        "[attr.aria-selected]": "selected",
        "[attr.aria-disabled]": "disabled.toString()",
        "(click)": "_selectViaInteraction()",
        "(keydown)": "_handleKeydown($event)",
        "class": "mat-mdc-option mdc-list-item"
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatPseudoCheckbox, MatRipple],
      template: `<!-- Set aria-hidden="true" to this DOM node and other decorative nodes in this file. This might
 be contributing to issue where sometimes VoiceOver focuses on a TextNode in the a11y tree instead
 of the Option node (#23202). Most assistive technology will generally ignore non-role,
 non-text-content elements. Adding aria-hidden seems to make VoiceOver behave more consistently. -->
@if (multiple) {
    <mat-pseudo-checkbox
        class="mat-mdc-option-pseudo-checkbox"
        [disabled]="disabled"
        [state]="selected ? 'checked' : 'unchecked'"
        aria-hidden="true"></mat-pseudo-checkbox>
}

<ng-content select="mat-icon"></ng-content>

<span class="mdc-list-item__primary-text" #text><ng-content></ng-content></span>

<!-- Render checkmark at the end for single-selection. -->
@if (!multiple && selected && !hideSingleSelectionIndicator) {
    <mat-pseudo-checkbox
        class="mat-mdc-option-pseudo-checkbox"
        [disabled]="disabled"
        state="checked"
        aria-hidden="true"
        appearance="minimal"></mat-pseudo-checkbox>
}

<!-- See a11y notes inside optgroup.ts for context behind this element. -->
@if (group && group._inert) {
    <span class="cdk-visually-hidden">({{ group.label }})</span>
}

<div class="mat-mdc-option-ripple mat-focus-indicator" aria-hidden="true" mat-ripple
     [matRippleTrigger]="_getHostElement()" [matRippleDisabled]="disabled || disableRipple">
</div>
`,
      styles: ['.mat-mdc-option {\n  -webkit-user-select: none;\n  user-select: none;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: flex;\n  position: relative;\n  align-items: center;\n  justify-content: flex-start;\n  overflow: hidden;\n  min-height: 48px;\n  padding: 0 16px;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  color: var(--mat-option-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-option-label-text-font, var(--mat-sys-label-large-font));\n  line-height: var(--mat-option-label-text-line-height, var(--mat-sys-label-large-line-height));\n  font-size: var(--mat-option-label-text-size, var(--mat-sys-body-large-size));\n  letter-spacing: var(--mat-option-label-text-tracking, var(--mat-sys-label-large-tracking));\n  font-weight: var(--mat-option-label-text-weight, var(--mat-sys-body-large-weight));\n}\n.mat-mdc-option:hover:not(.mdc-list-item--disabled) {\n  background-color: var(--mat-option-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));\n}\n.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {\n  background-color: var(--mat-option-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));\n  outline: 0;\n}\n.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {\n  background-color: var(--mat-option-selected-state-layer-color, var(--mat-sys-secondary-container));\n}\n.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {\n  color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));\n}\n.mat-mdc-option .mat-pseudo-checkbox {\n  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));\n}\n.mat-mdc-option.mdc-list-item {\n  align-items: center;\n  background: transparent;\n}\n.mat-mdc-option.mdc-list-item--disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {\n  opacity: 0.38;\n}\n.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {\n  padding-left: 32px;\n}\n[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {\n  padding-left: 16px;\n  padding-right: 32px;\n}\n.mat-mdc-option .mat-icon,\n.mat-mdc-option .mat-pseudo-checkbox-full {\n  margin-right: 16px;\n  flex-shrink: 0;\n}\n[dir=rtl] .mat-mdc-option .mat-icon,\n[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {\n  margin-right: 0;\n  margin-left: 16px;\n}\n.mat-mdc-option .mat-pseudo-checkbox-minimal {\n  margin-left: 16px;\n  flex-shrink: 0;\n}\n[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {\n  margin-right: 16px;\n  margin-left: 0;\n}\n.mat-mdc-option .mat-mdc-option-ripple {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n}\n.mat-mdc-option .mdc-list-item__primary-text {\n  white-space: normal;\n  font-size: inherit;\n  font-weight: inherit;\n  letter-spacing: inherit;\n  line-height: inherit;\n  font-family: inherit;\n  text-decoration: inherit;\n  text-transform: inherit;\n  margin-right: auto;\n}\n[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {\n  margin-right: 0;\n  margin-left: auto;\n}\n@media (forced-colors: active) {\n  .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {\n    content: "";\n    position: absolute;\n    top: 50%;\n    right: 16px;\n    transform: translateY(-50%);\n    width: 10px;\n    height: 0;\n    border-bottom: solid 10px;\n    border-radius: 10px;\n  }\n  [dir=rtl] .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {\n    right: auto;\n    left: 16px;\n  }\n}\n\n.mat-mdc-option-multiple {\n  --mat-list-list-item-selected-container-color: var(--mat-list-list-item-container-color, transparent);\n}\n\n.mat-mdc-option-active .mat-focus-indicator::before {\n  content: "";\n}\n']
    }]
  }], () => [], {
    value: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    onSelectionChange: [{
      type: Output
    }],
    _text: [{
      type: ViewChild,
      args: ["text", {
        static: true
      }]
    }]
  });
})();
function _countGroupLabelsBeforeOption(optionIndex, options, optionGroups) {
  if (optionGroups.length) {
    let optionsArray = options.toArray();
    let groups = optionGroups.toArray();
    let groupCounter = 0;
    for (let i = 0; i < optionIndex + 1; i++) {
      if (optionsArray[i].group && optionsArray[i].group === groups[groupCounter]) {
        groupCounter++;
      }
    }
    return groupCounter;
  }
  return 0;
}
function _getOptionScrollPosition(optionOffset, optionHeight, currentScrollPosition, panelHeight) {
  if (optionOffset < currentScrollPosition) {
    return optionOffset;
  }
  if (optionOffset + optionHeight > currentScrollPosition + panelHeight) {
    return Math.max(0, optionOffset - panelHeight + optionHeight);
  }
  return currentScrollPosition;
}

// node_modules/@angular/material/fesm2022/form-field.mjs
var MatFormFieldModule = class _MatFormFieldModule {
  static \u0275fac = function MatFormFieldModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormFieldModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatFormFieldModule,
    imports: [ObserversModule, MatFormField, MatLabel, MatError, MatHint, MatPrefix, MatSuffix],
    exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, BidiModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [ObserversModule, MatFormField, BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldModule, [{
    type: NgModule,
    args: [{
      imports: [ObserversModule, MatFormField, MatLabel, MatError, MatHint, MatPrefix, MatSuffix],
      exports: [MatFormField, MatLabel, MatHint, MatError, MatPrefix, MatSuffix, BidiModule]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/_error-options-chunk.mjs
var ShowOnDirtyErrorStateMatcher = class _ShowOnDirtyErrorStateMatcher {
  isErrorState(control, form) {
    return !!(control && control.invalid && (control.dirty || form && form.submitted));
  }
  static \u0275fac = function ShowOnDirtyErrorStateMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ShowOnDirtyErrorStateMatcher)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ShowOnDirtyErrorStateMatcher,
    factory: _ShowOnDirtyErrorStateMatcher.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShowOnDirtyErrorStateMatcher, [{
    type: Injectable
  }], null, null);
})();
var ErrorStateMatcher = class _ErrorStateMatcher {
  isErrorState(control, form) {
    return !!(control && control.invalid && (control.touched || form && form.submitted));
  }
  static \u0275fac = function ErrorStateMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ErrorStateMatcher)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ErrorStateMatcher,
    factory: _ErrorStateMatcher.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorStateMatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/_error-state-chunk.mjs
var _ErrorStateTracker = class {
  _defaultMatcher;
  ngControl;
  _parentFormGroup;
  _parentForm;
  _stateChanges;
  errorState = false;
  matcher;
  constructor(_defaultMatcher, ngControl, _parentFormGroup, _parentForm, _stateChanges) {
    this._defaultMatcher = _defaultMatcher;
    this.ngControl = ngControl;
    this._parentFormGroup = _parentFormGroup;
    this._parentForm = _parentForm;
    this._stateChanges = _stateChanges;
  }
  updateErrorState() {
    const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    const matcher = this.matcher || this._defaultMatcher;
    const control = this.ngControl ? this.ngControl.control : null;
    const newState = matcher?.isErrorState(control, parent) ?? false;
    if (newState !== oldState) {
      this.errorState = newState;
      this._stateChanges.next();
    }
  }
};

// node_modules/@angular/material/fesm2022/_option-module-chunk.mjs
var MatOptionModule = class _MatOptionModule {
  static \u0275fac = function MatOptionModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatOptionModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatOptionModule,
    imports: [MatRippleModule, MatPseudoCheckboxModule, MatOption, MatOptgroup],
    exports: [MatOption, MatOptgroup, BidiModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatRippleModule, MatPseudoCheckboxModule, MatOption, BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatOptionModule, [{
    type: NgModule,
    args: [{
      imports: [MatRippleModule, MatPseudoCheckboxModule, MatOption, MatOptgroup],
      exports: [MatOption, MatOptgroup, BidiModule]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/select.mjs
var _c03 = ["trigger"];
var _c13 = ["panel"];
var _c23 = [[["mat-select-trigger"]], "*"];
var _c33 = ["mat-select-trigger", "*"];
function MatSelect_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.placeholder);
  }
}
function MatSelect_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0);
  }
}
function MatSelect_Conditional_5_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.triggerValue);
  }
}
function MatSelect_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 5);
    \u0275\u0275conditionalCreate(1, MatSelect_Conditional_5_Conditional_1_Template, 1, 0)(2, MatSelect_Conditional_5_Conditional_2_Template, 2, 1, "span", 11);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.customTrigger ? 1 : 2);
  }
}
function MatSelect_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12, 1);
    \u0275\u0275listener("keydown", function MatSelect_ng_template_10_Template_div_keydown_0_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0._handleKeydown($event));
    });
    \u0275\u0275projection(2, 1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275classMap(ctx_r0.panelClass);
    \u0275\u0275classProp("mat-select-panel-animations-enabled", !ctx_r0._animationsDisabled)("mat-primary", (ctx_r0._parentFormField == null ? null : ctx_r0._parentFormField.color) === "primary")("mat-accent", (ctx_r0._parentFormField == null ? null : ctx_r0._parentFormField.color) === "accent")("mat-warn", (ctx_r0._parentFormField == null ? null : ctx_r0._parentFormField.color) === "warn")("mat-undefined", !(ctx_r0._parentFormField == null ? null : ctx_r0._parentFormField.color));
    \u0275\u0275attribute("id", ctx_r0.id + "-panel")("aria-multiselectable", ctx_r0.multiple)("aria-label", ctx_r0.ariaLabel || null)("aria-labelledby", ctx_r0._getPanelAriaLabelledby());
  }
}
function getMatSelectDynamicMultipleError() {
  return Error("Cannot change `multiple` mode of select after initialization.");
}
function getMatSelectNonArrayValueError() {
  return Error("Value must be an array in multiple-selection mode.");
}
function getMatSelectNonFunctionValueError() {
  return Error("`compareWith` must be a function.");
}
var MAT_SELECT_SCROLL_STRATEGY = new InjectionToken("mat-select-scroll-strategy", {
  providedIn: "root",
  factory: () => {
    const injector = inject(Injector);
    return () => createRepositionScrollStrategy(injector);
  }
});
var MAT_SELECT_CONFIG = new InjectionToken("MAT_SELECT_CONFIG");
var MAT_SELECT_TRIGGER = new InjectionToken("MatSelectTrigger");
var MatSelectChange = class {
  source;
  value;
  constructor(source, value) {
    this.source = source;
    this.value = value;
  }
};
var MatSelect = class _MatSelect {
  _viewportRuler = inject(ViewportRuler);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _elementRef = inject(ElementRef);
  _dir = inject(Directionality, {
    optional: true
  });
  _idGenerator = inject(_IdGenerator);
  _renderer = inject(Renderer2);
  _parentFormField = inject(MAT_FORM_FIELD, {
    optional: true
  });
  ngControl = inject(NgControl, {
    self: true,
    optional: true
  });
  _liveAnnouncer = inject(LiveAnnouncer);
  _defaultOptions = inject(MAT_SELECT_CONFIG, {
    optional: true
  });
  _animationsDisabled = _animationsDisabled();
  _popoverLocation;
  _initialized = new Subject();
  _cleanupDetach;
  options;
  optionGroups;
  customTrigger;
  _positions = [{
    originX: "start",
    originY: "bottom",
    overlayX: "start",
    overlayY: "top"
  }, {
    originX: "end",
    originY: "bottom",
    overlayX: "end",
    overlayY: "top"
  }, {
    originX: "start",
    originY: "top",
    overlayX: "start",
    overlayY: "bottom",
    panelClass: "mat-mdc-select-panel-above"
  }, {
    originX: "end",
    originY: "top",
    overlayX: "end",
    overlayY: "bottom",
    panelClass: "mat-mdc-select-panel-above"
  }];
  _scrollOptionIntoView(index) {
    const option = this.options.toArray()[index];
    if (option) {
      const panel = this.panel.nativeElement;
      const labelCount = _countGroupLabelsBeforeOption(index, this.options, this.optionGroups);
      const element = option._getHostElement();
      if (index === 0 && labelCount === 1) {
        panel.scrollTop = 0;
      } else {
        panel.scrollTop = _getOptionScrollPosition(element.offsetTop, element.offsetHeight, panel.scrollTop, panel.offsetHeight);
      }
    }
  }
  _positioningSettled() {
    this._scrollOptionIntoView(this._keyManager.activeItemIndex || 0);
  }
  _getChangeEvent(value) {
    return new MatSelectChange(this, value);
  }
  _scrollStrategyFactory = inject(MAT_SELECT_SCROLL_STRATEGY);
  _panelOpen = false;
  _compareWith = (o1, o2) => o1 === o2;
  _uid = this._idGenerator.getId("mat-select-");
  _triggerAriaLabelledBy = null;
  _previousControl;
  _destroy = new Subject();
  _errorStateTracker;
  stateChanges = new Subject();
  disableAutomaticLabeling = true;
  userAriaDescribedBy;
  _selectionModel;
  _keyManager;
  _preferredOverlayOrigin;
  _overlayWidth;
  _onChange = () => {
  };
  _onTouched = () => {
  };
  _valueId = this._idGenerator.getId("mat-select-value-");
  _scrollStrategy;
  _overlayPanelClass = this._defaultOptions?.overlayPanelClass || "";
  get focused() {
    return this._focused || this._panelOpen;
  }
  _focused = false;
  controlType = "mat-select";
  trigger;
  panel;
  _overlayDir;
  panelClass;
  disabled = false;
  get disableRipple() {
    return this._disableRipple();
  }
  set disableRipple(value) {
    this._disableRipple.set(value);
  }
  _disableRipple = signal(false, ...ngDevMode ? [{
    debugName: "_disableRipple"
  }] : []);
  tabIndex = 0;
  get hideSingleSelectionIndicator() {
    return this._hideSingleSelectionIndicator;
  }
  set hideSingleSelectionIndicator(value) {
    this._hideSingleSelectionIndicator = value;
    this._syncParentProperties();
  }
  _hideSingleSelectionIndicator = this._defaultOptions?.hideSingleSelectionIndicator ?? false;
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(value) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  _placeholder;
  get required() {
    return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }
  set required(value) {
    this._required = value;
    this.stateChanges.next();
  }
  _required;
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    if (this._selectionModel && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMatSelectDynamicMultipleError();
    }
    this._multiple = value;
  }
  _multiple = false;
  disableOptionCentering = this._defaultOptions?.disableOptionCentering ?? false;
  get compareWith() {
    return this._compareWith;
  }
  set compareWith(fn) {
    if (typeof fn !== "function" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMatSelectNonFunctionValueError();
    }
    this._compareWith = fn;
    if (this._selectionModel) {
      this._initializeSelection();
    }
  }
  get value() {
    return this._value;
  }
  set value(newValue) {
    const hasAssigned = this._assignValue(newValue);
    if (hasAssigned) {
      this._onChange(newValue);
    }
  }
  _value;
  ariaLabel = "";
  ariaLabelledby;
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value) {
    this._errorStateTracker.matcher = value;
  }
  typeaheadDebounceInterval;
  sortComparator;
  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value || this._uid;
    this.stateChanges.next();
  }
  _id;
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value) {
    this._errorStateTracker.errorState = value;
  }
  panelWidth = this._defaultOptions && typeof this._defaultOptions.panelWidth !== "undefined" ? this._defaultOptions.panelWidth : "auto";
  canSelectNullableOptions = this._defaultOptions?.canSelectNullableOptions ?? false;
  optionSelectionChanges = defer(() => {
    const options = this.options;
    if (options) {
      return options.changes.pipe(startWith(options), switchMap(() => merge(...options.map((option) => option.onSelectionChange))));
    }
    return this._initialized.pipe(switchMap(() => this.optionSelectionChanges));
  });
  openedChange = new EventEmitter();
  _openedStream = this.openedChange.pipe(filter((o) => o), map(() => {
  }));
  _closedStream = this.openedChange.pipe(filter((o) => !o), map(() => {
  }));
  selectionChange = new EventEmitter();
  valueChange = new EventEmitter();
  constructor() {
    const defaultErrorStateMatcher = inject(ErrorStateMatcher);
    const parentForm = inject(NgForm, {
      optional: true
    });
    const parentFormGroup = inject(FormGroupDirective, {
      optional: true
    });
    const tabIndex = inject(new HostAttributeToken("tabindex"), {
      optional: true
    });
    const defaultPopoverConfig = inject(OVERLAY_DEFAULT_CONFIG, {
      optional: true
    });
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    if (this._defaultOptions?.typeaheadDebounceInterval != null) {
      this.typeaheadDebounceInterval = this._defaultOptions.typeaheadDebounceInterval;
    }
    this._errorStateTracker = new _ErrorStateTracker(defaultErrorStateMatcher, this.ngControl, parentFormGroup, parentForm, this.stateChanges);
    this._scrollStrategy = this._scrollStrategyFactory();
    this.tabIndex = tabIndex == null ? 0 : parseInt(tabIndex) || 0;
    this._popoverLocation = defaultPopoverConfig?.usePopover === false ? null : "inline";
    this.id = this.id;
  }
  ngOnInit() {
    this._selectionModel = new SelectionModel(this.multiple);
    this.stateChanges.next();
    this._viewportRuler.change().pipe(takeUntil(this._destroy)).subscribe(() => {
      if (this.panelOpen) {
        this._overlayWidth = this._getOverlayWidth(this._preferredOverlayOrigin);
        this._changeDetectorRef.detectChanges();
      }
    });
  }
  ngAfterContentInit() {
    this._initialized.next();
    this._initialized.complete();
    this._initKeyManager();
    this._selectionModel.changed.pipe(takeUntil(this._destroy)).subscribe((event) => {
      event.added.forEach((option) => option.select());
      event.removed.forEach((option) => option.deselect());
    });
    this.options.changes.pipe(startWith(null), takeUntil(this._destroy)).subscribe(() => {
      this._resetOptions();
      this._initializeSelection();
    });
  }
  ngDoCheck() {
    const newAriaLabelledby = this._getTriggerAriaLabelledby();
    const ngControl = this.ngControl;
    if (newAriaLabelledby !== this._triggerAriaLabelledBy) {
      const element = this._elementRef.nativeElement;
      this._triggerAriaLabelledBy = newAriaLabelledby;
      if (newAriaLabelledby) {
        element.setAttribute("aria-labelledby", newAriaLabelledby);
      } else {
        element.removeAttribute("aria-labelledby");
      }
    }
    if (ngControl) {
      if (this._previousControl !== ngControl.control) {
        if (this._previousControl !== void 0 && ngControl.disabled !== null && ngControl.disabled !== this.disabled) {
          this.disabled = ngControl.disabled;
        }
        this._previousControl = ngControl.control;
      }
      this.updateErrorState();
    }
  }
  ngOnChanges(changes) {
    if (changes["disabled"] || changes["userAriaDescribedBy"]) {
      this.stateChanges.next();
    }
    if (changes["typeaheadDebounceInterval"] && this._keyManager) {
      this._keyManager.withTypeAhead(this.typeaheadDebounceInterval);
    }
    if (changes["panelClass"] && this.panelClass instanceof Set) {
      this.panelClass = Array.from(this.panelClass);
    }
  }
  ngOnDestroy() {
    this._cleanupDetach?.();
    this._keyManager?.destroy();
    this._destroy.next();
    this._destroy.complete();
    this.stateChanges.complete();
    this._clearFromModal();
  }
  toggle() {
    this.panelOpen ? this.close() : this.open();
  }
  open() {
    if (!this._canOpen()) {
      return;
    }
    if (this._parentFormField) {
      this._preferredOverlayOrigin = this._parentFormField.getConnectedOverlayOrigin();
    }
    this._cleanupDetach?.();
    this._overlayWidth = this._getOverlayWidth(this._preferredOverlayOrigin);
    this._applyModalPanelOwnership();
    this._panelOpen = true;
    this._overlayDir.positionChange.pipe(take(1)).subscribe(() => {
      this._changeDetectorRef.detectChanges();
      this._positioningSettled();
    });
    this._overlayDir.attachOverlay();
    this._keyManager.withHorizontalOrientation(null);
    this._highlightCorrectOption();
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
    Promise.resolve().then(() => this.openedChange.emit(true));
  }
  _trackedModal = null;
  _applyModalPanelOwnership() {
    const modal = this._elementRef.nativeElement.closest('body > .cdk-overlay-container [aria-modal="true"]');
    if (!modal) {
      return;
    }
    const panelId = `${this.id}-panel`;
    if (this._trackedModal) {
      removeAriaReferencedId(this._trackedModal, "aria-owns", panelId);
    }
    addAriaReferencedId(modal, "aria-owns", panelId);
    this._trackedModal = modal;
  }
  _clearFromModal() {
    if (!this._trackedModal) {
      return;
    }
    const panelId = `${this.id}-panel`;
    removeAriaReferencedId(this._trackedModal, "aria-owns", panelId);
    this._trackedModal = null;
  }
  close() {
    if (this._panelOpen) {
      this._panelOpen = false;
      this._exitAndDetach();
      this._keyManager.withHorizontalOrientation(this._isRtl() ? "rtl" : "ltr");
      this._changeDetectorRef.markForCheck();
      this._onTouched();
      this.stateChanges.next();
      Promise.resolve().then(() => this.openedChange.emit(false));
    }
  }
  _exitAndDetach() {
    if (this._animationsDisabled || !this.panel) {
      this._detachOverlay();
      return;
    }
    this._cleanupDetach?.();
    this._cleanupDetach = () => {
      cleanupEvent();
      clearTimeout(exitFallbackTimer);
      this._cleanupDetach = void 0;
    };
    const panel = this.panel.nativeElement;
    const cleanupEvent = this._renderer.listen(panel, "animationend", (event) => {
      if (event.animationName === "_mat-select-exit") {
        this._cleanupDetach?.();
        this._detachOverlay();
      }
    });
    const exitFallbackTimer = setTimeout(() => {
      this._cleanupDetach?.();
      this._detachOverlay();
    }, 200);
    panel.classList.add("mat-select-panel-exit");
  }
  _detachOverlay() {
    this._overlayDir.detachOverlay();
    this._changeDetectorRef.markForCheck();
  }
  writeValue(value) {
    this._assignValue(value);
  }
  registerOnChange(fn) {
    this._onChange = fn;
  }
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }
  get panelOpen() {
    return this._panelOpen;
  }
  get selected() {
    return this.multiple ? this._selectionModel?.selected || [] : this._selectionModel?.selected[0];
  }
  get triggerValue() {
    if (this.empty) {
      return "";
    }
    if (this._multiple) {
      const selectedOptions = this._selectionModel.selected.map((option) => option.viewValue);
      if (this._isRtl()) {
        selectedOptions.reverse();
      }
      return selectedOptions.join(", ");
    }
    return this._selectionModel.selected[0].viewValue;
  }
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }
  _isRtl() {
    return this._dir ? this._dir.value === "rtl" : false;
  }
  _handleKeydown(event) {
    if (!this.disabled) {
      this.panelOpen ? this._handleOpenKeydown(event) : this._handleClosedKeydown(event);
    }
  }
  _handleClosedKeydown(event) {
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW;
    const isOpenKey = keyCode === ENTER || keyCode === SPACE;
    const manager = this._keyManager;
    if (!manager.isTyping() && isOpenKey && !hasModifierKey(event) || (this.multiple || event.altKey) && isArrowKey) {
      event.preventDefault();
      this.open();
    } else if (!this.multiple) {
      const previouslySelectedOption = this.selected;
      manager.onKeydown(event);
      const selectedOption = this.selected;
      if (selectedOption && previouslySelectedOption !== selectedOption) {
        this._liveAnnouncer.announce(selectedOption.viewValue, 1e4);
      }
    }
  }
  _handleOpenKeydown(event) {
    const manager = this._keyManager;
    const keyCode = event.keyCode;
    const isArrowKey = keyCode === DOWN_ARROW || keyCode === UP_ARROW;
    const isTyping = manager.isTyping();
    if (isArrowKey && event.altKey) {
      event.preventDefault();
      this.close();
    } else if (!isTyping && (keyCode === ENTER || keyCode === SPACE) && manager.activeItem && !hasModifierKey(event)) {
      event.preventDefault();
      manager.activeItem._selectViaInteraction();
    } else if (!isTyping && this._multiple && keyCode === A && event.ctrlKey) {
      event.preventDefault();
      const hasDeselectedOptions = this.options.some((opt) => !opt.disabled && !opt.selected);
      this.options.forEach((option) => {
        if (!option.disabled) {
          hasDeselectedOptions ? option.select() : option.deselect();
        }
      });
    } else {
      const previouslyFocusedIndex = manager.activeItemIndex;
      manager.onKeydown(event);
      if (this._multiple && isArrowKey && event.shiftKey && manager.activeItem && manager.activeItemIndex !== previouslyFocusedIndex) {
        manager.activeItem._selectViaInteraction();
      }
    }
  }
  _handleOverlayKeydown(event) {
    if (event.keyCode === ESCAPE && !hasModifierKey(event)) {
      event.preventDefault();
      this.close();
    }
  }
  _onFocus() {
    if (!this.disabled) {
      this._focused = true;
      this.stateChanges.next();
    }
  }
  _onBlur() {
    this._focused = false;
    this._keyManager?.cancelTypeahead();
    if (!this.disabled && !this.panelOpen) {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
      this.stateChanges.next();
    }
  }
  get empty() {
    return !this._selectionModel || this._selectionModel.isEmpty();
  }
  _initializeSelection() {
    Promise.resolve().then(() => {
      if (this.ngControl) {
        this._value = this.ngControl.value;
      }
      this._setSelectionByValue(this._value);
      this.stateChanges.next();
    });
  }
  _setSelectionByValue(value) {
    this.options.forEach((option) => option.setInactiveStyles());
    this._selectionModel.clear();
    if (this.multiple && value) {
      if (!Array.isArray(value) && (typeof ngDevMode === "undefined" || ngDevMode)) {
        throw getMatSelectNonArrayValueError();
      }
      value.forEach((currentValue) => this._selectOptionByValue(currentValue));
      this._sortValues();
    } else {
      const correspondingOption = this._selectOptionByValue(value);
      if (correspondingOption) {
        this._keyManager.updateActiveItem(correspondingOption);
      } else if (!this.panelOpen) {
        this._keyManager.updateActiveItem(-1);
      }
    }
    this._changeDetectorRef.markForCheck();
  }
  _selectOptionByValue(value) {
    const correspondingOption = this.options.find((option) => {
      if (this._selectionModel.isSelected(option)) {
        return false;
      }
      try {
        return (option.value != null || this.canSelectNullableOptions) && this._compareWith(option.value, value);
      } catch (error) {
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          console.warn(error);
        }
        return false;
      }
    });
    if (correspondingOption) {
      this._selectionModel.select(correspondingOption);
    }
    return correspondingOption;
  }
  _assignValue(newValue) {
    if (newValue !== this._value || this._multiple && Array.isArray(newValue)) {
      if (this.options) {
        this._setSelectionByValue(newValue);
      }
      this._value = newValue;
      return true;
    }
    return false;
  }
  _skipPredicate = (option) => {
    if (this.panelOpen) {
      return false;
    }
    return option.disabled;
  };
  _getOverlayWidth(preferredOrigin) {
    if (this.panelWidth === "auto") {
      const refToMeasure = preferredOrigin instanceof CdkOverlayOrigin ? preferredOrigin.elementRef : preferredOrigin || this._elementRef;
      return refToMeasure.nativeElement.getBoundingClientRect().width;
    }
    return this.panelWidth === null ? "" : this.panelWidth;
  }
  _syncParentProperties() {
    if (this.options) {
      for (const option of this.options) {
        option._changeDetectorRef.markForCheck();
      }
    }
  }
  _initKeyManager() {
    this._keyManager = new ActiveDescendantKeyManager(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl() ? "rtl" : "ltr").withHomeAndEnd().withPageUpDown().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._skipPredicate);
    this._keyManager.tabOut.subscribe(() => {
      if (this.panelOpen) {
        if (!this.multiple && this._keyManager.activeItem) {
          this._keyManager.activeItem._selectViaInteraction();
        }
        this.focus();
        this.close();
      }
    });
    this._keyManager.change.subscribe(() => {
      if (this._panelOpen && this.panel) {
        this._scrollOptionIntoView(this._keyManager.activeItemIndex || 0);
      } else if (!this._panelOpen && !this.multiple && this._keyManager.activeItem) {
        this._keyManager.activeItem._selectViaInteraction();
      }
    });
  }
  _resetOptions() {
    const changedOrDestroyed = merge(this.options.changes, this._destroy);
    this.optionSelectionChanges.pipe(takeUntil(changedOrDestroyed)).subscribe((event) => {
      this._onSelect(event.source, event.isUserInput);
      if (event.isUserInput && !this.multiple && this._panelOpen) {
        this.close();
        this.focus();
      }
    });
    merge(...this.options.map((option) => option._stateChanges)).pipe(takeUntil(changedOrDestroyed)).subscribe(() => {
      this._changeDetectorRef.detectChanges();
      this.stateChanges.next();
    });
  }
  _onSelect(option, isUserInput) {
    const wasSelected = this._selectionModel.isSelected(option);
    if (!this.canSelectNullableOptions && option.value == null && !this._multiple) {
      option.deselect();
      this._selectionModel.clear();
      if (this.value != null) {
        this._propagateChanges(option.value);
      }
    } else {
      if (wasSelected !== option.selected) {
        option.selected ? this._selectionModel.select(option) : this._selectionModel.deselect(option);
      }
      if (isUserInput) {
        this._keyManager.setActiveItem(option);
      }
      if (this.multiple) {
        this._sortValues();
        if (isUserInput) {
          this.focus();
        }
      }
    }
    if (wasSelected !== this._selectionModel.isSelected(option)) {
      this._propagateChanges();
    }
    this.stateChanges.next();
  }
  _sortValues() {
    if (this.multiple) {
      const options = this.options.toArray();
      this._selectionModel.sort((a, b) => {
        return this.sortComparator ? this.sortComparator(a, b, options) : options.indexOf(a) - options.indexOf(b);
      });
      this.stateChanges.next();
    }
  }
  _propagateChanges(fallbackValue) {
    let valueToEmit;
    if (this.multiple) {
      valueToEmit = this.selected.map((option) => option.value);
    } else {
      valueToEmit = this.selected ? this.selected.value : fallbackValue;
    }
    this._value = valueToEmit;
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit);
    this.selectionChange.emit(this._getChangeEvent(valueToEmit));
    this._changeDetectorRef.markForCheck();
  }
  _highlightCorrectOption() {
    if (this._keyManager) {
      if (this.empty) {
        let firstEnabledOptionIndex = -1;
        for (let index = 0; index < this.options.length; index++) {
          const option = this.options.get(index);
          if (!option.disabled) {
            firstEnabledOptionIndex = index;
            break;
          }
        }
        this._keyManager.setActiveItem(firstEnabledOptionIndex);
      } else {
        this._keyManager.setActiveItem(this._selectionModel.selected[0]);
      }
    }
  }
  _canOpen() {
    return !this._panelOpen && !this.disabled && this.options?.length > 0 && !!this._overlayDir;
  }
  focus(options) {
    this._elementRef.nativeElement.focus(options);
  }
  _getPanelAriaLabelledby() {
    if (this.ariaLabel) {
      return null;
    }
    const labelId = this._parentFormField?.getLabelId() || null;
    const labelExpression = labelId ? labelId + " " : "";
    return this.ariaLabelledby ? labelExpression + this.ariaLabelledby : labelId;
  }
  _getAriaActiveDescendant() {
    if (this.panelOpen && this._keyManager && this._keyManager.activeItem) {
      return this._keyManager.activeItem.id;
    }
    return null;
  }
  _getTriggerAriaLabelledby() {
    if (this.ariaLabel) {
      return null;
    }
    let value = this._parentFormField?.getLabelId() || "";
    if (this.ariaLabelledby) {
      value += " " + this.ariaLabelledby;
    }
    if (!value) {
      value = this._valueId;
    }
    return value;
  }
  get describedByIds() {
    const element = this._elementRef.nativeElement;
    const existingDescribedBy = element.getAttribute("aria-describedby");
    return existingDescribedBy?.split(" ") || [];
  }
  setDescribedByIds(ids) {
    const element = this._elementRef.nativeElement;
    if (ids.length) {
      element.setAttribute("aria-describedby", ids.join(" "));
    } else {
      element.removeAttribute("aria-describedby");
    }
  }
  onContainerClick(event) {
    const target = _getEventTarget(event);
    if (target && (target.tagName === "MAT-OPTION" || target.classList.contains("cdk-overlay-backdrop") || target.closest(".mat-mdc-select-panel"))) {
      return;
    }
    this.focus();
    this.open();
  }
  get shouldLabelFloat() {
    return this.panelOpen || !this.empty || this.focused && !!this.placeholder;
  }
  static \u0275fac = function MatSelect_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSelect)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatSelect,
    selectors: [["mat-select"]],
    contentQueries: function MatSelect_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, MAT_SELECT_TRIGGER, 5)(dirIndex, MatOption, 5)(dirIndex, MAT_OPTGROUP, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.customTrigger = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.options = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.optionGroups = _t);
      }
    },
    viewQuery: function MatSelect_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c03, 5)(_c13, 5)(CdkConnectedOverlay, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.trigger = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.panel = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._overlayDir = _t.first);
      }
    },
    hostAttrs: ["role", "combobox", "aria-haspopup", "listbox", 1, "mat-mdc-select"],
    hostVars: 21,
    hostBindings: function MatSelect_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("keydown", function MatSelect_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        })("focus", function MatSelect_focus_HostBindingHandler() {
          return ctx._onFocus();
        })("blur", function MatSelect_blur_HostBindingHandler() {
          return ctx._onBlur();
        });
      }
      if (rf & 2) {
        \u0275\u0275attribute("id", ctx.id)("tabindex", ctx.disabled ? -1 : ctx.tabIndex)("aria-controls", ctx.panelOpen ? ctx.id + "-panel" : null)("aria-expanded", ctx.panelOpen)("aria-label", ctx.ariaLabel || null)("aria-required", ctx.required.toString())("aria-disabled", ctx.disabled.toString())("aria-invalid", ctx.errorState)("aria-activedescendant", ctx._getAriaActiveDescendant());
        \u0275\u0275classProp("mat-mdc-select-disabled", ctx.disabled)("mat-mdc-select-invalid", ctx.errorState)("mat-mdc-select-required", ctx.required)("mat-mdc-select-empty", ctx.empty)("mat-mdc-select-multiple", ctx.multiple)("mat-select-open", ctx.panelOpen);
      }
    },
    inputs: {
      userAriaDescribedBy: [0, "aria-describedby", "userAriaDescribedBy"],
      panelClass: "panelClass",
      disabled: [2, "disabled", "disabled", booleanAttribute],
      disableRipple: [2, "disableRipple", "disableRipple", booleanAttribute],
      tabIndex: [2, "tabIndex", "tabIndex", (value) => value == null ? 0 : numberAttribute(value)],
      hideSingleSelectionIndicator: [2, "hideSingleSelectionIndicator", "hideSingleSelectionIndicator", booleanAttribute],
      placeholder: "placeholder",
      required: [2, "required", "required", booleanAttribute],
      multiple: [2, "multiple", "multiple", booleanAttribute],
      disableOptionCentering: [2, "disableOptionCentering", "disableOptionCentering", booleanAttribute],
      compareWith: "compareWith",
      value: "value",
      ariaLabel: [0, "aria-label", "ariaLabel"],
      ariaLabelledby: [0, "aria-labelledby", "ariaLabelledby"],
      errorStateMatcher: "errorStateMatcher",
      typeaheadDebounceInterval: [2, "typeaheadDebounceInterval", "typeaheadDebounceInterval", numberAttribute],
      sortComparator: "sortComparator",
      id: "id",
      panelWidth: "panelWidth",
      canSelectNullableOptions: [2, "canSelectNullableOptions", "canSelectNullableOptions", booleanAttribute]
    },
    outputs: {
      openedChange: "openedChange",
      _openedStream: "opened",
      _closedStream: "closed",
      selectionChange: "selectionChange",
      valueChange: "valueChange"
    },
    exportAs: ["matSelect"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MatFormFieldControl,
      useExisting: _MatSelect
    }, {
      provide: MAT_OPTION_PARENT_COMPONENT,
      useExisting: _MatSelect
    }]), \u0275\u0275NgOnChangesFeature],
    ngContentSelectors: _c33,
    decls: 11,
    vars: 10,
    consts: [["fallbackOverlayOrigin", "cdkOverlayOrigin", "trigger", ""], ["panel", ""], ["cdk-overlay-origin", "", 1, "mat-mdc-select-trigger", 3, "click"], [1, "mat-mdc-select-value"], [1, "mat-mdc-select-placeholder", "mat-mdc-select-min-line"], [1, "mat-mdc-select-value-text"], [1, "mat-mdc-select-arrow-wrapper"], [1, "mat-mdc-select-arrow"], ["viewBox", "0 0 24 24", "width", "24px", "height", "24px", "focusable", "false", "aria-hidden", "true"], ["d", "M7 10l5 5 5-5z"], ["cdk-connected-overlay", "", "cdkConnectedOverlayHasBackdrop", "", "cdkConnectedOverlayBackdropClass", "cdk-overlay-transparent-backdrop", 3, "detach", "backdropClick", "overlayKeydown", "cdkConnectedOverlayDisableClose", "cdkConnectedOverlayPanelClass", "cdkConnectedOverlayScrollStrategy", "cdkConnectedOverlayOrigin", "cdkConnectedOverlayPositions", "cdkConnectedOverlayWidth", "cdkConnectedOverlayFlexibleDimensions", "cdkConnectedOverlayUsePopover"], [1, "mat-mdc-select-min-line"], ["role", "listbox", "tabindex", "-1", 1, "mat-mdc-select-panel", "mdc-menu-surface", "mdc-menu-surface--open", 3, "keydown"]],
    template: function MatSelect_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c23);
        \u0275\u0275elementStart(0, "div", 2, 0);
        \u0275\u0275listener("click", function MatSelect_Template_div_click_0_listener() {
          return ctx.open();
        });
        \u0275\u0275elementStart(3, "div", 3);
        \u0275\u0275conditionalCreate(4, MatSelect_Conditional_4_Template, 2, 1, "span", 4)(5, MatSelect_Conditional_5_Template, 3, 1, "span", 5);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "div", 6)(7, "div", 7);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(8, "svg", 8);
        \u0275\u0275element(9, "path", 9);
        \u0275\u0275elementEnd()()()();
        \u0275\u0275template(10, MatSelect_ng_template_10_Template, 3, 16, "ng-template", 10);
        \u0275\u0275listener("detach", function MatSelect_Template_ng_template_detach_10_listener() {
          return ctx.close();
        })("backdropClick", function MatSelect_Template_ng_template_backdropClick_10_listener() {
          return ctx.close();
        })("overlayKeydown", function MatSelect_Template_ng_template_overlayKeydown_10_listener($event) {
          return ctx._handleOverlayKeydown($event);
        });
      }
      if (rf & 2) {
        const fallbackOverlayOrigin_r3 = \u0275\u0275reference(1);
        \u0275\u0275advance(3);
        \u0275\u0275attribute("id", ctx._valueId);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.empty ? 4 : 5);
        \u0275\u0275advance(6);
        \u0275\u0275property("cdkConnectedOverlayDisableClose", true)("cdkConnectedOverlayPanelClass", ctx._overlayPanelClass)("cdkConnectedOverlayScrollStrategy", ctx._scrollStrategy)("cdkConnectedOverlayOrigin", ctx._preferredOverlayOrigin || fallbackOverlayOrigin_r3)("cdkConnectedOverlayPositions", ctx._positions)("cdkConnectedOverlayWidth", ctx._overlayWidth)("cdkConnectedOverlayFlexibleDimensions", true)("cdkConnectedOverlayUsePopover", ctx._popoverLocation);
      }
    },
    dependencies: [CdkOverlayOrigin, CdkConnectedOverlay],
    styles: ['@keyframes _mat-select-enter {\n  from {\n    opacity: 0;\n    transform: scaleY(0.8);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n@keyframes _mat-select-exit {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n.mat-mdc-select {\n  display: inline-block;\n  width: 100%;\n  outline: none;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  color: var(--mat-select-enabled-trigger-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-select-trigger-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-select-trigger-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-select-trigger-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-select-trigger-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-select-trigger-text-tracking, var(--mat-sys-body-large-tracking));\n}\n\ndiv.mat-mdc-select-panel {\n  box-shadow: var(--mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));\n}\n\n.mat-mdc-select-disabled {\n  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-select-disabled .mat-mdc-select-placeholder {\n  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n\n.mat-mdc-select-trigger {\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n  position: relative;\n  box-sizing: border-box;\n  width: 100%;\n}\n.mat-mdc-select-disabled .mat-mdc-select-trigger {\n  -webkit-user-select: none;\n  user-select: none;\n  cursor: default;\n}\n\n.mat-mdc-select-value {\n  width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.mat-mdc-select-value-text {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.mat-mdc-select-arrow-wrapper {\n  height: 24px;\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: center;\n}\n.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {\n  transform: none;\n}\n\n.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,\n.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {\n  color: var(--mat-select-invalid-arrow-color, var(--mat-sys-error));\n}\n\n.mat-mdc-select-arrow {\n  width: 10px;\n  height: 5px;\n  position: relative;\n  color: var(--mat-select-enabled-arrow-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {\n  color: var(--mat-select-focused-arrow-color, var(--mat-sys-primary));\n}\n.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {\n  color: var(--mat-select-disabled-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-select-open .mat-mdc-select-arrow {\n  transform: rotate(180deg);\n}\n.mat-form-field-animations-enabled .mat-mdc-select-arrow {\n  transition: transform 80ms linear;\n}\n.mat-mdc-select-arrow svg {\n  fill: currentColor;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n@media (forced-colors: active) {\n  .mat-mdc-select-arrow svg {\n    fill: CanvasText;\n  }\n  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {\n    fill: GrayText;\n  }\n}\n\ndiv.mat-mdc-select-panel {\n  width: 100%;\n  max-height: 275px;\n  outline: 0;\n  overflow: auto;\n  padding: 8px 0;\n  box-sizing: border-box;\n  transform-origin: top center;\n  border-radius: 0 0 4px 4px;\n  position: relative;\n  background-color: var(--mat-select-panel-background-color, var(--mat-sys-surface-container));\n}\n.mat-mdc-select-panel-above div.mat-mdc-select-panel {\n  border-radius: 4px 4px 0 0;\n  transform-origin: bottom center;\n}\n@media (forced-colors: active) {\n  div.mat-mdc-select-panel {\n    outline: solid 1px;\n  }\n}\n\n.mat-select-panel-animations-enabled {\n  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-select-panel-animations-enabled.mat-select-panel-exit {\n  animation: _mat-select-exit 100ms linear;\n}\n\n.mat-mdc-select-placeholder {\n  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  color: var(--mat-select-placeholder-text-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {\n  transition: none;\n}\n.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {\n  color: transparent;\n  -webkit-text-fill-color: transparent;\n  transition: none;\n  display: block;\n}\n\n.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {\n  cursor: pointer;\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {\n  max-width: calc(100% - 18px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {\n  max-width: calc(100% / 0.75 - 24px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {\n  max-width: calc(100% - 60px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {\n  max-width: calc(100% - 24px);\n}\n\n.mat-mdc-select-min-line:empty::before {\n  content: " ";\n  white-space: pre;\n  width: 1px;\n  display: inline-block;\n  visibility: hidden;\n}\n\n.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {\n  transform: var(--mat-select-arrow-transform, translateY(-8px));\n}\n'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSelect, [{
    type: Component,
    args: [{
      selector: "mat-select",
      exportAs: "matSelect",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "role": "combobox",
        "aria-haspopup": "listbox",
        "class": "mat-mdc-select",
        "[attr.id]": "id",
        "[attr.tabindex]": "disabled ? -1 : tabIndex",
        "[attr.aria-controls]": 'panelOpen ? id + "-panel" : null',
        "[attr.aria-expanded]": "panelOpen",
        "[attr.aria-label]": "ariaLabel || null",
        "[attr.aria-required]": "required.toString()",
        "[attr.aria-disabled]": "disabled.toString()",
        "[attr.aria-invalid]": "errorState",
        "[attr.aria-activedescendant]": "_getAriaActiveDescendant()",
        "[class.mat-mdc-select-disabled]": "disabled",
        "[class.mat-mdc-select-invalid]": "errorState",
        "[class.mat-mdc-select-required]": "required",
        "[class.mat-mdc-select-empty]": "empty",
        "[class.mat-mdc-select-multiple]": "multiple",
        "[class.mat-select-open]": "panelOpen",
        "(keydown)": "_handleKeydown($event)",
        "(focus)": "_onFocus()",
        "(blur)": "_onBlur()"
      },
      providers: [{
        provide: MatFormFieldControl,
        useExisting: MatSelect
      }, {
        provide: MAT_OPTION_PARENT_COMPONENT,
        useExisting: MatSelect
      }],
      imports: [CdkOverlayOrigin, CdkConnectedOverlay],
      template: `<div
  cdk-overlay-origin
  class="mat-mdc-select-trigger"
  (click)="open()"
  #fallbackOverlayOrigin="cdkOverlayOrigin"
  #trigger
>
  <div class="mat-mdc-select-value" [attr.id]="_valueId">
    @if (empty) {
      <span class="mat-mdc-select-placeholder mat-mdc-select-min-line">{{placeholder}}</span>
    } @else {
      <span class="mat-mdc-select-value-text">
        @if (customTrigger) {
          <ng-content select="mat-select-trigger"></ng-content>
        } @else {
          <span class="mat-mdc-select-min-line">{{triggerValue}}</span>
        }
      </span>
    }
  </div>

  <div class="mat-mdc-select-arrow-wrapper">
    <div class="mat-mdc-select-arrow">
      <!-- Use an inline SVG, because it works better than a CSS triangle in high contrast mode. -->
      <svg viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true">
        <path d="M7 10l5 5 5-5z" />
      </svg>
    </div>
  </div>
</div>

<ng-template
  cdk-connected-overlay
  cdkConnectedOverlayHasBackdrop
  cdkConnectedOverlayBackdropClass="cdk-overlay-transparent-backdrop"
  [cdkConnectedOverlayDisableClose]="true"
  [cdkConnectedOverlayPanelClass]="_overlayPanelClass"
  [cdkConnectedOverlayScrollStrategy]="_scrollStrategy"
  [cdkConnectedOverlayOrigin]="_preferredOverlayOrigin || fallbackOverlayOrigin"
  [cdkConnectedOverlayPositions]="_positions"
  [cdkConnectedOverlayWidth]="_overlayWidth"
  [cdkConnectedOverlayFlexibleDimensions]="true"
  [cdkConnectedOverlayUsePopover]="_popoverLocation"
  (detach)="close()"
  (backdropClick)="close()"
  (overlayKeydown)="_handleOverlayKeydown($event)">
  <!-- \`mat-undefined\` is weird, but we were using it internally -->
  <div
    #panel
    role="listbox"
    tabindex="-1"
    class="mat-mdc-select-panel mdc-menu-surface mdc-menu-surface--open"
    [class]="panelClass"
    [class.mat-select-panel-animations-enabled]="!_animationsDisabled"
    [class.mat-primary]="_parentFormField?.color === 'primary'"
    [class.mat-accent]="_parentFormField?.color === 'accent'"
    [class.mat-warn]="_parentFormField?.color === 'warn'"
    [class.mat-undefined]="!_parentFormField?.color"
    [attr.id]="id + '-panel'"
    [attr.aria-multiselectable]="multiple"
    [attr.aria-label]="ariaLabel || null"
    [attr.aria-labelledby]="_getPanelAriaLabelledby()"
    (keydown)="_handleKeydown($event)">
    <ng-content></ng-content>
  </div>
</ng-template>
`,
      styles: ['@keyframes _mat-select-enter {\n  from {\n    opacity: 0;\n    transform: scaleY(0.8);\n  }\n  to {\n    opacity: 1;\n    transform: none;\n  }\n}\n@keyframes _mat-select-exit {\n  from {\n    opacity: 1;\n  }\n  to {\n    opacity: 0;\n  }\n}\n.mat-mdc-select {\n  display: inline-block;\n  width: 100%;\n  outline: none;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  color: var(--mat-select-enabled-trigger-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-select-trigger-text-font, var(--mat-sys-body-large-font));\n  line-height: var(--mat-select-trigger-text-line-height, var(--mat-sys-body-large-line-height));\n  font-size: var(--mat-select-trigger-text-size, var(--mat-sys-body-large-size));\n  font-weight: var(--mat-select-trigger-text-weight, var(--mat-sys-body-large-weight));\n  letter-spacing: var(--mat-select-trigger-text-tracking, var(--mat-sys-body-large-tracking));\n}\n\ndiv.mat-mdc-select-panel {\n  box-shadow: var(--mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));\n}\n\n.mat-mdc-select-disabled {\n  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-select-disabled .mat-mdc-select-placeholder {\n  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n\n.mat-mdc-select-trigger {\n  display: inline-flex;\n  align-items: center;\n  cursor: pointer;\n  position: relative;\n  box-sizing: border-box;\n  width: 100%;\n}\n.mat-mdc-select-disabled .mat-mdc-select-trigger {\n  -webkit-user-select: none;\n  user-select: none;\n  cursor: default;\n}\n\n.mat-mdc-select-value {\n  width: 100%;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.mat-mdc-select-value-text {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.mat-mdc-select-arrow-wrapper {\n  height: 24px;\n  flex-shrink: 0;\n  display: inline-flex;\n  align-items: center;\n}\n.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {\n  transform: none;\n}\n\n.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,\n.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {\n  color: var(--mat-select-invalid-arrow-color, var(--mat-sys-error));\n}\n\n.mat-mdc-select-arrow {\n  width: 10px;\n  height: 5px;\n  position: relative;\n  color: var(--mat-select-enabled-arrow-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {\n  color: var(--mat-select-focused-arrow-color, var(--mat-sys-primary));\n}\n.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {\n  color: var(--mat-select-disabled-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-select-open .mat-mdc-select-arrow {\n  transform: rotate(180deg);\n}\n.mat-form-field-animations-enabled .mat-mdc-select-arrow {\n  transition: transform 80ms linear;\n}\n.mat-mdc-select-arrow svg {\n  fill: currentColor;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n@media (forced-colors: active) {\n  .mat-mdc-select-arrow svg {\n    fill: CanvasText;\n  }\n  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {\n    fill: GrayText;\n  }\n}\n\ndiv.mat-mdc-select-panel {\n  width: 100%;\n  max-height: 275px;\n  outline: 0;\n  overflow: auto;\n  padding: 8px 0;\n  box-sizing: border-box;\n  transform-origin: top center;\n  border-radius: 0 0 4px 4px;\n  position: relative;\n  background-color: var(--mat-select-panel-background-color, var(--mat-sys-surface-container));\n}\n.mat-mdc-select-panel-above div.mat-mdc-select-panel {\n  border-radius: 4px 4px 0 0;\n  transform-origin: bottom center;\n}\n@media (forced-colors: active) {\n  div.mat-mdc-select-panel {\n    outline: solid 1px;\n  }\n}\n\n.mat-select-panel-animations-enabled {\n  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-select-panel-animations-enabled.mat-select-panel-exit {\n  animation: _mat-select-exit 100ms linear;\n}\n\n.mat-mdc-select-placeholder {\n  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);\n  color: var(--mat-select-placeholder-text-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {\n  transition: none;\n}\n.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {\n  color: transparent;\n  -webkit-text-fill-color: transparent;\n  transition: none;\n  display: block;\n}\n\n.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {\n  cursor: pointer;\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {\n  max-width: calc(100% - 18px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {\n  max-width: calc(100% / 0.75 - 24px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {\n  max-width: calc(100% - 60px);\n}\n.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {\n  max-width: calc(100% - 24px);\n}\n\n.mat-mdc-select-min-line:empty::before {\n  content: " ";\n  white-space: pre;\n  width: 1px;\n  display: inline-block;\n  visibility: hidden;\n}\n\n.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {\n  transform: var(--mat-select-arrow-transform, translateY(-8px));\n}\n']
    }]
  }], () => [], {
    options: [{
      type: ContentChildren,
      args: [MatOption, {
        descendants: true
      }]
    }],
    optionGroups: [{
      type: ContentChildren,
      args: [MAT_OPTGROUP, {
        descendants: true
      }]
    }],
    customTrigger: [{
      type: ContentChild,
      args: [MAT_SELECT_TRIGGER]
    }],
    userAriaDescribedBy: [{
      type: Input,
      args: ["aria-describedby"]
    }],
    trigger: [{
      type: ViewChild,
      args: ["trigger"]
    }],
    panel: [{
      type: ViewChild,
      args: ["panel"]
    }],
    _overlayDir: [{
      type: ViewChild,
      args: [CdkConnectedOverlay]
    }],
    panelClass: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disableRipple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    tabIndex: [{
      type: Input,
      args: [{
        transform: (value) => value == null ? 0 : numberAttribute(value)
      }]
    }],
    hideSingleSelectionIndicator: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    placeholder: [{
      type: Input
    }],
    required: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    multiple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disableOptionCentering: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    compareWith: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input,
      args: ["aria-label"]
    }],
    ariaLabelledby: [{
      type: Input,
      args: ["aria-labelledby"]
    }],
    errorStateMatcher: [{
      type: Input
    }],
    typeaheadDebounceInterval: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    sortComparator: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    panelWidth: [{
      type: Input
    }],
    canSelectNullableOptions: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    openedChange: [{
      type: Output
    }],
    _openedStream: [{
      type: Output,
      args: ["opened"]
    }],
    _closedStream: [{
      type: Output,
      args: ["closed"]
    }],
    selectionChange: [{
      type: Output
    }],
    valueChange: [{
      type: Output
    }]
  });
})();
var MatSelectTrigger = class _MatSelectTrigger {
  static \u0275fac = function MatSelectTrigger_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSelectTrigger)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatSelectTrigger,
    selectors: [["mat-select-trigger"]],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_SELECT_TRIGGER,
      useExisting: _MatSelectTrigger
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSelectTrigger, [{
    type: Directive,
    args: [{
      selector: "mat-select-trigger",
      providers: [{
        provide: MAT_SELECT_TRIGGER,
        useExisting: MatSelectTrigger
      }]
    }]
  }], null, null);
})();
var MatSelectModule = class _MatSelectModule {
  static \u0275fac = function MatSelectModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSelectModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatSelectModule,
    imports: [OverlayModule, MatOptionModule, MatSelect, MatSelectTrigger],
    exports: [BidiModule, CdkScrollableModule, MatFormFieldModule, MatSelect, MatSelectTrigger, MatOptionModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [OverlayModule, MatOptionModule, BidiModule, CdkScrollableModule, MatFormFieldModule, MatOptionModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSelectModule, [{
    type: NgModule,
    args: [{
      imports: [OverlayModule, MatOptionModule, MatSelect, MatSelectTrigger],
      exports: [BidiModule, CdkScrollableModule, MatFormFieldModule, MatSelect, MatSelectTrigger, MatOptionModule]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/paginator.mjs
function MatPaginator_Conditional_2_Conditional_3_For_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 17);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const pageSizeOption_r3 = ctx.$implicit;
    \u0275\u0275property("value", pageSizeOption_r3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", pageSizeOption_r3, " ");
  }
}
function MatPaginator_Conditional_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", 14)(1, "mat-select", 16, 0);
    \u0275\u0275listener("selectionChange", function MatPaginator_Conditional_2_Conditional_3_Template_mat_select_selectionChange_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1._changePageSize($event.value));
    });
    \u0275\u0275repeaterCreate(3, MatPaginator_Conditional_2_Conditional_3_For_4_Template, 2, 2, "mat-option", 17, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 18);
    \u0275\u0275listener("click", function MatPaginator_Conditional_2_Conditional_3_Template_div_click_5_listener() {
      \u0275\u0275restoreView(_r1);
      const selectRef_r4 = \u0275\u0275reference(2);
      return \u0275\u0275resetView(selectRef_r4.open());
    });
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("appearance", ctx_r1._formFieldAppearance)("color", ctx_r1.color);
    \u0275\u0275advance();
    \u0275\u0275property("value", ctx_r1.pageSize)("disabled", ctx_r1.disabled);
    \u0275\u0275ariaProperty("aria-labelledby", ctx_r1._pageSizeLabelId);
    \u0275\u0275property("panelClass", ctx_r1.selectConfig.panelClass || "")("disableOptionCentering", ctx_r1.selectConfig.disableOptionCentering);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1._displayedPageSizeOptions);
  }
}
function MatPaginator_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.pageSize);
  }
}
function MatPaginator_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3)(1, "div", 13);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, MatPaginator_Conditional_2_Conditional_3_Template, 6, 7, "mat-form-field", 14);
    \u0275\u0275conditionalCreate(4, MatPaginator_Conditional_2_Conditional_4_Template, 2, 1, "div", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275attribute("id", ctx_r1._pageSizeLabelId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1._intl.itemsPerPageLabel, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1._displayedPageSizeOptions.length > 1 ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1._displayedPageSizeOptions.length <= 1 ? 4 : -1);
  }
}
function MatPaginator_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 19);
    \u0275\u0275listener("click", function MatPaginator_Conditional_6_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1._buttonClicked(0, ctx_r1._previousButtonsDisabled()));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 8);
    \u0275\u0275element(2, "path", 20);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("matTooltip", ctx_r1._intl.firstPageLabel)("matTooltipDisabled", ctx_r1._previousButtonsDisabled())("disabled", ctx_r1._previousButtonsDisabled())("tabindex", ctx_r1._previousButtonsDisabled() ? -1 : null);
    \u0275\u0275attribute("aria-label", ctx_r1._intl.firstPageLabel);
  }
}
function MatPaginator_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 21);
    \u0275\u0275listener("click", function MatPaginator_Conditional_13_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1._buttonClicked(ctx_r1.getNumberOfPages() - 1, ctx_r1._nextButtonsDisabled()));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 8);
    \u0275\u0275element(2, "path", 22);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("matTooltip", ctx_r1._intl.lastPageLabel)("matTooltipDisabled", ctx_r1._nextButtonsDisabled())("disabled", ctx_r1._nextButtonsDisabled())("tabindex", ctx_r1._nextButtonsDisabled() ? -1 : null);
    \u0275\u0275attribute("aria-label", ctx_r1._intl.lastPageLabel);
  }
}
var MatPaginatorIntl = class _MatPaginatorIntl {
  changes = new Subject();
  itemsPerPageLabel = "Items per page:";
  nextPageLabel = "Next page";
  previousPageLabel = "Previous page";
  firstPageLabel = "First page";
  lastPageLabel = "Last page";
  getRangeLabel = (page, pageSize, length) => {
    if (length == 0 || pageSize == 0) {
      return `0 of ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} \u2013 ${endIndex} of ${length}`;
  };
  static \u0275fac = function MatPaginatorIntl_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatPaginatorIntl)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _MatPaginatorIntl,
    factory: _MatPaginatorIntl.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatPaginatorIntl, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var DEFAULT_PAGE_SIZE = 50;
var MAT_PAGINATOR_DEFAULT_OPTIONS = new InjectionToken("MAT_PAGINATOR_DEFAULT_OPTIONS");
var MatPaginator = class _MatPaginator {
  _intl = inject(MatPaginatorIntl);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _formFieldAppearance;
  _pageSizeLabelId = inject(_IdGenerator).getId("mat-paginator-page-size-label-");
  _intlChanges;
  _isInitialized = false;
  _initializedStream = new ReplaySubject(1);
  color;
  get pageIndex() {
    return this._pageIndex;
  }
  set pageIndex(value) {
    this._pageIndex = Math.max(value || 0, 0);
    this._changeDetectorRef.markForCheck();
  }
  _pageIndex = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value || 0;
    this._changeDetectorRef.markForCheck();
  }
  _length = 0;
  get pageSize() {
    return this._pageSize;
  }
  set pageSize(value) {
    this._pageSize = Math.max(value || 0, 0);
    this._updateDisplayedPageSizeOptions();
  }
  _pageSize;
  get pageSizeOptions() {
    return this._pageSizeOptions;
  }
  set pageSizeOptions(value) {
    this._pageSizeOptions = (value || []).map((p) => numberAttribute(p, 0));
    this._updateDisplayedPageSizeOptions();
  }
  _pageSizeOptions = [];
  hidePageSize = false;
  showFirstLastButtons = false;
  selectConfig = {};
  disabled = false;
  page = new EventEmitter();
  _displayedPageSizeOptions;
  initialized = this._initializedStream;
  constructor() {
    const _intl = this._intl;
    const defaults = inject(MAT_PAGINATOR_DEFAULT_OPTIONS, {
      optional: true
    });
    this._intlChanges = _intl.changes.subscribe(() => this._changeDetectorRef.markForCheck());
    if (defaults) {
      const {
        pageSize,
        pageSizeOptions: pageSizeOptions2,
        hidePageSize,
        showFirstLastButtons
      } = defaults;
      if (pageSize != null) {
        this._pageSize = pageSize;
      }
      if (pageSizeOptions2 != null) {
        this._pageSizeOptions = pageSizeOptions2;
      }
      if (hidePageSize != null) {
        this.hidePageSize = hidePageSize;
      }
      if (showFirstLastButtons != null) {
        this.showFirstLastButtons = showFirstLastButtons;
      }
    }
    this._formFieldAppearance = defaults?.formFieldAppearance || "outline";
  }
  ngOnInit() {
    this._isInitialized = true;
    this._updateDisplayedPageSizeOptions();
    this._initializedStream.next();
  }
  ngOnDestroy() {
    this._initializedStream.complete();
    this._intlChanges.unsubscribe();
  }
  nextPage() {
    if (this.hasNextPage()) {
      this._navigate(this.pageIndex + 1);
    }
  }
  previousPage() {
    if (this.hasPreviousPage()) {
      this._navigate(this.pageIndex - 1);
    }
  }
  firstPage() {
    if (this.hasPreviousPage()) {
      this._navigate(0);
    }
  }
  lastPage() {
    if (this.hasNextPage()) {
      this._navigate(this.getNumberOfPages() - 1);
    }
  }
  hasPreviousPage() {
    return this.pageIndex >= 1 && this.pageSize != 0;
  }
  hasNextPage() {
    const maxPageIndex = this.getNumberOfPages() - 1;
    return this.pageIndex < maxPageIndex && this.pageSize != 0;
  }
  getNumberOfPages() {
    if (!this.pageSize) {
      return 0;
    }
    return Math.ceil(this.length / this.pageSize);
  }
  _changePageSize(pageSize) {
    const startIndex = this.pageIndex * this.pageSize;
    const previousPageIndex = this.pageIndex;
    this.pageIndex = Math.floor(startIndex / pageSize) || 0;
    this.pageSize = pageSize;
    this._emitPageEvent(previousPageIndex);
  }
  _nextButtonsDisabled() {
    return this.disabled || !this.hasNextPage();
  }
  _previousButtonsDisabled() {
    return this.disabled || !this.hasPreviousPage();
  }
  _updateDisplayedPageSizeOptions() {
    if (!this._isInitialized) {
      return;
    }
    if (!this.pageSize) {
      this._pageSize = this.pageSizeOptions.length != 0 ? this.pageSizeOptions[0] : DEFAULT_PAGE_SIZE;
    }
    this._displayedPageSizeOptions = this.pageSizeOptions.slice();
    if (this._displayedPageSizeOptions.indexOf(this.pageSize) === -1) {
      this._displayedPageSizeOptions.push(this.pageSize);
    }
    this._displayedPageSizeOptions.sort((a, b) => a - b);
    this._changeDetectorRef.markForCheck();
  }
  _emitPageEvent(previousPageIndex) {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length
    });
  }
  _navigate(index) {
    const previousIndex = this.pageIndex;
    if (index !== previousIndex) {
      this.pageIndex = index;
      this._emitPageEvent(previousIndex);
    }
  }
  _buttonClicked(targetIndex, isDisabled) {
    if (!isDisabled) {
      this._navigate(targetIndex);
    }
  }
  static \u0275fac = function MatPaginator_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatPaginator)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatPaginator,
    selectors: [["mat-paginator"]],
    hostAttrs: ["role", "group", 1, "mat-mdc-paginator"],
    inputs: {
      color: "color",
      pageIndex: [2, "pageIndex", "pageIndex", numberAttribute],
      length: [2, "length", "length", numberAttribute],
      pageSize: [2, "pageSize", "pageSize", numberAttribute],
      pageSizeOptions: "pageSizeOptions",
      hidePageSize: [2, "hidePageSize", "hidePageSize", booleanAttribute],
      showFirstLastButtons: [2, "showFirstLastButtons", "showFirstLastButtons", booleanAttribute],
      selectConfig: "selectConfig",
      disabled: [2, "disabled", "disabled", booleanAttribute]
    },
    outputs: {
      page: "page"
    },
    exportAs: ["matPaginator"],
    decls: 14,
    vars: 14,
    consts: [["selectRef", ""], [1, "mat-mdc-paginator-outer-container"], [1, "mat-mdc-paginator-container"], [1, "mat-mdc-paginator-page-size"], [1, "mat-mdc-paginator-range-actions"], ["aria-atomic", "true", "aria-live", "polite", "role", "status", 1, "mat-mdc-paginator-range-label"], ["matIconButton", "", "type", "button", "matTooltipPosition", "above", "disabledInteractive", "", 1, "mat-mdc-paginator-navigation-first", 3, "matTooltip", "matTooltipDisabled", "disabled", "tabindex"], ["matIconButton", "", "type", "button", "matTooltipPosition", "above", "disabledInteractive", "", 1, "mat-mdc-paginator-navigation-previous", 3, "click", "matTooltip", "matTooltipDisabled", "disabled", "tabindex"], ["viewBox", "0 0 24 24", "focusable", "false", "aria-hidden", "true", 1, "mat-mdc-paginator-icon"], ["d", "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"], ["matIconButton", "", "type", "button", "matTooltipPosition", "above", "disabledInteractive", "", 1, "mat-mdc-paginator-navigation-next", 3, "click", "matTooltip", "matTooltipDisabled", "disabled", "tabindex"], ["d", "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"], ["matIconButton", "", "type", "button", "matTooltipPosition", "above", "disabledInteractive", "", 1, "mat-mdc-paginator-navigation-last", 3, "matTooltip", "matTooltipDisabled", "disabled", "tabindex"], ["aria-hidden", "true", 1, "mat-mdc-paginator-page-size-label"], [1, "mat-mdc-paginator-page-size-select", 3, "appearance", "color"], [1, "mat-mdc-paginator-page-size-value"], ["hideSingleSelectionIndicator", "", 3, "selectionChange", "value", "disabled", "aria-labelledby", "panelClass", "disableOptionCentering"], [3, "value"], [1, "mat-mdc-paginator-touch-target", 3, "click"], ["matIconButton", "", "type", "button", "matTooltipPosition", "above", "disabledInteractive", "", 1, "mat-mdc-paginator-navigation-first", 3, "click", "matTooltip", "matTooltipDisabled", "disabled", "tabindex"], ["d", "M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"], ["matIconButton", "", "type", "button", "matTooltipPosition", "above", "disabledInteractive", "", 1, "mat-mdc-paginator-navigation-last", 3, "click", "matTooltip", "matTooltipDisabled", "disabled", "tabindex"], ["d", "M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"]],
    template: function MatPaginator_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementStart(0, "div", 1)(1, "div", 2);
        \u0275\u0275conditionalCreate(2, MatPaginator_Conditional_2_Template, 5, 4, "div", 3);
        \u0275\u0275elementStart(3, "div", 4)(4, "div", 5);
        \u0275\u0275text(5);
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(6, MatPaginator_Conditional_6_Template, 3, 5, "button", 6);
        \u0275\u0275elementStart(7, "button", 7);
        \u0275\u0275listener("click", function MatPaginator_Template_button_click_7_listener() {
          return ctx._buttonClicked(ctx.pageIndex - 1, ctx._previousButtonsDisabled());
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(8, "svg", 8);
        \u0275\u0275element(9, "path", 9);
        \u0275\u0275elementEnd()();
        \u0275\u0275namespaceHTML();
        \u0275\u0275elementStart(10, "button", 10);
        \u0275\u0275listener("click", function MatPaginator_Template_button_click_10_listener() {
          return ctx._buttonClicked(ctx.pageIndex + 1, ctx._nextButtonsDisabled());
        });
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(11, "svg", 8);
        \u0275\u0275element(12, "path", 11);
        \u0275\u0275elementEnd()();
        \u0275\u0275conditionalCreate(13, MatPaginator_Conditional_13_Template, 3, 5, "button", 12);
        \u0275\u0275elementEnd()()();
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275conditional(!ctx.hidePageSize ? 2 : -1);
        \u0275\u0275advance(3);
        \u0275\u0275textInterpolate1(" ", ctx._intl.getRangeLabel(ctx.pageIndex, ctx.pageSize, ctx.length), " ");
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.showFirstLastButtons ? 6 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("matTooltip", ctx._intl.previousPageLabel)("matTooltipDisabled", ctx._previousButtonsDisabled())("disabled", ctx._previousButtonsDisabled())("tabindex", ctx._previousButtonsDisabled() ? -1 : null);
        \u0275\u0275attribute("aria-label", ctx._intl.previousPageLabel);
        \u0275\u0275advance(3);
        \u0275\u0275property("matTooltip", ctx._intl.nextPageLabel)("matTooltipDisabled", ctx._nextButtonsDisabled())("disabled", ctx._nextButtonsDisabled())("tabindex", ctx._nextButtonsDisabled() ? -1 : null);
        \u0275\u0275attribute("aria-label", ctx._intl.nextPageLabel);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(ctx.showFirstLastButtons ? 13 : -1);
      }
    },
    dependencies: [MatFormField, MatSelect, MatOption, MatIconButton, MatTooltip],
    styles: [".mat-mdc-paginator {\n  display: block;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  color: var(--mat-paginator-container-text-color, var(--mat-sys-on-surface));\n  background-color: var(--mat-paginator-container-background-color, var(--mat-sys-surface));\n  font-family: var(--mat-paginator-container-text-font, var(--mat-sys-body-small-font));\n  line-height: var(--mat-paginator-container-text-line-height, var(--mat-sys-body-small-line-height));\n  font-size: var(--mat-paginator-container-text-size, var(--mat-sys-body-small-size));\n  font-weight: var(--mat-paginator-container-text-weight, var(--mat-sys-body-small-weight));\n  letter-spacing: var(--mat-paginator-container-text-tracking, var(--mat-sys-body-small-tracking));\n  --mat-form-field-container-height: var(--mat-paginator-form-field-container-height, 40px);\n  --mat-form-field-container-vertical-padding: var(--mat-paginator-form-field-container-vertical-padding, 8px);\n}\n.mat-mdc-paginator .mat-mdc-select-value {\n  font-size: var(--mat-paginator-select-trigger-text-size, var(--mat-sys-body-small-size));\n}\n.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n.mat-mdc-paginator .mat-mdc-select {\n  line-height: 1.5;\n}\n\n.mat-mdc-paginator-outer-container {\n  display: flex;\n}\n\n.mat-mdc-paginator-container {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  padding: 0 8px;\n  flex-wrap: wrap;\n  width: 100%;\n  min-height: var(--mat-paginator-container-size, 56px);\n}\n\n.mat-mdc-paginator-page-size {\n  display: flex;\n  align-items: baseline;\n  margin-right: 8px;\n}\n[dir=rtl] .mat-mdc-paginator-page-size {\n  margin-right: 0;\n  margin-left: 8px;\n}\n\n.mat-mdc-paginator-page-size-label {\n  margin: 0 4px;\n}\n\n.mat-mdc-paginator-page-size-select {\n  margin: 0 4px;\n  width: var(--mat-paginator-page-size-select-width, 84px);\n}\n\n.mat-mdc-paginator-range-label {\n  margin: 0 32px 0 24px;\n}\n\n.mat-mdc-paginator-range-actions {\n  display: flex;\n  align-items: center;\n}\n\n.mat-mdc-paginator-icon {\n  display: inline-block;\n  width: 28px;\n  fill: var(--mat-paginator-enabled-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon {\n  fill: var(--mat-paginator-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n[dir=rtl] .mat-mdc-paginator-icon {\n  transform: rotate(180deg);\n}\n\n@media (forced-colors: active) {\n  .mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon,\n  .mat-mdc-paginator-icon {\n    fill: currentColor;\n  }\n  .mat-mdc-paginator-range-actions .mat-mdc-icon-button {\n    outline: solid 1px;\n  }\n  .mat-mdc-paginator-range-actions .mat-mdc-icon-button[aria-disabled] {\n    color: GrayText;\n  }\n}\n.mat-mdc-paginator-touch-target {\n  display: var(--mat-paginator-touch-target-display, block);\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: var(--mat-paginator-page-size-select-width, 84px);\n  height: var(--mat-paginator-page-size-select-touch-target-height, 48px);\n  background-color: transparent;\n  transform: translate(-50%, -50%);\n  cursor: pointer;\n}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatPaginator, [{
    type: Component,
    args: [{
      selector: "mat-paginator",
      exportAs: "matPaginator",
      host: {
        "class": "mat-mdc-paginator",
        "role": "group"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      imports: [MatFormField, MatSelect, MatOption, MatIconButton, MatTooltip],
      template: '<div class="mat-mdc-paginator-outer-container">\n  <div class="mat-mdc-paginator-container">\n    @if (!hidePageSize) {\n      <div class="mat-mdc-paginator-page-size">\n        <div class="mat-mdc-paginator-page-size-label" [attr.id]="_pageSizeLabelId" aria-hidden="true">\n          {{_intl.itemsPerPageLabel}}\n        </div>\n\n        @if (_displayedPageSizeOptions.length > 1) {\n          <mat-form-field\n            [appearance]="_formFieldAppearance!"\n            [color]="color"\n            class="mat-mdc-paginator-page-size-select">\n            <mat-select\n              #selectRef\n              [value]="pageSize"\n              [disabled]="disabled"\n              [aria-labelledby]="_pageSizeLabelId"\n              [panelClass]="selectConfig.panelClass || \'\'"\n              [disableOptionCentering]="selectConfig.disableOptionCentering"\n              (selectionChange)="_changePageSize($event.value)"\n              hideSingleSelectionIndicator>\n              @for (pageSizeOption of _displayedPageSizeOptions; track pageSizeOption) {\n                <mat-option [value]="pageSizeOption">\n                  {{pageSizeOption}}\n                </mat-option>\n              }\n            </mat-select>\n          <div class="mat-mdc-paginator-touch-target" (click)="selectRef.open()"></div>\n          </mat-form-field>\n        }\n\n        @if (_displayedPageSizeOptions.length <= 1) {\n          <div class="mat-mdc-paginator-page-size-value">{{pageSize}}</div>\n        }\n      </div>\n    }\n\n    <div class="mat-mdc-paginator-range-actions">\n      <div class="mat-mdc-paginator-range-label" aria-atomic="true" aria-live="polite" role="status">\n        {{_intl.getRangeLabel(pageIndex, pageSize, length)}}\n      </div>\n\n      <!--\n      The buttons use `disabledInteractive` so that they can retain focus if they become disabled,\n      otherwise focus is moved to the document body. However, users should not be able to navigate\n      into these buttons, so `tabindex` is set to -1 when disabled.\n      -->\n\n      @if (showFirstLastButtons) {\n        <button matIconButton type="button"\n                class="mat-mdc-paginator-navigation-first"\n                (click)="_buttonClicked(0, _previousButtonsDisabled())"\n                [attr.aria-label]="_intl.firstPageLabel"\n                [matTooltip]="_intl.firstPageLabel"\n                [matTooltipDisabled]="_previousButtonsDisabled()"\n                matTooltipPosition="above"\n                [disabled]="_previousButtonsDisabled()"\n                [tabindex]="_previousButtonsDisabled() ? -1 : null"\n                disabledInteractive>\n          <svg class="mat-mdc-paginator-icon"\n              viewBox="0 0 24 24"\n              focusable="false"\n              aria-hidden="true">\n            <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"/>\n          </svg>\n        </button>\n      }\n      <button matIconButton type="button"\n              class="mat-mdc-paginator-navigation-previous"\n              (click)="_buttonClicked(pageIndex - 1, _previousButtonsDisabled())"\n              [attr.aria-label]="_intl.previousPageLabel"\n              [matTooltip]="_intl.previousPageLabel"\n              [matTooltipDisabled]="_previousButtonsDisabled()"\n              matTooltipPosition="above"\n              [disabled]="_previousButtonsDisabled()"\n              [tabindex]="_previousButtonsDisabled() ? -1 : null"\n              disabledInteractive>\n        <svg class="mat-mdc-paginator-icon"\n             viewBox="0 0 24 24"\n             focusable="false"\n             aria-hidden="true">\n          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>\n        </svg>\n      </button>\n      <button matIconButton type="button"\n              class="mat-mdc-paginator-navigation-next"\n              (click)="_buttonClicked(pageIndex + 1, _nextButtonsDisabled())"\n              [attr.aria-label]="_intl.nextPageLabel"\n              [matTooltip]="_intl.nextPageLabel"\n              [matTooltipDisabled]="_nextButtonsDisabled()"\n              matTooltipPosition="above"\n              [disabled]="_nextButtonsDisabled()"\n              [tabindex]="_nextButtonsDisabled() ? -1 : null"\n              disabledInteractive>\n        <svg class="mat-mdc-paginator-icon"\n             viewBox="0 0 24 24"\n             focusable="false"\n             aria-hidden="true">\n          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>\n        </svg>\n      </button>\n      @if (showFirstLastButtons) {\n        <button matIconButton type="button"\n                class="mat-mdc-paginator-navigation-last"\n                (click)="_buttonClicked(getNumberOfPages() - 1, _nextButtonsDisabled())"\n                [attr.aria-label]="_intl.lastPageLabel"\n                [matTooltip]="_intl.lastPageLabel"\n                [matTooltipDisabled]="_nextButtonsDisabled()"\n                matTooltipPosition="above"\n                [disabled]="_nextButtonsDisabled()"\n                [tabindex]="_nextButtonsDisabled() ? -1 : null"\n                disabledInteractive>\n          <svg class="mat-mdc-paginator-icon"\n              viewBox="0 0 24 24"\n              focusable="false"\n              aria-hidden="true">\n            <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>\n          </svg>\n        </button>\n      }\n    </div>\n  </div>\n</div>\n',
      styles: [".mat-mdc-paginator {\n  display: block;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  color: var(--mat-paginator-container-text-color, var(--mat-sys-on-surface));\n  background-color: var(--mat-paginator-container-background-color, var(--mat-sys-surface));\n  font-family: var(--mat-paginator-container-text-font, var(--mat-sys-body-small-font));\n  line-height: var(--mat-paginator-container-text-line-height, var(--mat-sys-body-small-line-height));\n  font-size: var(--mat-paginator-container-text-size, var(--mat-sys-body-small-size));\n  font-weight: var(--mat-paginator-container-text-weight, var(--mat-sys-body-small-weight));\n  letter-spacing: var(--mat-paginator-container-text-tracking, var(--mat-sys-body-small-tracking));\n  --mat-form-field-container-height: var(--mat-paginator-form-field-container-height, 40px);\n  --mat-form-field-container-vertical-padding: var(--mat-paginator-form-field-container-vertical-padding, 8px);\n}\n.mat-mdc-paginator .mat-mdc-select-value {\n  font-size: var(--mat-paginator-select-trigger-text-size, var(--mat-sys-body-small-size));\n}\n.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n.mat-mdc-paginator .mat-mdc-select {\n  line-height: 1.5;\n}\n\n.mat-mdc-paginator-outer-container {\n  display: flex;\n}\n\n.mat-mdc-paginator-container {\n  display: flex;\n  align-items: center;\n  justify-content: flex-end;\n  padding: 0 8px;\n  flex-wrap: wrap;\n  width: 100%;\n  min-height: var(--mat-paginator-container-size, 56px);\n}\n\n.mat-mdc-paginator-page-size {\n  display: flex;\n  align-items: baseline;\n  margin-right: 8px;\n}\n[dir=rtl] .mat-mdc-paginator-page-size {\n  margin-right: 0;\n  margin-left: 8px;\n}\n\n.mat-mdc-paginator-page-size-label {\n  margin: 0 4px;\n}\n\n.mat-mdc-paginator-page-size-select {\n  margin: 0 4px;\n  width: var(--mat-paginator-page-size-select-width, 84px);\n}\n\n.mat-mdc-paginator-range-label {\n  margin: 0 32px 0 24px;\n}\n\n.mat-mdc-paginator-range-actions {\n  display: flex;\n  align-items: center;\n}\n\n.mat-mdc-paginator-icon {\n  display: inline-block;\n  width: 28px;\n  fill: var(--mat-paginator-enabled-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon {\n  fill: var(--mat-paginator-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n[dir=rtl] .mat-mdc-paginator-icon {\n  transform: rotate(180deg);\n}\n\n@media (forced-colors: active) {\n  .mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon,\n  .mat-mdc-paginator-icon {\n    fill: currentColor;\n  }\n  .mat-mdc-paginator-range-actions .mat-mdc-icon-button {\n    outline: solid 1px;\n  }\n  .mat-mdc-paginator-range-actions .mat-mdc-icon-button[aria-disabled] {\n    color: GrayText;\n  }\n}\n.mat-mdc-paginator-touch-target {\n  display: var(--mat-paginator-touch-target-display, block);\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: var(--mat-paginator-page-size-select-width, 84px);\n  height: var(--mat-paginator-page-size-select-touch-target-height, 48px);\n  background-color: transparent;\n  transform: translate(-50%, -50%);\n  cursor: pointer;\n}\n"]
    }]
  }], () => [], {
    color: [{
      type: Input
    }],
    pageIndex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    length: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    pageSize: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    pageSizeOptions: [{
      type: Input
    }],
    hidePageSize: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    showFirstLastButtons: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    selectConfig: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    page: [{
      type: Output
    }]
  });
})();
var MatPaginatorModule = class _MatPaginatorModule {
  static \u0275fac = function MatPaginatorModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatPaginatorModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatPaginatorModule,
    imports: [MatButtonModule, MatSelectModule, MatTooltipModule, MatPaginator],
    exports: [MatPaginator]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatButtonModule, MatSelectModule, MatTooltipModule, MatPaginator]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatPaginatorModule, [{
    type: NgModule,
    args: [{
      imports: [MatButtonModule, MatSelectModule, MatTooltipModule, MatPaginator],
      exports: [MatPaginator]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/_input-value-accessor-chunk.mjs
var MAT_INPUT_VALUE_ACCESSOR = new InjectionToken("MAT_INPUT_VALUE_ACCESSOR");

// node_modules/@angular/material/fesm2022/input.mjs
function getMatInputUnsupportedTypeError(type) {
  return Error(`Input type "${type}" isn't supported by matInput.`);
}
var MAT_INPUT_INVALID_TYPES = ["button", "checkbox", "file", "hidden", "image", "radio", "range", "reset", "submit"];
var MAT_INPUT_CONFIG = new InjectionToken("MAT_INPUT_CONFIG");
var MatInput = class _MatInput {
  _elementRef = inject(ElementRef);
  _platform = inject(Platform);
  ngControl = inject(NgControl, {
    optional: true,
    self: true
  });
  _autofillMonitor = inject(AutofillMonitor);
  _ngZone = inject(NgZone);
  _formField = inject(MAT_FORM_FIELD, {
    optional: true
  });
  _renderer = inject(Renderer2);
  _uid = inject(_IdGenerator).getId("mat-input-");
  _previousNativeValue;
  _inputValueAccessor;
  _signalBasedValueAccessor;
  _previousPlaceholder = null;
  _errorStateTracker;
  _config = inject(MAT_INPUT_CONFIG, {
    optional: true
  });
  _cleanupIosKeyup;
  _cleanupWebkitWheel;
  _isServer = false;
  _isNativeSelect = false;
  _isTextarea = false;
  _isInFormField = false;
  focused = false;
  stateChanges = new Subject();
  controlType = "mat-input";
  autofilled = false;
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = coerceBooleanProperty(value);
    if (this.focused) {
      this.focused = false;
      this.stateChanges.next();
    }
  }
  _disabled = false;
  get id() {
    return this._id;
  }
  set id(value) {
    this._id = value || this._uid;
  }
  _id;
  placeholder;
  name;
  get required() {
    return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }
  set required(value) {
    this._required = coerceBooleanProperty(value);
  }
  _required;
  get type() {
    return this._type;
  }
  set type(value) {
    this._type = value || "text";
    this._validateType();
    if (!this._isTextarea && getSupportedInputTypes().has(this._type)) {
      this._elementRef.nativeElement.type = this._type;
    }
  }
  _type = "text";
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value) {
    this._errorStateTracker.matcher = value;
  }
  userAriaDescribedBy;
  get value() {
    return this._signalBasedValueAccessor ? this._signalBasedValueAccessor.value() : this._inputValueAccessor.value;
  }
  set value(value) {
    if (value !== this.value) {
      if (this._signalBasedValueAccessor) {
        this._signalBasedValueAccessor.value.set(value);
      } else {
        this._inputValueAccessor.value = value;
      }
      this.stateChanges.next();
    }
  }
  get readonly() {
    return this._readonly;
  }
  set readonly(value) {
    this._readonly = coerceBooleanProperty(value);
  }
  _readonly = false;
  disabledInteractive;
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value) {
    this._errorStateTracker.errorState = value;
  }
  _neverEmptyInputTypes = ["date", "datetime", "datetime-local", "month", "time", "week"].filter((t) => getSupportedInputTypes().has(t));
  constructor() {
    const parentForm = inject(NgForm, {
      optional: true
    });
    const parentFormGroup = inject(FormGroupDirective, {
      optional: true
    });
    const defaultErrorStateMatcher = inject(ErrorStateMatcher);
    const accessor = inject(MAT_INPUT_VALUE_ACCESSOR, {
      optional: true,
      self: true
    });
    const element = this._elementRef.nativeElement;
    const nodeName = element.nodeName.toLowerCase();
    if (accessor) {
      if (isSignal(accessor.value)) {
        this._signalBasedValueAccessor = accessor;
      } else {
        this._inputValueAccessor = accessor;
      }
    } else {
      this._inputValueAccessor = element;
    }
    this._previousNativeValue = this.value;
    this.id = this.id;
    if (this._platform.IOS) {
      this._ngZone.runOutsideAngular(() => {
        this._cleanupIosKeyup = this._renderer.listen(element, "keyup", this._iOSKeyupListener);
      });
    }
    this._errorStateTracker = new _ErrorStateTracker(defaultErrorStateMatcher, this.ngControl, parentFormGroup, parentForm, this.stateChanges);
    this._isServer = !this._platform.isBrowser;
    this._isNativeSelect = nodeName === "select";
    this._isTextarea = nodeName === "textarea";
    this._isInFormField = !!this._formField;
    this.disabledInteractive = this._config?.disabledInteractive || false;
    if (this._isNativeSelect) {
      this.controlType = element.multiple ? "mat-native-select-multiple" : "mat-native-select";
    }
    if (this._signalBasedValueAccessor) {
      effect(() => {
        this._signalBasedValueAccessor.value();
        this.stateChanges.next();
      });
    }
  }
  ngAfterViewInit() {
    if (this._platform.isBrowser) {
      this._autofillMonitor.monitor(this._elementRef.nativeElement).subscribe((event) => {
        this.autofilled = event.isAutofilled;
        this.stateChanges.next();
      });
    }
  }
  ngOnChanges() {
    this.stateChanges.next();
  }
  ngOnDestroy() {
    this.stateChanges.complete();
    if (this._platform.isBrowser) {
      this._autofillMonitor.stopMonitoring(this._elementRef.nativeElement);
    }
    this._cleanupIosKeyup?.();
    this._cleanupWebkitWheel?.();
  }
  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
      if (this.ngControl.disabled !== null && this.ngControl.disabled !== this.disabled) {
        this.disabled = this.ngControl.disabled;
        this.stateChanges.next();
      }
    }
    this._dirtyCheckNativeValue();
    this._dirtyCheckPlaceholder();
  }
  focus(options) {
    this._elementRef.nativeElement.focus(options);
  }
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }
  _focusChanged(isFocused) {
    if (isFocused === this.focused) {
      return;
    }
    if (!this._isNativeSelect && isFocused && this.disabled && this.disabledInteractive) {
      const element = this._elementRef.nativeElement;
      if (element.type === "number") {
        element.type = "text";
        element.setSelectionRange(0, 0);
        element.type = "number";
      } else {
        element.setSelectionRange(0, 0);
      }
    }
    this.focused = isFocused;
    this.stateChanges.next();
  }
  _onInput() {
  }
  _dirtyCheckNativeValue() {
    const newValue = this._elementRef.nativeElement.value;
    if (this._previousNativeValue !== newValue) {
      this._previousNativeValue = newValue;
      this.stateChanges.next();
    }
  }
  _dirtyCheckPlaceholder() {
    const placeholder = this._getPlaceholder();
    if (placeholder !== this._previousPlaceholder) {
      const element = this._elementRef.nativeElement;
      this._previousPlaceholder = placeholder;
      placeholder ? element.setAttribute("placeholder", placeholder) : element.removeAttribute("placeholder");
    }
  }
  _getPlaceholder() {
    return this.placeholder || null;
  }
  _validateType() {
    if (MAT_INPUT_INVALID_TYPES.indexOf(this._type) > -1 && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMatInputUnsupportedTypeError(this._type);
    }
  }
  _isNeverEmpty() {
    return this._neverEmptyInputTypes.indexOf(this._type) > -1;
  }
  _isBadInput() {
    let validity = this._elementRef.nativeElement.validity;
    return validity && validity.badInput;
  }
  get empty() {
    return !this._isNeverEmpty() && !this._elementRef.nativeElement.value && !this._isBadInput() && !this.autofilled;
  }
  get shouldLabelFloat() {
    if (this._isNativeSelect) {
      const selectElement = this._elementRef.nativeElement;
      const firstOption = selectElement.options[0];
      return this.focused || selectElement.multiple || !this.empty || !!(selectElement.selectedIndex > -1 && firstOption && firstOption.label);
    } else {
      return this.focused && !this.disabled || !this.empty;
    }
  }
  get describedByIds() {
    const element = this._elementRef.nativeElement;
    const existingDescribedBy = element.getAttribute("aria-describedby");
    return existingDescribedBy?.split(" ") || [];
  }
  setDescribedByIds(ids) {
    const element = this._elementRef.nativeElement;
    if (ids.length) {
      element.setAttribute("aria-describedby", ids.join(" "));
    } else {
      element.removeAttribute("aria-describedby");
    }
  }
  onContainerClick() {
    if (!this.focused) {
      this.focus();
    }
  }
  _isInlineSelect() {
    const element = this._elementRef.nativeElement;
    return this._isNativeSelect && (element.multiple || element.size > 1);
  }
  _iOSKeyupListener = (event) => {
    const el = event.target;
    if (!el.value && el.selectionStart === 0 && el.selectionEnd === 0) {
      el.setSelectionRange(1, 1);
      el.setSelectionRange(0, 0);
    }
  };
  _getReadonlyAttribute() {
    if (this._isNativeSelect) {
      return null;
    }
    if (this.readonly || this.disabled && this.disabledInteractive) {
      return "true";
    }
    return null;
  }
  static \u0275fac = function MatInput_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatInput)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatInput,
    selectors: [["input", "matInput", ""], ["textarea", "matInput", ""], ["select", "matNativeControl", ""], ["input", "matNativeControl", ""], ["textarea", "matNativeControl", ""]],
    hostAttrs: [1, "mat-mdc-input-element"],
    hostVars: 21,
    hostBindings: function MatInput_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("focus", function MatInput_focus_HostBindingHandler() {
          return ctx._focusChanged(true);
        })("blur", function MatInput_blur_HostBindingHandler() {
          return ctx._focusChanged(false);
        })("input", function MatInput_input_HostBindingHandler() {
          return ctx._onInput();
        });
      }
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id)("disabled", ctx.disabled && !ctx.disabledInteractive)("required", ctx.required);
        \u0275\u0275attribute("name", ctx.name || null)("readonly", ctx._getReadonlyAttribute())("aria-disabled", ctx.disabled && ctx.disabledInteractive ? "true" : null)("aria-invalid", ctx.empty && ctx.required ? null : ctx.errorState)("aria-required", ctx.required)("id", ctx.id);
        \u0275\u0275classProp("mat-input-server", ctx._isServer)("mat-mdc-form-field-textarea-control", ctx._isInFormField && ctx._isTextarea)("mat-mdc-form-field-input-control", ctx._isInFormField)("mat-mdc-input-disabled-interactive", ctx.disabledInteractive)("mdc-text-field__input", ctx._isInFormField)("mat-mdc-native-select-inline", ctx._isInlineSelect());
      }
    },
    inputs: {
      disabled: "disabled",
      id: "id",
      placeholder: "placeholder",
      name: "name",
      required: "required",
      type: "type",
      errorStateMatcher: "errorStateMatcher",
      userAriaDescribedBy: [0, "aria-describedby", "userAriaDescribedBy"],
      value: "value",
      readonly: "readonly",
      disabledInteractive: [2, "disabledInteractive", "disabledInteractive", booleanAttribute]
    },
    exportAs: ["matInput"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MatFormFieldControl,
      useExisting: _MatInput
    }]), \u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatInput, [{
    type: Directive,
    args: [{
      selector: `input[matInput], textarea[matInput], select[matNativeControl],
      input[matNativeControl], textarea[matNativeControl]`,
      exportAs: "matInput",
      host: {
        "class": "mat-mdc-input-element",
        "[class.mat-input-server]": "_isServer",
        "[class.mat-mdc-form-field-textarea-control]": "_isInFormField && _isTextarea",
        "[class.mat-mdc-form-field-input-control]": "_isInFormField",
        "[class.mat-mdc-input-disabled-interactive]": "disabledInteractive",
        "[class.mdc-text-field__input]": "_isInFormField",
        "[class.mat-mdc-native-select-inline]": "_isInlineSelect()",
        "[id]": "id",
        "[disabled]": "disabled && !disabledInteractive",
        "[required]": "required",
        "[attr.name]": "name || null",
        "[attr.readonly]": "_getReadonlyAttribute()",
        "[attr.aria-disabled]": 'disabled && disabledInteractive ? "true" : null',
        "[attr.aria-invalid]": "(empty && required) ? null : errorState",
        "[attr.aria-required]": "required",
        "[attr.id]": "id",
        "(focus)": "_focusChanged(true)",
        "(blur)": "_focusChanged(false)",
        "(input)": "_onInput()"
      },
      providers: [{
        provide: MatFormFieldControl,
        useExisting: MatInput
      }]
    }]
  }], () => [], {
    disabled: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    placeholder: [{
      type: Input
    }],
    name: [{
      type: Input
    }],
    required: [{
      type: Input
    }],
    type: [{
      type: Input
    }],
    errorStateMatcher: [{
      type: Input
    }],
    userAriaDescribedBy: [{
      type: Input,
      args: ["aria-describedby"]
    }],
    value: [{
      type: Input
    }],
    readonly: [{
      type: Input
    }],
    disabledInteractive: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var MatInputModule = class _MatInputModule {
  static \u0275fac = function MatInputModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatInputModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatInputModule,
    imports: [MatFormFieldModule, MatInput],
    exports: [MatInput, MatFormFieldModule, TextFieldModule, BidiModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatFormFieldModule, MatFormFieldModule, TextFieldModule, BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatInputModule, [{
    type: NgModule,
    args: [{
      imports: [MatFormFieldModule, MatInput],
      exports: [MatInput, MatFormFieldModule, TextFieldModule, BidiModule]
    }]
  }], null, null);
})();

// libs/shared/util/objects/src/util-objects.ts
function isEmpty(obj) {
  if (obj === null || obj === void 0)
    return true;
  return [Object, Array].includes(obj.constructor) && !Object.entries(obj).length;
}
function isNil(value) {
  return value === void 0 || value === null;
}
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }
  if (typeof obj === "object") {
    const cloned = {};
    Object.keys(obj).forEach((key) => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
  return obj;
}

// node_modules/@angular/material/fesm2022/_internal-form-field-chunk.mjs
var _c04 = ["mat-internal-form-field", ""];
var _c14 = ["*"];
var _MatInternalFormField = class __MatInternalFormField {
  labelPosition = "after";
  static \u0275fac = function _MatInternalFormField_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || __MatInternalFormField)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: __MatInternalFormField,
    selectors: [["div", "mat-internal-form-field", ""]],
    hostAttrs: [1, "mdc-form-field", "mat-internal-form-field"],
    hostVars: 2,
    hostBindings: function _MatInternalFormField_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mdc-form-field--align-end", ctx.labelPosition === "before");
      }
    },
    inputs: {
      labelPosition: "labelPosition"
    },
    attrs: _c04,
    ngContentSelectors: _c14,
    decls: 1,
    vars: 0,
    template: function _MatInternalFormField_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275projection(0);
      }
    },
    styles: [".mat-internal-form-field {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: inline-flex;\n  align-items: center;\n  vertical-align: middle;\n}\n.mat-internal-form-field > label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n  order: 0;\n}\n[dir=rtl] .mat-internal-form-field > label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n}\n\n.mdc-form-field--align-end > label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n  order: -1;\n}\n[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_MatInternalFormField, [{
    type: Component,
    args: [{
      selector: "div[mat-internal-form-field]",
      template: "<ng-content></ng-content>",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "class": "mdc-form-field mat-internal-form-field",
        "[class.mdc-form-field--align-end]": 'labelPosition === "before"'
      },
      styles: [".mat-internal-form-field {\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-font-smoothing: antialiased;\n  display: inline-flex;\n  align-items: center;\n  vertical-align: middle;\n}\n.mat-internal-form-field > label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n  order: 0;\n}\n[dir=rtl] .mat-internal-form-field > label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n}\n\n.mdc-form-field--align-end > label {\n  margin-left: auto;\n  margin-right: 0;\n  padding-left: 0;\n  padding-right: 4px;\n  order: -1;\n}\n[dir=rtl] .mdc-form-field--align-end .mdc-form-field--align-end label {\n  margin-left: 0;\n  margin-right: auto;\n  padding-left: 4px;\n  padding-right: 0;\n}\n"]
    }]
  }], null, {
    labelPosition: [{
      type: Input,
      args: [{
        required: true
      }]
    }]
  });
})();

// node_modules/@angular/material/fesm2022/radio.mjs
var _c05 = ["input"];
var _c15 = ["formField"];
var _c24 = ["*"];
var MatRadioChange = class {
  source;
  value;
  constructor(source, value) {
    this.source = source;
    this.value = value;
  }
};
var MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatRadioGroup),
  multi: true
};
var MAT_RADIO_GROUP = new InjectionToken("MatRadioGroup");
var MAT_RADIO_DEFAULT_OPTIONS = new InjectionToken("mat-radio-default-options", {
  providedIn: "root",
  factory: () => ({
    color: "accent",
    disabledInteractive: false
  })
});
var MatRadioGroup = class _MatRadioGroup {
  _changeDetector = inject(ChangeDetectorRef);
  _value = null;
  _name = inject(_IdGenerator).getId("mat-radio-group-");
  _selected = null;
  _isInitialized = false;
  _labelPosition = "after";
  _disabled = false;
  _required = false;
  _buttonChanges;
  _controlValueAccessorChangeFn = () => {
  };
  onTouched = () => {
  };
  change = new EventEmitter();
  _radios;
  color;
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
    this._updateRadioButtonNames();
  }
  get labelPosition() {
    return this._labelPosition;
  }
  set labelPosition(v) {
    this._labelPosition = v === "before" ? "before" : "after";
    this._markRadiosForCheck();
  }
  get value() {
    return this._value;
  }
  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue;
      this._updateSelectedRadioFromValue();
      this._checkSelectedRadioButton();
    }
  }
  _checkSelectedRadioButton() {
    if (this._selected && !this._selected.checked) {
      this._selected.checked = true;
    }
  }
  get selected() {
    return this._selected;
  }
  set selected(selected) {
    this._selected = selected;
    this.value = selected ? selected.value : null;
    this._checkSelectedRadioButton();
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this._markRadiosForCheck();
  }
  get required() {
    return this._required;
  }
  set required(value) {
    this._required = value;
    this._markRadiosForCheck();
  }
  get disabledInteractive() {
    return this._disabledInteractive;
  }
  set disabledInteractive(value) {
    this._disabledInteractive = value;
    this._markRadiosForCheck();
  }
  _disabledInteractive = false;
  constructor() {
  }
  ngAfterContentInit() {
    this._isInitialized = true;
    this._buttonChanges = this._radios.changes.subscribe(() => {
      if (this.selected && !this._radios.find((radio) => radio === this.selected)) {
        this._selected = null;
      }
    });
  }
  ngOnDestroy() {
    this._buttonChanges?.unsubscribe();
  }
  _touch() {
    if (this.onTouched) {
      this.onTouched();
    }
  }
  _updateRadioButtonNames() {
    if (this._radios) {
      this._radios.forEach((radio) => {
        radio.name = this.name;
        radio._markForCheck();
      });
    }
  }
  _updateSelectedRadioFromValue() {
    const isAlreadySelected = this._selected !== null && this._selected.value === this._value;
    if (this._radios && !isAlreadySelected) {
      this._selected = null;
      this._radios.forEach((radio) => {
        radio.checked = this.value === radio.value;
        if (radio.checked) {
          this._selected = radio;
        }
      });
    }
  }
  _emitChangeEvent() {
    if (this._isInitialized) {
      this.change.emit(new MatRadioChange(this._selected, this._value));
    }
  }
  _markRadiosForCheck() {
    if (this._radios) {
      this._radios.forEach((radio) => radio._markForCheck());
    }
  }
  writeValue(value) {
    this.value = value;
    this._changeDetector.markForCheck();
  }
  registerOnChange(fn) {
    this._controlValueAccessorChangeFn = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
    this._changeDetector.markForCheck();
  }
  static \u0275fac = function MatRadioGroup_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatRadioGroup)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatRadioGroup,
    selectors: [["mat-radio-group"]],
    contentQueries: function MatRadioGroup_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, MatRadioButton, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._radios = _t);
      }
    },
    hostAttrs: ["role", "radiogroup", 1, "mat-mdc-radio-group"],
    inputs: {
      color: "color",
      name: "name",
      labelPosition: "labelPosition",
      value: "value",
      selected: "selected",
      disabled: [2, "disabled", "disabled", booleanAttribute],
      required: [2, "required", "required", booleanAttribute],
      disabledInteractive: [2, "disabledInteractive", "disabledInteractive", booleanAttribute]
    },
    outputs: {
      change: "change"
    },
    exportAs: ["matRadioGroup"],
    features: [\u0275\u0275ProvidersFeature([MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, {
      provide: MAT_RADIO_GROUP,
      useExisting: _MatRadioGroup
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRadioGroup, [{
    type: Directive,
    args: [{
      selector: "mat-radio-group",
      exportAs: "matRadioGroup",
      providers: [MAT_RADIO_GROUP_CONTROL_VALUE_ACCESSOR, {
        provide: MAT_RADIO_GROUP,
        useExisting: MatRadioGroup
      }],
      host: {
        "role": "radiogroup",
        "class": "mat-mdc-radio-group"
      }
    }]
  }], () => [], {
    change: [{
      type: Output
    }],
    _radios: [{
      type: ContentChildren,
      args: [forwardRef(() => MatRadioButton), {
        descendants: true
      }]
    }],
    color: [{
      type: Input
    }],
    name: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    value: [{
      type: Input
    }],
    selected: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    required: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabledInteractive: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var MatRadioButton = class _MatRadioButton {
  _elementRef = inject(ElementRef);
  _changeDetector = inject(ChangeDetectorRef);
  _focusMonitor = inject(FocusMonitor);
  _radioDispatcher = inject(UniqueSelectionDispatcher);
  _defaultOptions = inject(MAT_RADIO_DEFAULT_OPTIONS, {
    optional: true
  });
  _ngZone = inject(NgZone);
  _renderer = inject(Renderer2);
  _uniqueId = inject(_IdGenerator).getId("mat-radio-");
  _cleanupClick;
  id = this._uniqueId;
  name;
  ariaLabel;
  ariaLabelledby;
  ariaDescribedby;
  disableRipple = false;
  tabIndex = 0;
  get checked() {
    return this._checked;
  }
  set checked(value) {
    if (this._checked !== value) {
      this._checked = value;
      if (value && this.radioGroup && this.radioGroup.value !== this.value) {
        this.radioGroup.selected = this;
      } else if (!value && this.radioGroup && this.radioGroup.value === this.value) {
        this.radioGroup.selected = null;
      }
      if (value) {
        this._radioDispatcher.notify(this.id, this.name);
      }
      this._changeDetector.markForCheck();
    }
  }
  get value() {
    return this._value;
  }
  set value(value) {
    if (this._value !== value) {
      this._value = value;
      if (this.radioGroup !== null) {
        if (!this.checked) {
          this.checked = this.radioGroup.value === value;
        }
        if (this.checked) {
          this.radioGroup.selected = this;
        }
      }
    }
  }
  get labelPosition() {
    return this._labelPosition || this.radioGroup && this.radioGroup.labelPosition || "after";
  }
  set labelPosition(value) {
    this._labelPosition = value;
  }
  _labelPosition;
  get disabled() {
    return this._disabled || this.radioGroup !== null && this.radioGroup.disabled;
  }
  set disabled(value) {
    this._setDisabled(value);
  }
  get required() {
    return this._required || this.radioGroup && this.radioGroup.required;
  }
  set required(value) {
    if (value !== this._required) {
      this._changeDetector.markForCheck();
    }
    this._required = value;
  }
  get color() {
    return this._color || this.radioGroup && this.radioGroup.color || this._defaultOptions && this._defaultOptions.color || "accent";
  }
  set color(newValue) {
    this._color = newValue;
  }
  _color;
  get disabledInteractive() {
    return this._disabledInteractive || this.radioGroup !== null && this.radioGroup.disabledInteractive;
  }
  set disabledInteractive(value) {
    this._disabledInteractive = value;
  }
  _disabledInteractive;
  change = new EventEmitter();
  radioGroup;
  get inputId() {
    return `${this.id || this._uniqueId}-input`;
  }
  _checked = false;
  _disabled = false;
  _required = false;
  _value = null;
  _removeUniqueSelectionListener = () => {
  };
  _previousTabIndex;
  _inputElement;
  _rippleTrigger;
  _noopAnimations = _animationsDisabled();
  _injector = inject(Injector);
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
    const radioGroup = inject(MAT_RADIO_GROUP, {
      optional: true
    });
    const tabIndex = inject(new HostAttributeToken("tabindex"), {
      optional: true
    });
    this.radioGroup = radioGroup;
    this._disabledInteractive = this._defaultOptions?.disabledInteractive ?? false;
    if (tabIndex) {
      this.tabIndex = numberAttribute(tabIndex, 0);
    }
  }
  focus(options, origin) {
    if (origin) {
      this._focusMonitor.focusVia(this._inputElement, origin, options);
    } else {
      this._inputElement.nativeElement.focus(options);
    }
  }
  _markForCheck() {
    this._changeDetector.markForCheck();
  }
  ngOnInit() {
    if (this.radioGroup) {
      this.checked = this.radioGroup.value === this._value;
      if (this.checked) {
        this.radioGroup.selected = this;
      }
      this.name = this.radioGroup.name;
    }
    this._removeUniqueSelectionListener = this._radioDispatcher.listen((id, name) => {
      if (id !== this.id && name === this.name) {
        this.checked = false;
      }
    });
  }
  ngDoCheck() {
    this._updateTabIndex();
  }
  ngAfterViewInit() {
    this._updateTabIndex();
    this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
      if (!focusOrigin && this.radioGroup) {
        this.radioGroup._touch();
      }
    });
    this._ngZone.runOutsideAngular(() => {
      this._cleanupClick = this._renderer.listen(this._inputElement.nativeElement, "click", this._onInputClick);
    });
  }
  ngOnDestroy() {
    this._cleanupClick?.();
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._removeUniqueSelectionListener();
  }
  _emitChangeEvent() {
    this.change.emit(new MatRadioChange(this, this._value));
  }
  _isRippleDisabled() {
    return this.disableRipple || this.disabled;
  }
  _onInputInteraction(event) {
    event.stopPropagation();
    if (!this.checked && !this.disabled) {
      const groupValueChanged = this.radioGroup && this.value !== this.radioGroup.value;
      this.checked = true;
      this._emitChangeEvent();
      if (this.radioGroup) {
        this.radioGroup._controlValueAccessorChangeFn(this.value);
        if (groupValueChanged) {
          this.radioGroup._emitChangeEvent();
        }
      }
    }
  }
  _onTouchTargetClick(event) {
    this._onInputInteraction(event);
    if (!this.disabled || this.disabledInteractive) {
      this._inputElement?.nativeElement.focus();
    }
  }
  _setDisabled(value) {
    if (this._disabled !== value) {
      this._disabled = value;
      this._changeDetector.markForCheck();
    }
  }
  _onInputClick = (event) => {
    if (this.disabled && this.disabledInteractive) {
      event.preventDefault();
    }
  };
  _updateTabIndex() {
    const group = this.radioGroup;
    let value;
    if (!group || !group.selected || this.disabled) {
      value = this.tabIndex;
    } else {
      value = group.selected === this ? this.tabIndex : -1;
    }
    if (value !== this._previousTabIndex) {
      const input = this._inputElement?.nativeElement;
      if (input) {
        input.setAttribute("tabindex", value + "");
        this._previousTabIndex = value;
        afterNextRender(() => {
          queueMicrotask(() => {
            if (group && group.selected && group.selected !== this && document.activeElement === input) {
              group.selected?._inputElement.nativeElement.focus();
              if (document.activeElement === input) {
                this._inputElement.nativeElement.blur();
              }
            }
          });
        }, {
          injector: this._injector
        });
      }
    }
  }
  static \u0275fac = function MatRadioButton_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatRadioButton)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatRadioButton,
    selectors: [["mat-radio-button"]],
    viewQuery: function MatRadioButton_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c05, 5)(_c15, 7, ElementRef);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._inputElement = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._rippleTrigger = _t.first);
      }
    },
    hostAttrs: [1, "mat-mdc-radio-button"],
    hostVars: 19,
    hostBindings: function MatRadioButton_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("focus", function MatRadioButton_focus_HostBindingHandler() {
          return ctx._inputElement.nativeElement.focus();
        });
      }
      if (rf & 2) {
        \u0275\u0275attribute("id", ctx.id)("tabindex", null)("aria-label", null)("aria-labelledby", null)("aria-describedby", null);
        \u0275\u0275classProp("mat-primary", ctx.color === "primary")("mat-accent", ctx.color === "accent")("mat-warn", ctx.color === "warn")("mat-mdc-radio-checked", ctx.checked)("mat-mdc-radio-disabled", ctx.disabled)("mat-mdc-radio-disabled-interactive", ctx.disabledInteractive)("_mat-animation-noopable", ctx._noopAnimations);
      }
    },
    inputs: {
      id: "id",
      name: "name",
      ariaLabel: [0, "aria-label", "ariaLabel"],
      ariaLabelledby: [0, "aria-labelledby", "ariaLabelledby"],
      ariaDescribedby: [0, "aria-describedby", "ariaDescribedby"],
      disableRipple: [2, "disableRipple", "disableRipple", booleanAttribute],
      tabIndex: [2, "tabIndex", "tabIndex", (value) => value == null ? 0 : numberAttribute(value)],
      checked: [2, "checked", "checked", booleanAttribute],
      value: "value",
      labelPosition: "labelPosition",
      disabled: [2, "disabled", "disabled", booleanAttribute],
      required: [2, "required", "required", booleanAttribute],
      color: "color",
      disabledInteractive: [2, "disabledInteractive", "disabledInteractive", booleanAttribute]
    },
    outputs: {
      change: "change"
    },
    exportAs: ["matRadioButton"],
    ngContentSelectors: _c24,
    decls: 13,
    vars: 17,
    consts: [["formField", ""], ["input", ""], ["mat-internal-form-field", "", 3, "labelPosition"], [1, "mdc-radio"], ["aria-hidden", "true", 1, "mat-mdc-radio-touch-target", 3, "click"], ["type", "radio", "aria-invalid", "false", 1, "mdc-radio__native-control", 3, "change", "id", "checked", "disabled", "required"], ["aria-hidden", "true", 1, "mdc-radio__background"], [1, "mdc-radio__outer-circle"], [1, "mdc-radio__inner-circle"], ["mat-ripple", "", "aria-hidden", "true", 1, "mat-radio-ripple", "mat-focus-indicator", 3, "matRippleTrigger", "matRippleDisabled", "matRippleCentered"], [1, "mat-ripple-element", "mat-radio-persistent-ripple"], [1, "mdc-label", 3, "for"]],
    template: function MatRadioButton_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275elementStart(0, "div", 2, 0)(2, "div", 3)(3, "div", 4);
        \u0275\u0275listener("click", function MatRadioButton_Template_div_click_3_listener($event) {
          return ctx._onTouchTargetClick($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "input", 5, 1);
        \u0275\u0275listener("change", function MatRadioButton_Template_input_change_4_listener($event) {
          return ctx._onInputInteraction($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(6, "div", 6);
        \u0275\u0275element(7, "div", 7)(8, "div", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "div", 9);
        \u0275\u0275element(10, "div", 10);
        \u0275\u0275elementEnd()();
        \u0275\u0275elementStart(11, "label", 11);
        \u0275\u0275projection(12);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        \u0275\u0275property("labelPosition", ctx.labelPosition);
        \u0275\u0275advance(2);
        \u0275\u0275classProp("mdc-radio--disabled", ctx.disabled);
        \u0275\u0275advance(2);
        \u0275\u0275property("id", ctx.inputId)("checked", ctx.checked)("disabled", ctx.disabled && !ctx.disabledInteractive)("required", ctx.required);
        \u0275\u0275attribute("name", ctx.name)("value", ctx.value)("aria-label", ctx.ariaLabel)("aria-labelledby", ctx.ariaLabelledby)("aria-describedby", ctx.ariaDescribedby)("aria-disabled", ctx.disabled && ctx.disabledInteractive ? "true" : null);
        \u0275\u0275advance(5);
        \u0275\u0275property("matRippleTrigger", ctx._rippleTrigger.nativeElement)("matRippleDisabled", ctx._isRippleDisabled())("matRippleCentered", true);
        \u0275\u0275advance(2);
        \u0275\u0275property("for", ctx.inputId);
      }
    },
    dependencies: [MatRipple, _MatInternalFormField],
    styles: ['.mat-mdc-radio-button {\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-radio-button .mdc-radio {\n  display: inline-block;\n  position: relative;\n  flex: 0 0 auto;\n  box-sizing: content-box;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  will-change: opacity, transform, border-color, color;\n  padding: calc((var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n}\n.mat-mdc-radio-button .mdc-radio:hover > .mdc-radio__native-control:not([disabled]):not(:focus) ~ .mdc-radio__background::before {\n  opacity: 0.04;\n  transform: scale(1);\n}\n.mat-mdc-radio-button .mdc-radio:hover > .mdc-radio__native-control:not([disabled]) ~ .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-unselected-hover-icon-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-radio-button .mdc-radio:hover > .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-selected-hover-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-radio-button .mdc-radio:hover > .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-selected-hover-icon-color, var(--mat-sys-primary, currentColor));\n}\n.mat-mdc-radio-button .mdc-radio:active > .mdc-radio__native-control:enabled:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-unselected-pressed-icon-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-radio-button .mdc-radio:active > .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-selected-pressed-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-radio-button .mdc-radio:active > .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-selected-pressed-icon-color, var(--mat-sys-primary, currentColor));\n}\n.mat-mdc-radio-button .mdc-radio__background {\n  display: inline-block;\n  position: relative;\n  box-sizing: border-box;\n  width: 20px;\n  height: 20px;\n}\n.mat-mdc-radio-button .mdc-radio__background::before {\n  position: absolute;\n  transform: scale(0, 0);\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: "";\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  width: var(--mat-radio-state-layer-size, 40px);\n  height: var(--mat-radio-state-layer-size, 40px);\n  top: calc(-1 * (var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n  left: calc(-1 * (var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n}\n.mat-mdc-radio-button .mdc-radio__outer-circle {\n  position: absolute;\n  top: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  border-width: 2px;\n  border-style: solid;\n  border-radius: 50%;\n  transition: border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n.mat-mdc-radio-button .mdc-radio__inner-circle {\n  position: absolute;\n  top: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  transform: scale(0);\n  border-radius: 50%;\n  transition: transform 90ms cubic-bezier(0.4, 0, 0.6, 1), background-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n@media (forced-colors: active) {\n  .mat-mdc-radio-button .mdc-radio__inner-circle {\n    background-color: CanvasText !important;\n  }\n}\n.mat-mdc-radio-button .mdc-radio__native-control {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  opacity: 0;\n  top: 0;\n  right: 0;\n  left: 0;\n  cursor: inherit;\n  z-index: 1;\n  width: var(--mat-radio-state-layer-size, 40px);\n  height: var(--mat-radio-state-layer-size, 40px);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:checked + .mdc-radio__background, .mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background {\n  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 1), transform 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__outer-circle, .mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__outer-circle {\n  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__inner-circle, .mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__inner-circle {\n  transition: transform 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:focus + .mdc-radio__background::before {\n  transform: scale(1);\n  opacity: 0.12;\n  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 1), transform 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:disabled:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-unselected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-unselected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background {\n  cursor: default;\n}\n.mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface, currentColor));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:enabled:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-unselected-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-radio-button .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-selected-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-radio-button .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-selected-icon-color, var(--mat-sys-primary, currentColor));\n}\n.mat-mdc-radio-button .mdc-radio__native-control:enabled:focus:checked + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-selected-focus-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-radio-button .mdc-radio__native-control:enabled:focus:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-selected-focus-icon-color, var(--mat-sys-primary, currentColor));\n}\n.mat-mdc-radio-button .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  transform: scale(0.5);\n  transition: transform 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled {\n  pointer-events: auto;\n}\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-unselected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-unselected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled:hover .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__outer-circle,\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control:checked:focus + .mdc-radio__background > .mdc-radio__outer-circle,\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled:hover .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__inner-circle,\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control:checked:focus + .mdc-radio__background > .mdc-radio__inner-circle,\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface, currentColor));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button._mat-animation-noopable .mdc-radio__background::before,\n.mat-mdc-radio-button._mat-animation-noopable .mdc-radio__outer-circle,\n.mat-mdc-radio-button._mat-animation-noopable .mdc-radio__inner-circle {\n  transition: none !important;\n}\n.mat-mdc-radio-button label {\n  cursor: pointer;\n}\n.mat-mdc-radio-button label:empty {\n  display: none;\n}\n.mat-mdc-radio-button .mdc-radio__background::before {\n  background-color: var(--mat-radio-ripple-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-radio-button.mat-mdc-radio-checked .mat-ripple-element,\n.mat-mdc-radio-button.mat-mdc-radio-checked .mdc-radio__background::before {\n  background-color: var(--mat-radio-checked-ripple-color, var(--mat-sys-primary));\n}\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mat-ripple-element,\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__background::before {\n  background-color: var(--mat-radio-ripple-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-radio-button .mat-internal-form-field {\n  color: var(--mat-radio-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-radio-label-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-radio-label-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-radio-label-text-size, var(--mat-sys-body-medium-size));\n  letter-spacing: var(--mat-radio-label-text-tracking, var(--mat-sys-body-medium-tracking));\n  font-weight: var(--mat-radio-label-text-weight, var(--mat-sys-body-medium-weight));\n}\n.mat-mdc-radio-button .mdc-radio--disabled + label {\n  color: var(--mat-radio-disabled-label-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-radio-button .mat-radio-ripple {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: 50%;\n}\n.mat-mdc-radio-button .mat-radio-ripple > .mat-ripple-element {\n  opacity: 0.14;\n}\n.mat-mdc-radio-button .mat-radio-ripple::before {\n  border-radius: 50%;\n}\n.mat-mdc-radio-button .mdc-radio > .mdc-radio__native-control:focus:enabled:not(:checked) ~ .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-unselected-focus-icon-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-radio-button.cdk-focused .mat-focus-indicator::before {\n  content: "";\n}\n\n.mat-mdc-radio-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-radio-disabled.mat-mdc-radio-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-radio-touch-target {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  height: var(--mat-radio-touch-target-size, 48px);\n  width: var(--mat-radio-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n  display: var(--mat-radio-touch-target-display, block);\n}\n[dir=rtl] .mat-mdc-radio-touch-target {\n  left: auto;\n  right: 50%;\n  transform: translate(50%, -50%);\n}\n'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRadioButton, [{
    type: Component,
    args: [{
      selector: "mat-radio-button",
      host: {
        "class": "mat-mdc-radio-button",
        "[attr.id]": "id",
        "[class.mat-primary]": 'color === "primary"',
        "[class.mat-accent]": 'color === "accent"',
        "[class.mat-warn]": 'color === "warn"',
        "[class.mat-mdc-radio-checked]": "checked",
        "[class.mat-mdc-radio-disabled]": "disabled",
        "[class.mat-mdc-radio-disabled-interactive]": "disabledInteractive",
        "[class._mat-animation-noopable]": "_noopAnimations",
        "[attr.tabindex]": "null",
        "[attr.aria-label]": "null",
        "[attr.aria-labelledby]": "null",
        "[attr.aria-describedby]": "null",
        "(focus)": "_inputElement.nativeElement.focus()"
      },
      exportAs: "matRadioButton",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatRipple, _MatInternalFormField],
      template: '<div mat-internal-form-field [labelPosition]="labelPosition" #formField>\n  <div class="mdc-radio" [class.mdc-radio--disabled]="disabled">\n    <!-- Render this element first so the input is on top. -->\n    <div\n      class="mat-mdc-radio-touch-target"\n      (click)="_onTouchTargetClick($event)"\n      aria-hidden="true"></div>\n    <!--\n      Note that we set `aria-invalid="false"` on the input, because otherwise some screen readers\n      will read out "required, invalid data" for each radio button that hasn\'t been checked.\n      An alternate approach is to use `aria-required` instead of `required`, however we have an\n      internal check which enforces that elements marked as `aria-required` also have the `required`\n      attribute which ends up re-introducing the issue for us.\n    -->\n    <input #input class="mdc-radio__native-control" type="radio"\n           [id]="inputId"\n           [checked]="checked"\n           [disabled]="disabled && !disabledInteractive"\n           [attr.name]="name"\n           [attr.value]="value"\n           [required]="required"\n           aria-invalid="false"\n           [attr.aria-label]="ariaLabel"\n           [attr.aria-labelledby]="ariaLabelledby"\n           [attr.aria-describedby]="ariaDescribedby"\n           [attr.aria-disabled]="disabled && disabledInteractive ? \'true\' : null"\n           (change)="_onInputInteraction($event)">\n    <div class="mdc-radio__background" aria-hidden="true">\n      <div class="mdc-radio__outer-circle"></div>\n      <div class="mdc-radio__inner-circle"></div>\n    </div>\n    <div mat-ripple class="mat-radio-ripple mat-focus-indicator"\n         [matRippleTrigger]="_rippleTrigger.nativeElement"\n         [matRippleDisabled]="_isRippleDisabled()"\n         [matRippleCentered]="true"\n         aria-hidden="true">\n      <div class="mat-ripple-element mat-radio-persistent-ripple"></div>\n    </div>\n  </div>\n  <label class="mdc-label" [for]="inputId">\n    <ng-content></ng-content>\n  </label>\n</div>\n',
      styles: ['.mat-mdc-radio-button {\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-radio-button .mdc-radio {\n  display: inline-block;\n  position: relative;\n  flex: 0 0 auto;\n  box-sizing: content-box;\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n  will-change: opacity, transform, border-color, color;\n  padding: calc((var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n}\n.mat-mdc-radio-button .mdc-radio:hover > .mdc-radio__native-control:not([disabled]):not(:focus) ~ .mdc-radio__background::before {\n  opacity: 0.04;\n  transform: scale(1);\n}\n.mat-mdc-radio-button .mdc-radio:hover > .mdc-radio__native-control:not([disabled]) ~ .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-unselected-hover-icon-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-radio-button .mdc-radio:hover > .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-selected-hover-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-radio-button .mdc-radio:hover > .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-selected-hover-icon-color, var(--mat-sys-primary, currentColor));\n}\n.mat-mdc-radio-button .mdc-radio:active > .mdc-radio__native-control:enabled:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-unselected-pressed-icon-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-radio-button .mdc-radio:active > .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-selected-pressed-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-radio-button .mdc-radio:active > .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-selected-pressed-icon-color, var(--mat-sys-primary, currentColor));\n}\n.mat-mdc-radio-button .mdc-radio__background {\n  display: inline-block;\n  position: relative;\n  box-sizing: border-box;\n  width: 20px;\n  height: 20px;\n}\n.mat-mdc-radio-button .mdc-radio__background::before {\n  position: absolute;\n  transform: scale(0, 0);\n  border-radius: 50%;\n  opacity: 0;\n  pointer-events: none;\n  content: "";\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  width: var(--mat-radio-state-layer-size, 40px);\n  height: var(--mat-radio-state-layer-size, 40px);\n  top: calc(-1 * (var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n  left: calc(-1 * (var(--mat-radio-state-layer-size, 40px) - 20px) / 2);\n}\n.mat-mdc-radio-button .mdc-radio__outer-circle {\n  position: absolute;\n  top: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  border-width: 2px;\n  border-style: solid;\n  border-radius: 50%;\n  transition: border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n.mat-mdc-radio-button .mdc-radio__inner-circle {\n  position: absolute;\n  top: 0;\n  left: 0;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  transform: scale(0);\n  border-radius: 50%;\n  transition: transform 90ms cubic-bezier(0.4, 0, 0.6, 1), background-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n@media (forced-colors: active) {\n  .mat-mdc-radio-button .mdc-radio__inner-circle {\n    background-color: CanvasText !important;\n  }\n}\n.mat-mdc-radio-button .mdc-radio__native-control {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  opacity: 0;\n  top: 0;\n  right: 0;\n  left: 0;\n  cursor: inherit;\n  z-index: 1;\n  width: var(--mat-radio-state-layer-size, 40px);\n  height: var(--mat-radio-state-layer-size, 40px);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:checked + .mdc-radio__background, .mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background {\n  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 1), transform 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__outer-circle, .mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__outer-circle {\n  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__inner-circle, .mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__inner-circle {\n  transition: transform 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:focus + .mdc-radio__background::before {\n  transform: scale(1);\n  opacity: 0.12;\n  transition: opacity 90ms cubic-bezier(0, 0, 0.2, 1), transform 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:disabled:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-unselected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-unselected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background {\n  cursor: default;\n}\n.mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:disabled + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface, currentColor));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button .mdc-radio__native-control:enabled:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-unselected-icon-color, var(--mat-sys-on-surface-variant));\n}\n.mat-mdc-radio-button .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-selected-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-radio-button .mdc-radio__native-control:enabled:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-selected-icon-color, var(--mat-sys-primary, currentColor));\n}\n.mat-mdc-radio-button .mdc-radio__native-control:enabled:focus:checked + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-selected-focus-icon-color, var(--mat-sys-primary));\n}\n.mat-mdc-radio-button .mdc-radio__native-control:enabled:focus:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-selected-focus-icon-color, var(--mat-sys-primary, currentColor));\n}\n.mat-mdc-radio-button .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__inner-circle {\n  transform: scale(0.5);\n  transition: transform 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled {\n  pointer-events: auto;\n}\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control:not(:checked) + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-unselected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-unselected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled:hover .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__outer-circle,\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control:checked:focus + .mdc-radio__background > .mdc-radio__outer-circle,\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control + .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled:hover .mdc-radio__native-control:checked + .mdc-radio__background > .mdc-radio__inner-circle,\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control:checked:focus + .mdc-radio__background > .mdc-radio__inner-circle,\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control + .mdc-radio__background > .mdc-radio__inner-circle {\n  background-color: var(--mat-radio-disabled-selected-icon-color, var(--mat-sys-on-surface, currentColor));\n  opacity: var(--mat-radio-disabled-selected-icon-opacity, 0.38);\n}\n.mat-mdc-radio-button._mat-animation-noopable .mdc-radio__background::before,\n.mat-mdc-radio-button._mat-animation-noopable .mdc-radio__outer-circle,\n.mat-mdc-radio-button._mat-animation-noopable .mdc-radio__inner-circle {\n  transition: none !important;\n}\n.mat-mdc-radio-button label {\n  cursor: pointer;\n}\n.mat-mdc-radio-button label:empty {\n  display: none;\n}\n.mat-mdc-radio-button .mdc-radio__background::before {\n  background-color: var(--mat-radio-ripple-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-radio-button.mat-mdc-radio-checked .mat-ripple-element,\n.mat-mdc-radio-button.mat-mdc-radio-checked .mdc-radio__background::before {\n  background-color: var(--mat-radio-checked-ripple-color, var(--mat-sys-primary));\n}\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mat-ripple-element,\n.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__background::before {\n  background-color: var(--mat-radio-ripple-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-radio-button .mat-internal-form-field {\n  color: var(--mat-radio-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-radio-label-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-radio-label-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-radio-label-text-size, var(--mat-sys-body-medium-size));\n  letter-spacing: var(--mat-radio-label-text-tracking, var(--mat-sys-body-medium-tracking));\n  font-weight: var(--mat-radio-label-text-weight, var(--mat-sys-body-medium-weight));\n}\n.mat-mdc-radio-button .mdc-radio--disabled + label {\n  color: var(--mat-radio-disabled-label-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n.mat-mdc-radio-button .mat-radio-ripple {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  pointer-events: none;\n  border-radius: 50%;\n}\n.mat-mdc-radio-button .mat-radio-ripple > .mat-ripple-element {\n  opacity: 0.14;\n}\n.mat-mdc-radio-button .mat-radio-ripple::before {\n  border-radius: 50%;\n}\n.mat-mdc-radio-button .mdc-radio > .mdc-radio__native-control:focus:enabled:not(:checked) ~ .mdc-radio__background > .mdc-radio__outer-circle {\n  border-color: var(--mat-radio-unselected-focus-icon-color, var(--mat-sys-on-surface));\n}\n.mat-mdc-radio-button.cdk-focused .mat-focus-indicator::before {\n  content: "";\n}\n\n.mat-mdc-radio-disabled {\n  cursor: default;\n  pointer-events: none;\n}\n.mat-mdc-radio-disabled.mat-mdc-radio-disabled-interactive {\n  pointer-events: auto;\n}\n\n.mat-mdc-radio-touch-target {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  height: var(--mat-radio-touch-target-size, 48px);\n  width: var(--mat-radio-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n  display: var(--mat-radio-touch-target-display, block);\n}\n[dir=rtl] .mat-mdc-radio-touch-target {\n  left: auto;\n  right: 50%;\n  transform: translate(50%, -50%);\n}\n']
    }]
  }], () => [], {
    id: [{
      type: Input
    }],
    name: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input,
      args: ["aria-label"]
    }],
    ariaLabelledby: [{
      type: Input,
      args: ["aria-labelledby"]
    }],
    ariaDescribedby: [{
      type: Input,
      args: ["aria-describedby"]
    }],
    disableRipple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    tabIndex: [{
      type: Input,
      args: [{
        transform: (value) => value == null ? 0 : numberAttribute(value)
      }]
    }],
    checked: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    value: [{
      type: Input
    }],
    labelPosition: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    required: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    color: [{
      type: Input
    }],
    disabledInteractive: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    change: [{
      type: Output
    }],
    _inputElement: [{
      type: ViewChild,
      args: ["input"]
    }],
    _rippleTrigger: [{
      type: ViewChild,
      args: ["formField", {
        read: ElementRef,
        static: true
      }]
    }]
  });
})();
var MatRadioModule = class _MatRadioModule {
  static \u0275fac = function MatRadioModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatRadioModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatRadioModule,
    imports: [MatRippleModule, MatRadioGroup, MatRadioButton],
    exports: [BidiModule, MatRadioGroup, MatRadioButton]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatRippleModule, MatRadioButton, BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRadioModule, [{
    type: NgModule,
    args: [{
      imports: [MatRippleModule, MatRadioGroup, MatRadioButton],
      exports: [BidiModule, MatRadioGroup, MatRadioButton]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/checkbox.mjs
var _c06 = ["input"];
var _c16 = ["label"];
var _c25 = ["*"];
var checkboxDefaults = {
  color: "accent",
  clickAction: "check-indeterminate",
  disabledInteractive: false
};
var MAT_CHECKBOX_DEFAULT_OPTIONS = new InjectionToken("mat-checkbox-default-options", {
  providedIn: "root",
  factory: () => checkboxDefaults
});
var TransitionCheckState;
(function(TransitionCheckState2) {
  TransitionCheckState2[TransitionCheckState2["Init"] = 0] = "Init";
  TransitionCheckState2[TransitionCheckState2["Checked"] = 1] = "Checked";
  TransitionCheckState2[TransitionCheckState2["Unchecked"] = 2] = "Unchecked";
  TransitionCheckState2[TransitionCheckState2["Indeterminate"] = 3] = "Indeterminate";
})(TransitionCheckState || (TransitionCheckState = {}));
var MatCheckboxChange = class {
  source;
  checked;
};
var MatCheckbox = class _MatCheckbox {
  _elementRef = inject(ElementRef);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _ngZone = inject(NgZone);
  _animationsDisabled = _animationsDisabled();
  _options = inject(MAT_CHECKBOX_DEFAULT_OPTIONS, {
    optional: true
  });
  focus() {
    this._inputElement.nativeElement.focus();
  }
  _createChangeEvent(isChecked) {
    const event = new MatCheckboxChange();
    event.source = this;
    event.checked = isChecked;
    return event;
  }
  _getAnimationTargetElement() {
    return this._inputElement?.nativeElement;
  }
  _animationClasses = {
    uncheckedToChecked: "mdc-checkbox--anim-unchecked-checked",
    uncheckedToIndeterminate: "mdc-checkbox--anim-unchecked-indeterminate",
    checkedToUnchecked: "mdc-checkbox--anim-checked-unchecked",
    checkedToIndeterminate: "mdc-checkbox--anim-checked-indeterminate",
    indeterminateToChecked: "mdc-checkbox--anim-indeterminate-checked",
    indeterminateToUnchecked: "mdc-checkbox--anim-indeterminate-unchecked"
  };
  ariaLabel = "";
  ariaLabelledby = null;
  ariaDescribedby;
  ariaExpanded;
  ariaControls;
  ariaOwns;
  _uniqueId;
  id;
  get inputId() {
    return `${this.id || this._uniqueId}-input`;
  }
  required = false;
  labelPosition = "after";
  name = null;
  change = new EventEmitter();
  indeterminateChange = new EventEmitter();
  value;
  disableRipple = false;
  _inputElement;
  _labelElement;
  tabIndex;
  color;
  disabledInteractive;
  _onTouched = () => {
  };
  _currentAnimationClass = "";
  _currentCheckState = TransitionCheckState.Init;
  _controlValueAccessorChangeFn = () => {
  };
  _validatorChangeFn = () => {
  };
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
    const tabIndex = inject(new HostAttributeToken("tabindex"), {
      optional: true
    });
    this._options = this._options || checkboxDefaults;
    this.color = this._options.color || checkboxDefaults.color;
    this.tabIndex = tabIndex == null ? 0 : parseInt(tabIndex) || 0;
    this.id = this._uniqueId = inject(_IdGenerator).getId("mat-mdc-checkbox-");
    this.disabledInteractive = this._options?.disabledInteractive ?? false;
  }
  ngOnChanges(changes) {
    if (changes["required"]) {
      this._validatorChangeFn();
    }
  }
  ngAfterViewInit() {
    this._syncIndeterminate(this.indeterminate);
  }
  get checked() {
    return this._checked;
  }
  set checked(value) {
    if (value != this.checked) {
      this._checked = value;
      this._changeDetectorRef.markForCheck();
    }
  }
  _checked = false;
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    if (value !== this.disabled) {
      this._disabled = value;
      this._changeDetectorRef.markForCheck();
    }
  }
  _disabled = false;
  get indeterminate() {
    return this._indeterminate();
  }
  set indeterminate(value) {
    const changed = value != this._indeterminate();
    this._indeterminate.set(value);
    if (changed) {
      if (value) {
        this._transitionCheckState(TransitionCheckState.Indeterminate);
      } else {
        this._transitionCheckState(this.checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
      }
      this.indeterminateChange.emit(value);
    }
    this._syncIndeterminate(value);
  }
  _indeterminate = signal(false, ...ngDevMode ? [{
    debugName: "_indeterminate"
  }] : []);
  _isRippleDisabled() {
    return this.disableRipple || this.disabled;
  }
  _onLabelTextChange() {
    this._changeDetectorRef.detectChanges();
  }
  writeValue(value) {
    this.checked = !!value;
  }
  registerOnChange(fn) {
    this._controlValueAccessorChangeFn = fn;
  }
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
  validate(control) {
    return this.required && control.value !== true ? {
      "required": true
    } : null;
  }
  registerOnValidatorChange(fn) {
    this._validatorChangeFn = fn;
  }
  _transitionCheckState(newState) {
    let oldState = this._currentCheckState;
    let element = this._getAnimationTargetElement();
    if (oldState === newState || !element) {
      return;
    }
    if (this._currentAnimationClass) {
      element.classList.remove(this._currentAnimationClass);
    }
    this._currentAnimationClass = this._getAnimationClassForCheckStateTransition(oldState, newState);
    this._currentCheckState = newState;
    if (this._currentAnimationClass.length > 0) {
      element.classList.add(this._currentAnimationClass);
      const animationClass = this._currentAnimationClass;
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          element.classList.remove(animationClass);
        }, 1e3);
      });
    }
  }
  _emitChangeEvent() {
    this._controlValueAccessorChangeFn(this.checked);
    this.change.emit(this._createChangeEvent(this.checked));
    if (this._inputElement) {
      this._inputElement.nativeElement.checked = this.checked;
    }
  }
  toggle() {
    this.checked = !this.checked;
    this._controlValueAccessorChangeFn(this.checked);
  }
  _handleInputClick() {
    const clickAction = this._options?.clickAction;
    if (!this.disabled && clickAction !== "noop") {
      if (this.indeterminate && clickAction !== "check") {
        Promise.resolve().then(() => {
          this._indeterminate.set(false);
          this.indeterminateChange.emit(false);
        });
      }
      this._checked = !this._checked;
      this._transitionCheckState(this._checked ? TransitionCheckState.Checked : TransitionCheckState.Unchecked);
      this._emitChangeEvent();
    } else if (this.disabled && this.disabledInteractive || !this.disabled && clickAction === "noop") {
      this._inputElement.nativeElement.checked = this.checked;
      this._inputElement.nativeElement.indeterminate = this.indeterminate;
    }
  }
  _onInteractionEvent(event) {
    event.stopPropagation();
  }
  _onBlur() {
    Promise.resolve().then(() => {
      this._onTouched();
      this._changeDetectorRef.markForCheck();
    });
  }
  _getAnimationClassForCheckStateTransition(oldState, newState) {
    if (this._animationsDisabled) {
      return "";
    }
    switch (oldState) {
      case TransitionCheckState.Init:
        if (newState === TransitionCheckState.Checked) {
          return this._animationClasses.uncheckedToChecked;
        } else if (newState == TransitionCheckState.Indeterminate) {
          return this._checked ? this._animationClasses.checkedToIndeterminate : this._animationClasses.uncheckedToIndeterminate;
        }
        break;
      case TransitionCheckState.Unchecked:
        return newState === TransitionCheckState.Checked ? this._animationClasses.uncheckedToChecked : this._animationClasses.uncheckedToIndeterminate;
      case TransitionCheckState.Checked:
        return newState === TransitionCheckState.Unchecked ? this._animationClasses.checkedToUnchecked : this._animationClasses.checkedToIndeterminate;
      case TransitionCheckState.Indeterminate:
        return newState === TransitionCheckState.Checked ? this._animationClasses.indeterminateToChecked : this._animationClasses.indeterminateToUnchecked;
    }
    return "";
  }
  _syncIndeterminate(value) {
    const nativeCheckbox = this._inputElement;
    if (nativeCheckbox) {
      nativeCheckbox.nativeElement.indeterminate = value;
    }
  }
  _onInputClick() {
    this._handleInputClick();
  }
  _onTouchTargetClick() {
    this._handleInputClick();
    if (!this.disabled) {
      this._inputElement.nativeElement.focus();
    }
  }
  _preventBubblingFromLabel(event) {
    if (!!event.target && this._labelElement.nativeElement.contains(event.target)) {
      event.stopPropagation();
    }
  }
  static \u0275fac = function MatCheckbox_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCheckbox)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatCheckbox,
    selectors: [["mat-checkbox"]],
    viewQuery: function MatCheckbox_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c06, 5)(_c16, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._inputElement = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._labelElement = _t.first);
      }
    },
    hostAttrs: [1, "mat-mdc-checkbox"],
    hostVars: 16,
    hostBindings: function MatCheckbox_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id);
        \u0275\u0275attribute("tabindex", null)("aria-label", null)("aria-labelledby", null);
        \u0275\u0275classMap(ctx.color ? "mat-" + ctx.color : "mat-accent");
        \u0275\u0275classProp("_mat-animation-noopable", ctx._animationsDisabled)("mdc-checkbox--disabled", ctx.disabled)("mat-mdc-checkbox-disabled", ctx.disabled)("mat-mdc-checkbox-checked", ctx.checked)("mat-mdc-checkbox-disabled-interactive", ctx.disabledInteractive);
      }
    },
    inputs: {
      ariaLabel: [0, "aria-label", "ariaLabel"],
      ariaLabelledby: [0, "aria-labelledby", "ariaLabelledby"],
      ariaDescribedby: [0, "aria-describedby", "ariaDescribedby"],
      ariaExpanded: [2, "aria-expanded", "ariaExpanded", booleanAttribute],
      ariaControls: [0, "aria-controls", "ariaControls"],
      ariaOwns: [0, "aria-owns", "ariaOwns"],
      id: "id",
      required: [2, "required", "required", booleanAttribute],
      labelPosition: "labelPosition",
      name: "name",
      value: "value",
      disableRipple: [2, "disableRipple", "disableRipple", booleanAttribute],
      tabIndex: [2, "tabIndex", "tabIndex", (value) => value == null ? void 0 : numberAttribute(value)],
      color: "color",
      disabledInteractive: [2, "disabledInteractive", "disabledInteractive", booleanAttribute],
      checked: [2, "checked", "checked", booleanAttribute],
      disabled: [2, "disabled", "disabled", booleanAttribute],
      indeterminate: [2, "indeterminate", "indeterminate", booleanAttribute]
    },
    outputs: {
      change: "change",
      indeterminateChange: "indeterminateChange"
    },
    exportAs: ["matCheckbox"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _MatCheckbox),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: _MatCheckbox,
      multi: true
    }]), \u0275\u0275NgOnChangesFeature],
    ngContentSelectors: _c25,
    decls: 15,
    vars: 23,
    consts: [["checkbox", ""], ["input", ""], ["label", ""], ["mat-internal-form-field", "", 3, "click", "labelPosition"], [1, "mdc-checkbox"], ["aria-hidden", "true", 1, "mat-mdc-checkbox-touch-target", 3, "click"], ["type", "checkbox", 1, "mdc-checkbox__native-control", 3, "blur", "click", "change", "checked", "indeterminate", "disabled", "id", "required", "tabIndex"], ["aria-hidden", "true", 1, "mdc-checkbox__ripple"], ["aria-hidden", "true", 1, "mdc-checkbox__background"], ["focusable", "false", "viewBox", "0 0 24 24", 1, "mdc-checkbox__checkmark"], ["fill", "none", "d", "M1.73,12.91 8.1,19.28 22.79,4.59", 1, "mdc-checkbox__checkmark-path"], [1, "mdc-checkbox__mixedmark"], ["mat-ripple", "", "aria-hidden", "true", 1, "mat-mdc-checkbox-ripple", "mat-focus-indicator", 3, "matRippleTrigger", "matRippleDisabled", "matRippleCentered"], [1, "mdc-label", 3, "for"]],
    template: function MatCheckbox_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275elementStart(0, "div", 3);
        \u0275\u0275listener("click", function MatCheckbox_Template_div_click_0_listener($event) {
          return ctx._preventBubblingFromLabel($event);
        });
        \u0275\u0275elementStart(1, "div", 4, 0)(3, "div", 5);
        \u0275\u0275listener("click", function MatCheckbox_Template_div_click_3_listener() {
          return ctx._onTouchTargetClick();
        });
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(4, "input", 6, 1);
        \u0275\u0275listener("blur", function MatCheckbox_Template_input_blur_4_listener() {
          return ctx._onBlur();
        })("click", function MatCheckbox_Template_input_click_4_listener() {
          return ctx._onInputClick();
        })("change", function MatCheckbox_Template_input_change_4_listener($event) {
          return ctx._onInteractionEvent($event);
        });
        \u0275\u0275elementEnd();
        \u0275\u0275element(6, "div", 7);
        \u0275\u0275elementStart(7, "div", 8);
        \u0275\u0275namespaceSVG();
        \u0275\u0275elementStart(8, "svg", 9);
        \u0275\u0275element(9, "path", 10);
        \u0275\u0275elementEnd();
        \u0275\u0275namespaceHTML();
        \u0275\u0275element(10, "div", 11);
        \u0275\u0275elementEnd();
        \u0275\u0275element(11, "div", 12);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(12, "label", 13, 2);
        \u0275\u0275projection(14);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        const checkbox_r1 = \u0275\u0275reference(2);
        \u0275\u0275property("labelPosition", ctx.labelPosition);
        \u0275\u0275advance(4);
        \u0275\u0275classProp("mdc-checkbox--selected", ctx.checked);
        \u0275\u0275property("checked", ctx.checked)("indeterminate", ctx.indeterminate)("disabled", ctx.disabled && !ctx.disabledInteractive)("id", ctx.inputId)("required", ctx.required)("tabIndex", ctx.disabled && !ctx.disabledInteractive ? -1 : ctx.tabIndex);
        \u0275\u0275attribute("aria-label", ctx.ariaLabel || null)("aria-labelledby", ctx.ariaLabelledby)("aria-describedby", ctx.ariaDescribedby)("aria-checked", ctx.indeterminate ? "mixed" : null)("aria-controls", ctx.ariaControls)("aria-disabled", ctx.disabled && ctx.disabledInteractive ? true : null)("aria-expanded", ctx.ariaExpanded)("aria-owns", ctx.ariaOwns)("name", ctx.name)("value", ctx.value);
        \u0275\u0275advance(7);
        \u0275\u0275property("matRippleTrigger", checkbox_r1)("matRippleDisabled", ctx.disableRipple || ctx.disabled)("matRippleCentered", true);
        \u0275\u0275advance();
        \u0275\u0275property("for", ctx.inputId);
      }
    },
    dependencies: [MatRipple, _MatInternalFormField],
    styles: ['.mdc-checkbox {\n  display: inline-block;\n  position: relative;\n  flex: 0 0 18px;\n  box-sizing: content-box;\n  width: 18px;\n  height: 18px;\n  line-height: 0;\n  white-space: nowrap;\n  cursor: pointer;\n  vertical-align: bottom;\n  padding: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n  margin: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n}\n.mdc-checkbox:hover > .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-unselected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox:hover > .mat-mdc-checkbox-ripple > .mat-ripple-element {\n  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox .mdc-checkbox__native-control:focus + .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-unselected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n  background-color: var(--mat-checkbox-unselected-focus-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox .mdc-checkbox__native-control:focus ~ .mat-mdc-checkbox-ripple .mat-ripple-element {\n  background-color: var(--mat-checkbox-unselected-focus-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox:active > .mdc-checkbox__native-control + .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-unselected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n  background-color: var(--mat-checkbox-unselected-pressed-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox:active > .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element {\n  background-color: var(--mat-checkbox-unselected-pressed-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox:hover > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n  background-color: var(--mat-checkbox-selected-hover-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {\n  background-color: var(--mat-checkbox-selected-hover-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox .mdc-checkbox__native-control:focus:checked + .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n  background-color: var(--mat-checkbox-selected-focus-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox .mdc-checkbox__native-control:focus:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {\n  background-color: var(--mat-checkbox-selected-focus-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox:active > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-selected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n  background-color: var(--mat-checkbox-selected-pressed-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox:active > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {\n  background-color: var(--mat-checkbox-selected-pressed-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element,\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control + .mdc-checkbox__ripple {\n  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox .mdc-checkbox__native-control {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  opacity: 0;\n  cursor: inherit;\n  z-index: 1;\n  width: var(--mat-checkbox-state-layer-size, 40px);\n  height: var(--mat-checkbox-state-layer-size, 40px);\n  top: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n  right: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n  left: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n}\n\n.mdc-checkbox--disabled {\n  cursor: default;\n  pointer-events: none;\n}\n\n.mdc-checkbox__background {\n  display: inline-flex;\n  position: absolute;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 18px;\n  height: 18px;\n  border: 2px solid currentColor;\n  border-radius: 2px;\n  background-color: transparent;\n  pointer-events: none;\n  will-change: background-color, border-color;\n  transition: background-color 90ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  -webkit-print-color-adjust: exact;\n  color-adjust: exact;\n  border-color: var(--mat-checkbox-unselected-icon-color, var(--mat-sys-on-surface-variant));\n  top: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n  left: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n}\n\n.mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-checkbox--disabled .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox--disabled .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n\n.mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {\n  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  border-color: transparent;\n}\n@media (forced-colors: active) {\n  .mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,\n  .mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n\n.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:checked) ~ .mdc-checkbox__background,\n.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:indeterminate) ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-unselected-hover-icon-color, var(--mat-sys-on-surface));\n  background-color: transparent;\n}\n\n.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mdc-checkbox:hover > .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-checkbox__native-control:focus:focus:not(:checked) ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:focus:focus:not(:indeterminate) ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-unselected-focus-icon-color, var(--mat-sys-on-surface));\n}\n\n.mdc-checkbox__native-control:focus:focus:checked ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:focus:focus:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,\n  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,\n  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  border-color: transparent;\n}\n\n.mdc-checkbox__checkmark {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  opacity: 0;\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.6, 1);\n  color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox__checkmark {\n    color: CanvasText;\n  }\n}\n\n.mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {\n  color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {\n    color: GrayText;\n  }\n}\n\n.mdc-checkbox__checkmark-path {\n  transition: stroke-dashoffset 180ms cubic-bezier(0.4, 0, 0.6, 1);\n  stroke: currentColor;\n  stroke-width: 3.12px;\n  stroke-dashoffset: 29.7833385;\n  stroke-dasharray: 29.7833385;\n}\n\n.mdc-checkbox__mixedmark {\n  width: 100%;\n  height: 0;\n  transform: scaleX(0) rotate(0deg);\n  border-width: 1px;\n  border-style: solid;\n  opacity: 0;\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  border-color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox__mixedmark {\n    margin: 0 1px;\n  }\n}\n\n.mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {\n  border-color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {\n    border-color: GrayText;\n  }\n}\n\n.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,\n.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,\n.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,\n.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background {\n  animation-duration: 180ms;\n  animation-timing-function: linear;\n}\n\n.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {\n  animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear;\n  transition: none;\n}\n\n.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear;\n  transition: none;\n}\n\n.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {\n  animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear;\n  transition: none;\n}\n\n.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {\n  animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear;\n  transition: none;\n}\n.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear;\n  transition: none;\n}\n\n.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {\n  animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear;\n  transition: none;\n}\n.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear;\n  transition: none;\n}\n\n.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear;\n  transition: none;\n}\n\n.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,\n.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path {\n  stroke-dashoffset: 0;\n}\n\n.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {\n  transition: opacity 180ms cubic-bezier(0, 0, 0.2, 1), transform 180ms cubic-bezier(0, 0, 0.2, 1);\n  opacity: 1;\n}\n.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transform: scaleX(1) rotate(-45deg);\n}\n\n.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {\n  transform: rotate(45deg);\n  opacity: 0;\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transform: scaleX(1) rotate(0deg);\n  opacity: 1;\n}\n\n@keyframes mdc-checkbox-unchecked-checked-checkmark-path {\n  0%, 50% {\n    stroke-dashoffset: 29.7833385;\n  }\n  50% {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  100% {\n    stroke-dashoffset: 0;\n  }\n}\n@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {\n  0%, 68.2% {\n    transform: scaleX(0);\n  }\n  68.2% {\n    animation-timing-function: cubic-bezier(0, 0, 0, 1);\n  }\n  100% {\n    transform: scaleX(1);\n  }\n}\n@keyframes mdc-checkbox-checked-unchecked-checkmark-path {\n  from {\n    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);\n    opacity: 1;\n    stroke-dashoffset: 0;\n  }\n  to {\n    opacity: 0;\n    stroke-dashoffset: -29.7833385;\n  }\n}\n@keyframes mdc-checkbox-checked-indeterminate-checkmark {\n  from {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n  to {\n    transform: rotate(45deg);\n    opacity: 0;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-checked-checkmark {\n  from {\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    transform: rotate(45deg);\n    opacity: 0;\n  }\n  to {\n    transform: rotate(360deg);\n    opacity: 1;\n  }\n}\n@keyframes mdc-checkbox-checked-indeterminate-mixedmark {\n  from {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    transform: rotate(-45deg);\n    opacity: 0;\n  }\n  to {\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-checked-mixedmark {\n  from {\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n  to {\n    transform: rotate(315deg);\n    opacity: 0;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {\n  0% {\n    animation-timing-function: linear;\n    transform: scaleX(1);\n    opacity: 1;\n  }\n  32.8%, 100% {\n    transform: scaleX(0);\n    opacity: 0;\n  }\n}\n.mat-mdc-checkbox {\n  display: inline-block;\n  position: relative;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-touch-target,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__native-control,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__ripple,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-ripple::before,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-checkbox label {\n  cursor: pointer;\n}\n.mat-mdc-checkbox .mat-internal-form-field {\n  color: var(--mat-checkbox-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-checkbox-label-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-checkbox-label-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-checkbox-label-text-size, var(--mat-sys-body-medium-size));\n  letter-spacing: var(--mat-checkbox-label-text-tracking, var(--mat-sys-body-medium-tracking));\n  font-weight: var(--mat-checkbox-label-text-weight, var(--mat-sys-body-medium-weight));\n}\n.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive input {\n  cursor: default;\n}\n.mat-mdc-checkbox.mat-mdc-checkbox-disabled label {\n  cursor: default;\n  color: var(--mat-checkbox-disabled-label-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mat-mdc-checkbox.mat-mdc-checkbox-disabled label {\n    color: GrayText;\n  }\n}\n.mat-mdc-checkbox label:empty {\n  display: none;\n}\n.mat-mdc-checkbox .mdc-checkbox__ripple {\n  opacity: 0;\n}\n\n.mat-mdc-checkbox .mat-mdc-checkbox-ripple,\n.mdc-checkbox__ripple {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n}\n.mat-mdc-checkbox .mat-mdc-checkbox-ripple:not(:empty),\n.mdc-checkbox__ripple:not(:empty) {\n  transform: translateZ(0);\n}\n\n.mat-mdc-checkbox-ripple .mat-ripple-element {\n  opacity: 0.1;\n}\n\n.mat-mdc-checkbox-touch-target {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  height: var(--mat-checkbox-touch-target-size, 48px);\n  width: var(--mat-checkbox-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n  display: var(--mat-checkbox-touch-target-display, block);\n}\n\n.mat-mdc-checkbox .mat-mdc-checkbox-ripple::before {\n  border-radius: 50%;\n}\n\n.mdc-checkbox__native-control:focus-visible ~ .mat-focus-indicator::before {\n  content: "";\n}\n'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCheckbox, [{
    type: Component,
    args: [{
      selector: "mat-checkbox",
      host: {
        "class": "mat-mdc-checkbox",
        "[attr.tabindex]": "null",
        "[attr.aria-label]": "null",
        "[attr.aria-labelledby]": "null",
        "[class._mat-animation-noopable]": "_animationsDisabled",
        "[class.mdc-checkbox--disabled]": "disabled",
        "[id]": "id",
        "[class.mat-mdc-checkbox-disabled]": "disabled",
        "[class.mat-mdc-checkbox-checked]": "checked",
        "[class.mat-mdc-checkbox-disabled-interactive]": "disabledInteractive",
        "[class]": 'color ? "mat-" + color : "mat-accent"'
      },
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MatCheckbox),
        multi: true
      }, {
        provide: NG_VALIDATORS,
        useExisting: MatCheckbox,
        multi: true
      }],
      exportAs: "matCheckbox",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatRipple, _MatInternalFormField],
      template: `<div mat-internal-form-field [labelPosition]="labelPosition" (click)="_preventBubblingFromLabel($event)">
  <div #checkbox class="mdc-checkbox">
    <!-- Render this element first so the input is on top. -->
    <div
      class="mat-mdc-checkbox-touch-target"
      (click)="_onTouchTargetClick()"
      aria-hidden="true"></div>
    <input #input
           type="checkbox"
           class="mdc-checkbox__native-control"
           [class.mdc-checkbox--selected]="checked"
           [attr.aria-label]="ariaLabel || null"
           [attr.aria-labelledby]="ariaLabelledby"
           [attr.aria-describedby]="ariaDescribedby"
           [attr.aria-checked]="indeterminate ? 'mixed' : null"
           [attr.aria-controls]="ariaControls"
           [attr.aria-disabled]="disabled && disabledInteractive ? true : null"
           [attr.aria-expanded]="ariaExpanded"
           [attr.aria-owns]="ariaOwns"
           [attr.name]="name"
           [attr.value]="value"
           [checked]="checked"
           [indeterminate]="indeterminate"
           [disabled]="disabled && !disabledInteractive"
           [id]="inputId"
           [required]="required"
           [tabIndex]="disabled && !disabledInteractive ? -1 : tabIndex"
           (blur)="_onBlur()"
           (click)="_onInputClick()"
           (change)="_onInteractionEvent($event)"/>
    <div class="mdc-checkbox__ripple" aria-hidden="true"></div>
    <div class="mdc-checkbox__background" aria-hidden="true">
      <svg class="mdc-checkbox__checkmark"
           focusable="false"
           viewBox="0 0 24 24">
        <path class="mdc-checkbox__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
      <div class="mdc-checkbox__mixedmark"></div>
    </div>
    <div class="mat-mdc-checkbox-ripple mat-focus-indicator"
      mat-ripple
      aria-hidden="true"
      [matRippleTrigger]="checkbox"
      [matRippleDisabled]="disableRipple || disabled"
      [matRippleCentered]="true"></div>
  </div>
  <!--
    Avoid putting a click handler on the <label/> to fix duplicate navigation stop on Talk Back
    (#14385). Putting a click handler on the <label/> caused this bug because the browser produced
    an unnecessary accessibility tree node.
  -->
  <label class="mdc-label" #label [for]="inputId">
    <ng-content></ng-content>
  </label>
</div>
`,
      styles: ['.mdc-checkbox {\n  display: inline-block;\n  position: relative;\n  flex: 0 0 18px;\n  box-sizing: content-box;\n  width: 18px;\n  height: 18px;\n  line-height: 0;\n  white-space: nowrap;\n  cursor: pointer;\n  vertical-align: bottom;\n  padding: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n  margin: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n}\n.mdc-checkbox:hover > .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-unselected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox:hover > .mat-mdc-checkbox-ripple > .mat-ripple-element {\n  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox .mdc-checkbox__native-control:focus + .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-unselected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n  background-color: var(--mat-checkbox-unselected-focus-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox .mdc-checkbox__native-control:focus ~ .mat-mdc-checkbox-ripple .mat-ripple-element {\n  background-color: var(--mat-checkbox-unselected-focus-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox:active > .mdc-checkbox__native-control + .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-unselected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n  background-color: var(--mat-checkbox-unselected-pressed-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox:active > .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element {\n  background-color: var(--mat-checkbox-unselected-pressed-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox:hover > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));\n  background-color: var(--mat-checkbox-selected-hover-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {\n  background-color: var(--mat-checkbox-selected-hover-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox .mdc-checkbox__native-control:focus:checked + .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));\n  background-color: var(--mat-checkbox-selected-focus-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox .mdc-checkbox__native-control:focus:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {\n  background-color: var(--mat-checkbox-selected-focus-state-layer-color, var(--mat-sys-primary));\n}\n.mdc-checkbox:active > .mdc-checkbox__native-control:checked + .mdc-checkbox__ripple {\n  opacity: var(--mat-checkbox-selected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));\n  background-color: var(--mat-checkbox-selected-pressed-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox:active > .mdc-checkbox__native-control:checked ~ .mat-mdc-checkbox-ripple .mat-ripple-element {\n  background-color: var(--mat-checkbox-selected-pressed-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control ~ .mat-mdc-checkbox-ripple .mat-ripple-element,\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control + .mdc-checkbox__ripple {\n  background-color: var(--mat-checkbox-unselected-hover-state-layer-color, var(--mat-sys-on-surface));\n}\n.mdc-checkbox .mdc-checkbox__native-control {\n  position: absolute;\n  margin: 0;\n  padding: 0;\n  opacity: 0;\n  cursor: inherit;\n  z-index: 1;\n  width: var(--mat-checkbox-state-layer-size, 40px);\n  height: var(--mat-checkbox-state-layer-size, 40px);\n  top: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n  right: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n  left: calc((var(--mat-checkbox-state-layer-size, 40px) - var(--mat-checkbox-state-layer-size, 40px)) / 2);\n}\n\n.mdc-checkbox--disabled {\n  cursor: default;\n  pointer-events: none;\n}\n\n.mdc-checkbox__background {\n  display: inline-flex;\n  position: absolute;\n  align-items: center;\n  justify-content: center;\n  box-sizing: border-box;\n  width: 18px;\n  height: 18px;\n  border: 2px solid currentColor;\n  border-radius: 2px;\n  background-color: transparent;\n  pointer-events: none;\n  will-change: background-color, border-color;\n  transition: background-color 90ms cubic-bezier(0.4, 0, 0.6, 1), border-color 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  -webkit-print-color-adjust: exact;\n  color-adjust: exact;\n  border-color: var(--mat-checkbox-unselected-icon-color, var(--mat-sys-on-surface-variant));\n  top: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n  left: calc((var(--mat-checkbox-state-layer-size, 40px) - 18px) / 2);\n}\n\n.mdc-checkbox__native-control:enabled:checked ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:enabled:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-checkbox--disabled .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox--disabled .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n\n.mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {\n  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  border-color: transparent;\n}\n@media (forced-colors: active) {\n  .mdc-checkbox__native-control:disabled:checked ~ .mdc-checkbox__background,\n  .mdc-checkbox__native-control:disabled:indeterminate ~ .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n\n.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:checked) ~ .mdc-checkbox__background,\n.mdc-checkbox:hover > .mdc-checkbox__native-control:not(:indeterminate) ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-unselected-hover-icon-color, var(--mat-sys-on-surface));\n  background-color: transparent;\n}\n\n.mdc-checkbox:hover > .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mdc-checkbox:hover > .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-hover-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-checkbox__native-control:focus:focus:not(:checked) ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:focus:focus:not(:indeterminate) ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-unselected-focus-icon-color, var(--mat-sys-on-surface));\n}\n\n.mdc-checkbox__native-control:focus:focus:checked ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:focus:focus:indeterminate ~ .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));\n  background-color: var(--mat-checkbox-selected-focus-icon-color, var(--mat-sys-primary));\n}\n\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {\n  border-color: var(--mat-checkbox-disabled-unselected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox:hover > .mdc-checkbox__native-control ~ .mdc-checkbox__background,\n  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox .mdc-checkbox__native-control:focus ~ .mdc-checkbox__background,\n  .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__background {\n    border-color: GrayText;\n  }\n}\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  background-color: var(--mat-checkbox-disabled-selected-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n  border-color: transparent;\n}\n\n.mdc-checkbox__checkmark {\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  opacity: 0;\n  transition: opacity 180ms cubic-bezier(0.4, 0, 0.6, 1);\n  color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox__checkmark {\n    color: CanvasText;\n  }\n}\n\n.mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {\n  color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox--disabled .mdc-checkbox__checkmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__checkmark {\n    color: GrayText;\n  }\n}\n\n.mdc-checkbox__checkmark-path {\n  transition: stroke-dashoffset 180ms cubic-bezier(0.4, 0, 0.6, 1);\n  stroke: currentColor;\n  stroke-width: 3.12px;\n  stroke-dashoffset: 29.7833385;\n  stroke-dasharray: 29.7833385;\n}\n\n.mdc-checkbox__mixedmark {\n  width: 100%;\n  height: 0;\n  transform: scaleX(0) rotate(0deg);\n  border-width: 1px;\n  border-style: solid;\n  opacity: 0;\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n  border-color: var(--mat-checkbox-selected-checkmark-color, var(--mat-sys-on-primary));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox__mixedmark {\n    margin: 0 1px;\n  }\n}\n\n.mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {\n  border-color: var(--mat-checkbox-disabled-selected-checkmark-color, var(--mat-sys-surface));\n}\n@media (forced-colors: active) {\n  .mdc-checkbox--disabled .mdc-checkbox__mixedmark, .mdc-checkbox--disabled.mat-mdc-checkbox-disabled-interactive .mdc-checkbox__mixedmark {\n    border-color: GrayText;\n  }\n}\n\n.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,\n.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,\n.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,\n.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background {\n  animation-duration: 180ms;\n  animation-timing-function: linear;\n}\n\n.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path {\n  animation: mdc-checkbox-unchecked-checked-checkmark-path 180ms linear;\n  transition: none;\n}\n\n.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear;\n  transition: none;\n}\n\n.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path {\n  animation: mdc-checkbox-checked-unchecked-checkmark-path 90ms linear;\n  transition: none;\n}\n\n.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark {\n  animation: mdc-checkbox-checked-indeterminate-checkmark 90ms linear;\n  transition: none;\n}\n.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-checked-indeterminate-mixedmark 90ms linear;\n  transition: none;\n}\n\n.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark {\n  animation: mdc-checkbox-indeterminate-checked-checkmark 500ms linear;\n  transition: none;\n}\n.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-indeterminate-checked-mixedmark 500ms linear;\n  transition: none;\n}\n\n.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark {\n  animation: mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear;\n  transition: none;\n}\n\n.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background,\n.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background {\n  transition: border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1);\n}\n.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,\n.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path {\n  stroke-dashoffset: 0;\n}\n\n.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {\n  transition: opacity 180ms cubic-bezier(0, 0, 0.2, 1), transform 180ms cubic-bezier(0, 0, 0.2, 1);\n  opacity: 1;\n}\n.mdc-checkbox__native-control:checked ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transform: scaleX(1) rotate(-45deg);\n}\n\n.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__checkmark {\n  transform: rotate(45deg);\n  opacity: 0;\n  transition: opacity 90ms cubic-bezier(0.4, 0, 0.6, 1), transform 90ms cubic-bezier(0.4, 0, 0.6, 1);\n}\n.mdc-checkbox__native-control:indeterminate ~ .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transform: scaleX(1) rotate(0deg);\n  opacity: 1;\n}\n\n@keyframes mdc-checkbox-unchecked-checked-checkmark-path {\n  0%, 50% {\n    stroke-dashoffset: 29.7833385;\n  }\n  50% {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n  }\n  100% {\n    stroke-dashoffset: 0;\n  }\n}\n@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark {\n  0%, 68.2% {\n    transform: scaleX(0);\n  }\n  68.2% {\n    animation-timing-function: cubic-bezier(0, 0, 0, 1);\n  }\n  100% {\n    transform: scaleX(1);\n  }\n}\n@keyframes mdc-checkbox-checked-unchecked-checkmark-path {\n  from {\n    animation-timing-function: cubic-bezier(0.4, 0, 1, 1);\n    opacity: 1;\n    stroke-dashoffset: 0;\n  }\n  to {\n    opacity: 0;\n    stroke-dashoffset: -29.7833385;\n  }\n}\n@keyframes mdc-checkbox-checked-indeterminate-checkmark {\n  from {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n  to {\n    transform: rotate(45deg);\n    opacity: 0;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-checked-checkmark {\n  from {\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    transform: rotate(45deg);\n    opacity: 0;\n  }\n  to {\n    transform: rotate(360deg);\n    opacity: 1;\n  }\n}\n@keyframes mdc-checkbox-checked-indeterminate-mixedmark {\n  from {\n    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);\n    transform: rotate(-45deg);\n    opacity: 0;\n  }\n  to {\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-checked-mixedmark {\n  from {\n    animation-timing-function: cubic-bezier(0.14, 0, 0, 1);\n    transform: rotate(0deg);\n    opacity: 1;\n  }\n  to {\n    transform: rotate(315deg);\n    opacity: 0;\n  }\n}\n@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark {\n  0% {\n    animation-timing-function: linear;\n    transform: scaleX(1);\n    opacity: 1;\n  }\n  32.8%, 100% {\n    transform: scaleX(0);\n    opacity: 0;\n  }\n}\n.mat-mdc-checkbox {\n  display: inline-block;\n  position: relative;\n  -webkit-tap-highlight-color: transparent;\n}\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-touch-target,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__native-control,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__ripple,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mat-mdc-checkbox-ripple::before,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__checkmark > .mdc-checkbox__checkmark-path,\n.mat-mdc-checkbox._mat-animation-noopable > .mat-internal-form-field > .mdc-checkbox > .mdc-checkbox__background > .mdc-checkbox__mixedmark {\n  transition: none !important;\n  animation: none !important;\n}\n.mat-mdc-checkbox label {\n  cursor: pointer;\n}\n.mat-mdc-checkbox .mat-internal-form-field {\n  color: var(--mat-checkbox-label-text-color, var(--mat-sys-on-surface));\n  font-family: var(--mat-checkbox-label-text-font, var(--mat-sys-body-medium-font));\n  line-height: var(--mat-checkbox-label-text-line-height, var(--mat-sys-body-medium-line-height));\n  font-size: var(--mat-checkbox-label-text-size, var(--mat-sys-body-medium-size));\n  letter-spacing: var(--mat-checkbox-label-text-tracking, var(--mat-sys-body-medium-tracking));\n  font-weight: var(--mat-checkbox-label-text-weight, var(--mat-sys-body-medium-weight));\n}\n.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive {\n  pointer-events: auto;\n}\n.mat-mdc-checkbox.mat-mdc-checkbox-disabled.mat-mdc-checkbox-disabled-interactive input {\n  cursor: default;\n}\n.mat-mdc-checkbox.mat-mdc-checkbox-disabled label {\n  cursor: default;\n  color: var(--mat-checkbox-disabled-label-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));\n}\n@media (forced-colors: active) {\n  .mat-mdc-checkbox.mat-mdc-checkbox-disabled label {\n    color: GrayText;\n  }\n}\n.mat-mdc-checkbox label:empty {\n  display: none;\n}\n.mat-mdc-checkbox .mdc-checkbox__ripple {\n  opacity: 0;\n}\n\n.mat-mdc-checkbox .mat-mdc-checkbox-ripple,\n.mdc-checkbox__ripple {\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  position: absolute;\n  border-radius: 50%;\n  pointer-events: none;\n}\n.mat-mdc-checkbox .mat-mdc-checkbox-ripple:not(:empty),\n.mdc-checkbox__ripple:not(:empty) {\n  transform: translateZ(0);\n}\n\n.mat-mdc-checkbox-ripple .mat-ripple-element {\n  opacity: 0.1;\n}\n\n.mat-mdc-checkbox-touch-target {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  height: var(--mat-checkbox-touch-target-size, 48px);\n  width: var(--mat-checkbox-touch-target-size, 48px);\n  transform: translate(-50%, -50%);\n  display: var(--mat-checkbox-touch-target-display, block);\n}\n\n.mat-mdc-checkbox .mat-mdc-checkbox-ripple::before {\n  border-radius: 50%;\n}\n\n.mdc-checkbox__native-control:focus-visible ~ .mat-focus-indicator::before {\n  content: "";\n}\n']
    }]
  }], () => [], {
    ariaLabel: [{
      type: Input,
      args: ["aria-label"]
    }],
    ariaLabelledby: [{
      type: Input,
      args: ["aria-labelledby"]
    }],
    ariaDescribedby: [{
      type: Input,
      args: ["aria-describedby"]
    }],
    ariaExpanded: [{
      type: Input,
      args: [{
        alias: "aria-expanded",
        transform: booleanAttribute
      }]
    }],
    ariaControls: [{
      type: Input,
      args: ["aria-controls"]
    }],
    ariaOwns: [{
      type: Input,
      args: ["aria-owns"]
    }],
    id: [{
      type: Input
    }],
    required: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    labelPosition: [{
      type: Input
    }],
    name: [{
      type: Input
    }],
    change: [{
      type: Output
    }],
    indeterminateChange: [{
      type: Output
    }],
    value: [{
      type: Input
    }],
    disableRipple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    _inputElement: [{
      type: ViewChild,
      args: ["input"]
    }],
    _labelElement: [{
      type: ViewChild,
      args: ["label"]
    }],
    tabIndex: [{
      type: Input,
      args: [{
        transform: (value) => value == null ? void 0 : numberAttribute(value)
      }]
    }],
    color: [{
      type: Input
    }],
    disabledInteractive: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    checked: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    indeterminate: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var MatCheckboxModule = class _MatCheckboxModule {
  static \u0275fac = function MatCheckboxModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCheckboxModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatCheckboxModule,
    imports: [MatCheckbox],
    exports: [MatCheckbox, BidiModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatCheckbox, BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCheckboxModule, [{
    type: NgModule,
    args: [{
      imports: [MatCheckbox],
      exports: [MatCheckbox, BidiModule]
    }]
  }], null, null);
})();

// libs/shared/table/entities/src/table.interfaces.ts
var isTextTypeGuard = (attributes) => attributes.type === "text";
var isNumberTypeGuard = (attributes) => attributes.type === "number";
var isSelectTypeGuard = (attributes) => attributes.type === "select";
var isTextareaTypeGuard = (attributes) => attributes.type === "textarea";
var isCheckboxTypeGuard = (attributes) => attributes.type === "checkbox";
var isRadioTypeGuard = (attributes) => attributes.type === "radio";
var isToggleTypeGuard = (attributes) => attributes.type === "toggle";
var isDynamicComponentTypeGuard = (value) => {
  return typeof value === "object" && value !== null && "component" in value;
};
var pageSizeOptions = [15, 25, 50];
var defaultTableConfig = {
  columnProperties: signal([]),
  pagination: signal({
    previousPageIndex: 0,
    pageIndex: 0,
    pageSize: pageSizeOptions[0]
  }),
  paginationVisibility: {
    hideRangeLabel: true,
    hideRangeButtons: true
  },
  count: signal(0)
};
var DEFAULT_TABLE_CONFIG = new InjectionToken("DEFAULT_TABLE_CONFIG", {
  providedIn: "root",
  factory: () => defaultTableConfig
});
var TABLE_TOKEN = new InjectionToken("TABLE_TOKEN");

export {
  MatLabel,
  MatError,
  MatHint,
  MatPrefix,
  MatSuffix,
  MatFormFieldControl,
  MAT_FORM_FIELD,
  MatFormField,
  MatOptgroup,
  MatOption,
  ErrorStateMatcher,
  _ErrorStateTracker,
  MatFormFieldModule,
  MatSelectChange,
  MatSelect,
  MatSelectModule,
  MAT_PAGINATOR_DEFAULT_OPTIONS,
  MatPaginator,
  MatPaginatorModule,
  MAT_INPUT_VALUE_ACCESSOR,
  MatInput,
  MatInputModule,
  isEmpty,
  isNil,
  deepClone,
  _MatInternalFormField,
  MatRadioChange,
  MatRadioGroup,
  MatRadioButton,
  MatRadioModule,
  MatCheckboxChange,
  MatCheckbox,
  MatCheckboxModule,
  isTextTypeGuard,
  isNumberTypeGuard,
  isSelectTypeGuard,
  isTextareaTypeGuard,
  isCheckboxTypeGuard,
  isRadioTypeGuard,
  isToggleTypeGuard,
  isDynamicComponentTypeGuard,
  DEFAULT_TABLE_CONFIG
};
//# sourceMappingURL=chunk-7YAY6RNH.js.map
