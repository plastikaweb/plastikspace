import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

// Importem directament els fitxers JSON per saltar-nos les peticions HTTP en SSR.
// Això evita errors de resolució de rutes relatives dins de Cloudflare Workers.
import caLang from '../../public/i18n/ca.json';
import enLang from '../../public/i18n/en.json';
import esLang from '../../public/i18n/es.json';

export class ServerTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    if (lang === 'es') {
      return of(esLang);
    }
    if (lang === 'en') {
      return of(enLang);
    }
    return of(caLang);
  }
}

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: TranslateLoader,
      useClass: ServerTranslateLoader, // Sobreescriu l'HttpLoader del client
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
