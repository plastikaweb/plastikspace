import { Routes } from '@angular/router';
import { isLoggedGuard, isNotLoggedGuard } from '@plastik/auth/firebase/data-access';

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

// const redirectLoggedInAndVerifiedToHome = () => map((user: User) => {
//   return !user.uid || !user.emailVerified ? ['login'] : ['']
// });
// const redirectLoggedOutOrNoVerifiedToLogin = () => map((user: User) => {
//   console.log('user', user);
//   return user?.uid && user?.emailVerified ? [''] : ['login']
// });

export const appRoutes: Routes = [
  {
    path: 'login',
    title: 'Entrar a El Llevat',
    data: {
      title: 'Entrar a la botiga',
      logo: 'assets/img/favicon-64x64.png',
      name: 'El Llevat',
      nameLink: 'https://www.llevat.org',
    },
    canActivate: [isNotLoggedGuard],
    loadChildren: () => import('@plastik/auth/login').then(routes => routes.authLoginFeatureRoutes),
  },
  {
    path: 'registre',
    title: 'Registre de socis de El Llevat',
    data: {
      title: 'Registre de socis',
      logo: 'assets/img/favicon-64x64.png',
      label: 'Registrar-se',
      buttonStyle: 'w-full',
      name: 'El Llevat',
      nameLink: 'https://www.llevat.org',
    },
    canActivate: [isNotLoggedGuard],
    loadChildren: () =>
      import('@plastik/auth/register').then(routes => routes.authRegisterFeatureRoutes),
  },
  {
    path: 'peticio-clau',
    title: 'Petició de clau nova',
    data: {
      title: 'Petició de clau nova',
      logo: 'assets/img/favicon-64x64.png',
      label: 'Enviar petició',
      buttonStyle: 'w-full',
      name: 'El Llevat',
      nameLink: 'https://www.llevat.org',
    },
    canActivate: [isNotLoggedGuard],
    loadChildren: () =>
      import('@plastik/auth/request-password').then(routes => routes.authRequestPasswordRoutes),
  },
  {
    path: '',
    // canActivate: [isLoggedGuard],
    loadChildren: () =>
      import('@plastik/llecoop/cms-layout').then(routes => routes.llecoopLayoutRoutes),
  },
];
