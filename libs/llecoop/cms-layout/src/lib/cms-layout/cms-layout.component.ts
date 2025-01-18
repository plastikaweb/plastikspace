import { AngularSvgIconModule } from 'angular-svg-icon';
import { map } from 'rxjs';

import { ConfigurableFocusTrapFactory, FocusTrapFactory } from '@angular/cdk/a11y';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
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
export class CmsLayoutComponent implements AfterViewInit {
  protected readonly firebaseAuthService = inject(FirebaseAuthService);
  protected readonly headerConfig = inject(CORE_CMS_LAYOUT_HEADER_CONFIG);
  protected readonly viewConfig = inject(VIEW_CONFIG);
  protected readonly currentDate = new Date();
  protected readonly headerWidgetsConfig = this.headerConfig?.widgetsConfig;
  protected readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map(handset => handset.matches))
  );
  protected readonly widgetsContainer = viewChild('widgetsContainer', {
    read: ViewContainerRef,
  });

  ngAfterViewInit(): void {
    this.createWidgets();
  }

  private async createWidgets(): Promise<void> {
    if (!this.headerWidgetsConfig) return;

    const container = this.widgetsContainer();
    if (container) {
      container.clear();

      // Sort widgets by order to ensure they are rendered in the correct order besides its array position
      const sortedWidgets = [...(this.headerWidgetsConfig.widgets ?? [])].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      );

      for (const widget of sortedWidgets) {
        const component = await widget.component();
        const componentRef = container.createComponent(component);

        if (widget.inputs) {
          Object.keys(widget.inputs).forEach(key => {
            componentRef?.setInput(key, widget.inputs?.[key]);
          });
        }
      }
    }
  }
}
