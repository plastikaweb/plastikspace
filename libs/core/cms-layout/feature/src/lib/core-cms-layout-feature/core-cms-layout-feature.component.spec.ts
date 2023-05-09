import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, createAction } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { LayoutFacade } from '@plastik/core/cms-layout/data-access';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { axe, toHaveNoViolations } from 'jest-axe';

import { NotificationFacade } from '@plastik/core/notification/data-access';
import { CoreCmsLayoutFeatureComponent } from './core-cms-layout-feature.component';

expect.extend(toHaveNoViolations);

describe('CoreCmsLayoutFeatureComponent', () => {
  let component: CoreCmsLayoutFeatureComponent;
  let fixture: ComponentFixture<CoreCmsLayoutFeatureComponent>;
  let layoutFacade: LayoutFacade;
  let notificationFacade: NotificationFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CoreCmsLayoutFeatureComponent,
        HttpClientTestingModule,
        NoopAnimationsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        AngularSvgIconModule.forRoot(),
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatListModule,
      ],
      providers: [
        provideMockStore(),
        {
          provide: LayoutFacade,
          useValue: {
            toggleSidenav: jest.fn(),
            setIsMobile: jest.fn(),
            dispatchAction: jest.fn(),
          },
        },
        {
          provide: NotificationFacade,
          useValue: {
            dismiss: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreCmsLayoutFeatureComponent);
    component = fixture.componentInstance;
    layoutFacade = TestBed.inject(LayoutFacade);
    notificationFacade = TestBed.inject(NotificationFacade);

    component.headerConfig = {
      title: 'title',
      showToggleMenuButton: true,
    };

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

  it('should call dispatchAction layoutFacade method on onSetIsMobile event', () => {
    const doAction = createAction('[Action] do');
    component.onButtonClickAction(doAction);
    expect(layoutFacade.dispatchAction).toHaveBeenCalledWith(doAction);
  });

  it('should call dismiss notificationFacade method on onNotificationDismiss event', () => {
    component.onNotificationDismiss();
    expect(notificationFacade.dismiss).toHaveBeenCalled();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
