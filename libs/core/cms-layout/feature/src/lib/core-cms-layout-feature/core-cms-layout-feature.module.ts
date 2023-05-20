import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import {
  CORE_CMS_LAYOUT_HEADER_CONFIG,
  CoreCmsLayoutDataAccessModule,
  CoreCmsLayoutHeaderConfig,
  VIEW_CONFIG,
} from '@plastik/core/cms-layout/data-access';
import { ViewsConfigRecord, getVisibleNavigationList } from '@plastik/core/entities';
import { CoreNotificationDataAccessModule } from '@plastik/core/notification/data-access';
import { CoreNotificationUiMatSnackbarModule } from '@plastik/core/notification/ui/mat-snackbar';

@NgModule({
  imports: [
    CoreCmsLayoutDataAccessModule,
    CoreNotificationDataAccessModule,
    CoreNotificationUiMatSnackbarModule.forRoot({ horizontalPosition: 'right', verticalPosition: 'top' }),
  ],
})
export class CoreCmsLayoutFeatureModule {
  static withConfig<T extends string>(
    headerConfig: CoreCmsLayoutHeaderConfig,
    sidenavConfig: ViewsConfigRecord<T>,
  ): ModuleWithProviders<CoreCmsLayoutFeatureModule> {
    return {
      ngModule: CoreCmsLayoutFeatureModule,
      providers: [
        { provide: CORE_CMS_LAYOUT_HEADER_CONFIG, useValue: headerConfig },
        { provide: VIEW_CONFIG, useValue: getVisibleNavigationList<T>(sidenavConfig) },
      ],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreCmsLayoutFeatureModule) {
    if (parentModule) {
      throw new Error('CoreCmsLayoutFeatureModule is already loaded. Please add it in main.ts only.');
    }
  }
}
