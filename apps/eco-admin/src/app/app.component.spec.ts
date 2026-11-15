import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { provideNotificationConfig } from '@plastik/shared/notification/entities';
import { Subject } from 'rxjs';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let focusOrigin$: Subject<FocusOrigin>;

  beforeEach(async () => {
    focusOrigin$ = new Subject<FocusOrigin>();

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        provideEnvironmentPocketBaseTranslationMock(),
        provideNotificationConfig(),
        {
          provide: FocusMonitor,
          useValue: { monitor: vi.fn(() => focusOrigin$.asObservable()) },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    document.body.classList.remove('is-keyboard-active');
  });

  it('renders the skip link before the routed outlet', async () => {
    const fixture = TestBed.createComponent(AppComponent);

    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const skipLink = compiled.querySelector('plastik-skip-link');
    const outlet = compiled.querySelector('router-outlet');

    expect(skipLink).not.toBeNull();
    expect(outlet).not.toBeNull();
    expect(
      skipLink &&
        outlet &&
        skipLink.compareDocumentPosition(outlet) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('registers the languages of the environment', () => {
    TestBed.createComponent(AppComponent);

    expect(TestBed.inject(TranslateService).getLangs()).toEqual(['en', 'es']);
  });

  it('marks the body only while the focus comes from the keyboard', () => {
    TestBed.createComponent(AppComponent);

    focusOrigin$.next('keyboard');

    expect(document.body.classList.contains('is-keyboard-active')).toBe(true);

    focusOrigin$.next('mouse');

    expect(document.body.classList.contains('is-keyboard-active')).toBe(false);
  });
});
