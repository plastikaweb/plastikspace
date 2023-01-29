import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import {
  CoreCmsLayoutDataAccessModule,
  CoreCmsLayoutHeaderConfig,
  CORE_CMS_LAYOUT_HEADER_CONFIG,
  CORE_CMS_LAYOUT_SIDENAV_CONFIG,
} from '@plastik/core/cms-layout/data-access';
import { getVisibleNavigationList, ViewsConfigRecord } from '@plastik/core/entities';

@NgModule({
  imports: [CoreCmsLayoutDataAccessModule],
})
export class CoreCmsLayoutFeatureModule {
  static withConfig<T>(
    headerConfig: CoreCmsLayoutHeaderConfig,
    sidenavConfig: ViewsConfigRecord<T>,
  ): ModuleWithProviders<CoreCmsLayoutFeatureModule> {
    return {
      ngModule: CoreCmsLayoutFeatureModule,
      providers: [
        { provide: CORE_CMS_LAYOUT_HEADER_CONFIG, useValue: headerConfig },
        { provide: CORE_CMS_LAYOUT_SIDENAV_CONFIG, useValue: getVisibleNavigationList<T>(sidenavConfig) },
      ],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreCmsLayoutFeatureModule) {
    if (parentModule) {
      throw new Error('CoreCmsLayoutFeatureModule is already loaded. Please add it in main.ts only.');
    }
  }
}
