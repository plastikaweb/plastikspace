import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  imports: [MatSnackBarModule, AngularSvgIconModule.forRoot()],
})
export class CoreNotificationUiMatSnackbarModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreNotificationUiMatSnackbarModule) {
    if (parentModule) {
      throw new Error('CoreNotificationUiMatSnackbarModule is already loaded. Please add it in AppModule only.');
    }
  }
}
