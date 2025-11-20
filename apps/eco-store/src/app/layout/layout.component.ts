import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatSidenav, MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { appSearchFormConfig } from '@plastik/eco-store/formly';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'eco-layout',
  imports: [
    NgTemplateOutlet,
    RouterModule,
    MatSidenavContainer,
    MatSidenavContent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    MatSidenav,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent {
  protected readonly searchFormConfig = appSearchFormConfig();
  protected readonly isSidenavOpen = signal(false);

  protected onSearchSubmit(event: { query: string }): void {
    // eslint-disable-next-line no-console
    console.log(event);
  }

  protected onSidenavActivate(): void {
    this.isSidenavOpen.set(true);
  }

  protected onSidenavDeactivate(): void {
    this.isSidenavOpen.set(false);
  }
}
