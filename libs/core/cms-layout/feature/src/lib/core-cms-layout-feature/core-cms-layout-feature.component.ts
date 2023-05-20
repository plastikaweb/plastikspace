import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatePipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PushModule } from '@ngrx/component';
import { Action } from '@ngrx/store';
import { LayoutFacade } from '@plastik/core/cms-layout/data-access';
import { CoreCmsLayoutUiFooterComponent } from '@plastik/core/cms-layout/footer';
import { CoreCmsLayoutUiHeaderComponent } from '@plastik/core/cms-layout/header';
import { CoreCmsLayoutUiSidenavComponent } from '@plastik/core/cms-layout/sidenav';
import { ViewConfig } from '@plastik/core/entities';
import { NotificationFacade } from '@plastik/core/notification/data-access';
import { CoreNotificationUiMatSnackbarDirective } from '@plastik/core/notification/ui/mat-snackbar';
import { RouterFacade } from '@plastik/core/router-state';
import { SharedActivityUiLinearComponent, SharedActivityUiOverlayComponent } from '@plastik/shared/activity/ui';
import { ButtonConfig, SharedButtonUiComponent } from '@plastik/shared/button';
import { LayoutPosition } from '@plastik/shared/entities';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { Subject, map, takeUntil } from 'rxjs';
@Component({
  selector: 'plastik-core-cms-layout-feature',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    NgTemplateOutlet,
    RouterLinkActive,
    DatePipe,
    PushModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    AngularSvgIconModule,
    CoreCmsLayoutUiFooterComponent,
    CoreCmsLayoutUiHeaderComponent,
    CoreCmsLayoutUiSidenavComponent,
    SharedButtonUiComponent,
    SharedActivityUiLinearComponent,
    SharedActivityUiOverlayComponent,
    CoreNotificationUiMatSnackbarDirective,
  ],
  templateUrl: './core-cms-layout-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCmsLayoutFeatureComponent implements OnInit, OnDestroy {
  @Input() sidenavPosition: LayoutPosition = 'start';

  currentDate = new Date();
  sidenavOpened$ = this.layoutFacade.sidenavOpened$;
  isMobile$ = this.layoutFacade.isMobile$;
  activity$ = this.layoutFacade.activity$;
  headerConfig = this.layoutFacade.headerConfig;
  sidenavConfig = this.layoutFacade.sidenavConfig;
  notificationConfig$ = this.notificationFacade.config$;
  skipLinkPath!: string;
  path$ = this.routerFacade.routeUrl$;
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly layoutFacade: LayoutFacade,
    private readonly notificationFacade: NotificationFacade,
    private readonly routerFacade: RouterFacade,
    private readonly breakpointObserver: BreakpointObserver,
  ) {}

  ngOnInit(): void {
    // TODO: Isolate breakpoint observer into its own service https://github.com/plastikaweb/plastikspace/issues/68
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(
        takeUntil(this.destroyed$),
        map(handset => handset.matches),
      )
      .subscribe((matches: boolean) => {
        if (matches) this.onToggleSidenav(!matches);
        this.onSetIsMobile(matches);
      });

    this.sidenavOpened$ = this.layoutFacade.sidenavOpened$;
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

  trackSidenavItems(_: number, item: ViewConfig<string>): number {
    return item.id;
  }

  trackSocialLinks(_: number, item: ButtonConfig): number {
    return item.id;
  }
}
