import { Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { AUTH_FORM_FACADE } from './auth-form-facade.type';

@Component({
  selector: 'plastik-auth-feature',
  standalone: true,
  imports: [SharedFormFeatureModule, MatCardModule],
  templateUrl: './auth-feature.component.html',
  styleUrl: './auth-feature.component.scss',
})
export class AuthFeatureComponent {
  protected facade = inject(AUTH_FORM_FACADE);
  protected title = input('title');
  protected logo = input('logo');
  protected label = input('label');
  protected buttonStyle = input('buttonStyle');
}
