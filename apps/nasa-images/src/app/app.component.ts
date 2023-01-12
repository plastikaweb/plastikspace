import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { CoreUiFooterDefaultComponent } from '@plastik/core/footer-default';
import { CoreUiHeaderDefaultComponent } from '@plastik/core/header-default';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  standalone: true,
  selector: 'plastik-root',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    AngularSvgIconModule,
    CoreUiFooterDefaultComponent,
    CoreUiHeaderDefaultComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  opened!: boolean;
  currentDate = new Date();
}
