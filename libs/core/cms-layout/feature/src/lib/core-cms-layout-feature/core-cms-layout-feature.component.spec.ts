import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { LayoutFacade } from '@plastik/core/cms-layout/data-access';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { CoreCmsLayoutFeatureComponent } from './core-cms-layout-feature.component';

describe('CoreCmsLayoutFeatureComponent', () => {
  let component: CoreCmsLayoutFeatureComponent;
  let fixture: ComponentFixture<CoreCmsLayoutFeatureComponent>;
  let facade: LayoutFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        NoopAnimationsModule,
        CoreCmsLayoutFeatureComponent,
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
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoreCmsLayoutFeatureComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(LayoutFacade);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggleSidenav facade method on onToggleSidenav event', () => {
    component.onToggleSidenav(true);
    expect(facade.toggleSidenav).toHaveBeenCalledWith(true);
  });

  it('should call setIsMobile facade method on onSetIsMobile event', () => {
    component.onSetIsMobile(true);
    expect(facade.setIsMobile).toHaveBeenCalledWith(true);
  });
});
