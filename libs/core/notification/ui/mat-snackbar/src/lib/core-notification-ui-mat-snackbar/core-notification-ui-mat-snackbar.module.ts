import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  imports: [MatSnackBarModule, AngularSvgIconModule.forRoot()],
})
export class CoreNotificationUiMatSnackbarModule {
  static forRoot(config?: MatSnackBarConfig) {
    return {
      ngModule: CoreNotificationUiMatSnackbarModule,
      providers: [
        {
          provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
          useValue: {
            ...{ duration: 2000, horizontalPosition: 'center', verticalPosition: 'bottom', politeness: 'polite' },
            ...config,
          },
        },
      ],
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: CoreNotificationUiMatSnackbarModule) {
    if (parentModule) {
      throw new Error('CoreNotificationUiMatSnackbarModule is already loaded. Please add it in AppModule only.');
    }
  }
}
