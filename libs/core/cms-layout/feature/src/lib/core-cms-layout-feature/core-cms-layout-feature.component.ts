import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
  OnInit,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PushPipe } from '@ngrx/component';
import { Action } from '@ngrx/store';
import { LayoutFacade } from '@plastik/core/cms-layout/data-access';
import { CoreCmsLayoutUiFooterComponent } from '@plastik/core/cms-layout/footer';
import { CoreCmsLayoutUiHeaderComponent } from '@plastik/core/cms-layout/header';
import { CoreCmsLayoutUiSidenavComponent } from '@plastik/core/cms-layout/sidenav';
import { RouterFacade } from '@plastik/core/router-state';
import { SharedActivityUiOverlayComponent } from '@plastik/shared/activity/ui';
import { SharedButtonUiComponent } from '@plastik/shared/button';
import { NotificationFacade } from '@plastik/shared/notification/data-access';
import { NotificationUiMatSnackbarDirective } from '@plastik/shared/notification/ui/mat-snackbar';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'plastik-core-cms-layout-feature',
  standalone: true,
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
    MatButtonModule,
    MatMenuModule,
    AngularSvgIconModule,
    CoreCmsLayoutUiFooterComponent,
    CoreCmsLayoutUiHeaderComponent,
    CoreCmsLayoutUiSidenavComponent,
    SharedButtonUiComponent,
    SharedActivityUiOverlayComponent,
    NotificationUiMatSnackbarDirective,
  ],
  templateUrl: './core-cms-layout-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCmsLayoutFeatureComponent implements OnInit, OnDestroy, AfterViewInit {
  hideFooter = input(false);
  widgetsContainer = viewChild('widgetsContainer', {
    read: ViewContainerRef,
  });

  currentDate = new Date();
  sidenavOpened$ = this.layoutFacade.sidenavOpened$;
  isMobile$ = this.layoutFacade.isMobile$;
  isActive$ = this.layoutFacade.isActive$;
  headerConfig = this.layoutFacade.headerConfig;
  sidenavConfig = this.layoutFacade.sidenavConfig;
  notificationConfig$ = this.notificationFacade.config$;
  skipLinkPath!: string;
  path$ = this.routerFacade.routeUrl$;

  protected readonly sidenavPosition = this.headerConfig?.sidenavPosition || 'start';
  protected readonly headerWidgetsConfig = this.headerConfig?.widgetsConfig;

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly layoutFacade: LayoutFacade,
    private readonly notificationFacade: NotificationFacade,
    private readonly routerFacade: RouterFacade,
    private readonly breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    // TODO: Isolate breakpoint observer into its own service https://github.com/plastikaweb/plastikspace/issues/68
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Medium])
      .pipe(
        takeUntil(this.destroyed$),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map((handset: any) => handset.matches)
      )
      .subscribe((matches: boolean) => {
        if (matches) this.onToggleSidenav(!matches);
        this.onSetIsMobile(matches);
      });

    this.sidenavOpened$ = this.layoutFacade.sidenavOpened$;
  }

  ngAfterViewInit(): void {
    this.createWidgets();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onToggleSidenav(opened?: boolean): void {
    this.layoutFacade.toggleSidenav(opened);
  }

  onSetIsMobile(isMobile: boolean): void {
    this.layoutFacade.setIsMobile(isMobile);
  }

  onButtonClickAction(action: () => Action): void {
    this.layoutFacade.dispatchAction(action);
  }

  onNotificationDismiss(): void {
    this.notificationFacade.dismiss();
  }

  onSendAction(action: () => void): void {
    action();
  }

  private createWidgets(): void {
    if (!this.headerWidgetsConfig) return;

    const container = this.widgetsContainer();
    if (container) {
      container.clear();

      this.headerWidgetsConfig?.widgets()?.forEach(async widget => {
        const component = await widget.component();
        const componentRef = container.createComponent(component);

        if (widget.inputs) {
          Object.keys(widget.inputs ?? {}).map(key => {
            componentRef?.setInput(key, widget.inputs?.[key]);
          });
        }
      });
    }
  }
}
