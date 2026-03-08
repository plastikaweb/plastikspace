import {
  MatToolbar,
  MatToolbarModule
} from "./chunk-A7UCKEWA.js";
import "./chunk-KBRZIECL.js";
import "./chunk-JE5ZVCAC.js";
import "./chunk-AZCQQA2S.js";
import "./chunk-CGEOGME2.js";
import "./chunk-A7BY5NXF.js";
import {
  ChangeDetectionStrategy,
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵprojection,
  ɵɵprojectionDef
} from "./chunk-2OB7EGFP.js";

// libs/core/cms-layout/ui/footer/src/lib/core-cms-layout-ui-footer.component.ts
var _c0 = [[["", "content", ""]]];
var _c1 = ["[content]"];
var CoreCmsLayoutUiFooterComponent = class _CoreCmsLayoutUiFooterComponent {
  static \u0275fac = function CoreCmsLayoutUiFooterComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CoreCmsLayoutUiFooterComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CoreCmsLayoutUiFooterComponent, selectors: [["plastik-core-cms-layout-ui-footer"]], ngContentSelectors: _c1, decls: 3, vars: 0, consts: [[1, "flex", "items-center", "justify-center"]], template: function CoreCmsLayoutUiFooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef(_c0);
      \u0275\u0275elementStart(0, "mat-toolbar", 0)(1, "footer");
      \u0275\u0275projection(2);
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [MatToolbarModule, MatToolbar], styles: ["\n\nmat-toolbar[_ngcontent-%COMP%] {\n  --mat-toolbar-standard-height: 35px;\n}\n/*# sourceMappingURL=core-cms-layout-ui-footer.component.css.map */"], changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CoreCmsLayoutUiFooterComponent, [{
    type: Component,
    args: [{ selector: "plastik-core-cms-layout-ui-footer", imports: [MatToolbarModule], changeDetection: ChangeDetectionStrategy.OnPush, template: '<mat-toolbar class="flex items-center justify-center">\n  <footer>\n    <ng-content select="[content]"></ng-content>\n  </footer>\n</mat-toolbar>\n', styles: ["/* angular:styles/component:scss;de7d3bc57d46da71a2218bc9d1b24e6178a14a1f2bea5b4ece9b1fdf921b5a6d;/home/runner/work/plastikspace/plastikspace/libs/core/cms-layout/ui/footer/src/lib/core-cms-layout-ui-footer.component.ts */\nmat-toolbar {\n  --mat-toolbar-standard-height: 35px;\n}\n/*# sourceMappingURL=core-cms-layout-ui-footer.component.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CoreCmsLayoutUiFooterComponent, { className: "CoreCmsLayoutUiFooterComponent", filePath: "libs/core/cms-layout/ui/footer/src/lib/core-cms-layout-ui-footer.component.ts", lineNumber: 17 });
})();
export {
  CoreCmsLayoutUiFooterComponent
};
//# sourceMappingURL=src-7A753UNU.js.map
