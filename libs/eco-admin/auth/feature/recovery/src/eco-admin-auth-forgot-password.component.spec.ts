import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { requestPasswordFormConfig } from '@plastik/auth/config/util';
import { AUTH_FORM_FACADE, AUTH_SCREEN_DEFAULTS } from '@plastik/auth/entities';
import {
  POCKETBASE_REQUEST_PASSWORD_SENT_URL,
  PocketBaseRequestPasswordFacadeService,
  pocketBaseUserProfileStore,
} from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { FORM_TOKEN } from '@plastik/core/entities';
import { provideFormlyAddons, providePlainInputFormly } from '@plastik/shared/form/util';
import { axe } from 'vitest-axe';

import { EcoAdminAuthForgotPasswordComponent } from './eco-admin-auth-forgot-password.component';

const EMAIL = 'input[name="email"]';
const SUBMIT = '[data-test="submit-button"]';

describe('EcoAdminAuthForgotPasswordComponent', () => {
  let fixture: ComponentFixture<EcoAdminAuthForgotPasswordComponent>;
  let host: HTMLElement;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;

  /**
   * Finds one element of the screen, and fails the test when it is missing.
   * @param {string} selector A CSS selector.
   * @returns {HTMLElement} The element.
   */
  function find<T extends HTMLElement = HTMLElement>(selector: string): T {
    const element = host.querySelector<T>(selector);

    if (!element) {
      throw new Error(`Nothing matches ${selector}`);
    }

    return element;
  }

  /**
   * Types into a field the way a person does, firing the event the form listens to.
   * @param {string} selector The field.
   * @param {string} text What is typed.
   */
  function type(selector: string, text: string): void {
    const field = find<HTMLInputElement>(selector);

    field.value = text;
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  /**
   * Lets pending promises settle and paints the result.
   */
  async function settle(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  /**
   * Submits the form and waits for the screen to show the result.
   */
  async function submit(): Promise<void> {
    find('form').dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await settle();
  }

  beforeEach(async () => {
    mockPocketBaseUserProfileStore.requestPassword.mockReset();
    mockPocketBaseUserProfileStore.requestPassword.mockResolvedValue(undefined);
    mockPocketBaseUserProfileStore.isLoading.set(false);

    await TestBed.configureTestingModule({
      imports: [EcoAdminAuthForgotPasswordComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        // What `ecoAdminAuthForgotPasswordRoutes` gives the screen in the application.
        { provide: AUTH_FORM_FACADE, useClass: PocketBaseRequestPasswordFacadeService },
        { provide: FORM_TOKEN, useFactory: requestPasswordFormConfig },
        providePlainInputFormly(),
        provideFormlyAddons(),
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
        // What `provideEcoAdminAuthScreen()` says once in the application, as far as this screen shows it.
        {
          provide: AUTH_SCREEN_DEFAULTS,
          useValue: { title: signal('Eco Admin'), icon: 'eco', cardClass: 'eco-shake-on-error' },
        },
      ],
    }).compileComponents();

    navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    fixture = TestBed.createComponent(EcoAdminAuthForgotPasswordComponent);
    host = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.isLoading.set(false);
  });

  it('names the application and the view, and says what the screen is for', () => {
    expect(find('h1').textContent).toContain('Eco Admin');
    expect(find('h2').textContent).toContain('auth.forgotPassword.title');
    expect(host.textContent).toContain('auth.forgotPassword.description');
  });

  it('asks for the address in one Material form field, with its icon away from assistive technology', async () => {
    // The shared addons wrapper hands the icon to its form field one turn after the first paint.
    await settle();

    const icons = host.querySelectorAll('.mat-mdc-form-field-icon-prefix mat-icon');

    expect(host.querySelectorAll('mat-form-field')).toHaveLength(1);
    expect(find(`label[for="${find(EMAIL).id}"]`).textContent).toContain(
      'auth.forgotPassword.email'
    );
    expect(icons).toHaveLength(1);
    expect(icons[0].getAttribute('aria-hidden')).toBe('true');
  });

  it('keeps the button of the form off until the address can be sent', () => {
    const button = find<HTMLButtonElement>(SUBMIT);

    expect(button.disabled).toBe(true);
    expect(button.textContent).toContain('auth.forgotPassword.submit');

    type(EMAIL, 'admin');

    expect(button.disabled).toBe(true);

    type(EMAIL, 'admin@example.test');

    expect(button.disabled).toBe(false);
  });

  it('asks for the email and goes to the screen that says it is on its way', async () => {
    type(EMAIL, 'admin@example.test');

    await submit();

    expect(mockPocketBaseUserProfileStore.requestPassword).toHaveBeenCalledWith({
      email: 'admin@example.test',
    });
    expect(navigateByUrl).toHaveBeenCalledWith(POCKETBASE_REQUEST_PASSWORD_SENT_URL);
  });

  it('goes to the same screen when the request breaks, so it never tells which addresses exist', async () => {
    mockPocketBaseUserProfileStore.requestPassword.mockRejectedValue(new Error('network'));
    type(EMAIL, 'nobody@example.test');

    await submit();

    expect(navigateByUrl).toHaveBeenCalledWith(POCKETBASE_REQUEST_PASSWORD_SENT_URL);
    expect(host.querySelector('plastik-shared-alert')).toBeNull();
  });

  it('dims the card and takes it away from the pointer while the request runs', () => {
    mockPocketBaseUserProfileStore.isLoading.set(true);
    fixture.detectChanges();

    const card = find('mat-card');

    expect(card.classList).toContain('pointer-events-none');
    expect(card.classList).toContain('opacity-60');
  });

  it('offers one way back to the login screen, outside the form', () => {
    const links = host.querySelectorAll<HTMLAnchorElement>('a[href="/accedir"]');

    expect(links).toHaveLength(1);
    expect(links[0].textContent).toContain('auth.forgotPassword.backToLogin');
    expect(links[0].closest('form')).toBeNull();
    expect(find('a[href="/accedir"] mat-icon').getAttribute('aria-hidden')).toBe('true');
  });

  it('has no accessibility violations', async () => {
    expect(await axe(host)).toHaveNoViolations();
  });
});
