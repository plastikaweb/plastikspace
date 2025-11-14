import {
  Pipe,
  setClassMetadata,
  ɵɵdefinePipe
} from "./chunk-6A74M7E5.js";

// libs/shared/table/ui/src/lib/utils/order-table-actions-elements.pipe.ts
var OrderTableActionsElementsPipe = class _OrderTableActionsElementsPipe {
  transform(list) {
    if (!list) {
      throw new Error("An Array List is required to use OrderArrayElementsPipe");
    }
    return list.sort((a, b) => (a.value.order || 0) - (b.value.order || 0));
  }
  static \u0275fac = function OrderTableActionsElementsPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OrderTableActionsElementsPipe)();
  };
  static \u0275pipe = /* @__PURE__ */ \u0275\u0275definePipe({ name: "orderTableActionsElements", type: _OrderTableActionsElementsPipe, pure: true });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OrderTableActionsElementsPipe, [{
    type: Pipe,
    args: [{
      name: "orderTableActionsElements"
    }]
  }], null, null);
})();
export {
  OrderTableActionsElementsPipe
};
//# sourceMappingURL=order-table-actions-elements.pipe-ZLQ2EU5T.js.map
