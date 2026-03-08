import {
  RouterFacade,
  VIEW_CONFIG
} from "./chunk-LNCGLYCJ.js";
import {
  Injectable,
  inject,
  map,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-2OB7EGFP.js";

// libs/nasa-images/data-access/src/nasa-images.facade.ts
var NasaImagesFacade = class _NasaImagesFacade extends RouterFacade {
  sidenavConfig = inject(VIEW_CONFIG);
  routeInfo$ = this.routeName$.pipe(map((name) => this.sidenavConfig()?.find((routeData) => routeData.name === name)));
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275NasaImagesFacade_BaseFactory;
    return function NasaImagesFacade_Factory(__ngFactoryType__) {
      return (\u0275NasaImagesFacade_BaseFactory || (\u0275NasaImagesFacade_BaseFactory = \u0275\u0275getInheritedFactory(_NasaImagesFacade)))(__ngFactoryType__ || _NasaImagesFacade);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NasaImagesFacade, factory: _NasaImagesFacade.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NasaImagesFacade, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

export {
  NasaImagesFacade
};
//# sourceMappingURL=chunk-4II2UPBO.js.map
