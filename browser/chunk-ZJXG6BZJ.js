import {
  signalStore,
  updateState,
  withDevToolsStub,
  withDevtools,
  withImmutableState,
  withMethods
} from "./chunk-LNCGLYCJ.js";
import {
  Injectable,
  InjectionToken,
  Injector,
  __objRest,
  __spreadProps,
  __spreadValues,
  inject,
  isDevMode,
  setClassMetadata,
  ɵɵdefineInjectable
} from "./chunk-2OB7EGFP.js";

// libs/shared/notification/data-access/src/lib/+state/notification.store.ts
var initialState = {
  configuration: null,
  preserveOnRouteRequest: false
};
var notificationStore = signalStore({ providedIn: "root" }, isDevMode() ? withDevtools("notification") : withDevToolsStub("notification"), withImmutableState(initialState), withMethods((store) => ({
  show: (configuration, preserveOnRouteRequest) => {
    updateState(store, `[notification] show`, {
      configuration,
      preserveOnRouteRequest: preserveOnRouteRequest ?? false
    });
  },
  dismiss: () => {
    updateState(store, `[notification] dismiss`, {
      configuration: null,
      preserveOnRouteRequest: false
    });
  }
})));

// libs/shared/notification/entities/src/notification-config.ts
var defaultNotification = {
  ["ERROR"]: {
    type: "ERROR",
    icon: "cancel",
    action: "close",
    ariaLabel: "Close error notification",
    duration: void 0
  },
  ["WARNING"]: {
    type: "WARNING",
    icon: "warning",
    duration: 5e3
  },
  ["INFO"]: {
    type: "INFO",
    icon: "info",
    duration: 5e3
  },
  ["SUCCESS"]: {
    type: "SUCCESS",
    icon: "check",
    duration: 5e3
  }
};
var NOTIFICATION_TYPES_CONFIG = new InjectionToken("notification", {
  providedIn: "root",
  factory: () => defaultNotification
});

// libs/shared/notification/data-access/src/lib/services/notification-config.service.ts
var NotificationConfigService = class _NotificationConfigService {
  #notification = null;
  #notificationTypesConfig = inject(NOTIFICATION_TYPES_CONFIG);
  removeInstance() {
    this.#notification = null;
  }
  /**
   * @description Returns a valid configuration of object for ui messages.
   * it returns an angular material Snackbar MatSnackBarConfig class configuration.
   * @param { Partial<Notification> } notification The control configuration to format the object property value.
   * @param  { string } notification.message The content of the message to notify.
   * @returns { Notification } A notification object.
   */
  getInstance(_a = {}) {
    var _b = _a, { type = "ERROR", message = "" } = _b, extras = __objRest(_b, ["type", "message"]);
    this.removeInstance();
    this.#notification = __spreadProps(__spreadValues(__spreadValues({}, this.#notificationTypesConfig[type]), extras), {
      type,
      message
    });
    return this.#notification;
  }
  static \u0275fac = function NotificationConfigService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NotificationConfigService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NotificationConfigService, factory: _NotificationConfigService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NotificationConfigService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// libs/shared/notification/data-access/src/lib/services/error-handler.service.ts
var ErrorHandlerService = class _ErrorHandlerService {
  notificationService = inject(NotificationConfigService);
  injector = inject(Injector);
  handleError(error) {
    const store = this.injector.get(notificationStore);
    let message = "";
    if (error instanceof ErrorEvent || error instanceof Error) {
      message = error?.message.includes("ChunkLoadError") ? error.message.split(".")[0] : error.message;
    } else {
      message = error;
    }
    store.show(this.notificationService.getInstance({
      type: "ERROR",
      message,
      action: "tancar"
    }));
  }
  static \u0275fac = function ErrorHandlerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ErrorHandlerService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ErrorHandlerService, factory: _ErrorHandlerService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorHandlerService, [{
    type: Injectable
  }], null, null);
})();

export {
  notificationStore,
  NotificationConfigService
};
//# sourceMappingURL=chunk-ZJXG6BZJ.js.map
