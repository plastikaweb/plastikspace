import { LiveAnnouncer } from '@angular/cdk/a11y';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { loginFormConfig } from '@plastik/auth/config/util';
import { AUTH_FORM_FACADE, AUTH_SCREEN_DEFAULTS } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { FORM_TOKEN, PocketBaseUser, PocketBaseUserRoles } from '@plastik/core/entities';
import { providePasswordWithVisibilityFormly } from '@plastik/shared/form/password';
import { provideFormlyAddons, providePlainInputFormly } from '@plastik/shared/form/util';
import { axe } from 'vitest-axe';

import { EcoAdminAuthLoginFacadeService } from './eco-admin-auth-login-facade.service';
import { EcoAdminAuthLoginComponent } from './eco-admin-auth-login.component';
import { ecoAdminAuthLoginRoutes } from './eco-admin-auth-login.routes';

const EMAIL = 'input[name="email"]';
const PASSWORD = 'input[name="password"]';
const PASSWORD_TOGGLE = 'button[aria-pressed]';
const ALERT = 'plastik-shared-alert';
const SUBMIT = '[data-test="submit-button"]';
const CARD = 'mat-card';

/**
 * The form of the screen, built by the factory the route gives to `FORM_TOKEN`.
 * @returns {unknown} The login form of eco-admin.
 */
function adminLoginForm(): unknown {
  const provider = (ecoAdminAuthLoginRoutes[0].providers ?? []).find(
    candidate =>
      typeof candidate === 'object' && 'provide' in candidate && candidate.provide === FORM_TOKEN
  ) as { useFactory: () => unknown };

  return provider.useFactory();
}

describe('EcoAdminAuthLoginComponent', () => {
  let fixture: ComponentFixture<EcoAdminAuthLoginComponent>;
  let host: HTMLElement;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;
  let announce: ReturnType<typeof vi.spyOn>;

  /**
   * Makes the store double answer a login the way the real store does.
   * @param {string} outcome What the store reports.
   * @param {PocketBaseUserRoles | null} role The role of the user the store ends up holding.
   */
  function storeAnswers(outcome: string, role: PocketBaseUserRoles | null = null): void {
    mockPocketBaseUserProfileStore.login.mockImplementation(async () => {
      mockPocketBaseUserProfileStore.user.set(
        role === null ? null : ({ id: 'user-1', role } as PocketBaseUser)
      );

      return outcome;
    });
  }

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
   * Leaves a field the way a person does, which is when the form says what it lacks.
   * @param {string} selector The field.
   */
  function leave(selector: string): void {
    find(selector).dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  }

  /**
   * Fills both fields with a complete set of credentials.
   */
  function fillIn(): void {
    type(EMAIL, 'admin@example.test');
    type(PASSWORD, 'test-password');
  }

  /**
   * Builds the screen.
   * @param {string} [returnUrl] The value of the `returnUrl` query parameter the visitor arrives with.
   */
  async function render(returnUrl?: string): Promise<void> {
    const router = TestBed.inject(Router);

    if (returnUrl !== undefined) {
      await router.navigateByUrl(`/?returnUrl=${encodeURIComponent(returnUrl)}`);
    }

    navigateByUrl = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    fixture = TestBed.createComponent(EcoAdminAuthLoginComponent);
    host = fixture.nativeElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    mockPocketBaseUserProfileStore.login.mockReset();
    mockPocketBaseUserProfileStore.logout.mockReset();
    mockPocketBaseUserProfileStore.cancelLoginChallenge.mockReset();
    mockPocketBaseUserProfileStore.user.set(null);

    await TestBed.configureTestingModule({
      imports: [EcoAdminAuthLoginComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        // What `ecoAdminAuthLoginRoutes` gives the screen in the application.
        { provide: AUTH_FORM_FACADE, useClass: EcoAdminAuthLoginFacadeService },
        { provide: FORM_TOKEN, useFactory: adminLoginForm },
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

    announce = vi.spyOn(TestBed.inject(LiveAnnouncer), 'announce').mockResolvedValue();
  });

  describe('the form', () => {
    beforeEach(() => render());

    it('names the application and the view, and labels both fields', () => {
      expect(find('h1').textContent).toContain('Eco Admin');
      expect(find('h2').textContent).toContain('auth.login.title');
      expect(find(`label[for="${find(EMAIL).id}"]`).textContent).toContain('auth.login.email');
      expect(find(`label[for="${find(PASSWORD).id}"]`).textContent).toContain(
        'auth.login.password'
      );
    });

    it('draws both fields as Material form fields, each named once', () => {
      expect(host.querySelectorAll('mat-form-field')).toHaveLength(2);
      expect(find(EMAIL).classList).toContain('mat-mdc-input-element');
      expect(find(PASSWORD).classList).toContain('mat-mdc-input-element');
      expect(host.querySelectorAll(`label[for="${find(PASSWORD).id}"]`)).toHaveLength(1);
    });

    it('keeps the icons of the fields away from assistive technology', async () => {
      // The shared addons wrapper hands each icon to its form field one turn after the first paint.
      await settle();

      const icons = host.querySelectorAll('.mat-mdc-form-field-icon-prefix mat-icon');

      expect(icons).toHaveLength(2);
      icons.forEach(icon => expect(icon.getAttribute('aria-hidden')).toBe('true'));
    });

    it('sizes the icons of the fields from the configuration of the form', async () => {
      await settle();

      const icons = host.querySelectorAll('.mat-mdc-form-field-icon-prefix mat-icon');

      icons.forEach(icon => expect(icon.classList.contains('size-[18px]!')).toBe(true));
    });

    it('lets a password manager recognise the fields', () => {
      const email = find<HTMLInputElement>(EMAIL);
      const password = find<HTMLInputElement>(PASSWORD);

      expect(email.getAttribute('autocomplete')).toBe('username');
      expect(email.name).toBe('email');
      expect(password.getAttribute('autocomplete')).toBe('current-password');
      expect(password.name).toBe('password');
      expect(password.type).toBe('password');
    });

    it('offers the way to a new password', () => {
      const link = find<HTMLAnchorElement>('.extra-links a');

      expect(link.getAttribute('href')).toBe('/recuperar-contrasenya');
      expect(link.textContent).toContain('auth.login.recoverAccess');
      expect(find('.extra-links mat-icon').getAttribute('aria-hidden')).toBe('true');
    });

    it('offers no way to register: the panel has no public sign-up (Vista Login, AUTH-01)', () => {
      const links = Array.from(host.querySelectorAll<HTMLAnchorElement>('a')).map(link =>
        link.getAttribute('href')
      );

      expect(links).toEqual(['/recuperar-contrasenya']);
      expect(host.textContent).not.toContain('auth.login.newUserQuestion');
      expect(host.textContent).not.toContain('auth.login.createAccount');
    });

    it('shows and hides the password, and says which', () => {
      const toggle = find(PASSWORD_TOGGLE);

      expect(toggle.getAttribute('aria-pressed')).toBe('false');
      expect(toggle.getAttribute('aria-label')).toBe('common.form.showPassword');
      expect(toggle.getAttribute('type')).toBe('button');

      toggle.click();
      fixture.detectChanges();

      expect(find<HTMLInputElement>(PASSWORD).type).toBe('text');
      expect(toggle.getAttribute('aria-pressed')).toBe('true');
      expect(toggle.getAttribute('aria-label')).toBe('common.form.hidePassword');

      toggle.click();
      fixture.detectChanges();

      expect(find<HTMLInputElement>(PASSWORD).type).toBe('password');
    });

    it('has no accessibility violations', async () => {
      expect(await axe(host)).toHaveNoViolations();
    });
  });

  describe('a form that cannot be sent', () => {
    beforeEach(() => render());

    it('keeps the button of the form on, even before the fields can be sent', () => {
      const button = find<HTMLButtonElement>(SUBMIT);

      expect(button.disabled).toBe(false);
      expect(button.textContent).toContain('auth.login.submit');
    });

    it('says what the empty fields lack on a submit and moves the focus to the first one', async () => {
      await submit();

      const errors = host.querySelectorAll('mat-error');

      expect(errors).toHaveLength(2);
      errors.forEach(error => expect(error.textContent).toContain('common.form.error.required'));
      expect(document.activeElement).toBe(find(EMAIL));
      expect(host.querySelector(ALERT)).toBeNull();
      expect(mockPocketBaseUserProfileStore.login).not.toHaveBeenCalled();
    });

    it('says what an empty field lacks once it is left, without asking the server', () => {
      leave(EMAIL);
      leave(PASSWORD);

      const errors = host.querySelectorAll('mat-error');

      expect(errors).toHaveLength(2);
      errors.forEach(error => expect(error.textContent).toContain('common.form.error.required'));
      expect(host.querySelector(ALERT)).toBeNull();
      expect(mockPocketBaseUserProfileStore.login).not.toHaveBeenCalled();
    });

    it('refuses an address that is not one', async () => {
      type(EMAIL, 'admin');
      type(PASSWORD, 'test-password');
      leave(EMAIL);

      await submit();

      expect(find('mat-error').textContent).toContain('common.form.error.email');
      expect(find(EMAIL).getAttribute('aria-invalid')).toBe('true');
      expect(document.activeElement).toBe(find(EMAIL));
      expect(mockPocketBaseUserProfileStore.login).not.toHaveBeenCalled();
    });

    it('refuses a password shorter than the shared login form allows', async () => {
      type(EMAIL, 'admin@example.test');
      type(PASSWORD, 'test-pw');
      leave(PASSWORD);

      await submit();

      expect(find('mat-error').textContent).toContain('common.form.error.minLength');
      expect(document.activeElement).toBe(find(PASSWORD));
      expect(mockPocketBaseUserProfileStore.login).not.toHaveBeenCalled();
    });

    it('stops the password where the shared login form does', () => {
      expect(find<HTMLInputElement>(PASSWORD).maxLength).toBe(25);
    });

    it('rests each label inside its field, as the storefront login does', () => {
      const labels = host.querySelectorAll('label.mdc-floating-label');

      expect(labels).toHaveLength(2);
      labels.forEach(label =>
        expect(label.classList.contains('mdc-floating-label--float-above')).toBe(false)
      );
    });

    it('floats the label of a field once it holds a value', async () => {
      type(EMAIL, 'admin@example.test');
      await settle();

      const label = find(`label[for="${find(EMAIL).id}"]`);

      expect(label.classList).toContain('mdc-floating-label--float-above');
    });

    it('repeats the label as the placeholder, shown once the label floats', () => {
      expect(find(EMAIL).getAttribute('placeholder')).toBe('auth.login.email');
      expect(find(PASSWORD).getAttribute('placeholder')).toBe('auth.login.password');
    });

    it('has no accessibility violations while it shows the errors of the fields', async () => {
      leave(EMAIL);
      leave(PASSWORD);

      expect(host.querySelectorAll('mat-error')).toHaveLength(2);
      expect(await axe(host)).toHaveNoViolations();
    });
  });

  describe('a failed attempt', () => {
    beforeEach(() => render());

    it.each([
      ['failed', 'wrong', 'plastik-alert--error'],
      ['role-rejected', 'member', 'plastik-alert--warning'],
      ['mfa-required', 'secondStep', 'plastik-alert--error'],
    ])('explains the outcome %s in the card', async (outcome, error, modifier) => {
      storeAnswers(outcome);
      fillIn();

      await submit();

      const alert = find(ALERT);

      expect(alert.classList).toContain(modifier);
      expect(alert.textContent).toContain(`auth.login.error.${error}.title`);
      expect(alert.textContent).toContain(`auth.login.error.${error}.body`);
      expect(navigateByUrl).not.toHaveBeenCalled();
    });

    it('moves the focus to the explanation, which is announced as an alert', async () => {
      storeAnswers('failed');
      fillIn();

      await submit();

      const alert = find(ALERT);

      expect(document.activeElement).toBe(alert);
      expect(alert.getAttribute('role')).toBe('alert');
    });

    it('shows the explanation inside the card that shakes on an error', async () => {
      storeAnswers('failed');
      fillIn();

      await submit();

      expect(find(ALERT).closest('.eco-shake-on-error')).not.toBeNull();
    });

    it('takes the explanation away while a new attempt runs, so the card shakes again', async () => {
      storeAnswers('failed');
      fillIn();
      await submit();

      let finish: (outcome: string) => void = () => undefined;

      mockPocketBaseUserProfileStore.login.mockReturnValue(
        new Promise<string>(resolve => (finish = resolve))
      );
      find('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(host.querySelector(ALERT)).toBeNull();

      finish('failed');
      await settle();

      expect(find(ALERT).classList).toContain('plastik-alert--error');
    });

    it('hides the explanation as soon as a field changes', async () => {
      storeAnswers('failed');
      fillIn();
      await submit();

      type(PASSWORD, 'test-another');

      expect(host.querySelector(ALERT)).toBeNull();
    });

    it('has no accessibility violations while it shows an error', async () => {
      storeAnswers('failed');
      fillIn();
      await submit();

      expect(await axe(host)).toHaveNoViolations();
    });
  });

  describe('while the attempt runs', () => {
    let finish: (outcome: string) => void;

    beforeEach(() => {
      mockPocketBaseUserProfileStore.login.mockReturnValue(
        new Promise<string>(resolve => (finish = resolve))
      );

      return render().then(() => {
        fillIn();
        find('form').dispatchEvent(new Event('submit'));
        fixture.detectChanges();
      });
    });

    afterEach(async () => {
      finish('failed');
      await settle();
    });

    it('dims the card and takes it away from the pointer', () => {
      const card = find(CARD);

      expect(card.classList).toContain('pointer-events-none');
      expect(card.classList).toContain('opacity-60');
    });

    it('does not send the form twice', () => {
      find('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();

      expect(mockPocketBaseUserProfileStore.login).toHaveBeenCalledTimes(1);
    });
  });

  describe('a session', () => {
    it.each<[PocketBaseUserRoles, string, string]>([
      ['TENANT_ADMIN', '/tauler', 'auth.login.success.redirectTenant'],
      ['GLOBAL_ADMIN', '/cooperatives', 'auth.login.success.redirectGlobal'],
    ])('tells a %s where they are taken, until they are there', async (role, home, text) => {
      let arrive: (done: boolean) => void = () => undefined;

      storeAnswers('authenticated', role);
      await render();
      navigateByUrl.mockReturnValue(new Promise<boolean>(resolve => (arrive = resolve)));
      fillIn();

      await submit();

      expect(navigateByUrl).toHaveBeenCalledWith(home);
      expect(announce).toHaveBeenCalledWith(`auth.login.success.title ${text}`, 'polite');
      expect(find('.plastik-alert--success').textContent).toContain(text);

      arrive(true);
      await settle();

      expect(host.querySelector('.plastik-alert--success')).toBeNull();
    });

    it('goes back to the address the visitor asked for', async () => {
      storeAnswers('authenticated', 'TENANT_ADMIN');
      await render('/socis?estat=actiu');
      fillIn();

      await submit();

      expect(navigateByUrl).toHaveBeenCalledWith('/socis?estat=actiu');
    });
  });

  describe('a later visit', () => {
    it('does not show the reason the last visit left', async () => {
      storeAnswers('failed');
      await render();
      fillIn();
      await submit();
      fixture.destroy();

      // Here the facade outlives the screen, as it does wherever the router keeps the injector of the route.
      await render();

      expect(host.querySelector(ALERT)).toBeNull();
    });
  });

  describe('the route', () => {
    it('gives the screen its title, its guard, its facade and its form', () => {
      const [route] = ecoAdminAuthLoginRoutes;
      const provided = (route.providers ?? []).map(provider =>
        typeof provider === 'object' && 'provide' in provider ? provider.provide : null
      );

      expect(route.title).toBe('auth.login.title');
      expect(route.component).toBe(EcoAdminAuthLoginComponent);
      expect(route.canActivate).toHaveLength(1);
      expect(provided).toContain(AUTH_FORM_FACADE);
      expect(provided).toContain(FORM_TOKEN);
    });
  });
});
