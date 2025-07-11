import { AngularSvgIconModule } from 'angular-svg-icon';
import { axe, toHaveNoViolations } from 'jest-axe';

import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { LayoutFacade } from '@plastik/core/cms-layout/data-access';

import { CoreCmsLayoutFeatureComponent } from './core-cms-layout-feature.component';

describe('CoreCmsLayoutFeatureComponent', () => {
  let component: CoreCmsLayoutFeatureComponent;
  let fixture: ComponentFixture<CoreCmsLayoutFeatureComponent>;
  let layoutFacade: LayoutFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CoreCmsLayoutFeatureComponent,
        NoopAnimationsModule,
        AngularSvgIconModule.forRoot(),
        MatSidenavModule,
        MatIconModule,
        MatListModule,
      ],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([]),
        provideMockStore({}),
        {
          provide: LayoutFacade,
          useValue: {
            toggleSidenav: jest.fn(),
            setIsMobile: jest.fn(),
            dispatchAction: jest.fn(),
            sidenavConfig: signal([]),
            sidenavOpened$: signal(false),
            isMobile$: signal(false),
            isActive: signal(false),
            headerConfig: {
              showToggleMenuButton: true,
              sidenavPosition: 'start',
              title: 'title',
              extendedTitle: 'extendedTitle',
              mainIcon: { iconPath: '', label: 'icon' },
              widgetsConfig: {},
              menu: { label: signal('label'), position: 'start', config: [] },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreCmsLayoutFeatureComponent);
    component = fixture.componentInstance;
    layoutFacade = TestBed.inject(LayoutFacade);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggleSidenav layoutFacade method on onToggleSidenav event', () => {
    component.onToggleSidenav(true);
    expect(layoutFacade.toggleSidenav).toHaveBeenCalledWith(true);
  });

  it('should call setIsMobile layoutFacade method on onSetIsMobile event', () => {
    component.onSetIsMobile(true);
    expect(layoutFacade.setIsMobile).toHaveBeenCalledWith(true);
  });

  it('should call dismiss notification action on onNotificationDismiss event', () => {
    component.onNotificationDismiss();
    // expect(notificationFacade.dismiss).toHaveBeenCalled();
  });

  it('should have no accessibility violations', async () => {
    expect.extend(toHaveNoViolations);
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
