import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const initialState = {
    activity: {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, AppComponent, AngularSvgIconModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideMockStore({ initialState }),
        { provide: CORE_CMS_LAYOUT_HEADER_CONFIG, useValue: null },
        { provide: VIEW_CONFIG, useValue: null },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
