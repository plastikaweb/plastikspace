import { Route } from '@angular/router';
import { EcoStoreAuthFeatureForgotPasswordSentComponent } from './eco-store-auth-feature-forgot-password-sent/eco-store-auth-feature-forgot-password-sent.component';

export const ecoStoreAuthFeatureForgotPasswordSentRoutes: Route[] = [
  {
    path: '',
    component: EcoStoreAuthFeatureForgotPasswordSentComponent,
    title: 'auth.forgotPasswordSent.title',
  },
];
