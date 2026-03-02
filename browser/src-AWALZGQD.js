import {
  MatIcon,
  MatIconModule
} from "./chunk-KBBME3FM.js";
import "./chunk-FVGDPSDA.js";
import "./chunk-KG4ZTJVB.js";
import "./chunk-IR4FHEGZ.js";
import "./chunk-HK4FYR2A.js";
import "./chunk-Z42NTOHH.js";
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
} from "./chunk-SF6CW7SJ.js";

// libs/nasa-images/search/ui/no-results/src/lib/nasa-images-search-ui-no-results/nasa-images-search-ui-no-results.component.ts
var _c0 = [[["", "icon", ""]], [["", "title", ""]], [["", "message", ""]]];
var _c1 = ["[icon]", "[title]", "[message]"];
var NasaImagesSearchUiNoResultsComponent = class _NasaImagesSearchUiNoResultsComponent {
  static \u0275fac = function NasaImagesSearchUiNoResultsComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NasaImagesSearchUiNoResultsComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NasaImagesSearchUiNoResultsComponent, selectors: [["plastik-nasa-images-search-ui-no-results"]], ngContentSelectors: _c1, decls: 7, vars: 0, consts: [[1, "mb-sm", "md:my-xl", "mx-auto", "mt-0", "w-5/6", "text-center"], [1, "flex", "flex-col", "items-center"], ["aria-hidden", "true", 1, "size-[15rem]", "text-[15rem]"], ["data-test", "search-no-results-message", 1, "mt-md"]], template: function NasaImagesSearchUiNoResultsComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef(_c0);
      \u0275\u0275elementStart(0, "div", 0)(1, "h3", 1)(2, "mat-icon", 2);
      \u0275\u0275projection(3);
      \u0275\u0275elementEnd();
      \u0275\u0275projection(4, 1);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 3);
      \u0275\u0275projection(6, 2);
      \u0275\u0275elementEnd()();
    }
  }, dependencies: [MatIconModule, MatIcon], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NasaImagesSearchUiNoResultsComponent, [{
    type: Component,
    args: [{ selector: "plastik-nasa-images-search-ui-no-results", imports: [MatIconModule], changeDetection: ChangeDetectionStrategy.OnPush, template: '<div class="mb-sm md:my-xl mx-auto mt-0 w-5/6 text-center">\n  <h3 class="flex flex-col items-center">\n    <mat-icon aria-hidden="true" class="size-[15rem] text-[15rem]">\n      <ng-content select="[icon]"></ng-content>\n    </mat-icon>\n    <ng-content select="[title]"></ng-content>\n  </h3>\n  <div class="mt-md" data-test="search-no-results-message">\n    <ng-content select="[message]"></ng-content>\n  </div>\n</div>\n' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NasaImagesSearchUiNoResultsComponent, { className: "NasaImagesSearchUiNoResultsComponent", filePath: "libs/nasa-images/search/ui/no-results/src/lib/nasa-images-search-ui-no-results/nasa-images-search-ui-no-results.component.ts", lineNumber: 10 });
})();
export {
  NasaImagesSearchUiNoResultsComponent
};
//# sourceMappingURL=src-AWALZGQD.js.map
