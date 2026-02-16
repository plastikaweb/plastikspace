import { AngularSvgIconModule } from 'angular-svg-icon';
import { Subject, takeUntil } from 'rxjs';

import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  NgZone,
  OnDestroy,
  OnInit,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { LayoutFacade, LayoutObserverService } from '@plastik/core/cms-layout/data-access';
import { CoreCmsLayoutUiFooterComponent } from '@plastik/core/cms-layout/footer';
import { CoreCmsLayoutUiHeaderComponent } from '@plastik/core/cms-layout/header';
import { CoreCmsLayoutUiSidenavComponent } from '@plastik/core/cms-layout/sidenav';
import { SharedActivityUiOverlayComponent } from '@plastik/shared/activity/ui';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { NotificationUiMatSnackbarDirective } from '@plastik/shared/notification/ui/mat-snackbar';

@Component({
  selector: 'plastik-core-cms-layout-feature',
  imports: [
    RouterLink,
    NgTemplateOutlet,
    RouterLinkActive,
    DatePipe,
    PushPipe,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatListModule,
    MatButton,
    MatMenuModule,
    AngularSvgIconModule,
    CoreCmsLayoutUiFooterComponent,
    CoreCmsLayoutUiHeaderComponent,
    CoreCmsLayoutUiSidenavComponent,
    SharedActivityUiOverlayComponent,
    NotificationUiMatSnackbarDirective,
  ],
  templateUrl: './core-cms-layout-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCmsLayoutFeatureComponent implements OnInit, OnDestroy, AfterViewInit {
  readonly #layoutFacade = inject(LayoutFacade);
  readonly #destroyed$ = new Subject<void>();
  readonly #layoutObserverService = inject(LayoutObserverService);
  readonly #zone = inject(NgZone);

  protected readonly notificationStore = inject(notificationStore);
  protected readonly hideFooter = input(false);
  protected readonly widgetsContainer = viewChild('widgetsContainer', {
    read: ViewContainerRef,
  });
  protected readonly currentDate = new Date();
  protected readonly sidenavOpened$ = this.#layoutFacade.sidenavOpened$;
  protected readonly isMobile$ = this.#layoutFacade.isMobile$;
  protected readonly isActive = this.#layoutFacade.isActive;
  protected readonly sidenavConfig = this.#layoutFacade.sidenavConfig;
  readonly headerConfig = this.#layoutFacade.headerConfig;
  protected readonly headerWidgetsConfig = this.headerConfig?.widgetsConfig;

  ngOnInit(): void {
    this.#layoutObserverService
      .getMatches()
      .pipe(takeUntil(this.#destroyed$))
      .subscribe((matches: boolean) => {
        if (matches) this.onToggleSidenav(!matches);
        this.onSetIsMobile(matches);
      });
  }

  ngAfterViewInit(): void {
    this.#zone.runOutsideAngular(() => this.#createWidgets());
  }

  ngOnDestroy(): void {
    this.#destroyed$.next();
    this.#destroyed$.complete();
  }

  onNotificationDismiss(): void {
    this.notificationStore.dismiss();
  }

  protected onSendAction(action: () => void): void {
    this.#zone.runOutsideAngular(() => action());
  }

  onToggleSidenav(opened?: boolean): void {
    this.#zone.runOutsideAngular(() => this.#layoutFacade.toggleSidenav(opened));
  }

  onSetIsMobile(isMobile: boolean): void {
    this.#zone.runOutsideAngular(() => this.#layoutFacade.setIsMobile(isMobile));
  }

  async #createWidgets(): Promise<void> {
    if (!this.headerWidgetsConfig) return;

    const container = this.widgetsContainer();
    if (container) {
      container.clear();

      for (const widget of this.headerWidgetsConfig.widgets || []) {
        const component = await widget.component();
        const componentRef = container.createComponent(component);

        if (widget.inputs) {
          Object.entries(widget.inputs).forEach(([key, value]) => {
            componentRef?.setInput(key, value);
          });
        }
      }
    }
  }
}
