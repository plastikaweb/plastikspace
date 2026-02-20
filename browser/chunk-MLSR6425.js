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
} from "./chunk-AL26SZCX.js";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RoutesRecognized,
  TitleStrategy
} from "./chunk-W6MSIYPH.js";
import {
  _ViewRepeaterOperation
} from "./chunk-AKF5VCSH.js";
import {
  BreakpointObserver,
  Breakpoints,
  takeUntilDestroyed
} from "./chunk-QPG3BLZK.js";
import {
  HttpErrorResponse,
  Title
} from "./chunk-Q5JRN3QT.js";
import {
  Location,
  isPlatformBrowser
} from "./chunk-CXCM2DO7.js";
import {
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  EMPTY,
  ElementRef,
  ErrorHandler,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  NgZone,
  Observable,
  Optional,
  PLATFORM_ID,
  Pipe,
  Subject,
  __spreadProps,
  __spreadValues,
  assertInInjectionContext,
  catchError,
  computed,
  concat,
  concatMap,
  defer,
  dematerialize,
  effect,
  exhaustMap,
  filter,
  forkJoin,
  groupBy,
  ignoreElements,
  inject,
  isDevMode,
  isObservable,
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
  shareReplay,
  signal,
  switchMap,
  take,
  tap,
  throwError,
  untracked,
  withLatestFrom,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵgetInheritedFactory,
  ɵɵinject
} from "./chunk-AIW5K7IK.js";

// libs/core/cms-layout/entities/src/core-cms-layout-header-config.ts
var CORE_CMS_LAYOUT_HEADER_CONFIG = new InjectionToken("CORE_CMS_LAYOUT_HEADER_CONFIG");

// node_modules/@ngrx/signals/fesm2022/ngrx-signals.mjs
var DEEP_SIGNAL = /* @__PURE__ */ Symbol(typeof ngDevMode !== "undefined" && ngDevMode ? "DEEP_SIGNAL" : "");
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
var STATE_SOURCE = /* @__PURE__ */ Symbol(typeof ngDevMode !== "undefined" && ngDevMode ? "STATE_SOURCE" : "");
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
function withProps(propsFactory) {
  return (store) => {
    const props2 = propsFactory(__spreadValues(__spreadValues(__spreadValues({
      [STATE_SOURCE]: store[STATE_SOURCE]
    }, store.stateSignals), store.props), store.methods));
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      assertUniqueStoreMembers(store, Reflect.ownKeys(props2));
    }
    return __spreadProps(__spreadValues({}, store), {
      props: __spreadValues(__spreadValues({}, store.props), props2)
    });
  };
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
function throwIfNull(obj) {
  if (obj === null || obj === void 0) {
    throw new Error("");
  }
  return obj;
}
var GlitchTrackerService = class _GlitchTrackerService {
  #stores = {};
  #callback;
  get stores() {
    return Object.entries(this.#stores).reduce((acc, [id, {
      store
    }]) => {
      acc[id] = store;
      return acc;
    }, {});
  }
  onChange(callback) {
    this.#callback = callback;
  }
  removeStore(id) {
    this.#stores = Object.entries(this.#stores).reduce((newStore, [storeId, value]) => {
      if (storeId !== id) {
        newStore[storeId] = value;
      } else {
        value.destroyWatcher();
      }
      return newStore;
    }, {});
    throwIfNull(this.#callback)({});
  }
  track(id, store) {
    const watcher = watchState(store, (state) => {
      throwIfNull(this.#callback)({
        [id]: state
      });
    });
    this.#stores[id] = {
      destroyWatcher: watcher.destroy,
      store
    };
  }
  notifyRenamedStore(id) {
    if (Object.keys(this.#stores).includes(id) && this.#callback) {
      this.#callback({
        [id]: getState(this.#stores[id].store)
      });
    }
  }
  static {
    this.\u0275fac = function GlitchTrackerService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _GlitchTrackerService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _GlitchTrackerService,
      factory: _GlitchTrackerService.\u0275fac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GlitchTrackerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var REDUX_DEVTOOLS_CONFIG = new InjectionToken("ReduxDevtoolsConfig");
var DefaultTracker = class _DefaultTracker {
  #stores = signal({}, ...ngDevMode ? [{
    debugName: "#stores"
  }] : []);
  get stores() {
    return this.#stores();
  }
  #trackCallback;
  #trackingEffect = effect(() => {
    if (this.#trackCallback === void 0) {
      throw new Error("no callback function defined");
    }
    const stores = this.#stores();
    const fullState = Object.entries(stores).reduce((acc, [id, store]) => {
      return __spreadProps(__spreadValues({}, acc), {
        [id]: getState(store)
      });
    }, {});
    this.#trackCallback(fullState);
  }, ...ngDevMode ? [{
    debugName: "#trackingEffect"
  }] : []);
  track(id, store) {
    this.#stores.update((value) => __spreadProps(__spreadValues({}, value), {
      [id]: store
    }));
  }
  onChange(callback) {
    this.#trackCallback = callback;
  }
  removeStore(id) {
    this.#stores.update((stores) => Object.entries(stores).reduce((newStore, [storeId, state]) => {
      if (storeId !== id) {
        newStore[storeId] = state;
      }
      return newStore;
    }, {}));
  }
  notifyRenamedStore(id) {
    if (this.#stores()[id]) {
      this.#stores.update((stores) => {
        return __spreadValues({}, stores);
      });
    }
  }
  static {
    this.\u0275fac = function DefaultTracker_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DefaultTracker)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _DefaultTracker,
      factory: _DefaultTracker.\u0275fac,
      providedIn: "root"
    });
  }
};
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
var DevtoolsSyncer = class _DevtoolsSyncer {
  /**
   * Stores all SignalStores that are connected to the
   * DevTools along their options, names and id.
   */
  #stores = {};
  #isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  #trackers = [];
  #devtoolsConfig = __spreadValues({
    name: "NgRx SignalStore"
  }, inject(REDUX_DEVTOOLS_CONFIG, {
    optional: true
  }));
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
  #currentState = {};
  #currentId = 1;
  #connection = inject(NgZone).runOutsideAngular(() => this.#isBrowser ? window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__.connect(this.#devtoolsConfig) : dummyConnection : dummyConnection);
  constructor() {
    if (!this.#isBrowser) {
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
      } = this.#stores[id];
      acc[name2] = options.map(store);
      return acc;
    }, {});
    this.#currentState = __spreadValues(__spreadValues({}, this.#currentState), mappedChangedStatePerName);
    const names = Array.from(currentActionNames);
    const type2 = names.length ? names.join(", ") : "Store Update";
    currentActionNames.clear();
    this.#connection.send({
      type: type2
    }, this.#currentState);
  }
  getNextId() {
    return String(this.#currentId++);
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
    const names = Object.values(this.#stores).map((store2) => store2.name);
    if (names.includes(storeName2)) {
      if (!options.indexNames) {
        throw new Error(`An instance of the store ${storeName2} already exists. Enable automatic indexing via withDevTools('${storeName2}', { indexNames: true }), or rename it upon instantiation.`);
      }
    }
    for (let i = 1; names.includes(storeName2); i++) {
      storeName2 = `${name2}-${i}`;
    }
    this.#stores[id] = {
      name: storeName2,
      options
    };
    const tracker = options.tracker;
    if (!this.#trackers.includes(tracker)) {
      this.#trackers.push(tracker);
    }
    tracker.onChange((changedState) => this.syncToDevTools(changedState));
    tracker.track(id, store);
  }
  removeStore(id) {
    const name2 = this.#stores[id].name;
    this.#stores = Object.entries(this.#stores).reduce((newStore, [storeId, value]) => {
      if (storeId !== id) {
        newStore[storeId] = value;
      }
      return newStore;
    }, {});
    this.#currentState = Object.entries(this.#currentState).reduce((newState, [storeName2, state]) => {
      if (storeName2 !== name2) {
        newState[storeName2] = state;
      }
      return newState;
    }, {});
    for (const tracker of this.#trackers) {
      tracker.removeStore(id);
    }
  }
  /**
   * Renames a store identified by its internal id. If the store has already
   * been removed (e.g. due to component destruction), this is a no-op.
   */
  renameStore(id, newName) {
    const storeEntry = this.#stores[id];
    if (!storeEntry) {
      return;
    }
    const oldName = storeEntry.name;
    if (oldName === newName) {
      return;
    }
    const otherStoreNames = Object.entries(this.#stores).filter(([entryId]) => entryId !== id).map(([, s2]) => s2.name);
    if (otherStoreNames.includes(newName)) {
      throw new Error(`NgRx Toolkit/DevTools: cannot rename from ${oldName} to ${newName}. ${newName} is already assigned to another SignalStore instance.`);
    }
    this.#stores = Object.entries(this.#stores).reduce((newStore, [entryId, value]) => {
      if (entryId === id) {
        newStore[entryId] = __spreadProps(__spreadValues({}, value), {
          name: newName
        });
      } else {
        newStore[entryId] = value;
      }
      return newStore;
    }, {});
    this.#currentState = Object.entries(this.#currentState).reduce((newState, [storeName2, state]) => {
      if (storeName2 !== oldName) {
        newState[storeName2] = state;
      }
      return newState;
    }, {});
    this.#trackers.forEach((tracker) => tracker.notifyRenamedStore(id));
  }
  static {
    this.\u0275fac = function DevtoolsSyncer_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _DevtoolsSyncer)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _DevtoolsSyncer,
      factory: _DevtoolsSyncer.\u0275fac,
      providedIn: "root"
    });
  }
};
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
var DEVTOOL_FEATURE_NAMES = /* @__PURE__ */ Symbol("DEVTOOL_PROP");
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
  }), withProps(() => ({
    [DEVTOOL_FEATURE_NAMES]: features.filter(Boolean).map((f) => f.name)
  })), withHooks((store) => {
    const syncer = inject(DevtoolsSyncer);
    const id = String(store[uniqueDevtoolsId]());
    return {
      onInit() {
        const finalOptions = {
          indexNames: !features.some((f) => f.indexNames === false),
          map: features.find((f) => f.map)?.map ?? ((state) => state),
          tracker: inject(features.find((f) => f.tracker)?.tracker || DefaultTracker)
        };
        syncer.addStore(id, name2, store, finalOptions);
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
function withReset() {
  return signalStoreFeature(withProps(() => ({
    _resetState: {
      value: {}
    }
  })), withMethods((store) => {
    const methods = {
      resetState() {
        patchState(store, store._resetState.value);
      },
      __setResetState__(state) {
        store._resetState.value = state;
      }
    };
    return methods;
  }), withHooks((store) => ({
    onInit() {
      store._resetState.value = getState(store);
    }
  })));
}
function deepFreeze(target, propertyNamesToBeFrozen, isRoot = true) {
  const runPropertyNameCheck = propertyNamesToBeFrozen.length > 0;
  for (const key of Reflect.ownKeys(target)) {
    if (runPropertyNameCheck && !propertyNamesToBeFrozen.includes(key)) {
      continue;
    }
    const propValue = target[key];
    if (isRecordLike(propValue) && !Object.isFrozen(propValue)) {
      Object.freeze(propValue);
      deepFreeze(propValue, [], false);
    } else if (isRoot) {
      Object.defineProperty(target, key, {
        value: propValue,
        writable: false,
        configurable: false
      });
    }
  }
}
function isRecordLike(target) {
  return typeof target === "object" && target !== null;
}
function isDevMode2() {
  return isDevMode();
}
function withImmutableState(stateOrFactory, options) {
  const immutableState = typeof stateOrFactory === "function" ? stateOrFactory() : stateOrFactory;
  const stateKeys = Reflect.ownKeys(immutableState);
  const applyFreezing = isDevMode2() || options?.enableInProduction === true;
  return signalStoreFeature(withState(immutableState), withHooks((store) => ({
    onInit() {
      if (!applyFreezing) {
        return;
      }
      deepFreeze(getState(store), stateKeys);
      watchState(store, (state) => {
        deepFreeze(state, stateKeys);
      });
    }
  })));
}
var keyPath = "ngrxToolkitKeyPath";
var dbName = "ngrxToolkitDb";
var storeName = "ngrxToolkitStore";
var VERSION = 1;
var IndexedDBService = class _IndexedDBService {
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
  static {
    this.\u0275fac = function IndexedDBService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _IndexedDBService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _IndexedDBService,
      factory: _IndexedDBService.\u0275fac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IndexedDBService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var LocalStorageService = class _LocalStorageService {
  getItem(key) {
    return localStorage.getItem(key);
  }
  setItem(key, data) {
    return localStorage.setItem(key, data);
  }
  clear(key) {
    return localStorage.removeItem(key);
  }
  static {
    this.\u0275fac = function LocalStorageService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _LocalStorageService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _LocalStorageService,
      factory: _LocalStorageService.\u0275fac,
      providedIn: "root"
    });
  }
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalStorageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var SessionStorageService = class _SessionStorageService {
  getItem(key) {
    return sessionStorage.getItem(key);
  }
  setItem(key, data) {
    return sessionStorage.setItem(key, data);
  }
  clear(key) {
    return sessionStorage.removeItem(key);
  }
  static {
    this.\u0275fac = function SessionStorageService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _SessionStorageService)();
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _SessionStorageService,
      factory: _SessionStorageService.\u0275fac,
      providedIn: "root"
    });
  }
};
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
var activityStore = signalStore({ providedIn: "root" }, withImmutableState({
  isActive: false
}), withReset(), withMethods((store) => ({
  setActivity(isActive) {
    updateState(store, `[activity] ${isActive ? "on" : "off"}`, { isActive });
  }
})));

// libs/core/util/environments/src/environment.token.ts
var ENVIRONMENT = new InjectionToken("ENVIRONMENT");
var ENVIRONMENT_WITH_API = new InjectionToken("ENVIRONMENT_WITH_API");
var POCKETBASE_ENVIRONMENT = new InjectionToken("POCKETBASE_ENVIRONMENT");
var POCKETBASE_WITH_TRANSLATION_ENVIRONMENT = new InjectionToken("POCKETBASE_WITH_TRANSLATION_ENVIRONMENT");
function provideWithApiEnv(env) {
  return [
    {
      provide: ENVIRONMENT_WITH_API,
      useValue: env
    },
    { provide: ENVIRONMENT, useExisting: ENVIRONMENT_WITH_API }
  ];
}

// libs/core/util/api-base/src/lib/base-data.service.ts
var BaseDataService = class _BaseDataService {
  /**
   * Cache time by default (1 day). Children can override it.
   */
  cacheTime = 1e3 * 60 * 60 * 24;
  /**
   * @description Generic error handler for HTTP and custom backends.
   * @param { unknown } error The error object.
   * @returns { Observable<never> } An observable that throws the formatted error.
   */
  handleError(error) {
    let message = "An error occurred";
    let code = 500;
    let data = null;
    if (error instanceof HttpErrorResponse) {
      message = (error.error?.message ?? error.message) || message;
      code = error.status ?? code;
      data = error.error ?? null;
    } else if (typeof error === "object" && error !== null) {
      const maybe = error;
      const dataMessage = maybe.data?.message;
      message = (typeof dataMessage === "string" ? dataMessage : typeof maybe.message === "string" ? maybe.message : void 0) ?? message;
      code = typeof maybe.status === "number" ? maybe.status : code;
      data = "data" in maybe ? maybe.data : data;
    }
    return throwError(() => ({ message, code, data, originalError: error }));
  }
  static \u0275fac = function BaseDataService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BaseDataService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _BaseDataService, factory: _BaseDataService.\u0275fac });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BaseDataService, [{
    type: Injectable
  }], null, null);
})();

// libs/core/util/api-base/src/lib/data-get.ts
function createDataGetListServiceToken(description = "DATA_GET_LIST_SERVICE") {
  return new InjectionToken(description);
}

// libs/core/util/api-pocketbase/src/lib/pocketbase.token.ts
var POCKETBASE_INSTANCE = new InjectionToken("PocketBase");

// node_modules/pocketbase/dist/pocketbase.es.mjs
var t = "undefined" != typeof navigator && "ReactNative" === navigator.product || "undefined" != typeof global && global.HermesInternal;
var s;
s = "function" != typeof atob || t ? (e) => {
  let t2 = String(e).replace(/=+$/, "");
  if (t2.length % 4 == 1) throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  for (var s2, i, n = 0, r = 0, o = ""; i = t2.charAt(r++); ~i && (s2 = n % 4 ? 64 * s2 + i : i, n++ % 4) ? o += String.fromCharCode(255 & s2 >> (-2 * n & 6)) : 0) i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(i);
  return o;
} : atob;

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
var Actions = class _Actions extends Observable {
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
  static {
    this.\u0275fac = function Actions_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _Actions)(\u0275\u0275inject(ScannedActionsSubject));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _Actions,
      factory: _Actions.\u0275fac,
      providedIn: "root"
    });
  }
};
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
var EffectSources = class _EffectSources extends Subject {
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
  static {
    this.\u0275fac = function EffectSources_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _EffectSources)(\u0275\u0275inject(ErrorHandler), \u0275\u0275inject(EFFECTS_ERROR_HANDLER));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _EffectSources,
      factory: _EffectSources.\u0275fac,
      providedIn: "root"
    });
  }
};
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
var EffectsRunner = class _EffectsRunner {
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
  static {
    this.\u0275fac = function EffectsRunner_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _EffectsRunner)(\u0275\u0275inject(EffectSources), \u0275\u0275inject(Store));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _EffectsRunner,
      factory: _EffectsRunner.\u0275fac,
      providedIn: "root"
    });
  }
};
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
var EffectsRootModule = class _EffectsRootModule {
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
  static {
    this.\u0275fac = function EffectsRootModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _EffectsRootModule)(\u0275\u0275inject(EffectSources), \u0275\u0275inject(EffectsRunner), \u0275\u0275inject(Store), \u0275\u0275inject(_ROOT_EFFECTS_INSTANCES), \u0275\u0275inject(StoreRootModule, 8), \u0275\u0275inject(StoreFeatureModule, 8), \u0275\u0275inject(_ROOT_EFFECTS_GUARD, 8));
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _EffectsRootModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
  }
};
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
var EffectsFeatureModule = class _EffectsFeatureModule {
  constructor(effectsRootModule, effectsInstanceGroups, storeRootModule, storeFeatureModule) {
    const effectsInstances = effectsInstanceGroups.flat();
    for (const effectsInstance2 of effectsInstances) {
      effectsRootModule.addEffects(effectsInstance2);
    }
  }
  static {
    this.\u0275fac = function EffectsFeatureModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _EffectsFeatureModule)(\u0275\u0275inject(EffectsRootModule), \u0275\u0275inject(_FEATURE_EFFECTS_INSTANCE_GROUPS), \u0275\u0275inject(StoreRootModule, 8), \u0275\u0275inject(StoreFeatureModule, 8));
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _EffectsFeatureModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
  }
};
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
var EffectsModule = class _EffectsModule {
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
  static {
    this.\u0275fac = function EffectsModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _EffectsModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _EffectsModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
  }
};
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
var StoreRouterConnectingService = class _StoreRouterConnectingService {
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
  dispatchRouterAction(type2, payload) {
    this.trigger = RouterTrigger.ROUTER;
    try {
      this.store.dispatch({
        type: type2,
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
  static {
    this.\u0275fac = function StoreRouterConnectingService_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _StoreRouterConnectingService)(\u0275\u0275inject(Store), \u0275\u0275inject(Router), \u0275\u0275inject(RouterStateSerializer), \u0275\u0275inject(ErrorHandler), \u0275\u0275inject(ROUTER_CONFIG), \u0275\u0275inject(ACTIVE_RUNTIME_CHECKS));
    };
  }
  static {
    this.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
      token: _StoreRouterConnectingService,
      factory: _StoreRouterConnectingService.\u0275fac
    });
  }
};
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
var StoreRouterConnectingModule = class _StoreRouterConnectingModule {
  static forRoot(config = {}) {
    return {
      ngModule: _StoreRouterConnectingModule,
      providers: [provideRouterStore(config)]
    };
  }
  static {
    this.\u0275fac = function StoreRouterConnectingModule_Factory(__ngFactoryType__) {
      return new (__ngFactoryType__ || _StoreRouterConnectingModule)();
    };
  }
  static {
    this.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
      type: _StoreRouterConnectingModule
    });
  }
  static {
    this.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
  }
};
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

// libs/core/cms-layout/data-access/src/lib/services/layout-observer.service.ts
var LayoutObserverService = class _LayoutObserverService {
  #breakpointObserver = inject(BreakpointObserver);
  getMatches(breakpoints = [Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Medium]) {
    return this.#breakpointObserver.observe(breakpoints).pipe(map((state) => state.matches), shareReplay(1));
  }
  static \u0275fac = function LayoutObserverService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutObserverService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _LayoutObserverService, factory: _LayoutObserverService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutObserverService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// node_modules/@ngx-translate/core/fesm2022/ngx-translate-core.mjs
var MissingTranslationHandler = class {
};
var DefaultMissingTranslationHandler = class _DefaultMissingTranslationHandler {
  handle(params) {
    return params.key;
  }
  static \u0275fac = function DefaultMissingTranslationHandler_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _DefaultMissingTranslationHandler)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _DefaultMissingTranslationHandler,
    factory: _DefaultMissingTranslationHandler.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DefaultMissingTranslationHandler, [{
    type: Injectable
  }], null, null);
})();
var TranslateCompiler = class {
};
var TranslateNoOpCompiler = class _TranslateNoOpCompiler extends TranslateCompiler {
  compile(value, lang) {
    void lang;
    return value;
  }
  compileTranslations(translations, lang) {
    void lang;
    return translations;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275TranslateNoOpCompiler_BaseFactory;
    return function TranslateNoOpCompiler_Factory(__ngFactoryType__) {
      return (\u0275TranslateNoOpCompiler_BaseFactory || (\u0275TranslateNoOpCompiler_BaseFactory = \u0275\u0275getInheritedFactory(_TranslateNoOpCompiler)))(__ngFactoryType__ || _TranslateNoOpCompiler);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _TranslateNoOpCompiler,
    factory: _TranslateNoOpCompiler.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateNoOpCompiler, [{
    type: Injectable
  }], null, null);
})();
var TranslateLoader = class {
};
var TranslateNoOpLoader = class _TranslateNoOpLoader extends TranslateLoader {
  getTranslation(lang) {
    void lang;
    return of({});
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275TranslateNoOpLoader_BaseFactory;
    return function TranslateNoOpLoader_Factory(__ngFactoryType__) {
      return (\u0275TranslateNoOpLoader_BaseFactory || (\u0275TranslateNoOpLoader_BaseFactory = \u0275\u0275getInheritedFactory(_TranslateNoOpLoader)))(__ngFactoryType__ || _TranslateNoOpLoader);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _TranslateNoOpLoader,
    factory: _TranslateNoOpLoader.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateNoOpLoader, [{
    type: Injectable
  }], null, null);
})();
function equals(o1, o2) {
  if (o1 === o2) return true;
  if (o1 === null || o2 === null) return false;
  if (o1 !== o1 && o2 !== o2) return true;
  const t1 = typeof o1, t2 = typeof o2;
  let length;
  if (t1 == t2 && t1 == "object") {
    if (Array.isArray(o1)) {
      if (!Array.isArray(o2)) return false;
      if ((length = o1.length) == o2.length) {
        for (let key = 0; key < length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    } else {
      if (Array.isArray(o2)) {
        return false;
      }
      if (isDict(o1) && isDict(o2)) {
        const keySet = /* @__PURE__ */ Object.create(null);
        for (const key in o1) {
          if (!equals(o1[key], o2[key])) {
            return false;
          }
          keySet[key] = true;
        }
        for (const key in o2) {
          if (!(key in keySet) && typeof o2[key] !== "undefined") {
            return false;
          }
        }
        return true;
      }
    }
  }
  return false;
}
function isDefinedAndNotNull(value) {
  return typeof value !== "undefined" && value !== null;
}
function isDefined(value) {
  return value !== void 0;
}
function isDict(value) {
  return isObject(value) && !isArray(value) && value !== null;
}
function isObject(value) {
  return typeof value === "object" && value !== null;
}
function isArray(value) {
  return Array.isArray(value);
}
function isString(value) {
  return typeof value === "string";
}
function isFunction2(value) {
  return typeof value === "function";
}
function cloneDeep(value) {
  if (isArray(value)) {
    return value.map((item) => cloneDeep(item));
  } else if (isDict(value)) {
    const cloned = {};
    Object.keys(value).forEach((key) => {
      cloned[key] = cloneDeep(value[key]);
    });
    return cloned;
  } else {
    return value;
  }
}
function mergeDeep(target, source) {
  if (!isObject(target)) {
    return cloneDeep(source);
  }
  const output = cloneDeep(target);
  if (isObject(output) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isDict(source[key])) {
        if (key in target) {
          output[key] = mergeDeep(target[key], source[key]);
        } else {
          Object.assign(output, {
            [key]: source[key]
          });
        }
      } else {
        Object.assign(output, {
          [key]: source[key]
        });
      }
    });
  }
  return output;
}
function getValue(target, key) {
  const keys = key.split(".");
  key = "";
  do {
    key += keys.shift();
    const isLastKey = !keys.length;
    if (isDefinedAndNotNull(target)) {
      if (isDict(target) && isDefined(target[key]) && (isDict(target[key]) || isArray(target[key]) || isLastKey)) {
        target = target[key];
        key = "";
        continue;
      }
      if (isArray(target)) {
        const index = parseInt(key, 10);
        if (isDefined(target[index]) && (isDict(target[index]) || isArray(target[index]) || isLastKey)) {
          target = target[index];
          key = "";
          continue;
        }
      }
    }
    if (isLastKey) {
      target = void 0;
      continue;
    }
    key += ".";
  } while (keys.length);
  return target;
}
function insertValue(target, key, value) {
  return mergeDeep(target, createNestedObject(key, value));
}
function createNestedObject(dotSeparatedKey, value) {
  return dotSeparatedKey.split(".").reduceRight((acc, key) => ({
    [key]: acc
  }), value);
}
var TranslateParser = class {
};
var TranslateDefaultParser = class _TranslateDefaultParser extends TranslateParser {
  templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
  interpolate(expr, params) {
    if (isString(expr)) {
      return this.interpolateString(expr, params);
    } else if (isFunction2(expr)) {
      return this.interpolateFunction(expr, params);
    }
    return void 0;
  }
  interpolateFunction(fn, params) {
    return fn(params);
  }
  interpolateString(expr, params) {
    if (!params) {
      return expr;
    }
    return expr.replace(this.templateMatcher, (substring, key) => {
      const replacement = this.getInterpolationReplacement(params, key);
      return replacement !== void 0 ? replacement : substring;
    });
  }
  /**
   * Returns the replacement for an interpolation parameter
   * @params:
   */
  getInterpolationReplacement(params, key) {
    return this.formatValue(getValue(params, key));
  }
  /**
   * Converts a value into a useful string representation.
   * @param value The value to format.
   * @returns A string representation of the value.
   */
  formatValue(value) {
    if (isString(value)) {
      return value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return value.toString();
    }
    if (value === null) {
      return "null";
    }
    if (isArray(value)) {
      return value.join(", ");
    }
    if (isObject(value)) {
      if (typeof value.toString === "function" && value.toString !== Object.prototype.toString) {
        return value.toString();
      }
      return JSON.stringify(value);
    }
    return void 0;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275TranslateDefaultParser_BaseFactory;
    return function TranslateDefaultParser_Factory(__ngFactoryType__) {
      return (\u0275TranslateDefaultParser_BaseFactory || (\u0275TranslateDefaultParser_BaseFactory = \u0275\u0275getInheritedFactory(_TranslateDefaultParser)))(__ngFactoryType__ || _TranslateDefaultParser);
    };
  })();
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _TranslateDefaultParser,
    factory: _TranslateDefaultParser.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateDefaultParser, [{
    type: Injectable
  }], null, null);
})();
var TranslateStore = class _TranslateStore {
  _onTranslationChange = new Subject();
  _onLangChange = new Subject();
  _onFallbackLangChange = new Subject();
  fallbackLang = null;
  currentLang;
  translations = {};
  languages = [];
  getTranslations(language) {
    return this.translations[language];
  }
  setTranslations(language, translations, extend) {
    this.translations[language] = extend && this.hasTranslationFor(language) ? mergeDeep(this.translations[language], translations) : translations;
    this.addLanguages([language]);
    this._onTranslationChange.next({
      lang: language,
      translations: this.getTranslations(language)
    });
  }
  getLanguages() {
    return this.languages;
  }
  getCurrentLang() {
    return this.currentLang;
  }
  getFallbackLang() {
    return this.fallbackLang;
  }
  /**
   * Changes the fallback lang
   */
  setFallbackLang(lang, emitChange = true) {
    this.fallbackLang = lang;
    if (emitChange) {
      this._onFallbackLangChange.next({
        lang,
        translations: this.translations[lang]
      });
    }
  }
  setCurrentLang(lang, emitChange = true) {
    this.currentLang = lang;
    if (emitChange) {
      this._onLangChange.next({
        lang,
        translations: this.translations[lang]
      });
    }
  }
  /**
   * An Observable to listen to translation change events
   * onTranslationChange.subscribe((params: TranslationChangeEvent) => {
   *     // do something
   * });
   */
  get onTranslationChange() {
    return this._onTranslationChange.asObservable();
  }
  /**
   * An Observable to listen to lang change events
   * onLangChange.subscribe((params: LangChangeEvent) => {
   *     // do something
   * });
   */
  get onLangChange() {
    return this._onLangChange.asObservable();
  }
  /**
   * An Observable to listen to fallback lang change events
   * onFallbackLangChange.subscribe((params: FallbackLangChangeEvent) => {
   *     // do something
   * });
   */
  get onFallbackLangChange() {
    return this._onFallbackLangChange.asObservable();
  }
  addLanguages(languages) {
    this.languages = Array.from(/* @__PURE__ */ new Set([...this.languages, ...languages]));
  }
  hasTranslationFor(lang) {
    return typeof this.translations[lang] !== "undefined";
  }
  deleteTranslations(lang) {
    delete this.translations[lang];
  }
  getTranslation(key) {
    let text = this.getValue(this.currentLang, key);
    if (text === void 0 && this.fallbackLang != null && this.fallbackLang !== this.currentLang) {
      text = this.getValue(this.fallbackLang, key);
    }
    return text;
  }
  getValue(language, key) {
    return getValue(this.getTranslations(language), key);
  }
  static \u0275fac = function TranslateStore_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TranslateStore)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _TranslateStore,
    factory: _TranslateStore.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateStore, [{
    type: Injectable
  }], null, null);
})();
var TRANSLATE_SERVICE_CONFIG = new InjectionToken("TRANSLATE_CONFIG");
var makeObservable = (value) => {
  return isObservable(value) ? value : of(value);
};
var TranslateService = class _TranslateService {
  loadingTranslations;
  pending = false;
  _translationRequests = {};
  lastUseLanguage = null;
  currentLoader = inject(TranslateLoader);
  compiler = inject(TranslateCompiler);
  parser = inject(TranslateParser);
  missingTranslationHandler = inject(MissingTranslationHandler);
  store = inject(TranslateStore);
  extend = false;
  /**
   * An Observable to listen to translation change events
   * onTranslationChange.subscribe((params: TranslationChangeEvent) => {
   *     // do something
   * });
   */
  get onTranslationChange() {
    return this.store.onTranslationChange;
  }
  /**
   * An Observable to listen to lang change events
   * onLangChange.subscribe((params: LangChangeEvent) => {
   *     // do something
   * });
   */
  get onLangChange() {
    return this.store.onLangChange;
  }
  /**
   * An Observable to listen to fallback lang change events
   * onFallbackLangChange.subscribe((params: FallbackLangChangeEvent) => {
   *     // do something
   * });
   */
  get onFallbackLangChange() {
    return this.store.onFallbackLangChange;
  }
  /**
   * @deprecated Use onFallbackLangChange() instead
   */
  get onDefaultLangChange() {
    return this.store.onFallbackLangChange;
  }
  constructor() {
    const config = __spreadValues({
      extend: false,
      fallbackLang: null
    }, inject(TRANSLATE_SERVICE_CONFIG, {
      optional: true
    }));
    if (config.lang) {
      this.use(config.lang);
    }
    if (config.fallbackLang) {
      this.setFallbackLang(config.fallbackLang);
    }
    if (config.extend) {
      this.extend = true;
    }
  }
  /**
   * Sets the fallback language to use if a translation is not found in the
   * current language
   */
  setFallbackLang(lang) {
    if (!this.getFallbackLang()) {
      this.store.setFallbackLang(lang, false);
    }
    const pending = this.loadOrExtendLanguage(lang);
    if (isObservable(pending)) {
      pending.pipe(take(1)).subscribe({
        next: () => {
          this.store.setFallbackLang(lang);
        },
        error: () => {
        }
      });
      return pending;
    }
    this.store.setFallbackLang(lang);
    return of(this.store.getTranslations(lang));
  }
  /**
   * Changes the lang currently used
   */
  use(lang) {
    this.lastUseLanguage = lang;
    if (!this.getCurrentLang()) {
      this.store.setCurrentLang(lang, false);
    }
    const pending = this.loadOrExtendLanguage(lang);
    if (isObservable(pending)) {
      pending.pipe(take(1)).subscribe({
        next: () => {
          this.changeLang(lang);
        },
        error: () => {
        }
      });
      return pending;
    }
    this.changeLang(lang);
    return of(this.store.getTranslations(lang));
  }
  /**
   * Retrieves the given translations
   */
  loadOrExtendLanguage(lang) {
    if (!this.store.hasTranslationFor(lang) || this.extend) {
      this._translationRequests[lang] = this._translationRequests[lang] || this.loadAndCompileTranslations(lang);
      return this._translationRequests[lang];
    }
    return void 0;
  }
  /**
   * Changes the current lang
   */
  changeLang(lang) {
    if (lang !== this.lastUseLanguage) {
      return;
    }
    this.store.setCurrentLang(lang);
  }
  getCurrentLang() {
    return this.store.getCurrentLang();
  }
  loadAndCompileTranslations(lang) {
    this.pending = true;
    const loadingTranslations = this.currentLoader.getTranslation(lang).pipe(shareReplay(1), take(1));
    this.loadingTranslations = loadingTranslations.pipe(map((res) => this.compiler.compileTranslations(res, lang)), shareReplay(1), take(1));
    this.loadingTranslations.subscribe({
      next: (res) => {
        this.store.setTranslations(lang, res, this.extend);
        this.pending = false;
      },
      error: (err) => {
        void err;
        this.pending = false;
      }
    });
    return loadingTranslations;
  }
  /**
   * Manually sets an object of translations for a given language
   * after passing it through the compiler
   */
  setTranslation(lang, translations, shouldMerge = false) {
    const interpolatableTranslations = this.compiler.compileTranslations(translations, lang);
    this.store.setTranslations(lang, interpolatableTranslations, shouldMerge || this.extend);
  }
  getLangs() {
    return this.store.getLanguages();
  }
  /**
   * Add available languages
   */
  addLangs(languages) {
    this.store.addLanguages(languages);
  }
  getParsedResultForKey(key, interpolateParams) {
    const textToInterpolate = this.getTextToInterpolate(key);
    if (isDefinedAndNotNull(textToInterpolate)) {
      return this.runInterpolation(textToInterpolate, interpolateParams);
    }
    const res = this.missingTranslationHandler.handle(__spreadValues({
      key,
      translateService: this
    }, interpolateParams !== void 0 && {
      interpolateParams
    }));
    return res !== void 0 ? res : key;
  }
  /**
   * Gets the fallback language. null if none is defined
   */
  getFallbackLang() {
    return this.store.getFallbackLang();
  }
  getTextToInterpolate(key) {
    return this.store.getTranslation(key);
  }
  runInterpolation(translations, interpolateParams) {
    if (!isDefinedAndNotNull(translations)) {
      return;
    }
    if (isArray(translations)) {
      return this.runInterpolationOnArray(translations, interpolateParams);
    }
    if (isDict(translations)) {
      return this.runInterpolationOnDict(translations, interpolateParams);
    }
    return this.parser.interpolate(translations, interpolateParams);
  }
  runInterpolationOnArray(translations, interpolateParams) {
    return translations.map((translation) => this.runInterpolation(translation, interpolateParams));
  }
  runInterpolationOnDict(translations, interpolateParams) {
    const result = {};
    for (const key in translations) {
      const res = this.runInterpolation(translations[key], interpolateParams);
      if (res !== void 0) {
        result[key] = res;
      }
    }
    return result;
  }
  /**
   * Returns the parsed result of the translations
   */
  getParsedResult(key, interpolateParams) {
    return key instanceof Array ? this.getParsedResultForArray(key, interpolateParams) : this.getParsedResultForKey(key, interpolateParams);
  }
  getParsedResultForArray(key, interpolateParams) {
    const result = {};
    let observables = false;
    for (const k of key) {
      result[k] = this.getParsedResultForKey(k, interpolateParams);
      observables = observables || isObservable(result[k]);
    }
    if (!observables) {
      return result;
    }
    const sources = key.map((k) => makeObservable(result[k]));
    return forkJoin(sources).pipe(map((arr) => {
      const obj = {};
      arr.forEach((value, index) => {
        obj[key[index]] = value;
      });
      return obj;
    }));
  }
  /**
   * Gets the translated value of a key (or an array of keys)
   * @returns the translated key, or an object of translated keys
   */
  get(key, interpolateParams) {
    if (!isDefinedAndNotNull(key) || !key.length) {
      throw new Error(`Parameter "key" is required and cannot be empty`);
    }
    if (this.pending) {
      return this.loadingTranslations.pipe(concatMap(() => {
        return makeObservable(this.getParsedResult(key, interpolateParams));
      }));
    }
    return makeObservable(this.getParsedResult(key, interpolateParams));
  }
  /**
   * Returns a stream of translated values of a key (or an array of keys) which updates
   * whenever the translation changes.
   * @returns A stream of the translated key, or an object of translated keys
   */
  getStreamOnTranslationChange(key, interpolateParams) {
    if (!isDefinedAndNotNull(key) || !key.length) {
      throw new Error(`Parameter "key" is required and cannot be empty`);
    }
    return concat(defer(() => this.get(key, interpolateParams)), this.onTranslationChange.pipe(switchMap(() => {
      const res = this.getParsedResult(key, interpolateParams);
      return makeObservable(res);
    })));
  }
  /**
   * Returns a stream of translated values of a key (or an array of keys) which updates
   * whenever the language changes.
   * @returns A stream of the translated key, or an object of translated keys
   */
  stream(key, interpolateParams) {
    if (!isDefinedAndNotNull(key) || !key.length) {
      throw new Error(`Parameter "key" required`);
    }
    return concat(defer(() => this.get(key, interpolateParams)), this.onLangChange.pipe(switchMap(() => {
      const res = this.getParsedResult(key, interpolateParams);
      return makeObservable(res);
    })));
  }
  /**
   * Returns a translation instantly from the internal state of loaded translation.
   * All rules regarding the current language, the preferred language of even fallback languages
   * will be used except any promise handling.
   */
  instant(key, interpolateParams) {
    if (!isDefinedAndNotNull(key) || key.length === 0) {
      throw new Error('Parameter "key" is required and cannot be empty');
    }
    const result = this.getParsedResult(key, interpolateParams);
    if (isObservable(result)) {
      if (Array.isArray(key)) {
        return key.reduce((acc, currKey) => {
          acc[currKey] = currKey;
          return acc;
        }, {});
      }
      return key;
    }
    return result;
  }
  /**
   * Sets the translated value of a key, after compiling it
   */
  set(key, translation, lang = this.getCurrentLang()) {
    this.store.setTranslations(lang, insertValue(this.store.getTranslations(lang), key, isString(translation) ? this.compiler.compile(translation, lang) : this.compiler.compileTranslations(translation, lang)), false);
  }
  /**
   * Allows reloading the lang file from the file
   */
  reloadLang(lang) {
    this.resetLang(lang);
    return this.loadAndCompileTranslations(lang);
  }
  /**
   * Deletes inner translation
   */
  resetLang(lang) {
    delete this._translationRequests[lang];
    this.store.deleteTranslations(lang);
  }
  /**
   * Returns the language code name from the browser, e.g. "de"
   */
  static getBrowserLang() {
    if (typeof window === "undefined" || !window.navigator) {
      return void 0;
    }
    const browserLang = this.getBrowserCultureLang();
    return browserLang ? browserLang.split(/[-_]/)[0] : void 0;
  }
  /**
   * Returns the culture language code name from the browser, e.g. "de-DE"
   */
  static getBrowserCultureLang() {
    if (typeof window === "undefined" || typeof window.navigator === "undefined") {
      return void 0;
    }
    return window.navigator.languages ? window.navigator.languages[0] : window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
  }
  getBrowserLang() {
    return _TranslateService.getBrowserLang();
  }
  getBrowserCultureLang() {
    return _TranslateService.getBrowserCultureLang();
  }
  /** Deprecations **/
  /**
   * @deprecated use `getFallbackLang()`
   */
  get defaultLang() {
    return this.getFallbackLang();
  }
  /**
   * The lang currently used
   * @deprecated use `getCurrentLang()`
   */
  get currentLang() {
    return this.store.getCurrentLang();
  }
  /**
   * @deprecated use `getLangs()`
   */
  get langs() {
    return this.store.getLanguages();
  }
  /**
   * Sets the  language to use as a fallback
   * @deprecated use setFallbackLanguage()
   */
  setDefaultLang(lang) {
    return this.setFallbackLang(lang);
  }
  /**
   * Gets the fallback language used
   * @deprecated use getFallbackLang()
   */
  getDefaultLang() {
    return this.getFallbackLang();
  }
  static \u0275fac = function TranslateService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TranslateService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _TranslateService,
    factory: _TranslateService.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateService, [{
    type: Injectable
  }], () => [], null);
})();
var TranslateDirective = class _TranslateDirective {
  translateService = inject(TranslateService);
  element = inject(ElementRef);
  _ref = inject(ChangeDetectorRef);
  key;
  lastParams;
  currentParams;
  onLangChangeSub;
  onFallbackLangChangeSub;
  onTranslationChangeSub;
  set translate(key) {
    if (key) {
      this.key = key;
      this.checkNodes();
    }
  }
  set translateParams(params) {
    if (!equals(this.currentParams, params)) {
      this.currentParams = params;
      this.checkNodes(true);
    }
  }
  constructor() {
    if (!this.onTranslationChangeSub) {
      this.onTranslationChangeSub = this.translateService.onTranslationChange.subscribe((event) => {
        if (event.lang === this.translateService.currentLang) {
          this.checkNodes(true, event.translations);
        }
      });
    }
    if (!this.onLangChangeSub) {
      this.onLangChangeSub = this.translateService.onLangChange.subscribe((event) => {
        this.checkNodes(true, event.translations);
      });
    }
    if (!this.onFallbackLangChangeSub) {
      this.onFallbackLangChangeSub = this.translateService.onFallbackLangChange.subscribe((event) => {
        void event;
        this.checkNodes(true);
      });
    }
  }
  ngAfterViewChecked() {
    this.checkNodes();
  }
  checkNodes(forceUpdate = false, translations) {
    let nodes = this.element.nativeElement.childNodes;
    if (!nodes.length) {
      this.setContent(this.element.nativeElement, this.key);
      nodes = this.element.nativeElement.childNodes;
    }
    nodes.forEach((n) => {
      const node = n;
      if (node.nodeType === 3) {
        let key;
        if (forceUpdate) {
          node.lastKey = null;
        }
        if (isDefinedAndNotNull(node.lookupKey)) {
          key = node.lookupKey;
        } else if (this.key) {
          key = this.key;
        } else {
          const content = this.getContent(node);
          const trimmedContent = content.trim();
          if (trimmedContent.length) {
            node.lookupKey = trimmedContent;
            if (content !== node.currentValue) {
              key = trimmedContent;
              node.originalContent = content || node.originalContent;
            } else if (node.originalContent) {
              key = node.originalContent.trim();
            }
          }
        }
        this.updateValue(key, node, translations);
      }
    });
  }
  updateValue(key, node, translations) {
    if (key) {
      if (node.lastKey === key && this.lastParams === this.currentParams) {
        return;
      }
      this.lastParams = this.currentParams;
      const onTranslation = (res) => {
        if (res !== key || !node.lastKey) {
          node.lastKey = key;
        }
        if (!node.originalContent) {
          node.originalContent = this.getContent(node);
        }
        if (isString(res)) {
          node.currentValue = res;
        } else if (!isDefinedAndNotNull(res)) {
          node.currentValue = node.originalContent || key;
        } else {
          node.currentValue = JSON.stringify(res);
        }
        this.setContent(node, this.key ? node.currentValue : node.originalContent.replace(key, node.currentValue));
        this._ref.markForCheck();
      };
      if (isDefinedAndNotNull(translations)) {
        const res = this.translateService.getParsedResult(key, this.currentParams);
        if (isObservable(res)) {
          res.subscribe({
            next: onTranslation
          });
        } else {
          onTranslation(res);
        }
      } else {
        this.translateService.get(key, this.currentParams).subscribe(onTranslation);
      }
    }
  }
  getContent(node) {
    return isDefinedAndNotNull(node.textContent) ? node.textContent : node.data;
  }
  setContent(node, content) {
    if (isDefinedAndNotNull(node.textContent)) {
      node.textContent = content;
    } else {
      node.data = content;
    }
  }
  ngOnDestroy() {
    if (this.onLangChangeSub) {
      this.onLangChangeSub.unsubscribe();
    }
    if (this.onFallbackLangChangeSub) {
      this.onFallbackLangChangeSub.unsubscribe();
    }
    if (this.onTranslationChangeSub) {
      this.onTranslationChangeSub.unsubscribe();
    }
  }
  static \u0275fac = function TranslateDirective_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TranslateDirective)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _TranslateDirective,
    selectors: [["", "translate", ""], ["", "ngx-translate", ""]],
    inputs: {
      translate: "translate",
      translateParams: "translateParams"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateDirective, [{
    type: Directive,
    args: [{
      // eslint-disable-next-line @angular-eslint/directive-selector
      selector: "[translate],[ngx-translate]",
      standalone: true
    }]
  }], () => [], {
    translate: [{
      type: Input
    }],
    translateParams: [{
      type: Input
    }]
  });
})();
var TranslatePipe = class _TranslatePipe {
  translate = inject(TranslateService);
  _ref = inject(ChangeDetectorRef);
  value = "";
  lastKey = null;
  lastParams = [];
  onTranslationChange;
  onLangChange;
  onFallbackLangChange;
  updateValue(key, interpolateParams, translations) {
    const onTranslation = (res) => {
      this.value = res !== void 0 ? res : key;
      this.lastKey = key;
      this._ref.markForCheck();
    };
    if (translations) {
      const res = this.translate.getParsedResult(key, interpolateParams);
      if (isObservable(res)) {
        res.subscribe(onTranslation);
      } else {
        onTranslation(res);
      }
    }
    this.translate.get(key, interpolateParams).subscribe(onTranslation);
  }
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  transform(query, ...args) {
    if (!query || !query.length) {
      return query;
    }
    if (equals(query, this.lastKey) && equals(args, this.lastParams)) {
      return this.value;
    }
    let interpolateParams = void 0;
    if (isDefinedAndNotNull(args[0]) && args.length) {
      if (isString(args[0]) && args[0].length) {
        const validArgs = args[0].replace(/(')?([a-zA-Z0-9_]+)(')?(\s)?:/g, '"$2":').replace(/:(\s)?(')(.*?)(')/g, ':"$3"');
        try {
          interpolateParams = JSON.parse(validArgs);
        } catch (e) {
          void e;
          throw new SyntaxError(`Wrong parameter in TranslatePipe. Expected a valid Object, received: ${args[0]}`);
        }
      } else if (isDict(args[0])) {
        interpolateParams = args[0];
      }
    }
    this.lastKey = query;
    this.lastParams = args;
    this.updateValue(query, interpolateParams);
    this._dispose();
    if (!this.onTranslationChange) {
      this.onTranslationChange = this.translate.onTranslationChange.subscribe((event) => {
        if (this.lastKey && event.lang === this.translate.getCurrentLang() || event.lang === this.translate.getFallbackLang()) {
          this.lastKey = null;
          this.updateValue(query, interpolateParams, event.translations);
        }
      });
    }
    if (!this.onLangChange) {
      this.onLangChange = this.translate.onLangChange.subscribe((event) => {
        if (this.lastKey) {
          this.lastKey = null;
          this.updateValue(query, interpolateParams, event.translations);
        }
      });
    }
    if (!this.onFallbackLangChange) {
      this.onFallbackLangChange = this.translate.onFallbackLangChange.subscribe(() => {
        if (this.lastKey) {
          this.lastKey = null;
          this.updateValue(query, interpolateParams);
        }
      });
    }
    return this.value;
  }
  /**
   * Clean any existing subscription to change events
   */
  _dispose() {
    if (typeof this.onTranslationChange !== "undefined") {
      this.onTranslationChange.unsubscribe();
      this.onTranslationChange = void 0;
    }
    if (typeof this.onLangChange !== "undefined") {
      this.onLangChange.unsubscribe();
      this.onLangChange = void 0;
    }
    if (typeof this.onFallbackLangChange !== "undefined") {
      this.onFallbackLangChange.unsubscribe();
      this.onFallbackLangChange = void 0;
    }
  }
  ngOnDestroy() {
    this._dispose();
  }
  static \u0275fac = function TranslatePipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TranslatePipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({
    name: "translate",
    type: _TranslatePipe,
    pure: false
  });
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _TranslatePipe,
    factory: _TranslatePipe.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslatePipe, [{
    type: Injectable
  }, {
    type: Pipe,
    args: [{
      name: "translate",
      standalone: true,
      pure: false
      // required to update the value when the promise is resolved
    }]
  }], null, null);
})();
function provideTranslateLoader(loader) {
  return {
    provide: TranslateLoader,
    useClass: loader
  };
}
function provideTranslateCompiler(compiler) {
  return {
    provide: TranslateCompiler,
    useClass: compiler
  };
}
function provideTranslateParser(parser) {
  return {
    provide: TranslateParser,
    useClass: parser
  };
}
function provideMissingTranslationHandler(handler) {
  return {
    provide: MissingTranslationHandler,
    useClass: handler
  };
}
function provideTranslateService(config = {}) {
  return defaultProviders(__spreadValues({
    compiler: provideTranslateCompiler(TranslateNoOpCompiler),
    parser: provideTranslateParser(TranslateDefaultParser),
    loader: provideTranslateLoader(TranslateNoOpLoader),
    missingTranslationHandler: provideMissingTranslationHandler(DefaultMissingTranslationHandler)
  }, config), true);
}
function defaultProviders(config = {}, provideStore) {
  const providers = [];
  if (config.loader) {
    providers.push(config.loader);
  }
  if (config.compiler) {
    providers.push(config.compiler);
  }
  if (config.parser) {
    providers.push(config.parser);
  }
  if (config.missingTranslationHandler) {
    providers.push(config.missingTranslationHandler);
  }
  if (provideStore) {
    providers.push(TranslateStore);
  }
  if (config.useDefaultLang || config.defaultLanguage) {
    console.warn("The `useDefaultLang` and `defaultLanguage` options are deprecated. Please use `fallbackLang` instead.");
    if (config.useDefaultLang === true && config.defaultLanguage) {
      config.fallbackLang = config.defaultLanguage;
    }
  }
  const serviceConfig = {
    fallbackLang: config.fallbackLang ?? null,
    lang: config.lang,
    extend: config.extend ?? false
  };
  providers.push({
    provide: TRANSLATE_SERVICE_CONFIG,
    useValue: serviceConfig
  });
  providers.push({
    provide: TranslateService,
    useClass: TranslateService,
    deps: [TranslateStore, TranslateLoader, TranslateCompiler, TranslateParser, MissingTranslationHandler, TRANSLATE_SERVICE_CONFIG]
  });
  return providers;
}
var TranslateModule = class _TranslateModule {
  /**
   * Use this method in your root module to provide the TranslateService
   */
  static forRoot(config = {}) {
    return {
      ngModule: _TranslateModule,
      providers: [...defaultProviders(__spreadValues({
        compiler: provideTranslateCompiler(TranslateNoOpCompiler),
        parser: provideTranslateParser(TranslateDefaultParser),
        loader: provideTranslateLoader(TranslateNoOpLoader),
        missingTranslationHandler: provideMissingTranslationHandler(DefaultMissingTranslationHandler)
      }, config), true)]
    };
  }
  /**
   * Use this method in your other (non-root) modules to import the directive/pipe
   */
  static forChild(config = {}) {
    return {
      ngModule: _TranslateModule,
      providers: [...defaultProviders(config, config.isolate ?? false)]
    };
  }
  static \u0275fac = function TranslateModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _TranslateModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _TranslateModule,
    imports: [TranslatePipe, TranslateDirective],
    exports: [TranslatePipe, TranslateDirective]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TranslateModule, [{
    type: NgModule,
    args: [{
      imports: [TranslatePipe, TranslateDirective],
      exports: [TranslatePipe, TranslateDirective]
    }]
  }], null, null);
})();

// libs/core/router/data-access/src/lib/services/navigation.service.ts
var NavigationService = class _NavigationService {
  #router = inject(Router);
  #location = inject(Location);
  #destroyRef = inject(DestroyRef);
  #history = [];
  constructor() {
    this.#router.events.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.#history = [event.urlAfterRedirects, ...this.#history];
      }
    });
  }
  /**
   * @description Navigate to a concrete URL with params and extras if needed.
   * @param { NavigationProps } navigationProps The navigation configuration properties.
   * @returns {Promise<boolean>} A promise that resolves to true if navigation succeeds.
   */
  navigate({ path, extras }) {
    return this.#router.navigate(path, {
      queryParams: extras?.queryParams,
      fragment: extras?.fragment
    });
  }
  /**
   * @description Go back to previous URL.
   * @param {string} backBaseUrl The default back URL. Use it when we have no navigation history.
   * @param {RegExp} regex An instruction to accomplish when we want to redirect to an specific previous URL that must satisfy the regex pattern.
   * @returns {Promise<void>} A promise that resolves when the navigation is complete.
   */
  async back(backBaseUrl, regex) {
    if (this.#history.length && regex) {
      this.#history.shift();
      for (const url of this.#history) {
        if (regex.test(url)) {
          await this.#router.navigateByUrl(url);
          return;
        }
      }
    }
    if (backBaseUrl) {
      await this.#router.navigateByUrl(backBaseUrl || "/");
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
  #translateService = inject(TranslateService, { optional: true });
  /**
   * @description Update page title with the environment app name.
   * @param {RouterStateSnapshot} snapshot The state of the router at a moment in time.
   */
  updateTitle(snapshot) {
    const builtTitle = this.buildTitle(snapshot);
    const translatedTitle = this.#getTranslatedTitle(builtTitle);
    const fullTitle = this.#getPrefixedTitle(translatedTitle);
    this.#title.setTitle(fullTitle);
  }
  /**
   * @description Resolve the title using TranslateService when available.
   * @param {string | undefined} title The raw route title.
   * @returns {string | undefined} The translated or original title.
   */
  #getTranslatedTitle(title) {
    if (!title) {
      return void 0;
    }
    if (!this.#translateService) {
      return title;
    }
    return this.#translateService.instant(title);
  }
  /**
   * @description Prefix the title with the environment application name.
   * @param {string | undefined} title The (possibly translated) title.
   * @returns {string} The final title to set in the browser.
   */
  #getPrefixedTitle(title) {
    if (!title) {
      return `${this.#environment.name}`;
    }
    return `${this.#environment.name} - ${title}`;
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

// node_modules/@angular/cdk/fesm2022/_unique-selection-dispatcher-chunk.mjs
var UniqueSelectionDispatcher = class _UniqueSelectionDispatcher {
  _listeners = [];
  notify(id, name2) {
    for (let listener of this._listeners) {
      listener(id, name2);
    }
  }
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

// node_modules/@angular/cdk/fesm2022/_dispose-view-repeater-strategy-chunk.mjs
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

// node_modules/@angular/cdk/fesm2022/_selection-model-chunk.mjs
var SelectionModel = class {
  _multiple;
  _emitChanges;
  compareWith;
  _selection = /* @__PURE__ */ new Set();
  _deselectedToEmit = [];
  _selectedToEmit = [];
  _selected = null;
  get selected() {
    if (!this._selected) {
      this._selected = Array.from(this._selection.values());
    }
    return this._selected;
  }
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
  select(...values) {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._markSelected(value));
    const changed = this._hasQueuedChanges();
    this._emitChangeEvent();
    return changed;
  }
  deselect(...values) {
    this._verifyValueAssignment(values);
    values.forEach((value) => this._unmarkSelected(value));
    const changed = this._hasQueuedChanges();
    this._emitChangeEvent();
    return changed;
  }
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
  toggle(value) {
    return this.isSelected(value) ? this.deselect(value) : this.select(value);
  }
  clear(flushEvent = true) {
    this._unmarkAll();
    const changed = this._hasQueuedChanges();
    if (flushEvent) {
      this._emitChangeEvent();
    }
    return changed;
  }
  isSelected(value) {
    return this._selection.has(this._getConcreteValue(value));
  }
  isEmpty() {
    return this._selection.size === 0;
  }
  hasValue() {
    return !this.isEmpty();
  }
  sort(predicate) {
    if (this._multiple && this.selected) {
      this._selected.sort(predicate);
    }
  }
  isMultipleSelection() {
    return this._multiple;
  }
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
  _unmarkSelected(value) {
    value = this._getConcreteValue(value);
    if (this.isSelected(value)) {
      this._selection.delete(value);
      if (this._emitChanges) {
        this._deselectedToEmit.push(value);
      }
    }
  }
  _unmarkAll() {
    if (!this.isEmpty()) {
      this._selection.forEach((value) => this._unmarkSelected(value));
    }
  }
  _verifyValueAssignment(values) {
    if (values.length > 1 && !this._multiple && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMultipleValuesInSingleSelectionError();
    }
  }
  _hasQueuedChanges() {
    return !!(this._deselectedToEmit.length || this._selectedToEmit.length);
  }
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
  withDevtools,
  updateState,
  withImmutableState,
  activityStore,
  BaseDataService,
  createDataGetListServiceToken,
  ENVIRONMENT_WITH_API,
  provideWithApiEnv,
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
  LayoutObserverService,
  TranslatePipe,
  provideTranslateService,
  TranslateModule,
  routerActions,
  RouterStateEffects,
  routerReducers,
  CustomRouterSerializer,
  selectRouteQueryParams,
  NavigationFilterService,
  PrefixTitleService,
  NasaImagesFacade
};
//# sourceMappingURL=chunk-MLSR6425.js.map
