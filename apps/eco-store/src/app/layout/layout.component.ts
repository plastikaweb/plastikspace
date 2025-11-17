import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSidenavContainer, MatSidenavContent } from '@angular/material/sidenav';
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
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  protected readonly searchFormConfig = appSearchFormConfig();

  protected onSearchSubmit(event: { query: string }): void {
    // eslint-disable-next-line no-console
    console.log(event);
  }
}
