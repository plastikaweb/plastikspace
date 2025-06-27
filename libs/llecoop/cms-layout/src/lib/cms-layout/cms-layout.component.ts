import { AngularSvgIconModule } from 'angular-svg-icon';
import { map } from 'rxjs';

import { ConfigurableFocusTrapFactory, FocusTrapFactory } from '@angular/cdk/a11y';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { FirebaseAuthService } from '@plastik/auth/firebase/data-access';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';
import { CoreCmsLayoutUiFooterComponent } from '@plastik/core/cms-layout/footer';
import { CoreCmsLayoutUiHeaderComponent } from '@plastik/core/cms-layout/header';
import { MatThemeToggleComponent } from '@plastik/shared/mat-theme-toggle';
import { SkipLinkComponent } from '@plastik/shared/skip-link';

import { CartPreviewComponent } from '@plastik/llecoop/user-order-cart-preview';
import { llecoopUserOrderCartStore } from '@plastik/llecoop/user-order-cart/data-access';
import { HeaderConfigService } from './cms-header-config';

@Component({
  selector: 'plastik-cms-layout',
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AngularSvgIconModule,
    CoreCmsLayoutUiHeaderComponent,
    CoreCmsLayoutUiFooterComponent,
    DatePipe,
    SkipLinkComponent,
    MatThemeToggleComponent,
    CartPreviewComponent,
  ],
  providers: [
    { provide: FocusTrapFactory, useClass: ConfigurableFocusTrapFactory },
    {
      provide: CORE_CMS_LAYOUT_HEADER_CONFIG,
      useFactory: HeaderConfigService,
    },
  ],
  templateUrl: './cms-layout.component.html',
  styleUrl: './cms-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CmsLayoutComponent {
  protected readonly firebaseAuthService = inject(FirebaseAuthService);
  protected readonly headerConfig = inject(CORE_CMS_LAYOUT_HEADER_CONFIG);
  protected readonly viewConfig = inject(VIEW_CONFIG);
  protected readonly currentDate = new Date();
  protected readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map(handset => handset.matches))
  );
  protected readonly userOrderCartStore = inject(llecoopUserOrderCartStore);
}
