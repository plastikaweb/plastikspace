import { LiveAnnouncer } from '@angular/cdk/a11y';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { PocketBaseUser, PocketBaseUserRoles } from '@plastik/core/entities';
import { MatThemeToggleService } from '@plastik/shared/mat-theme-toggle';
import { axe } from 'vitest-axe';

import { EcoAdminAuthLoginComponent } from './eco-admin-auth-login.component';

describe('EcoAdminAuthLoginComponent', () => {
  let fixture: ComponentFixture<EcoAdminAuthLoginComponent>;
  let host: HTMLElement;
  let navigateByUrl: ReturnType<typeof vi.spyOn>;
  let announce: ReturnType<typeof vi.spyOn>;

  const themeService = {
    selectedTheme: signal<{ id: string }>({ id: 'system' }),
    setTheme: vi.fn(),
  };

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
   * Fills both fields with a complete set of credentials.
   */
  function fillIn(): void {
    type('#eco-admin-login-email', 'admin@example.test');
    type('#eco-admin-login-password', 'test-password');
  }

  /**
   * Builds the screen.
   * @param {string} returnUrl The value of the `returnUrl` query parameter, if any.
   */
  function render(returnUrl?: string): void {
    fixture = TestBed.createComponent(EcoAdminAuthLoginComponent);
    host = fixture.nativeElement;

    if (returnUrl !== undefined) {
      fixture.componentRef.setInput('returnUrl', returnUrl);
    }

    fixture.detectChanges();
  }

  beforeEach(async () => {
    mockPocketBaseUserProfileStore.login.mockReset();
    mockPocketBaseUserProfileStore.logout.mockReset();
    mockPocketBaseUserProfileStore.cancelLoginChallenge.mockReset();
    mockPocketBaseUserProfileStore.user.set(null);
    themeService.selectedTheme.set({ id: 'system' });
    themeService.setTheme.mockReset();

    await TestBed.configureTestingModule({
      imports: [EcoAdminAuthLoginComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
        { provide: MatThemeToggleService, useValue: themeService },
      ],
    }).compileComponents();

    navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    announce = vi.spyOn(TestBed.inject(LiveAnnouncer), 'announce').mockResolvedValue();
  });

  describe('the form', () => {
    beforeEach(() => render());

    it('names the application and labels both fields', () => {
      expect(find('h1').textContent).toContain('Eco Admin');
      expect(find('label[for="eco-admin-login-email"]').textContent).toContain('auth.login.email');
      expect(find('label[for="eco-admin-login-password"]').textContent).toContain(
        'auth.login.password'
      );
    });

    it('lets a password manager recognise the fields', () => {
      const email = find<HTMLInputElement>('#eco-admin-login-email');
      const password = find<HTMLInputElement>('#eco-admin-login-password');

      expect(email.getAttribute('autocomplete')).toBe('username');
      expect(email.name).toBe('email');
      expect(password.getAttribute('autocomplete')).toBe('current-password');
      expect(password.name).toBe('password');
      expect(password.type).toBe('password');
    });

    it('keeps the landmark the skip link jumps to', () => {
      const main = find('main');

      expect(main.id).toBe('mainContent');
      expect(main.getAttribute('tabindex')).toBe('-1');
    });

    it('shows and hides the password, and says which', () => {
      const toggle = find('.login__password-toggle');

      expect(toggle.getAttribute('aria-pressed')).toBe('false');
      expect(toggle.getAttribute('aria-label')).toBe('auth.login.showPassword');
      expect(toggle.getAttribute('type')).toBe('button');

      toggle.click();
      fixture.detectChanges();

      expect(find<HTMLInputElement>('#eco-admin-login-password').type).toBe('text');
      expect(toggle.getAttribute('aria-pressed')).toBe('true');
      expect(toggle.getAttribute('aria-label')).toBe('auth.login.hidePassword');

      toggle.click();
      fixture.detectChanges();

      expect(find<HTMLInputElement>('#eco-admin-login-password').type).toBe('password');
    });

    it('has no accessibility violations', async () => {
      expect(await axe(host)).toHaveNoViolations();
    });
  });

  describe('a failed attempt', () => {
    beforeEach(() => render());

    it.each([
      ['failed', 'wrong', 'login__notice--error'],
      ['role-rejected', 'member', 'login__notice--member'],
      ['mfa-required', 'secondStep', 'login__notice--error'],
    ])('explains the outcome %s in the card', async (outcome, error, modifier) => {
      storeAnswers(outcome);
      fillIn();

      await submit();

      const notice = find('.login__notice');

      expect(notice.classList).toContain(modifier);
      expect(notice.textContent).toContain(`auth.login.error.${error}.title`);
      expect(notice.textContent).toContain(`auth.login.error.${error}.body`);
      expect(navigateByUrl).not.toHaveBeenCalled();
    });

    it('moves the focus to the explanation, inside an assertive live region', async () => {
      storeAnswers('failed');
      fillIn();

      await submit();

      const notice = find('.login__notice');

      expect(document.activeElement).toBe(notice);
      expect(notice.parentElement?.getAttribute('aria-live')).toBe('assertive');
    });

    it('shakes the card', async () => {
      storeAnswers('failed');
      fillIn();

      await submit();

      expect(find('.login__card').classList).toContain('login__card--shake-odd');

      await submit();

      expect(find('.login__card').classList).toContain('login__card--shake-even');
    });

    it('explains an empty form without asking the server', async () => {
      await submit();

      expect(find('.login__notice').textContent).toContain('auth.login.error.wrong.title');
      expect(mockPocketBaseUserProfileStore.login).not.toHaveBeenCalled();
    });

    it('hides the explanation as soon as a field changes', async () => {
      storeAnswers('failed');
      fillIn();
      await submit();

      type('#eco-admin-login-password', 'test-another');

      expect(host.querySelector('.login__notice')).toBeNull();
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
      render();
      fillIn();
      find('form').dispatchEvent(new Event('submit'));
      fixture.detectChanges();
    });

    afterEach(async () => {
      finish('failed');
      await settle();
    });

    it('says so on a button that stays focusable', () => {
      const button = find<HTMLButtonElement>('.login__submit');

      expect(button.getAttribute('aria-disabled')).toBe('true');
      expect(button.disabled).toBe(false);
      expect(button.textContent).toContain('auth.login.submitting');
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
    ])('takes a %s home and announces it', async (role, home, text) => {
      storeAnswers('authenticated', role);
      render();
      fillIn();

      await submit();

      expect(navigateByUrl).toHaveBeenCalledWith(home);
      expect(announce).toHaveBeenCalledWith(`auth.login.success.title ${text}`, 'polite');
      expect(find('.login__notice--success').textContent).toContain(text);
    });

    it('goes back to the address the visitor asked for', async () => {
      storeAnswers('authenticated', 'TENANT_ADMIN');
      render('/socis?estat=actiu');
      fillIn();

      await submit();

      expect(navigateByUrl).toHaveBeenCalledWith('/socis?estat=actiu');
    });

    it.each(['//evil.example', 'https://evil.example/', '/accedir'])(
      'never follows the return address %s',
      async returnUrl => {
        storeAnswers('authenticated', 'TENANT_ADMIN');
        render(returnUrl);
        fillIn();

        await submit();

        expect(navigateByUrl).toHaveBeenCalledWith('/tauler');
      }
    );
  });

  describe('the theme button', () => {
    /**
     * Makes the document answer the system colour scheme query.
     * @param {boolean} isDark Whether the system prefers the dark scheme.
     * @returns {() => void} Puts the document back as it was.
     */
    function systemPrefersDark(isDark: boolean): () => void {
      const view = document.defaultView as Window;
      const original = view.matchMedia;

      view.matchMedia = vi.fn().mockReturnValue({
        matches: isDark,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      });

      return () => {
        view.matchMedia = original;
      };
    }

    it('offers the dark theme from a light one', () => {
      themeService.selectedTheme.set({ id: 'light' });
      render();

      const button = find('.login__theme-button');

      expect(button.getAttribute('aria-label')).toBe('auth.login.themeToDark');
      expect(button.textContent).toContain('dark_mode');

      button.click();

      expect(themeService.setTheme).toHaveBeenCalledWith('dark');
    });

    it('offers the light theme from a dark one', () => {
      themeService.selectedTheme.set({ id: 'dark' });
      render();

      const button = find('.login__theme-button');

      expect(button.getAttribute('aria-label')).toBe('auth.login.themeToLight');
      expect(button.textContent).toContain('light_mode');

      button.click();

      expect(themeService.setTheme).toHaveBeenCalledWith('light');
    });

    it('follows the system while no theme was chosen', () => {
      const restore = systemPrefersDark(true);

      try {
        render();

        const button = find('.login__theme-button');

        expect(button.getAttribute('aria-label')).toBe('auth.login.themeToLight');

        button.click();

        expect(themeService.setTheme).toHaveBeenCalledWith('light');
      } finally {
        restore();
      }
    });
  });
});
