import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { AUTH_FORM_FACADE } from './auth-form-facade.type';

@Component({
  selector: 'plastik-auth-feature',
  standalone: true,
  imports: [SharedFormFeatureModule, MatCardModule, DatePipe, RouterLink],
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
