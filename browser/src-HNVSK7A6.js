import {
  MatCheckbox,
  MatCheckboxChange,
  MatCheckboxModule,
  MatFormField,
  MatFormFieldModule,
  MatInput,
  MatInputModule,
  MatOption,
  MatPaginator,
  MatPaginatorModule,
  MatPrefix,
  MatRadioButton,
  MatRadioChange,
  MatRadioGroup,
  MatRadioModule,
  MatSelect,
  MatSelectChange,
  MatSelectModule,
  MatSuffix,
  MatTooltip,
  MatTooltipModule,
  _MatInternalFormField,
  isCheckboxTypeGuard,
  isDynamicComponentTypeGuard,
  isEmpty,
  isNil,
  isNumberTypeGuard,
  isRadioTypeGuard,
  isSelectTypeGuard,
  isTextTypeGuard,
  isTextareaTypeGuard,
  isToggleTypeGuard
} from "./chunk-LUCTTFUW.js";
import {
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from "./chunk-XUGZDF2N.js";
import {
  _DisposeViewRepeaterStrategy
} from "./chunk-OFNDAWR2.js";
import {
  CDK_VIRTUAL_SCROLL_VIEWPORT,
  ScrollingModule,
  ViewportRuler
} from "./chunk-U73RIP2J.js";
import {
  DataSource,
  _RecycleViewRepeaterStrategy,
  _ViewRepeaterOperation,
  isDataSource
} from "./chunk-VF2D6VDJ.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-E53OQMM6.js";
import {
  MatButtonModule,
  MatIconButton,
  MatRipple
} from "./chunk-CLHAON7L.js";
import {
  AriaDescriber,
  ENTER,
  FocusMonitor,
  LiveAnnouncer,
  SPACE,
  _IdGenerator,
  _StructuralStylesLoader,
  _animationsDisabled
} from "./chunk-2NA4PHRB.js";
import "./chunk-CF3TMLAM.js";
import {
  DomSanitizer
} from "./chunk-7X22NOTY.js";
import "./chunk-KBRZIECL.js";
import "./chunk-JE5ZVCAC.js";
import {
  BidiModule,
  Directionality
} from "./chunk-AZCQQA2S.js";
import "./chunk-VR2F7UKG.js";
import {
  _isNumberValue
} from "./chunk-JYC222S7.js";
import {
  _CdkPrivateStyleLoader
} from "./chunk-GKQ4FJLQ.js";
import {
  Platform
} from "./chunk-CGEOGME2.js";
import {
  DatePipe,
  PercentPipe,
  TitleCasePipe,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent
} from "./chunk-A7BY5NXF.js";
import {
  BehaviorSubject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DOCUMENT,
  Directive,
  ElementRef,
  EventEmitter,
  HostAttributeToken,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  IterableDiffers,
  LOCALE_ID,
  NgModule,
  Optional,
  Output,
  Pipe,
  ReplaySubject,
  Subject,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
  __spreadValues,
  afterNextRender,
  animationFrameScheduler,
  asapScheduler,
  auditTime,
  booleanAttribute,
  combineLatest,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  isObservable,
  map,
  merge,
  numberAttribute,
  of,
  output,
  setClassMetadata,
  setClassMetadataAsync,
  signal,
  takeUntil,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
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
  ɵɵdeclareLet,
  ɵɵdefer,
  ɵɵdeferOnIdle,
  ɵɵdeferPrefetchWhen,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomProperty,
  ɵɵdomTemplate,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind3,
  ɵɵpipeBind4,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵqueryAdvance,
  ɵɵqueryRefresh,
  ɵɵreadContextLet,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵstoreLet,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery,
  ɵɵviewQuerySignal
} from "./chunk-2OB7EGFP.js";

// node_modules/@angular/cdk/fesm2022/table.mjs
var _c0 = [[["caption"]], [["colgroup"], ["col"]], "*"];
var _c1 = ["caption", "colgroup, col", "*"];
function CdkTable_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0, 2);
  }
}
function CdkTable_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "thead", 0);
    \u0275\u0275elementContainer(1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "tbody", 0);
    \u0275\u0275elementContainer(3, 2)(4, 3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "tfoot", 0);
    \u0275\u0275elementContainer(6, 4);
    \u0275\u0275elementEnd();
  }
}
function CdkTable_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 1)(1, 2)(2, 3)(3, 4);
  }
}
function CdkTextColumn_th_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("text-align", ctx_r0.justify);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.headerText, " ");
  }
}
function CdkTextColumn_td_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const data_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("text-align", ctx_r0.justify);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.dataAccessor(data_r2, ctx_r0.name), " ");
  }
}
var CDK_TABLE = new InjectionToken("CDK_TABLE");
var TEXT_COLUMN_OPTIONS = new InjectionToken("text-column-options");
var CdkCellDef = class _CdkCellDef {
  template = inject(TemplateRef);
  constructor() {
  }
  static \u0275fac = function CdkCellDef_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkCellDef)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkCellDef,
    selectors: [["", "cdkCellDef", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkCellDef, [{
    type: Directive,
    args: [{
      selector: "[cdkCellDef]"
    }]
  }], () => [], null);
})();
var CdkHeaderCellDef = class _CdkHeaderCellDef {
  template = inject(TemplateRef);
  constructor() {
  }
  static \u0275fac = function CdkHeaderCellDef_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkHeaderCellDef)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkHeaderCellDef,
    selectors: [["", "cdkHeaderCellDef", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkHeaderCellDef, [{
    type: Directive,
    args: [{
      selector: "[cdkHeaderCellDef]"
    }]
  }], () => [], null);
})();
var CdkFooterCellDef = class _CdkFooterCellDef {
  template = inject(TemplateRef);
  constructor() {
  }
  static \u0275fac = function CdkFooterCellDef_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkFooterCellDef)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkFooterCellDef,
    selectors: [["", "cdkFooterCellDef", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkFooterCellDef, [{
    type: Directive,
    args: [{
      selector: "[cdkFooterCellDef]"
    }]
  }], () => [], null);
})();
var CdkColumnDef = class _CdkColumnDef {
  _table = inject(CDK_TABLE, {
    optional: true
  });
  _hasStickyChanged = false;
  get name() {
    return this._name;
  }
  set name(name) {
    this._setNameInput(name);
  }
  _name;
  get sticky() {
    return this._sticky;
  }
  set sticky(value) {
    if (value !== this._sticky) {
      this._sticky = value;
      this._hasStickyChanged = true;
    }
  }
  _sticky = false;
  get stickyEnd() {
    return this._stickyEnd;
  }
  set stickyEnd(value) {
    if (value !== this._stickyEnd) {
      this._stickyEnd = value;
      this._hasStickyChanged = true;
    }
  }
  _stickyEnd = false;
  cell;
  headerCell;
  footerCell;
  cssClassFriendlyName;
  _columnCssClassName;
  constructor() {
  }
  hasStickyChanged() {
    const hasStickyChanged = this._hasStickyChanged;
    this.resetStickyChanged();
    return hasStickyChanged;
  }
  resetStickyChanged() {
    this._hasStickyChanged = false;
  }
  _updateColumnCssClassName() {
    this._columnCssClassName = [`cdk-column-${this.cssClassFriendlyName}`];
  }
  _setNameInput(value) {
    if (value) {
      this._name = value;
      this.cssClassFriendlyName = value.replace(/[^a-z0-9_-]/gi, "-");
      this._updateColumnCssClassName();
    }
  }
  static \u0275fac = function CdkColumnDef_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkColumnDef)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkColumnDef,
    selectors: [["", "cdkColumnDef", ""]],
    contentQueries: function CdkColumnDef_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, CdkCellDef, 5)(dirIndex, CdkHeaderCellDef, 5)(dirIndex, CdkFooterCellDef, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.cell = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.headerCell = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.footerCell = _t.first);
      }
    },
    inputs: {
      name: [0, "cdkColumnDef", "name"],
      sticky: [2, "sticky", "sticky", booleanAttribute],
      stickyEnd: [2, "stickyEnd", "stickyEnd", booleanAttribute]
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: "MAT_SORT_HEADER_COLUMN_DEF",
      useExisting: _CdkColumnDef
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkColumnDef, [{
    type: Directive,
    args: [{
      selector: "[cdkColumnDef]",
      providers: [{
        provide: "MAT_SORT_HEADER_COLUMN_DEF",
        useExisting: CdkColumnDef
      }]
    }]
  }], () => [], {
    name: [{
      type: Input,
      args: ["cdkColumnDef"]
    }],
    sticky: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    stickyEnd: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    cell: [{
      type: ContentChild,
      args: [CdkCellDef]
    }],
    headerCell: [{
      type: ContentChild,
      args: [CdkHeaderCellDef]
    }],
    footerCell: [{
      type: ContentChild,
      args: [CdkFooterCellDef]
    }]
  });
})();
var BaseCdkCell = class {
  constructor(columnDef, elementRef) {
    elementRef.nativeElement.classList.add(...columnDef._columnCssClassName);
  }
};
var CdkHeaderCell = class _CdkHeaderCell extends BaseCdkCell {
  constructor() {
    super(inject(CdkColumnDef), inject(ElementRef));
  }
  static \u0275fac = function CdkHeaderCell_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkHeaderCell)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkHeaderCell,
    selectors: [["cdk-header-cell"], ["th", "cdk-header-cell", ""]],
    hostAttrs: ["role", "columnheader", 1, "cdk-header-cell"],
    features: [\u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkHeaderCell, [{
    type: Directive,
    args: [{
      selector: "cdk-header-cell, th[cdk-header-cell]",
      host: {
        "class": "cdk-header-cell",
        "role": "columnheader"
      }
    }]
  }], () => [], null);
})();
var CdkFooterCell = class _CdkFooterCell extends BaseCdkCell {
  constructor() {
    const columnDef = inject(CdkColumnDef);
    const elementRef = inject(ElementRef);
    super(columnDef, elementRef);
    const role = columnDef._table?._getCellRole();
    if (role) {
      elementRef.nativeElement.setAttribute("role", role);
    }
  }
  static \u0275fac = function CdkFooterCell_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkFooterCell)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkFooterCell,
    selectors: [["cdk-footer-cell"], ["td", "cdk-footer-cell", ""]],
    hostAttrs: [1, "cdk-footer-cell"],
    features: [\u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkFooterCell, [{
    type: Directive,
    args: [{
      selector: "cdk-footer-cell, td[cdk-footer-cell]",
      host: {
        "class": "cdk-footer-cell"
      }
    }]
  }], () => [], null);
})();
var CdkCell = class _CdkCell extends BaseCdkCell {
  constructor() {
    const columnDef = inject(CdkColumnDef);
    const elementRef = inject(ElementRef);
    super(columnDef, elementRef);
    const role = columnDef._table?._getCellRole();
    if (role) {
      elementRef.nativeElement.setAttribute("role", role);
    }
  }
  static \u0275fac = function CdkCell_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkCell)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkCell,
    selectors: [["cdk-cell"], ["td", "cdk-cell", ""]],
    hostAttrs: [1, "cdk-cell"],
    features: [\u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkCell, [{
    type: Directive,
    args: [{
      selector: "cdk-cell, td[cdk-cell]",
      host: {
        "class": "cdk-cell"
      }
    }]
  }], () => [], null);
})();
var CDK_ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;
var BaseRowDef = class _BaseRowDef {
  template = inject(TemplateRef);
  _differs = inject(IterableDiffers);
  columns;
  _columnsDiffer;
  constructor() {
  }
  ngOnChanges(changes) {
    if (!this._columnsDiffer) {
      const columns = changes["columns"] && changes["columns"].currentValue || [];
      this._columnsDiffer = this._differs.find(columns).create();
      this._columnsDiffer.diff(columns);
    }
  }
  getColumnsDiff() {
    return this._columnsDiffer.diff(this.columns);
  }
  extractCellTemplate(column) {
    if (this instanceof CdkHeaderRowDef) {
      return column.headerCell.template;
    }
    if (this instanceof CdkFooterRowDef) {
      return column.footerCell.template;
    } else {
      return column.cell.template;
    }
  }
  static \u0275fac = function BaseRowDef_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BaseRowDef)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _BaseRowDef,
    features: [\u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseRowDef, [{
    type: Directive
  }], () => [], null);
})();
var CdkHeaderRowDef = class _CdkHeaderRowDef extends BaseRowDef {
  _table = inject(CDK_TABLE, {
    optional: true
  });
  _hasStickyChanged = false;
  get sticky() {
    return this._sticky;
  }
  set sticky(value) {
    if (value !== this._sticky) {
      this._sticky = value;
      this._hasStickyChanged = true;
    }
  }
  _sticky = false;
  constructor() {
    super(inject(TemplateRef), inject(IterableDiffers));
  }
  ngOnChanges(changes) {
    super.ngOnChanges(changes);
  }
  hasStickyChanged() {
    const hasStickyChanged = this._hasStickyChanged;
    this.resetStickyChanged();
    return hasStickyChanged;
  }
  resetStickyChanged() {
    this._hasStickyChanged = false;
  }
  static \u0275fac = function CdkHeaderRowDef_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkHeaderRowDef)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkHeaderRowDef,
    selectors: [["", "cdkHeaderRowDef", ""]],
    inputs: {
      columns: [0, "cdkHeaderRowDef", "columns"],
      sticky: [2, "cdkHeaderRowDefSticky", "sticky", booleanAttribute]
    },
    features: [\u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkHeaderRowDef, [{
    type: Directive,
    args: [{
      selector: "[cdkHeaderRowDef]",
      inputs: [{
        name: "columns",
        alias: "cdkHeaderRowDef"
      }]
    }]
  }], () => [], {
    sticky: [{
      type: Input,
      args: [{
        alias: "cdkHeaderRowDefSticky",
        transform: booleanAttribute
      }]
    }]
  });
})();
var CdkFooterRowDef = class _CdkFooterRowDef extends BaseRowDef {
  _table = inject(CDK_TABLE, {
    optional: true
  });
  _hasStickyChanged = false;
  get sticky() {
    return this._sticky;
  }
  set sticky(value) {
    if (value !== this._sticky) {
      this._sticky = value;
      this._hasStickyChanged = true;
    }
  }
  _sticky = false;
  constructor() {
    super(inject(TemplateRef), inject(IterableDiffers));
  }
  ngOnChanges(changes) {
    super.ngOnChanges(changes);
  }
  hasStickyChanged() {
    const hasStickyChanged = this._hasStickyChanged;
    this.resetStickyChanged();
    return hasStickyChanged;
  }
  resetStickyChanged() {
    this._hasStickyChanged = false;
  }
  static \u0275fac = function CdkFooterRowDef_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkFooterRowDef)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkFooterRowDef,
    selectors: [["", "cdkFooterRowDef", ""]],
    inputs: {
      columns: [0, "cdkFooterRowDef", "columns"],
      sticky: [2, "cdkFooterRowDefSticky", "sticky", booleanAttribute]
    },
    features: [\u0275\u0275InheritDefinitionFeature, \u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkFooterRowDef, [{
    type: Directive,
    args: [{
      selector: "[cdkFooterRowDef]",
      inputs: [{
        name: "columns",
        alias: "cdkFooterRowDef"
      }]
    }]
  }], () => [], {
    sticky: [{
      type: Input,
      args: [{
        alias: "cdkFooterRowDefSticky",
        transform: booleanAttribute
      }]
    }]
  });
})();
var CdkRowDef = class _CdkRowDef extends BaseRowDef {
  _table = inject(CDK_TABLE, {
    optional: true
  });
  when;
  constructor() {
    super(inject(TemplateRef), inject(IterableDiffers));
  }
  static \u0275fac = function CdkRowDef_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkRowDef)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkRowDef,
    selectors: [["", "cdkRowDef", ""]],
    inputs: {
      columns: [0, "cdkRowDefColumns", "columns"],
      when: [0, "cdkRowDefWhen", "when"]
    },
    features: [\u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkRowDef, [{
    type: Directive,
    args: [{
      selector: "[cdkRowDef]",
      inputs: [{
        name: "columns",
        alias: "cdkRowDefColumns"
      }, {
        name: "when",
        alias: "cdkRowDefWhen"
      }]
    }]
  }], () => [], null);
})();
var CdkCellOutlet = class _CdkCellOutlet {
  _viewContainer = inject(ViewContainerRef);
  cells;
  context;
  static mostRecentCellOutlet = null;
  constructor() {
    _CdkCellOutlet.mostRecentCellOutlet = this;
  }
  ngOnDestroy() {
    if (_CdkCellOutlet.mostRecentCellOutlet === this) {
      _CdkCellOutlet.mostRecentCellOutlet = null;
    }
  }
  static \u0275fac = function CdkCellOutlet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkCellOutlet)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkCellOutlet,
    selectors: [["", "cdkCellOutlet", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkCellOutlet, [{
    type: Directive,
    args: [{
      selector: "[cdkCellOutlet]"
    }]
  }], () => [], null);
})();
var CdkHeaderRow = class _CdkHeaderRow {
  static \u0275fac = function CdkHeaderRow_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkHeaderRow)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _CdkHeaderRow,
    selectors: [["cdk-header-row"], ["tr", "cdk-header-row", ""]],
    hostAttrs: ["role", "row", 1, "cdk-header-row"],
    decls: 1,
    vars: 0,
    consts: [["cdkCellOutlet", ""]],
    template: function CdkHeaderRow_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementContainer(0, 0);
      }
    },
    dependencies: [CdkCellOutlet],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkHeaderRow, [{
    type: Component,
    args: [{
      selector: "cdk-header-row, tr[cdk-header-row]",
      template: CDK_ROW_TEMPLATE,
      host: {
        "class": "cdk-header-row",
        "role": "row"
      },
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      imports: [CdkCellOutlet]
    }]
  }], null, null);
})();
var CdkFooterRow = class _CdkFooterRow {
  static \u0275fac = function CdkFooterRow_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkFooterRow)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _CdkFooterRow,
    selectors: [["cdk-footer-row"], ["tr", "cdk-footer-row", ""]],
    hostAttrs: ["role", "row", 1, "cdk-footer-row"],
    decls: 1,
    vars: 0,
    consts: [["cdkCellOutlet", ""]],
    template: function CdkFooterRow_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementContainer(0, 0);
      }
    },
    dependencies: [CdkCellOutlet],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkFooterRow, [{
    type: Component,
    args: [{
      selector: "cdk-footer-row, tr[cdk-footer-row]",
      template: CDK_ROW_TEMPLATE,
      host: {
        "class": "cdk-footer-row",
        "role": "row"
      },
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      imports: [CdkCellOutlet]
    }]
  }], null, null);
})();
var CdkRow = class _CdkRow {
  static \u0275fac = function CdkRow_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkRow)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _CdkRow,
    selectors: [["cdk-row"], ["tr", "cdk-row", ""]],
    hostAttrs: ["role", "row", 1, "cdk-row"],
    decls: 1,
    vars: 0,
    consts: [["cdkCellOutlet", ""]],
    template: function CdkRow_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementContainer(0, 0);
      }
    },
    dependencies: [CdkCellOutlet],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkRow, [{
    type: Component,
    args: [{
      selector: "cdk-row, tr[cdk-row]",
      template: CDK_ROW_TEMPLATE,
      host: {
        "class": "cdk-row",
        "role": "row"
      },
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      imports: [CdkCellOutlet]
    }]
  }], null, null);
})();
var CdkNoDataRow = class _CdkNoDataRow {
  templateRef = inject(TemplateRef);
  _contentClassNames = ["cdk-no-data-row", "cdk-row"];
  _cellClassNames = ["cdk-cell", "cdk-no-data-cell"];
  _cellSelector = "td, cdk-cell, [cdk-cell], .cdk-cell";
  constructor() {
  }
  static \u0275fac = function CdkNoDataRow_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkNoDataRow)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkNoDataRow,
    selectors: [["ng-template", "cdkNoDataRow", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkNoDataRow, [{
    type: Directive,
    args: [{
      selector: "ng-template[cdkNoDataRow]"
    }]
  }], () => [], null);
})();
var STICKY_DIRECTIONS = ["top", "bottom", "left", "right"];
var StickyStyler = class {
  _isNativeHtmlTable;
  _stickCellCss;
  _isBrowser;
  _needsPositionStickyOnElement;
  direction;
  _positionListener;
  _tableInjector;
  _elemSizeCache = /* @__PURE__ */ new WeakMap();
  _resizeObserver = globalThis?.ResizeObserver ? new globalThis.ResizeObserver((entries) => this._updateCachedSizes(entries)) : null;
  _updatedStickyColumnsParamsToReplay = [];
  _stickyColumnsReplayTimeout = null;
  _cachedCellWidths = [];
  _borderCellCss;
  _destroyed = false;
  constructor(_isNativeHtmlTable, _stickCellCss, _isBrowser = true, _needsPositionStickyOnElement = true, direction, _positionListener, _tableInjector) {
    this._isNativeHtmlTable = _isNativeHtmlTable;
    this._stickCellCss = _stickCellCss;
    this._isBrowser = _isBrowser;
    this._needsPositionStickyOnElement = _needsPositionStickyOnElement;
    this.direction = direction;
    this._positionListener = _positionListener;
    this._tableInjector = _tableInjector;
    this._borderCellCss = {
      "top": `${_stickCellCss}-border-elem-top`,
      "bottom": `${_stickCellCss}-border-elem-bottom`,
      "left": `${_stickCellCss}-border-elem-left`,
      "right": `${_stickCellCss}-border-elem-right`
    };
  }
  clearStickyPositioning(rows, stickyDirections) {
    if (stickyDirections.includes("left") || stickyDirections.includes("right")) {
      this._removeFromStickyColumnReplayQueue(rows);
    }
    const elementsToClear = [];
    for (const row of rows) {
      if (row.nodeType !== row.ELEMENT_NODE) {
        continue;
      }
      elementsToClear.push(row, ...Array.from(row.children));
    }
    afterNextRender({
      write: () => {
        for (const element of elementsToClear) {
          this._removeStickyStyle(element, stickyDirections);
        }
      }
    }, {
      injector: this._tableInjector
    });
  }
  updateStickyColumns(rows, stickyStartStates, stickyEndStates, recalculateCellWidths = true, replay = true) {
    if (!rows.length || !this._isBrowser || !(stickyStartStates.some((state) => state) || stickyEndStates.some((state) => state))) {
      this._positionListener?.stickyColumnsUpdated({
        sizes: []
      });
      this._positionListener?.stickyEndColumnsUpdated({
        sizes: []
      });
      return;
    }
    const firstRow = rows[0];
    const numCells = firstRow.children.length;
    const isRtl = this.direction === "rtl";
    const start = isRtl ? "right" : "left";
    const end = isRtl ? "left" : "right";
    const lastStickyStart = stickyStartStates.lastIndexOf(true);
    const firstStickyEnd = stickyEndStates.indexOf(true);
    let cellWidths;
    let startPositions;
    let endPositions;
    if (replay) {
      this._updateStickyColumnReplayQueue({
        rows: [...rows],
        stickyStartStates: [...stickyStartStates],
        stickyEndStates: [...stickyEndStates]
      });
    }
    afterNextRender({
      earlyRead: () => {
        cellWidths = this._getCellWidths(firstRow, recalculateCellWidths);
        startPositions = this._getStickyStartColumnPositions(cellWidths, stickyStartStates);
        endPositions = this._getStickyEndColumnPositions(cellWidths, stickyEndStates);
      },
      write: () => {
        for (const row of rows) {
          for (let i = 0; i < numCells; i++) {
            const cell = row.children[i];
            if (stickyStartStates[i]) {
              this._addStickyStyle(cell, start, startPositions[i], i === lastStickyStart);
            }
            if (stickyEndStates[i]) {
              this._addStickyStyle(cell, end, endPositions[i], i === firstStickyEnd);
            }
          }
        }
        if (this._positionListener && cellWidths.some((w) => !!w)) {
          this._positionListener.stickyColumnsUpdated({
            sizes: lastStickyStart === -1 ? [] : cellWidths.slice(0, lastStickyStart + 1).map((width, index) => stickyStartStates[index] ? width : null)
          });
          this._positionListener.stickyEndColumnsUpdated({
            sizes: firstStickyEnd === -1 ? [] : cellWidths.slice(firstStickyEnd).map((width, index) => stickyEndStates[index + firstStickyEnd] ? width : null).reverse()
          });
        }
      }
    }, {
      injector: this._tableInjector
    });
  }
  stickRows(rowsToStick, stickyStates, position) {
    if (!this._isBrowser) {
      return;
    }
    const rows = position === "bottom" ? rowsToStick.slice().reverse() : rowsToStick;
    const states = position === "bottom" ? stickyStates.slice().reverse() : stickyStates;
    const stickyOffsets = [];
    const stickyCellHeights = [];
    const elementsToStick = [];
    afterNextRender({
      earlyRead: () => {
        for (let rowIndex = 0, stickyOffset = 0; rowIndex < rows.length; rowIndex++) {
          if (!states[rowIndex]) {
            continue;
          }
          stickyOffsets[rowIndex] = stickyOffset;
          const row = rows[rowIndex];
          elementsToStick[rowIndex] = this._isNativeHtmlTable ? Array.from(row.children) : [row];
          const height = this._retrieveElementSize(row).height;
          stickyOffset += height;
          stickyCellHeights[rowIndex] = height;
        }
      },
      write: () => {
        const borderedRowIndex = states.lastIndexOf(true);
        for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
          if (!states[rowIndex]) {
            continue;
          }
          const offset = stickyOffsets[rowIndex];
          const isBorderedRowIndex = rowIndex === borderedRowIndex;
          for (const element of elementsToStick[rowIndex]) {
            this._addStickyStyle(element, position, offset, isBorderedRowIndex);
          }
        }
        if (position === "top") {
          this._positionListener?.stickyHeaderRowsUpdated({
            sizes: stickyCellHeights,
            offsets: stickyOffsets,
            elements: elementsToStick
          });
        } else {
          this._positionListener?.stickyFooterRowsUpdated({
            sizes: stickyCellHeights,
            offsets: stickyOffsets,
            elements: elementsToStick
          });
        }
      }
    }, {
      injector: this._tableInjector
    });
  }
  updateStickyFooterContainer(tableElement, stickyStates) {
    if (!this._isNativeHtmlTable) {
      return;
    }
    afterNextRender({
      write: () => {
        const tfoot = tableElement.querySelector("tfoot");
        if (tfoot) {
          if (stickyStates.some((state) => !state)) {
            this._removeStickyStyle(tfoot, ["bottom"]);
          } else {
            this._addStickyStyle(tfoot, "bottom", 0, false);
          }
        }
      }
    }, {
      injector: this._tableInjector
    });
  }
  destroy() {
    if (this._stickyColumnsReplayTimeout) {
      clearTimeout(this._stickyColumnsReplayTimeout);
    }
    this._resizeObserver?.disconnect();
    this._destroyed = true;
  }
  _removeStickyStyle(element, stickyDirections) {
    if (!element.classList.contains(this._stickCellCss)) {
      return;
    }
    for (const dir of stickyDirections) {
      element.style[dir] = "";
      element.classList.remove(this._borderCellCss[dir]);
    }
    const hasDirection = STICKY_DIRECTIONS.some((dir) => stickyDirections.indexOf(dir) === -1 && element.style[dir]);
    if (hasDirection) {
      element.style.zIndex = this._getCalculatedZIndex(element);
    } else {
      element.style.zIndex = "";
      if (this._needsPositionStickyOnElement) {
        element.style.position = "";
      }
      element.classList.remove(this._stickCellCss);
    }
  }
  _addStickyStyle(element, dir, dirValue, isBorderElement) {
    element.classList.add(this._stickCellCss);
    if (isBorderElement) {
      element.classList.add(this._borderCellCss[dir]);
    }
    element.style[dir] = `${dirValue}px`;
    element.style.zIndex = this._getCalculatedZIndex(element);
    if (this._needsPositionStickyOnElement) {
      element.style.cssText += "position: -webkit-sticky; position: sticky; ";
    }
  }
  _getCalculatedZIndex(element) {
    const zIndexIncrements = {
      top: 100,
      bottom: 10,
      left: 1,
      right: 1
    };
    let zIndex = 0;
    for (const dir of STICKY_DIRECTIONS) {
      if (element.style[dir]) {
        zIndex += zIndexIncrements[dir];
      }
    }
    return zIndex ? `${zIndex}` : "";
  }
  _getCellWidths(row, recalculateCellWidths = true) {
    if (!recalculateCellWidths && this._cachedCellWidths.length) {
      return this._cachedCellWidths;
    }
    const cellWidths = [];
    const firstRowCells = row.children;
    for (let i = 0; i < firstRowCells.length; i++) {
      const cell = firstRowCells[i];
      cellWidths.push(this._retrieveElementSize(cell).width);
    }
    this._cachedCellWidths = cellWidths;
    return cellWidths;
  }
  _getStickyStartColumnPositions(widths, stickyStates) {
    const positions = [];
    let nextPosition = 0;
    for (let i = 0; i < widths.length; i++) {
      if (stickyStates[i]) {
        positions[i] = nextPosition;
        nextPosition += widths[i];
      }
    }
    return positions;
  }
  _getStickyEndColumnPositions(widths, stickyStates) {
    const positions = [];
    let nextPosition = 0;
    for (let i = widths.length; i > 0; i--) {
      if (stickyStates[i]) {
        positions[i] = nextPosition;
        nextPosition += widths[i];
      }
    }
    return positions;
  }
  _retrieveElementSize(element) {
    const cachedSize = this._elemSizeCache.get(element);
    if (cachedSize) {
      return cachedSize;
    }
    const clientRect = element.getBoundingClientRect();
    const size = {
      width: clientRect.width,
      height: clientRect.height
    };
    if (!this._resizeObserver) {
      return size;
    }
    this._elemSizeCache.set(element, size);
    this._resizeObserver.observe(element, {
      box: "border-box"
    });
    return size;
  }
  _updateStickyColumnReplayQueue(params) {
    this._removeFromStickyColumnReplayQueue(params.rows);
    if (!this._stickyColumnsReplayTimeout) {
      this._updatedStickyColumnsParamsToReplay.push(params);
    }
  }
  _removeFromStickyColumnReplayQueue(rows) {
    const rowsSet = new Set(rows);
    for (const update of this._updatedStickyColumnsParamsToReplay) {
      update.rows = update.rows.filter((row) => !rowsSet.has(row));
    }
    this._updatedStickyColumnsParamsToReplay = this._updatedStickyColumnsParamsToReplay.filter((update) => !!update.rows.length);
  }
  _updateCachedSizes(entries) {
    let needsColumnUpdate = false;
    for (const entry of entries) {
      const newEntry = entry.borderBoxSize?.length ? {
        width: entry.borderBoxSize[0].inlineSize,
        height: entry.borderBoxSize[0].blockSize
      } : {
        width: entry.contentRect.width,
        height: entry.contentRect.height
      };
      if (newEntry.width !== this._elemSizeCache.get(entry.target)?.width && isCell(entry.target)) {
        needsColumnUpdate = true;
      }
      this._elemSizeCache.set(entry.target, newEntry);
    }
    if (needsColumnUpdate && this._updatedStickyColumnsParamsToReplay.length) {
      if (this._stickyColumnsReplayTimeout) {
        clearTimeout(this._stickyColumnsReplayTimeout);
      }
      this._stickyColumnsReplayTimeout = setTimeout(() => {
        if (this._destroyed) {
          return;
        }
        for (const update of this._updatedStickyColumnsParamsToReplay) {
          this.updateStickyColumns(update.rows, update.stickyStartStates, update.stickyEndStates, true, false);
        }
        this._updatedStickyColumnsParamsToReplay = [];
        this._stickyColumnsReplayTimeout = null;
      }, 0);
    }
  }
};
function isCell(element) {
  return ["cdk-cell", "cdk-header-cell", "cdk-footer-cell"].some((klass) => element.classList.contains(klass));
}
function getTableUnknownColumnError(id) {
  return Error(`Could not find column with id "${id}".`);
}
function getTableDuplicateColumnNameError(name) {
  return Error(`Duplicate column definition name provided: "${name}".`);
}
function getTableMultipleDefaultRowDefsError() {
  return Error(`There can only be one default row without a when predicate function. Or set \`multiTemplateDataRows\`.`);
}
function getTableMissingMatchingRowDefError(data) {
  return Error(`Could not find a matching row definition for the provided row data: ${JSON.stringify(data)}`);
}
function getTableMissingRowDefsError() {
  return Error("Missing definitions for header, footer, and row; cannot determine which columns should be rendered.");
}
function getTableUnknownDataSourceError() {
  return Error(`Provided data source did not match an array, Observable, or DataSource`);
}
function getTableTextColumnMissingParentTableError() {
  return Error(`Text column could not find a parent table for registration.`);
}
function getTableTextColumnMissingNameError() {
  return Error(`Table text column must have a name.`);
}
var STICKY_POSITIONING_LISTENER = new InjectionToken("STICKY_POSITIONING_LISTENER");
var CdkRecycleRows = class _CdkRecycleRows {
  static \u0275fac = function CdkRecycleRows_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkRecycleRows)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _CdkRecycleRows,
    selectors: [["cdk-table", "recycleRows", ""], ["table", "cdk-table", "", "recycleRows", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkRecycleRows, [{
    type: Directive,
    args: [{
      selector: "cdk-table[recycleRows], table[cdk-table][recycleRows]"
    }]
  }], null, null);
})();
var DataRowOutlet = class _DataRowOutlet {
  viewContainer = inject(ViewContainerRef);
  elementRef = inject(ElementRef);
  constructor() {
    const table = inject(CDK_TABLE);
    table._rowOutlet = this;
    table._outletAssigned();
  }
  static \u0275fac = function DataRowOutlet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DataRowOutlet)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _DataRowOutlet,
    selectors: [["", "rowOutlet", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataRowOutlet, [{
    type: Directive,
    args: [{
      selector: "[rowOutlet]"
    }]
  }], () => [], null);
})();
var HeaderRowOutlet = class _HeaderRowOutlet {
  viewContainer = inject(ViewContainerRef);
  elementRef = inject(ElementRef);
  constructor() {
    const table = inject(CDK_TABLE);
    table._headerRowOutlet = this;
    table._outletAssigned();
  }
  static \u0275fac = function HeaderRowOutlet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HeaderRowOutlet)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _HeaderRowOutlet,
    selectors: [["", "headerRowOutlet", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderRowOutlet, [{
    type: Directive,
    args: [{
      selector: "[headerRowOutlet]"
    }]
  }], () => [], null);
})();
var FooterRowOutlet = class _FooterRowOutlet {
  viewContainer = inject(ViewContainerRef);
  elementRef = inject(ElementRef);
  constructor() {
    const table = inject(CDK_TABLE);
    table._footerRowOutlet = this;
    table._outletAssigned();
  }
  static \u0275fac = function FooterRowOutlet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _FooterRowOutlet)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _FooterRowOutlet,
    selectors: [["", "footerRowOutlet", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FooterRowOutlet, [{
    type: Directive,
    args: [{
      selector: "[footerRowOutlet]"
    }]
  }], () => [], null);
})();
var NoDataRowOutlet = class _NoDataRowOutlet {
  viewContainer = inject(ViewContainerRef);
  elementRef = inject(ElementRef);
  constructor() {
    const table = inject(CDK_TABLE);
    table._noDataRowOutlet = this;
    table._outletAssigned();
  }
  static \u0275fac = function NoDataRowOutlet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NoDataRowOutlet)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _NoDataRowOutlet,
    selectors: [["", "noDataRowOutlet", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoDataRowOutlet, [{
    type: Directive,
    args: [{
      selector: "[noDataRowOutlet]"
    }]
  }], () => [], null);
})();
var CdkTable = class _CdkTable {
  _differs = inject(IterableDiffers);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _elementRef = inject(ElementRef);
  _dir = inject(Directionality, {
    optional: true
  });
  _platform = inject(Platform);
  _viewRepeater;
  _viewportRuler = inject(ViewportRuler);
  _injector = inject(Injector);
  _virtualScrollViewport = inject(CDK_VIRTUAL_SCROLL_VIEWPORT, {
    optional: true,
    host: true
  });
  _positionListener = inject(STICKY_POSITIONING_LISTENER, {
    optional: true
  }) || inject(STICKY_POSITIONING_LISTENER, {
    optional: true,
    skipSelf: true
  });
  _document = inject(DOCUMENT);
  _data;
  _renderedRange;
  _onDestroy = new Subject();
  _renderRows;
  _renderChangeSubscription = null;
  _columnDefsByName = /* @__PURE__ */ new Map();
  _rowDefs;
  _headerRowDefs;
  _footerRowDefs;
  _dataDiffer;
  _defaultRowDef = null;
  _customColumnDefs = /* @__PURE__ */ new Set();
  _customRowDefs = /* @__PURE__ */ new Set();
  _customHeaderRowDefs = /* @__PURE__ */ new Set();
  _customFooterRowDefs = /* @__PURE__ */ new Set();
  _customNoDataRow = null;
  _headerRowDefChanged = true;
  _footerRowDefChanged = true;
  _stickyColumnStylesNeedReset = true;
  _forceRecalculateCellWidths = true;
  _cachedRenderRowsMap = /* @__PURE__ */ new Map();
  _isNativeHtmlTable;
  _stickyStyler;
  stickyCssClass = "cdk-table-sticky";
  needsPositionStickyOnElement = true;
  _isServer;
  _isShowingNoDataRow = false;
  _hasAllOutlets = false;
  _hasInitialized = false;
  _headerRowStickyUpdates = new Subject();
  _footerRowStickyUpdates = new Subject();
  _disableVirtualScrolling = false;
  _getCellRole() {
    if (this._cellRoleInternal === void 0) {
      const tableRole = this._elementRef.nativeElement.getAttribute("role");
      return tableRole === "grid" || tableRole === "treegrid" ? "gridcell" : "cell";
    }
    return this._cellRoleInternal;
  }
  _cellRoleInternal = void 0;
  get trackBy() {
    return this._trackByFn;
  }
  set trackBy(fn) {
    if ((typeof ngDevMode === "undefined" || ngDevMode) && fn != null && typeof fn !== "function") {
      console.warn(`trackBy must be a function, but received ${JSON.stringify(fn)}.`);
    }
    this._trackByFn = fn;
  }
  _trackByFn;
  get dataSource() {
    return this._dataSource;
  }
  set dataSource(dataSource) {
    if (this._dataSource !== dataSource) {
      this._switchDataSource(dataSource);
      this._changeDetectorRef.markForCheck();
    }
  }
  _dataSource;
  _dataSourceChanges = new Subject();
  _dataStream = new Subject();
  get multiTemplateDataRows() {
    return this._multiTemplateDataRows;
  }
  set multiTemplateDataRows(value) {
    this._multiTemplateDataRows = value;
    if (this._rowOutlet && this._rowOutlet.viewContainer.length) {
      this._forceRenderDataRows();
      this.updateStickyColumnStyles();
    }
  }
  _multiTemplateDataRows = false;
  get fixedLayout() {
    return this._virtualScrollEnabled() ? true : this._fixedLayout;
  }
  set fixedLayout(value) {
    this._fixedLayout = value;
    this._forceRecalculateCellWidths = true;
    this._stickyColumnStylesNeedReset = true;
  }
  _fixedLayout = false;
  recycleRows = false;
  contentChanged = new EventEmitter();
  viewChange = new BehaviorSubject({
    start: 0,
    end: Number.MAX_VALUE
  });
  _rowOutlet;
  _headerRowOutlet;
  _footerRowOutlet;
  _noDataRowOutlet;
  _contentColumnDefs;
  _contentRowDefs;
  _contentHeaderRowDefs;
  _contentFooterRowDefs;
  _noDataRow;
  constructor() {
    const role = inject(new HostAttributeToken("role"), {
      optional: true
    });
    if (!role) {
      this._elementRef.nativeElement.setAttribute("role", "table");
    }
    this._isServer = !this._platform.isBrowser;
    this._isNativeHtmlTable = this._elementRef.nativeElement.nodeName === "TABLE";
    this._dataDiffer = this._differs.find([]).create((_i, dataRow) => {
      return this.trackBy ? this.trackBy(dataRow.dataIndex, dataRow.data) : dataRow;
    });
  }
  ngOnInit() {
    this._setupStickyStyler();
    this._viewportRuler.change().pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this._forceRecalculateCellWidths = true;
    });
  }
  ngAfterContentInit() {
    this._viewRepeater = this.recycleRows || this._virtualScrollEnabled() ? new _RecycleViewRepeaterStrategy() : new _DisposeViewRepeaterStrategy();
    if (this._virtualScrollEnabled()) {
      this._setupVirtualScrolling(this._virtualScrollViewport);
    }
    this._hasInitialized = true;
  }
  ngAfterContentChecked() {
    if (this._canRender()) {
      this._render();
    }
  }
  ngOnDestroy() {
    this._stickyStyler?.destroy();
    [this._rowOutlet?.viewContainer, this._headerRowOutlet?.viewContainer, this._footerRowOutlet?.viewContainer, this._cachedRenderRowsMap, this._customColumnDefs, this._customRowDefs, this._customHeaderRowDefs, this._customFooterRowDefs, this._columnDefsByName].forEach((def) => {
      def?.clear();
    });
    this._headerRowDefs = [];
    this._footerRowDefs = [];
    this._defaultRowDef = null;
    this._headerRowStickyUpdates.complete();
    this._footerRowStickyUpdates.complete();
    this._onDestroy.next();
    this._onDestroy.complete();
    if (isDataSource(this.dataSource)) {
      this.dataSource.disconnect(this);
    }
  }
  renderRows() {
    this._renderRows = this._getAllRenderRows();
    const changes = this._dataDiffer.diff(this._renderRows);
    if (!changes) {
      this._updateNoDataRow();
      this.contentChanged.next();
      return;
    }
    const viewContainer = this._rowOutlet.viewContainer;
    this._viewRepeater.applyChanges(changes, viewContainer, (record, _adjustedPreviousIndex, currentIndex) => this._getEmbeddedViewArgs(record.item, currentIndex), (record) => record.item.data, (change) => {
      if (change.operation === _ViewRepeaterOperation.INSERTED && change.context) {
        this._renderCellTemplateForItem(change.record.item.rowDef, change.context);
      }
    });
    this._updateRowIndexContext();
    changes.forEachIdentityChange((record) => {
      const rowView = viewContainer.get(record.currentIndex);
      rowView.context.$implicit = record.item.data;
    });
    this._updateNoDataRow();
    this.contentChanged.next();
    this.updateStickyColumnStyles();
  }
  addColumnDef(columnDef) {
    this._customColumnDefs.add(columnDef);
  }
  removeColumnDef(columnDef) {
    this._customColumnDefs.delete(columnDef);
  }
  addRowDef(rowDef) {
    this._customRowDefs.add(rowDef);
  }
  removeRowDef(rowDef) {
    this._customRowDefs.delete(rowDef);
  }
  addHeaderRowDef(headerRowDef) {
    this._customHeaderRowDefs.add(headerRowDef);
    this._headerRowDefChanged = true;
  }
  removeHeaderRowDef(headerRowDef) {
    this._customHeaderRowDefs.delete(headerRowDef);
    this._headerRowDefChanged = true;
  }
  addFooterRowDef(footerRowDef) {
    this._customFooterRowDefs.add(footerRowDef);
    this._footerRowDefChanged = true;
  }
  removeFooterRowDef(footerRowDef) {
    this._customFooterRowDefs.delete(footerRowDef);
    this._footerRowDefChanged = true;
  }
  setNoDataRow(noDataRow) {
    this._customNoDataRow = noDataRow;
  }
  updateStickyHeaderRowStyles() {
    const headerRows = this._getRenderedRows(this._headerRowOutlet);
    if (this._isNativeHtmlTable) {
      const thead = closestTableSection(this._headerRowOutlet, "thead");
      if (thead) {
        thead.style.display = headerRows.length ? "" : "none";
      }
    }
    const stickyStates = this._headerRowDefs.map((def) => def.sticky);
    this._stickyStyler.clearStickyPositioning(headerRows, ["top"]);
    this._stickyStyler.stickRows(headerRows, stickyStates, "top");
    this._headerRowDefs.forEach((def) => def.resetStickyChanged());
  }
  updateStickyFooterRowStyles() {
    const footerRows = this._getRenderedRows(this._footerRowOutlet);
    if (this._isNativeHtmlTable) {
      const tfoot = closestTableSection(this._footerRowOutlet, "tfoot");
      if (tfoot) {
        tfoot.style.display = footerRows.length ? "" : "none";
      }
    }
    const stickyStates = this._footerRowDefs.map((def) => def.sticky);
    this._stickyStyler.clearStickyPositioning(footerRows, ["bottom"]);
    this._stickyStyler.stickRows(footerRows, stickyStates, "bottom");
    this._stickyStyler.updateStickyFooterContainer(this._elementRef.nativeElement, stickyStates);
    this._footerRowDefs.forEach((def) => def.resetStickyChanged());
  }
  updateStickyColumnStyles() {
    const headerRows = this._getRenderedRows(this._headerRowOutlet);
    const dataRows = this._getRenderedRows(this._rowOutlet);
    const footerRows = this._getRenderedRows(this._footerRowOutlet);
    if (this._isNativeHtmlTable && !this.fixedLayout || this._stickyColumnStylesNeedReset) {
      this._stickyStyler.clearStickyPositioning([...headerRows, ...dataRows, ...footerRows], ["left", "right"]);
      this._stickyColumnStylesNeedReset = false;
    }
    headerRows.forEach((headerRow, i) => {
      this._addStickyColumnStyles([headerRow], this._headerRowDefs[i]);
    });
    this._rowDefs.forEach((rowDef) => {
      const rows = [];
      for (let i = 0; i < dataRows.length; i++) {
        if (this._renderRows[i].rowDef === rowDef) {
          rows.push(dataRows[i]);
        }
      }
      this._addStickyColumnStyles(rows, rowDef);
    });
    footerRows.forEach((footerRow, i) => {
      this._addStickyColumnStyles([footerRow], this._footerRowDefs[i]);
    });
    Array.from(this._columnDefsByName.values()).forEach((def) => def.resetStickyChanged());
  }
  stickyColumnsUpdated(update) {
    this._positionListener?.stickyColumnsUpdated(update);
  }
  stickyEndColumnsUpdated(update) {
    this._positionListener?.stickyEndColumnsUpdated(update);
  }
  stickyHeaderRowsUpdated(update) {
    this._headerRowStickyUpdates.next(update);
    this._positionListener?.stickyHeaderRowsUpdated(update);
  }
  stickyFooterRowsUpdated(update) {
    this._footerRowStickyUpdates.next(update);
    this._positionListener?.stickyFooterRowsUpdated(update);
  }
  _outletAssigned() {
    if (!this._hasAllOutlets && this._rowOutlet && this._headerRowOutlet && this._footerRowOutlet && this._noDataRowOutlet) {
      this._hasAllOutlets = true;
      if (this._canRender()) {
        this._render();
      }
    }
  }
  _canRender() {
    return this._hasAllOutlets && this._hasInitialized;
  }
  _render() {
    this._cacheRowDefs();
    this._cacheColumnDefs();
    if (!this._headerRowDefs.length && !this._footerRowDefs.length && !this._rowDefs.length && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getTableMissingRowDefsError();
    }
    const columnsChanged = this._renderUpdatedColumns();
    const rowDefsChanged = columnsChanged || this._headerRowDefChanged || this._footerRowDefChanged;
    this._stickyColumnStylesNeedReset = this._stickyColumnStylesNeedReset || rowDefsChanged;
    this._forceRecalculateCellWidths = rowDefsChanged;
    if (this._headerRowDefChanged) {
      this._forceRenderHeaderRows();
      this._headerRowDefChanged = false;
    }
    if (this._footerRowDefChanged) {
      this._forceRenderFooterRows();
      this._footerRowDefChanged = false;
    }
    if (this.dataSource && this._rowDefs.length > 0 && !this._renderChangeSubscription) {
      this._observeRenderChanges();
    } else if (this._stickyColumnStylesNeedReset) {
      this.updateStickyColumnStyles();
    }
    this._checkStickyStates();
  }
  _getAllRenderRows() {
    if (!Array.isArray(this._data) || !this._renderedRange) {
      return [];
    }
    const renderRows = [];
    const end = Math.min(this._data.length, this._renderedRange.end);
    const prevCachedRenderRows = this._cachedRenderRowsMap;
    this._cachedRenderRowsMap = /* @__PURE__ */ new Map();
    for (let i = this._renderedRange.start; i < end; i++) {
      const data = this._data[i];
      const renderRowsForData = this._getRenderRowsForData(data, i, prevCachedRenderRows.get(data));
      if (!this._cachedRenderRowsMap.has(data)) {
        this._cachedRenderRowsMap.set(data, /* @__PURE__ */ new WeakMap());
      }
      for (let j = 0; j < renderRowsForData.length; j++) {
        let renderRow = renderRowsForData[j];
        const cache = this._cachedRenderRowsMap.get(renderRow.data);
        if (cache.has(renderRow.rowDef)) {
          cache.get(renderRow.rowDef).push(renderRow);
        } else {
          cache.set(renderRow.rowDef, [renderRow]);
        }
        renderRows.push(renderRow);
      }
    }
    return renderRows;
  }
  _getRenderRowsForData(data, dataIndex, cache) {
    const rowDefs = this._getRowDefs(data, dataIndex);
    return rowDefs.map((rowDef) => {
      const cachedRenderRows = cache && cache.has(rowDef) ? cache.get(rowDef) : [];
      if (cachedRenderRows.length) {
        const dataRow = cachedRenderRows.shift();
        dataRow.dataIndex = dataIndex;
        return dataRow;
      } else {
        return {
          data,
          rowDef,
          dataIndex
        };
      }
    });
  }
  _cacheColumnDefs() {
    this._columnDefsByName.clear();
    const columnDefs = mergeArrayAndSet(this._getOwnDefs(this._contentColumnDefs), this._customColumnDefs);
    columnDefs.forEach((columnDef) => {
      if (this._columnDefsByName.has(columnDef.name) && (typeof ngDevMode === "undefined" || ngDevMode)) {
        throw getTableDuplicateColumnNameError(columnDef.name);
      }
      this._columnDefsByName.set(columnDef.name, columnDef);
    });
  }
  _cacheRowDefs() {
    this._headerRowDefs = mergeArrayAndSet(this._getOwnDefs(this._contentHeaderRowDefs), this._customHeaderRowDefs);
    this._footerRowDefs = mergeArrayAndSet(this._getOwnDefs(this._contentFooterRowDefs), this._customFooterRowDefs);
    this._rowDefs = mergeArrayAndSet(this._getOwnDefs(this._contentRowDefs), this._customRowDefs);
    const defaultRowDefs = this._rowDefs.filter((def) => !def.when);
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (this._virtualScrollEnabled() && this._rowDefs.some((def) => def.when)) {
        throw new Error("Conditional row definitions via the `when` input are not supported when virtual scrolling is enabled, at the moment.");
      }
      if (!this.multiTemplateDataRows && defaultRowDefs.length > 1) {
        throw getTableMultipleDefaultRowDefsError();
      }
    }
    this._defaultRowDef = defaultRowDefs[0];
  }
  _renderUpdatedColumns() {
    const columnsDiffReducer = (acc, def) => {
      const diff = !!def.getColumnsDiff();
      return acc || diff;
    };
    const dataColumnsChanged = this._rowDefs.reduce(columnsDiffReducer, false);
    if (dataColumnsChanged) {
      this._forceRenderDataRows();
    }
    const headerColumnsChanged = this._headerRowDefs.reduce(columnsDiffReducer, false);
    if (headerColumnsChanged) {
      this._forceRenderHeaderRows();
    }
    const footerColumnsChanged = this._footerRowDefs.reduce(columnsDiffReducer, false);
    if (footerColumnsChanged) {
      this._forceRenderFooterRows();
    }
    return dataColumnsChanged || headerColumnsChanged || footerColumnsChanged;
  }
  _switchDataSource(dataSource) {
    this._data = [];
    if (isDataSource(this.dataSource)) {
      this.dataSource.disconnect(this);
    }
    if (this._renderChangeSubscription) {
      this._renderChangeSubscription.unsubscribe();
      this._renderChangeSubscription = null;
    }
    if (!dataSource) {
      if (this._dataDiffer) {
        this._dataDiffer.diff([]);
      }
      if (this._rowOutlet) {
        this._rowOutlet.viewContainer.clear();
      }
    }
    this._dataSource = dataSource;
  }
  _observeRenderChanges() {
    if (!this.dataSource) {
      return;
    }
    let dataStream;
    if (isDataSource(this.dataSource)) {
      dataStream = this.dataSource.connect(this);
    } else if (isObservable(this.dataSource)) {
      dataStream = this.dataSource;
    } else if (Array.isArray(this.dataSource)) {
      dataStream = of(this.dataSource);
    }
    if (dataStream === void 0 && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getTableUnknownDataSourceError();
    }
    this._renderChangeSubscription = combineLatest([dataStream, this.viewChange]).pipe(takeUntil(this._onDestroy)).subscribe(([data, range]) => {
      this._data = data || [];
      this._renderedRange = range;
      this._dataStream.next(data);
      this.renderRows();
    });
  }
  _forceRenderHeaderRows() {
    if (this._headerRowOutlet.viewContainer.length > 0) {
      this._headerRowOutlet.viewContainer.clear();
    }
    this._headerRowDefs.forEach((def, i) => this._renderRow(this._headerRowOutlet, def, i));
    this.updateStickyHeaderRowStyles();
  }
  _forceRenderFooterRows() {
    if (this._footerRowOutlet.viewContainer.length > 0) {
      this._footerRowOutlet.viewContainer.clear();
    }
    this._footerRowDefs.forEach((def, i) => this._renderRow(this._footerRowOutlet, def, i));
    this.updateStickyFooterRowStyles();
  }
  _addStickyColumnStyles(rows, rowDef) {
    const columnDefs = Array.from(rowDef?.columns || []).map((columnName) => {
      const columnDef = this._columnDefsByName.get(columnName);
      if (!columnDef && (typeof ngDevMode === "undefined" || ngDevMode)) {
        throw getTableUnknownColumnError(columnName);
      }
      return columnDef;
    });
    const stickyStartStates = columnDefs.map((columnDef) => columnDef.sticky);
    const stickyEndStates = columnDefs.map((columnDef) => columnDef.stickyEnd);
    this._stickyStyler.updateStickyColumns(rows, stickyStartStates, stickyEndStates, !this.fixedLayout || this._forceRecalculateCellWidths);
  }
  _getRenderedRows(rowOutlet) {
    const renderedRows = [];
    for (let i = 0; i < rowOutlet.viewContainer.length; i++) {
      const viewRef = rowOutlet.viewContainer.get(i);
      renderedRows.push(viewRef.rootNodes[0]);
    }
    return renderedRows;
  }
  _getRowDefs(data, dataIndex) {
    if (this._rowDefs.length === 1) {
      return [this._rowDefs[0]];
    }
    let rowDefs = [];
    if (this.multiTemplateDataRows) {
      rowDefs = this._rowDefs.filter((def) => !def.when || def.when(dataIndex, data));
    } else {
      let rowDef = this._rowDefs.find((def) => def.when && def.when(dataIndex, data)) || this._defaultRowDef;
      if (rowDef) {
        rowDefs.push(rowDef);
      }
    }
    if (!rowDefs.length && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getTableMissingMatchingRowDefError(data);
    }
    return rowDefs;
  }
  _getEmbeddedViewArgs(renderRow, index) {
    const rowDef = renderRow.rowDef;
    const context = {
      $implicit: renderRow.data
    };
    return {
      templateRef: rowDef.template,
      context,
      index
    };
  }
  _renderRow(outlet, rowDef, index, context = {}) {
    const view = outlet.viewContainer.createEmbeddedView(rowDef.template, context, index);
    this._renderCellTemplateForItem(rowDef, context);
    return view;
  }
  _renderCellTemplateForItem(rowDef, context) {
    for (let cellTemplate of this._getCellTemplates(rowDef)) {
      if (CdkCellOutlet.mostRecentCellOutlet) {
        CdkCellOutlet.mostRecentCellOutlet._viewContainer.createEmbeddedView(cellTemplate, context);
      }
    }
    this._changeDetectorRef.markForCheck();
  }
  _updateRowIndexContext() {
    const viewContainer = this._rowOutlet.viewContainer;
    for (let renderIndex = 0, count = viewContainer.length; renderIndex < count; renderIndex++) {
      const viewRef = viewContainer.get(renderIndex);
      const context = viewRef.context;
      context.count = count;
      context.first = renderIndex === 0;
      context.last = renderIndex === count - 1;
      context.even = renderIndex % 2 === 0;
      context.odd = !context.even;
      if (this.multiTemplateDataRows) {
        context.dataIndex = this._renderRows[renderIndex].dataIndex;
        context.renderIndex = renderIndex;
      } else {
        context.index = this._renderRows[renderIndex].dataIndex;
      }
    }
  }
  _getCellTemplates(rowDef) {
    if (!rowDef || !rowDef.columns) {
      return [];
    }
    return Array.from(rowDef.columns, (columnId) => {
      const column = this._columnDefsByName.get(columnId);
      if (!column && (typeof ngDevMode === "undefined" || ngDevMode)) {
        throw getTableUnknownColumnError(columnId);
      }
      return rowDef.extractCellTemplate(column);
    });
  }
  _forceRenderDataRows() {
    this._dataDiffer.diff([]);
    this._rowOutlet.viewContainer.clear();
    this.renderRows();
  }
  _checkStickyStates() {
    const stickyCheckReducer = (acc, d) => {
      return acc || d.hasStickyChanged();
    };
    if (this._headerRowDefs.reduce(stickyCheckReducer, false)) {
      this.updateStickyHeaderRowStyles();
    }
    if (this._footerRowDefs.reduce(stickyCheckReducer, false)) {
      this.updateStickyFooterRowStyles();
    }
    if (Array.from(this._columnDefsByName.values()).reduce(stickyCheckReducer, false)) {
      this._stickyColumnStylesNeedReset = true;
      this.updateStickyColumnStyles();
    }
  }
  _setupStickyStyler() {
    const direction = this._dir ? this._dir.value : "ltr";
    const injector = this._injector;
    this._stickyStyler = new StickyStyler(this._isNativeHtmlTable, this.stickyCssClass, this._platform.isBrowser, this.needsPositionStickyOnElement, direction, this, injector);
    (this._dir ? this._dir.change : of()).pipe(takeUntil(this._onDestroy)).subscribe((value) => {
      this._stickyStyler.direction = value;
      this.updateStickyColumnStyles();
    });
  }
  _setupVirtualScrolling(viewport) {
    const virtualScrollScheduler = typeof requestAnimationFrame !== "undefined" ? animationFrameScheduler : asapScheduler;
    this.viewChange.next({
      start: 0,
      end: 0
    });
    viewport.renderedRangeStream.pipe(auditTime(0, virtualScrollScheduler), takeUntil(this._onDestroy)).subscribe(this.viewChange);
    viewport.attach({
      dataStream: this._dataStream,
      measureRangeSize: (range, orientation) => this._measureRangeSize(range, orientation)
    });
    combineLatest([viewport.renderedContentOffset, this._headerRowStickyUpdates]).pipe(takeUntil(this._onDestroy)).subscribe(([offsetFromTop, update]) => {
      if (!update.sizes || !update.offsets || !update.elements) {
        return;
      }
      for (let i = 0; i < update.elements.length; i++) {
        const cells = update.elements[i];
        if (cells) {
          const current = update.offsets[i];
          const offset = offsetFromTop !== 0 ? Math.max(offsetFromTop - current, current) : -current;
          for (const cell of cells) {
            cell.style.top = `${-offset}px`;
          }
        }
      }
    });
    combineLatest([viewport.renderedContentOffset, this._footerRowStickyUpdates]).pipe(takeUntil(this._onDestroy)).subscribe(([offsetFromTop, update]) => {
      if (!update.sizes || !update.offsets || !update.elements) {
        return;
      }
      for (let i = 0; i < update.elements.length; i++) {
        const cells = update.elements[i];
        if (cells) {
          for (const cell of cells) {
            cell.style.bottom = `${offsetFromTop + update.offsets[i]}px`;
          }
        }
      }
    });
  }
  _getOwnDefs(items) {
    return items.filter((item) => !item._table || item._table === this);
  }
  _updateNoDataRow() {
    const noDataRow = this._customNoDataRow || this._noDataRow;
    if (!noDataRow) {
      return;
    }
    const shouldShow = this._rowOutlet.viewContainer.length === 0;
    if (shouldShow === this._isShowingNoDataRow) {
      return;
    }
    const container = this._noDataRowOutlet.viewContainer;
    if (shouldShow) {
      const view = container.createEmbeddedView(noDataRow.templateRef);
      const rootNode = view.rootNodes[0];
      if (view.rootNodes.length === 1 && rootNode?.nodeType === this._document.ELEMENT_NODE) {
        rootNode.setAttribute("role", "row");
        rootNode.classList.add(...noDataRow._contentClassNames);
        const cells = rootNode.querySelectorAll(noDataRow._cellSelector);
        for (let i = 0; i < cells.length; i++) {
          cells[i].classList.add(...noDataRow._cellClassNames);
        }
      }
    } else {
      container.clear();
    }
    this._isShowingNoDataRow = shouldShow;
    this._changeDetectorRef.markForCheck();
  }
  _measureRangeSize(range, orientation) {
    if (range.start >= range.end || orientation !== "vertical") {
      return 0;
    }
    const renderedRange = this.viewChange.value;
    const viewContainerRef = this._rowOutlet.viewContainer;
    if ((range.start < renderedRange.start || range.end > renderedRange.end) && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw Error(`Error: attempted to measure an item that isn't rendered.`);
    }
    const renderedStartIndex = range.start - renderedRange.start;
    const rangeLen = range.end - range.start;
    let firstNode;
    let lastNode;
    for (let i = 0; i < rangeLen; i++) {
      const view = viewContainerRef.get(i + renderedStartIndex);
      if (view && view.rootNodes.length) {
        firstNode = lastNode = view.rootNodes[0];
        break;
      }
    }
    for (let i = rangeLen - 1; i > -1; i--) {
      const view = viewContainerRef.get(i + renderedStartIndex);
      if (view && view.rootNodes.length) {
        lastNode = view.rootNodes[view.rootNodes.length - 1];
        break;
      }
    }
    const startRect = firstNode?.getBoundingClientRect?.();
    const endRect = lastNode?.getBoundingClientRect?.();
    return startRect && endRect ? endRect.bottom - startRect.top : 0;
  }
  _virtualScrollEnabled() {
    return !this._disableVirtualScrolling && this._virtualScrollViewport != null;
  }
  static \u0275fac = function CdkTable_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkTable)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _CdkTable,
    selectors: [["cdk-table"], ["table", "cdk-table", ""]],
    contentQueries: function CdkTable_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, CdkNoDataRow, 5)(dirIndex, CdkColumnDef, 5)(dirIndex, CdkRowDef, 5)(dirIndex, CdkHeaderRowDef, 5)(dirIndex, CdkFooterRowDef, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._noDataRow = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._contentColumnDefs = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._contentRowDefs = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._contentHeaderRowDefs = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._contentFooterRowDefs = _t);
      }
    },
    hostAttrs: [1, "cdk-table"],
    hostVars: 2,
    hostBindings: function CdkTable_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("cdk-table-fixed-layout", ctx.fixedLayout);
      }
    },
    inputs: {
      trackBy: "trackBy",
      dataSource: "dataSource",
      multiTemplateDataRows: [2, "multiTemplateDataRows", "multiTemplateDataRows", booleanAttribute],
      fixedLayout: [2, "fixedLayout", "fixedLayout", booleanAttribute],
      recycleRows: [2, "recycleRows", "recycleRows", booleanAttribute]
    },
    outputs: {
      contentChanged: "contentChanged"
    },
    exportAs: ["cdkTable"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: CDK_TABLE,
      useExisting: _CdkTable
    }, {
      provide: STICKY_POSITIONING_LISTENER,
      useValue: null
    }])],
    ngContentSelectors: _c1,
    decls: 5,
    vars: 2,
    consts: [["role", "rowgroup"], ["headerRowOutlet", ""], ["rowOutlet", ""], ["noDataRowOutlet", ""], ["footerRowOutlet", ""]],
    template: function CdkTable_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c0);
        \u0275\u0275projection(0);
        \u0275\u0275projection(1, 1);
        \u0275\u0275conditionalCreate(2, CdkTable_Conditional_2_Template, 1, 0);
        \u0275\u0275conditionalCreate(3, CdkTable_Conditional_3_Template, 7, 0)(4, CdkTable_Conditional_4_Template, 4, 0);
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx._isServer ? 2 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx._isNativeHtmlTable ? 3 : 4);
      }
    },
    dependencies: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
    styles: [".cdk-table-fixed-layout{table-layout:fixed}\n"],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTable, [{
    type: Component,
    args: [{
      selector: "cdk-table, table[cdk-table]",
      exportAs: "cdkTable",
      template: `
    <ng-content select="caption"/>
    <ng-content select="colgroup, col"/>

    <!--
      Unprojected content throws a hydration error so we need this to capture it.
      It gets removed on the client so it doesn't affect the layout.
    -->
    @if (_isServer) {
      <ng-content/>
    }

    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet/>
      </thead>
      <tbody role="rowgroup">
        <ng-container rowOutlet/>
        <ng-container noDataRowOutlet/>
      </tbody>
      <tfoot role="rowgroup">
        <ng-container footerRowOutlet/>
      </tfoot>
    } @else {
      <ng-container headerRowOutlet/>
      <ng-container rowOutlet/>
      <ng-container noDataRowOutlet/>
      <ng-container footerRowOutlet/>
    }
  `,
      host: {
        "class": "cdk-table",
        "[class.cdk-table-fixed-layout]": "fixedLayout"
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.Default,
      providers: [{
        provide: CDK_TABLE,
        useExisting: CdkTable
      }, {
        provide: STICKY_POSITIONING_LISTENER,
        useValue: null
      }],
      imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
      styles: [".cdk-table-fixed-layout{table-layout:fixed}\n"]
    }]
  }], () => [], {
    trackBy: [{
      type: Input
    }],
    dataSource: [{
      type: Input
    }],
    multiTemplateDataRows: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    fixedLayout: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    recycleRows: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    contentChanged: [{
      type: Output
    }],
    _contentColumnDefs: [{
      type: ContentChildren,
      args: [CdkColumnDef, {
        descendants: true
      }]
    }],
    _contentRowDefs: [{
      type: ContentChildren,
      args: [CdkRowDef, {
        descendants: true
      }]
    }],
    _contentHeaderRowDefs: [{
      type: ContentChildren,
      args: [CdkHeaderRowDef, {
        descendants: true
      }]
    }],
    _contentFooterRowDefs: [{
      type: ContentChildren,
      args: [CdkFooterRowDef, {
        descendants: true
      }]
    }],
    _noDataRow: [{
      type: ContentChild,
      args: [CdkNoDataRow]
    }]
  });
})();
function mergeArrayAndSet(array, set) {
  return array.concat(Array.from(set));
}
function closestTableSection(outlet, section) {
  const uppercaseSection = section.toUpperCase();
  let current = outlet.viewContainer.element.nativeElement;
  while (current) {
    const nodeName = current.nodeType === 1 ? current.nodeName : null;
    if (nodeName === uppercaseSection) {
      return current;
    } else if (nodeName === "TABLE") {
      break;
    }
    current = current.parentNode;
  }
  return null;
}
var CdkTextColumn = class _CdkTextColumn {
  _table = inject(CdkTable, {
    optional: true
  });
  _options = inject(TEXT_COLUMN_OPTIONS, {
    optional: true
  });
  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
    this._syncColumnDefName();
  }
  _name;
  headerText;
  dataAccessor;
  justify = "start";
  columnDef;
  cell;
  headerCell;
  constructor() {
    this._options = this._options || {};
  }
  ngOnInit() {
    this._syncColumnDefName();
    if (this.headerText === void 0) {
      this.headerText = this._createDefaultHeaderText();
    }
    if (!this.dataAccessor) {
      this.dataAccessor = this._options.defaultDataAccessor || ((data, name) => data[name]);
    }
    if (this._table) {
      this.columnDef.cell = this.cell;
      this.columnDef.headerCell = this.headerCell;
      this._table.addColumnDef(this.columnDef);
    } else if (typeof ngDevMode === "undefined" || ngDevMode) {
      throw getTableTextColumnMissingParentTableError();
    }
  }
  ngOnDestroy() {
    if (this._table) {
      this._table.removeColumnDef(this.columnDef);
    }
  }
  _createDefaultHeaderText() {
    const name = this.name;
    if (!name && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getTableTextColumnMissingNameError();
    }
    if (this._options && this._options.defaultHeaderTextTransform) {
      return this._options.defaultHeaderTextTransform(name);
    }
    return name[0].toUpperCase() + name.slice(1);
  }
  _syncColumnDefName() {
    if (this.columnDef) {
      this.columnDef.name = this.name;
    }
  }
  static \u0275fac = function CdkTextColumn_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkTextColumn)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _CdkTextColumn,
    selectors: [["cdk-text-column"]],
    viewQuery: function CdkTextColumn_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(CdkColumnDef, 7)(CdkCellDef, 7)(CdkHeaderCellDef, 7);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.columnDef = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.cell = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.headerCell = _t.first);
      }
    },
    inputs: {
      name: "name",
      headerText: "headerText",
      dataAccessor: "dataAccessor",
      justify: "justify"
    },
    decls: 3,
    vars: 0,
    consts: [["cdkColumnDef", ""], ["cdk-header-cell", "", 3, "text-align", 4, "cdkHeaderCellDef"], ["cdk-cell", "", 3, "text-align", 4, "cdkCellDef"], ["cdk-header-cell", ""], ["cdk-cell", ""]],
    template: function CdkTextColumn_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementContainerStart(0, 0);
        \u0275\u0275template(1, CdkTextColumn_th_1_Template, 2, 3, "th", 1)(2, CdkTextColumn_td_2_Template, 2, 3, "td", 2);
        \u0275\u0275elementContainerEnd();
      }
    },
    dependencies: [CdkColumnDef, CdkHeaderCellDef, CdkHeaderCell, CdkCellDef, CdkCell],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTextColumn, [{
    type: Component,
    args: [{
      selector: "cdk-text-column",
      template: `
    <ng-container cdkColumnDef>
      <th cdk-header-cell *cdkHeaderCellDef [style.text-align]="justify">
        {{headerText}}
      </th>
      <td cdk-cell *cdkCellDef="let data" [style.text-align]="justify">
        {{dataAccessor(data, name)}}
      </td>
    </ng-container>
  `,
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.Default,
      imports: [CdkColumnDef, CdkHeaderCellDef, CdkHeaderCell, CdkCellDef, CdkCell]
    }]
  }], () => [], {
    name: [{
      type: Input
    }],
    headerText: [{
      type: Input
    }],
    dataAccessor: [{
      type: Input
    }],
    justify: [{
      type: Input
    }],
    columnDef: [{
      type: ViewChild,
      args: [CdkColumnDef, {
        static: true
      }]
    }],
    cell: [{
      type: ViewChild,
      args: [CdkCellDef, {
        static: true
      }]
    }],
    headerCell: [{
      type: ViewChild,
      args: [CdkHeaderCellDef, {
        static: true
      }]
    }]
  });
})();
var EXPORTED_DECLARATIONS = [CdkTable, CdkRowDef, CdkCellDef, CdkCellOutlet, CdkHeaderCellDef, CdkFooterCellDef, CdkColumnDef, CdkCell, CdkRow, CdkHeaderCell, CdkFooterCell, CdkHeaderRow, CdkHeaderRowDef, CdkFooterRow, CdkFooterRowDef, DataRowOutlet, HeaderRowOutlet, FooterRowOutlet, CdkTextColumn, CdkNoDataRow, CdkRecycleRows, NoDataRowOutlet];
var CdkTableModule = class _CdkTableModule {
  static \u0275fac = function CdkTableModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CdkTableModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _CdkTableModule,
    imports: [ScrollingModule, CdkTable, CdkRowDef, CdkCellDef, CdkCellOutlet, CdkHeaderCellDef, CdkFooterCellDef, CdkColumnDef, CdkCell, CdkRow, CdkHeaderCell, CdkFooterCell, CdkHeaderRow, CdkHeaderRowDef, CdkFooterRow, CdkFooterRowDef, DataRowOutlet, HeaderRowOutlet, FooterRowOutlet, CdkTextColumn, CdkNoDataRow, CdkRecycleRows, NoDataRowOutlet],
    exports: [CdkTable, CdkRowDef, CdkCellDef, CdkCellOutlet, CdkHeaderCellDef, CdkFooterCellDef, CdkColumnDef, CdkCell, CdkRow, CdkHeaderCell, CdkFooterCell, CdkHeaderRow, CdkHeaderRowDef, CdkFooterRow, CdkFooterRowDef, DataRowOutlet, HeaderRowOutlet, FooterRowOutlet, CdkTextColumn, CdkNoDataRow, CdkRecycleRows, NoDataRowOutlet]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [ScrollingModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTableModule, [{
    type: NgModule,
    args: [{
      exports: EXPORTED_DECLARATIONS,
      imports: [ScrollingModule, ...EXPORTED_DECLARATIONS]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/slide-toggle.mjs
var _c02 = ["switch"];
var _c12 = ["*"];
function MatSlideToggle_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 11);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 13);
    \u0275\u0275element(2, "path", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "svg", 15);
    \u0275\u0275element(4, "path", 16);
    \u0275\u0275elementEnd()();
  }
}
var MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS = new InjectionToken("mat-slide-toggle-default-options", {
  providedIn: "root",
  factory: () => ({
    disableToggleValue: false,
    hideIcon: false,
    disabledInteractive: false
  })
});
var MatSlideToggleChange = class {
  source;
  checked;
  constructor(source, checked) {
    this.source = source;
    this.checked = checked;
  }
};
var MatSlideToggle = class _MatSlideToggle {
  _elementRef = inject(ElementRef);
  _focusMonitor = inject(FocusMonitor);
  _changeDetectorRef = inject(ChangeDetectorRef);
  defaults = inject(MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS);
  _onChange = (_) => {
  };
  _onTouched = () => {
  };
  _validatorOnChange = () => {
  };
  _uniqueId;
  _checked = false;
  _createChangeEvent(isChecked) {
    return new MatSlideToggleChange(this, isChecked);
  }
  _labelId;
  get buttonId() {
    return `${this.id || this._uniqueId}-button`;
  }
  _switchElement;
  focus() {
    this._switchElement.nativeElement.focus();
  }
  _noopAnimations = _animationsDisabled();
  _focused = false;
  name = null;
  id;
  labelPosition = "after";
  ariaLabel = null;
  ariaLabelledby = null;
  ariaDescribedby;
  required = false;
  color;
  disabled = false;
  disableRipple = false;
  tabIndex = 0;
  get checked() {
    return this._checked;
  }
  set checked(value) {
    this._checked = value;
    this._changeDetectorRef.markForCheck();
  }
  hideIcon;
  disabledInteractive;
  change = new EventEmitter();
  toggleChange = new EventEmitter();
  get inputId() {
    return `${this.id || this._uniqueId}-input`;
  }
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
    const tabIndex = inject(new HostAttributeToken("tabindex"), {
      optional: true
    });
    const defaults = this.defaults;
    this.tabIndex = tabIndex == null ? 0 : parseInt(tabIndex) || 0;
    this.color = defaults.color || "accent";
    this.id = this._uniqueId = inject(_IdGenerator).getId("mat-mdc-slide-toggle-");
    this.hideIcon = defaults.hideIcon ?? false;
    this.disabledInteractive = defaults.disabledInteractive ?? false;
    this._labelId = this._uniqueId + "-label";
  }
  ngAfterContentInit() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe((focusOrigin) => {
      if (focusOrigin === "keyboard" || focusOrigin === "program") {
        this._focused = true;
        this._changeDetectorRef.markForCheck();
      } else if (!focusOrigin) {
        Promise.resolve().then(() => {
          this._focused = false;
          this._onTouched();
          this._changeDetectorRef.markForCheck();
        });
      }
    });
  }
  ngOnChanges(changes) {
    if (changes["required"]) {
      this._validatorOnChange();
    }
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
  writeValue(value) {
    this.checked = !!value;
  }
  registerOnChange(fn) {
    this._onChange = fn;
  }
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  validate(control) {
    return this.required && control.value !== true ? {
      "required": true
    } : null;
  }
  registerOnValidatorChange(fn) {
    this._validatorOnChange = fn;
  }
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
    this._changeDetectorRef.markForCheck();
  }
  toggle() {
    this.checked = !this.checked;
    this._onChange(this.checked);
  }
  _emitChangeEvent() {
    this._onChange(this.checked);
    this.change.emit(this._createChangeEvent(this.checked));
  }
  _handleClick() {
    if (!this.disabled) {
      this.toggleChange.emit();
      if (!this.defaults.disableToggleValue) {
        this.checked = !this.checked;
        this._onChange(this.checked);
        this.change.emit(new MatSlideToggleChange(this, this.checked));
      }
    }
  }
  _getAriaLabelledBy() {
    if (this.ariaLabelledby) {
      return this.ariaLabelledby;
    }
    return this.ariaLabel ? null : this._labelId;
  }
  static \u0275fac = function MatSlideToggle_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSlideToggle)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatSlideToggle,
    selectors: [["mat-slide-toggle"]],
    viewQuery: function MatSlideToggle_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c02, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._switchElement = _t.first);
      }
    },
    hostAttrs: [1, "mat-mdc-slide-toggle"],
    hostVars: 13,
    hostBindings: function MatSlideToggle_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id);
        \u0275\u0275attribute("tabindex", null)("aria-label", null)("name", null)("aria-labelledby", null);
        \u0275\u0275classMap(ctx.color ? "mat-" + ctx.color : "");
        \u0275\u0275classProp("mat-mdc-slide-toggle-focused", ctx._focused)("mat-mdc-slide-toggle-checked", ctx.checked)("_mat-animation-noopable", ctx._noopAnimations);
      }
    },
    inputs: {
      name: "name",
      id: "id",
      labelPosition: "labelPosition",
      ariaLabel: [0, "aria-label", "ariaLabel"],
      ariaLabelledby: [0, "aria-labelledby", "ariaLabelledby"],
      ariaDescribedby: [0, "aria-describedby", "ariaDescribedby"],
      required: [2, "required", "required", booleanAttribute],
      color: "color",
      disabled: [2, "disabled", "disabled", booleanAttribute],
      disableRipple: [2, "disableRipple", "disableRipple", booleanAttribute],
      tabIndex: [2, "tabIndex", "tabIndex", (value) => value == null ? 0 : numberAttribute(value)],
      checked: [2, "checked", "checked", booleanAttribute],
      hideIcon: [2, "hideIcon", "hideIcon", booleanAttribute],
      disabledInteractive: [2, "disabledInteractive", "disabledInteractive", booleanAttribute]
    },
    outputs: {
      change: "change",
      toggleChange: "toggleChange"
    },
    exportAs: ["matSlideToggle"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => _MatSlideToggle),
      multi: true
    }, {
      provide: NG_VALIDATORS,
      useExisting: _MatSlideToggle,
      multi: true
    }]), \u0275\u0275NgOnChangesFeature],
    ngContentSelectors: _c12,
    decls: 14,
    vars: 27,
    consts: [["switch", ""], ["mat-internal-form-field", "", 3, "labelPosition"], ["role", "switch", "type", "button", 1, "mdc-switch", 3, "click", "tabIndex", "disabled"], [1, "mat-mdc-slide-toggle-touch-target"], [1, "mdc-switch__track"], [1, "mdc-switch__handle-track"], [1, "mdc-switch__handle"], [1, "mdc-switch__shadow"], [1, "mdc-elevation-overlay"], [1, "mdc-switch__ripple"], ["mat-ripple", "", 1, "mat-mdc-slide-toggle-ripple", "mat-focus-indicator", 3, "matRippleTrigger", "matRippleDisabled", "matRippleCentered"], [1, "mdc-switch__icons"], [1, "mdc-label", 3, "click", "for"], ["viewBox", "0 0 24 24", "aria-hidden", "true", 1, "mdc-switch__icon", "mdc-switch__icon--on"], ["d", "M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z"], ["viewBox", "0 0 24 24", "aria-hidden", "true", 1, "mdc-switch__icon", "mdc-switch__icon--off"], ["d", "M20 13H4v-2h16v2z"]],
    template: function MatSlideToggle_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275projectionDef();
        \u0275\u0275elementStart(0, "div", 1)(1, "button", 2, 0);
        \u0275\u0275listener("click", function MatSlideToggle_Template_button_click_1_listener() {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx._handleClick());
        });
        \u0275\u0275element(3, "div", 3)(4, "span", 4);
        \u0275\u0275elementStart(5, "span", 5)(6, "span", 6)(7, "span", 7);
        \u0275\u0275element(8, "span", 8);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(9, "span", 9);
        \u0275\u0275element(10, "span", 10);
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(11, MatSlideToggle_Conditional_11_Template, 5, 0, "span", 11);
        \u0275\u0275elementEnd()()();
        \u0275\u0275elementStart(12, "label", 12);
        \u0275\u0275listener("click", function MatSlideToggle_Template_label_click_12_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView($event.stopPropagation());
        });
        \u0275\u0275projection(13);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        const switch_r2 = \u0275\u0275reference(2);
        \u0275\u0275property("labelPosition", ctx.labelPosition);
        \u0275\u0275advance();
        \u0275\u0275classProp("mdc-switch--selected", ctx.checked)("mdc-switch--unselected", !ctx.checked)("mdc-switch--checked", ctx.checked)("mdc-switch--disabled", ctx.disabled)("mat-mdc-slide-toggle-disabled-interactive", ctx.disabledInteractive);
        \u0275\u0275property("tabIndex", ctx.disabled && !ctx.disabledInteractive ? -1 : ctx.tabIndex)("disabled", ctx.disabled && !ctx.disabledInteractive);
        \u0275\u0275attribute("id", ctx.buttonId)("name", ctx.name)("aria-label", ctx.ariaLabel)("aria-labelledby", ctx._getAriaLabelledBy())("aria-describedby", ctx.ariaDescribedby)("aria-required", ctx.required || null)("aria-checked", ctx.checked)("aria-disabled", ctx.disabled && ctx.disabledInteractive ? "true" : null);
        \u0275\u0275advance(9);
        \u0275\u0275property("matRippleTrigger", switch_r2)("matRippleDisabled", ctx.disableRipple || ctx.disabled)("matRippleCentered", true);
        \u0275\u0275advance();
        \u0275\u0275conditional(!ctx.hideIcon ? 11 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("for", ctx.buttonId);
        \u0275\u0275attribute("id", ctx._labelId);
      }
    },
    dependencies: [MatRipple, _MatInternalFormField],
    styles: ['.mdc-switch{align-items:center;background:none;border:none;cursor:pointer;display:inline-flex;flex-shrink:0;margin:0;outline:none;overflow:visible;padding:0;position:relative;width:var(--mat-slide-toggle-track-width, 52px)}.mdc-switch.mdc-switch--disabled{cursor:default;pointer-events:none}.mdc-switch.mat-mdc-slide-toggle-disabled-interactive{pointer-events:auto}label:empty{display:none}.mdc-switch__track{overflow:hidden;position:relative;width:100%;height:var(--mat-slide-toggle-track-height, 32px);border-radius:var(--mat-slide-toggle-track-shape, var(--mat-sys-corner-full))}.mdc-switch--disabled.mdc-switch .mdc-switch__track{opacity:var(--mat-slide-toggle-disabled-track-opacity, 0.12)}.mdc-switch__track::before,.mdc-switch__track::after{border:1px solid rgba(0,0,0,0);border-radius:inherit;box-sizing:border-box;content:"";height:100%;left:0;position:absolute;width:100%;border-width:var(--mat-slide-toggle-track-outline-width, 2px);border-color:var(--mat-slide-toggle-track-outline-color, var(--mat-sys-outline))}.mdc-switch--selected .mdc-switch__track::before,.mdc-switch--selected .mdc-switch__track::after{border-width:var(--mat-slide-toggle-selected-track-outline-width, 2px);border-color:var(--mat-slide-toggle-selected-track-outline-color, transparent)}.mdc-switch--disabled .mdc-switch__track::before,.mdc-switch--disabled .mdc-switch__track::after{border-width:var(--mat-slide-toggle-disabled-unselected-track-outline-width, 2px);border-color:var(--mat-slide-toggle-disabled-unselected-track-outline-color, var(--mat-sys-on-surface))}@media(forced-colors: active){.mdc-switch__track{border-color:currentColor}}.mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:translateX(0);background:var(--mat-slide-toggle-unselected-track-color, var(--mat-sys-surface-variant))}.mdc-switch--selected .mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch--selected .mdc-switch__track::before{transform:translateX(-100%)}.mdc-switch--selected .mdc-switch__track::before{opacity:var(--mat-slide-toggle-hidden-track-opacity, 0);transition:var(--mat-slide-toggle-hidden-track-transition, opacity 75ms)}.mdc-switch--unselected .mdc-switch__track::before{opacity:var(--mat-slide-toggle-visible-track-opacity, 1);transition:var(--mat-slide-toggle-visible-track-transition, opacity 75ms)}.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before{background:var(--mat-slide-toggle-unselected-hover-track-color, var(--mat-sys-surface-variant))}.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before{background:var(--mat-slide-toggle-unselected-focus-track-color, var(--mat-sys-surface-variant))}.mdc-switch:enabled:active .mdc-switch__track::before{background:var(--mat-slide-toggle-unselected-pressed-track-color, var(--mat-sys-surface-variant))}.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:hover:not(:focus):not(:active) .mdc-switch__track::before,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:focus:not(:active) .mdc-switch__track::before,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:active .mdc-switch__track::before,.mdc-switch.mdc-switch--disabled .mdc-switch__track::before{background:var(--mat-slide-toggle-disabled-unselected-track-color, var(--mat-sys-surface-variant))}.mdc-switch__track::after{transform:translateX(-100%);background:var(--mat-slide-toggle-selected-track-color, var(--mat-sys-primary))}[dir=rtl] .mdc-switch__track::after{transform:translateX(100%)}.mdc-switch--selected .mdc-switch__track::after{transform:translateX(0)}.mdc-switch--selected .mdc-switch__track::after{opacity:var(--mat-slide-toggle-visible-track-opacity, 1);transition:var(--mat-slide-toggle-visible-track-transition, opacity 75ms)}.mdc-switch--unselected .mdc-switch__track::after{opacity:var(--mat-slide-toggle-hidden-track-opacity, 0);transition:var(--mat-slide-toggle-hidden-track-transition, opacity 75ms)}.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after{background:var(--mat-slide-toggle-selected-hover-track-color, var(--mat-sys-primary))}.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after{background:var(--mat-slide-toggle-selected-focus-track-color, var(--mat-sys-primary))}.mdc-switch:enabled:active .mdc-switch__track::after{background:var(--mat-slide-toggle-selected-pressed-track-color, var(--mat-sys-primary))}.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:hover:not(:focus):not(:active) .mdc-switch__track::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:focus:not(:active) .mdc-switch__track::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:active .mdc-switch__track::after,.mdc-switch.mdc-switch--disabled .mdc-switch__track::after{background:var(--mat-slide-toggle-disabled-selected-track-color, var(--mat-sys-on-surface))}.mdc-switch__handle-track{height:100%;pointer-events:none;position:absolute;top:0;transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);left:0;right:auto;transform:translateX(0);width:calc(100% - var(--mat-slide-toggle-handle-width))}[dir=rtl] .mdc-switch__handle-track{left:auto;right:0}.mdc-switch--selected .mdc-switch__handle-track{transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track{transform:translateX(-100%)}.mdc-switch__handle{display:flex;pointer-events:auto;position:absolute;top:50%;transform:translateY(-50%);left:0;right:auto;transition:width 75ms cubic-bezier(0.4, 0, 0.2, 1),height 75ms cubic-bezier(0.4, 0, 0.2, 1),margin 75ms cubic-bezier(0.4, 0, 0.2, 1);width:var(--mat-slide-toggle-handle-width);height:var(--mat-slide-toggle-handle-height);border-radius:var(--mat-slide-toggle-handle-shape, var(--mat-sys-corner-full))}[dir=rtl] .mdc-switch__handle{left:auto;right:0}.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle{width:var(--mat-slide-toggle-unselected-handle-size, 16px);height:var(--mat-slide-toggle-unselected-handle-size, 16px);margin:var(--mat-slide-toggle-unselected-handle-horizontal-margin, 0 8px)}.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle:has(.mdc-switch__icons){margin:var(--mat-slide-toggle-unselected-with-icon-handle-horizontal-margin, 0 4px)}.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle{width:var(--mat-slide-toggle-selected-handle-size, 24px);height:var(--mat-slide-toggle-selected-handle-size, 24px);margin:var(--mat-slide-toggle-selected-handle-horizontal-margin, 0 24px)}.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle:has(.mdc-switch__icons){margin:var(--mat-slide-toggle-selected-with-icon-handle-horizontal-margin, 0 24px)}.mat-mdc-slide-toggle .mdc-switch__handle:has(.mdc-switch__icons){width:var(--mat-slide-toggle-with-icon-handle-size, 24px);height:var(--mat-slide-toggle-with-icon-handle-size, 24px)}.mat-mdc-slide-toggle .mdc-switch:active:not(.mdc-switch--disabled) .mdc-switch__handle{width:var(--mat-slide-toggle-pressed-handle-size, 28px);height:var(--mat-slide-toggle-pressed-handle-size, 28px)}.mat-mdc-slide-toggle .mdc-switch--selected:active:not(.mdc-switch--disabled) .mdc-switch__handle{margin:var(--mat-slide-toggle-selected-pressed-handle-horizontal-margin, 0 22px)}.mat-mdc-slide-toggle .mdc-switch--unselected:active:not(.mdc-switch--disabled) .mdc-switch__handle{margin:var(--mat-slide-toggle-unselected-pressed-handle-horizontal-margin, 0 2px)}.mdc-switch--disabled.mdc-switch--selected .mdc-switch__handle::after{opacity:var(--mat-slide-toggle-disabled-selected-handle-opacity, 1)}.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__handle::after{opacity:var(--mat-slide-toggle-disabled-unselected-handle-opacity, 0.38)}.mdc-switch__handle::before,.mdc-switch__handle::after{border:1px solid rgba(0,0,0,0);border-radius:inherit;box-sizing:border-box;content:"";width:100%;height:100%;left:0;position:absolute;top:0;transition:background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1),border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);z-index:-1}@media(forced-colors: active){.mdc-switch__handle::before,.mdc-switch__handle::after{border-color:currentColor}}.mdc-switch--selected:enabled .mdc-switch__handle::after{background:var(--mat-slide-toggle-selected-handle-color, var(--mat-sys-on-primary))}.mdc-switch--selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:var(--mat-slide-toggle-selected-hover-handle-color, var(--mat-sys-primary-container))}.mdc-switch--selected:enabled:focus:not(:active) .mdc-switch__handle::after{background:var(--mat-slide-toggle-selected-focus-handle-color, var(--mat-sys-primary-container))}.mdc-switch--selected:enabled:active .mdc-switch__handle::after{background:var(--mat-slide-toggle-selected-pressed-handle-color, var(--mat-sys-primary-container))}.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--selected:hover:not(:focus):not(:active) .mdc-switch__handle::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--selected:focus:not(:active) .mdc-switch__handle::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--selected:active .mdc-switch__handle::after,.mdc-switch--selected.mdc-switch--disabled .mdc-switch__handle::after{background:var(--mat-slide-toggle-disabled-selected-handle-color, var(--mat-sys-surface))}.mdc-switch--unselected:enabled .mdc-switch__handle::after{background:var(--mat-slide-toggle-unselected-handle-color, var(--mat-sys-outline))}.mdc-switch--unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:var(--mat-slide-toggle-unselected-hover-handle-color, var(--mat-sys-on-surface-variant))}.mdc-switch--unselected:enabled:focus:not(:active) .mdc-switch__handle::after{background:var(--mat-slide-toggle-unselected-focus-handle-color, var(--mat-sys-on-surface-variant))}.mdc-switch--unselected:enabled:active .mdc-switch__handle::after{background:var(--mat-slide-toggle-unselected-pressed-handle-color, var(--mat-sys-on-surface-variant))}.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__handle::after{background:var(--mat-slide-toggle-disabled-unselected-handle-color, var(--mat-sys-on-surface))}.mdc-switch__handle::before{background:var(--mat-slide-toggle-handle-surface-color)}.mdc-switch__shadow{border-radius:inherit;bottom:0;left:0;position:absolute;right:0;top:0}.mdc-switch:enabled .mdc-switch__shadow{box-shadow:var(--mat-slide-toggle-handle-elevation-shadow)}.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:hover:not(:focus):not(:active) .mdc-switch__shadow,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:focus:not(:active) .mdc-switch__shadow,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:active .mdc-switch__shadow,.mdc-switch.mdc-switch--disabled .mdc-switch__shadow{box-shadow:var(--mat-slide-toggle-disabled-handle-elevation-shadow)}.mdc-switch__ripple{left:50%;position:absolute;top:50%;transform:translate(-50%, -50%);z-index:-1;width:var(--mat-slide-toggle-state-layer-size, 40px);height:var(--mat-slide-toggle-state-layer-size, 40px)}.mdc-switch__ripple::after{content:"";opacity:0}.mdc-switch--disabled .mdc-switch__ripple::after{display:none}.mat-mdc-slide-toggle-disabled-interactive .mdc-switch__ripple::after{display:block}.mdc-switch:hover .mdc-switch__ripple::after{transition:75ms opacity cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:enabled:focus .mdc-switch__ripple::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:enabled:active .mdc-switch__ripple::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:enabled:hover:not(:focus) .mdc-switch__ripple::after,.mdc-switch--unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background:var(--mat-slide-toggle-unselected-hover-state-layer-color, var(--mat-sys-on-surface));opacity:var(--mat-slide-toggle-unselected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mdc-switch--unselected:enabled:focus .mdc-switch__ripple::after{background:var(--mat-slide-toggle-unselected-focus-state-layer-color, var(--mat-sys-on-surface));opacity:var(--mat-slide-toggle-unselected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mdc-switch--unselected:enabled:active .mdc-switch__ripple::after{background:var(--mat-slide-toggle-unselected-pressed-state-layer-color, var(--mat-sys-on-surface));opacity:var(--mat-slide-toggle-unselected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));transition:opacity 75ms linear}.mdc-switch--selected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background:var(--mat-slide-toggle-selected-hover-state-layer-color, var(--mat-sys-primary));opacity:var(--mat-slide-toggle-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mdc-switch--selected:enabled:focus .mdc-switch__ripple::after{background:var(--mat-slide-toggle-selected-focus-state-layer-color, var(--mat-sys-primary));opacity:var(--mat-slide-toggle-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mdc-switch--selected:enabled:active .mdc-switch__ripple::after{background:var(--mat-slide-toggle-selected-pressed-state-layer-color, var(--mat-sys-primary));opacity:var(--mat-slide-toggle-selected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));transition:opacity 75ms linear}.mdc-switch__icons{position:relative;height:100%;width:100%;z-index:1;transform:translateZ(0)}.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__icons{opacity:var(--mat-slide-toggle-disabled-unselected-icon-opacity, 0.38)}.mdc-switch--disabled.mdc-switch--selected .mdc-switch__icons{opacity:var(--mat-slide-toggle-disabled-selected-icon-opacity, 0.38)}.mdc-switch__icon{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0;opacity:0;transition:opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-switch--unselected .mdc-switch__icon{width:var(--mat-slide-toggle-unselected-icon-size, 16px);height:var(--mat-slide-toggle-unselected-icon-size, 16px);fill:var(--mat-slide-toggle-unselected-icon-color, var(--mat-sys-surface-variant))}.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__icon{fill:var(--mat-slide-toggle-disabled-unselected-icon-color, var(--mat-sys-surface-variant))}.mdc-switch--selected .mdc-switch__icon{width:var(--mat-slide-toggle-selected-icon-size, 16px);height:var(--mat-slide-toggle-selected-icon-size, 16px);fill:var(--mat-slide-toggle-selected-icon-color, var(--mat-sys-on-primary-container))}.mdc-switch--selected.mdc-switch--disabled .mdc-switch__icon{fill:var(--mat-slide-toggle-disabled-selected-icon-color, var(--mat-sys-on-surface))}.mdc-switch--selected .mdc-switch__icon--on,.mdc-switch--unselected .mdc-switch__icon--off{opacity:1;transition:opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-slide-toggle{-webkit-user-select:none;user-select:none;display:inline-block;-webkit-tap-highlight-color:rgba(0,0,0,0);outline:0}.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple,.mat-mdc-slide-toggle .mdc-switch__ripple::after{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:50%;pointer-events:none}.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple:not(:empty),.mat-mdc-slide-toggle .mdc-switch__ripple::after:not(:empty){transform:translateZ(0)}.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mat-focus-indicator::before{content:""}.mat-mdc-slide-toggle .mat-internal-form-field{color:var(--mat-slide-toggle-label-text-color, var(--mat-sys-on-surface));font-family:var(--mat-slide-toggle-label-text-font, var(--mat-sys-body-medium-font));line-height:var(--mat-slide-toggle-label-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-slide-toggle-label-text-size, var(--mat-sys-body-medium-size));letter-spacing:var(--mat-slide-toggle-label-text-tracking, var(--mat-sys-body-medium-tracking));font-weight:var(--mat-slide-toggle-label-text-weight, var(--mat-sys-body-medium-weight))}.mat-mdc-slide-toggle .mat-ripple-element{opacity:.12}.mat-mdc-slide-toggle .mat-focus-indicator::before{border-radius:50%}.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle-track,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__icon,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::before,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::after,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::before,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::after{transition:none}.mat-mdc-slide-toggle .mdc-switch:enabled+.mdc-label{cursor:pointer}.mat-mdc-slide-toggle .mdc-switch--disabled+label{color:var(--mat-slide-toggle-disabled-label-text-color, var(--mat-sys-on-surface))}.mat-mdc-slide-toggle-touch-target{position:absolute;top:50%;left:50%;height:var(--mat-slide-toggle-touch-target-size, 48px);width:100%;transform:translate(-50%, -50%);display:var(--mat-slide-toggle-touch-target-display, block)}[dir=rtl] .mat-mdc-slide-toggle-touch-target{left:auto;right:50%;transform:translate(50%, -50%)}\n'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSlideToggle, [{
    type: Component,
    args: [{
      selector: "mat-slide-toggle",
      host: {
        "class": "mat-mdc-slide-toggle",
        "[id]": "id",
        "[attr.tabindex]": "null",
        "[attr.aria-label]": "null",
        "[attr.name]": "null",
        "[attr.aria-labelledby]": "null",
        "[class.mat-mdc-slide-toggle-focused]": "_focused",
        "[class.mat-mdc-slide-toggle-checked]": "checked",
        "[class._mat-animation-noopable]": "_noopAnimations",
        "[class]": 'color ? "mat-" + color : ""'
      },
      exportAs: "matSlideToggle",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => MatSlideToggle),
        multi: true
      }, {
        provide: NG_VALIDATORS,
        useExisting: MatSlideToggle,
        multi: true
      }],
      imports: [MatRipple, _MatInternalFormField],
      template: `<div mat-internal-form-field [labelPosition]="labelPosition">
  <button
    class="mdc-switch"
    role="switch"
    type="button"
    [class.mdc-switch--selected]="checked"
    [class.mdc-switch--unselected]="!checked"
    [class.mdc-switch--checked]="checked"
    [class.mdc-switch--disabled]="disabled"
    [class.mat-mdc-slide-toggle-disabled-interactive]="disabledInteractive"
    [tabIndex]="disabled && !disabledInteractive ? -1 : tabIndex"
    [disabled]="disabled && !disabledInteractive"
    [attr.id]="buttonId"
    [attr.name]="name"
    [attr.aria-label]="ariaLabel"
    [attr.aria-labelledby]="_getAriaLabelledBy()"
    [attr.aria-describedby]="ariaDescribedby"
    [attr.aria-required]="required || null"
    [attr.aria-checked]="checked"
    [attr.aria-disabled]="disabled && disabledInteractive ? 'true' : null"
    (click)="_handleClick()"
    #switch>
    <div class="mat-mdc-slide-toggle-touch-target"></div>
    <span class="mdc-switch__track"></span>
    <span class="mdc-switch__handle-track">
      <span class="mdc-switch__handle">
        <span class="mdc-switch__shadow">
          <span class="mdc-elevation-overlay"></span>
        </span>
        <span class="mdc-switch__ripple">
          <span class="mat-mdc-slide-toggle-ripple mat-focus-indicator" mat-ripple
            [matRippleTrigger]="switch"
            [matRippleDisabled]="disableRipple || disabled"
            [matRippleCentered]="true"></span>
        </span>
        @if (!hideIcon) {
          <span class="mdc-switch__icons">
            <svg
              class="mdc-switch__icon mdc-switch__icon--on"
              viewBox="0 0 24 24"
              aria-hidden="true">
              <path d="M19.69,5.23L8.96,15.96l-4.23-4.23L2.96,13.5l6,6L21.46,7L19.69,5.23z" />
            </svg>
            <svg
              class="mdc-switch__icon mdc-switch__icon--off"
              viewBox="0 0 24 24"
              aria-hidden="true">
              <path d="M20 13H4v-2h16v2z" />
            </svg>
          </span>
        }
      </span>
    </span>
  </button>

  <!--
    Clicking on the label will trigger another click event from the button.
    Stop propagation here so other listeners further up in the DOM don't execute twice.
  -->
  <label class="mdc-label" [for]="buttonId" [attr.id]="_labelId" (click)="$event.stopPropagation()">
    <ng-content></ng-content>
  </label>
</div>
`,
      styles: ['.mdc-switch{align-items:center;background:none;border:none;cursor:pointer;display:inline-flex;flex-shrink:0;margin:0;outline:none;overflow:visible;padding:0;position:relative;width:var(--mat-slide-toggle-track-width, 52px)}.mdc-switch.mdc-switch--disabled{cursor:default;pointer-events:none}.mdc-switch.mat-mdc-slide-toggle-disabled-interactive{pointer-events:auto}label:empty{display:none}.mdc-switch__track{overflow:hidden;position:relative;width:100%;height:var(--mat-slide-toggle-track-height, 32px);border-radius:var(--mat-slide-toggle-track-shape, var(--mat-sys-corner-full))}.mdc-switch--disabled.mdc-switch .mdc-switch__track{opacity:var(--mat-slide-toggle-disabled-track-opacity, 0.12)}.mdc-switch__track::before,.mdc-switch__track::after{border:1px solid rgba(0,0,0,0);border-radius:inherit;box-sizing:border-box;content:"";height:100%;left:0;position:absolute;width:100%;border-width:var(--mat-slide-toggle-track-outline-width, 2px);border-color:var(--mat-slide-toggle-track-outline-color, var(--mat-sys-outline))}.mdc-switch--selected .mdc-switch__track::before,.mdc-switch--selected .mdc-switch__track::after{border-width:var(--mat-slide-toggle-selected-track-outline-width, 2px);border-color:var(--mat-slide-toggle-selected-track-outline-color, transparent)}.mdc-switch--disabled .mdc-switch__track::before,.mdc-switch--disabled .mdc-switch__track::after{border-width:var(--mat-slide-toggle-disabled-unselected-track-outline-width, 2px);border-color:var(--mat-slide-toggle-disabled-unselected-track-outline-color, var(--mat-sys-on-surface))}@media(forced-colors: active){.mdc-switch__track{border-color:currentColor}}.mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0, 0, 0.2, 1);transform:translateX(0);background:var(--mat-slide-toggle-unselected-track-color, var(--mat-sys-surface-variant))}.mdc-switch--selected .mdc-switch__track::before{transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.6, 1);transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch--selected .mdc-switch__track::before{transform:translateX(-100%)}.mdc-switch--selected .mdc-switch__track::before{opacity:var(--mat-slide-toggle-hidden-track-opacity, 0);transition:var(--mat-slide-toggle-hidden-track-transition, opacity 75ms)}.mdc-switch--unselected .mdc-switch__track::before{opacity:var(--mat-slide-toggle-visible-track-opacity, 1);transition:var(--mat-slide-toggle-visible-track-transition, opacity 75ms)}.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::before{background:var(--mat-slide-toggle-unselected-hover-track-color, var(--mat-sys-surface-variant))}.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::before{background:var(--mat-slide-toggle-unselected-focus-track-color, var(--mat-sys-surface-variant))}.mdc-switch:enabled:active .mdc-switch__track::before{background:var(--mat-slide-toggle-unselected-pressed-track-color, var(--mat-sys-surface-variant))}.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:hover:not(:focus):not(:active) .mdc-switch__track::before,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:focus:not(:active) .mdc-switch__track::before,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:active .mdc-switch__track::before,.mdc-switch.mdc-switch--disabled .mdc-switch__track::before{background:var(--mat-slide-toggle-disabled-unselected-track-color, var(--mat-sys-surface-variant))}.mdc-switch__track::after{transform:translateX(-100%);background:var(--mat-slide-toggle-selected-track-color, var(--mat-sys-primary))}[dir=rtl] .mdc-switch__track::after{transform:translateX(100%)}.mdc-switch--selected .mdc-switch__track::after{transform:translateX(0)}.mdc-switch--selected .mdc-switch__track::after{opacity:var(--mat-slide-toggle-visible-track-opacity, 1);transition:var(--mat-slide-toggle-visible-track-transition, opacity 75ms)}.mdc-switch--unselected .mdc-switch__track::after{opacity:var(--mat-slide-toggle-hidden-track-opacity, 0);transition:var(--mat-slide-toggle-hidden-track-transition, opacity 75ms)}.mdc-switch:enabled:hover:not(:focus):not(:active) .mdc-switch__track::after{background:var(--mat-slide-toggle-selected-hover-track-color, var(--mat-sys-primary))}.mdc-switch:enabled:focus:not(:active) .mdc-switch__track::after{background:var(--mat-slide-toggle-selected-focus-track-color, var(--mat-sys-primary))}.mdc-switch:enabled:active .mdc-switch__track::after{background:var(--mat-slide-toggle-selected-pressed-track-color, var(--mat-sys-primary))}.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:hover:not(:focus):not(:active) .mdc-switch__track::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:focus:not(:active) .mdc-switch__track::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:active .mdc-switch__track::after,.mdc-switch.mdc-switch--disabled .mdc-switch__track::after{background:var(--mat-slide-toggle-disabled-selected-track-color, var(--mat-sys-on-surface))}.mdc-switch__handle-track{height:100%;pointer-events:none;position:absolute;top:0;transition:transform 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);left:0;right:auto;transform:translateX(0);width:calc(100% - var(--mat-slide-toggle-handle-width))}[dir=rtl] .mdc-switch__handle-track{left:auto;right:0}.mdc-switch--selected .mdc-switch__handle-track{transform:translateX(100%)}[dir=rtl] .mdc-switch--selected .mdc-switch__handle-track{transform:translateX(-100%)}.mdc-switch__handle{display:flex;pointer-events:auto;position:absolute;top:50%;transform:translateY(-50%);left:0;right:auto;transition:width 75ms cubic-bezier(0.4, 0, 0.2, 1),height 75ms cubic-bezier(0.4, 0, 0.2, 1),margin 75ms cubic-bezier(0.4, 0, 0.2, 1);width:var(--mat-slide-toggle-handle-width);height:var(--mat-slide-toggle-handle-height);border-radius:var(--mat-slide-toggle-handle-shape, var(--mat-sys-corner-full))}[dir=rtl] .mdc-switch__handle{left:auto;right:0}.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle{width:var(--mat-slide-toggle-unselected-handle-size, 16px);height:var(--mat-slide-toggle-unselected-handle-size, 16px);margin:var(--mat-slide-toggle-unselected-handle-horizontal-margin, 0 8px)}.mat-mdc-slide-toggle .mdc-switch--unselected .mdc-switch__handle:has(.mdc-switch__icons){margin:var(--mat-slide-toggle-unselected-with-icon-handle-horizontal-margin, 0 4px)}.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle{width:var(--mat-slide-toggle-selected-handle-size, 24px);height:var(--mat-slide-toggle-selected-handle-size, 24px);margin:var(--mat-slide-toggle-selected-handle-horizontal-margin, 0 24px)}.mat-mdc-slide-toggle .mdc-switch--selected .mdc-switch__handle:has(.mdc-switch__icons){margin:var(--mat-slide-toggle-selected-with-icon-handle-horizontal-margin, 0 24px)}.mat-mdc-slide-toggle .mdc-switch__handle:has(.mdc-switch__icons){width:var(--mat-slide-toggle-with-icon-handle-size, 24px);height:var(--mat-slide-toggle-with-icon-handle-size, 24px)}.mat-mdc-slide-toggle .mdc-switch:active:not(.mdc-switch--disabled) .mdc-switch__handle{width:var(--mat-slide-toggle-pressed-handle-size, 28px);height:var(--mat-slide-toggle-pressed-handle-size, 28px)}.mat-mdc-slide-toggle .mdc-switch--selected:active:not(.mdc-switch--disabled) .mdc-switch__handle{margin:var(--mat-slide-toggle-selected-pressed-handle-horizontal-margin, 0 22px)}.mat-mdc-slide-toggle .mdc-switch--unselected:active:not(.mdc-switch--disabled) .mdc-switch__handle{margin:var(--mat-slide-toggle-unselected-pressed-handle-horizontal-margin, 0 2px)}.mdc-switch--disabled.mdc-switch--selected .mdc-switch__handle::after{opacity:var(--mat-slide-toggle-disabled-selected-handle-opacity, 1)}.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__handle::after{opacity:var(--mat-slide-toggle-disabled-unselected-handle-opacity, 0.38)}.mdc-switch__handle::before,.mdc-switch__handle::after{border:1px solid rgba(0,0,0,0);border-radius:inherit;box-sizing:border-box;content:"";width:100%;height:100%;left:0;position:absolute;top:0;transition:background-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1),border-color 75ms 0ms cubic-bezier(0.4, 0, 0.2, 1);z-index:-1}@media(forced-colors: active){.mdc-switch__handle::before,.mdc-switch__handle::after{border-color:currentColor}}.mdc-switch--selected:enabled .mdc-switch__handle::after{background:var(--mat-slide-toggle-selected-handle-color, var(--mat-sys-on-primary))}.mdc-switch--selected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:var(--mat-slide-toggle-selected-hover-handle-color, var(--mat-sys-primary-container))}.mdc-switch--selected:enabled:focus:not(:active) .mdc-switch__handle::after{background:var(--mat-slide-toggle-selected-focus-handle-color, var(--mat-sys-primary-container))}.mdc-switch--selected:enabled:active .mdc-switch__handle::after{background:var(--mat-slide-toggle-selected-pressed-handle-color, var(--mat-sys-primary-container))}.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--selected:hover:not(:focus):not(:active) .mdc-switch__handle::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--selected:focus:not(:active) .mdc-switch__handle::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled.mdc-switch--selected:active .mdc-switch__handle::after,.mdc-switch--selected.mdc-switch--disabled .mdc-switch__handle::after{background:var(--mat-slide-toggle-disabled-selected-handle-color, var(--mat-sys-surface))}.mdc-switch--unselected:enabled .mdc-switch__handle::after{background:var(--mat-slide-toggle-unselected-handle-color, var(--mat-sys-outline))}.mdc-switch--unselected:enabled:hover:not(:focus):not(:active) .mdc-switch__handle::after{background:var(--mat-slide-toggle-unselected-hover-handle-color, var(--mat-sys-on-surface-variant))}.mdc-switch--unselected:enabled:focus:not(:active) .mdc-switch__handle::after{background:var(--mat-slide-toggle-unselected-focus-handle-color, var(--mat-sys-on-surface-variant))}.mdc-switch--unselected:enabled:active .mdc-switch__handle::after{background:var(--mat-slide-toggle-unselected-pressed-handle-color, var(--mat-sys-on-surface-variant))}.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__handle::after{background:var(--mat-slide-toggle-disabled-unselected-handle-color, var(--mat-sys-on-surface))}.mdc-switch__handle::before{background:var(--mat-slide-toggle-handle-surface-color)}.mdc-switch__shadow{border-radius:inherit;bottom:0;left:0;position:absolute;right:0;top:0}.mdc-switch:enabled .mdc-switch__shadow{box-shadow:var(--mat-slide-toggle-handle-elevation-shadow)}.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:hover:not(:focus):not(:active) .mdc-switch__shadow,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:focus:not(:active) .mdc-switch__shadow,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:active .mdc-switch__shadow,.mdc-switch.mdc-switch--disabled .mdc-switch__shadow{box-shadow:var(--mat-slide-toggle-disabled-handle-elevation-shadow)}.mdc-switch__ripple{left:50%;position:absolute;top:50%;transform:translate(-50%, -50%);z-index:-1;width:var(--mat-slide-toggle-state-layer-size, 40px);height:var(--mat-slide-toggle-state-layer-size, 40px)}.mdc-switch__ripple::after{content:"";opacity:0}.mdc-switch--disabled .mdc-switch__ripple::after{display:none}.mat-mdc-slide-toggle-disabled-interactive .mdc-switch__ripple::after{display:block}.mdc-switch:hover .mdc-switch__ripple::after{transition:75ms opacity cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:enabled:focus .mdc-switch__ripple::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:enabled:active .mdc-switch__ripple::after,.mat-mdc-slide-toggle-disabled-interactive.mdc-switch--disabled:enabled:hover:not(:focus) .mdc-switch__ripple::after,.mdc-switch--unselected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background:var(--mat-slide-toggle-unselected-hover-state-layer-color, var(--mat-sys-on-surface));opacity:var(--mat-slide-toggle-unselected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mdc-switch--unselected:enabled:focus .mdc-switch__ripple::after{background:var(--mat-slide-toggle-unselected-focus-state-layer-color, var(--mat-sys-on-surface));opacity:var(--mat-slide-toggle-unselected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mdc-switch--unselected:enabled:active .mdc-switch__ripple::after{background:var(--mat-slide-toggle-unselected-pressed-state-layer-color, var(--mat-sys-on-surface));opacity:var(--mat-slide-toggle-unselected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));transition:opacity 75ms linear}.mdc-switch--selected:enabled:hover:not(:focus) .mdc-switch__ripple::after{background:var(--mat-slide-toggle-selected-hover-state-layer-color, var(--mat-sys-primary));opacity:var(--mat-slide-toggle-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mdc-switch--selected:enabled:focus .mdc-switch__ripple::after{background:var(--mat-slide-toggle-selected-focus-state-layer-color, var(--mat-sys-primary));opacity:var(--mat-slide-toggle-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mdc-switch--selected:enabled:active .mdc-switch__ripple::after{background:var(--mat-slide-toggle-selected-pressed-state-layer-color, var(--mat-sys-primary));opacity:var(--mat-slide-toggle-selected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));transition:opacity 75ms linear}.mdc-switch__icons{position:relative;height:100%;width:100%;z-index:1;transform:translateZ(0)}.mdc-switch--disabled.mdc-switch--unselected .mdc-switch__icons{opacity:var(--mat-slide-toggle-disabled-unselected-icon-opacity, 0.38)}.mdc-switch--disabled.mdc-switch--selected .mdc-switch__icons{opacity:var(--mat-slide-toggle-disabled-selected-icon-opacity, 0.38)}.mdc-switch__icon{bottom:0;left:0;margin:auto;position:absolute;right:0;top:0;opacity:0;transition:opacity 30ms 0ms cubic-bezier(0.4, 0, 1, 1)}.mdc-switch--unselected .mdc-switch__icon{width:var(--mat-slide-toggle-unselected-icon-size, 16px);height:var(--mat-slide-toggle-unselected-icon-size, 16px);fill:var(--mat-slide-toggle-unselected-icon-color, var(--mat-sys-surface-variant))}.mdc-switch--unselected.mdc-switch--disabled .mdc-switch__icon{fill:var(--mat-slide-toggle-disabled-unselected-icon-color, var(--mat-sys-surface-variant))}.mdc-switch--selected .mdc-switch__icon{width:var(--mat-slide-toggle-selected-icon-size, 16px);height:var(--mat-slide-toggle-selected-icon-size, 16px);fill:var(--mat-slide-toggle-selected-icon-color, var(--mat-sys-on-primary-container))}.mdc-switch--selected.mdc-switch--disabled .mdc-switch__icon{fill:var(--mat-slide-toggle-disabled-selected-icon-color, var(--mat-sys-on-surface))}.mdc-switch--selected .mdc-switch__icon--on,.mdc-switch--unselected .mdc-switch__icon--off{opacity:1;transition:opacity 45ms 30ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-slide-toggle{-webkit-user-select:none;user-select:none;display:inline-block;-webkit-tap-highlight-color:rgba(0,0,0,0);outline:0}.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple,.mat-mdc-slide-toggle .mdc-switch__ripple::after{top:0;left:0;right:0;bottom:0;position:absolute;border-radius:50%;pointer-events:none}.mat-mdc-slide-toggle .mat-mdc-slide-toggle-ripple:not(:empty),.mat-mdc-slide-toggle .mdc-switch__ripple::after:not(:empty){transform:translateZ(0)}.mat-mdc-slide-toggle.mat-mdc-slide-toggle-focused .mat-focus-indicator::before{content:""}.mat-mdc-slide-toggle .mat-internal-form-field{color:var(--mat-slide-toggle-label-text-color, var(--mat-sys-on-surface));font-family:var(--mat-slide-toggle-label-text-font, var(--mat-sys-body-medium-font));line-height:var(--mat-slide-toggle-label-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-slide-toggle-label-text-size, var(--mat-sys-body-medium-size));letter-spacing:var(--mat-slide-toggle-label-text-tracking, var(--mat-sys-body-medium-tracking));font-weight:var(--mat-slide-toggle-label-text-weight, var(--mat-sys-body-medium-weight))}.mat-mdc-slide-toggle .mat-ripple-element{opacity:.12}.mat-mdc-slide-toggle .mat-focus-indicator::before{border-radius:50%}.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle-track,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__icon,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::before,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__handle::after,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::before,.mat-mdc-slide-toggle._mat-animation-noopable .mdc-switch__track::after{transition:none}.mat-mdc-slide-toggle .mdc-switch:enabled+.mdc-label{cursor:pointer}.mat-mdc-slide-toggle .mdc-switch--disabled+label{color:var(--mat-slide-toggle-disabled-label-text-color, var(--mat-sys-on-surface))}.mat-mdc-slide-toggle-touch-target{position:absolute;top:50%;left:50%;height:var(--mat-slide-toggle-touch-target-size, 48px);width:100%;transform:translate(-50%, -50%);display:var(--mat-slide-toggle-touch-target-display, block)}[dir=rtl] .mat-mdc-slide-toggle-touch-target{left:auto;right:50%;transform:translate(50%, -50%)}\n']
    }]
  }], () => [], {
    _switchElement: [{
      type: ViewChild,
      args: ["switch"]
    }],
    name: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    labelPosition: [{
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
    required: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    color: [{
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
    checked: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hideIcon: [{
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
    }],
    change: [{
      type: Output
    }],
    toggleChange: [{
      type: Output
    }]
  });
})();
var MatSlideToggleModule = class _MatSlideToggleModule {
  static \u0275fac = function MatSlideToggleModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSlideToggleModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatSlideToggleModule,
    imports: [MatSlideToggle],
    exports: [MatSlideToggle, BidiModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatSlideToggle, BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSlideToggleModule, [{
    type: NgModule,
    args: [{
      imports: [MatSlideToggle],
      exports: [MatSlideToggle, BidiModule]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/sort.mjs
var _c03 = ["mat-sort-header", ""];
var _c13 = ["*", [["", "matSortHeaderIcon", ""]]];
var _c2 = ["*", "[matSortHeaderIcon]"];
function MatSortHeader_Conditional_3_ProjectionFallback_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 3);
    \u0275\u0275domElement(1, "path", 4);
    \u0275\u0275domElementEnd();
  }
}
function MatSortHeader_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 2);
    \u0275\u0275projection(1, 1, null, MatSortHeader_Conditional_3_ProjectionFallback_1_Template, 2, 0);
    \u0275\u0275domElementEnd();
  }
}
function getSortDuplicateSortableIdError(id) {
  return Error(`Cannot have two MatSortables with the same id (${id}).`);
}
function getSortHeaderNotContainedWithinSortError() {
  return Error(`MatSortHeader must be placed within a parent element with the MatSort directive.`);
}
function getSortHeaderMissingIdError() {
  return Error(`MatSortHeader must be provided with a unique id.`);
}
function getSortInvalidDirectionError(direction) {
  return Error(`${direction} is not a valid sort direction ('asc' or 'desc').`);
}
var MAT_SORT_DEFAULT_OPTIONS = new InjectionToken("MAT_SORT_DEFAULT_OPTIONS");
var MatSort = class _MatSort {
  _defaultOptions;
  _initializedStream = new ReplaySubject(1);
  sortables = /* @__PURE__ */ new Map();
  _stateChanges = new Subject();
  active;
  start = "asc";
  get direction() {
    return this._direction;
  }
  set direction(direction) {
    if (direction && direction !== "asc" && direction !== "desc" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getSortInvalidDirectionError(direction);
    }
    this._direction = direction;
  }
  _direction = "";
  disableClear;
  disabled = false;
  sortChange = new EventEmitter();
  initialized = this._initializedStream;
  constructor(_defaultOptions) {
    this._defaultOptions = _defaultOptions;
  }
  register(sortable) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (!sortable.id) {
        throw getSortHeaderMissingIdError();
      }
      if (this.sortables.has(sortable.id)) {
        throw getSortDuplicateSortableIdError(sortable.id);
      }
    }
    this.sortables.set(sortable.id, sortable);
  }
  deregister(sortable) {
    this.sortables.delete(sortable.id);
  }
  sort(sortable) {
    if (this.active != sortable.id) {
      this.active = sortable.id;
      this.direction = sortable.start ? sortable.start : this.start;
    } else {
      this.direction = this.getNextSortDirection(sortable);
    }
    this.sortChange.emit({
      active: this.active,
      direction: this.direction
    });
  }
  getNextSortDirection(sortable) {
    if (!sortable) {
      return "";
    }
    const disableClear = sortable?.disableClear ?? this.disableClear ?? !!this._defaultOptions?.disableClear;
    let sortDirectionCycle = getSortDirectionCycle(sortable.start || this.start, disableClear);
    let nextDirectionIndex = sortDirectionCycle.indexOf(this.direction) + 1;
    if (nextDirectionIndex >= sortDirectionCycle.length) {
      nextDirectionIndex = 0;
    }
    return sortDirectionCycle[nextDirectionIndex];
  }
  ngOnInit() {
    this._initializedStream.next();
  }
  ngOnChanges() {
    this._stateChanges.next();
  }
  ngOnDestroy() {
    this._stateChanges.complete();
    this._initializedStream.complete();
  }
  static \u0275fac = function MatSort_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSort)(\u0275\u0275directiveInject(MAT_SORT_DEFAULT_OPTIONS, 8));
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatSort,
    selectors: [["", "matSort", ""]],
    hostAttrs: [1, "mat-sort"],
    inputs: {
      active: [0, "matSortActive", "active"],
      start: [0, "matSortStart", "start"],
      direction: [0, "matSortDirection", "direction"],
      disableClear: [2, "matSortDisableClear", "disableClear", booleanAttribute],
      disabled: [2, "matSortDisabled", "disabled", booleanAttribute]
    },
    outputs: {
      sortChange: "matSortChange"
    },
    exportAs: ["matSort"],
    features: [\u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSort, [{
    type: Directive,
    args: [{
      selector: "[matSort]",
      exportAs: "matSort",
      host: {
        "class": "mat-sort"
      }
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [MAT_SORT_DEFAULT_OPTIONS]
    }]
  }], {
    active: [{
      type: Input,
      args: ["matSortActive"]
    }],
    start: [{
      type: Input,
      args: ["matSortStart"]
    }],
    direction: [{
      type: Input,
      args: ["matSortDirection"]
    }],
    disableClear: [{
      type: Input,
      args: [{
        alias: "matSortDisableClear",
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        alias: "matSortDisabled",
        transform: booleanAttribute
      }]
    }],
    sortChange: [{
      type: Output,
      args: ["matSortChange"]
    }]
  });
})();
function getSortDirectionCycle(start, disableClear) {
  let sortOrder = ["asc", "desc"];
  if (start == "desc") {
    sortOrder.reverse();
  }
  if (!disableClear) {
    sortOrder.push("");
  }
  return sortOrder;
}
var MatSortHeaderIntl = class _MatSortHeaderIntl {
  changes = new Subject();
  static \u0275fac = function MatSortHeaderIntl_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSortHeaderIntl)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _MatSortHeaderIntl,
    factory: _MatSortHeaderIntl.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSortHeaderIntl, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var MatSortHeader = class _MatSortHeader {
  _intl = inject(MatSortHeaderIntl);
  _sort = inject(MatSort, {
    optional: true
  });
  _columnDef = inject("MAT_SORT_HEADER_COLUMN_DEF", {
    optional: true
  });
  _changeDetectorRef = inject(ChangeDetectorRef);
  _focusMonitor = inject(FocusMonitor);
  _elementRef = inject(ElementRef);
  _ariaDescriber = inject(AriaDescriber, {
    optional: true
  });
  _renderChanges;
  _animationsDisabled = _animationsDisabled();
  _recentlyCleared = signal(null, ...ngDevMode ? [{
    debugName: "_recentlyCleared"
  }] : []);
  _sortButton;
  id;
  arrowPosition = "after";
  start;
  disabled = false;
  get sortActionDescription() {
    return this._sortActionDescription;
  }
  set sortActionDescription(value) {
    this._updateSortActionDescription(value);
  }
  _sortActionDescription = "Sort";
  disableClear;
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
    const defaultOptions = inject(MAT_SORT_DEFAULT_OPTIONS, {
      optional: true
    });
    if (!this._sort && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getSortHeaderNotContainedWithinSortError();
    }
    if (defaultOptions?.arrowPosition) {
      this.arrowPosition = defaultOptions?.arrowPosition;
    }
  }
  ngOnInit() {
    if (!this.id && this._columnDef) {
      this.id = this._columnDef.name;
    }
    this._sort.register(this);
    this._renderChanges = merge(this._sort._stateChanges, this._sort.sortChange).subscribe(() => this._changeDetectorRef.markForCheck());
    this._sortButton = this._elementRef.nativeElement.querySelector(".mat-sort-header-container");
    this._updateSortActionDescription(this._sortActionDescription);
  }
  ngAfterViewInit() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe(() => {
      Promise.resolve().then(() => this._recentlyCleared.set(null));
    });
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._sort.deregister(this);
    this._renderChanges?.unsubscribe();
    if (this._sortButton) {
      this._ariaDescriber?.removeDescription(this._sortButton, this._sortActionDescription);
    }
  }
  _toggleOnInteraction() {
    if (!this._isDisabled()) {
      const wasSorted = this._isSorted();
      const prevDirection = this._sort.direction;
      this._sort.sort(this);
      this._recentlyCleared.set(wasSorted && !this._isSorted() ? prevDirection : null);
    }
  }
  _handleKeydown(event) {
    if (event.keyCode === SPACE || event.keyCode === ENTER) {
      event.preventDefault();
      this._toggleOnInteraction();
    }
  }
  _isSorted() {
    return this._sort.active == this.id && (this._sort.direction === "asc" || this._sort.direction === "desc");
  }
  _isDisabled() {
    return this._sort.disabled || this.disabled;
  }
  _getAriaSortAttribute() {
    if (!this._isSorted()) {
      return "none";
    }
    return this._sort.direction == "asc" ? "ascending" : "descending";
  }
  _renderArrow() {
    return !this._isDisabled() || this._isSorted();
  }
  _updateSortActionDescription(newDescription) {
    if (this._sortButton) {
      this._ariaDescriber?.removeDescription(this._sortButton, this._sortActionDescription);
      this._ariaDescriber?.describe(this._sortButton, newDescription);
    }
    this._sortActionDescription = newDescription;
  }
  static \u0275fac = function MatSortHeader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSortHeader)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatSortHeader,
    selectors: [["", "mat-sort-header", ""]],
    hostAttrs: [1, "mat-sort-header"],
    hostVars: 3,
    hostBindings: function MatSortHeader_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("click", function MatSortHeader_click_HostBindingHandler() {
          return ctx._toggleOnInteraction();
        })("keydown", function MatSortHeader_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        })("mouseleave", function MatSortHeader_mouseleave_HostBindingHandler() {
          return ctx._recentlyCleared.set(null);
        });
      }
      if (rf & 2) {
        \u0275\u0275attribute("aria-sort", ctx._getAriaSortAttribute());
        \u0275\u0275classProp("mat-sort-header-disabled", ctx._isDisabled());
      }
    },
    inputs: {
      id: [0, "mat-sort-header", "id"],
      arrowPosition: "arrowPosition",
      start: "start",
      disabled: [2, "disabled", "disabled", booleanAttribute],
      sortActionDescription: "sortActionDescription",
      disableClear: [2, "disableClear", "disableClear", booleanAttribute]
    },
    exportAs: ["matSortHeader"],
    attrs: _c03,
    ngContentSelectors: _c2,
    decls: 4,
    vars: 17,
    consts: [[1, "mat-sort-header-container", "mat-focus-indicator"], [1, "mat-sort-header-content"], [1, "mat-sort-header-arrow"], ["viewBox", "0 -960 960 960", "focusable", "false", "aria-hidden", "true"], ["d", "M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z"]],
    template: function MatSortHeader_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c13);
        \u0275\u0275domElementStart(0, "div", 0)(1, "div", 1);
        \u0275\u0275projection(2);
        \u0275\u0275domElementEnd();
        \u0275\u0275conditionalCreate(3, MatSortHeader_Conditional_3_Template, 3, 0, "div", 2);
        \u0275\u0275domElementEnd();
      }
      if (rf & 2) {
        \u0275\u0275classProp("mat-sort-header-sorted", ctx._isSorted())("mat-sort-header-position-before", ctx.arrowPosition === "before")("mat-sort-header-descending", ctx._sort.direction === "desc")("mat-sort-header-ascending", ctx._sort.direction === "asc")("mat-sort-header-recently-cleared-ascending", ctx._recentlyCleared() === "asc")("mat-sort-header-recently-cleared-descending", ctx._recentlyCleared() === "desc")("mat-sort-header-animations-disabled", ctx._animationsDisabled);
        \u0275\u0275attribute("tabindex", ctx._isDisabled() ? null : 0)("role", ctx._isDisabled() ? null : "button");
        \u0275\u0275advance(3);
        \u0275\u0275conditional(ctx._renderArrow() ? 3 : -1);
      }
    },
    styles: [".mat-sort-header{cursor:pointer}.mat-sort-header-disabled{cursor:default}.mat-sort-header-container{display:flex;align-items:center;letter-spacing:normal;outline:0}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container,[mat-sort-header].cdk-program-focused .mat-sort-header-container{border-bottom:solid 1px currentColor}.mat-sort-header-container::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-sort-header-content{display:flex;align-items:center}.mat-sort-header-position-before{flex-direction:row-reverse}@keyframes _mat-sort-header-recently-cleared-ascending{from{transform:translateY(0);opacity:1}to{transform:translateY(-25%);opacity:0}}@keyframes _mat-sort-header-recently-cleared-descending{from{transform:translateY(0) rotate(180deg);opacity:1}to{transform:translateY(25%) rotate(180deg);opacity:0}}.mat-sort-header-arrow{height:12px;width:12px;position:relative;transition:transform 225ms cubic-bezier(0.4, 0, 0.2, 1),opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0;overflow:visible;color:var(--mat-sort-arrow-color, var(--mat-sys-on-surface))}.mat-sort-header.cdk-keyboard-focused .mat-sort-header-arrow,.mat-sort-header.cdk-program-focused .mat-sort-header-arrow,.mat-sort-header:hover .mat-sort-header-arrow{opacity:.54}.mat-sort-header .mat-sort-header-sorted .mat-sort-header-arrow{opacity:1}.mat-sort-header-descending .mat-sort-header-arrow{transform:rotate(180deg)}.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow{transform:translateY(-25%)}.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow{transition:none;animation:_mat-sort-header-recently-cleared-ascending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards}.mat-sort-header-recently-cleared-descending .mat-sort-header-arrow{transition:none;animation:_mat-sort-header-recently-cleared-descending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards}.mat-sort-header-animations-disabled .mat-sort-header-arrow{transition-duration:0ms;animation-duration:0ms}.mat-sort-header-arrow>svg,.mat-sort-header-arrow [matSortHeaderIcon]{width:24px;height:24px;fill:currentColor;position:absolute;top:50%;left:50%;margin:-12px 0 0 -12px;transform:translateZ(0)}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSortHeader, [{
    type: Component,
    args: [{
      selector: "[mat-sort-header]",
      exportAs: "matSortHeader",
      host: {
        "class": "mat-sort-header",
        "(click)": "_toggleOnInteraction()",
        "(keydown)": "_handleKeydown($event)",
        "(mouseleave)": "_recentlyCleared.set(null)",
        "[attr.aria-sort]": "_getAriaSortAttribute()",
        "[class.mat-sort-header-disabled]": "_isDisabled()"
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<!--
  We set the \`tabindex\` on an element inside the table header, rather than the header itself,
  because of a bug in NVDA where having a \`tabindex\` on a \`th\` breaks keyboard navigation in the
  table (see https://github.com/nvaccess/nvda/issues/7718). This allows for the header to both
  be focusable, and have screen readers read out its \`aria-sort\` state. We prefer this approach
  over having a button with an \`aria-label\` inside the header, because the button's \`aria-label\`
  will be read out as the user is navigating the table's cell (see #13012).

  The approach is based off of: https://dequeuniversity.com/library/aria/tables/sf-sortable-grid
-->
<div class="mat-sort-header-container mat-focus-indicator"
     [class.mat-sort-header-sorted]="_isSorted()"
     [class.mat-sort-header-position-before]="arrowPosition === 'before'"
     [class.mat-sort-header-descending]="_sort.direction === 'desc'"
     [class.mat-sort-header-ascending]="_sort.direction === 'asc'"
     [class.mat-sort-header-recently-cleared-ascending]="_recentlyCleared() === 'asc'"
     [class.mat-sort-header-recently-cleared-descending]="_recentlyCleared() === 'desc'"
     [class.mat-sort-header-animations-disabled]="_animationsDisabled"
     [attr.tabindex]="_isDisabled() ? null : 0"
     [attr.role]="_isDisabled() ? null : 'button'">

  <!--
    TODO(crisbeto): this div isn't strictly necessary, but we have to keep it due to a large
    number of screenshot diff failures. It should be removed eventually. Note that the difference
    isn't visible with a shorter header, but once it breaks up into multiple lines, this element
    causes it to be center-aligned, whereas removing it will keep the text to the left.
  -->
  <div class="mat-sort-header-content">
    <ng-content></ng-content>
  </div>

  <!-- Disable animations while a current animation is running -->
  @if (_renderArrow()) {
    <div class="mat-sort-header-arrow">
      <ng-content select="[matSortHeaderIcon]">
        <svg viewBox="0 -960 960 960" focusable="false" aria-hidden="true">
          <path d="M440-240v-368L296-464l-56-56 240-240 240 240-56 56-144-144v368h-80Z"/>
        </svg>
      </ng-content>
    </div>
  }
</div>
`,
      styles: [".mat-sort-header{cursor:pointer}.mat-sort-header-disabled{cursor:default}.mat-sort-header-container{display:flex;align-items:center;letter-spacing:normal;outline:0}[mat-sort-header].cdk-keyboard-focused .mat-sort-header-container,[mat-sort-header].cdk-program-focused .mat-sort-header-container{border-bottom:solid 1px currentColor}.mat-sort-header-container::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-sort-header-content{display:flex;align-items:center}.mat-sort-header-position-before{flex-direction:row-reverse}@keyframes _mat-sort-header-recently-cleared-ascending{from{transform:translateY(0);opacity:1}to{transform:translateY(-25%);opacity:0}}@keyframes _mat-sort-header-recently-cleared-descending{from{transform:translateY(0) rotate(180deg);opacity:1}to{transform:translateY(25%) rotate(180deg);opacity:0}}.mat-sort-header-arrow{height:12px;width:12px;position:relative;transition:transform 225ms cubic-bezier(0.4, 0, 0.2, 1),opacity 225ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0;overflow:visible;color:var(--mat-sort-arrow-color, var(--mat-sys-on-surface))}.mat-sort-header.cdk-keyboard-focused .mat-sort-header-arrow,.mat-sort-header.cdk-program-focused .mat-sort-header-arrow,.mat-sort-header:hover .mat-sort-header-arrow{opacity:.54}.mat-sort-header .mat-sort-header-sorted .mat-sort-header-arrow{opacity:1}.mat-sort-header-descending .mat-sort-header-arrow{transform:rotate(180deg)}.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow{transform:translateY(-25%)}.mat-sort-header-recently-cleared-ascending .mat-sort-header-arrow{transition:none;animation:_mat-sort-header-recently-cleared-ascending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards}.mat-sort-header-recently-cleared-descending .mat-sort-header-arrow{transition:none;animation:_mat-sort-header-recently-cleared-descending 225ms cubic-bezier(0.4, 0, 0.2, 1) forwards}.mat-sort-header-animations-disabled .mat-sort-header-arrow{transition-duration:0ms;animation-duration:0ms}.mat-sort-header-arrow>svg,.mat-sort-header-arrow [matSortHeaderIcon]{width:24px;height:24px;fill:currentColor;position:absolute;top:50%;left:50%;margin:-12px 0 0 -12px;transform:translateZ(0)}.mat-sort-header-arrow,[dir=rtl] .mat-sort-header-position-before .mat-sort-header-arrow{margin:0 0 0 6px}.mat-sort-header-position-before .mat-sort-header-arrow,[dir=rtl] .mat-sort-header-arrow{margin:0 6px 0 0}\n"]
    }]
  }], () => [], {
    id: [{
      type: Input,
      args: ["mat-sort-header"]
    }],
    arrowPosition: [{
      type: Input
    }],
    start: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    sortActionDescription: [{
      type: Input
    }],
    disableClear: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var MatSortModule = class _MatSortModule {
  static \u0275fac = function MatSortModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSortModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatSortModule,
    imports: [MatSort, MatSortHeader],
    exports: [MatSort, MatSortHeader, BidiModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSortModule, [{
    type: NgModule,
    args: [{
      imports: [MatSort, MatSortHeader],
      exports: [MatSort, MatSortHeader, BidiModule]
    }]
  }], null, null);
})();

// node_modules/@angular/material/fesm2022/table.mjs
var _c04 = [[["caption"]], [["colgroup"], ["col"]], "*"];
var _c14 = ["caption", "colgroup, col", "*"];
function MatTable_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0, 2);
  }
}
function MatTable_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "thead", 0);
    \u0275\u0275elementContainer(1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "tbody", 2);
    \u0275\u0275elementContainer(3, 3)(4, 4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "tfoot", 0);
    \u0275\u0275elementContainer(6, 5);
    \u0275\u0275elementEnd();
  }
}
function MatTable_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0, 1)(1, 3)(2, 4)(3, 5);
  }
}
function MatTextColumn_th_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "th", 3);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("text-align", ctx_r0.justify);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.headerText, " ");
  }
}
function MatTextColumn_td_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "td", 4);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const data_r2 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("text-align", ctx_r0.justify);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.dataAccessor(data_r2, ctx_r0.name), " ");
  }
}
var MatRecycleRows = class _MatRecycleRows {
  static \u0275fac = function MatRecycleRows_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatRecycleRows)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatRecycleRows,
    selectors: [["mat-table", "recycleRows", ""], ["table", "mat-table", "", "recycleRows", ""]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRecycleRows, [{
    type: Directive,
    args: [{
      selector: "mat-table[recycleRows], table[mat-table][recycleRows]"
    }]
  }], null, null);
})();
var MatTable = class _MatTable extends CdkTable {
  stickyCssClass = "mat-mdc-table-sticky";
  needsPositionStickyOnElement = false;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatTable_BaseFactory;
    return function MatTable_Factory(__ngFactoryType__) {
      return (\u0275MatTable_BaseFactory || (\u0275MatTable_BaseFactory = \u0275\u0275getInheritedFactory(_MatTable)))(__ngFactoryType__ || _MatTable);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatTable,
    selectors: [["mat-table"], ["table", "mat-table", ""]],
    hostAttrs: [1, "mat-mdc-table", "mdc-data-table__table"],
    hostVars: 2,
    hostBindings: function MatTable_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mat-table-fixed-layout", ctx.fixedLayout);
      }
    },
    exportAs: ["matTable"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkTable,
      useExisting: _MatTable
    }, {
      provide: CDK_TABLE,
      useExisting: _MatTable
    }, {
      provide: STICKY_POSITIONING_LISTENER,
      useValue: null
    }]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c14,
    decls: 5,
    vars: 2,
    consts: [["role", "rowgroup"], ["headerRowOutlet", ""], ["role", "rowgroup", 1, "mdc-data-table__content"], ["rowOutlet", ""], ["noDataRowOutlet", ""], ["footerRowOutlet", ""]],
    template: function MatTable_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c04);
        \u0275\u0275projection(0);
        \u0275\u0275projection(1, 1);
        \u0275\u0275conditionalCreate(2, MatTable_Conditional_2_Template, 1, 0);
        \u0275\u0275conditionalCreate(3, MatTable_Conditional_3_Template, 7, 0)(4, MatTable_Conditional_4_Template, 4, 0);
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx._isServer ? 2 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx._isNativeHtmlTable ? 3 : 4);
      }
    },
    dependencies: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
    styles: [".mat-mdc-table-sticky{position:sticky !important}mat-table{display:block}mat-header-row{min-height:var(--mat-table-header-container-height, 56px)}mat-row{min-height:var(--mat-table-row-item-container-height, 52px)}mat-footer-row{min-height:var(--mat-table-footer-container-height, 52px)}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table{min-width:100%;border:0;border-spacing:0;table-layout:auto;white-space:normal;background-color:var(--mat-table-background-color, var(--mat-sys-surface))}.mat-table-fixed-layout{table-layout:fixed}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:start;text-overflow:ellipsis}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px}.mat-mdc-header-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-header-container-height, 56px);color:var(--mat-table-header-headline-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-table-header-headline-font, var(--mat-sys-title-small-font, Roboto, sans-serif));line-height:var(--mat-table-header-headline-line-height, var(--mat-sys-title-small-line-height));font-size:var(--mat-table-header-headline-size, var(--mat-sys-title-small-size, 14px));font-weight:var(--mat-table-header-headline-weight, var(--mat-sys-title-small-weight, 500))}.mat-mdc-row{height:var(--mat-table-row-item-container-height, 52px);color:var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)))}.mat-mdc-row,.mdc-data-table__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-table-row-item-label-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));line-height:var(--mat-table-row-item-label-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-table-row-item-label-text-size, var(--mat-sys-body-medium-size, 14px));font-weight:var(--mat-table-row-item-label-text-weight, var(--mat-sys-body-medium-weight))}.mat-mdc-footer-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-footer-container-height, 52px);color:var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-table-footer-supporting-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));line-height:var(--mat-table-footer-supporting-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-table-footer-supporting-text-size, var(--mat-sys-body-medium-size, 14px));font-weight:var(--mat-table-footer-supporting-text-weight, var(--mat-sys-body-medium-weight));letter-spacing:var(--mat-table-footer-supporting-text-tracking, var(--mat-sys-body-medium-tracking))}.mat-mdc-header-cell{border-bottom-color:var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-header-headline-tracking, var(--mat-sys-title-small-tracking));font-weight:inherit;line-height:inherit;box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:start}.mdc-data-table__row:last-child>.mat-mdc-header-cell{border-bottom:none}.mat-mdc-cell{border-bottom-color:var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking));line-height:inherit}.mdc-data-table__row:last-child>.mat-mdc-cell{border-bottom:none}.mat-mdc-footer-cell{letter-spacing:var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking))}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}\n"],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTable, [{
    type: Component,
    args: [{
      selector: "mat-table, table[mat-table]",
      exportAs: "matTable",
      template: `
    <ng-content select="caption"/>
    <ng-content select="colgroup, col"/>

    <!--
      Unprojected content throws a hydration error so we need this to capture it.
      It gets removed on the client so it doesn't affect the layout.
    -->
    @if (_isServer) {
      <ng-content/>
    }

    @if (_isNativeHtmlTable) {
      <thead role="rowgroup">
        <ng-container headerRowOutlet/>
      </thead>
      <tbody class="mdc-data-table__content" role="rowgroup">
        <ng-container rowOutlet/>
        <ng-container noDataRowOutlet/>
      </tbody>
      <tfoot role="rowgroup">
        <ng-container footerRowOutlet/>
      </tfoot>
    } @else {
      <ng-container headerRowOutlet/>
      <ng-container rowOutlet/>
      <ng-container noDataRowOutlet/>
      <ng-container footerRowOutlet/>
    }
  `,
      host: {
        "class": "mat-mdc-table mdc-data-table__table",
        "[class.mat-table-fixed-layout]": "fixedLayout"
      },
      providers: [{
        provide: CdkTable,
        useExisting: MatTable
      }, {
        provide: CDK_TABLE,
        useExisting: MatTable
      }, {
        provide: STICKY_POSITIONING_LISTENER,
        useValue: null
      }],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.Default,
      imports: [HeaderRowOutlet, DataRowOutlet, NoDataRowOutlet, FooterRowOutlet],
      styles: [".mat-mdc-table-sticky{position:sticky !important}mat-table{display:block}mat-header-row{min-height:var(--mat-table-header-container-height, 56px)}mat-row{min-height:var(--mat-table-row-item-container-height, 52px)}mat-footer-row{min-height:var(--mat-table-footer-container-height, 52px)}mat-row,mat-header-row,mat-footer-row{display:flex;border-width:0;border-bottom-width:1px;border-style:solid;align-items:center;box-sizing:border-box}mat-cell:first-of-type,mat-header-cell:first-of-type,mat-footer-cell:first-of-type{padding-left:24px}[dir=rtl] mat-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:first-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:first-of-type:not(:only-of-type){padding-left:0;padding-right:24px}mat-cell:last-of-type,mat-header-cell:last-of-type,mat-footer-cell:last-of-type{padding-right:24px}[dir=rtl] mat-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-header-cell:last-of-type:not(:only-of-type),[dir=rtl] mat-footer-cell:last-of-type:not(:only-of-type){padding-right:0;padding-left:24px}mat-cell,mat-header-cell,mat-footer-cell{flex:1;display:flex;align-items:center;overflow:hidden;word-wrap:break-word;min-height:inherit}.mat-mdc-table{min-width:100%;border:0;border-spacing:0;table-layout:auto;white-space:normal;background-color:var(--mat-table-background-color, var(--mat-sys-surface))}.mat-table-fixed-layout{table-layout:fixed}.mdc-data-table__cell{box-sizing:border-box;overflow:hidden;text-align:start;text-overflow:ellipsis}.mdc-data-table__cell,.mdc-data-table__header-cell{padding:0 16px}.mat-mdc-header-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-header-container-height, 56px);color:var(--mat-table-header-headline-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-table-header-headline-font, var(--mat-sys-title-small-font, Roboto, sans-serif));line-height:var(--mat-table-header-headline-line-height, var(--mat-sys-title-small-line-height));font-size:var(--mat-table-header-headline-size, var(--mat-sys-title-small-size, 14px));font-weight:var(--mat-table-header-headline-weight, var(--mat-sys-title-small-weight, 500))}.mat-mdc-row{height:var(--mat-table-row-item-container-height, 52px);color:var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)))}.mat-mdc-row,.mdc-data-table__content{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-table-row-item-label-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));line-height:var(--mat-table-row-item-label-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-table-row-item-label-text-size, var(--mat-sys-body-medium-size, 14px));font-weight:var(--mat-table-row-item-label-text-weight, var(--mat-sys-body-medium-weight))}.mat-mdc-footer-row{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;height:var(--mat-table-footer-container-height, 52px);color:var(--mat-table-row-item-label-text-color, var(--mat-sys-on-surface, rgba(0, 0, 0, 0.87)));font-family:var(--mat-table-footer-supporting-text-font, var(--mat-sys-body-medium-font, Roboto, sans-serif));line-height:var(--mat-table-footer-supporting-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-table-footer-supporting-text-size, var(--mat-sys-body-medium-size, 14px));font-weight:var(--mat-table-footer-supporting-text-weight, var(--mat-sys-body-medium-weight));letter-spacing:var(--mat-table-footer-supporting-text-tracking, var(--mat-sys-body-medium-tracking))}.mat-mdc-header-cell{border-bottom-color:var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-header-headline-tracking, var(--mat-sys-title-small-tracking));font-weight:inherit;line-height:inherit;box-sizing:border-box;text-overflow:ellipsis;overflow:hidden;outline:none;text-align:start}.mdc-data-table__row:last-child>.mat-mdc-header-cell{border-bottom:none}.mat-mdc-cell{border-bottom-color:var(--mat-table-row-item-outline-color, var(--mat-sys-outline, rgba(0, 0, 0, 0.12)));border-bottom-width:var(--mat-table-row-item-outline-width, 1px);border-bottom-style:solid;letter-spacing:var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking));line-height:inherit}.mdc-data-table__row:last-child>.mat-mdc-cell{border-bottom:none}.mat-mdc-footer-cell{letter-spacing:var(--mat-table-row-item-label-text-tracking, var(--mat-sys-body-medium-tracking))}mat-row.mat-mdc-row,mat-header-row.mat-mdc-header-row,mat-footer-row.mat-mdc-footer-row{border-bottom:none}.mat-mdc-table tbody,.mat-mdc-table tfoot,.mat-mdc-table thead,.mat-mdc-cell,.mat-mdc-footer-cell,.mat-mdc-header-row,.mat-mdc-row,.mat-mdc-footer-row,.mat-mdc-table .mat-mdc-header-cell{background:inherit}.mat-mdc-table mat-header-row.mat-mdc-header-row,.mat-mdc-table mat-row.mat-mdc-row,.mat-mdc-table mat-footer-row.mat-mdc-footer-cell{height:unset}mat-header-cell.mat-mdc-header-cell,mat-cell.mat-mdc-cell,mat-footer-cell.mat-mdc-footer-cell{align-self:stretch}\n"]
    }]
  }], null, null);
})();
var MatCellDef = class _MatCellDef extends CdkCellDef {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatCellDef_BaseFactory;
    return function MatCellDef_Factory(__ngFactoryType__) {
      return (\u0275MatCellDef_BaseFactory || (\u0275MatCellDef_BaseFactory = \u0275\u0275getInheritedFactory(_MatCellDef)))(__ngFactoryType__ || _MatCellDef);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCellDef,
    selectors: [["", "matCellDef", ""]],
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkCellDef,
      useExisting: _MatCellDef
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCellDef, [{
    type: Directive,
    args: [{
      selector: "[matCellDef]",
      providers: [{
        provide: CdkCellDef,
        useExisting: MatCellDef
      }]
    }]
  }], null, null);
})();
var MatHeaderCellDef = class _MatHeaderCellDef extends CdkHeaderCellDef {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatHeaderCellDef_BaseFactory;
    return function MatHeaderCellDef_Factory(__ngFactoryType__) {
      return (\u0275MatHeaderCellDef_BaseFactory || (\u0275MatHeaderCellDef_BaseFactory = \u0275\u0275getInheritedFactory(_MatHeaderCellDef)))(__ngFactoryType__ || _MatHeaderCellDef);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatHeaderCellDef,
    selectors: [["", "matHeaderCellDef", ""]],
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkHeaderCellDef,
      useExisting: _MatHeaderCellDef
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatHeaderCellDef, [{
    type: Directive,
    args: [{
      selector: "[matHeaderCellDef]",
      providers: [{
        provide: CdkHeaderCellDef,
        useExisting: MatHeaderCellDef
      }]
    }]
  }], null, null);
})();
var MatFooterCellDef = class _MatFooterCellDef extends CdkFooterCellDef {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatFooterCellDef_BaseFactory;
    return function MatFooterCellDef_Factory(__ngFactoryType__) {
      return (\u0275MatFooterCellDef_BaseFactory || (\u0275MatFooterCellDef_BaseFactory = \u0275\u0275getInheritedFactory(_MatFooterCellDef)))(__ngFactoryType__ || _MatFooterCellDef);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatFooterCellDef,
    selectors: [["", "matFooterCellDef", ""]],
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkFooterCellDef,
      useExisting: _MatFooterCellDef
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFooterCellDef, [{
    type: Directive,
    args: [{
      selector: "[matFooterCellDef]",
      providers: [{
        provide: CdkFooterCellDef,
        useExisting: MatFooterCellDef
      }]
    }]
  }], null, null);
})();
var MatColumnDef = class _MatColumnDef extends CdkColumnDef {
  get name() {
    return this._name;
  }
  set name(name) {
    this._setNameInput(name);
  }
  _updateColumnCssClassName() {
    super._updateColumnCssClassName();
    this._columnCssClassName.push(`mat-column-${this.cssClassFriendlyName}`);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatColumnDef_BaseFactory;
    return function MatColumnDef_Factory(__ngFactoryType__) {
      return (\u0275MatColumnDef_BaseFactory || (\u0275MatColumnDef_BaseFactory = \u0275\u0275getInheritedFactory(_MatColumnDef)))(__ngFactoryType__ || _MatColumnDef);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatColumnDef,
    selectors: [["", "matColumnDef", ""]],
    inputs: {
      name: [0, "matColumnDef", "name"]
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkColumnDef,
      useExisting: _MatColumnDef
    }, {
      provide: "MAT_SORT_HEADER_COLUMN_DEF",
      useExisting: _MatColumnDef
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatColumnDef, [{
    type: Directive,
    args: [{
      selector: "[matColumnDef]",
      providers: [{
        provide: CdkColumnDef,
        useExisting: MatColumnDef
      }, {
        provide: "MAT_SORT_HEADER_COLUMN_DEF",
        useExisting: MatColumnDef
      }]
    }]
  }], null, {
    name: [{
      type: Input,
      args: ["matColumnDef"]
    }]
  });
})();
var MatHeaderCell = class _MatHeaderCell extends CdkHeaderCell {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatHeaderCell_BaseFactory;
    return function MatHeaderCell_Factory(__ngFactoryType__) {
      return (\u0275MatHeaderCell_BaseFactory || (\u0275MatHeaderCell_BaseFactory = \u0275\u0275getInheritedFactory(_MatHeaderCell)))(__ngFactoryType__ || _MatHeaderCell);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatHeaderCell,
    selectors: [["mat-header-cell"], ["th", "mat-header-cell", ""]],
    hostAttrs: ["role", "columnheader", 1, "mat-mdc-header-cell", "mdc-data-table__header-cell"],
    features: [\u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatHeaderCell, [{
    type: Directive,
    args: [{
      selector: "mat-header-cell, th[mat-header-cell]",
      host: {
        "class": "mat-mdc-header-cell mdc-data-table__header-cell",
        "role": "columnheader"
      }
    }]
  }], null, null);
})();
var MatFooterCell = class _MatFooterCell extends CdkFooterCell {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatFooterCell_BaseFactory;
    return function MatFooterCell_Factory(__ngFactoryType__) {
      return (\u0275MatFooterCell_BaseFactory || (\u0275MatFooterCell_BaseFactory = \u0275\u0275getInheritedFactory(_MatFooterCell)))(__ngFactoryType__ || _MatFooterCell);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatFooterCell,
    selectors: [["mat-footer-cell"], ["td", "mat-footer-cell", ""]],
    hostAttrs: [1, "mat-mdc-footer-cell", "mdc-data-table__cell"],
    features: [\u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFooterCell, [{
    type: Directive,
    args: [{
      selector: "mat-footer-cell, td[mat-footer-cell]",
      host: {
        "class": "mat-mdc-footer-cell mdc-data-table__cell"
      }
    }]
  }], null, null);
})();
var MatCell = class _MatCell extends CdkCell {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatCell_BaseFactory;
    return function MatCell_Factory(__ngFactoryType__) {
      return (\u0275MatCell_BaseFactory || (\u0275MatCell_BaseFactory = \u0275\u0275getInheritedFactory(_MatCell)))(__ngFactoryType__ || _MatCell);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCell,
    selectors: [["mat-cell"], ["td", "mat-cell", ""]],
    hostAttrs: [1, "mat-mdc-cell", "mdc-data-table__cell"],
    features: [\u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCell, [{
    type: Directive,
    args: [{
      selector: "mat-cell, td[mat-cell]",
      host: {
        "class": "mat-mdc-cell mdc-data-table__cell"
      }
    }]
  }], null, null);
})();
var ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;
var MatHeaderRowDef = class _MatHeaderRowDef extends CdkHeaderRowDef {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatHeaderRowDef_BaseFactory;
    return function MatHeaderRowDef_Factory(__ngFactoryType__) {
      return (\u0275MatHeaderRowDef_BaseFactory || (\u0275MatHeaderRowDef_BaseFactory = \u0275\u0275getInheritedFactory(_MatHeaderRowDef)))(__ngFactoryType__ || _MatHeaderRowDef);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatHeaderRowDef,
    selectors: [["", "matHeaderRowDef", ""]],
    inputs: {
      columns: [0, "matHeaderRowDef", "columns"],
      sticky: [2, "matHeaderRowDefSticky", "sticky", booleanAttribute]
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkHeaderRowDef,
      useExisting: _MatHeaderRowDef
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatHeaderRowDef, [{
    type: Directive,
    args: [{
      selector: "[matHeaderRowDef]",
      providers: [{
        provide: CdkHeaderRowDef,
        useExisting: MatHeaderRowDef
      }],
      inputs: [{
        name: "columns",
        alias: "matHeaderRowDef"
      }, {
        name: "sticky",
        alias: "matHeaderRowDefSticky",
        transform: booleanAttribute
      }]
    }]
  }], null, null);
})();
var MatFooterRowDef = class _MatFooterRowDef extends CdkFooterRowDef {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatFooterRowDef_BaseFactory;
    return function MatFooterRowDef_Factory(__ngFactoryType__) {
      return (\u0275MatFooterRowDef_BaseFactory || (\u0275MatFooterRowDef_BaseFactory = \u0275\u0275getInheritedFactory(_MatFooterRowDef)))(__ngFactoryType__ || _MatFooterRowDef);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatFooterRowDef,
    selectors: [["", "matFooterRowDef", ""]],
    inputs: {
      columns: [0, "matFooterRowDef", "columns"],
      sticky: [2, "matFooterRowDefSticky", "sticky", booleanAttribute]
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkFooterRowDef,
      useExisting: _MatFooterRowDef
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFooterRowDef, [{
    type: Directive,
    args: [{
      selector: "[matFooterRowDef]",
      providers: [{
        provide: CdkFooterRowDef,
        useExisting: MatFooterRowDef
      }],
      inputs: [{
        name: "columns",
        alias: "matFooterRowDef"
      }, {
        name: "sticky",
        alias: "matFooterRowDefSticky",
        transform: booleanAttribute
      }]
    }]
  }], null, null);
})();
var MatRowDef = class _MatRowDef extends CdkRowDef {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatRowDef_BaseFactory;
    return function MatRowDef_Factory(__ngFactoryType__) {
      return (\u0275MatRowDef_BaseFactory || (\u0275MatRowDef_BaseFactory = \u0275\u0275getInheritedFactory(_MatRowDef)))(__ngFactoryType__ || _MatRowDef);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatRowDef,
    selectors: [["", "matRowDef", ""]],
    inputs: {
      columns: [0, "matRowDefColumns", "columns"],
      when: [0, "matRowDefWhen", "when"]
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkRowDef,
      useExisting: _MatRowDef
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRowDef, [{
    type: Directive,
    args: [{
      selector: "[matRowDef]",
      providers: [{
        provide: CdkRowDef,
        useExisting: MatRowDef
      }],
      inputs: [{
        name: "columns",
        alias: "matRowDefColumns"
      }, {
        name: "when",
        alias: "matRowDefWhen"
      }]
    }]
  }], null, null);
})();
var MatHeaderRow = class _MatHeaderRow extends CdkHeaderRow {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatHeaderRow_BaseFactory;
    return function MatHeaderRow_Factory(__ngFactoryType__) {
      return (\u0275MatHeaderRow_BaseFactory || (\u0275MatHeaderRow_BaseFactory = \u0275\u0275getInheritedFactory(_MatHeaderRow)))(__ngFactoryType__ || _MatHeaderRow);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatHeaderRow,
    selectors: [["mat-header-row"], ["tr", "mat-header-row", ""]],
    hostAttrs: ["role", "row", 1, "mat-mdc-header-row", "mdc-data-table__header-row"],
    exportAs: ["matHeaderRow"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkHeaderRow,
      useExisting: _MatHeaderRow
    }]), \u0275\u0275InheritDefinitionFeature],
    decls: 1,
    vars: 0,
    consts: [["cdkCellOutlet", ""]],
    template: function MatHeaderRow_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementContainer(0, 0);
      }
    },
    dependencies: [CdkCellOutlet],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatHeaderRow, [{
    type: Component,
    args: [{
      selector: "mat-header-row, tr[mat-header-row]",
      template: ROW_TEMPLATE,
      host: {
        "class": "mat-mdc-header-row mdc-data-table__header-row",
        "role": "row"
      },
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      exportAs: "matHeaderRow",
      providers: [{
        provide: CdkHeaderRow,
        useExisting: MatHeaderRow
      }],
      imports: [CdkCellOutlet]
    }]
  }], null, null);
})();
var MatFooterRow = class _MatFooterRow extends CdkFooterRow {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatFooterRow_BaseFactory;
    return function MatFooterRow_Factory(__ngFactoryType__) {
      return (\u0275MatFooterRow_BaseFactory || (\u0275MatFooterRow_BaseFactory = \u0275\u0275getInheritedFactory(_MatFooterRow)))(__ngFactoryType__ || _MatFooterRow);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatFooterRow,
    selectors: [["mat-footer-row"], ["tr", "mat-footer-row", ""]],
    hostAttrs: ["role", "row", 1, "mat-mdc-footer-row", "mdc-data-table__row"],
    exportAs: ["matFooterRow"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkFooterRow,
      useExisting: _MatFooterRow
    }]), \u0275\u0275InheritDefinitionFeature],
    decls: 1,
    vars: 0,
    consts: [["cdkCellOutlet", ""]],
    template: function MatFooterRow_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementContainer(0, 0);
      }
    },
    dependencies: [CdkCellOutlet],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFooterRow, [{
    type: Component,
    args: [{
      selector: "mat-footer-row, tr[mat-footer-row]",
      template: ROW_TEMPLATE,
      host: {
        "class": "mat-mdc-footer-row mdc-data-table__row",
        "role": "row"
      },
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      exportAs: "matFooterRow",
      providers: [{
        provide: CdkFooterRow,
        useExisting: MatFooterRow
      }],
      imports: [CdkCellOutlet]
    }]
  }], null, null);
})();
var MatRow = class _MatRow extends CdkRow {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatRow_BaseFactory;
    return function MatRow_Factory(__ngFactoryType__) {
      return (\u0275MatRow_BaseFactory || (\u0275MatRow_BaseFactory = \u0275\u0275getInheritedFactory(_MatRow)))(__ngFactoryType__ || _MatRow);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatRow,
    selectors: [["mat-row"], ["tr", "mat-row", ""]],
    hostAttrs: ["role", "row", 1, "mat-mdc-row", "mdc-data-table__row"],
    exportAs: ["matRow"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkRow,
      useExisting: _MatRow
    }]), \u0275\u0275InheritDefinitionFeature],
    decls: 1,
    vars: 0,
    consts: [["cdkCellOutlet", ""]],
    template: function MatRow_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementContainer(0, 0);
      }
    },
    dependencies: [CdkCellOutlet],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatRow, [{
    type: Component,
    args: [{
      selector: "mat-row, tr[mat-row]",
      template: ROW_TEMPLATE,
      host: {
        "class": "mat-mdc-row mdc-data-table__row",
        "role": "row"
      },
      changeDetection: ChangeDetectionStrategy.Default,
      encapsulation: ViewEncapsulation.None,
      exportAs: "matRow",
      providers: [{
        provide: CdkRow,
        useExisting: MatRow
      }],
      imports: [CdkCellOutlet]
    }]
  }], null, null);
})();
var MatNoDataRow = class _MatNoDataRow extends CdkNoDataRow {
  _cellSelector = "td, mat-cell, [mat-cell], .mat-cell";
  constructor() {
    super();
    this._contentClassNames.push("mat-mdc-no-data-row", "mat-mdc-row", "mdc-data-table__row");
    this._cellClassNames.push("mat-mdc-cell", "mdc-data-table__cell", "mat-no-data-cell");
  }
  static \u0275fac = function MatNoDataRow_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatNoDataRow)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatNoDataRow,
    selectors: [["ng-template", "matNoDataRow", ""]],
    features: [\u0275\u0275ProvidersFeature([{
      provide: CdkNoDataRow,
      useExisting: _MatNoDataRow
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatNoDataRow, [{
    type: Directive,
    args: [{
      selector: "ng-template[matNoDataRow]",
      providers: [{
        provide: CdkNoDataRow,
        useExisting: MatNoDataRow
      }]
    }]
  }], () => [], null);
})();
var MatTextColumn = class _MatTextColumn extends CdkTextColumn {
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatTextColumn_BaseFactory;
    return function MatTextColumn_Factory(__ngFactoryType__) {
      return (\u0275MatTextColumn_BaseFactory || (\u0275MatTextColumn_BaseFactory = \u0275\u0275getInheritedFactory(_MatTextColumn)))(__ngFactoryType__ || _MatTextColumn);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatTextColumn,
    selectors: [["mat-text-column"]],
    features: [\u0275\u0275InheritDefinitionFeature],
    decls: 3,
    vars: 0,
    consts: [["matColumnDef", ""], ["mat-header-cell", "", 3, "text-align", 4, "matHeaderCellDef"], ["mat-cell", "", 3, "text-align", 4, "matCellDef"], ["mat-header-cell", ""], ["mat-cell", ""]],
    template: function MatTextColumn_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275elementContainerStart(0, 0);
        \u0275\u0275template(1, MatTextColumn_th_1_Template, 2, 3, "th", 1)(2, MatTextColumn_td_2_Template, 2, 3, "td", 2);
        \u0275\u0275elementContainerEnd();
      }
    },
    dependencies: [MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTextColumn, [{
    type: Component,
    args: [{
      selector: "mat-text-column",
      template: `
    <ng-container matColumnDef>
      <th mat-header-cell *matHeaderCellDef [style.text-align]="justify">
        {{headerText}}
      </th>
      <td mat-cell *matCellDef="let data" [style.text-align]="justify">
        {{dataAccessor(data, name)}}
      </td>
    </ng-container>
  `,
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.Default,
      imports: [MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell]
    }]
  }], null, null);
})();
var EXPORTED_DECLARATIONS2 = [MatTable, MatRecycleRows, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatFooterCellDef, MatFooterRowDef, MatHeaderCell, MatCell, MatFooterCell, MatHeaderRow, MatRow, MatFooterRow, MatNoDataRow, MatTextColumn];
var MatTableModule = class _MatTableModule {
  static \u0275fac = function MatTableModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatTableModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatTableModule,
    imports: [CdkTableModule, MatTable, MatRecycleRows, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatFooterCellDef, MatFooterRowDef, MatHeaderCell, MatCell, MatFooterCell, MatHeaderRow, MatRow, MatFooterRow, MatNoDataRow, MatTextColumn],
    exports: [BidiModule, MatTable, MatRecycleRows, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatFooterCellDef, MatFooterRowDef, MatHeaderCell, MatCell, MatFooterCell, MatHeaderRow, MatRow, MatFooterRow, MatNoDataRow, MatTextColumn]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [CdkTableModule, BidiModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTableModule, [{
    type: NgModule,
    args: [{
      imports: [CdkTableModule, ...EXPORTED_DECLARATIONS2],
      exports: [BidiModule, EXPORTED_DECLARATIONS2]
    }]
  }], null, null);
})();
var MAX_SAFE_INTEGER = 9007199254740991;
var MatTableDataSource = class extends DataSource {
  _data;
  _renderData = new BehaviorSubject([]);
  _filter = new BehaviorSubject("");
  _internalPageChanges = new Subject();
  _renderChangesSubscription = null;
  filteredData;
  get data() {
    return this._data.value;
  }
  set data(data) {
    data = Array.isArray(data) ? data : [];
    this._data.next(data);
    if (!this._renderChangesSubscription) {
      this._filterData(data);
    }
  }
  get filter() {
    return this._filter.value;
  }
  set filter(filter) {
    this._filter.next(filter);
    if (!this._renderChangesSubscription) {
      this._filterData(this.data);
    }
  }
  get sort() {
    return this._sort;
  }
  set sort(sort) {
    this._sort = sort;
    this._updateChangeSubscription();
  }
  _sort;
  get paginator() {
    return this._paginator;
  }
  set paginator(paginator) {
    this._paginator = paginator;
    this._updateChangeSubscription();
  }
  _paginator;
  sortingDataAccessor = (data, sortHeaderId) => {
    const value = data[sortHeaderId];
    if (_isNumberValue(value)) {
      const numberValue = Number(value);
      return numberValue < MAX_SAFE_INTEGER ? numberValue : value;
    }
    return value;
  };
  sortData = (data, sort) => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction == "") {
      return data;
    }
    return data.sort((a, b) => {
      let valueA = this.sortingDataAccessor(a, active);
      let valueB = this.sortingDataAccessor(b, active);
      const valueAType = typeof valueA;
      const valueBType = typeof valueB;
      if (valueAType !== valueBType) {
        if (valueAType === "number") {
          valueA += "";
        }
        if (valueBType === "number") {
          valueB += "";
        }
      }
      let comparatorResult = 0;
      if (valueA != null && valueB != null) {
        if (valueA > valueB) {
          comparatorResult = 1;
        } else if (valueA < valueB) {
          comparatorResult = -1;
        }
      } else if (valueA != null) {
        comparatorResult = 1;
      } else if (valueB != null) {
        comparatorResult = -1;
      }
      return comparatorResult * (direction == "asc" ? 1 : -1);
    });
  };
  filterPredicate = (data, filter) => {
    if ((typeof ngDevMode === "undefined" || ngDevMode) && (typeof data !== "object" || data === null)) {
      console.warn("Default implementation of filterPredicate requires data to be a non-null object.");
    }
    const transformedFilter = filter.trim().toLowerCase();
    return Object.values(data).some((value) => `${value}`.toLowerCase().includes(transformedFilter));
  };
  constructor(initialData = []) {
    super();
    this._data = new BehaviorSubject(initialData);
    this._updateChangeSubscription();
  }
  _updateChangeSubscription() {
    const sortChange = this._sort ? merge(this._sort.sortChange, this._sort.initialized) : of(null);
    const pageChange = this._paginator ? merge(this._paginator.page, this._internalPageChanges, this._paginator.initialized) : of(null);
    const dataStream = this._data;
    const filteredData = combineLatest([dataStream, this._filter]).pipe(map(([data]) => this._filterData(data)));
    const orderedData = combineLatest([filteredData, sortChange]).pipe(map(([data]) => this._orderData(data)));
    const paginatedData = combineLatest([orderedData, pageChange]).pipe(map(([data]) => this._pageData(data)));
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = paginatedData.subscribe((data) => this._renderData.next(data));
  }
  _filterData(data) {
    this.filteredData = this.filter == null || this.filter === "" ? data : data.filter((obj) => this.filterPredicate(obj, this.filter));
    if (this.paginator) {
      this._updatePaginator(this.filteredData.length);
    }
    return this.filteredData;
  }
  _orderData(data) {
    if (!this.sort) {
      return data;
    }
    return this.sortData(data.slice(), this.sort);
  }
  _pageData(data) {
    if (!this.paginator) {
      return data;
    }
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.slice(startIndex, startIndex + this.paginator.pageSize);
  }
  _updatePaginator(filteredDataLength) {
    Promise.resolve().then(() => {
      const paginator = this.paginator;
      if (!paginator) {
        return;
      }
      paginator.length = filteredDataLength;
      if (paginator.pageIndex > 0) {
        const lastPageIndex = Math.ceil(paginator.length / paginator.pageSize) - 1 || 0;
        const newPageIndex = Math.min(paginator.pageIndex, lastPageIndex);
        if (newPageIndex !== paginator.pageIndex) {
          paginator.pageIndex = newPageIndex;
          this._internalPageChanges.next();
        }
      }
    });
  }
  connect() {
    if (!this._renderChangesSubscription) {
      this._updateChangeSubscription();
    }
    return this._renderData;
  }
  disconnect() {
    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = null;
  }
};

// libs/shared/util/formatters/src/lib/services/shared-util-formatters.service.ts
var SharedUtilFormattersService = class _SharedUtilFormattersService {
  #titleCasePipe = inject(TitleCasePipe);
  #sanitizer = inject(DomSanitizer);
  #locale = inject(LOCALE_ID);
  /**
   * Formats a date value using the specified formatting options.
   * @template T - The type of the attributes.
   * @param {FormattingDateInput} value The date value to format.
   * @param {Partial<Pick<FormattingExtras<'DATE'>, 'dateDigitsInfo' | 'locale' | 'timezone'>>} extras An optional function that returns additional formatting options, such as locale and timezone.
   * @returns {string} The formatted date string.
   */
  dateFormatter(value, extras) {
    let format = {
      dateDigitsInfo: "shortDate",
      locale: this.#locale,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    if (extras) {
      format = __spreadValues(__spreadValues({}, format), extras());
    }
    return formatDate(value, format.dateDigitsInfo, format.locale, format.timezone) || "";
  }
  /**
   * Formats a given date/time value according to the specified locale and timezone.
   * @template T - The type parameter for the formatting extras.
   * @param {FormattingDateInput} value - The date/time value to be formatted.
   * @param {() => Partial<Pick<FormattingExtras<'DATE_TIME'>, 'locale' | 'timezone'>>} [extras] -
   *        An optional function that returns additional formatting options such as locale and timezone.
   * @returns {string} The formatted date/time string.
   */
  dateTimeFormatter(value, extras) {
    let format = {
      locale: this.#locale,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    if (extras) {
      format = __spreadValues(__spreadValues({}, format), extras());
    }
    return formatDate(value, "M/d/yy, HH:mm:ss", format.locale, format.timezone) || "";
  }
  /**
   * Formats a Firebase `Timestamp` into a string based on the provided formatting options.
   * @param {Timestamp} value - The Firebase `Timestamp` to format.
   * @param {() => Partial<Pick<FormattingExtras<'DATE'>, 'dateDigitsInfo' | 'locale' | 'timezone'>>} [extras] -
   *        An optional function that returns additional formatting options such as `dateDigitsInfo`, `locale`, and `timezone`.
   * @returns {string} - The formatted date string or '-' if the value is not provided.
   */
  firebaseTimestampFormatter(value, extras) {
    let format = {
      dateDigitsInfo: "shortDate",
      locale: this.#locale,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
    if (extras) {
      format = __spreadValues(__spreadValues({}, format), extras());
    }
    return value ? formatDate(value?.toDate(), format.dateDigitsInfo, format.locale, format.timezone) : "-";
  }
  /**
   * Formats a given number as a percentage string.
   * @param {number} value - The number to be formatted as a percentage.
   * @param {() => Partial<Pick<FormattingExtras<'PERCENTAGE'>, 'numberDigitsInfo' | 'locale'>>} [extras] - Optional function that returns additional formatting options.
   * @returns {string} The formatted percentage string.
   */
  percentageFormatter(value, extras) {
    let format = {
      numberDigitsInfo: "1.2-2",
      locale: this.#locale
    };
    if (extras) {
      format = __spreadValues(__spreadValues({}, format), extras());
    }
    return formatPercent(Number(value) / 100, format.locale, format.numberDigitsInfo) || "";
  }
  /**
   * Formats a given number as a currency string.
   * @param {number} value - The numeric value to format as currency.
   * @param {() => Partial<Pick<FormattingExtras<'CURRENCY'>, 'numberDigitsInfo' | 'locale' | 'currency' | 'currencyCode'>>} [extras] - Optional function that returns an object with additional formatting options.
   * @returns {string} - The formatted currency string.
   */
  currencyFormatter(value, extras) {
    let format = {
      numberDigitsInfo: "1.2-2",
      locale: this.#locale,
      currency: "\u20AC",
      currencyCode: "EUR"
    };
    if (extras) {
      format = __spreadValues(__spreadValues({}, format), extras());
    }
    return formatCurrency(value, format.locale, format.currency, format.currencyCode, format.numberDigitsInfo) || "";
  }
  /**
   * Formats a given number according to specified formatting options.
   * @template T - The type parameter for formatting extras.
   * @param {number} value - The number to format.
   * @param {() => Partial<Pick<FormattingExtras<'NUMBER'>, 'numberDigitsInfo' | 'locale'>>} [extras] - Optional function that returns additional formatting options.
   * @returns {string} - The formatted number as a string.
   */
  numberFormatter(value, extras) {
    let format = {
      numberDigitsInfo: "1.2-2",
      locale: this.#locale
    };
    if (extras) {
      format = __spreadValues(__spreadValues({}, format), extras());
    }
    return formatNumber(Number(value), format.locale, format.numberDigitsInfo) || "";
  }
  quantityFormatter(value, item, extras) {
    let format = {
      numberDigitsInfo: "1.2-2",
      locale: this.#locale,
      suffix: "",
      prefix: ""
    };
    if (extras) {
      format = __spreadValues(__spreadValues({}, format), extras(item));
    }
    return `
    ${format.prefix ? format.prefix : ""}
    ${formatNumber(Number(value), format.locale, format.numberDigitsInfo)}
    ${format.suffix ? format.suffix : ""}
    `;
  }
  /**
   * @description Formats value as title case (value => `Value`).
   * @param { string } value The value to format.
   * @returns { string } The formatted value.
   */
  titleCaseFormatter(value) {
    return this.#titleCasePipe.transform(value);
  }
  /**
   * Formats a boolean value into an HTML string with an icon.
   * @template T - The type parameter for the formatting extras.
   * @param {boolean} value - The boolean value to format.
   * @param {() => FormattingExtras<'BOOLEAN_WITH_ICON'>} [extras] - Optional function to provide additional formatting options.
   * @returns {SafeHtml} - The formatted HTML string with the appropriate icon.
   */
  booleanWithIconFormatter(value, extras) {
    let format = {
      iconTrue: "check",
      iconFalse: "close"
    };
    if (extras) {
      format = __spreadValues(__spreadValues({}, format), extras());
    }
    return this.#sanitizer.bypassSecurityTrustHtml(`<span class="material-icons">${value ? format.iconTrue : format.iconFalse}</span>`);
  }
  /**
   * @description Formats value passing a custom method to format it.
   * @template T - The type of the attributes.
   * @param { string } value The value to format.
   * @param { PropertyFormattingConf } param The control configuration to format the object property value.
   * @param { (value: string, element?: T, index?: number, extras?: unknown) => FormattingOutput } param.execute  The function to execute to format the value.
   * @param { T } element The whole item object where the formatting property belongs.
   * @param { number } index The index of the object i a list (f.e. a table).
   * @param { T } extraConfig Extra configuration object to format values when defining `execute` method blueprint.
   * @example
   * Returns a value for a row index number in a table.
   * execute: (_, __, index = 0, extraConfig) => {
      const { pageIndex, pageSize } = extraConfig as PageEventConfig;
      return String(index + pageIndex * pageSize);
    },
   * @returns { SafeHtml } The formatted value passed through the execute formatting function.
   */
  customFormatter(value, { execute }, element, index, extraConfig) {
    return execute ? execute(value, element, index, extraConfig) : value ? value : "";
  }
  /**
   * @description Formats a value using a component-based formatting configuration.
   * @template T - The type of the object containing the value to format.
   * @param {string} value - The value to format.
   * @param {PropertyComponentFormattingConf<T>} param - The formatting configuration.
   * @param {PropertyComponentFormattingConf<T>['execute']} param.execute - The function to execute for component-based formatting.
   * @param {T} element - The complete object containing the value being formatted.
   * @param {number} index - The index of the object in a list (f.e. a table).
   * @returns {FormattingComponentOutput | string} The formatted component configuration or the original value if no execute function is provided.
   */
  componentFormatter(value, { execute }, element, index) {
    return execute ? execute(value, element, index) : value;
  }
  /**
   * @description Formats value as default passing sanitizer.
   * @param { string } value The value to sanitize.
   * @returns { SafeHtml } The value passed through the sanitizer.
   */
  defaultFormatter(value) {
    return this.#sanitizer.bypassSecurityTrustHtml(value);
  }
  static \u0275fac = function SharedUtilFormattersService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SharedUtilFormattersService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SharedUtilFormattersService, factory: _SharedUtilFormattersService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SharedUtilFormattersService, [{
    type: Injectable
  }], null, null);
})();

// libs/shared/util/formatters/src/lib/services/data-format-factory.service.ts
var DataFormatFactoryService = class _DataFormatFactoryService {
  #formatter = inject(SharedUtilFormattersService);
  /**
   * @description Factory to get the correct formatted value from item property with a custom formatting option.
   * @param { unknown } item  The object to extract value from.
   * @param { PropertyFormatting } param The control configuration to format the object property value.
   * @param { string | ((item: T) => unknown) } param.key The property of the object which value is going to be formatted or a function to compute it.
   * @param { PropertyFormattingConf } param.formatting The formatting configuration for a concrete property object.
   * @param {number } index Index to custom formatters (f.e. a table indexing)
   * @param {unknown } extraConfig Extra configuration object to format values specially when using custom formatters.
   * @returns { PropertyFormatting } The valid types to be returned after formatting a value.
   */
  getFormattedValue(item, { pathToKey, formatting }, index, extraConfig) {
    const value = this.getValueFromRow(pathToKey, item);
    const { type, extras } = formatting;
    switch (type) {
      case "DATE":
        return this.#formatter.dateFormatter(String(value), extras);
      case "DATE_TIME":
        return this.#formatter.dateTimeFormatter(String(value), extras);
      case "FIREBASE_TIMESTAMP":
        return this.#formatter.firebaseTimestampFormatter(value, extras);
      case "PERCENTAGE":
        return this.#formatter.percentageFormatter(Number(value), extras);
      case "CURRENCY":
        return this.#formatter.currencyFormatter(Number(value), extras);
      case "NUMBER":
        return this.#formatter.numberFormatter(Number(value), extras);
      case "QUANTITY":
        return this.#formatter.quantityFormatter(Number(value), item, extras);
      case "BOOLEAN_WITH_CONTROL":
        return !!value;
      case "BOOLEAN_WITH_ICON":
        return this.#formatter.booleanWithIconFormatter(!!value, extras);
      case "TITLE_CASE":
        return this.#formatter.titleCaseFormatter(String(value));
      case "IMAGE":
      case "CUSTOM":
      case "LINK":
        return this.#formatter.customFormatter(String(value), formatting, item, index, extraConfig);
      case "COMPONENT":
        return this.#formatter.componentFormatter(String(value), formatting, item, index);
      case "TEXT":
      case "INPUT":
      default:
        return this.#formatter.defaultFormatter(String(value));
    }
  }
  getValueFromRow(property, item) {
    return property.split(".").reduce((accObject, currentProp) => {
      const object = accObject[currentProp];
      return isNil(object) ? "" : object;
    }, item);
  }
  static \u0275fac = function DataFormatFactoryService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DataFormatFactoryService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DataFormatFactoryService, factory: _DataFormatFactoryService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DataFormatFactoryService, [{
    type: Injectable
  }], null, null);
})();

// libs/shared/util/formatters/src/lib/safe-formatted-cell.pipe.ts
var SafeFormattedPipe = class _SafeFormattedPipe {
  #dataFormatService = inject(DataFormatFactoryService);
  transform(row, column, index, extraConfig) {
    return this.#dataFormatService.getFormattedValue(row, column, index, extraConfig);
  }
  static \u0275fac = function SafeFormattedPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SafeFormattedPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "safeFormatted", type: _SafeFormattedPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SafeFormattedPipe, [{
    type: Pipe,
    args: [{
      name: "safeFormatted"
    }]
  }], null, null);
})();

// libs/shared/util/formatters/src/lib/shared-util-formatters.module.ts
var SharedUtilFormattersModule = class _SharedUtilFormattersModule {
  static \u0275fac = function SharedUtilFormattersModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SharedUtilFormattersModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _SharedUtilFormattersModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ providers: [
    SharedUtilFormattersService,
    DataFormatFactoryService,
    DatePipe,
    TitleCasePipe,
    PercentPipe
  ] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SharedUtilFormattersModule, [{
    type: NgModule,
    args: [{
      providers: [
        SharedUtilFormattersService,
        DataFormatFactoryService,
        DatePipe,
        TitleCasePipe,
        PercentPipe
      ]
    }]
  }], null, null);
})();

// libs/shared/table/ui/src/lib/shared-table-ui/shared-table-ui.component.ts
var _c05 = ["matFormField"];
var _c15 = [[["", "noResults", ""]], [["", "noValidSearch", ""]], [["", "noResults", ""]], [["", "noValidSearch", ""]]];
var _c22 = ["[noResults]", "[noValidSearch]", "[noResults]", "[noValidSearch]"];
var SharedTableUiComponent_Defer_3_DepsFn = () => [import("./router-J5JVPWW6.js").then((m) => m.RouterLink), import("./common-HVE4QP6G.js").then((m) => m.NgComponentOutlet), import("./common-HVE4QP6G.js").then((m) => m.NgTemplateOutlet), import("./text-field-5HA6K7TD.js").then((m) => m.CdkTextareaAutosize), MatTable, MatHeaderCellDef, MatHeaderRowDef, MatColumnDef, MatCellDef, MatRowDef, MatHeaderCell, MatCell, MatHeaderRow, MatRow, MatSort, MatSortHeader, MatTooltip, MatIcon, MatIconButton, MatFormField, MatPrefix, MatSuffix, MatInput, MatSelect, MatOption, MatCheckbox, MatRadioGroup, MatRadioButton, MatSlideToggle, import("./common-HVE4QP6G.js").then((m) => m.NgOptimizedImage), import("./common-HVE4QP6G.js").then((m) => m.KeyValuePipe), import("./order-table-actions-elements.pipe-GNLRRW43.js").then((m) => m.OrderTableActionsElementsPipe), SafeFormattedPipe];
var _c3 = (a0) => [a0];
var _c4 = (a0, a1) => ({ element: a0, isExpanded: a1 });
var _c5 = () => ["expandedDetail"];
var _forTrack0 = ($index, $item) => $item.key;
var _forTrack1 = ($index, $item) => $item.value;
function SharedTableUiComponent_Defer_1_For_2_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const column_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap((column_r3.cssClasses == null ? null : column_r3.cssClasses[0]) || "");
    \u0275\u0275property("sortActionDescription", column_r3.sorting ? `Ordenar per ${column_r3.title}` : "")("mat-sort-header", column_r3.sorting || "")("disabled", !column_r3.sorting);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", column_r3.title, " ");
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 16);
    \u0275\u0275pipe(1, "safeFormatted");
    \u0275\u0275listener("click", function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_1_Template_a_click_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    const row_r6 = ctx_r4.$implicit;
    const i_r7 = ctx_r4.dataIndex;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap((column_r3.cssClasses == null ? null : column_r3.cssClasses[1]) || "");
    \u0275\u0275property("routerLink", column_r3.link ? column_r3.link(row_r6) : null)("queryParams", column_r3.queryParams ? column_r3.queryParams(row_r6) : null)("innerHTML", \u0275\u0275pipeBind3(1, 5, row_r6, column_r3, i_r7 + 1), \u0275\u0275sanitizeHtml);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const attributes_r9 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(attributes_r9 == null ? null : attributes_r9.prefix);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const attributes_r9 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(attributes_r9 == null ? null : attributes_r9.suffix);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", null, 1);
    \u0275\u0275conditionalCreate(2, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_2_Conditional_2_Template, 2, 1, "span", 22);
    \u0275\u0275elementStart(3, "input", 23);
    \u0275\u0275listener("change", function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_2_Template_input_change_3_listener($event) {
      \u0275\u0275restoreView(_r8);
      const editable_r10 = \u0275\u0275nextContext();
      const row_r6 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onInputChange($event, row_r6, editable_r10));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_2_Conditional_4_Template, 2, 1, "span", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const editable_r10 = \u0275\u0275nextContext();
    const attributes_r9 = \u0275\u0275readContextLet(0);
    const row_r6 = \u0275\u0275nextContext(2).$implicit;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap("editable inline " + ((attributes_r9 == null ? null : attributes_r9.styles) || ""));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((attributes_r9 == null ? null : attributes_r9.prefix) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("value", row_r6[column_r3.key])("placeholder", editable_r10.attributes.placeholder || "");
    \u0275\u0275attribute("aria-label", row_r6.name + ": " + (editable_r10.attributes.placeholder || ""));
    \u0275\u0275advance();
    \u0275\u0275conditional((attributes_r9 == null ? null : attributes_r9.suffix) ? 4 : -1);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const attributes_r9 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(attributes_r9 == null ? null : attributes_r9.prefix);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_3_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const attributes_r9 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(attributes_r9 == null ? null : attributes_r9.suffix);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", null, 1);
    \u0275\u0275conditionalCreate(2, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_3_Conditional_2_Template, 2, 1, "span", 22);
    \u0275\u0275elementStart(3, "input", 25);
    \u0275\u0275listener("change", function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_3_Template_input_change_3_listener($event) {
      \u0275\u0275restoreView(_r11);
      const editable_r10 = \u0275\u0275nextContext();
      const row_r6 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onInputChange($event, row_r6, editable_r10));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_3_Conditional_4_Template, 2, 1, "span", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const editable_r10 = \u0275\u0275nextContext();
    const attributes_r9 = \u0275\u0275readContextLet(0);
    const row_r6 = \u0275\u0275nextContext(2).$implicit;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap("editable inline " + ((attributes_r9 == null ? null : attributes_r9.styles) || ""));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((attributes_r9 == null ? null : attributes_r9.prefix) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("value", row_r6[column_r3.key])("placeholder", editable_r10.attributes.placeholder || "");
    \u0275\u0275attribute("min", editable_r10.attributes.min || 0)("max", editable_r10.attributes.max || 100)("step", editable_r10.attributes.step || 1)("aria-label", row_r6.name + ": " + (editable_r10.attributes.placeholder || ""));
    \u0275\u0275advance();
    \u0275\u0275conditional((attributes_r9 == null ? null : attributes_r9.suffix) ? 4 : -1);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_4_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-option", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r13 = ctx.$implicit;
    \u0275\u0275property("value", option_r13.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r13.label, " ");
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-select", 26);
    \u0275\u0275listener("selectionChange", function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_4_Template_mat_select_selectionChange_0_listener($event) {
      \u0275\u0275restoreView(_r12);
      const editable_r10 = \u0275\u0275nextContext();
      const row_r6 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onInputChange($event, row_r6, editable_r10));
    });
    \u0275\u0275repeaterCreate(1, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_4_For_2_Template, 2, 2, "mat-option", 21, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const editable_r10 = \u0275\u0275nextContext();
    const row_r6 = \u0275\u0275nextContext(2).$implicit;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", row_r6[column_r3.key])("multiple", editable_r10.attributes.multiple || false);
    \u0275\u0275attribute("aria-label", row_r6.name + ": " + (editable_r10.attributes.placeholder || ""));
    \u0275\u0275advance();
    \u0275\u0275repeater(editable_r10.attributes.options);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-checkbox", 27);
    \u0275\u0275listener("change", function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_5_Template_mat_checkbox_change_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      const editable_r10 = \u0275\u0275nextContext();
      const row_r6 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onInputChange($event, row_r6, editable_r10));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const editable_r10 = \u0275\u0275nextContext();
    const row_r6 = \u0275\u0275nextContext(2).$implicit;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", row_r6[column_r3.key])("checked", editable_r10.attributes.checked || false);
    \u0275\u0275attribute("aria-label", row_r6.name + ": " + (editable_r10.attributes.placeholder || ""));
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-slide-toggle", 28);
    \u0275\u0275listener("change", function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_6_Template_mat_slide_toggle_change_0_listener($event) {
      \u0275\u0275restoreView(_r15);
      const editable_r10 = \u0275\u0275nextContext();
      const row_r6 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onInputChange($event, row_r6, editable_r10));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const editable_r10 = \u0275\u0275nextContext();
    const row_r6 = \u0275\u0275nextContext(2).$implicit;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("checked", row_r6[column_r3.key] || false);
    \u0275\u0275ariaProperty("aria-label", row_r6.name + ": " + (editable_r10.attributes.placeholder || ""));
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_7_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-radio-button", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r17 = ctx.$implicit;
    \u0275\u0275property("value", option_r17.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", option_r17.label, " ");
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-radio-group", 29);
    \u0275\u0275listener("change", function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_7_Template_mat_radio_group_change_0_listener($event) {
      \u0275\u0275restoreView(_r16);
      const editable_r10 = \u0275\u0275nextContext();
      const row_r6 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onInputChange($event, row_r6, editable_r10));
    });
    \u0275\u0275repeaterCreate(1, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_7_For_2_Template, 2, 2, "mat-radio-button", 21, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const editable_r10 = \u0275\u0275nextContext();
    const row_r6 = \u0275\u0275nextContext(2).$implicit;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("value", row_r6[column_r3.key]);
    \u0275\u0275attribute("aria-label", row_r6.name + ": " + (editable_r10.attributes.placeholder || ""));
    \u0275\u0275advance();
    \u0275\u0275repeater(editable_r10.attributes.options);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_8_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 22);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const attributes_r9 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(attributes_r9 == null ? null : attributes_r9.prefix);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_8_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 24);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const attributes_r9 = \u0275\u0275readContextLet(0);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(attributes_r9 == null ? null : attributes_r9.suffix);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-form-field", null, 1);
    \u0275\u0275conditionalCreate(2, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_8_Conditional_2_Template, 2, 1, "span", 22);
    \u0275\u0275elementStart(3, "textarea", 30);
    \u0275\u0275listener("change", function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_8_Template_textarea_change_3_listener($event) {
      \u0275\u0275restoreView(_r18);
      const editable_r10 = \u0275\u0275nextContext();
      const row_r6 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.onInputChange($event, row_r6, editable_r10));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(4, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_8_Conditional_4_Template, 2, 1, "span", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const editable_r10 = \u0275\u0275nextContext();
    const attributes_r9 = \u0275\u0275readContextLet(0);
    const row_r6 = \u0275\u0275nextContext(2).$implicit;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap("editable inline " + ((attributes_r9 == null ? null : attributes_r9.styles) || ""));
    \u0275\u0275advance(2);
    \u0275\u0275conditional((attributes_r9 == null ? null : attributes_r9.prefix) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("value", row_r6[column_r3.key] || "")("placeholder", editable_r10.attributes.placeholder || "")("rows", editable_r10.attributes.rows || 2);
    \u0275\u0275attribute("aria-label", row_r6.name + ": " + (editable_r10.attributes.placeholder || ""));
    \u0275\u0275advance();
    \u0275\u0275conditional((attributes_r9 == null ? null : attributes_r9.suffix) ? 4 : -1);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275declareLet(0);
    \u0275\u0275elementStart(1, "div");
    \u0275\u0275conditionalCreate(2, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_2_Template, 5, 7, "mat-form-field", 17);
    \u0275\u0275conditionalCreate(3, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_3_Template, 5, 10, "mat-form-field", 17);
    \u0275\u0275conditionalCreate(4, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_4_Template, 3, 3, "mat-select", 18);
    \u0275\u0275conditionalCreate(5, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_5_Template, 1, 3, "mat-checkbox", 19);
    \u0275\u0275conditionalCreate(6, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_6_Template, 1, 2, "mat-slide-toggle", 20);
    \u0275\u0275conditionalCreate(7, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_7_Template, 3, 2, "mat-radio-group", 21);
    \u0275\u0275conditionalCreate(8, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Conditional_8_Template, 5, 8, "mat-form-field", 17);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const editable_r10 = ctx;
    const column_r3 = \u0275\u0275nextContext(3).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275storeLet(editable_r10 == null ? null : editable_r10.attributes);
    \u0275\u0275advance();
    \u0275\u0275classMap("my-sub leading-6 " + ((column_r3.cssClasses == null ? null : column_r3.cssClasses[1]) || ""));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isText(editable_r10) ? 2 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isNumber(editable_r10) ? 3 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isSelect(editable_r10) ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isCheckBox(editable_r10) ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isToggle(editable_r10) ? 6 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isRadio(editable_r10) ? 7 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isTextarea(editable_r10) ? 8 : -1);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Conditional_0_Template, 9, 10, "div", 17);
  }
  if (rf & 2) {
    let tmp_16_0;
    const row_r6 = \u0275\u0275nextContext().$implicit;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional((tmp_16_0 = column_r3.isEditableConfig == null ? null : column_r3.isEditableConfig(row_r6)) ? 0 : -1, tmp_16_0);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 31);
  }
  if (rf & 2) {
    const row_r6 = \u0275\u0275nextContext().$implicit;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap((column_r3.cssClasses == null ? null : column_r3.cssClasses[1]) || "");
    \u0275\u0275property("alt", row_r6.name || "")("ngSrc", row_r6[column_r3.key] || "");
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_4_Conditional_2_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_4_Conditional_2_ng_container_0_Template, 1, 0, "ng-container", 32);
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const config_r19 = \u0275\u0275readContextLet(0);
    \u0275\u0275property("ngComponentOutlet", config_r19.component)("ngComponentOutletInputs", config_r19.inputs);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275declareLet(0);
    \u0275\u0275pipe(1, "safeFormatted");
    \u0275\u0275conditionalCreate(2, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_4_Conditional_2_Template, 1, 2, "ng-container");
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    const row_r6 = ctx_r4.$implicit;
    const i_r7 = ctx_r4.dataIndex;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    const config_r20 = \u0275\u0275storeLet(\u0275\u0275pipeBind3(1, 1, row_r6, column_r3, i_r7));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(config_r20 && ctx_r1.isDynamicComponent(config_r20) ? 2 : -1);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 33);
    \u0275\u0275pipe(1, "safeFormatted");
  }
  if (rf & 2) {
    const ctx_r4 = \u0275\u0275nextContext();
    const row_r6 = ctx_r4.$implicit;
    const i_r7 = ctx_r4.dataIndex;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap((column_r3.cssClasses == null ? null : column_r3.cssClasses[1]) || "");
    \u0275\u0275property("innerHTML", \u0275\u0275pipeBind4(1, 3, row_r6, column_r3, i_r7 + 1, ctx_r1.pagination()), \u0275\u0275sanitizeHtml);
  }
}
function SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-cell");
    \u0275\u0275conditionalCreate(1, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_1_Template, 2, 9, "a", 13)(2, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_2_Template, 1, 1)(3, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_3_Template, 1, 4, "img", 14)(4, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_4_Template, 3, 6)(5, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Case_5_Template, 2, 8, "div", 15);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_16_0;
    const column_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classMap(`py-sub ${ctx_r1.setCellNgClass(column_r3)}`);
    \u0275\u0275advance();
    \u0275\u0275conditional((tmp_16_0 = column_r3.formatting.type) === "LINK" ? 1 : tmp_16_0 === "INPUT" ? 2 : tmp_16_0 === "IMAGE" ? 3 : tmp_16_0 === "COMPONENT" ? 4 : 5);
  }
}
function SharedTableUiComponent_Defer_1_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 6);
    \u0275\u0275template(1, SharedTableUiComponent_Defer_1_For_2_mat_header_cell_1_Template, 2, 6, "mat-header-cell", 10)(2, SharedTableUiComponent_Defer_1_For_2_mat_cell_2_Template, 6, 3, "mat-cell", 11);
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    const column_r3 = ctx.$implicit;
    \u0275\u0275property("matColumnDef", column_r3.key)("sticky", column_r3.sticky);
  }
}
function SharedTableUiComponent_Defer_1_ForEmpty_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p");
    \u0275\u0275text(1, "No data available");
    \u0275\u0275elementEnd();
  }
}
function SharedTableUiComponent_Defer_1_Conditional_4_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell");
    \u0275\u0275text(1, " Accions ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap("mat-cell-actions justify-center overflow-visible " + (ctx_r1.actionsColStyles() || ""));
  }
}
function SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 39);
    \u0275\u0275listener("click", function SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_0_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r21);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "edit");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const action_r22 = \u0275\u0275nextContext().$implicit;
    const element_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("routerLink", (action_r22.value == null ? null : action_r22.value.link) ? action_r22.value == null ? null : action_r22.value.link(element_r23) : \u0275\u0275pureFunction1(4, _c3, element_r23.id))("matTooltip", (action_r22.value == null ? null : action_r22.value.description(element_r23)) || "")("disabled", (action_r22.value == null ? null : action_r22.value.disabled) ? action_r22.value == null ? null : action_r22.value.disabled(element_r23) : false);
    \u0275\u0275attribute("aria-label", (action_r22.value == null ? null : action_r22.value.description(element_r23)) || "");
  }
}
function SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 40);
    \u0275\u0275listener("click", function SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r24);
      const action_r22 = \u0275\u0275nextContext().$implicit;
      const element_r23 = \u0275\u0275nextContext().$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.getChangedData.emit(action_r22.value == null ? null : action_r22.value.execute(element_r23)));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "delete");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const action_r22 = \u0275\u0275nextContext().$implicit;
    const element_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("matTooltip", (action_r22.value == null ? null : action_r22.value.description(element_r23)) || "")("disabled", (action_r22.value == null ? null : action_r22.value.disabled) ? action_r22.value == null ? null : action_r22.value.disabled(element_r23) : false);
    \u0275\u0275attribute("aria-label", (action_r22.value == null ? null : action_r22.value.description(element_r23)) || "");
  }
}
function SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 40);
    \u0275\u0275listener("click", function SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r25);
      const element_r23 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.onDelete($event, element_r23));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "delete");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const action_r22 = \u0275\u0275nextContext().$implicit;
    const element_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("matTooltip", (action_r22.value == null ? null : action_r22.value.description(element_r23)) || "")("disabled", (action_r22.value == null ? null : action_r22.value.disabled) ? action_r22.value == null ? null : action_r22.value.disabled(element_r23) : false);
    \u0275\u0275attribute("aria-label", (action_r22.value == null ? null : action_r22.value.description(element_r23)) || "");
  }
}
function SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 41);
    \u0275\u0275listener("click", function SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_3_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r26);
      const action_r22 = \u0275\u0275nextContext().$implicit;
      const element_r23 = \u0275\u0275nextContext().$implicit;
      $event.stopPropagation();
      return \u0275\u0275resetView(action_r22.value == null ? null : action_r22.value.execute == null ? null : action_r22.value.execute(element_r23));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const action_r22 = \u0275\u0275nextContext().$implicit;
    const element_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("matTooltip", (action_r22.value == null ? null : action_r22.value.description(element_r23)) || "")("disabled", (action_r22.value == null ? null : action_r22.value.disabled) ? action_r22.value == null ? null : action_r22.value.disabled(element_r23) : false)("routerLink", (action_r22.value == null ? null : action_r22.value.link) ? action_r22.value == null ? null : action_r22.value.link(element_r23) : null);
    \u0275\u0275attribute("aria-label", (action_r22.value == null ? null : action_r22.value.description(element_r23)) || "");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(action_r22.value == null ? null : action_r22.value.icon(element_r23));
  }
}
function SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "button", 38);
    \u0275\u0275text(1, " \xA0 ");
    \u0275\u0275elementEnd();
  }
}
function SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_0_Template, 3, 6, "button", 35)(1, SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_1_Template, 3, 3, "button", 36)(2, SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_2_Template, 3, 3, "button", 36)(3, SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_3_Template, 3, 5, "button", 37)(4, SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Conditional_4_Template, 2, 0, "button", 38);
  }
  if (rf & 2) {
    const action_r22 = ctx.$implicit;
    const element_r23 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275conditional(action_r22.key === "EDIT" && (action_r22.value == null ? null : action_r22.value.visible(element_r23)) ? 0 : (action_r22.value == null ? null : action_r22.value.visible(element_r23)) && (action_r22.value == null ? null : action_r22.value.type) === "input" ? 1 : action_r22.key === "DELETE" && (action_r22.value == null ? null : action_r22.value.visible(element_r23)) ? 2 : (action_r22.value == null ? null : action_r22.value.visible(element_r23)) ? 3 : !(action_r22.value == null ? null : action_r22.value.visible(element_r23)) ? 4 : -1);
  }
}
function SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-cell");
    \u0275\u0275repeaterCreate(1, SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_For_2_Template, 5, 1, null, null, _forTrack0);
    \u0275\u0275pipe(3, "keyvalue");
    \u0275\u0275pipe(4, "orderTableActionsElements");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap("mat-cell-actions py-sub overflow-visible " + (ctx_r1.actionsColStyles() || ""));
    \u0275\u0275advance();
    \u0275\u0275repeater(\u0275\u0275pipeBind1(4, 4, \u0275\u0275pipeBind1(3, 2, ctx_r1.actions())));
  }
}
function SharedTableUiComponent_Defer_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 7);
    \u0275\u0275template(1, SharedTableUiComponent_Defer_1_Conditional_4_mat_header_cell_1_Template, 2, 2, "mat-header-cell", 34)(2, SharedTableUiComponent_Defer_1_Conditional_4_mat_cell_2_Template, 5, 6, "mat-cell", 11);
    \u0275\u0275elementContainerEnd();
  }
}
function SharedTableUiComponent_Defer_1_Conditional_5_mat_header_cell_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-header-cell", 47)(1, "span", 48);
    \u0275\u0275text(2, "expand");
    \u0275\u0275elementEnd()();
  }
}
function SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_2_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "keyboard_arrow_up");
    \u0275\u0275elementEnd();
  }
}
function SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_2_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon");
    \u0275\u0275text(1, "keyboard_arrow_down");
    \u0275\u0275elementEnd();
  }
}
function SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-cell", 49)(1, "button", 50);
    \u0275\u0275listener("click", function SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_2_Template_button_click_1_listener($event) {
      const element_r28 = \u0275\u0275restoreView(_r27).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.updateExpandedElement(element_r28));
    });
    \u0275\u0275conditionalCreate(2, SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_2_Conditional_2_Template, 2, 0, "mat-icon")(3, SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_2_Conditional_3_Template, 2, 0, "mat-icon");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    let tmp_5_0;
    const element_r28 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(((tmp_5_0 = ctx_r1.expandedElement()) == null ? null : tmp_5_0.id) === element_r28.id ? 2 : 3);
  }
}
function SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_4_Conditional_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_4_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_4_Conditional_1_ng_container_0_Template, 1, 0, "ng-container", 52);
  }
  if (rf & 2) {
    let tmp_7_0;
    const element_r29 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("ngTemplateOutlet", ctx_r1.expandedDetailTpl())("ngTemplateOutletContext", \u0275\u0275pureFunction2(2, _c4, element_r29, element_r29.id === ((tmp_7_0 = ctx_r1.expandedElement()) == null ? null : tmp_7_0.id)));
  }
}
function SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-cell", 51);
    \u0275\u0275conditionalCreate(1, SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_4_Conditional_1_Template, 1, 5, "ng-container");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    const element_r29 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275attribute("colspan", ctx_r1.columnsToDisplay().length);
    \u0275\u0275advance();
    \u0275\u0275conditional(element_r29.id === ((tmp_6_0 = ctx_r1.expandedElement()) == null ? null : tmp_6_0.id) ? 1 : -1);
  }
}
function SharedTableUiComponent_Defer_1_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0, 42);
    \u0275\u0275template(1, SharedTableUiComponent_Defer_1_Conditional_5_mat_header_cell_1_Template, 3, 0, "mat-header-cell", 43)(2, SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_2_Template, 4, 1, "mat-cell", 44);
    \u0275\u0275elementContainerEnd();
    \u0275\u0275elementContainerStart(3, 45);
    \u0275\u0275template(4, SharedTableUiComponent_Defer_1_Conditional_5_mat_cell_4_Template, 2, 2, "mat-cell", 46);
    \u0275\u0275elementContainerEnd();
  }
}
function SharedTableUiComponent_Defer_1_mat_header_row_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-header-row");
  }
}
function SharedTableUiComponent_Defer_1_Conditional_7_mat_row_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r30 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-row", 55);
    \u0275\u0275listener("click", function SharedTableUiComponent_Defer_1_Conditional_7_mat_row_0_Template_mat_row_click_0_listener($event) {
      const row_r31 = \u0275\u0275restoreView(_r30).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.expandedElement.set(ctx_r1.expandedElement() === row_r31 ? null : row_r31));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_5_0;
    let tmp_6_0;
    const row_r31 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap("expandable-row " + (((tmp_5_0 = ctx_r1.extraRowStyles()) == null ? null : tmp_5_0(row_r31)) || ""));
    \u0275\u0275classProp("expanded-row", ((tmp_6_0 = ctx_r1.expandedElement()) == null ? null : tmp_6_0.id) === row_r31.id);
  }
}
function SharedTableUiComponent_Defer_1_Conditional_7_mat_row_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-row", 56);
  }
}
function SharedTableUiComponent_Defer_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SharedTableUiComponent_Defer_1_Conditional_7_mat_row_0_Template, 1, 4, "mat-row", 53)(1, SharedTableUiComponent_Defer_1_Conditional_7_mat_row_1_Template, 1, 0, "mat-row", 54);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("matRowDefColumns", ctx_r1.columnsToDisplay());
    \u0275\u0275advance();
    \u0275\u0275property("matRowDefColumns", \u0275\u0275pureFunction0(2, _c5));
  }
}
function SharedTableUiComponent_Defer_1_Conditional_8_mat_row_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "mat-row");
  }
  if (rf & 2) {
    let tmp_5_0;
    const row_r32 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275classMap(((tmp_5_0 = ctx_r1.extraRowStyles()) == null ? null : tmp_5_0(row_r32)) || "");
    \u0275\u0275styleProp("height", ctx_r1.rowHeight());
  }
}
function SharedTableUiComponent_Defer_1_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, SharedTableUiComponent_Defer_1_Conditional_8_mat_row_0_Template, 1, 4, "mat-row", 57);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("matRowDefColumns", ctx_r1.columnsToDisplay());
  }
}
function SharedTableUiComponent_Defer_1_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0);
    \u0275\u0275projection(1, 1);
  }
}
function SharedTableUiComponent_Defer_1_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0, 2);
    \u0275\u0275projection(1, 3);
  }
}
function SharedTableUiComponent_Defer_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-table", 5);
    \u0275\u0275listener("matSortChange", function SharedTableUiComponent_Defer_1_Template_mat_table_matSortChange_0_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onChangeSorting($event));
    });
    \u0275\u0275repeaterCreate(1, SharedTableUiComponent_Defer_1_For_2_Template, 3, 2, "ng-container", 6, _forTrack0, false, SharedTableUiComponent_Defer_1_ForEmpty_3_Template, 2, 0, "p");
    \u0275\u0275conditionalCreate(4, SharedTableUiComponent_Defer_1_Conditional_4_Template, 3, 0, "ng-container", 7);
    \u0275\u0275conditionalCreate(5, SharedTableUiComponent_Defer_1_Conditional_5_Template, 5, 0);
    \u0275\u0275template(6, SharedTableUiComponent_Defer_1_mat_header_row_6_Template, 1, 0, "mat-header-row", 8);
    \u0275\u0275conditionalCreate(7, SharedTableUiComponent_Defer_1_Conditional_7_Template, 2, 3)(8, SharedTableUiComponent_Defer_1_Conditional_8_Template, 1, 1, "mat-row", 9);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(9, SharedTableUiComponent_Defer_1_Conditional_9_Template, 2, 0);
    \u0275\u0275template(10, SharedTableUiComponent_Defer_1_ng_template_10_Template, 2, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("dataSource", ctx_r1.dataSource)("matSortActive", ((tmp_3_0 = ctx_r1.matSort()) == null ? null : tmp_3_0.active) || "")("matSortDirection", ((tmp_4_0 = ctx_r1.matSort()) == null ? null : tmp_4_0.direction) || "");
    \u0275\u0275attribute("aria-label", ctx_r1.caption() || "tabular data");
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.columnProperties());
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.actions() ? 4 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.expandable() ? 5 : -1);
    \u0275\u0275advance();
    \u0275\u0275property("matHeaderRowDef", ctx_r1.columnsToDisplay())("matHeaderRowDefSticky", true);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.expandable() ? 7 : 8);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.dataSource.data.length ? 9 : -1);
  }
}
function SharedTableUiComponent_DeferPlaceholder_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 58);
    \u0275\u0275text(1, "loading data...");
    \u0275\u0275elementEnd();
  }
}
function SharedTableUiComponent_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "mat-paginator", 59, 2);
    \u0275\u0275listener("page", function SharedTableUiComponent_Conditional_5_Template_mat_paginator_page_0_listener($event) {
      \u0275\u0275restoreView(_r33);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onChangePagination($event));
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_3_0;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("pageIndex", (tmp_2_0 = ctx_r1.pagination()) == null ? null : tmp_2_0.pageIndex)("pageSize", (tmp_3_0 = ctx_r1.pagination()) == null ? null : tmp_3_0.pageSize)("length", ctx_r1.resultsLength());
  }
}
var SharedTableUiComponent = class _SharedTableUiComponent {
  dataFormatFactoryService = inject(DataFormatFactoryService);
  /**
   * Data that will populate the table.
   */
  data = input.required(...ngDevMode ? [{ debugName: "data" }] : []);
  /**
   * Table columns structure.
   */
  columnProperties = input.required(...ngDevMode ? [{ debugName: "columnProperties" }] : []);
  /**
   * The total number of items available for the current table data request.
   * Used for pagination and to show the total number of items.
   */
  resultsLength = input.required(...ngDevMode ? [{ debugName: "resultsLength" }] : []);
  /**
   * Pagination configuration.
   */
  pagination = input(...ngDevMode ? [void 0, { debugName: "pagination" }] : []);
  /**
   * Remove pagination component to the table. Present by default.
   */
  noPagination = input(false, ...ngDevMode ? [{ debugName: "noPagination" }] : []);
  /**
   * Sets the pagination elements visibility configuration.
   */
  paginationVisibility = input({
    hideRangeButtons: false,
    hideRangeLabel: false
  }, ...ngDevMode ? [{ debugName: "paginationVisibility" }] : []);
  /**
   * Main title of the table.
   */
  caption = input("", ...ngDevMode ? [{ debugName: "caption" }] : []);
  /**
   * Table sorting configuration.
   */
  sort = input(...ngDevMode ? [void 0, { debugName: "sort" }] : []);
  /**
   * Table actions configuration.
   */
  actions = input(...ngDevMode ? [void 0, { debugName: "actions" }] : []);
  filterCriteria = input({}, ...ngDevMode ? [{ debugName: "filterCriteria" }] : []);
  filterPredicate = input(...ngDevMode ? [void 0, { debugName: "filterPredicate" }] : []);
  extraRowStyles = input(...ngDevMode ? [void 0, { debugName: "extraRowStyles" }] : []);
  actionsColStyles = input(...ngDevMode ? [void 0, { debugName: "actionsColStyles" }] : []);
  rowHeight = input("unset", ...ngDevMode ? [{ debugName: "rowHeight" }] : []);
  expandable = input(false, ...ngDevMode ? [{ debugName: "expandable" }] : []);
  expandedElementId = input(null, ...ngDevMode ? [{ debugName: "expandedElementId" }] : []);
  expandedDetailTpl = input(null, ...ngDevMode ? [{ debugName: "expandedDetailTpl" }] : []);
  /**
   * An Output emitter to send table pagination changes.
   */
  changePagination = output();
  /**
   * An Output emitter to send table sorting changes.
   */
  changeSorting = output();
  /**
   * An Output emitter to send table delete action.
   */
  delete = output();
  getChangedData = output();
  matSort = viewChild(MatSort, ...ngDevMode ? [{ debugName: "matSort" }] : []);
  matPaginator = viewChild(MatPaginator, ...ngDevMode ? [{ debugName: "matPaginator" }] : []);
  matFormField;
  dataSource = new MatTableDataSource();
  columnsToDisplay = computed(() => {
    const actions = this.actions();
    const cols = this.columnProperties().map((property) => property.key) || [];
    return [
      ...this.expandable() ? ["expand"] : [],
      ...cols,
      ...!!actions && !isEmpty(actions) ? ["actions"] : []
    ];
  }, ...ngDevMode ? [{ debugName: "columnsToDisplay" }] : []);
  isNumber = isNumberTypeGuard;
  isText = isTextTypeGuard;
  isTextarea = isTextareaTypeGuard;
  isSelect = isSelectTypeGuard;
  isCheckBox = isCheckboxTypeGuard;
  isRadio = isRadioTypeGuard;
  isToggle = isToggleTypeGuard;
  isDynamicComponent = isDynamicComponentTypeGuard;
  expandedElement = signal(null, ...ngDevMode ? [{ debugName: "expandedElement" }] : []);
  #liveAnnouncer = inject(LiveAnnouncer);
  constructor() {
    effect(() => this.dataSource.data = this.data());
    effect(() => {
      if (this.filterCriteria() && this.filterPredicate()) {
        this.dataSource.filter = `${this.filterCriteria()}`;
      }
    });
  }
  ngOnInit() {
    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
      const value = sortHeaderId.split(".").reduce((obj, key) => {
        return obj && typeof obj === "object" ? obj[key] : obj;
      }, data);
      if (value === null || value === void 0)
        return "";
      if (typeof value === "number")
        return value;
      if (typeof value === "boolean")
        return value ? 1 : 0;
      if (value instanceof Date)
        return value.getTime();
      return String(value).toLowerCase();
    };
    if (this.filterPredicate && this.filterCriteria) {
      this.dataSource.filterPredicate = (data) => {
        return this.filterPredicate()?.(data, this.filterCriteria()) || false;
      };
    }
    if (this.sort()) {
      const matSortInstance = this.matSort();
      if (matSortInstance) {
        matSortInstance.active = this.sort()?.[0] || "";
        matSortInstance.direction = this.sort()?.[1] || "asc";
        this.dataSource.sort = matSortInstance;
      }
    }
  }
  onChangePagination({ previousPageIndex, pageIndex, pageSize }) {
    if (pageSize !== this.pagination()?.pageSize) {
      pageIndex = 0;
    }
    this.changePagination.emit({
      previousPageIndex,
      pageIndex,
      pageSize
    });
  }
  onChangeSorting({ active, direction }) {
    this.changeSorting.emit({
      active,
      direction
    });
    this.announceSortChange({ active, direction });
  }
  onDelete(event, element) {
    event.stopPropagation();
    this.delete.emit(element);
  }
  onInputChange(event, element, editableAttr) {
    let value;
    if (event instanceof MatSelectChange || event instanceof MatRadioChange) {
      value = event.value;
    } else if (event instanceof MatCheckboxChange || event instanceof MatSlideToggleChange) {
      value = event.checked;
    } else {
      value = event.target.value;
    }
    const result = editableAttr.onChanges?.(value, element);
    this.getChangedData.emit(result);
  }
  setCellNgClass(column) {
    return __spreadValues(__spreadValues(__spreadValues({}, column.cssClasses?.[0] ? { [column.cssClasses[0]]: true } : {}), column.formatting.type === "INPUT" ? { "mat-cell-input": true } : {}), column.formatting.type === "LINK" ? { "mat-cell-link": true } : {});
  }
  updateExpandedElement(element) {
    requestAnimationFrame(() => {
      this.expandedElement.set(this.expandedElement()?.id === element?.id ? null : element);
    });
  }
  announceSortChange(sortState) {
    if (sortState.direction) {
      this.#liveAnnouncer.announce(`Ordenant columna ${sortState.active} ${sortState.direction === "asc" ? "de forma ascendent" : "de forma descendent"}`, "assertive", 1e3);
    } else {
      this.#liveAnnouncer.announce("Ordenaci\xF3 cancel\xB7lada");
    }
  }
  static \u0275fac = function SharedTableUiComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SharedTableUiComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SharedTableUiComponent, selectors: [["plastik-shared-table"]], viewQuery: function SharedTableUiComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuerySignal(ctx.matSort, MatSort, 5)(ctx.matPaginator, MatPaginator, 5);
      \u0275\u0275viewQuery(_c05, 5);
    }
    if (rf & 2) {
      \u0275\u0275queryAdvance(2);
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.matFormField = _t);
    }
  }, inputs: { data: [1, "data"], columnProperties: [1, "columnProperties"], resultsLength: [1, "resultsLength"], pagination: [1, "pagination"], noPagination: [1, "noPagination"], paginationVisibility: [1, "paginationVisibility"], caption: [1, "caption"], sort: [1, "sort"], actions: [1, "actions"], filterCriteria: [1, "filterCriteria"], filterPredicate: [1, "filterPredicate"], extraRowStyles: [1, "extraRowStyles"], actionsColStyles: [1, "actionsColStyles"], rowHeight: [1, "rowHeight"], expandable: [1, "expandable"], expandedElementId: [1, "expandedElementId"], expandedDetailTpl: [1, "expandedDetailTpl"] }, outputs: { changePagination: "changePagination", changeSorting: "changeSorting", delete: "delete", getChangedData: "getChangedData" }, ngContentSelectors: _c22, decls: 6, vars: 2, consts: [["noResults", ""], ["matFormField", ""], ["matPaginator", ""], [1, "border-gray-10", "mb-tiny", "z-10", "mt-0", "grid", "w-full", "overflow-auto", "overflow-x-auto", "overflow-y-hidden", "border-t", "border-solid", "md:mt-4"], [1, "mt-md", "justify-end", 3, "pageIndex", "pageSize", "length"], ["matSort", "", "matSortDisableClear", "", "multiTemplateDataRows", "", 1, "table", "w-full", 3, "matSortChange", "dataSource", "matSortActive", "matSortDirection"], [3, "matColumnDef", "sticky"], ["matColumnDef", "actions"], [4, "matHeaderRowDef", "matHeaderRowDefSticky"], [3, "height", "class"], [3, "sortActionDescription", "mat-sort-header", "disabled", "class", 4, "matHeaderCellDef"], [3, "class", 4, "matCellDef"], [3, "sortActionDescription", "mat-sort-header", "disabled"], [3, "class", "routerLink", "queryParams", "innerHTML"], ["loading", "lazy", "fill", "", "priority", "", "placeholder", "https://placehold.co/200", 3, "alt", "ngSrc", "class"], [3, "class", "innerHTML"], [3, "click", "routerLink", "queryParams", "innerHTML"], [3, "class"], [3, "value", "multiple"], [3, "value", "checked"], [3, "checked", "aria-label"], [3, "value"], ["matTextPrefix", ""], ["matInput", "", 3, "change", "value", "placeholder"], ["matTextSuffix", ""], ["matInput", "", "type", "number", 3, "change", "value", "placeholder"], [3, "selectionChange", "value", "multiple"], [3, "change", "value", "checked"], [3, "change", "checked", "aria-label"], [3, "change", "value"], ["matInput", "", "cdkTextareaAutosize", "", "cdkAutosizeMinRows", "1", "cdkAutosizeMaxRows", "4", "autocomplete", "off", 3, "change", "value", "placeholder", "rows"], ["loading", "lazy", "fill", "", "priority", "", "placeholder", "https://placehold.co/200", 3, "alt", "ngSrc"], [4, "ngComponentOutlet", "ngComponentOutletInputs"], [3, "innerHTML"], [3, "class", 4, "matHeaderCellDef"], ["type", "button", "mat-icon-button", "", 3, "routerLink", "matTooltip", "disabled"], ["type", "button", "mat-icon-button", "", 3, "matTooltip", "disabled"], ["type", "button", "mat-icon-button", "", 3, "matTooltip", "disabled", "routerLink"], ["type", "button", "mat-icon-button", "", "aria-hidden", "true", 1, "invisible"], ["type", "button", "mat-icon-button", "", 3, "click", "routerLink", "matTooltip", "disabled"], ["type", "button", "mat-icon-button", "", 3, "click", "matTooltip", "disabled"], ["type", "button", "mat-icon-button", "", 3, "click", "matTooltip", "disabled", "routerLink"], ["matColumnDef", "expand", "sticky", "true"], ["aria-label", "row", "class", "max-w-[70px]", "aria-hidden", "true", 4, "matHeaderCellDef"], ["class", "max-w-[70px]", 4, "matCellDef"], ["matColumnDef", "expandedDetail"], ["class", "justify-evenly border-b-0", 4, "matCellDef"], ["aria-label", "row", "aria-hidden", "true", 1, "max-w-[70px]"], [1, "invisible"], [1, "max-w-[70px]"], ["mat-icon-button", "", "aria-label", "expand row", 1, "-left-sub", 3, "click"], [1, "justify-evenly", "border-b-0"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], ["sticky", "true", 3, "class", "expanded-row", "click", 4, "matRowDef", "matRowDefColumns"], ["sticky", "true", "class", "height-0 table-row", 4, "matRowDef", "matRowDefColumns"], ["sticky", "true", 3, "click"], ["sticky", "true", 1, "height-0", "table-row"], [3, "height", "class", 4, "matRowDef", "matRowDefColumns"], [1, "text-sm"], [1, "mt-md", "justify-end", 3, "page", "pageIndex", "pageSize", "length"]], template: function SharedTableUiComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef(_c15);
      \u0275\u0275elementStart(0, "div", 3);
      \u0275\u0275domTemplate(1, SharedTableUiComponent_Defer_1_Template, 12, 11)(2, SharedTableUiComponent_DeferPlaceholder_2_Template, 2, 0);
      \u0275\u0275defer(3, 1, SharedTableUiComponent_Defer_3_DepsFn, null, 2);
      \u0275\u0275deferOnIdle();
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(5, SharedTableUiComponent_Conditional_5_Template, 2, 3, "mat-paginator", 4);
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275deferPrefetchWhen(ctx.dataSource.data.length);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(!ctx.noPagination() ? 5 : -1);
    }
  }, dependencies: [
    CdkTableModule,
    MatTableModule,
    MatPaginatorModule,
    MatPaginator,
    MatSortModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSlideToggleModule,
    SharedUtilFormattersModule
  ], styles: ["\n\n  mat-table .mat-mdc-row {\n  min-height: var(--plastik-mdc-table-row-min-height, auto);\n  max-height: var(--plastik-mdc-table-row-max-height, auto);\n}\n  mat-table .mat-mdc-row li {\n  margin: 0;\n  padding: 0;\n}\n  mat-table .mat-mdc-row.marked-ok {\n  background-color: var(--plastik-mdc-table-row-marked-ok-bg-color, #a1e380) !important;\n}\n  mat-table .mat-mdc-row.marked-ko {\n  background-color: var(--plastik-mdc-table-row-marked-ko-bg-color, #f8c8c8) !important;\n}\n  mat-table .mat-mdc-row.marked-changed {\n  background-color: var(--plastik-mdc-table-row-marked-changed-bg-color, #e8bf79) !important;\n}\n  mat-table .mat-mdc-row.expanded-row > .mat-mdc-cell {\n  background-color: var(--plastik-mdc-nested-container-bg-color);\n  border-bottom-width: 0px;\n}\n  mat-table .mat-mdc-row.expanded-row + .mat-mdc-row > .mat-mdc-cell {\n  border-bottom-width: 1px !important;\n  background-color: var(--plastik-mdc-nested-container-bg-color);\n}\n  mat-table .mat-mdc-cell {\n  --mat-form-field-container-height: 45px;\n  --mat-form-field-container-text-size: var(--mat-sys-body-medium-size);\n}\n  mat-table .mat-mdc-cell .mat-mdc-form-field-infix {\n  width: auto;\n}\n  mat-table .mat-mdc-cell.mat-cell-link a {\n  cursor: pointer;\n}\n  mat-table .mat-mdc-cell li {\n  margin: 0;\n  padding: 0;\n}\n  mat-table .mat-mdc-cell .mdc-text-field--no-label .mat-mdc-form-field-infix {\n  padding: 0.5rem 0 0;\n}\n  mat-table .mat-mdc-cell .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n  mat-table mat-table {\n  --mat-table-background-color: var(--plastik-mdc-nested-data-bg-color);\n}\n  mat-table mat-table .mdc-data-table__row:not(:last-child) .mat-mdc-cell {\n  border-bottom-width: 1px;\n  border-bottom-style: solid;\n  border-bottom-color: var(--mat-table-row-item-outline-color);\n}\n  .mat-mdc-paginator.paginator--hide .mat-paginator-range-label {\n  display: none;\n}\n  .mat-mdc-paginator.paginator--hide-range-buttons .mat-mdc-paginator-range-actions > button {\n  display: none;\n}\n/*# sourceMappingURL=shared-table-ui.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadataAsync(SharedTableUiComponent, () => [import("./router-J5JVPWW6.js").then((m) => m.RouterLink), import("./common-HVE4QP6G.js").then((m) => m.NgComponentOutlet), import("./common-HVE4QP6G.js").then((m) => m.NgTemplateOutlet), import("./text-field-5HA6K7TD.js").then((m) => m.CdkTextareaAutosize), import("./common-HVE4QP6G.js").then((m) => m.NgOptimizedImage), import("./common-HVE4QP6G.js").then((m) => m.KeyValuePipe), import("./order-table-actions-elements.pipe-GNLRRW43.js").then((m) => m.OrderTableActionsElementsPipe)], (RouterLink, NgComponentOutlet, NgTemplateOutlet, CdkTextareaAutosize, NgOptimizedImage, KeyValuePipe, OrderTableActionsElementsPipe) => {
    setClassMetadata(SharedTableUiComponent, [{
      type: Component,
      args: [{ selector: "plastik-shared-table", imports: [
        RouterLink,
        KeyValuePipe,
        NgComponentOutlet,
        NgTemplateOutlet,
        CdkTableModule,
        CdkTextareaAutosize,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatTooltipModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSlideToggleModule,
        NgOptimizedImage,
        SharedUtilFormattersModule,
        OrderTableActionsElementsPipe,
        SafeFormattedPipe
      ], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div
  class="border-gray-10 mb-tiny z-10 mt-0 grid w-full overflow-auto overflow-x-auto overflow-y-hidden border-t border-solid md:mt-4">
  @defer (prefetch when dataSource.data.length) {
    <mat-table
      class="table w-full"
      matSort
      matSortDisableClear
      multiTemplateDataRows
      [dataSource]="dataSource"
      [attr.aria-label]="caption() || 'tabular data'"
      [matSortActive]="matSort()?.active || ''"
      [matSortDirection]="matSort()?.direction || ''"
      (matSortChange)="onChangeSorting($event)">
      <!-- Columns -->
      @for (column of columnProperties(); track column.key) {
        <ng-container [matColumnDef]="column.key" [sticky]="column.sticky">
          <mat-header-cell
            *matHeaderCellDef
            [sortActionDescription]="column.sorting ? \`Ordenar per \${column.title}\` : ''"
            [mat-sort-header]="column.sorting || ''"
            [disabled]="!column.sorting"
            [class]="column.cssClasses?.[0] || ''">
            {{ column.title }}
          </mat-header-cell>

          <mat-cell
            *matCellDef="let row; let i = dataIndex"
            [class]="\`py-sub \${setCellNgClass(column)}\`">
            @switch (column.formatting.type) {
              @case ('LINK') {
                <a
                  [class]="column.cssClasses?.[1] || ''"
                  [routerLink]="column.link ? column.link(row) : null"
                  [queryParams]="column.queryParams ? column.queryParams(row) : null"
                  [innerHTML]="row | safeFormatted: column : i + 1"
                  (click)="$event.stopPropagation()">
                </a>
              }
              @case ('INPUT') {
                @if (column.isEditableConfig?.(row); as editable) {
                  @let attributes = editable?.attributes;
                  <div [class]="'my-sub leading-6 ' + (column.cssClasses?.[1] || '')">
                    @if (isText(editable)) {
                      <mat-form-field
                        #matFormField
                        [class]="'editable inline ' + (attributes?.styles || '')">
                        @if (attributes?.prefix) {
                          <span matTextPrefix>{{ attributes?.prefix }}</span>
                        }
                        <input
                          matInput
                          [value]="row[column.key]"
                          [placeholder]="editable.attributes.placeholder || ''"
                          [attr.aria-label]="
                            row.name + ': ' + (editable.attributes.placeholder || '')
                          "
                          (change)="onInputChange($event, row, editable)" />
                        @if (attributes?.suffix) {
                          <span matTextSuffix>{{ attributes?.suffix }}</span>
                        }
                      </mat-form-field>
                    }

                    @if (isNumber(editable)) {
                      <mat-form-field
                        #matFormField
                        [class]="'editable inline ' + (attributes?.styles || '')">
                        @if (attributes?.prefix) {
                          <span matTextPrefix>{{ attributes?.prefix }}</span>
                        }
                        <input
                          matInput
                          type="number"
                          [value]="row[column.key]"
                          [attr.min]="editable.attributes.min || 0"
                          [attr.max]="editable.attributes.max || 100"
                          [attr.step]="editable.attributes.step || 1"
                          [placeholder]="editable.attributes.placeholder || ''"
                          [attr.aria-label]="
                            row.name + ': ' + (editable.attributes.placeholder || '')
                          "
                          (change)="onInputChange($event, row, editable)" />
                        @if (attributes?.suffix) {
                          <span matTextSuffix>{{ attributes?.suffix }}</span>
                        }
                      </mat-form-field>
                    }

                    @if (isSelect(editable)) {
                      <mat-select
                        [value]="row[column.key]"
                        [multiple]="editable.attributes.multiple || false"
                        [attr.aria-label]="
                          row.name + ': ' + (editable.attributes.placeholder || '')
                        "
                        (selectionChange)="onInputChange($event, row, editable)">
                        @for (option of editable.attributes.options; track option.value) {
                          <mat-option [value]="option.value">
                            {{ option.label }}
                          </mat-option>
                        }
                      </mat-select>
                    }

                    @if (isCheckBox(editable)) {
                      <mat-checkbox
                        [value]="row[column.key]"
                        [checked]="editable.attributes.checked || false"
                        [attr.aria-label]="
                          row.name + ': ' + (editable.attributes.placeholder || '')
                        "
                        (change)="onInputChange($event, row, editable)"></mat-checkbox>
                    }

                    @if (isToggle(editable)) {
                      <mat-slide-toggle
                        [checked]="row[column.key] || false"
                        [aria-label]="row.name + ': ' + (editable.attributes.placeholder || '')"
                        (change)="onInputChange($event, row, editable)"></mat-slide-toggle>
                    }

                    @if (isRadio(editable)) {
                      <mat-radio-group
                        [value]="row[column.key]"
                        [attr.aria-label]="
                          row.name + ': ' + (editable.attributes.placeholder || '')
                        "
                        (change)="onInputChange($event, row, editable)">
                        @for (option of editable.attributes.options; track option.value) {
                          <mat-radio-button [value]="option.value">
                            {{ option.label }}
                          </mat-radio-button>
                        }
                      </mat-radio-group>
                    }

                    @if (isTextarea(editable)) {
                      <mat-form-field
                        #matFormField
                        [class]="'editable inline ' + (attributes?.styles || '')">
                        @if (attributes?.prefix) {
                          <span matTextPrefix>{{ attributes?.prefix }}</span>
                        }
                        <textarea
                          matInput
                          cdkTextareaAutosize
                          cdkAutosizeMinRows="1"
                          cdkAutosizeMaxRows="4"
                          autocomplete="off"
                          [value]="row[column.key] || ''"
                          [placeholder]="editable.attributes.placeholder || ''"
                          [attr.aria-label]="
                            row.name + ': ' + (editable.attributes.placeholder || '')
                          "
                          [rows]="editable.attributes.rows || 2"
                          (change)="onInputChange($event, row, editable)"></textarea>
                        @if (attributes?.suffix) {
                          <span matTextSuffix>{{ attributes?.suffix }}</span>
                        }
                      </mat-form-field>
                    }
                  </div>
                }
              }

              @case ('IMAGE') {
                <img
                  loading="lazy"
                  fill
                  priority
                  placeholder="https://placehold.co/200"
                  [alt]="row.name || ''"
                  [ngSrc]="row[column.key] || ''"
                  [class]="column.cssClasses?.[1] || ''" />
              }

              @case ('COMPONENT') {
                @let config = row | safeFormatted: column : i;
                @if (config && isDynamicComponent(config)) {
                  <ng-container *ngComponentOutlet="config.component; inputs: config.inputs">
                  </ng-container>
                }
              }

              @default {
                <div
                  [class]="column.cssClasses?.[1] || ''"
                  [innerHTML]="row | safeFormatted: column : i + 1 : pagination()"></div>
              }
            }
          </mat-cell>
        </ng-container>
      } @empty {
        <p>No data available</p>
      }

      <!-- Actions column -->
      @if (actions()) {
        <ng-container matColumnDef="actions">
          <mat-header-cell
            *matHeaderCellDef
            [class]="
              'mat-cell-actions justify-center overflow-visible ' + (actionsColStyles() || '')
            ">
            Accions
          </mat-header-cell>
          <mat-cell
            *matCellDef="let element"
            [class]="'mat-cell-actions py-sub overflow-visible ' + (actionsColStyles() || '')">
            @for (action of actions() | keyvalue | orderTableActionsElements; track action.key) {
              @if (action.key === 'EDIT' && action.value?.visible(element)) {
                <button
                  type="button"
                  mat-icon-button
                  [routerLink]="action.value?.link ? action.value?.link(element) : [element.id]"
                  [attr.aria-label]="action.value?.description(element) || ''"
                  [matTooltip]="action.value?.description(element) || ''"
                  [disabled]="action.value?.disabled ? action.value?.disabled(element) : false"
                  (click)="$event.stopPropagation()">
                  <mat-icon>edit</mat-icon>
                </button>
              } @else if (action.value?.visible(element) && action.value?.type === 'input') {
                <button
                  type="button"
                  mat-icon-button
                  [attr.aria-label]="action.value?.description(element) || ''"
                  [matTooltip]="action.value?.description(element) || ''"
                  [disabled]="action.value?.disabled ? action.value?.disabled(element) : false"
                  (click)="
                    $event.stopPropagation(); getChangedData.emit(action.value?.execute(element))
                  ">
                  <mat-icon>delete</mat-icon>
                </button>
              } @else if (action.key === 'DELETE' && action.value?.visible(element)) {
                <button
                  type="button"
                  mat-icon-button
                  [attr.aria-label]="action.value?.description(element) || ''"
                  [matTooltip]="action.value?.description(element) || ''"
                  [disabled]="action.value?.disabled ? action.value?.disabled(element) : false"
                  (click)="$event.stopPropagation(); onDelete($event, element)">
                  <mat-icon>delete</mat-icon>
                </button>
              } @else if (action.value?.visible(element)) {
                <button
                  type="button"
                  mat-icon-button
                  [attr.aria-label]="action.value?.description(element) || ''"
                  [matTooltip]="action.value?.description(element) || ''"
                  [disabled]="action.value?.disabled ? action.value?.disabled(element) : false"
                  [routerLink]="action.value?.link ? action.value?.link(element) : null"
                  (click)="$event.stopPropagation(); action.value?.execute?.(element)">
                  <mat-icon>{{ action.value?.icon(element) }}</mat-icon>
                </button>
              } @else if (!action.value?.visible(element)) {
                <!-- TODO: #447 find a better way to handle the height of the cell when it has no buttons --->
                <button type="button" mat-icon-button class="invisible" aria-hidden="true">
                  &nbsp;
                </button>
              }
            }
          </mat-cell>
        </ng-container>
      }

      @if (expandable()) {
        <ng-container matColumnDef="expand" sticky="true">
          <mat-header-cell
            *matHeaderCellDef
            aria-label="row"
            class="max-w-[70px]"
            aria-hidden="true"
            ><span class="invisible">expand</span></mat-header-cell
          >
          <mat-cell *matCellDef="let element" class="max-w-[70px]">
            <button
              mat-icon-button
              aria-label="expand row"
              class="-left-sub"
              (click)="$event.stopPropagation(); updateExpandedElement(element)">
              @if (expandedElement()?.id === element.id) {
                <mat-icon>keyboard_arrow_up</mat-icon>
              } @else {
                <mat-icon>keyboard_arrow_down</mat-icon>
              }
            </button>
          </mat-cell>
        </ng-container>

        <!-- Expanded Content Column - The detail row is made up of this one column that spans across all columns -->
        <ng-container matColumnDef="expandedDetail">
          <mat-cell
            *matCellDef="let element"
            class="justify-evenly border-b-0"
            [attr.colspan]="columnsToDisplay().length">
            @if (element.id === expandedElement()?.id) {
              <ng-container
                *ngTemplateOutlet="
                  expandedDetailTpl();
                  context: { element, isExpanded: element.id === expandedElement()?.id }
                "></ng-container>
            }
          </mat-cell>
        </ng-container>
      }

      <mat-header-row *matHeaderRowDef="columnsToDisplay(); sticky: true"></mat-header-row>

      <!-- Expanded Content Column - The detail row is made up of this one column that spans across all columns -->
      @if (expandable()) {
        <mat-row
          *matRowDef="let row; columns: columnsToDisplay()"
          sticky="true"
          [class]="'expandable-row ' + (extraRowStyles()?.(row) || '')"
          [class.expanded-row]="expandedElement()?.id === row.id"
          (click)="
            $event.stopPropagation(); expandedElement.set(expandedElement() === row ? null : row)
          "></mat-row>
        <mat-row
          *matRowDef="let row; columns: ['expandedDetail']"
          sticky="true"
          class="height-0 table-row"></mat-row>
      } @else {
        <!-- Row that will be used to display the regular data -->
        <mat-row
          *matRowDef="let row; columns: columnsToDisplay()"
          [style.height]="rowHeight()"
          [class]="extraRowStyles()?.(row) || ''"></mat-row>
      }
    </mat-table>

    @if (!dataSource.data.length) {
      <ng-content select="[noResults]"></ng-content>
      <ng-content select="[noValidSearch]"></ng-content>
    }

    <ng-template #noResults>
      <ng-content select="[noResults]"></ng-content>
      <ng-content select="[noValidSearch]"></ng-content>
    </ng-template>
  } @placeholder {
    <p class="text-sm">loading data...</p>
  }
</div>

@if (!noPagination()) {
  <mat-paginator
    #matPaginator
    class="mt-md justify-end"
    [pageIndex]="pagination()?.pageIndex"
    [pageSize]="pagination()?.pageSize"
    [length]="resultsLength()"
    (page)="onChangePagination($event)">
  </mat-paginator>
}
`, styles: ["/* libs/shared/table/ui/src/lib/shared-table-ui/shared-table-ui.component.scss */\n::ng-deep mat-table .mat-mdc-row {\n  min-height: var(--plastik-mdc-table-row-min-height, auto);\n  max-height: var(--plastik-mdc-table-row-max-height, auto);\n}\n::ng-deep mat-table .mat-mdc-row li {\n  margin: 0;\n  padding: 0;\n}\n::ng-deep mat-table .mat-mdc-row.marked-ok {\n  background-color: var(--plastik-mdc-table-row-marked-ok-bg-color, #a1e380) !important;\n}\n::ng-deep mat-table .mat-mdc-row.marked-ko {\n  background-color: var(--plastik-mdc-table-row-marked-ko-bg-color, #f8c8c8) !important;\n}\n::ng-deep mat-table .mat-mdc-row.marked-changed {\n  background-color: var(--plastik-mdc-table-row-marked-changed-bg-color, #e8bf79) !important;\n}\n::ng-deep mat-table .mat-mdc-row.expanded-row > .mat-mdc-cell {\n  background-color: var(--plastik-mdc-nested-container-bg-color);\n  border-bottom-width: 0px;\n}\n::ng-deep mat-table .mat-mdc-row.expanded-row + .mat-mdc-row > .mat-mdc-cell {\n  border-bottom-width: 1px !important;\n  background-color: var(--plastik-mdc-nested-container-bg-color);\n}\n::ng-deep mat-table .mat-mdc-cell {\n  --mat-form-field-container-height: 45px;\n  --mat-form-field-container-text-size: var(--mat-sys-body-medium-size);\n}\n::ng-deep mat-table .mat-mdc-cell .mat-mdc-form-field-infix {\n  width: auto;\n}\n::ng-deep mat-table .mat-mdc-cell.mat-cell-link a {\n  cursor: pointer;\n}\n::ng-deep mat-table .mat-mdc-cell li {\n  margin: 0;\n  padding: 0;\n}\n::ng-deep mat-table .mat-mdc-cell .mdc-text-field--no-label .mat-mdc-form-field-infix {\n  padding: 0.5rem 0 0;\n}\n::ng-deep mat-table .mat-mdc-cell .mat-mdc-form-field-subscript-wrapper {\n  display: none;\n}\n::ng-deep mat-table mat-table {\n  --mat-table-background-color: var(--plastik-mdc-nested-data-bg-color);\n}\n::ng-deep mat-table mat-table .mdc-data-table__row:not(:last-child) .mat-mdc-cell {\n  border-bottom-width: 1px;\n  border-bottom-style: solid;\n  border-bottom-color: var(--mat-table-row-item-outline-color);\n}\n::ng-deep .mat-mdc-paginator.paginator--hide .mat-paginator-range-label {\n  display: none;\n}\n::ng-deep .mat-mdc-paginator.paginator--hide-range-buttons .mat-mdc-paginator-range-actions > button {\n  display: none;\n}\n/*# sourceMappingURL=shared-table-ui.component.css.map */\n"] }]
    }], () => [], { data: [{ type: Input, args: [{ isSignal: true, alias: "data", required: true }] }], columnProperties: [{ type: Input, args: [{ isSignal: true, alias: "columnProperties", required: true }] }], resultsLength: [{ type: Input, args: [{ isSignal: true, alias: "resultsLength", required: true }] }], pagination: [{ type: Input, args: [{ isSignal: true, alias: "pagination", required: false }] }], noPagination: [{ type: Input, args: [{ isSignal: true, alias: "noPagination", required: false }] }], paginationVisibility: [{ type: Input, args: [{ isSignal: true, alias: "paginationVisibility", required: false }] }], caption: [{ type: Input, args: [{ isSignal: true, alias: "caption", required: false }] }], sort: [{ type: Input, args: [{ isSignal: true, alias: "sort", required: false }] }], actions: [{ type: Input, args: [{ isSignal: true, alias: "actions", required: false }] }], filterCriteria: [{ type: Input, args: [{ isSignal: true, alias: "filterCriteria", required: false }] }], filterPredicate: [{ type: Input, args: [{ isSignal: true, alias: "filterPredicate", required: false }] }], extraRowStyles: [{ type: Input, args: [{ isSignal: true, alias: "extraRowStyles", required: false }] }], actionsColStyles: [{ type: Input, args: [{ isSignal: true, alias: "actionsColStyles", required: false }] }], rowHeight: [{ type: Input, args: [{ isSignal: true, alias: "rowHeight", required: false }] }], expandable: [{ type: Input, args: [{ isSignal: true, alias: "expandable", required: false }] }], expandedElementId: [{ type: Input, args: [{ isSignal: true, alias: "expandedElementId", required: false }] }], expandedDetailTpl: [{ type: Input, args: [{ isSignal: true, alias: "expandedDetailTpl", required: false }] }], changePagination: [{ type: Output, args: ["changePagination"] }], changeSorting: [{ type: Output, args: ["changeSorting"] }], delete: [{ type: Output, args: ["delete"] }], getChangedData: [{ type: Output, args: ["getChangedData"] }], matSort: [{ type: ViewChild, args: [forwardRef(() => MatSort), { isSignal: true }] }], matPaginator: [{ type: ViewChild, args: [forwardRef(() => MatPaginator), { isSignal: true }] }], matFormField: [{
      type: ViewChildren,
      args: ["matFormField", { emitDistinctChangesOnly: true }]
    }] });
  });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SharedTableUiComponent, { className: "SharedTableUiComponent", filePath: "libs/shared/table/ui/src/lib/shared-table-ui/shared-table-ui.component.ts", lineNumber: 96 });
})();
export {
  SharedTableUiComponent
};
//# sourceMappingURL=src-HNVSK7A6.js.map
