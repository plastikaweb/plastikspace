import {
  AngularSvgIconModule,
  SvgIconComponent
} from "./chunk-22FV327D.js";
import {
  PushPipe
} from "./chunk-WLAQFVMH.js";
import "./chunk-YEO3NIPJ.js";
import {
  MatTooltip,
  MatTooltipModule
} from "./chunk-M7EM4256.js";
import {
  MatButton,
  MatButtonModule
} from "./chunk-Q3HLMZJC.js";
import "./chunk-O5T33GSN.js";
import "./chunk-ON7GGAEN.js";
import "./chunk-JMFBMRKX.js";
import "./chunk-DH5OOHJ7.js";
import "./chunk-OVMRMWIJ.js";
import "./chunk-DOKZBUCQ.js";
import "./chunk-A5TZZPDE.js";
import "./chunk-MDH5I3DC.js";
import "./chunk-MHHILDTD.js";
import {
  NgTemplateOutlet
} from "./chunk-PTTPPMFB.js";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  Pipe,
  computed,
  input,
  isObservable,
  of,
  output,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefinePipe,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-BYTVJWX3.js";

// libs/shared/button/entities/src/button.ts
function buttonHasALinkGuard(toBeDetermined) {
  return toBeDetermined.type === "link";
}

// libs/shared/util/return-as-observable-pipe/src/lib/return-as-observable.pipe.ts
var ReturnAsObservablePipe = class _ReturnAsObservablePipe {
  /**
   * @description Transforms a value or an Observable of a value into an Observable of the same type.
   * @param {unknown | Observable<unknown>} value The value or Observable to transform.
   * @returns { Observable<unknown> } An Observable of the same type as the input.
   */
  transform(value) {
    return isObservable(value) ? value : of(value);
  }
  static \u0275fac = function ReturnAsObservablePipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReturnAsObservablePipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "returnAsObservable", type: _ReturnAsObservablePipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReturnAsObservablePipe, [{
    type: Pipe,
    args: [{
      name: "returnAsObservable"
    }]
  }], null, null);
})();

// libs/shared/button/ui/src/lib/shared-button-ui/shared-button-ui.component.ts
function SharedButtonUiComponent_Conditional_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainer(0);
  }
}
function SharedButtonUiComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 3);
    \u0275\u0275listener("click", function SharedButtonUiComponent_Conditional_0_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onClick());
    });
    \u0275\u0275template(1, SharedButtonUiComponent_Conditional_0_ng_container_1_Template, 1, 0, "ng-container", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    const content_r3 = \u0275\u0275reference(3);
    \u0275\u0275classMap(`button--rounded ${ctx_r1.buttonConfig().classes || ""}`);
    \u0275\u0275property("disabled", ctx_r1.buttonConfig().disabled)("matTooltip", ctx_r1.buttonConfig().tooltip || ctx_r1.buttonConfig().ariaLabel);
    \u0275\u0275attribute("aria-label", ctx_r1.buttonConfig().ariaLabel)("data-test", ctx_r1.buttonConfig().dataTestId);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", content_r3);
  }
}
function SharedButtonUiComponent_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275text(1, "button content");
    \u0275\u0275elementContainerEnd();
  }
}
function SharedButtonUiComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 2);
    \u0275\u0275template(1, SharedButtonUiComponent_Conditional_1_ng_container_1_Template, 2, 0, "ng-container", 4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    const content_r3 = \u0275\u0275reference(3);
    \u0275\u0275property("matTooltip", ctx_r1.buttonConfig().tooltip || ctx_r1.buttonConfig().ariaLabel)("href", ctx_r1.linkHref(), \u0275\u0275sanitizeUrl);
    \u0275\u0275attribute("aria-label", ctx_r1.buttonConfig().ariaLabel)("data-test", ctx_r1.buttonConfig().dataTestId);
    \u0275\u0275advance();
    \u0275\u0275property("ngTemplateOutlet", content_r3);
  }
}
function SharedButtonUiComponent_ng_template_2_For_1_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1);
    \u0275\u0275pipe(2, "returnAsObservable");
    \u0275\u0275pipe(3, "ngrxPush");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const element_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(3, 3, \u0275\u0275pipeBind1(2, 1, element_r4.content)));
  }
}
function SharedButtonUiComponent_ng_template_2_For_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "svg-icon", 5);
    \u0275\u0275pipe(1, "returnAsObservable");
    \u0275\u0275pipe(2, "ngrxPush");
    \u0275\u0275pipe(3, "returnAsObservable");
    \u0275\u0275pipe(4, "ngrxPush");
  }
  if (rf & 2) {
    let tmp_13_0;
    let tmp_14_0;
    const element_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", ((tmp_13_0 = \u0275\u0275pipeBind1(2, 4, \u0275\u0275pipeBind1(1, 2, element_r4.content))) == null ? null : tmp_13_0.iconPath) || "")("svgClass", ((tmp_14_0 = \u0275\u0275pipeBind1(4, 8, \u0275\u0275pipeBind1(3, 6, element_r4.content))) == null ? null : tmp_14_0.svgClass) || "");
  }
}
function SharedButtonUiComponent_ng_template_2_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, SharedButtonUiComponent_ng_template_2_For_1_Conditional_0_Template, 4, 5, "span");
    \u0275\u0275conditionalCreate(1, SharedButtonUiComponent_ng_template_2_For_1_Conditional_1_Template, 5, 10, "svg-icon", 5);
  }
  if (rf & 2) {
    const element_r4 = ctx.$implicit;
    \u0275\u0275conditional(element_r4.type === "text" ? 0 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(element_r4.type === "icon" ? 1 : -1);
  }
}
function SharedButtonUiComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, SharedButtonUiComponent_ng_template_2_For_1_Template, 2, 2, null, null, \u0275\u0275repeaterTrackByIndex);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r1.buttonConfig().elements);
  }
}
var SharedButtonUiComponent = class _SharedButtonUiComponent {
  /**
   * @description A configuration object that passes a button configuration to build the button.
   * @param {ButtonConfig} config
   */
  buttonConfig = input.required(...ngDevMode ? [{ debugName: "buttonConfig" }] : (
    /* istanbul ignore next */
    []
  ));
  /**
   * @description Computed signal that returns the link from config if it's a link type button
   */
  linkHref = computed(() => {
    const cfg = this.buttonConfig();
    return buttonHasALinkGuard(cfg) ? cfg.link : void 0;
  }, ...ngDevMode ? [{ debugName: "linkHref" }] : (
    /* istanbul ignore next */
    []
  ));
  /**
   * @description Emits the attached button action on button click.
   */
  sendAction = output();
  onClick() {
    if (!buttonHasALinkGuard(this.buttonConfig())) {
      const action = this.buttonConfig().doAction?.();
      if (action) {
        this.sendAction.emit(() => action);
      }
    }
  }
  static \u0275fac = function SharedButtonUiComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SharedButtonUiComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SharedButtonUiComponent, selectors: [["plastik-shared-button"]], inputs: { buttonConfig: [1, "buttonConfig"] }, outputs: { sendAction: "sendAction" }, decls: 4, vars: 2, consts: [["content", ""], ["matButton", "", 3, "class", "disabled", "matTooltip"], ["target", "_blank", "rel", "noopener noreferrer", 1, "block", 3, "matTooltip", "href"], ["matButton", "", 3, "click", "disabled", "matTooltip"], [4, "ngTemplateOutlet"], [3, "src", "svgClass"]], template: function SharedButtonUiComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275conditionalCreate(0, SharedButtonUiComponent_Conditional_0_Template, 2, 7, "button", 1);
      \u0275\u0275conditionalCreate(1, SharedButtonUiComponent_Conditional_1_Template, 2, 5, "a", 2);
      \u0275\u0275template(2, SharedButtonUiComponent_ng_template_2_Template, 2, 0, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
    }
    if (rf & 2) {
      \u0275\u0275conditional(ctx.buttonConfig().type === "button" ? 0 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.buttonConfig().type === "link" ? 1 : -1);
    }
  }, dependencies: [
    NgTemplateOutlet,
    MatButtonModule,
    MatButton,
    MatTooltipModule,
    MatTooltip,
    AngularSvgIconModule,
    SvgIconComponent,
    PushPipe,
    ReturnAsObservablePipe
  ], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SharedButtonUiComponent, [{
    type: Component,
    args: [{ selector: "plastik-shared-button", imports: [
      NgTemplateOutlet,
      PushPipe,
      MatButtonModule,
      MatTooltipModule,
      AngularSvgIconModule,
      ReturnAsObservablePipe
    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `@if (buttonConfig().type === 'button') {
  <button
    matButton
    [class]="\`button--rounded \${buttonConfig().classes || ''}\`"
    [disabled]="buttonConfig().disabled"
    [attr.aria-label]="buttonConfig().ariaLabel"
    [matTooltip]="buttonConfig().tooltip || buttonConfig().ariaLabel"
    [attr.data-test]="buttonConfig().dataTestId"
    (click)="onClick()">
    <ng-container *ngTemplateOutlet="content"></ng-container>
  </button>
}

@if (buttonConfig().type === 'link') {
  <a
    class="block"
    target="_blank"
    rel="noopener noreferrer"
    [attr.aria-label]="buttonConfig().ariaLabel"
    [matTooltip]="buttonConfig().tooltip || buttonConfig().ariaLabel"
    [href]="linkHref()"
    [attr.data-test]="buttonConfig().dataTestId">
    <ng-container *ngTemplateOutlet="content">button content</ng-container>
  </a>
}

<ng-template #content>
  @for (element of buttonConfig().elements; track $index) {
    @if (element.type === 'text') {
      <span>{{ element.content | returnAsObservable | ngrxPush }}</span>
    }
    @if (element.type === 'icon') {
      <svg-icon
        [src]="(element.content | returnAsObservable | ngrxPush)?.iconPath || ''"
        [svgClass]="(element.content | returnAsObservable | ngrxPush)?.svgClass || ''"></svg-icon>
    }
  }
</ng-template>
` }]
  }], null, { buttonConfig: [{ type: Input, args: [{ isSignal: true, alias: "buttonConfig", required: true }] }], sendAction: [{ type: Output, args: ["sendAction"] }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SharedButtonUiComponent, { className: "SharedButtonUiComponent", filePath: "libs/shared/button/ui/src/lib/shared-button-ui/shared-button-ui.component.ts", lineNumber: 24 });
})();
export {
  SharedButtonUiComponent
};
//# sourceMappingURL=src-7N6YNU56.js.map
