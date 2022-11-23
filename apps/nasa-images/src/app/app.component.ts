import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedUiFooterModule } from '@plastikspace/shared-footer';
import { SharedUiHeaderModule } from '@plastikspace/shared-header';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  standalone: true,
  selector: 'plastikspace-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    AngularSvgIconModule,
    SharedUiHeaderModule,
    SharedUiFooterModule,
  ],
})
export class AppComponent {
  opened!: boolean;
  currentDate = new Date();
}
