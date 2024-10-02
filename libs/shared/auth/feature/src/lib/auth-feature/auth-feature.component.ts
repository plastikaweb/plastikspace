import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PushPipe } from '@ngrx/component';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { NotificationFacade } from '@plastik/shared/notification/data-access';
import { NotificationUiMatSnackbarDirective } from '@plastik/shared/notification/ui/mat-snackbar';
import { AUTH_FORM_FACADE } from './auth-form-facade.type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'plastik-auth-feature',
  standalone: true,
  imports: [
    SharedFormFeatureModule,
    MatCardModule,
    NotificationUiMatSnackbarDirective,
    PushPipe,
    DatePipe,
    RouterLink,
  ],
  templateUrl: './auth-feature.component.html',
  styleUrl: './auth-feature.component.scss',
})
export class AuthFeatureComponent {
  protected facade = inject(AUTH_FORM_FACADE);
  protected title = input('title');
  protected name = input('name');
  protected nameLink = input('nameLink');
  protected logo = input('logo');
  protected label = input('label');
  protected buttonStyle = input('buttonStyle');
  protected notificationFacade = inject(NotificationFacade);
  protected extraLinks = inject(AUTH_FORM_FACADE).extraLinks;
  protected currentDate = new Date();
}
