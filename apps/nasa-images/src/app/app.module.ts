import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SharedHeaderModule } from '@plastikspace/shared/header';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
    FormsModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    AngularSvgIconModule.forRoot(),
    SharedHeaderModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
