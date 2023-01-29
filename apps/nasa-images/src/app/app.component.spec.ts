import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CORE_CMS_LAYOUT_HEADER_CONFIG, CORE_CMS_LAYOUT_SIDENAV_CONFIG } from '@plastik/core/cms-layout/data-access';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AppComponent,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([]),
        AngularSvgIconModule.forRoot(),
        HttpClientModule,
      ],
      providers: [
        { provide: CORE_CMS_LAYOUT_HEADER_CONFIG, useValue: null },
        { provide: CORE_CMS_LAYOUT_SIDENAV_CONFIG, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
