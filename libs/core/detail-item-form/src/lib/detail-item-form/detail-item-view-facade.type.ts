import { InjectionToken, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BaseEntity, ViewConfigUI } from '@plastik/core/entities';

export interface DetailItemViewFacade<T extends BaseEntity> {
  formStructure: Signal<FormlyFieldConfig[]>;
  viewConfig: Signal<ViewConfigUI>;
  model?: Signal<T | null>;
  onSubmit(data: object): void;
}

export const DETAIL_ITEM_VIEW_FACADE = new InjectionToken<DetailItemViewFacade<BaseEntity>>(
  'DETAIL_ITEM_VIEW_FACADE'
);
