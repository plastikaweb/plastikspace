"use strict";
(self["webpackChunknasa_images"] = self["webpackChunknasa_images"] || []).push([["main"],{

/***/ 38:
/*!**********************************************************!*\
  !*** ./apps/nasa-images/src/environments/environment.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
const environment = {
  name: 'Nasa Images',
  production: false,
  baseApiUrl: 'https://images-api.nasa.gov'
};

/***/ }),

/***/ 183:
/*!***********************************************************************************!*\
  !*** ./libs/nasa-images/search/data-access/src/lib/+state/nasa-images.actions.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   nasaImagesAPIActions: () => (/* binding */ nasaImagesAPIActions),
/* harmony export */   nasaImagesPageActions: () => (/* binding */ nasaImagesPageActions)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ 9797);

const nasaImagesPageActions = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createActionGroup)({
  source: 'NasaImages/Page',
  events: {
    Load: (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)(),
    'Clean Up': (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.emptyProps)()
  }
});
const nasaImagesAPIActions = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createActionGroup)({
  source: 'NasaImages/API',
  events: {
    'Load Success': (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)(),
    'Load Failure': (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)()
  }
});

/***/ }),

/***/ 321:
/*!*****************************************************!*\
  !*** ./libs/core/cms-layout/ui/header/src/index.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CoreCmsLayoutUiHeaderComponent: () => (/* reexport safe */ _lib_core_cms_layout_ui_header_component__WEBPACK_IMPORTED_MODULE_0__.CoreCmsLayoutUiHeaderComponent)
/* harmony export */ });
/* harmony import */ var _lib_core_cms_layout_ui_header_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/core-cms-layout-ui-header.component */ 5249);


/***/ }),

/***/ 570:
/*!***********************************************************************************!*\
  !*** ./libs/shared/notification/data-access/src/lib/+state/notification.store.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   notificationStore: () => (/* binding */ notificationStore)
/* harmony export */ });
/* harmony import */ var _angular_architects_ngrx_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular-architects/ngrx-toolkit */ 1063);
/* harmony import */ var _ngrx_signals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/signals */ 3425);


const notificationStore = (0,_ngrx_signals__WEBPACK_IMPORTED_MODULE_1__.signalStore)({
  providedIn: 'root'
}, (0,_angular_architects_ngrx_toolkit__WEBPACK_IMPORTED_MODULE_0__.withDevtools)('notification'), (0,_ngrx_signals__WEBPACK_IMPORTED_MODULE_1__.withState)({
  configuration: null,
  preserveOnRouteRequest: false
}), (0,_ngrx_signals__WEBPACK_IMPORTED_MODULE_1__.withMethods)(store => ({
  show: (configuration, preserveOnRouteRequest) => {
    (0,_angular_architects_ngrx_toolkit__WEBPACK_IMPORTED_MODULE_0__.updateState)(store, `[notification] show`, {
      configuration,
      preserveOnRouteRequest: preserveOnRouteRequest ?? false
    });
  },
  dismiss: () => {
    (0,_angular_architects_ngrx_toolkit__WEBPACK_IMPORTED_MODULE_0__.updateState)(store, `[notification] dismiss`, {
      configuration: null,
      preserveOnRouteRequest: false
    });
  }
})));

/***/ }),

/***/ 611:
/*!*****************************************************************************************!*\
  !*** ./libs/nasa-images/search/data-access/src/lib/+state/nasa-images-search.facade.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NasaImagesSearchFacade: () => (/* binding */ NasaImagesSearchFacade)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ 9797);
/* harmony import */ var _plastik_core_router_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @plastik/core/router-state */ 3561);
/* harmony import */ var _plastik_nasa_images_data_access__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @plastik/nasa-images/data-access */ 9810);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 8374);
/* harmony import */ var _nasa_images_feature__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./nasa-images.feature */ 9286);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 3499);






class NasaImagesSearchFacade extends _plastik_nasa_images_data_access__WEBPACK_IMPORTED_MODULE_2__.NasaImagesFacade {
  images$ = this.store.pipe((0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.select)(_nasa_images_feature__WEBPACK_IMPORTED_MODULE_4__.selectNasaImagesFeature.selectAll));
  isActiveSearch$ = this.store.pipe((0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.select)(_nasa_images_feature__WEBPACK_IMPORTED_MODULE_4__.selectNasaImagesFeature.selectIsActiveSearch));
  search(params) {
    this.store.dispatch(_plastik_core_router_state__WEBPACK_IMPORTED_MODULE_1__.routerActions.go({
      path: [],
      extras: {
        queryParams: {
          ...params,
          page: '1'
        },
        queryParamsHandling: 'merge'
      }
    }));
  }
  changePagination({
    pageIndex
  }) {
    this.store.select(_plastik_core_router_state__WEBPACK_IMPORTED_MODULE_1__.selectRouteQueryParams).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.take)(1)).subscribe(queryParams => {
      this.store.dispatch(_plastik_core_router_state__WEBPACK_IMPORTED_MODULE_1__.routerActions.go({
        path: [],
        extras: {
          queryParams: {
            ...queryParams,
            page: ++pageIndex
          },
          queryParamsHandling: 'merge'
        }
      }));
    });
  }
  static ɵfac = /*@__PURE__*/(() => {
    let ɵNasaImagesSearchFacade_BaseFactory;
    return function NasaImagesSearchFacade_Factory(__ngFactoryType__) {
      return (ɵNasaImagesSearchFacade_BaseFactory || (ɵNasaImagesSearchFacade_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetInheritedFactory"](NasaImagesSearchFacade)))(__ngFactoryType__ || NasaImagesSearchFacade);
    };
  })();
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
    token: NasaImagesSearchFacade,
    factory: NasaImagesSearchFacade.ɵfac
  });
}

/***/ }),

/***/ 906:
/*!********************************************************!*\
  !*** ./libs/shared/notification/entities/src/index.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NOTIFICATION_TYPES_CONFIG: () => (/* reexport safe */ _notification_config__WEBPACK_IMPORTED_MODULE_1__.NOTIFICATION_TYPES_CONFIG),
/* harmony export */   defaultNotification: () => (/* reexport safe */ _notification_config__WEBPACK_IMPORTED_MODULE_1__.defaultNotification)
/* harmony export */ });
/* harmony import */ var _notification__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./notification */ 1894);
/* harmony import */ var _notification_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./notification-config */ 4017);



/***/ }),

/***/ 927:
/*!****************************************************************************!*\
  !*** ./libs/core/cms-layout/entities/src/core-cms-layout-header-config.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CORE_CMS_LAYOUT_HEADER_CONFIG: () => (/* binding */ CORE_CMS_LAYOUT_HEADER_CONFIG)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);

const CORE_CMS_LAYOUT_HEADER_CONFIG = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('CORE_CMS_LAYOUT_HEADER_CONFIG');

/***/ }),

/***/ 1339:
/*!***************************************************!*\
  !*** ./libs/shared/util/latinize/src/latinize.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   latinize: () => (/* binding */ latinize)
/* harmony export */ });
const characters = {
  Á: 'A',
  Ă: 'A',
  Ắ: 'A',
  Ặ: 'A',
  Ằ: 'A',
  Ẳ: 'A',
  Ẵ: 'A',
  Ǎ: 'A',
  Â: 'A',
  Ấ: 'A',
  Ậ: 'A',
  Ầ: 'A',
  Ẩ: 'A',
  Ẫ: 'A',
  Ä: 'A',
  Ǟ: 'A',
  Ȧ: 'A',
  Ǡ: 'A',
  Ạ: 'A',
  Ȁ: 'A',
  À: 'A',
  Ả: 'A',
  Ȃ: 'A',
  Ā: 'A',
  Ą: 'A',
  Å: 'A',
  Ǻ: 'A',
  Ḁ: 'A',
  Ⱥ: 'A',
  Ã: 'A',
  Ꜳ: 'AA',
  Æ: 'AE',
  Ǽ: 'AE',
  Ǣ: 'AE',
  Ꜵ: 'AO',
  Ꜷ: 'AU',
  Ꜹ: 'AV',
  Ꜻ: 'AV',
  Ꜽ: 'AY',
  Ḃ: 'B',
  Ḅ: 'B',
  Ɓ: 'B',
  Ḇ: 'B',
  Ƀ: 'B',
  Ƃ: 'B',
  Ć: 'C',
  Č: 'C',
  Ç: 'C',
  Ḉ: 'C',
  Ĉ: 'C',
  Ċ: 'C',
  Ƈ: 'C',
  Ȼ: 'C',
  Ď: 'D',
  Ḑ: 'D',
  Ḓ: 'D',
  Ḋ: 'D',
  Ḍ: 'D',
  Ɗ: 'D',
  Ḏ: 'D',
  ǲ: 'D',
  ǅ: 'D',
  Đ: 'D',
  Ð: 'D',
  Ƌ: 'D',
  Ǳ: 'DZ',
  Ǆ: 'DZ',
  É: 'E',
  Ĕ: 'E',
  Ě: 'E',
  Ȩ: 'E',
  Ḝ: 'E',
  Ê: 'E',
  Ế: 'E',
  Ệ: 'E',
  Ề: 'E',
  Ể: 'E',
  Ễ: 'E',
  Ḙ: 'E',
  Ë: 'E',
  Ė: 'E',
  Ẹ: 'E',
  Ȅ: 'E',
  È: 'E',
  Ẻ: 'E',
  Ȇ: 'E',
  Ē: 'E',
  Ḗ: 'E',
  Ḕ: 'E',
  Ę: 'E',
  Ɇ: 'E',
  Ẽ: 'E',
  Ḛ: 'E',
  Ꝫ: 'ET',
  Ḟ: 'F',
  Ƒ: 'F',
  Ǵ: 'G',
  Ğ: 'G',
  Ǧ: 'G',
  Ģ: 'G',
  Ĝ: 'G',
  Ġ: 'G',
  Ɠ: 'G',
  Ḡ: 'G',
  Ǥ: 'G',
  Ḫ: 'H',
  Ȟ: 'H',
  Ḩ: 'H',
  Ĥ: 'H',
  Ⱨ: 'H',
  Ḧ: 'H',
  Ḣ: 'H',
  Ḥ: 'H',
  Ħ: 'H',
  Í: 'I',
  Ĭ: 'I',
  Ǐ: 'I',
  Î: 'I',
  Ï: 'I',
  Ḯ: 'I',
  İ: 'I',
  Ị: 'I',
  Ȉ: 'I',
  Ì: 'I',
  Ỉ: 'I',
  Ȋ: 'I',
  Ī: 'I',
  Į: 'I',
  Ɨ: 'I',
  Ĩ: 'I',
  Ḭ: 'I',
  І: 'I',
  Ꝺ: 'D',
  Ꝼ: 'F',
  Ᵹ: 'G',
  Ꞃ: 'R',
  Ꞅ: 'S',
  Ꞇ: 'T',
  Ꝭ: 'IS',
  Ĵ: 'J',
  Ɉ: 'J',
  Ḱ: 'K',
  Ǩ: 'K',
  Ķ: 'K',
  Ⱪ: 'K',
  Ꝃ: 'K',
  Ḳ: 'K',
  Ƙ: 'K',
  Ḵ: 'K',
  Ꝁ: 'K',
  Ꝅ: 'K',
  Ĺ: 'L',
  Ƚ: 'L',
  Ľ: 'L',
  Ļ: 'L',
  Ḽ: 'L',
  Ḷ: 'L',
  Ḹ: 'L',
  Ⱡ: 'L',
  Ꝉ: 'L',
  Ḻ: 'L',
  Ŀ: 'L',
  Ɫ: 'L',
  ǈ: 'L',
  Ł: 'L',
  Ǉ: 'LJ',
  Ḿ: 'M',
  Ṁ: 'M',
  Ṃ: 'M',
  Ɱ: 'M',
  Ń: 'N',
  Ň: 'N',
  Ņ: 'N',
  Ṋ: 'N',
  Ṅ: 'N',
  Ṇ: 'N',
  Ǹ: 'N',
  Ɲ: 'N',
  Ṉ: 'N',
  Ƞ: 'N',
  ǋ: 'N',
  Ñ: 'N',
  Ǌ: 'NJ',
  Ó: 'O',
  Ŏ: 'O',
  Ǒ: 'O',
  Ô: 'O',
  Ố: 'O',
  Ộ: 'O',
  Ồ: 'O',
  Ổ: 'O',
  Ỗ: 'O',
  Ö: 'O',
  Ȫ: 'O',
  Ȯ: 'O',
  Ȱ: 'O',
  Ọ: 'O',
  Ő: 'O',
  Ȍ: 'O',
  Ò: 'O',
  Ỏ: 'O',
  Ơ: 'O',
  Ớ: 'O',
  Ợ: 'O',
  Ờ: 'O',
  Ở: 'O',
  Ỡ: 'O',
  Ȏ: 'O',
  Ꝋ: 'O',
  Ꝍ: 'O',
  Ō: 'O',
  Ṓ: 'O',
  Ṑ: 'O',
  Ɵ: 'O',
  Ǫ: 'O',
  Ǭ: 'O',
  Ø: 'O',
  Ǿ: 'O',
  Õ: 'O',
  Ṍ: 'O',
  Ṏ: 'O',
  Ȭ: 'O',
  Ƣ: 'OI',
  Ꝏ: 'OO',
  Ɛ: 'E',
  Ɔ: 'O',
  Ȣ: 'OU',
  Ṕ: 'P',
  Ṗ: 'P',
  Ꝓ: 'P',
  Ƥ: 'P',
  Ꝕ: 'P',
  Ᵽ: 'P',
  Ꝑ: 'P',
  Ꝙ: 'Q',
  Ꝗ: 'Q',
  Ŕ: 'R',
  Ř: 'R',
  Ŗ: 'R',
  Ṙ: 'R',
  Ṛ: 'R',
  Ṝ: 'R',
  Ȑ: 'R',
  Ȓ: 'R',
  Ṟ: 'R',
  Ɍ: 'R',
  Ɽ: 'R',
  Ꜿ: 'C',
  Ǝ: 'E',
  Ś: 'S',
  Ṥ: 'S',
  Š: 'S',
  Ṧ: 'S',
  Ş: 'S',
  Ŝ: 'S',
  Ș: 'S',
  Ṡ: 'S',
  Ṣ: 'S',
  Ṩ: 'S',
  ß: 'ss',
  Ť: 'T',
  Ţ: 'T',
  Ṱ: 'T',
  Ț: 'T',
  Ⱦ: 'T',
  Ṫ: 'T',
  Ṭ: 'T',
  Ƭ: 'T',
  Ṯ: 'T',
  Ʈ: 'T',
  Ŧ: 'T',
  Ɐ: 'A',
  Ꞁ: 'L',
  Ɯ: 'M',
  Ʌ: 'V',
  Ꜩ: 'TZ',
  Ú: 'U',
  Ŭ: 'U',
  Ǔ: 'U',
  Û: 'U',
  Ṷ: 'U',
  Ü: 'U',
  Ǘ: 'U',
  Ǚ: 'U',
  Ǜ: 'U',
  Ǖ: 'U',
  Ṳ: 'U',
  Ụ: 'U',
  Ű: 'U',
  Ȕ: 'U',
  Ù: 'U',
  Ủ: 'U',
  Ư: 'U',
  Ứ: 'U',
  Ự: 'U',
  Ừ: 'U',
  Ử: 'U',
  Ữ: 'U',
  Ȗ: 'U',
  Ū: 'U',
  Ṻ: 'U',
  Ų: 'U',
  Ů: 'U',
  Ũ: 'U',
  Ṹ: 'U',
  Ṵ: 'U',
  Ꝟ: 'V',
  Ṿ: 'V',
  Ʋ: 'V',
  Ṽ: 'V',
  Ꝡ: 'VY',
  Ẃ: 'W',
  Ŵ: 'W',
  Ẅ: 'W',
  Ẇ: 'W',
  Ẉ: 'W',
  Ẁ: 'W',
  Ⱳ: 'W',
  Ẍ: 'X',
  Ẋ: 'X',
  Ý: 'Y',
  Ŷ: 'Y',
  Ÿ: 'Y',
  Ẏ: 'Y',
  Ỵ: 'Y',
  Ỳ: 'Y',
  Ƴ: 'Y',
  Ỷ: 'Y',
  Ỿ: 'Y',
  Ȳ: 'Y',
  Ɏ: 'Y',
  Ỹ: 'Y',
  Ї: 'YI',
  Ź: 'Z',
  Ž: 'Z',
  Ẑ: 'Z',
  Ⱬ: 'Z',
  Ż: 'Z',
  Ẓ: 'Z',
  Ȥ: 'Z',
  Ẕ: 'Z',
  Ƶ: 'Z',
  Þ: 'TH',
  Ĳ: 'IJ',
  Œ: 'OE',
  ᴀ: 'A',
  ᴁ: 'AE',
  ʙ: 'B',
  ᴃ: 'B',
  ᴄ: 'C',
  ᴅ: 'D',
  ᴇ: 'E',
  ꜰ: 'F',
  ɢ: 'G',
  ʛ: 'G',
  ʜ: 'H',
  ɪ: 'I',
  ʁ: 'R',
  ᴊ: 'J',
  ᴋ: 'K',
  ʟ: 'L',
  ᴌ: 'L',
  ᴍ: 'M',
  ɴ: 'N',
  ᴏ: 'O',
  ɶ: 'OE',
  ᴐ: 'O',
  ᴕ: 'OU',
  ᴘ: 'P',
  ʀ: 'R',
  ᴎ: 'N',
  ᴙ: 'R',
  ꜱ: 'S',
  ᴛ: 'T',
  ⱻ: 'E',
  ᴚ: 'R',
  ᴜ: 'U',
  ᴠ: 'V',
  ᴡ: 'W',
  ʏ: 'Y',
  ᴢ: 'Z',
  á: 'a',
  ă: 'a',
  ắ: 'a',
  ặ: 'a',
  ằ: 'a',
  ẳ: 'a',
  ẵ: 'a',
  ǎ: 'a',
  â: 'a',
  ấ: 'a',
  ậ: 'a',
  ầ: 'a',
  ẩ: 'a',
  ẫ: 'a',
  ä: 'a',
  ǟ: 'a',
  ȧ: 'a',
  ǡ: 'a',
  ạ: 'a',
  ȁ: 'a',
  à: 'a',
  ả: 'a',
  ȃ: 'a',
  ā: 'a',
  ą: 'a',
  ᶏ: 'a',
  ẚ: 'a',
  å: 'a',
  ǻ: 'a',
  ḁ: 'a',
  ⱥ: 'a',
  ã: 'a',
  ꜳ: 'aa',
  æ: 'ae',
  ǽ: 'ae',
  ǣ: 'ae',
  ꜵ: 'ao',
  ꜷ: 'au',
  ꜹ: 'av',
  ꜻ: 'av',
  ꜽ: 'ay',
  ḃ: 'b',
  ḅ: 'b',
  ɓ: 'b',
  ḇ: 'b',
  ᵬ: 'b',
  ᶀ: 'b',
  ƀ: 'b',
  ƃ: 'b',
  ɵ: 'o',
  ć: 'c',
  č: 'c',
  ç: 'c',
  ḉ: 'c',
  ĉ: 'c',
  ɕ: 'c',
  ċ: 'c',
  ƈ: 'c',
  ȼ: 'c',
  ď: 'd',
  ḑ: 'd',
  ḓ: 'd',
  ȡ: 'd',
  ḋ: 'd',
  ḍ: 'd',
  ɗ: 'd',
  ᶑ: 'd',
  ḏ: 'd',
  ᵭ: 'd',
  ᶁ: 'd',
  đ: 'd',
  ɖ: 'd',
  ƌ: 'd',
  ð: 'd',
  ı: 'i',
  ȷ: 'j',
  ɟ: 'j',
  ʄ: 'j',
  ǳ: 'dz',
  ǆ: 'dz',
  é: 'e',
  ĕ: 'e',
  ě: 'e',
  ȩ: 'e',
  ḝ: 'e',
  ê: 'e',
  ế: 'e',
  ệ: 'e',
  ề: 'e',
  ể: 'e',
  ễ: 'e',
  ḙ: 'e',
  ë: 'e',
  ė: 'e',
  ẹ: 'e',
  ȅ: 'e',
  è: 'e',
  ẻ: 'e',
  ȇ: 'e',
  ē: 'e',
  ḗ: 'e',
  ḕ: 'e',
  ⱸ: 'e',
  ę: 'e',
  ᶒ: 'e',
  ɇ: 'e',
  ẽ: 'e',
  ḛ: 'e',
  ꝫ: 'et',
  ḟ: 'f',
  ƒ: 'f',
  ᵮ: 'f',
  ᶂ: 'f',
  ǵ: 'g',
  ğ: 'g',
  ǧ: 'g',
  ģ: 'g',
  ĝ: 'g',
  ġ: 'g',
  ɠ: 'g',
  ḡ: 'g',
  ᶃ: 'g',
  ǥ: 'g',
  ḫ: 'h',
  ȟ: 'h',
  ḩ: 'h',
  ĥ: 'h',
  ⱨ: 'h',
  ḧ: 'h',
  ḣ: 'h',
  ḥ: 'h',
  ɦ: 'h',
  ẖ: 'h',
  ħ: 'h',
  ƕ: 'hv',
  í: 'i',
  ĭ: 'i',
  ǐ: 'i',
  î: 'i',
  ï: 'i',
  ḯ: 'i',
  ị: 'i',
  ȉ: 'i',
  ì: 'i',
  ỉ: 'i',
  ȋ: 'i',
  ī: 'i',
  į: 'i',
  ᶖ: 'i',
  ɨ: 'i',
  ĩ: 'i',
  ḭ: 'i',
  і: 'i',
  ꝺ: 'd',
  ꝼ: 'f',
  ᵹ: 'g',
  ꞃ: 'r',
  ꞅ: 's',
  ꞇ: 't',
  ꝭ: 'is',
  ǰ: 'j',
  ĵ: 'j',
  ʝ: 'j',
  ɉ: 'j',
  ḱ: 'k',
  ǩ: 'k',
  ķ: 'k',
  ⱪ: 'k',
  ꝃ: 'k',
  ḳ: 'k',
  ƙ: 'k',
  ḵ: 'k',
  ᶄ: 'k',
  ꝁ: 'k',
  ꝅ: 'k',
  ĺ: 'l',
  ƚ: 'l',
  ɬ: 'l',
  ľ: 'l',
  ļ: 'l',
  ḽ: 'l',
  ȴ: 'l',
  ḷ: 'l',
  ḹ: 'l',
  ⱡ: 'l',
  ꝉ: 'l',
  ḻ: 'l',
  ŀ: 'l',
  ɫ: 'l',
  ᶅ: 'l',
  ɭ: 'l',
  ł: 'l',
  ǉ: 'lj',
  ſ: 's',
  ẜ: 's',
  ẛ: 's',
  ẝ: 's',
  ḿ: 'm',
  ṁ: 'm',
  ṃ: 'm',
  ɱ: 'm',
  ᵯ: 'm',
  ᶆ: 'm',
  ń: 'n',
  ň: 'n',
  ņ: 'n',
  ṋ: 'n',
  ȵ: 'n',
  ṅ: 'n',
  ṇ: 'n',
  ǹ: 'n',
  ɲ: 'n',
  ṉ: 'n',
  ƞ: 'n',
  ᵰ: 'n',
  ᶇ: 'n',
  ɳ: 'n',
  ñ: 'n',
  ǌ: 'nj',
  ó: 'o',
  ŏ: 'o',
  ǒ: 'o',
  ô: 'o',
  ố: 'o',
  ộ: 'o',
  ồ: 'o',
  ổ: 'o',
  ỗ: 'o',
  ö: 'o',
  ȫ: 'o',
  ȯ: 'o',
  ȱ: 'o',
  ọ: 'o',
  ő: 'o',
  ȍ: 'o',
  ò: 'o',
  ỏ: 'o',
  ơ: 'o',
  ớ: 'o',
  ợ: 'o',
  ờ: 'o',
  ở: 'o',
  ỡ: 'o',
  ȏ: 'o',
  ꝋ: 'o',
  ꝍ: 'o',
  ⱺ: 'o',
  ō: 'o',
  ṓ: 'o',
  ṑ: 'o',
  ǫ: 'o',
  ǭ: 'o',
  ø: 'o',
  ǿ: 'o',
  õ: 'o',
  ṍ: 'o',
  ṏ: 'o',
  ȭ: 'o',
  ƣ: 'oi',
  ꝏ: 'oo',
  ɛ: 'e',
  ᶓ: 'e',
  ɔ: 'o',
  ᶗ: 'o',
  ȣ: 'ou',
  ṕ: 'p',
  ṗ: 'p',
  ꝓ: 'p',
  ƥ: 'p',
  ᵱ: 'p',
  ᶈ: 'p',
  ꝕ: 'p',
  ᵽ: 'p',
  ꝑ: 'p',
  ꝙ: 'q',
  ʠ: 'q',
  ɋ: 'q',
  ꝗ: 'q',
  ŕ: 'r',
  ř: 'r',
  ŗ: 'r',
  ṙ: 'r',
  ṛ: 'r',
  ṝ: 'r',
  ȑ: 'r',
  ɾ: 'r',
  ᵳ: 'r',
  ȓ: 'r',
  ṟ: 'r',
  ɼ: 'r',
  ᵲ: 'r',
  ᶉ: 'r',
  ɍ: 'r',
  ɽ: 'r',
  ↄ: 'c',
  ꜿ: 'c',
  ɘ: 'e',
  ɿ: 'r',
  ś: 's',
  ṥ: 's',
  š: 's',
  ṧ: 's',
  ş: 's',
  ŝ: 's',
  ș: 's',
  ṡ: 's',
  ṣ: 's',
  ṩ: 's',
  ʂ: 's',
  ᵴ: 's',
  ᶊ: 's',
  ȿ: 's',
  ɡ: 'g',
  ᴑ: 'o',
  ᴓ: 'o',
  ᴝ: 'u',
  ť: 't',
  ţ: 't',
  ṱ: 't',
  ț: 't',
  ȶ: 't',
  ẗ: 't',
  ⱦ: 't',
  ṫ: 't',
  ṭ: 't',
  ƭ: 't',
  ṯ: 't',
  ᵵ: 't',
  ƫ: 't',
  ʈ: 't',
  ŧ: 't',
  ᵺ: 'th',
  ɐ: 'a',
  ᴂ: 'ae',
  ǝ: 'e',
  ᵷ: 'g',
  ɥ: 'h',
  ʮ: 'h',
  ʯ: 'h',
  ᴉ: 'i',
  ʞ: 'k',
  ꞁ: 'l',
  ɯ: 'm',
  ɰ: 'm',
  ᴔ: 'oe',
  ɹ: 'r',
  ɻ: 'r',
  ɺ: 'r',
  ⱹ: 'r',
  ʇ: 't',
  ʌ: 'v',
  ʍ: 'w',
  ʎ: 'y',
  ꜩ: 'tz',
  ú: 'u',
  ŭ: 'u',
  ǔ: 'u',
  û: 'u',
  ṷ: 'u',
  ü: 'u',
  ǘ: 'u',
  ǚ: 'u',
  ǜ: 'u',
  ǖ: 'u',
  ṳ: 'u',
  ụ: 'u',
  ű: 'u',
  ȕ: 'u',
  ù: 'u',
  ủ: 'u',
  ư: 'u',
  ứ: 'u',
  ự: 'u',
  ừ: 'u',
  ử: 'u',
  ữ: 'u',
  ȗ: 'u',
  ū: 'u',
  ṻ: 'u',
  ų: 'u',
  ᶙ: 'u',
  ů: 'u',
  ũ: 'u',
  ṹ: 'u',
  ṵ: 'u',
  ᵫ: 'ue',
  ꝸ: 'um',
  ⱴ: 'v',
  ꝟ: 'v',
  ṿ: 'v',
  ʋ: 'v',
  ᶌ: 'v',
  ⱱ: 'v',
  ṽ: 'v',
  ꝡ: 'vy',
  ẃ: 'w',
  ŵ: 'w',
  ẅ: 'w',
  ẇ: 'w',
  ẉ: 'w',
  ẁ: 'w',
  ⱳ: 'w',
  ẘ: 'w',
  ẍ: 'x',
  ẋ: 'x',
  ᶍ: 'x',
  ý: 'y',
  ŷ: 'y',
  ÿ: 'y',
  ẏ: 'y',
  ỵ: 'y',
  ỳ: 'y',
  ƴ: 'y',
  ỷ: 'y',
  ỿ: 'y',
  ȳ: 'y',
  ẙ: 'y',
  ɏ: 'y',
  ỹ: 'y',
  ї: 'yi',
  ź: 'z',
  ž: 'z',
  ẑ: 'z',
  ʑ: 'z',
  ⱬ: 'z',
  ż: 'z',
  ẓ: 'z',
  ȥ: 'z',
  ẕ: 'z',
  ᵶ: 'z',
  ᶎ: 'z',
  ʐ: 'z',
  ƶ: 'z',
  ɀ: 'z',
  þ: 'th',
  ﬀ: 'ff',
  ﬃ: 'ffi',
  ﬄ: 'ffl',
  ﬁ: 'fi',
  ﬂ: 'fl',
  ĳ: 'ij',
  œ: 'oe',
  ﬆ: 'st',
  ₐ: 'a',
  ₑ: 'e',
  ᵢ: 'i',
  ⱼ: 'j',
  ₒ: 'o',
  ᵣ: 'r',
  ᵤ: 'u',
  ᵥ: 'v',
  ₓ: 'x',
  Ё: 'YO',
  Й: 'I',
  Ц: 'TS',
  У: 'U',
  К: 'K',
  Е: 'E',
  Н: 'N',
  Г: 'G',
  Ґ: 'G',
  Ш: 'SH',
  Щ: 'SCH',
  З: 'Z',
  Х: 'H',
  Ъ: "'",
  ё: 'yo',
  й: 'i',
  ц: 'ts',
  у: 'u',
  к: 'k',
  е: 'e',
  н: 'n',
  г: 'g',
  ґ: 'g',
  ш: 'sh',
  щ: 'sch',
  з: 'z',
  х: 'h',
  ъ: "'",
  Ф: 'F',
  Ы: 'I',
  В: 'V',
  А: 'a',
  П: 'P',
  Р: 'R',
  О: 'O',
  Л: 'L',
  Д: 'D',
  Ж: 'ZH',
  Э: 'E',
  ф: 'f',
  ы: 'i',
  в: 'v',
  а: 'a',
  п: 'p',
  р: 'r',
  о: 'o',
  л: 'l',
  д: 'd',
  ж: 'zh',
  э: 'e',
  Я: 'Ya',
  Ч: 'CH',
  С: 'S',
  М: 'M',
  И: 'I',
  Т: 'T',
  Ь: "'",
  Б: 'B',
  Ю: 'YU',
  я: 'ya',
  ч: 'ch',
  с: 's',
  м: 'm',
  и: 'i',
  т: 't',
  ь: "'",
  б: 'b',
  ю: 'yu'
};
/**
 * Converts a string to its Latinized form.
 * @param {string} str - The input string.
 * @returns {string} The Latinized string.
 */
function latinize(str) {
  return str.replace(/[^A-Za-z0-9]/g, function (x) {
    return characters[x] || x;
  });
}

/***/ }),

/***/ 1455:
/*!**************************************!*\
  !*** ./apps/nasa-images/src/main.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ 4800);
/* harmony import */ var _app_app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/app.component */ 7242);
/* harmony import */ var _app_app_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.config */ 6299);



// eslint-disable-next-line no-console
(0,_angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__.bootstrapApplication)(_app_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent, _app_app_config__WEBPACK_IMPORTED_MODULE_2__.appConfig).catch(err => console.error(err));

/***/ }),

/***/ 1528:
/*!****************************************************************************************!*\
  !*** ./libs/shared/notification/data-access/src/lib/services/error-handler.service.ts ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorHandlerService: () => (/* binding */ ErrorHandlerService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _state_notification_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../+state/notification.store */ 570);
/* harmony import */ var _notification_config_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./notification-config.service */ 9195);




class ErrorHandlerService {
  notificationService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_notification_config_service__WEBPACK_IMPORTED_MODULE_2__.NotificationConfigService);
  injector = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_0__.Injector);
  handleError(error) {
    const store = this.injector.get(_state_notification_store__WEBPACK_IMPORTED_MODULE_1__.notificationStore);
    let message = '';
    if (error instanceof ErrorEvent || error instanceof Error) {
      message = error?.message.includes('ChunkLoadError') ? error.message.split('.')[0] : error.message;
    } else {
      message = error;
    }
    store.show(this.notificationService.getInstance({
      type: 'ERROR',
      message,
      action: 'tancar'
    }));
  }
  static ɵfac = function ErrorHandlerService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ErrorHandlerService)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: ErrorHandlerService,
    factory: ErrorHandlerService.ɵfac
  });
}

/***/ }),

/***/ 1894:
/*!***************************************************************!*\
  !*** ./libs/shared/notification/entities/src/notification.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ 2071:
/*!**************************************************!*\
  !*** ./libs/core/util/environments/src/index.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ENVIRONMENT: () => (/* reexport safe */ _environment_token__WEBPACK_IMPORTED_MODULE_2__.ENVIRONMENT),
/* harmony export */   provideEnvironmentMock: () => (/* reexport safe */ _environment_mock__WEBPACK_IMPORTED_MODULE_1__.provideEnvironmentMock)
/* harmony export */ });
/* harmony import */ var _environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./environment */ 9502);
/* harmony import */ var _environment_mock__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment.mock */ 8572);
/* harmony import */ var _environment_token__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./environment.token */ 2569);




/***/ }),

/***/ 2475:
/*!***********************************************!*\
  !*** ./libs/core/entities/src/view-config.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getVisibleNavigationList: () => (/* binding */ getVisibleNavigationList)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _plastik_shared_objects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @plastik/shared/objects */ 8235);


/**
 * @description Returns an array with just the includedInNavigation ViewConfig elements.
 * @param {ViewsConfigRecord} viewsConfig The app views configuration.
 * @returns {Signal<ViewConfig[]>}.
 */
function getVisibleNavigationList(viewsConfig) {
  return (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.signal)((0,_plastik_shared_objects__WEBPACK_IMPORTED_MODULE_1__.collectionToArray)(viewsConfig).filter(viewConfig => viewConfig.includedInNavigation));
}

/***/ }),

/***/ 2569:
/*!**************************************************************!*\
  !*** ./libs/core/util/environments/src/environment.token.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ENVIRONMENT: () => (/* binding */ ENVIRONMENT)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);

const ENVIRONMENT = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('ENVIRONMENT');

/***/ }),

/***/ 2882:
/*!*******************************************************!*\
  !*** ./libs/core/cms-layout/data-access/src/index.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CoreCmsLayoutDataAccessModule: () => (/* reexport safe */ _lib_core_cms_layout_data_access_module__WEBPACK_IMPORTED_MODULE_2__.CoreCmsLayoutDataAccessModule),
/* harmony export */   LayoutFacade: () => (/* reexport safe */ _lib_state_layout_facade__WEBPACK_IMPORTED_MODULE_1__.LayoutFacade),
/* harmony export */   VIEW_CONFIG: () => (/* reexport safe */ _lib_core_cms_view_config__WEBPACK_IMPORTED_MODULE_3__.VIEW_CONFIG),
/* harmony export */   layoutActions: () => (/* reexport safe */ _lib_state_layout_actions__WEBPACK_IMPORTED_MODULE_0__.layoutActions)
/* harmony export */ });
/* harmony import */ var _lib_state_layout_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/+state/layout.actions */ 4502);
/* harmony import */ var _lib_state_layout_facade__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/+state/layout.facade */ 9567);
/* harmony import */ var _lib_core_cms_layout_data_access_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/core-cms-layout-data-access.module */ 9086);
/* harmony import */ var _lib_core_cms_view_config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/core-cms-view-config */ 5628);





/***/ }),

/***/ 2905:
/*!*****************************************!*\
  !*** ./libs/core/util/api/src/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   API_SERVICE_TOKEN: () => (/* reexport safe */ _lib_data_crud__WEBPACK_IMPORTED_MODULE_2__.API_SERVICE_TOKEN),
/* harmony export */   ApiService: () => (/* reexport safe */ _lib_api_service__WEBPACK_IMPORTED_MODULE_0__.ApiService),
/* harmony export */   BaseDataService: () => (/* reexport safe */ _lib_base_data_service__WEBPACK_IMPORTED_MODULE_1__.BaseDataService),
/* harmony export */   DATA_CREATE_SERVICE_TOKEN: () => (/* reexport safe */ _lib_data_crud__WEBPACK_IMPORTED_MODULE_2__.DATA_CREATE_SERVICE_TOKEN),
/* harmony export */   DATA_GET_LIST_SERVICE_TOKEN: () => (/* reexport safe */ _lib_data_crud__WEBPACK_IMPORTED_MODULE_2__.DATA_GET_LIST_SERVICE_TOKEN),
/* harmony export */   DATA_GET_ONE_SERVICE_TOKEN: () => (/* reexport safe */ _lib_data_crud__WEBPACK_IMPORTED_MODULE_2__.DATA_GET_ONE_SERVICE_TOKEN),
/* harmony export */   DATA_READ_SERVICE_TOKEN: () => (/* reexport safe */ _lib_data_crud__WEBPACK_IMPORTED_MODULE_2__.DATA_READ_SERVICE_TOKEN),
/* harmony export */   DATA_UPDATE_SERVICE_TOKEN: () => (/* reexport safe */ _lib_data_crud__WEBPACK_IMPORTED_MODULE_2__.DATA_UPDATE_SERVICE_TOKEN),
/* harmony export */   DATA_WRITE_SERVICE_TOKEN: () => (/* reexport safe */ _lib_data_crud__WEBPACK_IMPORTED_MODULE_2__.DATA_WRITE_SERVICE_TOKEN),
/* harmony export */   PocketBaseService: () => (/* reexport safe */ _lib_pocketbase_service__WEBPACK_IMPORTED_MODULE_4__.PocketBaseService),
/* harmony export */   createDataGetListServiceToken: () => (/* reexport safe */ _lib_data_crud_tokens__WEBPACK_IMPORTED_MODULE_3__.createDataGetListServiceToken),
/* harmony export */   createDataReadServiceToken: () => (/* reexport safe */ _lib_data_crud_tokens__WEBPACK_IMPORTED_MODULE_3__.createDataReadServiceToken),
/* harmony export */   createDataServiceToken: () => (/* reexport safe */ _lib_data_crud_tokens__WEBPACK_IMPORTED_MODULE_3__.createDataServiceToken),
/* harmony export */   createDataWriteServiceToken: () => (/* reexport safe */ _lib_data_crud_tokens__WEBPACK_IMPORTED_MODULE_3__.createDataWriteServiceToken)
/* harmony export */ });
/* harmony import */ var _lib_api_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/api.service */ 9644);
/* harmony import */ var _lib_base_data_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/base-data.service */ 9276);
/* harmony import */ var _lib_data_crud__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/data-crud */ 3462);
/* harmony import */ var _lib_data_crud_tokens__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/data-crud.tokens */ 8464);
/* harmony import */ var _lib_pocketbase_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/pocketbase.service */ 7547);






/***/ }),

/***/ 3108:
/*!**********************************************************************************************************!*\
  !*** ./libs/shared/activity/ui/src/lib/shared-activity-ui-linear/shared-activity-ui-linear.component.ts ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharedActivityUiLinearComponent: () => (/* binding */ SharedActivityUiLinearComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material/progress-bar */ 288);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3499);



function SharedActivityUiLinearComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-progress-bar", 1);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("mode", ctx_r0.mode);
  }
}
class SharedActivityUiLinearComponent {
  active = false;
  mode = 'indeterminate';
  static ɵfac = function SharedActivityUiLinearComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SharedActivityUiLinearComponent)();
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: SharedActivityUiLinearComponent,
    selectors: [["plastik-shared-activity-ui-linear"]],
    inputs: {
      active: "active",
      mode: "mode"
    },
    decls: 2,
    vars: 1,
    consts: [[1, "motion-reduce:hidden"], [3, "mode"]],
    template: function SharedActivityUiLinearComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditionalCreate"](1, SharedActivityUiLinearComponent_Conditional_1_Template, 1, 1, "mat-progress-bar", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵconditional"](ctx.active ? 1 : -1);
      }
    },
    dependencies: [_angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_0__.MatProgressBarModule, _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_0__.MatProgressBar],
    styles: ["\n\n.mat-mdc-progress-bar[_ngcontent-%COMP%] {\n  --mat-progress-bar-track-color: var(\n    --plastik-mdc-linear-progress-track-color,\n    rgb(183, 183, 183)\n  ) !important;\n  --mat-progress-bar-track-height: var(\n    --plastik-mdc-linear-progress-track-height,\n    4px\n  ) !important;\n  --mat-progress-bar-active-indicator-height: var(\n    --plastik-mdc-linear-progress-active-indicator-height,\n    4px\n  ) !important;\n  --mat-progress-bar-active-indicator-color: var(\n    --plastik-mdc-linear-progress-active-indicator-color,\n    rgb(11, 17, 62)\n  ) !important;\n}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL2xpYnMvc2hhcmVkL2FjdGl2aXR5L3VpL3NyYy9saWIvc2hhcmVkLWFjdGl2aXR5LXVpLWxpbmVhci9zaGFyZWQtYWN0aXZpdHktdWktbGluZWFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDTSxnRkFBQTtBQUNBO0VBQ0U7OztjQUFBO0VBSUE7OztjQUFBO0VBSUE7OztjQUFBO0VBSUE7OztjQUFBO0FBR1IiLCJzb3VyY2VzQ29udGVudCI6WyJcbiAgICAgIC8qIC0tLS0tIFByb2dyZXNzQmFyIGh0dHBzOi8vbWF0ZXJpYWwuYW5ndWxhci5pby9jb21wb25lbnRzL3Byb2dyZXNzLWJhciAtLS0tLSAqL1xuICAgICAgLm1hdC1tZGMtcHJvZ3Jlc3MtYmFyIHtcbiAgICAgICAgLS1tYXQtcHJvZ3Jlc3MtYmFyLXRyYWNrLWNvbG9yOiB2YXIoXG4gICAgICAgICAgLS1wbGFzdGlrLW1kYy1saW5lYXItcHJvZ3Jlc3MtdHJhY2stY29sb3IsXG4gICAgICAgICAgcmdiKDE4MywgMTgzLCAxODMpXG4gICAgICAgICkgIWltcG9ydGFudDtcbiAgICAgICAgLS1tYXQtcHJvZ3Jlc3MtYmFyLXRyYWNrLWhlaWdodDogdmFyKFxuICAgICAgICAgIC0tcGxhc3Rpay1tZGMtbGluZWFyLXByb2dyZXNzLXRyYWNrLWhlaWdodCxcbiAgICAgICAgICA0cHhcbiAgICAgICAgKSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1hdC1wcm9ncmVzcy1iYXItYWN0aXZlLWluZGljYXRvci1oZWlnaHQ6IHZhcihcbiAgICAgICAgICAtLXBsYXN0aWstbWRjLWxpbmVhci1wcm9ncmVzcy1hY3RpdmUtaW5kaWNhdG9yLWhlaWdodCxcbiAgICAgICAgICA0cHhcbiAgICAgICAgKSAhaW1wb3J0YW50O1xuICAgICAgICAtLW1hdC1wcm9ncmVzcy1iYXItYWN0aXZlLWluZGljYXRvci1jb2xvcjogdmFyKFxuICAgICAgICAgIC0tcGxhc3Rpay1tZGMtbGluZWFyLXByb2dyZXNzLWFjdGl2ZS1pbmRpY2F0b3ItY29sb3IsXG4gICAgICAgICAgcmdiKDExLCAxNywgNjIpXG4gICAgICAgICkgIWltcG9ydGFudDtcbiAgICAgIH1cbiAgICAiXSwic291cmNlUm9vdCI6IiJ9 */"],
    changeDetection: 0
  });
}

/***/ }),

/***/ 3146:
/*!*******************************************************************************!*\
  !*** ./libs/core/router/data-access/src/lib/services/prefix-title.service.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PrefixTitleService: () => (/* binding */ PrefixTitleService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 4150);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 3288);
/* harmony import */ var _plastik_core_environments__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @plastik/core/environments */ 2071);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3499);





class PrefixTitleService extends _angular_router__WEBPACK_IMPORTED_MODULE_2__.TitleStrategy {
  #title = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.Title);
  #environment = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_plastik_core_environments__WEBPACK_IMPORTED_MODULE_3__.ENVIRONMENT);
  /**
   * @description Update page title with the environment app name.
   * @param {RouterStateSnapshot} snapshot The state of the router at a moment in time.
   */
  updateTitle(snapshot) {
    const title = this.buildTitle(snapshot);
    this.#title.setTitle(!title ? `${this.#environment.name}` : `${this.#environment.name} - ${title}`);
  }
  static ɵfac = /*@__PURE__*/(() => {
    let ɵPrefixTitleService_BaseFactory;
    return function PrefixTitleService_Factory(__ngFactoryType__) {
      return (ɵPrefixTitleService_BaseFactory || (ɵPrefixTitleService_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetInheritedFactory"](PrefixTitleService)))(__ngFactoryType__ || PrefixTitleService);
    };
  })();
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: PrefixTitleService,
    factory: PrefixTitleService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 3226:
/*!***********************************************!*\
  !*** ./libs/core/entities/src/form-config.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FORM_TOKEN: () => (/* binding */ FORM_TOKEN)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);

const FORM_TOKEN = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('FORM_TOKEN');

/***/ }),

/***/ 3251:
/*!*************************************************!*\
  !*** ./apps/nasa-images/src/app/app.routing.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   routes: () => (/* binding */ routes)
/* harmony export */ });
const routes = [{
  path: 'search',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("libs_nasa-images_search_feature_src_index_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! @plastik/nasa-images/search */ 6958)).then(routes => routes.nasaImagesSearchFeatureRoutes)
}, {
  path: 'faqs',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("libs_nasa-images_faqs_feature_src_index_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! @plastik/nasa-images/faqs */ 4231)).then(routes => routes.nasaImagesFaqsFeatureRoutes)
}, {
  path: '**',
  redirectTo: 'search',
  pathMatch: 'full'
}];

/***/ }),

/***/ 3256:
/*!**************************************************************!*\
  !*** ./libs/core/router/data-access/src/lib/router-state.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   routerKey: () => (/* binding */ routerKey)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);

const ROUTER_STATE_FEATURE_KEY = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('ROUTER_STATE_FEATURE_KEY');
const injector = _angular_core__WEBPACK_IMPORTED_MODULE_0__.Injector.create({
  providers: [{
    provide: ROUTER_STATE_FEATURE_KEY,
    useValue: 'router'
  }]
});
const routerKey = injector.get(ROUTER_STATE_FEATURE_KEY);

/***/ }),

/***/ 3321:
/*!**********************************************************!*\
  !*** ./libs/nasa-images/search/data-access/src/index.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NASA_IMAGES_DATA_LIST_TOKEN: () => (/* reexport safe */ _lib_nasa_images_tokens__WEBPACK_IMPORTED_MODULE_4__.NASA_IMAGES_DATA_LIST_TOKEN),
/* harmony export */   NASA_IMAGES_PROVIDERS: () => (/* reexport safe */ _lib_nasa_images_tokens__WEBPACK_IMPORTED_MODULE_4__.NASA_IMAGES_PROVIDERS),
/* harmony export */   NasaImagesActions: () => (/* reexport module object */ _lib_state_nasa_images_actions__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   NasaImagesEffects: () => (/* reexport safe */ _lib_state_nasa_images_effects__WEBPACK_IMPORTED_MODULE_2__.NasaImagesEffects),
/* harmony export */   NasaImagesSearchFacade: () => (/* reexport safe */ _lib_state_nasa_images_search_facade__WEBPACK_IMPORTED_MODULE_1__.NasaImagesSearchFacade),
/* harmony export */   initialNasaImagesState: () => (/* reexport safe */ _lib_state_nasa_images_feature__WEBPACK_IMPORTED_MODULE_3__.initialNasaImagesState),
/* harmony export */   name: () => (/* reexport safe */ _lib_state_nasa_images_feature__WEBPACK_IMPORTED_MODULE_3__.name),
/* harmony export */   nasaMediaAdapter: () => (/* reexport safe */ _lib_state_nasa_images_feature__WEBPACK_IMPORTED_MODULE_3__.nasaMediaAdapter),
/* harmony export */   reducer: () => (/* reexport safe */ _lib_state_nasa_images_feature__WEBPACK_IMPORTED_MODULE_3__.reducer),
/* harmony export */   selectNasaImagesFeature: () => (/* reexport safe */ _lib_state_nasa_images_feature__WEBPACK_IMPORTED_MODULE_3__.selectNasaImagesFeature)
/* harmony export */ });
/* harmony import */ var _lib_state_nasa_images_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/+state/nasa-images.actions */ 183);
/* harmony import */ var _lib_state_nasa_images_search_facade__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/+state/nasa-images-search.facade */ 611);
/* harmony import */ var _lib_state_nasa_images_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/+state/nasa-images.effects */ 3438);
/* harmony import */ var _lib_state_nasa_images_feature__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/+state/nasa-images.feature */ 9286);
/* harmony import */ var _lib_nasa_images_tokens__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/nasa-images.tokens */ 8123);







/***/ }),

/***/ 3438:
/*!***********************************************************************************!*\
  !*** ./libs/nasa-images/search/data-access/src/lib/+state/nasa-images.effects.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NasaImagesEffects: () => (/* binding */ NasaImagesEffects)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 7796);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 494);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 6377);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 6663);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 1252);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/cdk/a11y */ 2205);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngrx/effects */ 9497);
/* harmony import */ var _ngrx_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/operators */ 4821);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngrx/store */ 9797);
/* harmony import */ var _plastik_core_router_state__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @plastik/core/router-state */ 3561);
/* harmony import */ var _plastik_shared_activity_data_access__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @plastik/shared/activity/data-access */ 6711);
/* harmony import */ var _plastik_shared_notification_data_access__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @plastik/shared/notification/data-access */ 5757);
/* harmony import */ var _nasa_images_tokens__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../nasa-images.tokens */ 8123);
/* harmony import */ var _nasa_images_actions__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./nasa-images.actions */ 183);












class NasaImagesEffects {
  #actions$ = (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.Actions);
  #apiService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_nasa_images_tokens__WEBPACK_IMPORTED_MODULE_13__.NASA_IMAGES_DATA_LIST_TOKEN);
  #navigationFilter = (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_plastik_core_router_state__WEBPACK_IMPORTED_MODULE_10__.NavigationFilterService);
  #notificationService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_plastik_shared_notification_data_access__WEBPACK_IMPORTED_MODULE_12__.NotificationConfigService);
  #store = (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_ngrx_store__WEBPACK_IMPORTED_MODULE_9__.Store);
  #activityStore = (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_plastik_shared_activity_data_access__WEBPACK_IMPORTED_MODULE_11__.activityStore);
  #notificationStore = (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_plastik_shared_notification_data_access__WEBPACK_IMPORTED_MODULE_12__.notificationStore);
  #liveAnnouncer = (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_5__.LiveAnnouncer);
  navigation$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.createEffect)(() => {
    return this.#actions$.pipe(this.#navigationFilter.checkRouterNavigation('search'), (0,_ngrx_operators__WEBPACK_IMPORTED_MODULE_8__.concatLatestFrom)(() => [this.#store.select(_plastik_core_router_state__WEBPACK_IMPORTED_MODULE_10__.selectRouteQueryParams)]), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(([, queryParams]) => {
      if (!queryParams['q']) {
        return _nasa_images_actions__WEBPACK_IMPORTED_MODULE_14__.nasaImagesPageActions.cleanUp();
      }
      return _nasa_images_actions__WEBPACK_IMPORTED_MODULE_14__.nasaImagesPageActions.load({
        params: {
          ...queryParams,
          ...{
            media_type: 'image'
          }
        }
      });
    }));
  });
  activeOn$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.createEffect)(() => {
    return this.#actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.ofType)(_nasa_images_actions__WEBPACK_IMPORTED_MODULE_14__.nasaImagesPageActions.load), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(() => this.#activityStore.setActivity(true)));
  }, {
    dispatch: false
  });
  load$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.createEffect)(() => {
    return this.#actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.ofType)(_nasa_images_actions__WEBPACK_IMPORTED_MODULE_14__.nasaImagesPageActions.load), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.tap)(({
      params
    }) => this.#liveAnnouncer.announce(`searching for ${params.q}`, 'assertive', 5000)), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.exhaustMap)(({
      params
    }) => this.#apiService.getList(params).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(({
      items,
      count
    }) => _nasa_images_actions__WEBPACK_IMPORTED_MODULE_14__.nasaImagesAPIActions.loadSuccess({
      items,
      count
    })), (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.catchError)(error => (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.of)(_nasa_images_actions__WEBPACK_IMPORTED_MODULE_14__.nasaImagesAPIActions.loadFailure({
      error: error?.reason
    }))))));
  });
  loadSuccess$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.createEffect)(() => {
    return this.#actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.ofType)(_nasa_images_actions__WEBPACK_IMPORTED_MODULE_14__.nasaImagesAPIActions.loadSuccess), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.tap)(() => this.#liveAnnouncer.announce('Search completed successfully', 'assertive', 5000)));
  }, {
    dispatch: false
  });
  activeOff$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.createEffect)(() => {
    return this.#actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.ofType)(_nasa_images_actions__WEBPACK_IMPORTED_MODULE_14__.nasaImagesAPIActions.loadSuccess, _nasa_images_actions__WEBPACK_IMPORTED_MODULE_14__.nasaImagesAPIActions.loadFailure), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(() => this.#activityStore.setActivity(false)));
  }, {
    dispatch: false
  });
  showNotification$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.createEffect)(() => {
    return this.#actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_7__.ofType)(_nasa_images_actions__WEBPACK_IMPORTED_MODULE_14__.nasaImagesAPIActions.loadFailure), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(({
      error
    }) => {
      const message = error || 'The request has failed. Please try it again.';
      this.#liveAnnouncer.announce(message, 'assertive', 5000);
      this.#notificationStore.show(this.#notificationService.getInstance({
        type: 'ERROR',
        message
      }));
    }));
  }, {
    dispatch: false
  });
  static ɵfac = function NasaImagesEffects_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NasaImagesEffects)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjectable"]({
    token: NasaImagesEffects,
    factory: NasaImagesEffects.ɵfac
  });
}

/***/ }),

/***/ 3462:
/*!*************************************************!*\
  !*** ./libs/core/util/api/src/lib/data-crud.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   API_SERVICE_TOKEN: () => (/* binding */ API_SERVICE_TOKEN),
/* harmony export */   DATA_CREATE_SERVICE_TOKEN: () => (/* binding */ DATA_CREATE_SERVICE_TOKEN),
/* harmony export */   DATA_GET_LIST_SERVICE_TOKEN: () => (/* binding */ DATA_GET_LIST_SERVICE_TOKEN),
/* harmony export */   DATA_GET_ONE_SERVICE_TOKEN: () => (/* binding */ DATA_GET_ONE_SERVICE_TOKEN),
/* harmony export */   DATA_READ_SERVICE_TOKEN: () => (/* binding */ DATA_READ_SERVICE_TOKEN),
/* harmony export */   DATA_UPDATE_SERVICE_TOKEN: () => (/* binding */ DATA_UPDATE_SERVICE_TOKEN),
/* harmony export */   DATA_WRITE_SERVICE_TOKEN: () => (/* binding */ DATA_WRITE_SERVICE_TOKEN)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);

/**
 * Injection token for providing a generic CRUD API.
 */
const API_SERVICE_TOKEN = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('API_SERVICE_TOKEN');
/**
 * Injection token for read-only data services.
 */
const DATA_READ_SERVICE_TOKEN = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('DATA_READ_SERVICE_TOKEN');
/**
 * Injection token for write-capable data services.
 */
const DATA_WRITE_SERVICE_TOKEN = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('DATA_WRITE_SERVICE_TOKEN');
/**
 * Injection token for list retrieval services.
 */
const DATA_GET_LIST_SERVICE_TOKEN = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('DATA_GET_LIST_SERVICE_TOKEN');
/**
 * Injection token for single-entity retrieval services.
 */
const DATA_GET_ONE_SERVICE_TOKEN = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('DATA_GET_ONE_SERVICE_TOKEN');
/**
 * Injection token for entity creation services.
 */
const DATA_CREATE_SERVICE_TOKEN = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('DATA_CREATE_SERVICE_TOKEN');
/**
 * Injection token for entity update services.
 */
const DATA_UPDATE_SERVICE_TOKEN = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('DATA_UPDATE_SERVICE_TOKEN');

/***/ }),

/***/ 3512:
/*!****************************************************!*\
  !*** ./libs/core/cms-layout/entities/src/index.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CORE_CMS_LAYOUT_HEADER_CONFIG: () => (/* reexport safe */ _core_cms_layout_header_config__WEBPACK_IMPORTED_MODULE_0__.CORE_CMS_LAYOUT_HEADER_CONFIG)
/* harmony export */ });
/* harmony import */ var _core_cms_layout_header_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core-cms-layout-header-config */ 927);


/***/ }),

/***/ 3526:
/*!********************************************************************************************************************!*\
  !*** ./libs/core/cms-layout/ui/sidenav/src/lib/core-cms-layout-ui-sidenav/core-cms-layout-ui-sidenav.component.ts ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CoreCmsLayoutUiSidenavComponent: () => (/* binding */ CoreCmsLayoutUiSidenavComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3499);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/list */ 5409);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/sidenav */ 4591);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 3288);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/material/list */ 4224);







const _c0 = [[["", "header", ""]], [["", "menu-items", ""]], [["", "footer", ""]]];
const _c1 = ["[header]", "[menu-items]", "[footer]"];
class CoreCmsLayoutUiSidenavComponent {
  #zone = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_1__.NgZone);
  position = 'start';
  mode = 'over';
  fixedInViewport = false;
  sidenavOpened = true;
  toggleSidenav = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
  onToggleSidenav(opened) {
    this.#zone.run(() => {
      this.toggleSidenav.emit(opened);
    });
  }
  static ɵfac = function CoreCmsLayoutUiSidenavComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CoreCmsLayoutUiSidenavComponent)();
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: CoreCmsLayoutUiSidenavComponent,
    selectors: [["plastik-core-cms-layout-ui-sidenav"]],
    inputs: {
      position: "position",
      mode: "mode",
      fixedInViewport: "fixedInViewport",
      sidenavOpened: "sidenavOpened"
    },
    outputs: {
      toggleSidenav: "toggleSidenav"
    },
    ngContentSelectors: _c1,
    decls: 8,
    vars: 4,
    consts: [[3, "backdropClick"], ["data-test", "sidenav", 1, "p-md", 3, "keydown.escape", "mode", "fixedInViewport", "position", "opened"], [1, "mt-sm"], ["role", "main", "tabindex", "-1", "id", "mainContent", 1, "p-sub", "sm:p-sm", "lg:p-md", "xl:p-lg", "motion-safe:scroll-smooth"]],
    template: function CoreCmsLayoutUiSidenavComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojectionDef"](_c0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-sidenav-container", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("backdropClick", function CoreCmsLayoutUiSidenavComponent_Template_mat_sidenav_container_backdropClick_0_listener() {
          return ctx.onToggleSidenav(false);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "mat-sidenav", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("keydown.escape", function CoreCmsLayoutUiSidenavComponent_Template_mat_sidenav_keydown_escape_1_listener() {
          return ctx.onToggleSidenav(false);
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojection"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "mat-divider", 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojection"](4, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojection"](5, 2);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "mat-sidenav-content", 3);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "router-outlet");
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("mode", ctx.mode)("fixedInViewport", ctx.fixedInViewport)("position", ctx.position)("opened", ctx.sidenavOpened);
      }
    },
    dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterOutlet, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_3__.MatSidenavModule, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_3__.MatSidenav, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_3__.MatSidenavContainer, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_3__.MatSidenavContent, _angular_material_list__WEBPACK_IMPORTED_MODULE_2__.MatListModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_5__.MatDivider],
    encapsulation: 2,
    changeDetection: 0
  });
}

/***/ }),

/***/ 3561:
/*!***************************************************!*\
  !*** ./libs/core/router/data-access/src/index.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomRouterSerializer: () => (/* reexport safe */ _lib_state_reducer_router_state_reducer__WEBPACK_IMPORTED_MODULE_2__.CustomRouterSerializer),
/* harmony export */   NavigationFilterService: () => (/* reexport safe */ _lib_services_navigation_filter_service__WEBPACK_IMPORTED_MODULE_6__.NavigationFilterService),
/* harmony export */   PrefixTitleService: () => (/* reexport safe */ _lib_services_prefix_title_service__WEBPACK_IMPORTED_MODULE_7__.PrefixTitleService),
/* harmony export */   RouterFacade: () => (/* reexport safe */ _lib_state_router_facade__WEBPACK_IMPORTED_MODULE_3__.RouterFacade),
/* harmony export */   RouterStateEffects: () => (/* reexport safe */ _lib_state_effects_router_state_effects__WEBPACK_IMPORTED_MODULE_1__.RouterStateEffects),
/* harmony export */   getMockedRouterNavigation: () => (/* reexport safe */ _lib_mocks_router_mock__WEBPACK_IMPORTED_MODULE_5__.getMockedRouterNavigation),
/* harmony export */   getMockedRouterRequest: () => (/* reexport safe */ _lib_mocks_router_mock__WEBPACK_IMPORTED_MODULE_5__.getMockedRouterRequest),
/* harmony export */   routerActions: () => (/* reexport safe */ _lib_state_actions_router_state_actions__WEBPACK_IMPORTED_MODULE_0__.routerActions),
/* harmony export */   routerMockState: () => (/* reexport safe */ _lib_mocks_router_mock__WEBPACK_IMPORTED_MODULE_5__.routerMockState),
/* harmony export */   routerReducers: () => (/* reexport safe */ _lib_state_reducer_router_state_reducer__WEBPACK_IMPORTED_MODULE_2__.routerReducers),
/* harmony export */   selectRouteData: () => (/* reexport safe */ _lib_state_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_4__.selectRouteData),
/* harmony export */   selectRouteDataName: () => (/* reexport safe */ _lib_state_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_4__.selectRouteDataName),
/* harmony export */   selectRouteFeatureState: () => (/* reexport safe */ _lib_state_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_4__.selectRouteFeatureState),
/* harmony export */   selectRouteParams: () => (/* reexport safe */ _lib_state_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_4__.selectRouteParams),
/* harmony export */   selectRouteQueryParams: () => (/* reexport safe */ _lib_state_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_4__.selectRouteQueryParams),
/* harmony export */   selectRouteUrl: () => (/* reexport safe */ _lib_state_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_4__.selectRouteUrl)
/* harmony export */ });
/* harmony import */ var _lib_state_actions_router_state_actions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/+state/actions/router-state.actions */ 4758);
/* harmony import */ var _lib_state_effects_router_state_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/+state/effects/router-state.effects */ 4000);
/* harmony import */ var _lib_state_reducer_router_state_reducer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/+state/reducer/router-state.reducer */ 7672);
/* harmony import */ var _lib_state_router_facade__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/+state/router.facade */ 9955);
/* harmony import */ var _lib_state_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./lib/+state/selectors/router-state.selectors */ 9708);
/* harmony import */ var _lib_mocks_router_mock__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./lib/mocks/router.mock */ 5042);
/* harmony import */ var _lib_services_navigation_filter_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./lib/services/navigation-filter.service */ 8536);
/* harmony import */ var _lib_services_prefix_title_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./lib/services/prefix-title.service */ 3146);









/***/ }),

/***/ 3670:
/*!****************************************************************!*\
  !*** ./libs/nasa-images/data-access/src/nasa-images.facade.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NasaImagesFacade: () => (/* binding */ NasaImagesFacade)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _plastik_core_cms_layout_data_access__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @plastik/core/cms-layout/data-access */ 2882);
/* harmony import */ var _plastik_core_router_state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @plastik/core/router-state */ 3561);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 6663);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 3499);





class NasaImagesFacade extends _plastik_core_router_state__WEBPACK_IMPORTED_MODULE_2__.RouterFacade {
  sidenavConfig = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_plastik_core_cms_layout_data_access__WEBPACK_IMPORTED_MODULE_1__.VIEW_CONFIG);
  routeInfo$ = this.routeName$.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(name => this.sidenavConfig()?.find(routeData => routeData.name === name)));
  static ɵfac = /*@__PURE__*/(() => {
    let ɵNasaImagesFacade_BaseFactory;
    return function NasaImagesFacade_Factory(__ngFactoryType__) {
      return (ɵNasaImagesFacade_BaseFactory || (ɵNasaImagesFacade_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetInheritedFactory"](NasaImagesFacade)))(__ngFactoryType__ || NasaImagesFacade);
    };
  })();
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: NasaImagesFacade,
    factory: NasaImagesFacade.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 3674:
/*!***********************************************!*\
  !*** ./libs/core/entities/src/base-entity.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ 4000:
/*!*************************************************************************************!*\
  !*** ./libs/core/router/data-access/src/lib/+state/effects/router-state.effects.ts ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RouterStateEffects: () => (/* binding */ RouterStateEffects)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 1252);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 5656);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3499);
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/effects */ 9497);
/* harmony import */ var _ngrx_router_store__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/router-store */ 4589);
/* harmony import */ var _services_navigation_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../services/navigation.service */ 7420);
/* harmony import */ var _actions_router_state_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../actions/router-state.actions */ 4758);

/* eslint-disable ngrx/no-dispatch-in-effects */







class RouterStateEffects {
  #actions$ = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.Actions);
  #location = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_common__WEBPACK_IMPORTED_MODULE_1__.Location);
  #navigationService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_services_navigation_service__WEBPACK_IMPORTED_MODULE_6__.NavigationService);
  #zone = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_3__.NgZone);
  navigate$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => {
    return this.#actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_actions_router_state_actions__WEBPACK_IMPORTED_MODULE_7__.routerActions.go), (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.tap)(action => this.#navigationService.navigate(action)));
  }, {
    dispatch: false
  });
  navigateBack$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => {
    return this.#actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_actions_router_state_actions__WEBPACK_IMPORTED_MODULE_7__.routerActions.back), (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.tap)(({
      url,
      regex
    }) => this.#navigationService.back(url, regex)));
  }, {
    dispatch: false
  });
  navigateForward$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => {
    return this.#actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_actions_router_state_actions__WEBPACK_IMPORTED_MODULE_7__.routerActions.forward), (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.tap)(() => this.#location.forward()));
  }, {
    dispatch: false
  });
  scrollToTop$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.createEffect)(() => {
    return this.#actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_4__.ofType)(_ngrx_router_store__WEBPACK_IMPORTED_MODULE_5__.ROUTER_NAVIGATION), (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.tap)(() => {
      this.#zone.runOutsideAngular(() => {
        const mainElement = document.getElementById('mainContent');
        mainElement?.scrollTo(0, 0);
      });
    }));
  }, {
    dispatch: false
  });
  static ɵfac = function RouterStateEffects_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RouterStateEffects)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: RouterStateEffects,
    factory: RouterStateEffects.ɵfac
  });
}

/***/ }),

/***/ 4017:
/*!**********************************************************************!*\
  !*** ./libs/shared/notification/entities/src/notification-config.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NOTIFICATION_TYPES_CONFIG: () => (/* binding */ NOTIFICATION_TYPES_CONFIG),
/* harmony export */   defaultNotification: () => (/* binding */ defaultNotification)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);

const defaultNotification = {
  ['ERROR']: {
    type: 'ERROR',
    icon: 'cancel',
    action: 'close',
    ariaLabel: 'Close error notification',
    duration: undefined
  },
  ['WARNING']: {
    type: 'WARNING',
    icon: 'warning',
    duration: 5000
  },
  ['INFO']: {
    type: 'INFO',
    icon: 'info',
    duration: 5000
  },
  ['SUCCESS']: {
    type: 'SUCCESS',
    icon: 'check',
    duration: 5000
  }
};
/** Injection token with notification configuration dictionary depending on its type. */
const NOTIFICATION_TYPES_CONFIG = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('notification', {
  providedIn: 'root',
  factory: () => defaultNotification
});

/***/ }),

/***/ 4456:
/*!************************************************************************************************************!*\
  !*** ./libs/shared/activity/ui/src/lib/shared-activity-ui-overlay/shared-activity-ui-overlay.component.ts ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharedActivityUiOverlayComponent: () => (/* binding */ SharedActivityUiOverlayComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 3499);

const _c0 = ["*"];
class SharedActivityUiOverlayComponent {
  static ɵfac = function SharedActivityUiOverlayComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || SharedActivityUiOverlayComponent)();
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
    type: SharedActivityUiOverlayComponent,
    selectors: [["plastik-shared-activity-ui-overlay"]],
    ngContentSelectors: _c0,
    decls: 2,
    vars: 0,
    consts: [[1, "z-50", "absolute", "[", "flex", "items-center", "justify-center", "]", "[", "w-full", "h-full", "]", "bg-white/40"]],
    template: function SharedActivityUiOverlayComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojectionDef"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdomElementStart"](0, "div", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵprojection"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdomElementEnd"]();
      }
    },
    encapsulation: 2
  });
}

/***/ }),

/***/ 4502:
/*!***************************************************************************!*\
  !*** ./libs/core/cms-layout/data-access/src/lib/+state/layout.actions.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   layoutActions: () => (/* binding */ layoutActions)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ 9797);

const layoutActions = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createActionGroup)({
  source: 'Layout',
  events: {
    'Set Is Mobile': (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)(),
    'Toggle Sidenav': (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)()
  }
});

/***/ }),

/***/ 4753:
/*!***************************************************!*\
  !*** ./libs/core/cms-layout/feature/src/index.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CoreCmsLayoutFeatureComponent: () => (/* reexport safe */ _lib_core_cms_layout_feature_core_cms_layout_feature_component__WEBPACK_IMPORTED_MODULE_0__.CoreCmsLayoutFeatureComponent)
/* harmony export */ });
/* harmony import */ var _lib_core_cms_layout_feature_core_cms_layout_feature_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/core-cms-layout-feature/core-cms-layout-feature.component */ 6003);


/***/ }),

/***/ 4758:
/*!*************************************************************************************!*\
  !*** ./libs/core/router/data-access/src/lib/+state/actions/router-state.actions.ts ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   routerActions: () => (/* binding */ routerActions)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ 9797);

const routerActions = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createActionGroup)({
  source: 'Router',
  events: {
    Go: (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)(),
    Back: (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.props)(),
    Forward: (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.emptyProps)()
  }
});

/***/ }),

/***/ 4919:
/*!*******************************************************!*\
  !*** ./apps/nasa-images/src/app/cms-layout-config.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   headerConfig: () => (/* binding */ headerConfig),
/* harmony export */   viewConfig: () => (/* binding */ viewConfig)
/* harmony export */ });
const headerConfig = {
  showToggleMenuButton: true,
  mainIcon: {
    iconPath: 'assets/img/nasa.svg',
    svgClass: 'fill-white text-black w-[80px]'
  },
  title: 'NASA images',
  extendedTitle: 'NASA Images Search',
  widgetsConfig: {
    position: 'end',
    widgets: [{
      id: 1,
      component: () => __webpack_require__.e(/*! import() */ "libs_shared_button_ui_src_index_ts").then(__webpack_require__.bind(__webpack_require__, /*! @plastik/shared/button/ui */ 7754)).then(c => c.SharedButtonUiComponent),
      inputs: {
        config: {
          type: 'link',
          link: 'https://github.com/plastikaweb/plastikspace/tree/develop/apps/nasa-images/README.md',
          ariaLabel: 'plastikspace -> apps -> nasa-images readme',
          dataTestId: 'github-button',
          elements: [{
            type: 'icon',
            content: {
              iconPath: 'assets/svg/github.svg',
              svgClass: 'w-[40px] fill-primary'
            }
          }],
          doAction: () => window.open('https://github.com/plastikaweb/plastikspace/tree/develop/apps/nasa-images/README.md', '_blank')
        }
      }
    }]
  }
};
const viewConfig = {
  ['search']: {
    id: 1,
    name: 'search',
    title: 'Search images',
    icon: 'image_search',
    route: ['/search'],
    includedInNavigation: true,
    routerLinkActiveOptionsExact: {
      exact: false
    }
  },
  ['faqs']: {
    id: 2,
    name: 'faqs',
    title: 'FAQs',
    icon: 'speaker_notes',
    route: ['/faqs'],
    includedInNavigation: true,
    routerLinkActiveOptionsExact: {
      exact: false
    }
  }
};

/***/ }),

/***/ 5042:
/*!*******************************************************************!*\
  !*** ./libs/core/router/data-access/src/lib/mocks/router.mock.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getMockedRouterNavigation: () => (/* binding */ getMockedRouterNavigation),
/* harmony export */   getMockedRouterRequest: () => (/* binding */ getMockedRouterRequest),
/* harmony export */   routerMockState: () => (/* binding */ routerMockState)
/* harmony export */ });
/* harmony import */ var _ngrx_router_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/router-store */ 4589);

/* eslint-disable jsdoc/require-jsdoc */
const routerMockState = {
  navigationId: 1,
  state: {
    params: {
      key: '1'
    },
    queryParams: {
      key: 'value'
    },
    data: {
      title: 'The title',
      name: 'Title'
    },
    url: 'path1/sub_path1'
  }
};
function getMockedRouterNavigation(url) {
  return {
    type: _ngrx_router_store__WEBPACK_IMPORTED_MODULE_0__.ROUTER_NAVIGATION,
    payload: {
      event: {
        url
      }
    }
  };
}
function getMockedRouterRequest(url) {
  return {
    type: _ngrx_router_store__WEBPACK_IMPORTED_MODULE_0__.ROUTER_REQUEST,
    payload: {
      event: {
        url
      }
    }
  };
}

/***/ }),

/***/ 5249:
/*!***************************************************************************************!*\
  !*** ./libs/core/cms-layout/ui/header/src/lib/core-cms-layout-ui-header.component.ts ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CoreCmsLayoutUiHeaderComponent: () => (/* binding */ CoreCmsLayoutUiHeaderComponent)
/* harmony export */ });
/* harmony import */ var _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/material/toolbar */ 8362);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3499);



const _c0 = [[["", "start", ""]], [["", "end", ""]]];
const _c1 = ["[start]", "[end]"];
class CoreCmsLayoutUiHeaderComponent {
  static ɵfac = function CoreCmsLayoutUiHeaderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CoreCmsLayoutUiHeaderComponent)();
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: CoreCmsLayoutUiHeaderComponent,
    selectors: [["plastik-core-cms-layout-ui-header"]],
    ngContentSelectors: _c1,
    decls: 4,
    vars: 0,
    consts: [["role", "banner"], [1, "flex-auto"]],
    template: function CoreCmsLayoutUiHeaderComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojectionDef"](_c0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "mat-toolbar", 0);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojection"](1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "span", 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojection"](3, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
      }
    },
    dependencies: [_angular_material_toolbar__WEBPACK_IMPORTED_MODULE_0__.MatToolbarModule, _angular_material_toolbar__WEBPACK_IMPORTED_MODULE_0__.MatToolbar],
    encapsulation: 2,
    changeDetection: 0
  });
}

/***/ }),

/***/ 5443:
/*!***************************************************************************!*\
  !*** ./libs/core/cms-layout/data-access/src/lib/+state/layout.effects.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayoutEffects: () => (/* binding */ LayoutEffects)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/effects */ 9497);
/* harmony import */ var _ngrx_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ngrx/operators */ 4821);
/* harmony import */ var _ngrx_router_store__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngrx/router-store */ 4589);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngrx/store */ 9797);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 5687);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 6663);
/* harmony import */ var _layout_actions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./layout.actions */ 4502);
/* harmony import */ var _layout_feature__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./layout.feature */ 5947);









class LayoutEffects {
  #actions$ = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__.Actions);
  #store = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_ngrx_store__WEBPACK_IMPORTED_MODULE_4__.Store);
  routerRequest$ = (0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__.createEffect)(() => {
    return this.#actions$.pipe((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_1__.ofType)(_ngrx_router_store__WEBPACK_IMPORTED_MODULE_3__.ROUTER_NAVIGATION), (0,_ngrx_operators__WEBPACK_IMPORTED_MODULE_2__.concatLatestFrom)(() => [this.#store.select(_layout_feature__WEBPACK_IMPORTED_MODULE_8__.selectSidenavOpened), this.#store.select(_layout_feature__WEBPACK_IMPORTED_MODULE_8__.selectIsMobile)]), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.filter)(([, sideBarVisibility, isMobile]) => sideBarVisibility && isMobile), (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.map)(() => _layout_actions__WEBPACK_IMPORTED_MODULE_7__.layoutActions.toggleSidenav({
      opened: false
    })));
  });
  static ɵfac = function LayoutEffects_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || LayoutEffects)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: LayoutEffects,
    factory: LayoutEffects.ɵfac
  });
}

/***/ }),

/***/ 5598:
/*!******************************************************!*\
  !*** ./libs/core/cms-layout/ui/sidenav/src/index.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CoreCmsLayoutUiSidenavComponent: () => (/* reexport safe */ _lib_core_cms_layout_ui_sidenav_core_cms_layout_ui_sidenav_component__WEBPACK_IMPORTED_MODULE_0__.CoreCmsLayoutUiSidenavComponent)
/* harmony export */ });
/* harmony import */ var _lib_core_cms_layout_ui_sidenav_core_cms_layout_ui_sidenav_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/core-cms-layout-ui-sidenav/core-cms-layout-ui-sidenav.component */ 3526);


/***/ }),

/***/ 5628:
/*!**************************************************************************!*\
  !*** ./libs/core/cms-layout/data-access/src/lib/core-cms-view-config.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VIEW_CONFIG: () => (/* binding */ VIEW_CONFIG)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);

const VIEW_CONFIG = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken('VIEW_CONFIG');

/***/ }),

/***/ 5757:
/*!***********************************************************!*\
  !*** ./libs/shared/notification/data-access/src/index.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ErrorHandlerService: () => (/* reexport safe */ _lib_services_error_handler_service__WEBPACK_IMPORTED_MODULE_1__.ErrorHandlerService),
/* harmony export */   NotificationConfigService: () => (/* reexport safe */ _lib_services_notification_config_service__WEBPACK_IMPORTED_MODULE_2__.NotificationConfigService),
/* harmony export */   notificationStore: () => (/* reexport safe */ _lib_state_notification_store__WEBPACK_IMPORTED_MODULE_0__.notificationStore)
/* harmony export */ });
/* harmony import */ var _lib_state_notification_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/+state/notification.store */ 570);
/* harmony import */ var _lib_services_error_handler_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/services/error-handler.service */ 1528);
/* harmony import */ var _lib_services_notification_config_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/services/notification-config.service */ 9195);




/***/ }),

/***/ 5947:
/*!***************************************************************************!*\
  !*** ./libs/core/cms-layout/data-access/src/lib/+state/layout.feature.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initialState: () => (/* binding */ initialState),
/* harmony export */   name: () => (/* binding */ name),
/* harmony export */   reducer: () => (/* binding */ reducer),
/* harmony export */   selectIsMobile: () => (/* binding */ selectIsMobile),
/* harmony export */   selectLayoutFeature: () => (/* binding */ selectLayoutFeature),
/* harmony export */   selectSidenavOpened: () => (/* binding */ selectSidenavOpened)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ 9797);
/* harmony import */ var _layout_actions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./layout.actions */ 4502);


const LAYOUT_FEATURE_KEY = 'layout';
const initialState = {
  isMobile: false,
  sidenavOpened: true
};
const selectLayoutFeature = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createFeature)({
  name: LAYOUT_FEATURE_KEY,
  reducer: (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createReducer)(initialState, (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.on)(_layout_actions__WEBPACK_IMPORTED_MODULE_1__.layoutActions.setIsMobile, (state, {
    isMobile
  }) => ({
    ...state,
    isMobile
  })), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.on)(_layout_actions__WEBPACK_IMPORTED_MODULE_1__.layoutActions.toggleSidenav, (state, {
    opened
  }) => ({
    ...state,
    sidenavOpened: opened ?? !state.sidenavOpened
  })))
});
const {
  name,
  reducer,
  selectIsMobile,
  selectSidenavOpened
} = selectLayoutFeature;

/***/ }),

/***/ 6003:
/*!***********************************************************************************************************!*\
  !*** ./libs/core/cms-layout/feature/src/lib/core-cms-layout-feature/core-cms-layout-feature.component.ts ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CoreCmsLayoutFeatureComponent: () => (/* binding */ CoreCmsLayoutFeatureComponent)
/* harmony export */ });
/* harmony import */ var _home_runner_work_plastikspace_plastikspace_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 650);
/* harmony import */ var angular_svg_icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! angular-svg-icon */ 7695);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 9259);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 6663);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 8468);
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/cdk/layout */ 5067);
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/cdk/layout */ 6706);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 7737);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 3499);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 310);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/button */ 5849);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/material/icon */ 9370);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/material/list */ 5409);
/* harmony import */ var _angular_material_menu__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/material/menu */ 3668);
/* harmony import */ var _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/material/sidenav */ 4591);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/router */ 709);
/* harmony import */ var _ngrx_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @ngrx/component */ 8525);
/* harmony import */ var _plastik_core_cms_layout_data_access__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @plastik/core/cms-layout/data-access */ 2882);
/* harmony import */ var _plastik_core_cms_layout_header__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @plastik/core/cms-layout/header */ 321);
/* harmony import */ var _plastik_core_cms_layout_sidenav__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @plastik/core/cms-layout/sidenav */ 5598);
/* harmony import */ var _plastik_shared_activity_ui__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @plastik/shared/activity/ui */ 7094);
/* harmony import */ var _plastik_shared_notification_data_access__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @plastik/shared/notification/data-access */ 5757);
/* harmony import */ var _angular_material_list__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/list */ 4224);























const _c0 = ["widgetsContainer"];
const CoreCmsLayoutFeatureComponent_Defer_8_DepsFn = () => [__webpack_require__.e(/*! import() */ "libs_shared_notification_ui_mat-snackbar_src_index_ts").then(__webpack_require__.bind(__webpack_require__, /*! @plastik/shared/notification/ui/mat-snackbar */ 6097)).then(m => m.NotificationUiMatSnackbarDirective)];
const CoreCmsLayoutFeatureComponent_Defer_14_DepsFn = () => [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgTemplateOutlet];
const CoreCmsLayoutFeatureComponent_Defer_34_DepsFn = () => [__webpack_require__.e(/*! import() */ "libs_core_cms-layout_ui_footer_src_index_ts").then(__webpack_require__.bind(__webpack_require__, /*! @plastik/core/cms-layout/footer */ 1015)).then(m => m.CoreCmsLayoutUiFooterComponent), _angular_common__WEBPACK_IMPORTED_MODULE_7__.DatePipe];
const _c1 = () => ["/"];
const _c2 = () => ({
  exact: false
});
const _forTrack0 = ($index, $item) => $item.id;
function CoreCmsLayoutFeatureComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "plastik-shared-activity-ui-overlay")(1, "div", 16)(2, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](3, "div")(4, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "p", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6, "Loading...");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
}
function CoreCmsLayoutFeatureComponent_Defer_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("sendDismiss", function CoreCmsLayoutFeatureComponent_Defer_7_Template_div_sendDismiss_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r2);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r2.notificationStore.dismiss());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("plastikSnackbar", ctx_r2.notificationStore.configuration());
  }
}
function CoreCmsLayoutFeatureComponent_Defer_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0, 11);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    const toggleSidenavButtonTpl_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", toggleSidenavButtonTpl_r4);
  }
}
function CoreCmsLayoutFeatureComponent_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0, null, 3);
  }
}
function CoreCmsLayoutFeatureComponent_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0, null, 3);
  }
}
function CoreCmsLayoutFeatureComponent_Defer_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0, 11);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    const toggleSidenavButtonTpl_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", toggleSidenavButtonTpl_r4);
  }
}
function CoreCmsLayoutFeatureComponent_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0, 11);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    const headerMenuTpl_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", headerMenuTpl_r5);
  }
}
function CoreCmsLayoutFeatureComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](0, 14);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    const h1Tpl_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](39);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", h1Tpl_r6);
  }
}
function CoreCmsLayoutFeatureComponent_For_32_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "mat-divider");
  }
}
function CoreCmsLayoutFeatureComponent_For_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "mat-list-item", 19)(1, "mat-icon", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](5, CoreCmsLayoutFeatureComponent_For_32_Conditional_5_Template, 1, 0, "mat-divider");
  }
  if (rf & 2) {
    const item_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("routerLink", item_r7 == null ? null : item_r7.route)("routerLinkActiveOptions", (item_r7 == null ? null : item_r7.routerLinkActiveOptionsExact) || _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](7, _c2));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("aria-hidden", false)("aria-label", item_r7.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r7.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r7.title);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"](item_r7.divider ? 5 : -1);
  }
}
function CoreCmsLayoutFeatureComponent_Defer_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "plastik-core-cms-layout-ui-footer", 22)(1, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](3, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "a", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5, "Plastikaweb");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6, " | ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](7, "a", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8, "El Llevat");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind2"](3, 1, ctx_r2.currentDate, "yyyy"), " ");
  }
}
function CoreCmsLayoutFeatureComponent_ng_template_36_For_10_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 31)(1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("routerLink", item_r8.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r8.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r8.title);
  }
}
function CoreCmsLayoutFeatureComponent_ng_template_36_For_10_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function CoreCmsLayoutFeatureComponent_ng_template_36_For_10_Conditional_1_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r9);
      const item_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r2.onSendAction(item_r8.action));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r8.icon);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](item_r8.title);
  }
}
function CoreCmsLayoutFeatureComponent_ng_template_36_For_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](0, CoreCmsLayoutFeatureComponent_ng_template_36_For_10_Conditional_0_Template, 5, 3, "button", 31)(1, CoreCmsLayoutFeatureComponent_ng_template_36_For_10_Conditional_1_Template, 5, 2, "button", 32);
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"](item_r8 && item_r8.route ? 0 : item_r8 && item_r8.action ? 1 : -1);
  }
}
function CoreCmsLayoutFeatureComponent_ng_template_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 26)(1, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "mat-icon", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4, "account_circle");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "mat-menu", 29, 4)(7, "span", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeaterCreate"](9, CoreCmsLayoutFeatureComponent_ng_template_36_For_10_Template, 2, 1, null, null, _forTrack0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const menu_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    const headerMenu_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreadContextLet"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("matMenuTriggerFor", menu_r10);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("aria-label", headerMenu_r11 == null ? null : headerMenu_r11.label());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](headerMenu_r11 == null ? null : headerMenu_r11.label());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](headerMenu_r11 == null ? null : headerMenu_r11.label());
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeater"](headerMenu_r11 == null ? null : headerMenu_r11.config);
  }
}
function CoreCmsLayoutFeatureComponent_ng_template_38_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "svg-icon", 35);
  }
  if (rf & 2) {
    const icon_r12 = ctx;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
    const headerTitle_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreadContextLet"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("src", icon_r12.iconPath)("svgClass", icon_r12.svgClass)("svgAriaLabel", headerTitle_r13);
  }
}
function CoreCmsLayoutFeatureComponent_ng_template_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](1, CoreCmsLayoutFeatureComponent_ng_template_38_Conditional_1_Template, 1, 3, "svg-icon", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    let tmp_10_0;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    const headerTitle_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreadContextLet"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"]((tmp_10_0 = ctx_r2.headerConfig.mainIcon) ? 1 : -1, tmp_10_0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](ctx_r2.headerConfig.extendedTitle || headerTitle_r13);
  }
}
function CoreCmsLayoutFeatureComponent_ng_template_40_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "mat-icon", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "menu");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function CoreCmsLayoutFeatureComponent_ng_template_40_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "mat-icon", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1, "close");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
}
function CoreCmsLayoutFeatureComponent_ng_template_40_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function CoreCmsLayoutFeatureComponent_ng_template_40_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r14);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r2.onToggleSidenav());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](1, CoreCmsLayoutFeatureComponent_ng_template_40_Conditional_1_Template, 2, 0, "mat-icon", 37)(2, CoreCmsLayoutFeatureComponent_ng_template_40_Conditional_2_Template, 2, 0, "mat-icon", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    const sidenavOpened_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreadContextLet"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"](!sidenavOpened_r15 ? 1 : sidenavOpened_r15 ? 2 : -1);
  }
}
class CoreCmsLayoutFeatureComponent {
  #layoutFacade = (0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.inject)(_plastik_core_cms_layout_data_access__WEBPACK_IMPORTED_MODULE_18__.LayoutFacade);
  #destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_2__.Subject();
  #breakpointObserver = (0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.inject)(_angular_cdk_layout__WEBPACK_IMPORTED_MODULE_5__.BreakpointObserver);
  #zone = (0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_9__.NgZone);
  notificationStore = (0,_angular_core__WEBPACK_IMPORTED_MODULE_8__.inject)(_plastik_shared_notification_data_access__WEBPACK_IMPORTED_MODULE_22__.notificationStore);
  hideFooter = (0,_angular_core__WEBPACK_IMPORTED_MODULE_10__.input)(false, ...(ngDevMode ? [{
    debugName: "hideFooter"
  }] : []));
  widgetsContainer = (0,_angular_core__WEBPACK_IMPORTED_MODULE_10__.viewChild)('widgetsContainer', ...(ngDevMode ? [{
    debugName: "widgetsContainer",
    read: _angular_core__WEBPACK_IMPORTED_MODULE_9__.ViewContainerRef
  }] : [{
    read: _angular_core__WEBPACK_IMPORTED_MODULE_9__.ViewContainerRef
  }]));
  currentDate = new Date();
  sidenavOpened$ = this.#layoutFacade.sidenavOpened$;
  isMobile$ = this.#layoutFacade.isMobile$;
  isActive = this.#layoutFacade.isActive;
  sidenavConfig = this.#layoutFacade.sidenavConfig;
  headerConfig = this.#layoutFacade.headerConfig;
  headerWidgetsConfig = this.headerConfig?.widgetsConfig;
  ngOnInit() {
    // TODO: Isolate breakpoint observer into its own service https://github.com/plastikaweb/plastikspace/issues/68
    this.#breakpointObserver.observe([_angular_cdk_layout__WEBPACK_IMPORTED_MODULE_6__.Breakpoints.Handset, _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_6__.Breakpoints.Tablet, _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_6__.Breakpoints.Medium]).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.#destroyed$),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(handset => handset.matches)).subscribe(matches => {
      if (matches) this.onToggleSidenav(!matches);
      this.onSetIsMobile(matches);
    });
  }
  ngAfterViewInit() {
    this.#zone.runOutsideAngular(() => this.createWidgets());
  }
  ngOnDestroy() {
    this.#destroyed$.next();
    this.#destroyed$.complete();
  }
  onNotificationDismiss() {
    this.notificationStore.dismiss();
  }
  onSendAction(action) {
    this.#zone.runOutsideAngular(() => action());
  }
  onToggleSidenav(opened) {
    this.#zone.runOutsideAngular(() => this.#layoutFacade.toggleSidenav(opened));
  }
  onSetIsMobile(isMobile) {
    this.#zone.runOutsideAngular(() => this.#layoutFacade.setIsMobile(isMobile));
  }
  createWidgets() {
    if (!this.headerWidgetsConfig) return;
    const container = this.widgetsContainer();
    if (container) {
      container.clear();
      this.headerWidgetsConfig?.widgets?.forEach(/*#__PURE__*/function () {
        var _ref = (0,_home_runner_work_plastikspace_plastikspace_node_modules_angular_devkit_build_angular_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (widget) {
          const component = yield widget.component();
          const componentRef = container.createComponent(component);
          if (widget.inputs) {
            Object.keys(widget.inputs ?? {}).map(key => {
              componentRef?.setInput(key, widget.inputs?.[key]);
            });
          }
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }
  static ɵfac = function CoreCmsLayoutFeatureComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CoreCmsLayoutFeatureComponent)();
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
    type: CoreCmsLayoutFeatureComponent,
    selectors: [["plastik-core-cms-layout-feature"]],
    viewQuery: function CoreCmsLayoutFeatureComponent_Query(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵviewQuerySignal"](ctx.widgetsContainer, _c0, 5, _angular_core__WEBPACK_IMPORTED_MODULE_9__.ViewContainerRef);
      }
      if (rf & 2) {
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵqueryAdvance"]();
      }
    },
    inputs: {
      hideFooter: [1, "hideFooter"]
    },
    decls: 42,
    vars: 25,
    consts: [["headerMenuTpl", ""], ["h1Tpl", ""], ["toggleSidenavButtonTpl", ""], ["widgetsContainer", ""], ["menu", "matMenu"], [1, "core-cms-container"], ["data-test", "layout-header"], ["start", "", 1, "flex", "gap-0", "items-center", "sm:gap-sm"], ["data-test", "layout-title"], [1, "sr-only"], [1, "flex", "justify-between", "content-center", "items-center", "hover:no-underline", "gap-sub", 3, "routerLink"], [3, "ngTemplateOutlet"], ["end", "", 1, "flex", "items-center", "gap-tiny", "lg:gap-sm"], [3, "toggleSidenav", "position", "mode", "fixedInViewport", "sidenavOpened"], ["header", "", 3, "ngTemplateOutlet"], ["menu-items", "", "data-test", "sidenav-list"], [1, "spinner-container"], [1, "lds-ripple"], [3, "sendDismiss", "plastikSnackbar"], ["routerLinkActive", "bg-gray-10", "ariaCurrentWhenActive", "page", 1, "my-tiny", "h-xll", "hover:bg-gray-10", "focus:bg-gray-10", 3, "routerLink", "routerLinkActiveOptions"], ["matListItemIcon", ""], ["matListItemTitle", ""], ["data-test", "layout-footer"], ["content", "", 1, "flex", "flex-row", "justify-center", "items-center", "text-sm", "gap-tiny"], ["aria-label", "visit www.plastikaweb.com page", "href", "https://www.plastikaweb.com", "target", "_blank", 1, "underline", "underline-offset-2"], ["aria-label", "visitar www.llevat.org", "href", "https://www.llevat.org", "target", "_blank", 1, "underline", "underline-offset-2"], ["mat-button", "", 1, "flex", "gap-tiny", 3, "matMenuTriggerFor"], [1, "hidden", "sm:block"], [1, "size-[30px]", "text-[30px]", "m-0", "p-0"], [1, "px-sub"], [1, "block", "border-b-2", "sm:hidden", "w-fit", "text-balance", "p-tiny", "border-b-gray-10"], ["type", "button", "mat-menu-item", "", 3, "routerLink"], ["type", "button", "mat-menu-item", ""], ["type", "button", "mat-menu-item", "", 3, "click"], [1, "flex", "justify-center", "items-center", "gap-sub"], [3, "src", "svgClass", "svgAriaLabel"], ["mat-icon-button", "", "aria-label", "men\u00FA lateral", "data-test", "toggle-sidenav-button", 1, "flex", "justify-center", "align-middle", 3, "click"], [1, "mat-18"]],
    template: function CoreCmsLayoutFeatureComponent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdeclareLet"](0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](1, "ngrxPush");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdeclareLet"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](3, "ngrxPush");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdeclareLet"](4)(5);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](6, CoreCmsLayoutFeatureComponent_Conditional_6_Template, 7, 0, "plastik-shared-activity-ui-overlay");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdomTemplate"](7, CoreCmsLayoutFeatureComponent_Defer_7_Template, 1, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefer"](8, 7, CoreCmsLayoutFeatureComponent_Defer_8_DepsFn);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](10, "div", 5)(11, "plastik-core-cms-layout-ui-header", 6)(12, "div", 7);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdomTemplate"](13, CoreCmsLayoutFeatureComponent_Defer_13_Template, 1, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefer"](14, 13, CoreCmsLayoutFeatureComponent_Defer_14_DepsFn);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "h1", 8)(17, "span", 9);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](18);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "a", 10);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainer"](20, 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](21, CoreCmsLayoutFeatureComponent_Conditional_21_Template, 2, 0, "ng-container");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](22, "div", 12);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](23, CoreCmsLayoutFeatureComponent_Conditional_23_Template, 2, 0, "ng-container");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdomTemplate"](24, CoreCmsLayoutFeatureComponent_Defer_24_Template, 1, 1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefer"](25, 24, CoreCmsLayoutFeatureComponent_Defer_14_DepsFn);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](27, CoreCmsLayoutFeatureComponent_Conditional_27_Template, 1, 1, "ng-container", 11);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](28, "plastik-core-cms-layout-ui-sidenav", 13);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("toggleSidenav", function CoreCmsLayoutFeatureComponent_Template_plastik_core_cms_layout_ui_sidenav_toggleSidenav_28_listener() {
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r1);
          return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx.onToggleSidenav());
        });
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditionalCreate"](29, CoreCmsLayoutFeatureComponent_Conditional_29_Template, 1, 1, "ng-container", 14);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](30, "mat-nav-list", 15);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeaterCreate"](31, CoreCmsLayoutFeatureComponent_For_32_Template, 6, 8, null, null, _forTrack0);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdomTemplate"](33, CoreCmsLayoutFeatureComponent_Defer_33_Template, 9, 4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefer"](34, 33, CoreCmsLayoutFeatureComponent_Defer_34_DepsFn);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](36, CoreCmsLayoutFeatureComponent_ng_template_36_Template, 11, 4, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplateRefExtractor"])(38, CoreCmsLayoutFeatureComponent_ng_template_38_Template, 4, 2, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplateRefExtractor"])(40, CoreCmsLayoutFeatureComponent_ng_template_40_Template, 3, 1, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplateRefExtractor"]);
      }
      if (rf & 2) {
        const h1Tpl_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](39);
        const sidenavOpened_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵstoreLet"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](1, 17, ctx.sidenavOpened$) || false);
        const isMobile_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](3, 20, ctx.isMobile$) || false;
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
        const headerMenu_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵstoreLet"](ctx.headerConfig.userMenuConfig);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
        const headerTitle_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵstoreLet"](ctx.headerConfig.title);
        const sidenavPosition_r20 = ctx.headerConfig.sidenavPosition || "start";
        const headerWidgetsPosition_r21 = ctx.headerWidgetsConfig == null ? null : ctx.headerWidgetsConfig.position;
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"](ctx.isActive() ? 6 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdeferWhen"](ctx.notificationStore.configuration());
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](6);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdeferWhen"](sidenavPosition_r20 === "start");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](headerTitle_r19);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](24, _c1));
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵattribute"]("title", headerTitle_r19);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngTemplateOutlet", h1Tpl_r6);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"](ctx.headerWidgetsConfig && headerWidgetsPosition_r21 === "start" ? 21 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"](ctx.headerWidgetsConfig && headerWidgetsPosition_r21 === "end" ? 23 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdeferWhen"](sidenavPosition_r20 === "end");
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"](headerMenu_r18 ? 27 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("position", sidenavPosition_r20)("mode", isMobile_r17 ? "over" : "side")("fixedInViewport", isMobile_r17)("sidenavOpened", sidenavOpened_r16);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"]();
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵconditional"](isMobile_r17 && sidenavOpened_r16 ? 29 : -1);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrepeater"](ctx.sidenavConfig());
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
        _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdeferWhen"](!ctx.hideFooter());
      }
    },
    dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_16__.RouterLink, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgTemplateOutlet, _angular_router__WEBPACK_IMPORTED_MODULE_16__.RouterLinkActive, _angular_material_sidenav__WEBPACK_IMPORTED_MODULE_15__.MatSidenavModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_13__.MatListModule, _angular_material_list__WEBPACK_IMPORTED_MODULE_13__.MatNavList, _angular_material_list__WEBPACK_IMPORTED_MODULE_13__.MatListItem, _angular_material_list__WEBPACK_IMPORTED_MODULE_13__.MatListItemIcon, _angular_material_list__WEBPACK_IMPORTED_MODULE_23__.MatDivider, _angular_material_list__WEBPACK_IMPORTED_MODULE_13__.MatListItemTitle, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIconModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_12__.MatIcon, _angular_material_button__WEBPACK_IMPORTED_MODULE_11__.MatButton, _angular_material_menu__WEBPACK_IMPORTED_MODULE_14__.MatMenuModule, _angular_material_menu__WEBPACK_IMPORTED_MODULE_14__.MatMenu, _angular_material_menu__WEBPACK_IMPORTED_MODULE_14__.MatMenuItem, _angular_material_menu__WEBPACK_IMPORTED_MODULE_14__.MatMenuTrigger, angular_svg_icon__WEBPACK_IMPORTED_MODULE_1__.AngularSvgIconModule, angular_svg_icon__WEBPACK_IMPORTED_MODULE_1__.SvgIconComponent, _plastik_core_cms_layout_header__WEBPACK_IMPORTED_MODULE_19__.CoreCmsLayoutUiHeaderComponent, _plastik_core_cms_layout_sidenav__WEBPACK_IMPORTED_MODULE_20__.CoreCmsLayoutUiSidenavComponent, _plastik_shared_activity_ui__WEBPACK_IMPORTED_MODULE_21__.SharedActivityUiOverlayComponent, _ngrx_component__WEBPACK_IMPORTED_MODULE_17__.PushPipe],
    encapsulation: 2,
    changeDetection: 0
  });
}

/***/ }),

/***/ 6299:
/*!************************************************!*\
  !*** ./apps/nasa-images/src/app/app.config.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   appConfig: () => (/* binding */ appConfig)
/* harmony export */ });
/* harmony import */ var angular_svg_icon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular-svg-icon */ 7695);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/cdk/a11y */ 2205);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 1142);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 1693);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 3499);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 310);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/snack-bar */ 4645);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 3288);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/router */ 709);
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngrx/effects */ 9497);
/* harmony import */ var _ngrx_router_store__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngrx/router-store */ 4589);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @ngrx/store */ 9797);
/* harmony import */ var _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngrx/store-devtools */ 3523);
/* harmony import */ var _plastik_core_cms_layout_data_access__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @plastik/core/cms-layout/data-access */ 2882);
/* harmony import */ var _plastik_core_cms_layout_entities__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @plastik/core/cms-layout/entities */ 3512);
/* harmony import */ var _plastik_core_entities__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @plastik/core/entities */ 6925);
/* harmony import */ var _plastik_core_environments__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @plastik/core/environments */ 2071);
/* harmony import */ var _plastik_core_router_state__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @plastik/core/router-state */ 3561);
/* harmony import */ var _plastik_nasa_images_search_data_access__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @plastik/nasa-images/search/data-access */ 3321);
/* harmony import */ var _plastik_shared_activity_data_access__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @plastik/shared/activity/data-access */ 6711);
/* harmony import */ var _plastik_shared_notification_data_access__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @plastik/shared/notification/data-access */ 5757);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../environments/environment */ 38);
/* harmony import */ var _app_routing__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./app.routing */ 3251);
/* harmony import */ var _cms_layout_config__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./cms-layout-config */ 4919);






















const appConfig = {
  providers: [(0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.provideZonelessChangeDetection)(), (0,_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.provideHttpClient)(), (0,_angular_router__WEBPACK_IMPORTED_MODULE_9__.provideRouter)(_app_routing__WEBPACK_IMPORTED_MODULE_23__.routes), (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.provideAppInitializer)(() => {
    if (typeof window === 'undefined') {
      return;
    }
    // Rebind RAF APIs to `window` so zoneless schedulers (NgRx Component) avoid "Illegal invocation".
    const boundRaf = window.requestAnimationFrame.bind(window);
    const boundCancelRaf = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = boundRaf;
    window.cancelAnimationFrame = boundCancelRaf;
  }), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_12__.provideStore)(), (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.importProvidersFrom)(_angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_1__.A11yModule, angular_svg_icon__WEBPACK_IMPORTED_MODULE_0__.AngularSvgIconModule.forRoot(), _ngrx_store__WEBPACK_IMPORTED_MODULE_12__.StoreModule.forRoot(_plastik_core_router_state__WEBPACK_IMPORTED_MODULE_18__.routerReducers, {
    runtimeChecks: {
      strictActionImmutability: true,
      strictStateImmutability: true
    }
  }), _ngrx_effects__WEBPACK_IMPORTED_MODULE_10__.EffectsModule.forRoot([_plastik_core_router_state__WEBPACK_IMPORTED_MODULE_18__.RouterStateEffects]), (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.isDevMode)() ? _ngrx_store_devtools__WEBPACK_IMPORTED_MODULE_13__.StoreDevtoolsModule.instrument({
    name: _environments_environment__WEBPACK_IMPORTED_MODULE_22__.environment.name,
    maxAge: 25,
    connectInZone: true
  }) : [], _plastik_core_cms_layout_data_access__WEBPACK_IMPORTED_MODULE_14__.CoreCmsLayoutDataAccessModule, _plastik_shared_notification_data_access__WEBPACK_IMPORTED_MODULE_21__.notificationStore, _plastik_shared_activity_data_access__WEBPACK_IMPORTED_MODULE_20__.activityStore), ..._plastik_nasa_images_search_data_access__WEBPACK_IMPORTED_MODULE_19__.NASA_IMAGES_PROVIDERS, (0,_ngrx_router_store__WEBPACK_IMPORTED_MODULE_11__.provideRouterStore)({
    serializer: _plastik_core_router_state__WEBPACK_IMPORTED_MODULE_18__.CustomRouterSerializer,
    navigationActionTiming: _ngrx_router_store__WEBPACK_IMPORTED_MODULE_11__.NavigationActionTiming.PreActivation,
    routerState: _ngrx_router_store__WEBPACK_IMPORTED_MODULE_11__.RouterState.Minimal
  }), {
    provide: _plastik_core_environments__WEBPACK_IMPORTED_MODULE_17__.ENVIRONMENT,
    useValue: _environments_environment__WEBPACK_IMPORTED_MODULE_22__.environment
  }, {
    provide: _angular_router__WEBPACK_IMPORTED_MODULE_8__.TitleStrategy,
    useClass: _plastik_core_router_state__WEBPACK_IMPORTED_MODULE_18__.PrefixTitleService
  }, {
    provide: _plastik_core_cms_layout_entities__WEBPACK_IMPORTED_MODULE_15__.CORE_CMS_LAYOUT_HEADER_CONFIG,
    useValue: _cms_layout_config__WEBPACK_IMPORTED_MODULE_24__.headerConfig
  }, {
    provide: _plastik_core_cms_layout_data_access__WEBPACK_IMPORTED_MODULE_14__.VIEW_CONFIG,
    useValue: (0,_plastik_core_entities__WEBPACK_IMPORTED_MODULE_16__.getVisibleNavigationList)(_cms_layout_config__WEBPACK_IMPORTED_MODULE_24__.viewConfig)
  }, {
    provide: _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_7__.MAT_SNACK_BAR_DEFAULT_OPTIONS,
    useValue: {
      verticalPosition: 'top',
      politeness: 'assertive'
    }
  }, {
    provide: _angular_common__WEBPACK_IMPORTED_MODULE_2__.PRECONNECT_CHECK_BLOCKLIST,
    useValue: 'https://images-assets.nasa.gov'
  }]
};

/***/ }),

/***/ 6711:
/*!*******************************************************!*\
  !*** ./libs/shared/activity/data-access/src/index.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activityStore: () => (/* reexport safe */ _lib_state_activity_store__WEBPACK_IMPORTED_MODULE_0__.activityStore)
/* harmony export */ });
/* harmony import */ var _lib_state_activity_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/+state/activity.store */ 8474);


/***/ }),

/***/ 6925:
/*!*****************************************!*\
  !*** ./libs/core/entities/src/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FORM_TOKEN: () => (/* reexport safe */ _form_config__WEBPACK_IMPORTED_MODULE_1__.FORM_TOKEN),
/* harmony export */   getVisibleNavigationList: () => (/* reexport safe */ _view_config__WEBPACK_IMPORTED_MODULE_2__.getVisibleNavigationList)
/* harmony export */ });
/* harmony import */ var _base_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base-entity */ 3674);
/* harmony import */ var _form_config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./form-config */ 3226);
/* harmony import */ var _view_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view-config */ 2475);




/***/ }),

/***/ 7094:
/*!**********************************************!*\
  !*** ./libs/shared/activity/ui/src/index.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharedActivityUiLinearComponent: () => (/* reexport safe */ _lib_shared_activity_ui_linear_shared_activity_ui_linear_component__WEBPACK_IMPORTED_MODULE_0__.SharedActivityUiLinearComponent),
/* harmony export */   SharedActivityUiOverlayComponent: () => (/* reexport safe */ _lib_shared_activity_ui_overlay_shared_activity_ui_overlay_component__WEBPACK_IMPORTED_MODULE_1__.SharedActivityUiOverlayComponent)
/* harmony export */ });
/* harmony import */ var _lib_shared_activity_ui_linear_shared_activity_ui_linear_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/shared-activity-ui-linear/shared-activity-ui-linear.component */ 3108);
/* harmony import */ var _lib_shared_activity_ui_overlay_shared_activity_ui_overlay_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/shared-activity-ui-overlay/shared-activity-ui-overlay.component */ 4456);



/***/ }),

/***/ 7242:
/*!***************************************************!*\
  !*** ./apps/nasa-images/src/app/app.component.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _plastik_core_cms_layout__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @plastik/core/cms-layout */ 4753);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 3499);


class AppComponent {
  static ɵfac = function AppComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || AppComponent)();
  };
  static ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
    type: AppComponent,
    selectors: [["plastik-root"]],
    decls: 1,
    vars: 0,
    template: function AppComponent_Template(rf, ctx) {
      if (rf & 1) {
        _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "plastik-core-cms-layout-feature");
      }
    },
    dependencies: [_plastik_core_cms_layout__WEBPACK_IMPORTED_MODULE_0__.CoreCmsLayoutFeatureComponent],
    encapsulation: 2
  });
}

/***/ }),

/***/ 7420:
/*!*****************************************************************************!*\
  !*** ./libs/core/router/data-access/src/lib/services/navigation.service.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavigationService: () => (/* binding */ NavigationService)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common */ 5656);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 3288);




class NavigationService {
  #router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
  #location = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_common__WEBPACK_IMPORTED_MODULE_0__.Location);
  #history = [];
  constructor() {
    this.#router.events.subscribe(event => {
      if (event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_2__.NavigationEnd) {
        this.#history = [event.urlAfterRedirects, ...this.#history];
      }
    });
  }
  /**
   * @description Navigate to a concrete URL with params and extras if needed.
   * @param { NavigationProps } navigationProps The navigation configuration properties.
   */
  navigate({
    path,
    extras
  }) {
    this.#router.navigate(path, {
      queryParams: extras?.queryParams,
      fragment: extras?.fragment
    });
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
      this.#router.navigateByUrl(backBaseUrl || '/');
    } else {
      this.#location.back();
    }
  }
  static ɵfac = function NavigationService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NavigationService)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: NavigationService,
    factory: NavigationService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 7547:
/*!**********************************************************!*\
  !*** ./libs/core/util/api/src/lib/pocketbase.service.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PocketBaseService: () => (/* binding */ PocketBaseService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 141);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 494);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 6663);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 6853);
/* harmony import */ var pocketbase__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! pocketbase */ 4302);
/* harmony import */ var _base_data_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./base-data.service */ 9276);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 4131);




/**
 * @description Abstract class to inherit from on creating a feature PocketBase service.
 * @template T, P, E
 *
 * **T** refers to the main feature model item used inside applications.
 *
 * **P** refers to the type description of the passed parameters to API call methods.
 * These parameters are the usual option to pass configuration with the REST call, for example for filtering results, paginate or ordering data.
 *
 * **E** refers to the environment type extension with the PocketBase URL property.
 */
class PocketBaseService extends _base_data_service__WEBPACK_IMPORTED_MODULE_5__.BaseDataService {
  #pb;
  /**
   * @description Cache time in milliseconds
   */
  cacheTime = 1000 * 60 * 5; // 5 minutes default
  constructor() {
    super();
    this.#pb = new pocketbase__WEBPACK_IMPORTED_MODULE_4__["default"](this.getPocketBaseUrlFromEnvironment());
  }
  /**
   * @description Gets the PocketBase URL from the environment. Override if your environment uses a different property name.
   * @returns {string} The PocketBase URL.
   */
  getPocketBaseUrlFromEnvironment() {
    return this.environment.baseApiUrl;
  }
  /**
   * @description Method to map the PocketBase response with the inner typings before storing it in app.
   * Override this method in child classes when inheriting from PocketBaseService with your custom response structures.
   * @param { T } data The PocketBase response data as it is.
   * @returns { T } The mapped response.
   */
  mapResponse(data) {
    return data;
  }
  /**
   * @param { ListResult<T> } data The list response data as it is.
   * @returns { ListResult<T> } The mapped list response.
   * @description Method to map list responses.
   */
  mapListResponse(data) {
    return {
      ...data,
      items: data.items.map(item => this.mapResponse(item))
    };
  }
  /**
   * @param { P } params The list parameters.
   * @returns { Observable<ListResult<T>> } The list of records.
   * @description Get a list of records.
   */
  getList(params) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.from)(this.#pb.collection(this.collectionName()).getList(params?.page || 1, params?.perPage || 50, params || {})).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(data => this.mapListResponse(data)), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.shareReplay)({
      bufferSize: 1,
      refCount: true,
      windowTime: this.cacheTime
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  /**
   * @param { RecordFullListOptions } params The full list parameters.
   * @returns { Observable<T[]> } The full list of records.
   * @description Get all records (max 500 by default).
   */
  getFullList(params) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.from)(this.#pb.collection(this.collectionName()).getFullList(params)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(items => items.map(item => this.mapResponse(item))), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.shareReplay)({
      bufferSize: 1,
      refCount: true,
      windowTime: this.cacheTime
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  /**
   * @param { string } id The record ID.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The single record.
   * @description Get a single record by ID.
   */
  getOne(id, options) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.from)(this.#pb.collection(this.collectionName()).getOne(id, options)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(data => this.mapResponse(data)), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.shareReplay)({
      bufferSize: 1,
      refCount: true,
      windowTime: this.cacheTime
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  /**
   * @param { string } filter The filter.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The first record matching the filter.
   * @description Get the first record matching the filter.
   */
  getFirstListItem(filter, options) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.from)(this.#pb.collection(this.collectionName()).getFirstListItem(filter, options)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(data => this.mapResponse(data)), (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.shareReplay)({
      bufferSize: 1,
      refCount: true,
      windowTime: this.cacheTime
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  /**
   * @param { Partial<T> } data The record data.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The created record.
   * @description Create a new record.
   */
  create(data, options) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.from)(this.#pb.collection(this.collectionName()).create(data, options)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(response => this.mapResponse(response)), (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  /**
   * @param { string } id The record ID.
   * @param { Partial<T> } data The record data.
   * @param { RecordOptions } options The record options.
   * @returns { Observable<T> } The updated record.
   * @description Update an existing record.
   */
  update(id, data, options) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.from)(this.#pb.collection(this.collectionName()).update(id, data, options)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(response => this.mapResponse(response)), (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  /**
   * @param { string } id The record ID.
   * @returns { Observable<boolean> } The deletion result.
   * @description Delete a record.
   */
  delete(id) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.from)(this.#pb.collection(this.collectionName()).delete(id)).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(() => true), (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.catchError)(this.handleError));
  }
  static ɵfac = function PocketBaseService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || PocketBaseService)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjectable"]({
    token: PocketBaseService,
    factory: PocketBaseService.ɵfac
  });
}

/***/ }),

/***/ 7672:
/*!*************************************************************************************!*\
  !*** ./libs/core/router/data-access/src/lib/+state/reducer/router-state.reducer.ts ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomRouterSerializer: () => (/* binding */ CustomRouterSerializer),
/* harmony export */   routerReducers: () => (/* binding */ routerReducers)
/* harmony export */ });
/* harmony import */ var _ngrx_router_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/router-store */ 4589);
/* harmony import */ var _router_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../router-state */ 3256);


/**
 * @description The router state reducer map.
 */
const routerReducers = {
  [_router_state__WEBPACK_IMPORTED_MODULE_1__.routerKey]: _ngrx_router_store__WEBPACK_IMPORTED_MODULE_0__.routerReducer
};
/**
 * @description The router state serializer.
 */
class CustomRouterSerializer {
  serialize(routerState) {
    let route = routerState.root;
    const params = {};
    while (route.firstChild) {
      route = route.firstChild;
      Object.keys(route.params).forEach(key => params[key] = route.params?.[key]);
    }
    const {
      url,
      root: {
        queryParams
      }
    } = routerState;
    const {
      data
    } = route;
    return {
      url,
      params,
      queryParams,
      data
    };
  }
}

/***/ }),

/***/ 8002:
/*!******************************************************!*\
  !*** ./libs/shared/util/objects/src/util-objects.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allAreFalsy: () => (/* binding */ allAreFalsy),
/* harmony export */   areObjectEntriesEqual: () => (/* binding */ areObjectEntriesEqual),
/* harmony export */   collectionToArray: () => (/* binding */ collectionToArray),
/* harmony export */   formatURLQueryParams: () => (/* binding */ formatURLQueryParams),
/* harmony export */   getQueryParams: () => (/* binding */ getQueryParams),
/* harmony export */   isEmpty: () => (/* binding */ isEmpty),
/* harmony export */   isNil: () => (/* binding */ isNil),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   removeNullProperties: () => (/* binding */ removeNullProperties),
/* harmony export */   setEmptyStringPropertiesToNull: () => (/* binding */ setEmptyStringPropertiesToNull),
/* harmony export */   transformStringToBooleanProperties: () => (/* binding */ transformStringToBooleanProperties),
/* harmony export */   transformToString: () => (/* binding */ transformToString)
/* harmony export */ });
/* harmony import */ var _angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/cdk/coercion */ 6364);

/**
 * @description Check if an array or object are empty.
 * @param {any} obj Object parameter passed.
 * @returns {boolean}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isEmpty(obj) {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries(obj || {}).length;
}
/**
 * @description Check if passed parameter is a string.
 * @param {any} obj Object parameter passed.
 * @returns {boolean}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isString(obj) {
  return typeof obj === 'string';
}
/**
 * @description Check if passed parameter is null or undefined.
 * @param  {unknown} value The passed parameter.
 * @returns {boolean}.
 */
function isNil(value) {
  return value === undefined || value === null;
}
/**
 * @description Check if passed parameter is an object.
 * @param  {any} obj Object parameter passed.
 * @returns {boolean}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isObject(obj) {
  return obj instanceof Object && obj.constructor === Object;
}
/**
 * @description Given an URL or a name/value pairs object it returns an object with name/value pairs of all the query params available.
 * @param {any} params A list of query params.
 * @param  {Record<string, unknown>} defaultParams A list of default query parameters.
 * @returns {Record<string, unknown>}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getQueryParams(params, defaultParams = {}) {
  if (isString(params)) {
    return {
      ...defaultParams,
      ...formatURLQueryParams(params)
    };
  } else if (isObject(params)) {
    return {
      ...defaultParams,
      ...params
    };
  }
  throw new Error('getQueryParams has no valid parameters. You need to pass a string or a object of name/value pairs.');
}
/**
 * @description Returns an object from a url with query params.
 * @param  {string} url The URL with query params.
 * @returns {Record<string, unknown>}.
 */
function formatURLQueryParams(url) {
  const urlParams = url.split('?')[1].split('&');
  return urlParams.reduce((prev, current) => {
    const pair = current.split('=');
    return {
      ...prev,
      [pair[0]]: decodeURIComponent(pair[1])
    };
  }, {});
}
/**
 * @description Returns an object without properties with null value.
 * @param  {Record<string, string | number | boolean | null>} collection Object parameter passed.
 * @returns {Record<string, string | number | boolean>}.
 */
function removeNullProperties(collection) {
  return Object.entries(collection).reduce((currentCollection, [property, value]) => value === null ? currentCollection : (currentCollection[property] = value, currentCollection), {});
}
/**
 * @description Returns an object with properties with empty string value replaced by null.
 * @param  {Record<string, string | number | boolean | null>} collection Object parameter passed.
 * @returns {Record<string, string | number | boolean | null>}.
 */
function setEmptyStringPropertiesToNull(collection) {
  return Object.entries(collection).reduce((currentCollection, [property, value]) => {
    currentCollection[property] = isString(value) && !value.length ? null : value;
    return currentCollection;
  }, {});
}
/**
 * @description Returns a boolean after comparing the object entries.
 * @param {object} prev First object.
 * @param {object} curr Current object.
 * @returns {boolean}.
 */
function areObjectEntriesEqual(prev, curr) {
  if (!prev && !curr) {
    return true;
  }
  if (!prev || !curr) {
    return false;
  }
  return Object.entries(prev).toString() === Object.entries(curr).toString();
}
/**
 * @description Returns an object with replaced values for "false" and "true" as boolean values.
 * @param  {Record<string, string | number | boolean | null>} collection Object parameter passed.
 * @returns {Record<string, string | number | boolean>}.
 */
function transformStringToBooleanProperties(collection) {
  return Object.entries(collection).reduce((currentCollection, [property, value]) => {
    currentCollection[property] = isString(value) && (value === 'false' || value === 'true') ? (0,_angular_cdk_coercion__WEBPACK_IMPORTED_MODULE_0__.coerceBooleanProperty)(value) : value;
    return currentCollection;
  }, {});
}
/**
 * @description Returns a boolean value depending if all elements in the passed array are false or not.
 * @param {boolean[]} arr An array of boolean values passed as parameter.
 * @returns {boolean}.
 */
function allAreFalsy(arr) {
  return arr.every(element => element === false);
}
/**
 * @description Returns a string value when the input was able to be converted in string format otherwise it returns an empty string.
 * @param {unknown} value The passed valued as parameter.
 * @returns {string}.
 */
function transformToString(value) {
  if (isString(value)) {
    return value;
  }
  let result;
  try {
    result = JSON.stringify(value) ?? '';
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    result = '';
  }
  return result;
}
/**
 * @description Returns an array based on passed collection.
 * @param {Record} collection The passed collection as parameter.
 * @returns {Array}.
 */
function collectionToArray(collection) {
  return Object.keys(collection).map(key => collection[key]);
}

/***/ }),

/***/ 8123:
/*!***************************************************************************!*\
  !*** ./libs/nasa-images/search/data-access/src/lib/nasa-images.tokens.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NASA_IMAGES_DATA_LIST_TOKEN: () => (/* binding */ NASA_IMAGES_DATA_LIST_TOKEN),
/* harmony export */   NASA_IMAGES_PROVIDERS: () => (/* binding */ NASA_IMAGES_PROVIDERS)
/* harmony export */ });
/* harmony import */ var _plastik_core_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @plastik/core/api */ 2905);
/* harmony import */ var _nasa_images_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./nasa-images-api.service */ 9939);


const NASA_IMAGES_DATA_LIST_TOKEN = (0,_plastik_core_api__WEBPACK_IMPORTED_MODULE_0__.createDataGetListServiceToken)('NASA_IMAGES_DATA_LIST_TOKEN');
const NASA_IMAGES_PROVIDERS = [{
  provide: NASA_IMAGES_DATA_LIST_TOKEN,
  useExisting: _nasa_images_api_service__WEBPACK_IMPORTED_MODULE_1__.NasaImagesApiService
}];

/***/ }),

/***/ 8235:
/*!***********************************************!*\
  !*** ./libs/shared/util/objects/src/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   allAreFalsy: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.allAreFalsy),
/* harmony export */   areObjectEntriesEqual: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.areObjectEntriesEqual),
/* harmony export */   collectionToArray: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.collectionToArray),
/* harmony export */   formatURLQueryParams: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.formatURLQueryParams),
/* harmony export */   getQueryParams: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.getQueryParams),
/* harmony export */   isEmpty: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.isEmpty),
/* harmony export */   isNil: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.isNil),
/* harmony export */   isObject: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.isObject),
/* harmony export */   isString: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.isString),
/* harmony export */   removeNullProperties: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.removeNullProperties),
/* harmony export */   setEmptyStringPropertiesToNull: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.setEmptyStringPropertiesToNull),
/* harmony export */   transformStringToBooleanProperties: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.transformStringToBooleanProperties),
/* harmony export */   transformToString: () => (/* reexport safe */ _util_objects__WEBPACK_IMPORTED_MODULE_0__.transformToString)
/* harmony export */ });
/* harmony import */ var _util_objects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util-objects */ 8002);


/***/ }),

/***/ 8379:
/*!************************************************!*\
  !*** ./libs/shared/util/latinize/src/index.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   latinize: () => (/* reexport safe */ _latinize__WEBPACK_IMPORTED_MODULE_0__.latinize)
/* harmony export */ });
/* harmony import */ var _latinize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./latinize */ 1339);


/***/ }),

/***/ 8464:
/*!********************************************************!*\
  !*** ./libs/core/util/api/src/lib/data-crud.tokens.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDataGetListServiceToken: () => (/* binding */ createDataGetListServiceToken),
/* harmony export */   createDataReadServiceToken: () => (/* binding */ createDataReadServiceToken),
/* harmony export */   createDataServiceToken: () => (/* binding */ createDataServiceToken),
/* harmony export */   createDataWriteServiceToken: () => (/* binding */ createDataWriteServiceToken)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);

/**
 * @template TList, P
 * @description Creates an injection token for a data list service.
 * @param { string } description The description of the token.
 * @returns { InjectionToken<DataGetListService<TList, P>> } The created injection token.
 */
function createDataGetListServiceToken(description = 'DATA_GET_LIST_SERVICE') {
  return new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken(description);
}
/**
 * @template T, TList, P, ID, ReadOptions, WriteOptions, Create, Update
 * @description Creates an injection token for a data crud service.
 * @param { string } description The description of the token.
 * @returns { InjectionToken<DataApiService<T, TList, P, ID, ReadOptions, WriteOptions, Create, Update>> } The created injection token.
 */
function createDataServiceToken(description = 'DATA_CRUD_SERVICE') {
  return new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken(description);
}
/**
 * @template T, TList, P, ID, ReadOptions
 * @description Creates an injection token for a data read service.
 * @param { string } description The description of the token.
 * @returns { InjectionToken<DataReadService<T, TList, P, ID, ReadOptions>> } The created injection token.
 */
function createDataReadServiceToken(description = 'DATA_READ_SERVICE') {
  return new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken(description);
}
/**
 * @template T, ID, WriteOptions, Create, Update
 * @description Creates an injection token for a data write service.
 * @param { string } description The description of the token.
 * @returns { InjectionToken<DataWriteService<T, ID, WriteOptions, Create, Update>> } The created injection token.
 */
function createDataWriteServiceToken(description = 'DATA_WRITE_SERVICE') {
  return new _angular_core__WEBPACK_IMPORTED_MODULE_0__.InjectionToken(description);
}

/***/ }),

/***/ 8474:
/*!***************************************************************************!*\
  !*** ./libs/shared/activity/data-access/src/lib/+state/activity.store.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activityStore: () => (/* binding */ activityStore)
/* harmony export */ });
/* harmony import */ var _angular_architects_ngrx_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular-architects/ngrx-toolkit */ 1063);
/* harmony import */ var _ngrx_signals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/signals */ 3425);


const activityStore = (0,_ngrx_signals__WEBPACK_IMPORTED_MODULE_1__.signalStore)({
  providedIn: 'root'
}, (0,_angular_architects_ngrx_toolkit__WEBPACK_IMPORTED_MODULE_0__.withDevtools)('activity'), (0,_ngrx_signals__WEBPACK_IMPORTED_MODULE_1__.withState)({
  isActive: false
}), (0,_ngrx_signals__WEBPACK_IMPORTED_MODULE_1__.withMethods)(store => ({
  setActivity(isActive) {
    (0,_angular_architects_ngrx_toolkit__WEBPACK_IMPORTED_MODULE_0__.updateState)(store, `[activity] ${isActive ? 'on' : 'off'}`, {
      isActive
    });
  }
})));

/***/ }),

/***/ 8536:
/*!************************************************************************************!*\
  !*** ./libs/core/router/data-access/src/lib/services/navigation-filter.service.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NavigationFilterService: () => (/* binding */ NavigationFilterService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 4362);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 560);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 5687);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 6663);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngrx/effects */ 9497);
/* harmony import */ var _ngrx_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngrx/operators */ 4821);
/* harmony import */ var _ngrx_router_store__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @ngrx/router-store */ 4589);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngrx/store */ 9797);
/* harmony import */ var _state_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../+state/selectors/router-state.selectors */ 9708);









class NavigationFilterService {
  store = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(_ngrx_store__WEBPACK_IMPORTED_MODULE_8__.Store);
  /**
   * @description Checks if the selected view matches the route on ROUTER_NAVIGATION.
   * @param {string} view The current view/route name.
   * @returns {UnaryFunction<Observable<Action>, Observable<[RouterNavigationAction<SerializedRouterStateSnapshot>, unknown]>>}.
   */
  checkRouterNavigation(view) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_0__.pipe)((0,_ngrx_effects__WEBPACK_IMPORTED_MODULE_5__.ofType)(_ngrx_router_store__WEBPACK_IMPORTED_MODULE_7__.ROUTER_NAVIGATION), (0,_ngrx_operators__WEBPACK_IMPORTED_MODULE_6__.concatLatestFrom)(() => this.store.select(_state_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_9__.selectRouteDataName)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.filter)(([, name]) => name === view), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.map)(() => rxjs__WEBPACK_IMPORTED_MODULE_1__.EMPTY));
  }
  static ɵfac = function NavigationFilterService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NavigationFilterService)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
    token: NavigationFilterService,
    factory: NavigationFilterService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 8572:
/*!*************************************************************!*\
  !*** ./libs/core/util/environments/src/environment.mock.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   provideEnvironmentMock: () => (/* binding */ provideEnvironmentMock)
/* harmony export */ });
/* harmony import */ var _environment_token__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./environment.token */ 2569);

/**
 * @description A environment service mock function to add to providers TestBed array.
 * @returns { Provider } The Provider ready to be added to providers array in modules or standalone components.
 */
function provideEnvironmentMock() {
  return {
    provide: _environment_token__WEBPACK_IMPORTED_MODULE_0__.ENVIRONMENT,
    useValue: {
      production: false,
      name: 'my-app',
      baseApiUrl: 'https://api'
    }
  };
}

/***/ }),

/***/ 9086:
/*!****************************************************************************************!*\
  !*** ./libs/core/cms-layout/data-access/src/lib/core-cms-layout-data-access.module.ts ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CoreCmsLayoutDataAccessModule: () => (/* binding */ CoreCmsLayoutDataAccessModule)
/* harmony export */ });
/* harmony import */ var _ngrx_effects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/effects */ 9497);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ 9797);
/* harmony import */ var _state_layout_effects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./+state/layout.effects */ 5443);
/* harmony import */ var _state_layout_feature__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./+state/layout.feature */ 5947);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 3499);







class CoreCmsLayoutDataAccessModule {
  static ɵfac = function CoreCmsLayoutDataAccessModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || CoreCmsLayoutDataAccessModule)();
  };
  static ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({
    type: CoreCmsLayoutDataAccessModule
  });
  static ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjector"]({
    imports: [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.StoreModule.forFeature(_state_layout_feature__WEBPACK_IMPORTED_MODULE_3__.selectLayoutFeature), _ngrx_effects__WEBPACK_IMPORTED_MODULE_0__.EffectsModule.forFeature([_state_layout_effects__WEBPACK_IMPORTED_MODULE_2__.LayoutEffects])]
  });
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](CoreCmsLayoutDataAccessModule, {
    imports: [_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.StoreFeatureModule, _ngrx_effects__WEBPACK_IMPORTED_MODULE_0__.EffectsFeatureModule]
  });
})();

/***/ }),

/***/ 9195:
/*!**********************************************************************************************!*\
  !*** ./libs/shared/notification/data-access/src/lib/services/notification-config.service.ts ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NotificationConfigService: () => (/* binding */ NotificationConfigService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _plastik_shared_notification_entities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @plastik/shared/notification/entities */ 906);



class NotificationConfigService {
  #notification = null;
  #notificationTypesConfig = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_plastik_shared_notification_entities__WEBPACK_IMPORTED_MODULE_1__.NOTIFICATION_TYPES_CONFIG);
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
  getInstance({
    type = 'ERROR',
    message = '',
    ...extras
  } = {}) {
    this.removeInstance();
    this.#notification = {
      ...this.#notificationTypesConfig[type],
      ...extras,
      type,
      message
    };
    return this.#notification;
  }
  static ɵfac = function NotificationConfigService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || NotificationConfigService)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: NotificationConfigService,
    factory: NotificationConfigService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 9276:
/*!*********************************************************!*\
  !*** ./libs/core/util/api/src/lib/base-data.service.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseDataService: () => (/* binding */ BaseDataService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ 1693);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _plastik_core_environments__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @plastik/core/environments */ 2071);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 5463);





class BaseDataService {
  environment = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_plastik_core_environments__WEBPACK_IMPORTED_MODULE_2__.ENVIRONMENT);
  /**
   * Cache time by default (1 day). Children can override it.
   */
  cacheTime = 1000 * 60 * 60 * 24;
  /**
   * @description Generic error handler for HTTP and custom backends.
   * @param { unknown } error The error object.
   * @returns { Observable<never> } An observable that throws the formatted error.
   */
  handleError = error => {
    let message = 'An error occurred';
    let code = 500;
    let data = null;
    if (error instanceof _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpErrorResponse) {
      message = (error.error?.message ?? error.message) || message;
      code = error.status ?? code;
      data = error.error ?? null;
    } else if (typeof error === 'object' && error !== null) {
      const maybe = error;
      const dataMessage = maybe.data?.message;
      message = (typeof dataMessage === 'string' ? dataMessage : typeof maybe.message === 'string' ? maybe.message : undefined) ?? message;
      code = typeof maybe.status === 'number' ? maybe.status : code;
      data = 'data' in maybe ? maybe.data : data;
    }
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.throwError)(() => ({
      message,
      code,
      data,
      originalError: error
    }));
  };
  static ɵfac = function BaseDataService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || BaseDataService)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
    token: BaseDataService,
    factory: BaseDataService.ɵfac
  });
}

/***/ }),

/***/ 9286:
/*!***********************************************************************************!*\
  !*** ./libs/nasa-images/search/data-access/src/lib/+state/nasa-images.feature.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initialNasaImagesState: () => (/* binding */ initialNasaImagesState),
/* harmony export */   name: () => (/* binding */ name),
/* harmony export */   nasaMediaAdapter: () => (/* binding */ nasaMediaAdapter),
/* harmony export */   reducer: () => (/* binding */ reducer),
/* harmony export */   selectNasaImagesFeature: () => (/* binding */ selectNasaImagesFeature)
/* harmony export */ });
/* harmony import */ var _ngrx_entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/entity */ 1101);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ 9797);
/* harmony import */ var _nasa_images_actions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./nasa-images.actions */ 183);



const NASA_IMAGES_FEATURE_KEY = 'images';
const nasaMediaAdapter = (0,_ngrx_entity__WEBPACK_IMPORTED_MODULE_0__.createEntityAdapter)();
const initialNasaImagesState = nasaMediaAdapter.getInitialState({
  count: 0,
  isActiveSearch: false,
  error: null,
  selectedId: null
});
const nasaImagesReducer = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createReducer)(initialNasaImagesState, (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.on)(_nasa_images_actions__WEBPACK_IMPORTED_MODULE_2__.nasaImagesPageActions.load, state => ({
  ...state,
  error: null,
  isActiveSearch: false
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.on)(_nasa_images_actions__WEBPACK_IMPORTED_MODULE_2__.nasaImagesAPIActions.loadSuccess, (state, {
  items,
  count
}) => nasaMediaAdapter.setAll(items, {
  ...state,
  count,
  isActiveSearch: true
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.on)(_nasa_images_actions__WEBPACK_IMPORTED_MODULE_2__.nasaImagesAPIActions.loadFailure, (state, {
  error
}) => ({
  ...state,
  error,
  isActiveSearch: false
})), (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.on)(_nasa_images_actions__WEBPACK_IMPORTED_MODULE_2__.nasaImagesPageActions.cleanUp, state => nasaMediaAdapter.removeAll({
  ...state,
  count: 0,
  error: null,
  isActiveSearch: false
})));
const selectNasaImagesFeature = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createFeature)({
  name: NASA_IMAGES_FEATURE_KEY,
  reducer: nasaImagesReducer,
  extraSelectors: ({
    selectImagesState,
    selectEntities,
    selectSelectedId
  }) => {
    return {
      ...nasaMediaAdapter.getSelectors(selectImagesState),
      selectSelectedEntity: (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.createSelector)(selectEntities, selectSelectedId, (entities, id) => entities && id ? entities[id] : null)
    };
  }
});
const {
  name,
  reducer
} = selectNasaImagesFeature;

/***/ }),

/***/ 9502:
/*!********************************************************!*\
  !*** ./libs/core/util/environments/src/environment.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);


/***/ }),

/***/ 9567:
/*!**************************************************************************!*\
  !*** ./libs/core/cms-layout/data-access/src/lib/+state/layout.facade.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LayoutFacade: () => (/* binding */ LayoutFacade)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ 9797);
/* harmony import */ var _plastik_core_cms_layout_entities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @plastik/core/cms-layout/entities */ 3512);
/* harmony import */ var _plastik_shared_activity_data_access__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @plastik/shared/activity/data-access */ 6711);
/* harmony import */ var _core_cms_view_config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../core-cms-view-config */ 5628);
/* harmony import */ var _layout_actions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./layout.actions */ 4502);
/* harmony import */ var _layout_feature__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./layout.feature */ 5947);








class LayoutFacade {
  #store = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.Store);
  sidenavConfig = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_core_cms_view_config__WEBPACK_IMPORTED_MODULE_4__.VIEW_CONFIG);
  sidenavOpened$ = this.#store.select(_layout_feature__WEBPACK_IMPORTED_MODULE_6__.selectSidenavOpened);
  isMobile$ = this.#store.select(_layout_feature__WEBPACK_IMPORTED_MODULE_6__.selectIsMobile);
  isActive = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_plastik_shared_activity_data_access__WEBPACK_IMPORTED_MODULE_3__.activityStore).isActive;
  headerConfig = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_plastik_core_cms_layout_entities__WEBPACK_IMPORTED_MODULE_2__.CORE_CMS_LAYOUT_HEADER_CONFIG);
  toggleSidenav(opened) {
    this.#store.dispatch(_layout_actions__WEBPACK_IMPORTED_MODULE_5__.layoutActions.toggleSidenav({
      opened
    }));
  }
  setIsMobile(isMobile) {
    this.#store.dispatch(_layout_actions__WEBPACK_IMPORTED_MODULE_5__.layoutActions.setIsMobile({
      isMobile
    }));
  }
  dispatchAction(action) {
    this.#store.dispatch(action());
  }
  static ɵfac = function LayoutFacade_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || LayoutFacade)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: LayoutFacade,
    factory: LayoutFacade.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 9644:
/*!***************************************************!*\
  !*** ./libs/core/util/api/src/lib/api.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ApiService: () => (/* binding */ ApiService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 8530);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 4932);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 494);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 6663);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 7750);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ 1693);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _base_data_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./base-data.service */ 9276);





/**
 * @description Abstract class to inherit from on creating a feature api service.
 * @template T, P, E
 *
 * **T** refers to the main feature model item used inside applications.
 *
 * **P** refers to the type description of the passed parameters to API call methods.
 * These parameters are the usual option to pass configuration with the REST call, for example for filtering results, paginate or ordering data.
 *
 * **E** refers to the environment type extension with the API URL property.
 */
class ApiService extends _base_data_service__WEBPACK_IMPORTED_MODULE_7__.BaseDataService {
  #httpClient = (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.inject)(_angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpClient);
  #apiUrl;
  constructor() {
    super();
    this.#apiUrl = `${this.getApiUrlFromEnvironment()}/${this.resourceUrlSegment()}`;
  }
  /**
   * @description Gets the API URL from the environment. Override if your environment uses a different property name.
   * @returns {string} The base API URL.
   */
  getApiUrlFromEnvironment() {
    return this.environment.baseApiUrl;
  }
  /**
   * @description Method to map the API response with the inner typings before storing it in app.
   * @template T
   * Override this method in child classes when inheriting from ApiService with your custom API response structures.
   * @param { unknown } data The API response data as it is.
   * @returns { T } The mapped API response.
   */
  mapListResponse(data) {
    return data;
  }
  /**
   * @description A GET method to retrieve a list of data.
   * @template T, P
   * @param { P } params  The http params to pass with the API call.
   * @returns { Observable<P | never> } The API data response after mapping or an error catch.
   */
  getList(params) {
    return this.#httpClient.get(this.#apiUrl, {
      params: this.getHttpParams(params)
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(this.mapListResponse), (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.share)({
      connector: () => new rxjs__WEBPACK_IMPORTED_MODULE_0__.ReplaySubject(1),
      resetOnComplete: () => (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.timer)(this.cacheTime)
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.catchError)(this.handleError));
  }
  getHttpParams(params) {
    let httpClientParams = new _angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpParams();
    Object.entries(params || {}).forEach(([key, value]) => {
      httpClientParams = httpClientParams.set(key, `${value}`);
    });
    return httpClientParams;
  }
  mapItemResponse(data) {
    return data;
  }
  getOne(id, options) {
    void options;
    return this.#httpClient.get(`${this.#apiUrl}/${id}`).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(response => this.mapItemResponse(response)), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.catchError)(this.handleError));
  }
  create(data, options) {
    void options;
    return this.#httpClient.post(this.#apiUrl, data).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(response => this.mapItemResponse(response)), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.catchError)(this.handleError));
  }
  update(id, data, options) {
    void options;
    return this.#httpClient.patch(`${this.#apiUrl}/${id}`, data).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(response => this.mapItemResponse(response)), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.catchError)(this.handleError));
  }
  delete(id) {
    return this.#httpClient.delete(`${this.#apiUrl}/${id}`).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_3__.map)(() => true), (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.catchError)(this.handleError));
  }
  static ɵfac = function ApiService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || ApiService)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjectable"]({
    token: ApiService,
    factory: ApiService.ɵfac
  });
}

/***/ }),

/***/ 9708:
/*!*****************************************************************************************!*\
  !*** ./libs/core/router/data-access/src/lib/+state/selectors/router-state.selectors.ts ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   selectRouteData: () => (/* binding */ selectRouteData),
/* harmony export */   selectRouteDataName: () => (/* binding */ selectRouteDataName),
/* harmony export */   selectRouteFeatureState: () => (/* binding */ selectRouteFeatureState),
/* harmony export */   selectRouteParams: () => (/* binding */ selectRouteParams),
/* harmony export */   selectRouteQueryParams: () => (/* binding */ selectRouteQueryParams),
/* harmony export */   selectRouteUrl: () => (/* binding */ selectRouteUrl)
/* harmony export */ });
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngrx/store */ 9797);
/* harmony import */ var _router_state__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../router-state */ 3256);


const selectRouteFeatureState = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createFeatureSelector)(_router_state__WEBPACK_IMPORTED_MODULE_1__.routerKey);
const selectRouteQueryParams = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectRouteFeatureState, state => state?.state?.queryParams);
const selectRouteUrl = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectRouteFeatureState, state => state?.state?.url);
const selectRouteParams = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectRouteFeatureState, state => state?.state?.params);
const selectRouteData = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectRouteFeatureState, state => state?.state?.data);
const selectRouteDataName = (0,_ngrx_store__WEBPACK_IMPORTED_MODULE_0__.createSelector)(selectRouteData, data => data?.['name']);

/***/ }),

/***/ 9810:
/*!***************************************************!*\
  !*** ./libs/nasa-images/data-access/src/index.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NasaImagesFacade: () => (/* reexport safe */ _nasa_images_facade__WEBPACK_IMPORTED_MODULE_0__.NasaImagesFacade)
/* harmony export */ });
/* harmony import */ var _nasa_images_facade__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nasa-images.facade */ 3670);


/***/ }),

/***/ 9939:
/*!********************************************************************************!*\
  !*** ./libs/nasa-images/search/data-access/src/lib/nasa-images-api.service.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NasaImagesApiService: () => (/* binding */ NasaImagesApiService)
/* harmony export */ });
/* harmony import */ var _plastik_core_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @plastik/core/api */ 2905);
/* harmony import */ var _plastik_shared_latinize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @plastik/shared/latinize */ 8379);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 3499);



class NasaImagesApiService extends _plastik_core_api__WEBPACK_IMPORTED_MODULE_0__.ApiService {
  resourceUrlSegment() {
    return 'search';
  }
  mapListResponse({
    collection: {
      metadata: {
        total_hits: count
      },
      items
    }
  }) {
    const mappedItems = items.map(({
      data,
      links
    }) => {
      const {
        nasa_id: id,
        title: name,
        date_created,
        description,
        keywords,
        center,
        location,
        secondary_creator: creator
      } = data[0];
      return {
        id,
        name,
        normalizedName: (0,_plastik_shared_latinize__WEBPACK_IMPORTED_MODULE_1__.latinize)(name).toLowerCase(),
        description,
        keywords,
        dateCreated: new Date(date_created),
        thumbnail: links[0].href,
        center,
        location,
        creator
      };
    });
    return {
      count,
      items: mappedItems
    };
  }
  static ɵfac = /*@__PURE__*/(() => {
    let ɵNasaImagesApiService_BaseFactory;
    return function NasaImagesApiService_Factory(__ngFactoryType__) {
      return (ɵNasaImagesApiService_BaseFactory || (ɵNasaImagesApiService_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetInheritedFactory"](NasaImagesApiService)))(__ngFactoryType__ || NasaImagesApiService);
    };
  })();
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
    token: NasaImagesApiService,
    factory: NasaImagesApiService.ɵfac,
    providedIn: 'root'
  });
}

/***/ }),

/***/ 9955:
/*!**********************************************************************!*\
  !*** ./libs/core/router/data-access/src/lib/+state/router.facade.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RouterFacade: () => (/* binding */ RouterFacade)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 4131);
/* harmony import */ var _ngrx_store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngrx/store */ 9797);
/* harmony import */ var _selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selectors/router-state.selectors */ 9708);




class RouterFacade {
  store = (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.inject)(_ngrx_store__WEBPACK_IMPORTED_MODULE_1__.Store);
  routeName$ = this.store.select(_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_2__.selectRouteDataName);
  routeUrl$ = this.store.select(_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_2__.selectRouteUrl);
  routeQueryParams$ = this.store.select(_selectors_router_state_selectors__WEBPACK_IMPORTED_MODULE_2__.selectRouteQueryParams);
  static ɵfac = function RouterFacade_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || RouterFacade)();
  };
  static ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
    token: RouterFacade,
    factory: RouterFacade.ɵfac,
    providedIn: 'root'
  });
}

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(1455)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.js.map