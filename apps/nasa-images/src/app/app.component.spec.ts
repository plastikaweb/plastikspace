import { AngularSvgIconModule } from 'angular-svg-icon';

import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { VIEW_CONFIG } from '@plastik/core/cms-layout/data-access';
import { CORE_CMS_LAYOUT_HEADER_CONFIG } from '@plastik/core/cms-layout/entities';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  const initialState = {
    activity: {},
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, AngularSvgIconModule.forRoot()],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideRouter([]),
        provideMockStore({ initialState }),
        { provide: CORE_CMS_LAYOUT_HEADER_CONFIG, useValue: {} },
        { provide: VIEW_CONFIG, useValue: signal([]) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should open GitHub readme link with noopener,noreferrer when header action is called', async () => {
    const { headerConfig } = await import('./cms-layout-config');
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const buttonConfig = headerConfig.widgetsConfig?.widgets?.[0]?.inputs?.['buttonConfig'];
    expect(buttonConfig).toBeDefined();

    buttonConfig?.doAction?.();

    expect(windowOpenSpy).toHaveBeenCalledWith(
      'https://github.com/plastikaweb/plastikspace/tree/develop/apps/nasa-images/README.md',
      '_blank',
      'noopener,noreferrer'
    );
  });
});
