import {
  HttpClient
} from "./chunk-RKC3QLXD.js";
import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  ElementRef,
  Injectable,
  InjectionToken,
  KeyValueDiffers,
  NgModule,
  Optional,
  Renderer2,
  SkipSelf,
  catchError,
  effect,
  inject,
  input,
  makeEnvironmentProviders,
  map,
  of,
  setClassMetadata,
  share,
  signal,
  tap,
  throwError,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject,
  ɵɵprojection,
  ɵɵprojectionDef
} from "./chunk-DCCM2HE6.js";

// node_modules/angular-svg-icon/fesm2022/angular-svg-icon.mjs
var _c0 = ["*"];
var SvgLoader = class {
};
var _SvgHttpLoader = class _SvgHttpLoader extends SvgLoader {
  constructor(http) {
    super();
    this.http = http;
  }
  getSvg(url) {
    return this.http.get(url, {
      responseType: "text"
    });
  }
};
_SvgHttpLoader.\u0275fac = function SvgHttpLoader_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SvgHttpLoader)(\u0275\u0275inject(HttpClient));
};
_SvgHttpLoader.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _SvgHttpLoader,
  factory: _SvgHttpLoader.\u0275fac
});
var SvgHttpLoader = _SvgHttpLoader;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SvgHttpLoader, [{
    type: Injectable
  }], () => [{
    type: HttpClient
  }], null);
})();
var SERVER_URL = new InjectionToken("SERVER_URL");
var _SvgIconRegistryService = class _SvgIconRegistryService {
  constructor() {
    this.loader = inject(SvgLoader);
    this.serverUrl = inject(SERVER_URL, {
      optional: true
    });
    this.document = inject(DOCUMENT);
    this.iconsByUrl = /* @__PURE__ */ new Map();
    this.iconsLoadingByUrl = /* @__PURE__ */ new Map();
  }
  /** Add a SVG to the registry by passing a name and the SVG. */
  addSvg(name, data) {
    if (!this.iconsByUrl.has(name)) {
      const div = this.document.createElement("DIV");
      div.innerHTML = data;
      const svg = div.querySelector("svg");
      this.iconsByUrl.set(name, svg);
    }
  }
  /** Load a SVG to the registry from a URL. */
  loadSvg(url, name = url) {
    if (this.serverUrl && url.match(/^(http(s)?):/) === null) {
      url = this.serverUrl + url;
      name = url;
    }
    if (this.iconsByUrl.has(name)) {
      return of(this.iconsByUrl.get(name));
    } else if (this.iconsLoadingByUrl.has(name)) {
      return this.iconsLoadingByUrl.get(name);
    }
    const o = this.loader.getSvg(url).pipe(map((svg) => {
      const div = this.document.createElement("DIV");
      div.innerHTML = svg;
      return div.querySelector("svg");
    }), tap((svg) => {
      this.iconsByUrl.set(name, svg);
      this.iconsLoadingByUrl.delete(name);
    }), catchError((err) => {
      console.error(err);
      return throwError(err);
    }), share());
    this.iconsLoadingByUrl.set(name, o);
    return o;
  }
  /** Get loaded SVG from registry by name. (also works by url because of blended map) */
  getSvgByName(name) {
    if (this.iconsByUrl.has(name)) {
      return of(this.iconsByUrl.get(name));
    } else if (this.iconsLoadingByUrl.has(name)) {
      return this.iconsLoadingByUrl.get(name);
    }
    return throwError(`No svg with name '${name}' has been loaded`);
  }
  /** Remove a SVG from the registry by URL (or name). */
  unloadSvg(url) {
    if (this.iconsByUrl.has(url)) {
      this.iconsByUrl.delete(url);
    }
  }
};
_SvgIconRegistryService.\u0275fac = function SvgIconRegistryService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SvgIconRegistryService)();
};
_SvgIconRegistryService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _SvgIconRegistryService,
  factory: _SvgIconRegistryService.\u0275fac
});
var SvgIconRegistryService = _SvgIconRegistryService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SvgIconRegistryService, [{
    type: Injectable
  }], null, null);
})();
function SVG_ICON_REGISTRY_PROVIDER_FACTORY(parentRegistry) {
  return parentRegistry || new SvgIconRegistryService();
}
var SVG_ICON_REGISTRY_PROVIDER = {
  provide: SvgIconRegistryService,
  deps: [[new Optional(), new SkipSelf(), SvgIconRegistryService]],
  useFactory: SVG_ICON_REGISTRY_PROVIDER_FACTORY
};
var SvgIconHelper = class {
  constructor() {
    this.loaded = false;
  }
};
var _SvgIconComponent = class _SvgIconComponent {
  constructor() {
    this.element = inject(ElementRef);
    this.differs = inject(KeyValueDiffers);
    this.renderer = inject(Renderer2);
    this.iconReg = inject(SvgIconRegistryService);
    this.src = input();
    this.name = input();
    this.stretch = input(false);
    this.applyClass = input(false);
    this.svgClass = input();
    this.klass = input(void 0, {
      alias: "class"
    });
    this.viewBox = input();
    this.svgAriaLabel = input();
    this.onSVGLoaded = input();
    this.svg = signal(0);
    this.svgStyle = input();
    this.helper = new SvgIconHelper();
    effect(() => {
      if (this.src() || this.name()) {
        this.destroy();
        this.init(this.src(), this.name());
      }
    });
    effect(() => {
      const viewBox = this.viewBox();
      if (!this.svg()) return;
      this.updateViewBox(viewBox);
    });
    effect(() => {
      const values = this.svgStyle() || {};
      if (!this.svg()) return;
      this.applyChanges(this.helper.differ.diff(values));
    });
    effect(() => {
      const _ = this.svg();
      if (this.applyClass()) {
        this.setClass(this.elemSvg, null, this.klass());
      } else {
        this.setClass(this.elemSvg, this.klass(), null);
      }
    });
    let previousSvgClass;
    effect(() => {
      const _ = this.svg();
      this.setClass(this.elemSvg, previousSvgClass, this.svgClass());
      previousSvgClass = this.svgClass();
    });
    let previousKlass;
    effect(() => {
      const _ = this.svg();
      const elem = this.element.nativeElement;
      this.setClass(elem, previousKlass, this.klass());
      this.setClass(this.elemSvg, previousKlass, this.applyClass() ? this.klass() : null);
      previousKlass = this.klass();
    });
    effect(() => {
      const _ = this.svg();
      this.doAria(this.svgAriaLabel());
    });
    effect(() => {
      const _ = this.svg();
      this.stylize(this.stretch());
    });
  }
  ngOnDestroy() {
    this.destroy();
  }
  get elemSvg() {
    return this.element.nativeElement.firstChild;
  }
  init(src, name) {
    if (src && name) {
      const svgObs = this.iconReg.loadSvg(src, name);
      if (svgObs) {
        this.helper.icnSub = svgObs.subscribe((svg) => this.initSvg(svg));
      }
    } else if (name) {
      const svgObs = this.iconReg.getSvgByName(name);
      if (svgObs) {
        this.helper.icnSub = svgObs.subscribe((svg) => this.initSvg(svg));
      }
    } else if (src) {
      const svgObs = this.iconReg.loadSvg(src);
      if (svgObs) {
        this.helper.icnSub = svgObs.subscribe((svg) => this.initSvg(svg));
      }
    } else {
      this.element.nativeElement.innerHTML = "";
      this.svg.set(0);
    }
  }
  initSvg(svg) {
    if (!this.helper.loaded && svg) {
      this.setSvg(svg);
    }
  }
  destroy() {
    this.helper.icnSub?.unsubscribe();
    this.helper = new SvgIconHelper();
    this.helper.differ = this.differs.find({}).create();
  }
  setSvg(svg) {
    if (!this.helper.loaded && svg) {
      this.helper.svg = svg;
      let icon = svg.cloneNode(true);
      const elem = this.element.nativeElement;
      const onLoadCallback = this?.onSVGLoaded();
      if (onLoadCallback) {
        icon = onLoadCallback(icon, elem);
      }
      elem.innerHTML = "";
      this.renderer.appendChild(elem, icon);
      this.helper.loaded = true;
      this.copyNgContentAttribute(elem, icon);
      this.svg.update((x) => x + 1);
    }
  }
  updateViewBox(viewBox) {
    if (viewBox) {
      const icon = this.elemSvg;
      if (viewBox === "auto") {
        const w = icon.getAttribute("width");
        const h = icon.getAttribute("height");
        if (h && w) {
          const vb = `0 0 ${w} ${h}`;
          this.renderer.setAttribute(icon, "viewBox", vb);
          this.renderer.removeAttribute(icon, "width");
          this.renderer.removeAttribute(icon, "height");
        }
      } else if (viewBox !== "") {
        this.renderer.setAttribute(icon, "viewBox", viewBox);
        this.renderer.removeAttribute(icon, "width");
        this.renderer.removeAttribute(icon, "height");
      }
    }
  }
  copyNgContentAttribute(hostElem, icon) {
    const attributes = hostElem.attributes;
    const len = attributes.length;
    for (let i = 0; i < len; i += 1) {
      const attribute = attributes.item(i);
      if (attribute && attribute.name.startsWith("_ngcontent")) {
        this.setNgContentAttribute(icon, attribute.name);
        break;
      }
    }
  }
  setNgContentAttribute(parent, attributeName) {
    this.renderer.setAttribute(parent, attributeName, "");
    const len = parent.childNodes.length;
    for (let i = 0; i < len; i += 1) {
      const child = parent.childNodes[i];
      if (child instanceof Element) {
        this.setNgContentAttribute(child, attributeName);
      }
    }
  }
  stylize(stretch) {
    if (this.helper.svg) {
      const svg = this.element.nativeElement.firstChild;
      if (stretch === true) {
        this.renderer.setAttribute(svg, "preserveAspectRatio", "none");
      } else if (stretch === false) {
        this.renderer.removeAttribute(svg, "preserveAspectRatio");
      }
    }
  }
  applyChanges(changes) {
    if (!changes) return;
    changes.forEachRemovedItem((record) => this.setStyle(record.key, null));
    changes.forEachAddedItem((record) => this.setStyle(record.key, record.currentValue));
    changes.forEachChangedItem((record) => this.setStyle(record.key, record.currentValue));
  }
  setStyle(nameAndUnit, value) {
    const [name, unit] = nameAndUnit.split(".");
    value = value !== null && unit ? `${value}${unit}` : value;
    const svg = this.elemSvg;
    if (value !== null) {
      this.renderer.setStyle(svg, name, value);
    } else {
      this.renderer.removeStyle(svg, name);
    }
  }
  setClass(target, previous, current) {
    if (target) {
      if (previous) {
        const klasses = (Array.isArray(previous) ? previous : previous.split(" ")).filter((klass) => klass);
        for (const k of klasses) {
          this.renderer.removeClass(target, k);
        }
      }
      if (current) {
        const klasses = (Array.isArray(current) ? current : current.split(" ")).filter((klass) => klass);
        for (const k of klasses) {
          this.renderer.addClass(target, k);
        }
      }
    }
  }
  doAria(label) {
    if (label !== void 0) {
      const svg = this.element.nativeElement.firstChild;
      if (svg && !svg.hasAttribute("aria-label")) {
        if (label === "") {
          this.renderer.setAttribute(svg, "aria-hidden", "true");
          this.renderer.removeAttribute(svg, "aria-label");
        } else {
          this.renderer.removeAttribute(svg, "aria-hidden");
          this.renderer.setAttribute(svg, "aria-label", label);
        }
      }
    }
  }
};
_SvgIconComponent.\u0275fac = function SvgIconComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SvgIconComponent)();
};
_SvgIconComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
  type: _SvgIconComponent,
  selectors: [["svg-icon"]],
  inputs: {
    src: [1, "src"],
    name: [1, "name"],
    stretch: [1, "stretch"],
    applyClass: [1, "applyClass"],
    svgClass: [1, "svgClass"],
    klass: [1, "class", "klass"],
    viewBox: [1, "viewBox"],
    svgAriaLabel: [1, "svgAriaLabel"],
    onSVGLoaded: [1, "onSVGLoaded"],
    svgStyle: [1, "svgStyle"]
  },
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function SvgIconComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275projectionDef();
      \u0275\u0275projection(0);
    }
  },
  encapsulation: 2,
  changeDetection: 0
});
var SvgIconComponent = _SvgIconComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SvgIconComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "svg-icon",
      template: "<ng-content></ng-content>",
      changeDetection: ChangeDetectionStrategy.OnPush
    }]
  }], () => [], null);
})();
function provideAngularSvgIcon(config = {}) {
  return makeEnvironmentProviders([SVG_ICON_REGISTRY_PROVIDER, config.loader || {
    provide: SvgLoader,
    useClass: SvgHttpLoader
  }]);
}
var _AngularSvgIconModule = class _AngularSvgIconModule {
  static forRoot(config = {}) {
    return {
      ngModule: _AngularSvgIconModule,
      providers: [SVG_ICON_REGISTRY_PROVIDER, config.loader || {
        provide: SvgLoader,
        useClass: SvgHttpLoader
      }]
    };
  }
};
_AngularSvgIconModule.\u0275fac = function AngularSvgIconModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AngularSvgIconModule)();
};
_AngularSvgIconModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _AngularSvgIconModule,
  imports: [SvgIconComponent],
  exports: [SvgIconComponent]
});
_AngularSvgIconModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
var AngularSvgIconModule = _AngularSvgIconModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AngularSvgIconModule, [{
    type: NgModule,
    args: [{
      imports: [SvgIconComponent],
      exports: [SvgIconComponent]
    }]
  }], null, null);
})();

export {
  SvgIconComponent,
  provideAngularSvgIcon,
  AngularSvgIconModule
};
//# sourceMappingURL=chunk-JWATPOZI.js.map
