import { inject, LOCALE_ID, NgModule } from '@angular/core';
import { FORMLY_CONFIG, FormlyModule } from '@ngx-formly/core';

import { InputPasswordWithVisibilityTypeComponent } from './input-password-with-visibility-type.component';
import { passwordMatchValidator } from './validators/password-match.validator';
import { passwordValidator } from './validators/password.validator';

@NgModule({
  imports: [
    FormlyModule.forChild({
      types: [
        {
          name: 'password-with-visibility',
          extends: 'input',
          component: InputPasswordWithVisibilityTypeComponent,
        },
      ],
      validators: [
        { name: 'password', validation: passwordValidator },
        { name: 'passwordMatch', validation: passwordMatchValidator },
      ],
    }),
  ],
  providers: [
    {
      provide: FORMLY_CONFIG,
      useFactory: () => {
        const locale = inject(LOCALE_ID);

        return {
          validationMessages: [
            {
              name: 'password',
              message() {
                switch (locale) {
                  case 'ca-ES':
                    return `contrasenya no vàlida dddd`;
                  case 'es-ES':
                    return `contraseña no válida`;
                  default:
                    return `invalid password`;
                }
              },
            },
            {
              name: 'passwordMatch',
              message() {
                switch (locale) {
                  case 'ca-ES':
                    return `Les contrasenyes no coincideixen`;
                  case 'es-ES':
                    return `Las contraseñas no coinciden`;
                  default:
                    return `Passwords do not match`;
                }
              },
            },
          ],
        };
      },
      multi: true,
    },
  ],
})
export class PasswordWithVisibilityFormlyModule {}
