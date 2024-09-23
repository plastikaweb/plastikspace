import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
  imports: [MatSnackBarModule, AngularSvgIconModule.forRoot()],
})
export class NotificationUiMatSnackbarModule {
  constructor(@Optional() @SkipSelf() parentModule: NotificationUiMatSnackbarModule) {
    if (parentModule) {
      throw new Error(
        'NotificationUiMatSnackbarModule is already loaded. Please add it in AppModule only.'
      );
    }
  }
}
