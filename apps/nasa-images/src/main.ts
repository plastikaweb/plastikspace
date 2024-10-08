/// <reference types="@angular/localize" />

import { appConfig } from './app/app.config';

import { bootstrapApplication } from '@angular/platform-browser';

import { enableProdMode } from '@angular/core';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// eslint-disable-next-line no-console
bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));
