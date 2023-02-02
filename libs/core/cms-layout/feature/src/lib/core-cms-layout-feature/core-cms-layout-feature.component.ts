import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DatePipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterLink } from '@angular/router';
import { PushModule } from '@ngrx/component';
import { Action } from '@ngrx/store';
import { LayoutFacade } from '@plastik/core/cms-layout/data-access';
import { CoreCmsLayoutUiFooterComponent } from '@plastik/core/cms-layout/footer';
import { CoreCmsLayoutUiHeaderComponent } from '@plastik/core/cms-layout/header';
import { CoreCmsLayoutUiSidenavComponent } from '@plastik/core/cms-layout/sidenav';
import { SharedButtonUiComponent } from '@plastik/shared/button';
import { LayoutPosition } from '@plastik/shared/entities';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { map, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'plastik-core-cms-layout-feature',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    RouterLink,
    NgTemplateOutlet,
    DatePipe,
    PushModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatListModule,
    AngularSvgIconModule,
    CoreCmsLayoutUiFooterComponent,
    CoreCmsLayoutUiHeaderComponent,
    CoreCmsLayoutUiSidenavComponent,
    SharedButtonUiComponent,
  ],
  templateUrl: './core-cms-layout-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCmsLayoutFeatureComponent implements OnInit, OnDestroy {
  @Input() sidenavPosition: LayoutPosition = 'start';
  currentDate = new Date();
  sidenavOpened$ = this.facade.sidenavOpened$;
  isMobile$ = this.facade.isMobile$;
  headerConfig = this.facade.headerConfig;
  sidenavConfig = this.facade.sidenavConfig;

  private readonly destroyed$ = new Subject<void>();

  constructor(private readonly facade: LayoutFacade, private readonly breakpointObserver: BreakpointObserver) {}

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

    this.sidenavOpened$ = this.facade.sidenavOpened$;
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onToggleSidenav(opened?: boolean): void {
    this.facade.toggleSidenav(opened);
  }

  onSetIsMobile(isMobile: boolean): void {
    this.facade.setIsMobile(isMobile);
  }

  onButtonClickAction(action: () => Action): void {
    this.facade.dispatchAction(action);
  }
}
