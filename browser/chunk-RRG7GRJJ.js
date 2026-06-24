import {
  signalStore,
  updateState,
  withDevToolsStub,
  withDevtools,
  withImmutableState,
  withMethods
} from "./chunk-VKWDWRWG.js";
import {
  LiveAnnouncer
} from "./chunk-O5T33GSN.js";
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
} from "./chunk-BYTVJWX3.js";

// libs/shared/notification/entities/src/notification-config.ts
var defaultNotification = {
  ["ERROR"]: {
    type: "ERROR",
    icon: "error",
    action: "close",
    duration: 5e3
  },
  ["WARNING"]: {
    type: "WARNING",
    icon: "warning",
    duration: 5e3
  },
  ["INFO"]: {
    type: "INFO",
    icon: "info",
    duration: 3e3
  },
  ["SUCCESS"]: {
    type: "SUCCESS",
    icon: "check",
    action: "close",
    duration: 2e3
  }
};
var NOTIFICATION_TYPES_CONFIG = new InjectionToken("notification", {
  providedIn: "root",
  factory: () => defaultNotification
});
var NOTIFICATION_POSITION = new InjectionToken("notificationPosition", {
  providedIn: "root",
  factory: () => ({
    verticalPosition: "bottom",
    horizontalPosition: "center"
  })
});
var DEFAULT_NOTIFICATION_MAX_CONCURRENT = 3;
var NOTIFICATION_MAX_CONCURRENT = new InjectionToken("notificationMaxConcurrent", {
  providedIn: "root",
  factory: () => DEFAULT_NOTIFICATION_MAX_CONCURRENT
});
function provideNotificationConfig(config = {}) {
  const providers = [];
  if (config.types) {
    providers.push({ provide: NOTIFICATION_TYPES_CONFIG, useValue: config.types });
  }
  if (config.position) {
    providers.push({ provide: NOTIFICATION_POSITION, useValue: config.position });
  }
  if (config.maxConcurrent != null) {
    providers.push({ provide: NOTIFICATION_MAX_CONCURRENT, useValue: config.maxConcurrent });
  }
  return providers;
}

// libs/shared/notification/data-access/src/lib/+state/notification.store.ts
var initialState = {
  configuration: [],
  preserveOnRouteRequest: false
};
var notificationStore = signalStore({ providedIn: "root" }, isDevMode() ? withDevtools("notification") : withDevToolsStub("notification"), withImmutableState(initialState), withMethods((store) => {
  const maxConcurrent = inject(NOTIFICATION_MAX_CONCURRENT);
  let seq = 0;
  return {
    show: (notification, options) => {
      const current = store.configuration();
      const { groupKey } = notification;
      const existingIndex = groupKey ? current.findIndex((item) => item.groupKey === groupKey) : -1;
      let configuration;
      if (existingIndex !== -1 && existingIndex === current.length - 1 && current[existingIndex].type === notification.type) {
        const next = __spreadProps(__spreadValues({}, notification), { id: current[existingIndex].id });
        configuration = current.map((item, i) => i === existingIndex ? next : item);
      } else {
        const next = __spreadProps(__spreadValues({}, notification), { id: `#${++seq}` });
        const base = groupKey ? current.filter((item) => item.groupKey !== groupKey) : current;
        configuration = [...base, next];
        if (configuration.length > maxConcurrent) {
          configuration = configuration.slice(-maxConcurrent);
        }
      }
      updateState(store, `[notification] show`, {
        configuration,
        preserveOnRouteRequest: options?.preserveOnRouteRequest ?? false
      });
    },
    dismiss: (id) => {
      if (id == null) {
        updateState(store, `[notification] dismiss`, initialState);
        return;
      }
      updateState(store, `[notification] dismiss ${id}`, (state) => __spreadProps(__spreadValues({}, state), {
        configuration: state.configuration.filter((item) => item.id !== id)
      }));
    }
  };
}));

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
  #notificationService = inject(NotificationConfigService);
  #injector = inject(Injector);
  handleError(error) {
    const store = this.#injector.get(notificationStore);
    let message = "";
    if (typeof ErrorEvent !== "undefined" && error instanceof ErrorEvent || error instanceof Error) {
      message = error?.message.includes("ChunkLoadError") ? error.message.split(".")[0] : error.message;
    } else {
      message = typeof error === "string" ? error : String(error);
    }
    store.show(this.#notificationService.getInstance({
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

// libs/shared/notification/data-access/src/lib/services/store-notification.service.ts
var StoreNotificationService = class _StoreNotificationService {
  #notificationService = inject(NotificationConfigService);
  #notificationStore = inject(notificationStore);
  #liveAnnouncer = inject(LiveAnnouncer);
  // `options` precedes `parameters` because most callers set behaviour (e.g. groupKey) but only a
  // few pass translation/render parameters, so this keeps the common call sites free of `undefined`.
  create(message, type, options, parameters) {
    this.#notificationStore.show(this.#notificationService.getInstance(__spreadValues({
      message,
      type,
      parameters,
      groupKey: options?.groupKey
    }, options?.duration != null ? { duration: options.duration } : {})), { preserveOnRouteRequest: options?.preserve ?? true });
    this.#liveAnnouncer.announce(message, "assertive", 1e3);
  }
  static \u0275fac = function StoreNotificationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StoreNotificationService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _StoreNotificationService, factory: _StoreNotificationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StoreNotificationService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

export {
  provideNotificationConfig,
  notificationStore,
  NotificationConfigService
};
//# sourceMappingURL=chunk-RRG7GRJJ.js.map
