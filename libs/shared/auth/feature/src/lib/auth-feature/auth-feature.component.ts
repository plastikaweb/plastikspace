import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { selectIsActive } from '@plastik/shared/activity/data-access';
import { SharedActivityUiOverlayComponent } from '@plastik/shared/activity/ui';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { NotificationFacade } from '@plastik/shared/notification/data-access';
import { NotificationUiMatSnackbarDirective } from '@plastik/shared/notification/ui/mat-snackbar';
import { AUTH_FORM_FACADE } from './auth-form-facade.type';

@Component({
  selector: 'plastik-auth-feature',
  standalone: true,
  imports: [
    SharedFormFeatureModule,
    MatCardModule,
    NotificationUiMatSnackbarDirective,
    SharedActivityUiOverlayComponent,
    PushPipe,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './auth-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFeatureComponent {
  private readonly store = inject(Store);

  protected facade = inject(AUTH_FORM_FACADE);
  protected notificationFacade = inject(NotificationFacade);
  protected title = input('title');
  protected name = input('name');
  protected nameLink = input('nameLink');
  protected logo = input('logo');
  protected currentDate = new Date();
  protected isActive$ = this.store.select(selectIsActive);
}
