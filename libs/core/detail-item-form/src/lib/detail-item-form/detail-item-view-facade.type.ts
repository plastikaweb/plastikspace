import { InjectionToken, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BaseEntity, SubmitFormConfig, ViewConfigUI } from '@plastik/core/entities';

export interface DetailItemViewFacade<T extends BaseEntity> {
  formStructure: Signal<FormlyFieldConfig[]>;
  viewConfig: Signal<ViewConfigUI>;
  onSubmit(data: object): void;
  onChange?(data: object): void;
  formSubmitConfig?: Signal<SubmitFormConfig>;
  model?: Signal<T | null>;
  formFullWidth?: Signal<boolean>;
  viewExtraActions?: Signal<ExtraFormAction<T>[]>;
}

export type ExtraFormAction<T> =
  | {
      type: 'button';
      label: string;
      icon: string;
      execute: (element?: T) => void;
      disabled: (element?: T) => boolean;
    }
  | {
      type: 'text';
      text: string;
      icon: string;
      styles?: string;
    };

export const DETAIL_ITEM_VIEW_FACADE = new InjectionToken<DetailItemViewFacade<BaseEntity>>(
  'DETAIL_ITEM_VIEW_FACADE'
);
