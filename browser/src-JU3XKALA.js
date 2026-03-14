import {
  MAT_SNACK_BAR_DATA,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBar,
  MatSnackBarRef
} from "./chunk-UNM7GEAM.js";
import {
  toSignal
} from "./chunk-UQLQKUAM.js";
import "./chunk-O2HBGYIZ.js";
import "./chunk-PQMARCSX.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-FISKPURU.js";
import "./chunk-IUU7LH4O.js";
import "./chunk-YQAIJDSK.js";
import "./chunk-AXITIRMB.js";
import "./chunk-OWY5PAQP.js";
import "./chunk-LSGJAAAU.js";
import "./chunk-JE5ZVCAC.js";
import "./chunk-26MSZY5E.js";
import "./chunk-SYOTMQYJ.js";
import "./chunk-DGI5PKJ2.js";
import "./chunk-4F7YCR2E.js";
import "./chunk-4LIO4VKC.js";
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  EMPTY,
  Input,
  Output,
  __objRest,
  __spreadValues,
  effect,
  inject,
  input,
  output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-WAATNY3Y.js";

// libs/shared/notification/ui/mat-snackbar/src/lib/notification-ui-mat-snackbar/notification-ui-mat-snackbar.component.ts
function NotificationUiMatSnackbarComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-icon", 2);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx);
  }
}
function NotificationUiMatSnackbarComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 5);
    \u0275\u0275listener("click", function NotificationUiMatSnackbarComponent_Conditional_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.dismiss());
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275attribute("aria-label", ctx_r1.data.ariaLabel);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx, " ");
  }
}
var NotificationUiMatSnackbarComponent = class _NotificationUiMatSnackbarComponent {
  #snackBarRef = inject(MatSnackBarRef);
  data = inject(MAT_SNACK_BAR_DATA);
  dismiss() {
    this.#snackBarRef.dismiss();
  }
  static \u0275fac = function NotificationUiMatSnackbarComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationUiMatSnackbarComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _NotificationUiMatSnackbarComponent, selectors: [["plastik-shared-notification-ui-mat-snackbar"]], decls: 5, vars: 3, consts: [[1, "gap-sm", "flex", "flex-row", "items-center", "justify-between"], ["matSnackBarLabel", "", 1, "gap-sm", "flex", "flex-row", "items-center", "justify-start"], ["aria-hidden", "true", 1, "basis-5", "md:basis-2"], [1, "text-balance", 3, "innerHTML"], ["mat-button", "", "matSnackBarAction", ""], ["mat-button", "", "matSnackBarAction", "", 3, "click"]], template: function NotificationUiMatSnackbarComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1);
      \u0275\u0275conditionalCreate(2, NotificationUiMatSnackbarComponent_Conditional_2_Template, 2, 1, "mat-icon", 2);
      \u0275\u0275element(3, "p", 3);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(4, NotificationUiMatSnackbarComponent_Conditional_4_Template, 2, 2, "button", 4);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      let tmp_0_0;
      let tmp_2_0;
      \u0275\u0275advance(2);
      \u0275\u0275conditional((tmp_0_0 = ctx.data.icon) ? 2 : -1, tmp_0_0);
      \u0275\u0275advance();
      \u0275\u0275property("innerHTML", ctx.data.message, \u0275\u0275sanitizeHtml);
      \u0275\u0275advance();
      \u0275\u0275conditional((tmp_2_0 = ctx.data.action) ? 4 : -1, tmp_2_0);
    }
  }, dependencies: [MatIconModule, MatIcon], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationUiMatSnackbarComponent, [{
    type: Component,
    args: [{ selector: "plastik-shared-notification-ui-mat-snackbar", imports: [MatIconModule], changeDetection: ChangeDetectionStrategy.OnPush, template: '<div class="gap-sm flex flex-row items-center justify-between">\n  <div class="gap-sm flex flex-row items-center justify-start" matSnackBarLabel>\n    @if (data.icon; as icon) {\n      <mat-icon aria-hidden="true" class="basis-5 md:basis-2">{{ icon }}</mat-icon>\n    }\n    <p class="text-balance" [innerHTML]="data.message"></p>\n  </div>\n  @if (data.action; as action) {\n    <button mat-button matSnackBarAction [attr.aria-label]="data.ariaLabel" (click)="dismiss()">\n      {{ action }}\n    </button>\n  }\n</div>\n' }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(NotificationUiMatSnackbarComponent, { className: "NotificationUiMatSnackbarComponent", filePath: "libs/shared/notification/ui/mat-snackbar/src/lib/notification-ui-mat-snackbar/notification-ui-mat-snackbar.component.ts", lineNumber: 12 });
})();

// libs/shared/notification/ui/mat-snackbar/src/lib/notification-ui-mat-snackbar/notification-ui-mat-snackbar.directive.ts
var NotificationUiMatSnackbarDirective = class _NotificationUiMatSnackbarDirective {
  plastikSnackbar = input(null, ...ngDevMode ? [{ debugName: "plastikSnackbar" }] : (
    /* istanbul ignore next */
    []
  ));
  sendDismiss = output();
  #snackBar = inject(MatSnackBar);
  #defaultSnackBarConfig = inject(MAT_SNACK_BAR_DEFAULT_OPTIONS);
  #currentSnackBarRef;
  afterDismissed = toSignal(this.#currentSnackBarRef?.afterDismissed() || EMPTY);
  constructor() {
    effect(() => {
      const notification = this.plastikSnackbar();
      if (notification) {
        this.open(notification);
      } else {
        this.dismissCurrentSnackBar();
      }
    });
    if (this.afterDismissed()) {
      this.sendDismiss.emit();
      this.#currentSnackBarRef = void 0;
    }
  }
  ngOnDestroy() {
    this.dismissCurrentSnackBar();
  }
  dismissCurrentSnackBar() {
    if (this.#currentSnackBarRef) {
      this.#currentSnackBarRef?.dismiss();
      this.#currentSnackBarRef = void 0;
    }
  }
  open(config) {
    this.dismissCurrentSnackBar();
    const finalConfig = __spreadValues(__spreadValues({}, this.#defaultSnackBarConfig), config);
    const snackBarConfig = __spreadValues(__spreadValues({}, this.addNotificationMatSnackBarConfig(finalConfig)), this.addTypeStyling(finalConfig));
    this.#currentSnackBarRef = this.#snackBar.openFromComponent(NotificationUiMatSnackbarComponent, snackBarConfig);
  }
  addNotificationMatSnackBarConfig(_a) {
    var _b = _a, { duration, verticalPosition, horizontalPosition } = _b, data = __objRest(_b, ["duration", "verticalPosition", "horizontalPosition"]);
    return {
      duration,
      verticalPosition,
      horizontalPosition,
      data
    };
  }
  addTypeStyling({ containerClass, type }) {
    return {
      panelClass: [...containerClass || "", "message-box", `message-box-${type?.toLowerCase()}`]
    };
  }
  static \u0275fac = function NotificationUiMatSnackbarDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationUiMatSnackbarDirective)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _NotificationUiMatSnackbarDirective, selectors: [["", "plastikSnackbar", ""]], inputs: { plastikSnackbar: [1, "plastikSnackbar"] }, outputs: { sendDismiss: "sendDismiss" } });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationUiMatSnackbarDirective, [{
    type: Directive,
    args: [{
      selector: "[plastikSnackbar]"
    }]
  }], () => [], { plastikSnackbar: [{ type: Input, args: [{ isSignal: true, alias: "plastikSnackbar", required: false }] }], sendDismiss: [{ type: Output, args: ["sendDismiss"] }] });
})();
export {
  NotificationUiMatSnackbarDirective
};
//# sourceMappingURL=src-JU3XKALA.js.map
