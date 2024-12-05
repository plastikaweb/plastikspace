import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { PasswordWithVisibilityFormlyModule } from '@plastik/shared/form/password';
import { AUTH_FORM_FACADE } from './auth-form-facade.type';

@Component({
  selector: 'plastik-auth-feature',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    PasswordWithVisibilityFormlyModule,
    SharedFormFeatureModule,
  ],
  templateUrl: './auth-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFeatureComponent {
  protected facade = inject(AUTH_FORM_FACADE);
  protected title = input('title');
  protected name = input('name');
  protected nameLink = input('nameLink');
  protected logo = input('logo');
  protected currentDate = new Date();
}
