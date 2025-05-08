import { InjectionToken, Signal } from '@angular/core';
import { BaseEntity, FormConfig, ViewConfigUI } from '@plastik/core/entities';

export interface DetailItemViewFacade<T extends BaseEntity> {
  viewConfig: Signal<ViewConfigUI>;
  viewExtraActions?: Signal<ExtraFormAction<T>[]>;
  hideBackBtn?: Signal<boolean>;
  formConfig: FormConfig<T>;
  model?: Signal<T | null>;
  onSubmit(data: Partial<T>): void;
  onFormTemporaryChange?(data: Partial<T>): void;
}

export type ExtraFormButtonAction<T> = {
  id: string;
  label: string;
  icon: string;
  type: 'button';
  execute: (element?: T) => void;
  disabled: (element?: T) => boolean;
};

export type ExtraFormTextAction = {
  id: string;
  type: 'text';
  text: string;
  icon: string;
  styles?: string;
};

export type ExtraFormAction<T> = ExtraFormButtonAction<T> | ExtraFormTextAction;

export const DETAIL_ITEM_VIEW_FACADE = new InjectionToken<DetailItemViewFacade<BaseEntity>>(
  'DETAIL_ITEM_VIEW_FACADE'
);
