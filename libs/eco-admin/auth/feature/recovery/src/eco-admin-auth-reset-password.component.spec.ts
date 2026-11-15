import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { resetPasswordFormConfig } from '@plastik/auth/config/util';
import { AUTH_FORM_FACADE, AUTH_SCREEN_DEFAULTS } from '@plastik/auth/entities';
import {
  PocketBaseResetPasswordFacadeService,
  pocketBaseUserProfileStore,
} from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { FORM_TOKEN } from '@plastik/core/entities';
import { providePasswordWithVisibilityFormly } from '@plastik/shared/form/password';
import { provideFormlyAddons, providePlainInputFormly } from '@plastik/shared/form/util';
import { axe } from 'vitest-axe';

import { EcoAdminAuthResetPasswordComponent } from './eco-admin-auth-reset-password.component';

const PASSWORD = 'input[name="new-password"]';
const REPEAT = 'input[name="new-password-repeat"]';
const ALERT = 'plastik-shared-alert';
const FORM = 'plastik-shared-form-feature';
const SUBMIT = '[data-test="submit-button"]';
const BACK = '[content] > a[href="/accedir"]';
const OUTCOME = '[role="group"]';
const NEXT = `${OUTCOME} a.mat-mdc-unelevated-button`;

describe('EcoAdminAuthResetPasswordComponent', () => {
  let fixture: ComponentFixture<EcoAdminAuthResetPasswordComponent>;
  let host: HTMLElement;

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

  /**
   * Types the same new password in both fields.
   */
  function fillIn(): void {
    type(PASSWORD, 'test-new-password');
    type(REPEAT, 'test-new-password');
  }

  /**
   * Builds the screen.
   * @param {string} [token] The value of the `token` query parameter the visitor arrives with.
   */
  async function render(token?: string): Promise<void> {
    if (token !== undefined) {
      await TestBed.inject(Router).navigateByUrl(`/?token=${encodeURIComponent(token)}`);
    }

    fixture = TestBed.createComponent(EcoAdminAuthResetPasswordComponent);
    host = fixture.nativeElement;
    fixture.detectChanges();
    await settle();
  }

  beforeEach(async () => {
    mockPocketBaseUserProfileStore.resetPassword.mockReset();
    mockPocketBaseUserProfileStore.resetPassword.mockResolvedValue(true);
    mockPocketBaseUserProfileStore.isLoading.set(false);

    await TestBed.configureTestingModule({
      imports: [EcoAdminAuthResetPasswordComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        // What `ecoAdminAuthResetPasswordRoutes` gives the screen in the application.
        { provide: AUTH_FORM_FACADE, useClass: PocketBaseResetPasswordFacadeService },
        { provide: FORM_TOKEN, useFactory: resetPasswordFormConfig },
        providePlainInputFormly(),
        providePasswordWithVisibilityFormly(),
        provideFormlyAddons(),
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
        // What `provideEcoAdminAuthScreen()` says once in the application, as far as this screen shows it.
        {
          provide: AUTH_SCREEN_DEFAULTS,
          useValue: { title: signal('Eco Admin'), icon: 'eco', cardClass: 'eco-shake-on-error' },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.isLoading.set(false);
  });

  describe('with the link of the email', () => {
    beforeEach(() => render('test-token'));

    it('names the application and the view, and labels both fields', () => {
      expect(find('h1').textContent).toContain('Eco Admin');
      expect(find('h2').textContent).toContain('auth.resetPassword.title');
      expect(find(`label[for="${find(PASSWORD).id}"]`).textContent).toContain(
        'auth.resetPassword.passwordLabel'
      );
      expect(find(`label[for="${find(REPEAT).id}"]`).textContent).toContain(
        'auth.resetPassword.passwordConfirmLabel'
      );
      expect(host.querySelector(ALERT)).toBeNull();
    });

    it('offers the way back to the login screen under the form', () => {
      const back = find<HTMLAnchorElement>(BACK);

      expect(back.textContent).toContain('auth.forgotPassword.backToLogin');
      expect(find(`${BACK} mat-icon`).getAttribute('aria-hidden')).toBe('true');
    });

    it('draws both fields as Material form fields a password manager fills as a new password', () => {
      expect(host.querySelectorAll('mat-form-field')).toHaveLength(2);
      expect(find(PASSWORD).getAttribute('autocomplete')).toBe('new-password');
      expect(find(REPEAT).getAttribute('autocomplete')).toBe('new-password');
      expect(find<HTMLInputElement>(PASSWORD).type).toBe('password');
    });

    it('keeps the icons of the fields away from assistive technology', () => {
      const icons = host.querySelectorAll('.mat-mdc-form-field-icon-prefix mat-icon');

      expect(icons).toHaveLength(2);
      icons.forEach(icon => expect(icon.getAttribute('aria-hidden')).toBe('true'));
    });

    it('keeps the button of the form off until both passwords are the same', () => {
      const button = find<HTMLButtonElement>(SUBMIT);

      expect(button.disabled).toBe(true);
      expect(button.textContent).toContain('auth.resetPassword.submitButton');

      type(PASSWORD, 'test-new-password');
      type(REPEAT, 'test-other-password');

      expect(button.disabled).toBe(true);

      type(REPEAT, 'test-new-password');

      expect(button.disabled).toBe(false);
    });

    it('sends the token of the address with the new password', async () => {
      fillIn();

      await submit();

      expect(mockPocketBaseUserProfileStore.resetPassword).toHaveBeenCalledWith({
        token: 'test-token',
        password: 'test-new-password',
        confirmPassword: 'test-new-password',
      });
    });

    it('says the password was changed in place of the heading, and offers the login screen alone', async () => {
      fillIn();

      await submit();

      const panel = find(OUTCOME);

      expect(host.querySelectorAll('h2')).toHaveLength(1);
      expect(find('h2').textContent).toContain('auth.resetPassword.done.title');
      expect(panel.textContent).toContain('auth.resetPassword.done.description');
      expect(find<HTMLAnchorElement>(NEXT).getAttribute('href')).toBe('/accedir');
      expect(find(NEXT).textContent).toContain('auth.resetPassword.done.action');
      expect(document.activeElement).toBe(panel);
      expect(host.querySelector(ALERT)).toBeNull();
      expect(host.querySelector(FORM)).toBeNull();
      expect(host.querySelector(BACK)).toBeNull();
    });

    it('says the link no longer works in place of the heading, takes the form away and offers a new email', async () => {
      mockPocketBaseUserProfileStore.resetPassword.mockResolvedValue(false);
      fillIn();

      await submit();

      const panel = find(OUTCOME);

      expect(host.querySelectorAll('h2')).toHaveLength(1);
      expect(find('h2').textContent).toContain('auth.resetPassword.expired.title');
      expect(panel.textContent).toContain('auth.resetPassword.expired.description');
      expect(find<HTMLAnchorElement>(NEXT).getAttribute('href')).toBe('/recuperar-contrasenya');
      expect(find(NEXT).textContent).toContain('auth.resetPassword.expired.action');
      expect(document.activeElement).toBe(panel);
      expect(host.querySelector(ALERT)).toBeNull();
      expect(host.querySelector(FORM)).toBeNull();
      expect(host.querySelector(BACK)).not.toBeNull();
    });

    it('dims the card and takes it away from the pointer while the attempt runs', () => {
      mockPocketBaseUserProfileStore.isLoading.set(true);
      fixture.detectChanges();

      const card = find('mat-card');

      expect(card.classList).toContain('pointer-events-none');
      expect(card.classList).toContain('opacity-60');
    });

    it('has no accessibility violations', async () => {
      expect(await axe(host)).toHaveNoViolations();
    });

    it('has no accessibility violations once the password was changed', async () => {
      fillIn();
      await submit();

      expect(host.querySelector(OUTCOME)).not.toBeNull();
      expect(await axe(host)).toHaveNoViolations();
    });
  });

  describe('with an address that carries no token', () => {
    beforeEach(() => render());

    it('says from the start that the link does not work and offers a new email', () => {
      expect(find('h2').textContent).toContain('auth.resetPassword.expired.title');
      expect(find<HTMLAnchorElement>(NEXT).getAttribute('href')).toBe('/recuperar-contrasenya');
      expect(host.querySelector(ALERT)).toBeNull();
    });

    it('shows no form, since there is nothing to send it with', () => {
      expect(host.querySelector(FORM)).toBeNull();
      expect(host.querySelector(PASSWORD)).toBeNull();
      expect(host.querySelector(SUBMIT)).toBeNull();
      expect(mockPocketBaseUserProfileStore.resetPassword).not.toHaveBeenCalled();
    });

    it('keeps the way back to the login screen', () => {
      expect(find<HTMLAnchorElement>(BACK).textContent).toContain(
        'auth.forgotPassword.backToLogin'
      );
    });

    it('has no accessibility violations', async () => {
      expect(await axe(host)).toHaveNoViolations();
    });
  });
});
