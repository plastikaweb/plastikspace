import { InjectionToken, Signal } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ViewConfig } from '@plastik/core/entities';

export interface DetailItemViewFacade {
  formStructure?: Signal<FormlyFieldConfig[]>;
  viewConfig: Signal<ViewConfig<string>>;
  onSubmit?(data: object): void;
}

export const DETAIL_ITEM_VIEW_FACADE = new InjectionToken<DetailItemViewFacade>(
  'DETAIL_ITEM_VIEW_FACADE'
);
