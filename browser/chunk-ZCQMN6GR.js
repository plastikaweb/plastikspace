import {
  ACTIVE_RUNTIME_CHECKS,
  FEATURE_STATE_PROVIDER,
  ROOT_STORE_PROVIDER,
  ScannedActionsSubject,
  Store,
  StoreFeatureModule,
  StoreModule,
  StoreRootModule,
  createAction,
  createActionGroup,
  createFeature,
  createFeatureSelector,
  createReducer,
  createSelector,
  emptyProps,
  isNgrxMockEnvironment,
  on,
  props,
  select
} from "./chunk-T2PSTRDY.js";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RoutesRecognized,
  TitleStrategy
} from "./chunk-PU5SFPLZ.js";
import {
  _ViewRepeaterOperation
} from "./chunk-B7ZO4ZH7.js";
import {
  Title
} from "./chunk-GIDPJBNA.js";
import {
  Location,
  isPlatformBrowser
} from "./chunk-L4ELV5TK.js";
import {
  DestroyRef,
  EMPTY,
  ErrorHandler,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  Observable,
  Optional,
  PLATFORM_ID,
  Subject,
  __privateAdd,
  __privateGet,
  __privateSet,
  __privateWrapper,
  __spreadProps,
  __spreadValues,
  assertInInjectionContext,
  catchError,
  computed,
  concatMap,
  dematerialize,
  effect,
  exhaustMap,
  filter,
  groupBy,
  ignoreElements,
  inject,
  isDevMode,
  isSignal,
  makeEnvironmentProviders,
  map,
  materialize,
  merge,
  mergeMap,
  of,
  pipe,
  provideEnvironmentInitializer,
  setClassMetadata,
  signal,
  take,
  tap,
  untracked,
  withLatestFrom,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵgetInheritedFactory,
  ɵɵinject
} from "./chunk-6A74M7E5.js";

// libs/core/cms-layout/entities/src/core-cms-layout-header-config.ts
var CORE_CMS_LAYOUT_HEADER_CONFIG = new InjectionToken("CORE_CMS_LAYOUT_HEADER_CONFIG");

// node_modules/@ngrx/signals/fesm2022/ngrx-signals.mjs
var DEEP_SIGNAL = Symbol("DEEP_SIGNAL");
function toDeepSignal(signal2) {
  return new Proxy(signal2, {
    has(target, prop) {
      return !!this.get(target, prop, void 0);
    },
    get(target, prop) {
      const value = untracked(target);
      if (!isRecord(value) || !(prop in value)) {
        if (isSignal(target[prop]) && target[prop][DEEP_SIGNAL]) {
          delete target[prop];
        }
        return target[prop];
      }
      if (!isSignal(target[prop])) {
        Object.defineProperty(target, prop, {
          value: computed(() => target()[prop]),
          configurable: true
        });
        target[prop][DEEP_SIGNAL] = true;
      }
      return toDeepSignal(target[prop]);
    }
  });
}
var nonRecords = [WeakSet, WeakMap, Promise, Date, Error, RegExp, ArrayBuffer, DataView, Function];
function isRecord(value) {
  if (value === null || typeof value !== "object" || isIterable(value)) {
    return false;
  }
  let proto = Object.getPrototypeOf(value);
  if (proto === Object.prototype) {
    return true;
  }
  while (proto && proto !== Object.prototype) {
    if (nonRecords.includes(proto.constructor)) {
      return false;
    }
    proto = Object.getPrototypeOf(proto);
  }
  return proto === Object.prototype;
}
function isIterable(value) {
  return typeof value?.[Symbol.iterator] === "function";
}
var STATE_WATCHERS = /* @__PURE__ */ new WeakMap();
var STATE_SOURCE = Symbol("STATE_SOURCE");
function patchState(stateSource, ...updaters) {
  const currentState = untracked(() => getState(stateSource));
  const newState = updaters.reduce((nextState, updater) => __spreadValues(__spreadValues({}, nextState), typeof updater === "function" ? updater(nextState) : updater), currentState);
  const signals = stateSource[STATE_SOURCE];
  const stateKeys = Reflect.ownKeys(stateSource[STATE_SOURCE]);
  for (const key of Reflect.ownKeys(newState)) {
    if (stateKeys.includes(key)) {
      const signalKey = key;
      if (currentState[signalKey] !== newState[signalKey]) {
        signals[signalKey].set(newState[signalKey]);
      }
    } else if (typeof ngDevMode !== "undefined" && ngDevMode) {
      console.warn(`@ngrx/signals: patchState was called with an unknown state slice '${String(key)}'.`, "Ensure that all state properties are explicitly defined in the initial state.", "Updates to properties not present in the initial state will be ignored.");
    }
  }
  notifyWatchers(stateSource);
}
function getState(stateSource) {
  const signals = stateSource[STATE_SOURCE];
  return Reflect.ownKeys(stateSource[STATE_SOURCE]).reduce((state, key) => {
    const value = signals[key]();
    return __spreadProps(__spreadValues({}, state), {
      [key]: value
    });
  }, {});
}
function watchState(stateSource, watcher, config) {
  if (typeof ngDevMode !== "undefined" && ngDevMode && !config?.injector) {
    assertInInjectionContext(watchState);
  }
  const injector2 = config?.injector ?? inject(Injector);
  const destroyRef = injector2.get(DestroyRef);
  addWatcher(stateSource, watcher);
  watcher(getState(stateSource));
  const destroy = () => removeWatcher(stateSource, watcher);
  destroyRef.onDestroy(destroy);
  return {
    destroy
  };
}
function getWatchers(stateSource) {
  return STATE_WATCHERS.get(stateSource[STATE_SOURCE]) || [];
}
function notifyWatchers(stateSource) {
  const watchers = getWatchers(stateSource);
  for (const watcher of watchers) {
    const state = untracked(() => getState(stateSource));
    watcher(state);
  }
}
function addWatcher(stateSource, watcher) {
  const watchers = getWatchers(stateSource);
  STATE_WATCHERS.set(stateSource[STATE_SOURCE], [...watchers, watcher]);
}
function removeWatcher(stateSource, watcher) {
  const watchers = getWatchers(stateSource);
  STATE_WATCHERS.set(stateSource[STATE_SOURCE], watchers.filter((w) => w !== watcher));
}
function signalStore(...args) {
  const signalStoreArgs = [...args];
  const config = typeof signalStoreArgs[0] === "function" ? {} : signalStoreArgs.shift();
  const features = signalStoreArgs;
  class SignalStore {
    constructor() {
      const innerStore = features.reduce((store, feature) => feature(store), getInitialInnerStore());
      const {
        stateSignals,
        props: props2,
        methods,
        hooks
      } = innerStore;
      const storeMembers = __spreadValues(__spreadValues(__spreadValues({}, stateSignals), props2), methods);
      this[STATE_SOURCE] = innerStore[STATE_SOURCE];
      for (const key of Reflect.ownKeys(storeMembers)) {
        this[key] = storeMembers[key];
      }
      const {
        onInit,
        onDestroy
      } = hooks;
      if (onInit) {
        onInit();
      }
      if (onDestroy) {
        inject(DestroyRef).onDestroy(onDestroy);
      }
    }
    /** @nocollapse */
    static \u0275fac = function SignalStore_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || SignalStore)();
    };
    /** @nocollapse */
    static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: SignalStore,
      factory: SignalStore.\u0275fac,
      providedIn: config.providedIn || null
    });
  }
  (() => {
    (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SignalStore, [{
      type: Injectable,
      args: [{
        providedIn: config.providedIn || null
      }]
    }], () => [], null);
  })();
  return SignalStore;
}
function getInitialInnerStore() {
  return {
    [STATE_SOURCE]: {},
    stateSignals: {},
    props: {},
    methods: {},
    hooks: {}
  };
}
function signalStoreFeature(...args) {
  const features = typeof args[0] === "function" ? args : args.slice(1);
  return (inputStore) => features.reduce((store, feature) => feature(store), inputStore);
}
function assertUniqueStoreMembers(store, newMemberKeys) {
  const storeMembers = __spreadValues(__spreadValues(__spreadValues({}, store.stateSignals), store.props), store.methods);
  const overriddenKeys = Reflect.ownKeys(storeMembers).filter((memberKey) => newMemberKeys.includes(memberKey));
  if (overriddenKeys.length > 0) {
    console.warn("@ngrx/signals: SignalStore members cannot be overridden.", "Trying to override:", overriddenKeys.map((key) => String(key)).join(", "));
  }
}
function withHooks(hooksOrFactory) {
  return (store) => {
    const storeMembers = __spreadValues(__spreadValues(__spreadValues({
      [STATE_SOURCE]: store[STATE_SOURCE]
    }, store.stateSignals), store.props), store.methods);
    const hooks = typeof hooksOrFactory === "function" ? hooksOrFactory(storeMembers) : hooksOrFactory;
    const mergeHooks = (currentHook, hook) => {
      return hook ? () => {
        if (currentHook) {
          currentHook();
        }
        hook(storeMembers);
      } : currentHook;
    };
    return __spreadProps(__spreadValues({}, store), {
      hooks: {
        onInit: mergeHooks(store.hooks.onInit, hooks.onInit),
        onDestroy: mergeHooks(store.hooks.onDestroy, hooks.onDestroy)
      }
    });
  };
}
function withMethods(methodsFactory) {
  return (store) => {
    const methods = methodsFactory(__spreadValues(__spreadValues(__spreadValues({
      [STATE_SOURCE]: store[STATE_SOURCE]
    }, store.stateSignals), store.props), store.methods));
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      assertUniqueStoreMembers(store, Reflect.ownKeys(methods));
    }
    return __spreadProps(__spreadValues({}, store), {
      methods: __spreadValues(__spreadValues({}, store.methods), methods)
    });
  };
}
function withState(stateOrFactory) {
  return (store) => {
    const state = typeof stateOrFactory === "function" ? stateOrFactory() : stateOrFactory;
    const stateKeys = Reflect.ownKeys(state);
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      assertUniqueStoreMembers(store, stateKeys);
    }
    const stateSource = store[STATE_SOURCE];
    const stateSignals = {};
    for (const key of stateKeys) {
      stateSource[key] = signal(state[key]);
      stateSignals[key] = toDeepSignal(stateSource[key]);
    }
    return __spreadProps(__spreadValues({}, store), {
      stateSignals: __spreadValues(__spreadValues({}, store.stateSignals), stateSignals)
    });
  };
}

// node_modules/@angular-architects/ngrx-toolkit/fesm2022/angular-architects-ngrx-toolkit.mjs
var DEVTOOLS_FEATURE = Symbol("DEVTOOLS_FEATURE");
function throwIfNull(obj) {
  if (obj === null || obj === void 0) {
    throw new Error("");
  }
  return obj;
}
var _stores, _callback;
var _GlitchTrackerService = class _GlitchTrackerService {
  constructor() {
    __privateAdd(this, _stores, {});
    __privateAdd(this, _callback);
  }
  get stores() {
    return Object.entries(__privateGet(this, _stores)).reduce((acc, [id, {
      store
    }]) => {
      acc[id] = store;
      return acc;
    }, {});
  }
  onChange(callback) {
    __privateSet(this, _callback, callback);
  }
  removeStore(id) {
    __privateSet(this, _stores, Object.entries(__privateGet(this, _stores)).reduce((newStore, [storeId, value]) => {
      if (storeId !== id) {
        newStore[storeId] = value;
      } else {
        value.destroyWatcher();
      }
      return newStore;
    }, {}));
    throwIfNull(__privateGet(this, _callback))({});
  }
  track(id, store) {
    const watcher = watchState(store, (state) => {
      throwIfNull(__privateGet(this, _callback))({
        [id]: state
      });
    });
    __privateGet(this, _stores)[id] = {
      destroyWatcher: watcher.destroy,
      store
    };
  }
  notifyRenamedStore(id) {
    if (Object.keys(__privateGet(this, _stores)).includes(id) && __privateGet(this, _callback)) {
      __privateGet(this, _callback).call(this, {
        [id]: getState(__privateGet(this, _stores)[id].store)
      });
    }
  }
};
_stores = new WeakMap();
_callback = new WeakMap();
_GlitchTrackerService.\u0275fac = function GlitchTrackerService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _GlitchTrackerService)();
};
_GlitchTrackerService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _GlitchTrackerService,
  factory: _GlitchTrackerService.\u0275fac,
  providedIn: "root"
});
var GlitchTrackerService = _GlitchTrackerService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GlitchTrackerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var REDUX_DEVTOOLS_CONFIG = new InjectionToken("ReduxDevtoolsConfig");
var _stores2, _trackCallback, _trackingEffect;
var _DefaultTracker = class _DefaultTracker {
  constructor() {
    __privateAdd(this, _stores2, signal({}, ...ngDevMode ? [{
      debugName: "#stores"
    }] : []));
    __privateAdd(this, _trackCallback);
    __privateAdd(this, _trackingEffect, effect(() => {
      if (__privateGet(this, _trackCallback) === void 0) {
        throw new Error("no callback function defined");
      }
      const stores = __privateGet(this, _stores2).call(this);
      const fullState = Object.entries(stores).reduce((acc, [id, store]) => {
        return __spreadProps(__spreadValues({}, acc), {
          [id]: getState(store)
        });
      }, {});
      __privateGet(this, _trackCallback).call(this, fullState);
    }, ...ngDevMode ? [{
      debugName: "#trackingEffect"
    }] : []));
  }
  get stores() {
    return __privateGet(this, _stores2).call(this);
  }
  track(id, store) {
    __privateGet(this, _stores2).update((value) => __spreadProps(__spreadValues({}, value), {
      [id]: store
    }));
  }
  onChange(callback) {
    __privateSet(this, _trackCallback, callback);
  }
  removeStore(id) {
    __privateGet(this, _stores2).update((stores) => Object.entries(stores).reduce((newStore, [storeId, state]) => {
      if (storeId !== id) {
        newStore[storeId] = state;
      }
      return newStore;
    }, {}));
  }
  notifyRenamedStore(id) {
    if (__privateGet(this, _stores2).call(this)[id]) {
      __privateGet(this, _stores2).update((stores) => {
        return __spreadValues({}, stores);
      });
    }
  }
};
_stores2 = new WeakMap();
_trackCallback = new WeakMap();
_trackingEffect = new WeakMap();
_DefaultTracker.\u0275fac = function DefaultTracker_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DefaultTracker)();
};
_DefaultTracker.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _DefaultTracker,
  factory: _DefaultTracker.\u0275fac,
  providedIn: "root"
});
var DefaultTracker = _DefaultTracker;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DefaultTracker, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var currentActionNames = /* @__PURE__ */ new Set();
var dummyConnection = {
  send: () => void 0
};
var _stores3, _isBrowser, _trackers, _devtoolsConfig, _currentState, _currentId, _connection;
var _DevtoolsSyncer = class _DevtoolsSyncer {
  constructor() {
    /**
     * Stores all SignalStores that are connected to the
     * DevTools along their options, names and id.
     */
    __privateAdd(this, _stores3, {});
    __privateAdd(this, _isBrowser, isPlatformBrowser(inject(PLATFORM_ID)));
    __privateAdd(this, _trackers, []);
    __privateAdd(this, _devtoolsConfig, __spreadValues({
      name: "NgRx SignalStore"
    }, inject(REDUX_DEVTOOLS_CONFIG, {
      optional: true
    })));
    /**
     * Maintains the current states of all stores to avoid conflicts
     * between glitch-free and glitched trackers when used simultaneously.
     *
     * The challenge lies in ensuring that glitched trackers do not
     * interfere with the synchronization process of glitch-free trackers.
     * Specifically, glitched trackers could cause the synchronization to
     * read the current state of stores managed by glitch-free trackers.
     *
     * Therefore, the synchronization process doesn't read the state from
     * each store, but relies on #currentState.
     *
     * Please note, that here the key is the name and not the id.
     */
    __privateAdd(this, _currentState, {});
    __privateAdd(this, _currentId, 1);
    __privateAdd(this, _connection, inject(NgZone).runOutsideAngular(() => __privateGet(this, _isBrowser) ? window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__.connect(__privateGet(this, _devtoolsConfig)) : dummyConnection : dummyConnection));
    if (!__privateGet(this, _isBrowser)) {
      return;
    }
  }
  ngOnDestroy() {
    currentActionNames.clear();
  }
  syncToDevTools(changedStatePerId) {
    const mappedChangedStatePerName = Object.entries(changedStatePerId).reduce((acc, [id, store]) => {
      const {
        options,
        name: name2
      } = __privateGet(this, _stores3)[id];
      acc[name2] = options.map(store);
      return acc;
    }, {});
    __privateSet(this, _currentState, __spreadValues(__spreadValues({}, __privateGet(this, _currentState)), mappedChangedStatePerName));
    const names = Array.from(currentActionNames);
    const type = names.length ? names.join(", ") : "Store Update";
    currentActionNames.clear();
    __privateGet(this, _connection).send({
      type
    }, __privateGet(this, _currentState));
  }
  getNextId() {
    return String(__privateWrapper(this, _currentId)._++);
  }
  /**
   * Consumer provides the id. That is because we can only start
   * tracking the store in the init hook.
   * Unfortunately, methods for renaming having the final id
   * need to be defined already before.
   * That's why `withDevtools` requests first the id and
   * then registers itself later.
   */
  addStore(id, name2, store, options) {
    let storeName2 = name2;
    const names = Object.values(__privateGet(this, _stores3)).map((store2) => store2.name);
    if (names.includes(storeName2)) {
      if (!options.indexNames) {
        throw new Error(`An instance of the store ${storeName2} already exists. Enable automatic indexing via withDevTools('${storeName2}', { indexNames: true }), or rename it upon instantiation.`);
      }
    }
    for (let i = 1; names.includes(storeName2); i++) {
      storeName2 = `${name2}-${i}`;
    }
    __privateGet(this, _stores3)[id] = {
      name: storeName2,
      options
    };
    const tracker = options.tracker;
    if (!__privateGet(this, _trackers).includes(tracker)) {
      __privateGet(this, _trackers).push(tracker);
    }
    tracker.onChange((changedState) => this.syncToDevTools(changedState));
    tracker.track(id, store);
  }
  removeStore(id) {
    const name2 = __privateGet(this, _stores3)[id].name;
    __privateSet(this, _stores3, Object.entries(__privateGet(this, _stores3)).reduce((newStore, [storeId, value]) => {
      if (storeId !== id) {
        newStore[storeId] = value;
      }
      return newStore;
    }, {}));
    __privateSet(this, _currentState, Object.entries(__privateGet(this, _currentState)).reduce((newState, [storeName2, state]) => {
      if (storeName2 !== name2) {
        newState[storeName2] = state;
      }
      return newState;
    }, {}));
    for (const tracker of __privateGet(this, _trackers)) {
      tracker.removeStore(id);
    }
  }
  /**
   * Renames a store identified by its internal id. If the store has already
   * been removed (e.g. due to component destruction), this is a no-op.
   */
  renameStore(id, newName) {
    const storeEntry = __privateGet(this, _stores3)[id];
    if (!storeEntry) {
      return;
    }
    const oldName = storeEntry.name;
    if (oldName === newName) {
      return;
    }
    const otherStoreNames = Object.entries(__privateGet(this, _stores3)).filter(([entryId]) => entryId !== id).map(([, s]) => s.name);
    if (otherStoreNames.includes(newName)) {
      throw new Error(`NgRx Toolkit/DevTools: cannot rename from ${oldName} to ${newName}. ${newName} is already assigned to another SignalStore instance.`);
    }
    __privateSet(this, _stores3, Object.entries(__privateGet(this, _stores3)).reduce((newStore, [entryId, value]) => {
      if (entryId === id) {
        newStore[entryId] = __spreadProps(__spreadValues({}, value), {
          name: newName
        });
      } else {
        newStore[entryId] = value;
      }
      return newStore;
    }, {}));
    __privateSet(this, _currentState, Object.entries(__privateGet(this, _currentState)).reduce((newState, [storeName2, state]) => {
      if (storeName2 !== oldName) {
        newState[storeName2] = state;
      }
      return newState;
    }, {}));
    __privateGet(this, _trackers).forEach((tracker) => tracker.notifyRenamedStore(id));
  }
};
_stores3 = new WeakMap();
_isBrowser = new WeakMap();
_trackers = new WeakMap();
_devtoolsConfig = new WeakMap();
_currentState = new WeakMap();
_currentId = new WeakMap();
_connection = new WeakMap();
_DevtoolsSyncer.\u0275fac = function DevtoolsSyncer_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DevtoolsSyncer)();
};
_DevtoolsSyncer.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _DevtoolsSyncer,
  factory: _DevtoolsSyncer.\u0275fac,
  providedIn: "root"
});
var DevtoolsSyncer = _DevtoolsSyncer;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DevtoolsSyncer, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var renameDevtoolsMethodName = "___renameDevtoolsName";
var uniqueDevtoolsId = "___uniqueDevtoolsId";
var EXISTING_NAMES = new InjectionToken("Array contain existing names for the signal stores", {
  factory: () => [],
  providedIn: "root"
});
function withDevtools(name2, ...features) {
  return signalStoreFeature(withMethods(() => {
    const syncer = inject(DevtoolsSyncer);
    const id = syncer.getNextId();
    return {
      [renameDevtoolsMethodName]: (newName) => {
        syncer.renameStore(id, newName);
      },
      [uniqueDevtoolsId]: () => id
    };
  }), withHooks((store) => {
    const syncer = inject(DevtoolsSyncer);
    const id = String(store[uniqueDevtoolsId]());
    return {
      onInit() {
        const id2 = String(store[uniqueDevtoolsId]());
        const finalOptions = {
          indexNames: !features.some((f) => f.indexNames === false),
          map: features.find((f) => f.map)?.map ?? ((state) => state),
          tracker: inject(features.find((f) => f.tracker)?.tracker || DefaultTracker)
        };
        syncer.addStore(id2, name2, store, finalOptions);
      },
      onDestroy() {
        syncer.removeStore(id);
      }
    };
  }));
}
function updateState(stateSource, action, ...updaters) {
  currentActionNames.add(action);
  return patchState(stateSource, ...updaters);
}
var keyPath = "ngrxToolkitKeyPath";
var dbName = "ngrxToolkitDb";
var storeName = "ngrxToolkitStore";
var VERSION = 1;
var _IndexedDBService = class _IndexedDBService {
  /**
   * write to indexedDB
   * @param key
   * @param data
   */
  async setItem(key, data) {
    const db = await this.openDB();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    store.put({
      [keyPath]: key,
      value: data
    });
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject();
      };
    });
  }
  /**
   * read from indexedDB
   * @param key
   */
  async getItem(key) {
    const db = await this.openDB();
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.get(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        if (request.result === void 0) {
          resolve(null);
        }
        resolve(request.result?.["value"]);
      };
      request.onerror = () => {
        db.close();
        reject();
      };
    });
  }
  /**
   * delete indexedDB
   * @param key
   */
  async clear(key) {
    const db = await this.openDB();
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.delete(key);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        db.close();
        resolve();
      };
      request.onerror = () => {
        db.close();
        reject();
      };
    });
  }
  /**
   * open indexedDB
   */
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, {
            keyPath
          });
        }
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }
};
_IndexedDBService.\u0275fac = function IndexedDBService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _IndexedDBService)();
};
_IndexedDBService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _IndexedDBService,
  factory: _IndexedDBService.\u0275fac,
  providedIn: "root"
});
var IndexedDBService = _IndexedDBService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IndexedDBService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var SYNC_STATUS = Symbol("SYNC_STATUS");
var _LocalStorageService = class _LocalStorageService {
  getItem(key) {
    return localStorage.getItem(key);
  }
  setItem(key, data) {
    return localStorage.setItem(key, data);
  }
  clear(key) {
    return localStorage.removeItem(key);
  }
};
_LocalStorageService.\u0275fac = function LocalStorageService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _LocalStorageService)();
};
_LocalStorageService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _LocalStorageService,
  factory: _LocalStorageService.\u0275fac,
  providedIn: "root"
});
var LocalStorageService = _LocalStorageService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalStorageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _SessionStorageService = class _SessionStorageService {
  getItem(key) {
    return sessionStorage.getItem(key);
  }
  setItem(key, data) {
    return sessionStorage.setItem(key, data);
  }
  clear(key) {
    return sessionStorage.removeItem(key);
  }
};
_SessionStorageService.\u0275fac = function SessionStorageService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SessionStorageService)();
};
_SessionStorageService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _SessionStorageService,
  factory: _SessionStorageService.\u0275fac,
  providedIn: "root"
});
var SessionStorageService = _SessionStorageService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SessionStorageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var emptyFeature = signalStoreFeature(withState({}));

// libs/shared/activity/data-access/src/lib/+state/activity.store.ts
var activityStore = signalStore({ providedIn: "root" }, withDevtools("activity"), withState({
  isActive: false
}), withMethods((store) => ({
  setActivity(isActive) {
    updateState(store, `[activity] ${isActive ? "on" : "off"}`, { isActive });
  }
})));

// libs/core/cms-layout/data-access/src/lib/core-cms-view-config.ts
var VIEW_CONFIG = new InjectionToken("VIEW_CONFIG");

// node_modules/@ngrx/effects/fesm2022/ngrx-effects.mjs
var DEFAULT_EFFECT_CONFIG = {
  dispatch: true,
  functional: false,
  useEffectsErrorHandler: true
};
var CREATE_EFFECT_METADATA_KEY = "__@ngrx/effects_create__";
function createEffect(source, config = {}) {
  const effect2 = config.functional ? source : source();
  const value = __spreadValues(__spreadValues({}, DEFAULT_EFFECT_CONFIG), config);
  Object.defineProperty(effect2, CREATE_EFFECT_METADATA_KEY, {
    value
  });
  return effect2;
}
function getCreateEffectMetadata(instance) {
  const propertyNames = Object.getOwnPropertyNames(instance);
  const metadata = propertyNames.filter((propertyName) => {
    if (instance[propertyName] && instance[propertyName].hasOwnProperty(CREATE_EFFECT_METADATA_KEY)) {
      const property = instance[propertyName];
      return property[CREATE_EFFECT_METADATA_KEY].hasOwnProperty("dispatch");
    }
    return false;
  }).map((propertyName) => {
    const metaData = instance[propertyName][CREATE_EFFECT_METADATA_KEY];
    return __spreadValues({
      propertyName
    }, metaData);
  });
  return metadata;
}
function getSourceMetadata(instance) {
  return getCreateEffectMetadata(instance);
}
function getSourceForInstance(instance) {
  return Object.getPrototypeOf(instance);
}
function isClassInstance(obj) {
  return !!obj.constructor && obj.constructor.name !== "Object" && obj.constructor.name !== "Function";
}
function isClass(classOrRecord) {
  return typeof classOrRecord === "function";
}
function getClasses(classesAndRecords) {
  return classesAndRecords.filter(isClass);
}
function isToken(tokenOrRecord) {
  return tokenOrRecord instanceof InjectionToken || isClass(tokenOrRecord);
}
function mergeEffects(sourceInstance, globalErrorHandler, effectsErrorHandler) {
  const source = getSourceForInstance(sourceInstance);
  const isClassBasedEffect = !!source && source.constructor.name !== "Object";
  const sourceName = isClassBasedEffect ? source.constructor.name : null;
  const observables$ = getSourceMetadata(sourceInstance).map(({
    propertyName,
    dispatch,
    useEffectsErrorHandler
  }) => {
    const observable$ = typeof sourceInstance[propertyName] === "function" ? sourceInstance[propertyName]() : sourceInstance[propertyName];
    const effectAction$ = useEffectsErrorHandler ? effectsErrorHandler(observable$, globalErrorHandler) : observable$;
    if (dispatch === false) {
      return effectAction$.pipe(ignoreElements());
    }
    const materialized$ = effectAction$.pipe(materialize());
    return materialized$.pipe(map((notification) => ({
      effect: sourceInstance[propertyName],
      notification,
      propertyName,
      sourceName,
      sourceInstance
    })));
  });
  return merge(...observables$);
}
var MAX_NUMBER_OF_RETRY_ATTEMPTS = 10;
function defaultEffectsErrorHandler(observable$, errorHandler, retryAttemptLeft = MAX_NUMBER_OF_RETRY_ATTEMPTS) {
  return observable$.pipe(catchError((error) => {
    if (errorHandler) errorHandler.handleError(error);
    if (retryAttemptLeft <= 1) {
      return observable$;
    }
    return defaultEffectsErrorHandler(observable$, errorHandler, retryAttemptLeft - 1);
  }));
}
var _Actions = class _Actions extends Observable {
  constructor(source) {
    super();
    if (source) {
      this.source = source;
    }
  }
  lift(operator) {
    const observable = new _Actions();
    observable.source = this;
    observable.operator = operator;
    return observable;
  }
};
_Actions.\u0275fac = function Actions_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _Actions)(\u0275\u0275inject(ScannedActionsSubject));
};
_Actions.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _Actions,
  factory: _Actions.\u0275fac,
  providedIn: "root"
});
var Actions = _Actions;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Actions, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Observable,
    decorators: [{
      type: Inject,
      args: [ScannedActionsSubject]
    }]
  }], null);
})();
function ofType(...allowedTypes) {
  return filter((action) => allowedTypes.some((typeOrActionCreator) => {
    if (typeof typeOrActionCreator === "string") {
      return typeOrActionCreator === action.type;
    }
    return typeOrActionCreator.type === action.type;
  }));
}
var _ROOT_EFFECTS_GUARD = new InjectionToken("@ngrx/effects Internal Root Guard");
var USER_PROVIDED_EFFECTS = new InjectionToken("@ngrx/effects User Provided Effects");
var _ROOT_EFFECTS = new InjectionToken("@ngrx/effects Internal Root Effects");
var _ROOT_EFFECTS_INSTANCES = new InjectionToken("@ngrx/effects Internal Root Effects Instances");
var _FEATURE_EFFECTS = new InjectionToken("@ngrx/effects Internal Feature Effects");
var _FEATURE_EFFECTS_INSTANCE_GROUPS = new InjectionToken("@ngrx/effects Internal Feature Effects Instance Groups");
var EFFECTS_ERROR_HANDLER = new InjectionToken("@ngrx/effects Effects Error Handler", {
  providedIn: "root",
  factory: () => defaultEffectsErrorHandler
});
var ROOT_EFFECTS_INIT = "@ngrx/effects/init";
var rootEffectsInit = createAction(ROOT_EFFECTS_INIT);
function reportInvalidActions(output, reporter) {
  if (output.notification.kind === "N") {
    const action = output.notification.value;
    const isInvalidAction = !isAction(action);
    if (isInvalidAction) {
      reporter.handleError(new Error(`Effect ${getEffectName(output)} dispatched an invalid action: ${stringify(action)}`));
    }
  }
}
function isAction(action) {
  return typeof action !== "function" && action && action.type && typeof action.type === "string";
}
function getEffectName({
  propertyName,
  sourceInstance,
  sourceName
}) {
  const isMethod = typeof sourceInstance[propertyName] === "function";
  const isClassBasedEffect = !!sourceName;
  return isClassBasedEffect ? `"${sourceName}.${String(propertyName)}${isMethod ? "()" : ""}"` : `"${String(propertyName)}()"`;
}
function stringify(action) {
  try {
    return JSON.stringify(action);
  } catch {
    return action;
  }
}
var onIdentifyEffectsKey = "ngrxOnIdentifyEffects";
function isOnIdentifyEffects(instance) {
  return isFunction(instance, onIdentifyEffectsKey);
}
var onRunEffectsKey = "ngrxOnRunEffects";
function isOnRunEffects(instance) {
  return isFunction(instance, onRunEffectsKey);
}
var onInitEffects = "ngrxOnInitEffects";
function isOnInitEffects(instance) {
  return isFunction(instance, onInitEffects);
}
function isFunction(instance, functionName) {
  return instance && functionName in instance && typeof instance[functionName] === "function";
}
var _EffectSources = class _EffectSources extends Subject {
  constructor(errorHandler, effectsErrorHandler) {
    super();
    this.errorHandler = errorHandler;
    this.effectsErrorHandler = effectsErrorHandler;
  }
  addEffects(effectSourceInstance) {
    this.next(effectSourceInstance);
  }
  /**
   * @internal
   */
  toActions() {
    return this.pipe(groupBy((effectsInstance2) => isClassInstance(effectsInstance2) ? getSourceForInstance(effectsInstance2) : effectsInstance2), mergeMap((source$) => {
      return source$.pipe(groupBy(effectsInstance));
    }), mergeMap((source$) => {
      const effect$ = source$.pipe(exhaustMap((sourceInstance) => {
        return resolveEffectSource(this.errorHandler, this.effectsErrorHandler)(sourceInstance);
      }), map((output) => {
        reportInvalidActions(output, this.errorHandler);
        return output.notification;
      }), filter((notification) => notification.kind === "N" && notification.value != null), dematerialize());
      const init$ = source$.pipe(take(1), filter(isOnInitEffects), map((instance) => instance.ngrxOnInitEffects()));
      return merge(effect$, init$);
    }));
  }
};
_EffectSources.\u0275fac = function EffectSources_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _EffectSources)(\u0275\u0275inject(ErrorHandler), \u0275\u0275inject(EFFECTS_ERROR_HANDLER));
};
_EffectSources.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _EffectSources,
  factory: _EffectSources.\u0275fac,
  providedIn: "root"
});
var EffectSources = _EffectSources;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EffectSources, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: ErrorHandler
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [EFFECTS_ERROR_HANDLER]
    }]
  }], null);
})();
function effectsInstance(sourceInstance) {
  if (isOnIdentifyEffects(sourceInstance)) {
    return sourceInstance.ngrxOnIdentifyEffects();
  }
  return "";
}
function resolveEffectSource(errorHandler, effectsErrorHandler) {
  return (sourceInstance) => {
    const mergedEffects$ = mergeEffects(sourceInstance, errorHandler, effectsErrorHandler);
    if (isOnRunEffects(sourceInstance)) {
      return sourceInstance.ngrxOnRunEffects(mergedEffects$);
    }
    return mergedEffects$;
  };
}
var _EffectsRunner = class _EffectsRunner {
  get isStarted() {
    return !!this.effectsSubscription;
  }
  constructor(effectSources, store) {
    this.effectSources = effectSources;
    this.store = store;
    this.effectsSubscription = null;
  }
  start() {
    if (!this.effectsSubscription) {
      this.effectsSubscription = this.effectSources.toActions().subscribe(this.store);
    }
  }
  ngOnDestroy() {
    if (this.effectsSubscription) {
      this.effectsSubscription.unsubscribe();
      this.effectsSubscription = null;
    }
  }
};
_EffectsRunner.\u0275fac = function EffectsRunner_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _EffectsRunner)(\u0275\u0275inject(EffectSources), \u0275\u0275inject(Store));
};
_EffectsRunner.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _EffectsRunner,
  factory: _EffectsRunner.\u0275fac,
  providedIn: "root"
});
var EffectsRunner = _EffectsRunner;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EffectsRunner, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: EffectSources
  }, {
    type: Store
  }], null);
})();
var _EffectsRootModule = class _EffectsRootModule {
  constructor(sources, runner, store, rootEffectsInstances, storeRootModule, storeFeatureModule, guard) {
    this.sources = sources;
    runner.start();
    for (const effectsInstance2 of rootEffectsInstances) {
      sources.addEffects(effectsInstance2);
    }
    store.dispatch({
      type: ROOT_EFFECTS_INIT
    });
  }
  addEffects(effectsInstance2) {
    this.sources.addEffects(effectsInstance2);
  }
};
_EffectsRootModule.\u0275fac = function EffectsRootModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _EffectsRootModule)(\u0275\u0275inject(EffectSources), \u0275\u0275inject(EffectsRunner), \u0275\u0275inject(Store), \u0275\u0275inject(_ROOT_EFFECTS_INSTANCES), \u0275\u0275inject(StoreRootModule, 8), \u0275\u0275inject(StoreFeatureModule, 8), \u0275\u0275inject(_ROOT_EFFECTS_GUARD, 8));
};
_EffectsRootModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _EffectsRootModule
});
_EffectsRootModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
var EffectsRootModule = _EffectsRootModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EffectsRootModule, [{
    type: NgModule,
    args: [{}]
  }], () => [{
    type: EffectSources
  }, {
    type: EffectsRunner
  }, {
    type: Store
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [_ROOT_EFFECTS_INSTANCES]
    }]
  }, {
    type: StoreRootModule,
    decorators: [{
      type: Optional
    }]
  }, {
    type: StoreFeatureModule,
    decorators: [{
      type: Optional
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [_ROOT_EFFECTS_GUARD]
    }]
  }], null);
})();
var _EffectsFeatureModule = class _EffectsFeatureModule {
  constructor(effectsRootModule, effectsInstanceGroups, storeRootModule, storeFeatureModule) {
    const effectsInstances = effectsInstanceGroups.flat();
    for (const effectsInstance2 of effectsInstances) {
      effectsRootModule.addEffects(effectsInstance2);
    }
  }
};
_EffectsFeatureModule.\u0275fac = function EffectsFeatureModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _EffectsFeatureModule)(\u0275\u0275inject(EffectsRootModule), \u0275\u0275inject(_FEATURE_EFFECTS_INSTANCE_GROUPS), \u0275\u0275inject(StoreRootModule, 8), \u0275\u0275inject(StoreFeatureModule, 8));
};
_EffectsFeatureModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _EffectsFeatureModule
});
_EffectsFeatureModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
var EffectsFeatureModule = _EffectsFeatureModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EffectsFeatureModule, [{
    type: NgModule,
    args: [{}]
  }], () => [{
    type: EffectsRootModule
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [_FEATURE_EFFECTS_INSTANCE_GROUPS]
    }]
  }, {
    type: StoreRootModule,
    decorators: [{
      type: Optional
    }]
  }, {
    type: StoreFeatureModule,
    decorators: [{
      type: Optional
    }]
  }], null);
})();
var _EffectsModule = class _EffectsModule {
  static forFeature(...featureEffects) {
    const effects = featureEffects.flat();
    const effectsClasses = getClasses(effects);
    return {
      ngModule: EffectsFeatureModule,
      providers: [effectsClasses, {
        provide: _FEATURE_EFFECTS,
        multi: true,
        useValue: effects
      }, {
        provide: USER_PROVIDED_EFFECTS,
        multi: true,
        useValue: []
      }, {
        provide: _FEATURE_EFFECTS_INSTANCE_GROUPS,
        multi: true,
        useFactory: createEffectsInstances,
        deps: [_FEATURE_EFFECTS, USER_PROVIDED_EFFECTS]
      }]
    };
  }
  static forRoot(...rootEffects) {
    const effects = rootEffects.flat();
    const effectsClasses = getClasses(effects);
    return {
      ngModule: EffectsRootModule,
      providers: [effectsClasses, {
        provide: _ROOT_EFFECTS,
        useValue: [effects]
      }, {
        provide: _ROOT_EFFECTS_GUARD,
        useFactory: _provideForRootGuard
      }, {
        provide: USER_PROVIDED_EFFECTS,
        multi: true,
        useValue: []
      }, {
        provide: _ROOT_EFFECTS_INSTANCES,
        useFactory: createEffectsInstances,
        deps: [_ROOT_EFFECTS, USER_PROVIDED_EFFECTS]
      }]
    };
  }
};
_EffectsModule.\u0275fac = function EffectsModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _EffectsModule)();
};
_EffectsModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _EffectsModule
});
_EffectsModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
var EffectsModule = _EffectsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EffectsModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();
function createEffectsInstances(effectsGroups, userProvidedEffectsGroups) {
  const effects = [];
  for (const effectsGroup of effectsGroups) {
    effects.push(...effectsGroup);
  }
  for (const userProvidedEffectsGroup of userProvidedEffectsGroups) {
    effects.push(...userProvidedEffectsGroup);
  }
  return effects.map((effectsTokenOrRecord) => isToken(effectsTokenOrRecord) ? inject(effectsTokenOrRecord) : effectsTokenOrRecord);
}
function _provideForRootGuard() {
  const runner = inject(EffectsRunner, {
    optional: true,
    skipSelf: true
  });
  const rootEffects = inject(_ROOT_EFFECTS, {
    self: true
  });
  const hasEffects = !(rootEffects.length === 1 && rootEffects[0].length === 0);
  if (hasEffects && runner) {
    throw new TypeError(`EffectsModule.forRoot() called twice. Feature modules should use EffectsModule.forFeature() instead.`);
  }
  return "guarded";
}
function provideEffects(...effects) {
  const effectsClassesAndRecords = effects.flat();
  const effectsClasses = getClasses(effectsClassesAndRecords);
  return makeEnvironmentProviders([effectsClasses, provideEnvironmentInitializer(() => {
    inject(ROOT_STORE_PROVIDER);
    inject(FEATURE_STATE_PROVIDER, {
      optional: true
    });
    const effectsRunner = inject(EffectsRunner);
    const effectSources = inject(EffectSources);
    const shouldInitEffects = !effectsRunner.isStarted;
    if (shouldInitEffects) {
      effectsRunner.start();
    }
    for (const effectsClassOrRecord of effectsClassesAndRecords) {
      const effectsInstance2 = isClass(effectsClassOrRecord) ? inject(effectsClassOrRecord) : effectsClassOrRecord;
      effectSources.addEffects(effectsInstance2);
    }
    if (shouldInitEffects) {
      const store = inject(Store);
      store.dispatch(rootEffectsInit());
    }
  })]);
}

// node_modules/@ngrx/router-store/fesm2022/ngrx-router-store.mjs
var ROUTER_REQUEST = "@ngrx/router-store/request";
var routerRequestAction = createAction(ROUTER_REQUEST, props());
var ROUTER_NAVIGATION = "@ngrx/router-store/navigation";
var routerNavigationAction = createAction(ROUTER_NAVIGATION, props());
var ROUTER_CANCEL = "@ngrx/router-store/cancel";
var routerCancelAction = createAction(ROUTER_CANCEL, props());
var ROUTER_ERROR = "@ngrx/router-store/error";
var routerErrorAction = createAction(ROUTER_ERROR, props());
var ROUTER_NAVIGATED = "@ngrx/router-store/navigated";
var routerNavigatedAction = createAction(ROUTER_NAVIGATED, props());
function routerReducer(state, action) {
  const routerAction = action;
  switch (routerAction.type) {
    case ROUTER_NAVIGATION:
    case ROUTER_ERROR:
    case ROUTER_CANCEL:
      return {
        state: routerAction.payload.routerState,
        navigationId: routerAction.payload.event.id
      };
    default:
      return state;
  }
}
var MinimalRouterStateSerializer = class {
  serialize(routerState) {
    return {
      root: this.serializeRoute(routerState.root),
      url: routerState.url
    };
  }
  serializeRoute(route) {
    const children = route.children.map((c) => this.serializeRoute(c));
    return {
      params: route.params,
      data: route.data,
      url: route.url,
      outlet: route.outlet,
      title: route.title,
      routeConfig: route.routeConfig ? {
        path: route.routeConfig.path,
        pathMatch: route.routeConfig.pathMatch,
        redirectTo: route.routeConfig.redirectTo,
        outlet: route.routeConfig.outlet,
        title: typeof route.routeConfig.title === "string" ? route.routeConfig.title : void 0
      } : null,
      queryParams: route.queryParams,
      fragment: route.fragment,
      firstChild: children[0],
      children
    };
  }
};
var NavigationActionTiming;
(function(NavigationActionTiming2) {
  NavigationActionTiming2[NavigationActionTiming2["PreActivation"] = 1] = "PreActivation";
  NavigationActionTiming2[NavigationActionTiming2["PostActivation"] = 2] = "PostActivation";
})(NavigationActionTiming || (NavigationActionTiming = {}));
var DEFAULT_ROUTER_FEATURENAME = "router";
var _ROUTER_CONFIG = new InjectionToken("@ngrx/router-store Internal Configuration");
var ROUTER_CONFIG = new InjectionToken("@ngrx/router-store Configuration");
var RouterState;
(function(RouterState2) {
  RouterState2[RouterState2["Full"] = 0] = "Full";
  RouterState2[RouterState2["Minimal"] = 1] = "Minimal";
})(RouterState || (RouterState = {}));
function _createRouterConfig(config) {
  return __spreadValues({
    stateKey: DEFAULT_ROUTER_FEATURENAME,
    serializer: MinimalRouterStateSerializer,
    navigationActionTiming: NavigationActionTiming.PreActivation
  }, config);
}
var FullRouterStateSerializer = class {
  serialize(routerState) {
    return {
      root: this.serializeRoute(routerState.root),
      url: routerState.url
    };
  }
  serializeRoute(route) {
    const children = route.children.map((c) => this.serializeRoute(c));
    return {
      params: route.params,
      paramMap: route.paramMap,
      data: route.data,
      url: route.url,
      outlet: route.outlet,
      title: route.title,
      routeConfig: route.routeConfig ? {
        component: route.routeConfig.component,
        path: route.routeConfig.path,
        pathMatch: route.routeConfig.pathMatch,
        redirectTo: route.routeConfig.redirectTo,
        outlet: route.routeConfig.outlet,
        title: route.routeConfig.title
      } : null,
      queryParams: route.queryParams,
      queryParamMap: route.queryParamMap,
      fragment: route.fragment,
      component: route.routeConfig ? route.routeConfig.component : void 0,
      root: void 0,
      parent: void 0,
      firstChild: children[0],
      pathFromRoot: void 0,
      children
    };
  }
};
var RouterStateSerializer = class {
};
var RouterTrigger;
(function(RouterTrigger2) {
  RouterTrigger2[RouterTrigger2["NONE"] = 1] = "NONE";
  RouterTrigger2[RouterTrigger2["ROUTER"] = 2] = "ROUTER";
  RouterTrigger2[RouterTrigger2["STORE"] = 3] = "STORE";
})(RouterTrigger || (RouterTrigger = {}));
var _StoreRouterConnectingService = class _StoreRouterConnectingService {
  constructor(store, router, serializer, errorHandler, config, activeRuntimeChecks) {
    this.store = store;
    this.router = router;
    this.serializer = serializer;
    this.errorHandler = errorHandler;
    this.config = config;
    this.activeRuntimeChecks = activeRuntimeChecks;
    this.lastEvent = null;
    this.routerState = null;
    this.trigger = RouterTrigger.NONE;
    this.stateKey = this.config.stateKey;
    if (!isNgrxMockEnvironment() && isDevMode() && (activeRuntimeChecks?.strictActionSerializability || activeRuntimeChecks?.strictStateSerializability) && this.serializer instanceof FullRouterStateSerializer) {
      console.warn("@ngrx/router-store: The serializability runtime checks cannot be enabled with the FullRouterStateSerializer. The FullRouterStateSerializer has an unserializable router state and actions that are not serializable. To use the serializability runtime checks either use the MinimalRouterStateSerializer or implement a custom router state serializer.");
    }
    this.setUpStoreStateListener();
    this.setUpRouterEventsListener();
  }
  setUpStoreStateListener() {
    this.store.pipe(select(this.stateKey), withLatestFrom(this.store)).subscribe(([routerStoreState, storeState]) => {
      this.navigateIfNeeded(routerStoreState, storeState);
    });
  }
  navigateIfNeeded(routerStoreState, storeState) {
    if (!routerStoreState || !routerStoreState.state) {
      return;
    }
    if (this.trigger === RouterTrigger.ROUTER) {
      return;
    }
    if (this.lastEvent instanceof NavigationStart) {
      return;
    }
    const url = routerStoreState.state.url;
    if (!isSameUrl(this.router.url, url)) {
      this.storeState = storeState;
      this.trigger = RouterTrigger.STORE;
      this.router.navigateByUrl(url).catch((error) => {
        this.errorHandler.handleError(error);
      });
    }
  }
  setUpRouterEventsListener() {
    const dispatchNavLate = this.config.navigationActionTiming === NavigationActionTiming.PostActivation;
    let routesRecognized;
    this.router.events.pipe(withLatestFrom(this.store)).subscribe(([event, storeState]) => {
      this.lastEvent = event;
      if (event instanceof NavigationStart) {
        this.routerState = this.serializer.serialize(this.router.routerState.snapshot);
        if (this.trigger !== RouterTrigger.STORE) {
          this.storeState = storeState;
          this.dispatchRouterRequest(event);
        }
      } else if (event instanceof RoutesRecognized) {
        routesRecognized = event;
        if (!dispatchNavLate && this.trigger !== RouterTrigger.STORE) {
          this.dispatchRouterNavigation(event);
        }
      } else if (event instanceof NavigationCancel) {
        this.dispatchRouterCancel(event);
        this.reset();
      } else if (event instanceof NavigationError) {
        this.dispatchRouterError(event);
        this.reset();
      } else if (event instanceof NavigationEnd) {
        if (this.trigger !== RouterTrigger.STORE) {
          if (dispatchNavLate) {
            this.dispatchRouterNavigation(routesRecognized);
          }
          this.dispatchRouterNavigated(event);
        }
        this.reset();
      }
    });
  }
  dispatchRouterRequest(event) {
    this.dispatchRouterAction(ROUTER_REQUEST, {
      event
    });
  }
  dispatchRouterNavigation(lastRoutesRecognized) {
    const nextRouterState = this.serializer.serialize(lastRoutesRecognized.state);
    this.dispatchRouterAction(ROUTER_NAVIGATION, {
      routerState: nextRouterState,
      event: new RoutesRecognized(lastRoutesRecognized.id, lastRoutesRecognized.url, lastRoutesRecognized.urlAfterRedirects, nextRouterState)
    });
  }
  dispatchRouterCancel(event) {
    this.dispatchRouterAction(ROUTER_CANCEL, {
      storeState: this.storeState,
      event
    });
  }
  dispatchRouterError(event) {
    this.dispatchRouterAction(ROUTER_ERROR, {
      storeState: this.storeState,
      event: new NavigationError(event.id, event.url, `${event}`)
    });
  }
  dispatchRouterNavigated(event) {
    const routerState = this.serializer.serialize(this.router.routerState.snapshot);
    this.dispatchRouterAction(ROUTER_NAVIGATED, {
      event,
      routerState
    });
  }
  dispatchRouterAction(type, payload) {
    this.trigger = RouterTrigger.ROUTER;
    try {
      this.store.dispatch({
        type,
        payload: __spreadProps(__spreadValues({
          routerState: this.routerState
        }, payload), {
          event: this.config.routerState === RouterState.Full ? payload.event : {
            id: payload.event.id,
            url: payload.event.url,
            // safe, as it will just be `undefined` for non-NavigationEnd router events
            urlAfterRedirects: payload.event.urlAfterRedirects
          }
        })
      });
    } finally {
      this.trigger = RouterTrigger.NONE;
    }
  }
  reset() {
    this.trigger = RouterTrigger.NONE;
    this.storeState = null;
    this.routerState = null;
  }
};
_StoreRouterConnectingService.\u0275fac = function StoreRouterConnectingService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _StoreRouterConnectingService)(\u0275\u0275inject(Store), \u0275\u0275inject(Router), \u0275\u0275inject(RouterStateSerializer), \u0275\u0275inject(ErrorHandler), \u0275\u0275inject(ROUTER_CONFIG), \u0275\u0275inject(ACTIVE_RUNTIME_CHECKS));
};
_StoreRouterConnectingService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: _StoreRouterConnectingService,
  factory: _StoreRouterConnectingService.\u0275fac
});
var StoreRouterConnectingService = _StoreRouterConnectingService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StoreRouterConnectingService, [{
    type: Injectable
  }], () => [{
    type: Store
  }, {
    type: Router
  }, {
    type: RouterStateSerializer
  }, {
    type: ErrorHandler
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [ROUTER_CONFIG]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [ACTIVE_RUNTIME_CHECKS]
    }]
  }], null);
})();
function isSameUrl(first, second) {
  return stripTrailingSlash(first) === stripTrailingSlash(second);
}
function stripTrailingSlash(text) {
  if (text?.length > 0 && text[text.length - 1] === "/") {
    return text.substring(0, text.length - 1);
  }
  return text;
}
function provideRouterStore(config = {}) {
  return makeEnvironmentProviders([{
    provide: _ROUTER_CONFIG,
    useValue: config
  }, {
    provide: ROUTER_CONFIG,
    useFactory: _createRouterConfig,
    deps: [_ROUTER_CONFIG]
  }, {
    provide: RouterStateSerializer,
    useClass: config.serializer ? config.serializer : config.routerState === RouterState.Full ? FullRouterStateSerializer : MinimalRouterStateSerializer
  }, provideEnvironmentInitializer(() => inject(StoreRouterConnectingService)), StoreRouterConnectingService]);
}
var _StoreRouterConnectingModule = class _StoreRouterConnectingModule {
  static forRoot(config = {}) {
    return {
      ngModule: _StoreRouterConnectingModule,
      providers: [provideRouterStore(config)]
    };
  }
};
_StoreRouterConnectingModule.\u0275fac = function StoreRouterConnectingModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _StoreRouterConnectingModule)();
};
_StoreRouterConnectingModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: _StoreRouterConnectingModule
});
_StoreRouterConnectingModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
var StoreRouterConnectingModule = _StoreRouterConnectingModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StoreRouterConnectingModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();

// node_modules/@ngrx/operators/fesm2022/ngrx-operators.mjs
function concatLatestFrom(observablesFactory) {
  return concatMap((value) => {
    const observables = observablesFactory(value);
    const observablesAsArray = Array.isArray(observables) ? observables : [observables];
    return of(value).pipe(withLatestFrom(...observablesAsArray));
  });
}

// libs/core/cms-layout/data-access/src/lib/+state/layout.actions.ts
var layoutActions = createActionGroup({
  source: "Layout",
  events: {
    "Set Is Mobile": props(),
    "Toggle Sidenav": props()
  }
});

// libs/core/cms-layout/data-access/src/lib/+state/layout.feature.ts
var LAYOUT_FEATURE_KEY = "layout";
var initialState = {
  isMobile: false,
  sidenavOpened: true
};
var selectLayoutFeature = createFeature({
  name: LAYOUT_FEATURE_KEY,
  reducer: createReducer(initialState, on(layoutActions.setIsMobile, (state, { isMobile }) => __spreadProps(__spreadValues({}, state), {
    isMobile
  })), on(layoutActions.toggleSidenav, (state, { opened }) => __spreadProps(__spreadValues({}, state), {
    sidenavOpened: opened ?? !state.sidenavOpened
  })))
});
var { name, reducer, selectIsMobile, selectSidenavOpened } = selectLayoutFeature;

// libs/core/cms-layout/data-access/src/lib/+state/layout.effects.ts
var LayoutEffects = class _LayoutEffects {
  #actions$ = inject(Actions);
  #store = inject(Store);
  routerRequest$ = createEffect(() => {
    return this.#actions$.pipe(ofType(ROUTER_NAVIGATION), concatLatestFrom(() => [
      this.#store.select(selectSidenavOpened),
      this.#store.select(selectIsMobile)
    ]), filter(([, sideBarVisibility, isMobile]) => sideBarVisibility && isMobile), map(() => layoutActions.toggleSidenav({ opened: false })));
  });
  static \u0275fac = function LayoutEffects_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutEffects)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LayoutEffects, factory: _LayoutEffects.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutEffects, [{
    type: Injectable
  }], null, null);
})();

// libs/core/cms-layout/data-access/src/lib/core-cms-layout-data-access.module.ts
var CoreCmsLayoutDataAccessModule = class _CoreCmsLayoutDataAccessModule {
  static \u0275fac = function CoreCmsLayoutDataAccessModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CoreCmsLayoutDataAccessModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({ type: _CoreCmsLayoutDataAccessModule });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({ imports: [StoreModule.forFeature(selectLayoutFeature), EffectsModule.forFeature([LayoutEffects])] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CoreCmsLayoutDataAccessModule, [{
    type: NgModule,
    args: [{
      imports: [StoreModule.forFeature(selectLayoutFeature), EffectsModule.forFeature([LayoutEffects])]
    }]
  }], null, null);
})();

// libs/core/cms-layout/data-access/src/lib/+state/layout.facade.ts
var LayoutFacade = class _LayoutFacade {
  #store = inject(Store);
  sidenavConfig = inject(VIEW_CONFIG);
  sidenavOpened$ = this.#store.select(selectSidenavOpened);
  isMobile$ = this.#store.select(selectIsMobile);
  isActive = inject(activityStore).isActive;
  headerConfig = inject(CORE_CMS_LAYOUT_HEADER_CONFIG);
  toggleSidenav(opened) {
    this.#store.dispatch(layoutActions.toggleSidenav({ opened }));
  }
  setIsMobile(isMobile) {
    this.#store.dispatch(layoutActions.setIsMobile({ isMobile }));
  }
  dispatchAction(action) {
    this.#store.dispatch(action());
  }
  static \u0275fac = function LayoutFacade_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutFacade)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LayoutFacade, factory: _LayoutFacade.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutFacade, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// libs/core/util/environments/src/environment.token.ts
var ENVIRONMENT = new InjectionToken("ENVIRONMENT");

// libs/core/router/data-access/src/lib/services/navigation.service.ts
var NavigationService = class _NavigationService {
  #router = inject(Router);
  #location = inject(Location);
  #history = [];
  constructor() {
    this.#router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.#history = [event.urlAfterRedirects, ...this.#history];
      }
    });
  }
  /**
   * @description Navigate to a concrete URL with params and extras if needed.
   * @param { NavigationProps } navigationProps The navigation configuration properties.
   */
  navigate({ path, extras }) {
    this.#router.navigate(path, { queryParams: extras?.queryParams, fragment: extras?.fragment });
  }
  /**
   * @description Go back to previous URL.
   * @param {string} backBaseUrl The default back URL. Use it when we have no navigation history.
   * @param {RegExp} regex An instruction to accomplish when we want to redirect to an specific previous URL that must satisfy the regex pattern.
   */
  back(backBaseUrl, regex) {
    if (this.#history.length && regex) {
      this.#history.shift();
      for (const url of this.#history) {
        if (regex.test(url)) {
          this.#router.navigateByUrl(url);
          return;
        }
      }
    }
    if (backBaseUrl) {
      this.#router.navigateByUrl(backBaseUrl || "/");
    } else {
      this.#location.back();
    }
  }
  static \u0275fac = function NavigationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NavigationService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NavigationService, factory: _NavigationService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavigationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// libs/core/router/data-access/src/lib/+state/actions/router-state.actions.ts
var routerActions = createActionGroup({
  source: "Router",
  events: {
    Go: props(),
    Back: props(),
    Forward: emptyProps()
  }
});

// libs/core/router/data-access/src/lib/+state/effects/router-state.effects.ts
var RouterStateEffects = class _RouterStateEffects {
  #actions$ = inject(Actions);
  #location = inject(Location);
  #navigationService = inject(NavigationService);
  #zone = inject(NgZone);
  navigate$ = createEffect(() => {
    return this.#actions$.pipe(ofType(routerActions.go), tap((action) => this.#navigationService.navigate(action)));
  }, { dispatch: false });
  navigateBack$ = createEffect(() => {
    return this.#actions$.pipe(ofType(routerActions.back), tap(({ url, regex }) => this.#navigationService.back(url, regex)));
  }, { dispatch: false });
  navigateForward$ = createEffect(() => {
    return this.#actions$.pipe(ofType(routerActions.forward), tap(() => this.#location.forward()));
  }, { dispatch: false });
  scrollToTop$ = createEffect(() => {
    return this.#actions$.pipe(ofType(ROUTER_NAVIGATION), tap(() => {
      this.#zone.runOutsideAngular(() => {
        const mainElement = document.getElementById("mainContent");
        mainElement?.scrollTo(0, 0);
      });
    }));
  }, { dispatch: false });
  static \u0275fac = function RouterStateEffects_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouterStateEffects)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RouterStateEffects, factory: _RouterStateEffects.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouterStateEffects, [{
    type: Injectable
  }], null, null);
})();

// libs/core/router/data-access/src/lib/router-state.ts
var ROUTER_STATE_FEATURE_KEY = new InjectionToken("ROUTER_STATE_FEATURE_KEY");
var injector = Injector.create({
  providers: [{ provide: ROUTER_STATE_FEATURE_KEY, useValue: "router" }]
});
var routerKey = injector.get(ROUTER_STATE_FEATURE_KEY);

// libs/core/router/data-access/src/lib/+state/reducer/router-state.reducer.ts
var routerReducers = {
  [routerKey]: routerReducer
};
var CustomRouterSerializer = class {
  serialize(routerState) {
    let route = routerState.root;
    const params = {};
    while (route.firstChild) {
      route = route.firstChild;
      Object.keys(route.params).forEach((key) => params[key] = route.params?.[key]);
    }
    const { url, root: { queryParams } } = routerState;
    const { data } = route;
    return {
      url,
      params,
      queryParams,
      data
    };
  }
};

// libs/core/router/data-access/src/lib/services/prefix-title.service.ts
var PrefixTitleService = class _PrefixTitleService extends TitleStrategy {
  #title = inject(Title);
  #environment = inject(ENVIRONMENT);
  /**
   * @description Update page title with the environment app name.
   * @param {RouterStateSnapshot} snapshot The state of the router at a moment in time.
   */
  updateTitle(snapshot) {
    const title = this.buildTitle(snapshot);
    this.#title.setTitle(!title ? `${this.#environment.name}` : `${this.#environment.name} - ${title}`);
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275PrefixTitleService_BaseFactory;
    return function PrefixTitleService_Factory(__ngFactoryType__) {
      return (\u0275PrefixTitleService_BaseFactory || (\u0275PrefixTitleService_BaseFactory = \u0275\u0275getInheritedFactory(_PrefixTitleService)))(__ngFactoryType__ || _PrefixTitleService);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _PrefixTitleService, factory: _PrefixTitleService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PrefixTitleService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// libs/core/router/data-access/src/lib/+state/selectors/router-state.selectors.ts
var selectRouteFeatureState = createFeatureSelector(routerKey);
var selectRouteQueryParams = createSelector(selectRouteFeatureState, (state) => state?.state?.queryParams);
var selectRouteUrl = createSelector(selectRouteFeatureState, (state) => state?.state?.url);
var selectRouteParams = createSelector(selectRouteFeatureState, (state) => state?.state?.params);
var selectRouteData = createSelector(selectRouteFeatureState, (state) => state?.state?.data);
var selectRouteDataName = createSelector(selectRouteData, (data) => data?.["name"]);

// libs/core/router/data-access/src/lib/+state/router.facade.ts
var RouterFacade = class _RouterFacade {
  store = inject(Store);
  routeName$ = this.store.select(selectRouteDataName);
  routeUrl$ = this.store.select(selectRouteUrl);
  routeQueryParams$ = this.store.select(selectRouteQueryParams);
  static \u0275fac = function RouterFacade_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _RouterFacade)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _RouterFacade, factory: _RouterFacade.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RouterFacade, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// libs/core/router/data-access/src/lib/services/navigation-filter.service.ts
var NavigationFilterService = class _NavigationFilterService {
  store = inject(Store);
  /**
   * @description Checks if the selected view matches the route on ROUTER_NAVIGATION.
   * @param {string} view The current view/route name.
   * @returns {UnaryFunction<Observable<Action>, Observable<[RouterNavigationAction<SerializedRouterStateSnapshot>, unknown]>>}.
   */
  checkRouterNavigation(view) {
    return pipe(ofType(ROUTER_NAVIGATION), concatLatestFrom(() => this.store.select(selectRouteDataName)), filter(([, name2]) => name2 === view), map(() => EMPTY));
  }
  static \u0275fac = function NavigationFilterService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NavigationFilterService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _NavigationFilterService, factory: _NavigationFilterService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavigationFilterService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// libs/nasa-images/data-access/src/nasa-images.facade.ts
var NasaImagesFacade = class _NasaImagesFacade extends RouterFacade {
  sidenavConfig = inject(VIEW_CONFIG);
  routeInfo$ = this.routeName$.pipe(map((name2) => this.sidenavConfig()?.find((routeData) => routeData.name === name2)));
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

// node_modules/@angular/cdk/fesm2022/unique-selection-dispatcher.mjs
var UniqueSelectionDispatcher = class _UniqueSelectionDispatcher {
  _listeners = [];
  /**
   * Notify other items that selection for the given name has been set.
   * @param id ID of the item.
   * @param name Name of the item.
   */
  notify(id, name2) {
    for (let listener of this._listeners) {
      listener(id, name2);
    }
  }
  /**
   * Listen for future changes to item selection.
   * @return Function used to deregister listener
   */
  listen(listener) {
    this._listeners.push(listener);
    return () => {
      this._listeners = this._listeners.filter((registered) => {
        return listener !== registered;
      });
    };
  }
  ngOnDestroy() {
    this._listeners = [];
  }
  static \u0275fac = function UniqueSelectionDispatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UniqueSelectionDispatcher)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _UniqueSelectionDispatcher,
    factory: _UniqueSelectionDispatcher.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UniqueSelectionDispatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// node_modules/@angular/cdk/fesm2022/dispose-view-repeater-strategy.mjs
var _DisposeViewRepeaterStrategy = class {
  applyChanges(changes, viewContainerRef, itemContextFactory, itemValueResolver, itemViewChanged) {
    changes.forEachOperation((record, adjustedPreviousIndex, currentIndex) => {
      let view;
      let operation;
      if (record.previousIndex == null) {
        const insertContext = itemContextFactory(record, adjustedPreviousIndex, currentIndex);
        view = viewContainerRef.createEmbeddedView(insertContext.templateRef, insertContext.context, insertContext.index);
        operation = _ViewRepeaterOperation.INSERTED;
      } else if (currentIndex == null) {
        viewContainerRef.remove(adjustedPreviousIndex);
        operation = _ViewRepeaterOperation.REMOVED;
      } else {
        view = viewContainerRef.get(adjustedPreviousIndex);
        viewContainerRef.move(view, currentIndex);
        operation = _ViewRepeaterOperation.MOVED;
      }
      if (itemViewChanged) {
        itemViewChanged({
          context: view?.context,
          operation,
          record
        });
      }
    });
  }
  detach() {
  }
};

// node_modules/@angular/cdk/fesm2022/selection-model.mjs
var SelectionModel = class {
  _multiple;
  _emitChanges;
  compareWith;
  /** Currently-selected values. */
  _selection = /* @__PURE__ */ new Set();
  /** Keeps track of the deselected options that haven't been emitted by the change event. */
  _deselectedToEmit = [];
  /** Keeps track of the selected options that haven't been emitted by the change event. */
  _selectedToEmit = [];
  /** Cache for the array value of the selected items. */
  _selected;
  /** Selected values. */
  get selected() {
    if (!this._selected) {
      this._selected = Array.from(this._selection.values());
    }
    return this._selected;
  }
  /** Event emitted when the value has changed. */
  changed = new Subject();
  constructor(_multiple = false, initiallySelectedValues, _emitChanges = true, compareWith) {
    this._multiple = _multiple;
    this._emitChanges = _emitChanges;
    this.compareWith = compareWith;
    if (initiallySelectedValues && initiallySelectedValues.length) {
      if (_multiple) {
        initiallySelectedValues.forEach((value) => this._markSelected(value));
      } else {
        this._markSelected(initiallySelectedValues[0]);
      }
      this._selectedToEmit.length = 0;
    }
  }
  /**
   * Selects a value or an array of values.
   * @param values The values to select
   * @return Whether the selection changed as a result of this call
   */
  select(...values) {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._markSelected(value));
    const changed = this._hasQueuedChanges();
    this._emitChangeEvent();
    return changed;
  }
  /**
   * Deselects a value or an array of values.
   * @param values The values to deselect
   * @return Whether the selection changed as a result of this call
   */
  deselect(...values) {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._unmarkSelected(value));
    const changed = this._hasQueuedChanges();
    this._emitChangeEvent();
    return changed;
  }
  /**
   * Sets the selected values
   * @param values The new selected values
   * @return Whether the selection changed as a result of this call
   */
  setSelection(...values) {
    this._verifyValueAssignment(values);
    const oldValues = this.selected;
    const newSelectedSet = new Set(values.map((value) => this._getConcreteValue(value)));
    values.forEach((value) => this._markSelected(value));
    oldValues.filter((value) => !newSelectedSet.has(this._getConcreteValue(value, newSelectedSet))).forEach((value) => this._unmarkSelected(value));
    const changed = this._hasQueuedChanges();
    this._emitChangeEvent();
    return changed;
  }
  /**
   * Toggles a value between selected and deselected.
   * @param value The value to toggle
   * @return Whether the selection changed as a result of this call
   */
  toggle(value) {
    return this.isSelected(value) ? this.deselect(value) : this.select(value);
  }
  /**
   * Clears all of the selected values.
   * @param flushEvent Whether to flush the changes in an event.
   *   If false, the changes to the selection will be flushed along with the next event.
   * @return Whether the selection changed as a result of this call
   */
  clear(flushEvent = true) {
    this._unmarkAll();
    const changed = this._hasQueuedChanges();
    if (flushEvent) {
      this._emitChangeEvent();
    }
    return changed;
  }
  /**
   * Determines whether a value is selected.
   */
  isSelected(value) {
    return this._selection.has(this._getConcreteValue(value));
  }
  /**
   * Determines whether the model does not have a value.
   */
  isEmpty() {
    return this._selection.size === 0;
  }
  /**
   * Determines whether the model has a value.
   */
  hasValue() {
    return !this.isEmpty();
  }
  /**
   * Sorts the selected values based on a predicate function.
   */
  sort(predicate) {
    if (this._multiple && this.selected) {
      this._selected.sort(predicate);
    }
  }
  /**
   * Gets whether multiple values can be selected.
   */
  isMultipleSelection() {
    return this._multiple;
  }
  /** Emits a change event and clears the records of selected and deselected values. */
  _emitChangeEvent() {
    this._selected = null;
    if (this._selectedToEmit.length || this._deselectedToEmit.length) {
      this.changed.next({
        source: this,
        added: this._selectedToEmit,
        removed: this._deselectedToEmit
      });
      this._deselectedToEmit = [];
      this._selectedToEmit = [];
    }
  }
  /** Selects a value. */
  _markSelected(value) {
    value = this._getConcreteValue(value);
    if (!this.isSelected(value)) {
      if (!this._multiple) {
        this._unmarkAll();
      }
      if (!this.isSelected(value)) {
        this._selection.add(value);
      }
      if (this._emitChanges) {
        this._selectedToEmit.push(value);
      }
    }
  }
  /** Deselects a value. */
  _unmarkSelected(value) {
    value = this._getConcreteValue(value);
    if (this.isSelected(value)) {
      this._selection.delete(value);
      if (this._emitChanges) {
        this._deselectedToEmit.push(value);
      }
    }
  }
  /** Clears out the selected values. */
  _unmarkAll() {
    if (!this.isEmpty()) {
      this._selection.forEach((value) => this._unmarkSelected(value));
    }
  }
  /**
   * Verifies the value assignment and throws an error if the specified value array is
   * including multiple values while the selection model is not supporting multiple values.
   */
  _verifyValueAssignment(values) {
    if (values.length > 1 && !this._multiple && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMultipleValuesInSingleSelectionError();
    }
  }
  /** Whether there are queued up change to be emitted. */
  _hasQueuedChanges() {
    return !!(this._deselectedToEmit.length || this._selectedToEmit.length);
  }
  /** Returns a value that is comparable to inputValue by applying compareWith function, returns the same inputValue otherwise. */
  _getConcreteValue(inputValue, selection) {
    if (!this.compareWith) {
      return inputValue;
    } else {
      selection = selection ?? this._selection;
      for (let selectedValue of selection) {
        if (this.compareWith(inputValue, selectedValue)) {
          return selectedValue;
        }
      }
      return inputValue;
    }
  }
};
function getMultipleValuesInSingleSelectionError() {
  return Error("Cannot pass multiple values into SelectionModel with single-value mode.");
}

export {
  UniqueSelectionDispatcher,
  _DisposeViewRepeaterStrategy,
  SelectionModel,
  CORE_CMS_LAYOUT_HEADER_CONFIG,
  signalStore,
  withMethods,
  withState,
  withDevtools,
  updateState,
  activityStore,
  VIEW_CONFIG,
  LayoutFacade,
  createEffect,
  Actions,
  ofType,
  EffectsModule,
  provideEffects,
  concatLatestFrom,
  NavigationActionTiming,
  RouterState,
  provideRouterStore,
  CoreCmsLayoutDataAccessModule,
  ENVIRONMENT,
  routerActions,
  RouterStateEffects,
  routerReducers,
  CustomRouterSerializer,
  selectRouteQueryParams,
  NavigationFilterService,
  PrefixTitleService,
  NasaImagesFacade
};
//# sourceMappingURL=chunk-ZCQMN6GR.js.map
