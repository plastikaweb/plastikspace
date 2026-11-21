import { IMAGE_LOADER } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';
import {
  AUTH_FORM_FACADE,
  AUTH_SCREEN_DEFAULTS,
  AuthFormMessage,
  AuthScreenDefaults,
} from '@plastik/auth/entities';
import { axe } from 'vitest-axe';

import { AuthFeatureComponent } from './auth-feature.component';

const ALERT = 'plastik-shared-alert';
const FORM = 'plastik-shared-form-feature';
const OUTCOME = '[role="group"]';
const OUTCOME_LINK = `${OUTCOME} a.mat-mdc-unelevated-button`;

@Component({
  imports: [AuthFeatureComponent],
  template: `
    <plastik-auth-feature
      [title]="title()"
      [logo]="logo()"
      [isLoading]="isLoading()"
      [error]="error()"
      [success]="success()"
      [name]="name()"
      [nameLink]="nameLink()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class BareHostComponent {
  readonly title = signal<string | undefined>(undefined);
  readonly logo = signal<string | null | undefined>(undefined);
  readonly isLoading = signal(false);
  readonly error = signal<AuthFormMessage | null>(null);
  readonly success = signal<AuthFormMessage | null>(null);
  readonly name = signal<string | undefined>(undefined);
  readonly nameLink = signal<string | undefined>(undefined);
}

@Component({
  imports: [AuthFeatureComponent],
  template: `
    <plastik-auth-feature [error]="error()" [outcome]="outcome()">
      <span title>Heading of the view</span>
      <span description>What the view is for</span>
      <div content><p class="projected">Projected body</p></div>
    </plastik-auth-feature>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ProjectingHostComponent {
  readonly error = signal<AuthFormMessage | null>(null);
  readonly outcome = signal<AuthFormMessage | null>(null);
}

describe('AuthFeatureComponent', () => {
  let host: HTMLElement;

  const canGoBack = signal(false);
  const goBack = vi.fn();
  const defaults: AuthScreenDefaults = {
    title: signal('Eco'),
    subtitle: signal('The line of the application'),
    icon: 'eco',
    cardClass: 'shake-on-error',
    canGoBack,
    goBack,
  };

  const facade = {
    formConfig: { getConfig: () => [], getSubmitFormConfig: () => null },
    extraLinks: signal([{ label: 'auth.login.recoverAccess', route: '/recover' }]),
    onSubmit: vi.fn(),
    clearError: vi.fn(),
  };

  /**
   * Mounts a host of the screen.
   * @param {Type<T>} hostType The host component.
   * @param {object} options What the test provides around it.
   * @param {AuthScreenDefaults | null} options.screenDefaults What the application says once; null for none.
   * @param {boolean} options.hasFacade Whether the route provides a facade.
   * @returns {Promise<ComponentFixture<T>>} The fixture, already rendered.
   */
  async function mount<T>(
    hostType: Type<T>,
    {
      screenDefaults = defaults,
      hasFacade = false,
    }: { screenDefaults?: AuthScreenDefaults | null; hasFacade?: boolean } = {}
  ): Promise<ComponentFixture<T>> {
    await TestBed.configureTestingModule({
      imports: [hostType, FormlyModule.forRoot()],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        { provide: IMAGE_LOADER, useValue: (config: { src: string }) => config.src },
        ...(screenDefaults ? [{ provide: AUTH_SCREEN_DEFAULTS, useValue: screenDefaults }] : []),
        ...(hasFacade ? [{ provide: AUTH_FORM_FACADE, useValue: facade }] : []),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(hostType);

    host = fixture.nativeElement;
    await fixture.whenStable();

    return fixture;
  }

  /**
   * Reads the text of one element of the screen.
   * @param {string} selector A CSS selector.
   * @returns {string | undefined} Its text without the room around it, or undefined when it is missing.
   */
  function textOf(selector: string): string | undefined {
    return host.querySelector(selector)?.textContent?.replace(/\s+/g, ' ').trim();
  }

  beforeEach(() => {
    canGoBack.set(false);
    goBack.mockClear();
    facade.onSubmit.mockClear();
    facade.clearError.mockClear();
  });

  describe('the mark of the application', () => {
    it('should take the name, the line and the icon from the defaults of the application', async () => {
      await mount(BareHostComponent);

      expect(textOf('h1')).toBe('Eco');
      expect(textOf('mat-card-header p')).toBe('The line of the application');
      expect(textOf('mat-card-header mat-icon')).toBe('eco');
      expect(host.querySelector('plastik-img-container')).toBeNull();
    });

    it('should let the name of a route speak over the one of the defaults', async () => {
      const fixture = await mount(BareHostComponent);

      fixture.componentInstance.title.set('Another name');
      await fixture.whenStable();

      expect(textOf('h1')).toBe('Another name');
      // The line and the icon have no input: they stay the ones of the application.
      expect(textOf('mat-card-header p')).toBe('The line of the application');
      expect(textOf('mat-card-header mat-icon')).toBe('eco');
    });

    it('should draw the logo in place of the icon when there is one', async () => {
      const fixture = await mount(BareHostComponent);

      fixture.componentInstance.logo.set('tenants/abc/logo.png');
      await fixture.whenStable();

      expect(host.querySelector('plastik-img-container')).not.toBeNull();
      expect(host.querySelector('mat-card-header mat-icon')).toBeNull();
    });

    it('should fall back to a lock and to no name when nobody says anything', async () => {
      await mount(BareHostComponent, { screenDefaults: null });

      expect(textOf('h1')).toBe('');
      expect(textOf('mat-card-header mat-icon')).toBe('lock');
    });
  });

  describe('the card', () => {
    it('should be a Material card carrying the classes of the application', async () => {
      await mount(BareHostComponent);

      const card = host.querySelector('mat-card');

      expect(card?.classList).toContain('mat-mdc-card');
      expect(card?.classList).toContain('shake-on-error');
      // The classes of the component itself are still there.
      expect(card?.classList).toContain('overflow-hidden');
    });

    it('should be dimmed and take no pointer while an attempt runs', async () => {
      const fixture = await mount(BareHostComponent);
      const card = host.querySelector('mat-card');

      expect(card?.classList).not.toContain('pointer-events-none');

      fixture.componentInstance.isLoading.set(true);
      await fixture.whenStable();

      expect(card?.classList).toContain('pointer-events-none');
      expect(card?.classList).toContain('opacity-60');
    });

    it('should be the target of the skip link', async () => {
      await mount(BareHostComponent);

      const main = host.querySelector('main');

      expect(main?.id).toBe('mainContent');
      expect(main?.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('the foot of the card', () => {
    it('should have none when nobody gives one', async () => {
      await mount(BareHostComponent);

      expect(host.querySelector('mat-card-footer')).toBeNull();
    });

    it('should show the line of the application', async () => {
      await mount(BareHostComponent, {
        screenDefaults: { ...defaults, footer: signal('The terms of the application') },
      });

      expect(textOf('mat-card-footer')).toBe('The terms of the application');
    });

    it('should sign with a name, linked when there is a link, and the year', async () => {
      const fixture = await mount(BareHostComponent);
      const year = new Date().getFullYear();

      fixture.componentInstance.name.set('Plastikaweb');
      await fixture.whenStable();

      expect(textOf('mat-card-footer')).toBe(`Plastikaweb ${year}`);
      expect(host.querySelector('mat-card-footer a')).toBeNull();

      fixture.componentInstance.nameLink.set('https://example.test');
      await fixture.whenStable();

      expect(host.querySelector('mat-card-footer a')?.getAttribute('href')).toBe(
        'https://example.test'
      );
    });
  });

  describe('the way back', () => {
    it('should be offered only when the application says so', async () => {
      const fixture = await mount(BareHostComponent);

      expect(host.querySelector('button[matIconButton]')).toBeNull();

      canGoBack.set(true);
      await fixture.whenStable();

      const button = host.querySelector<HTMLButtonElement>('button[matIconButton]');

      button?.click();

      expect(goBack).toHaveBeenCalledTimes(1);
    });

    it('should mirror its aria-label with a matching matTooltip', async () => {
      canGoBack.set(true);

      const fixture = await mount(BareHostComponent);
      const button = fixture.debugElement.query(By.css('button[matIconButton]'));
      const ariaLabel = button.nativeElement.getAttribute('aria-label');

      expect(ariaLabel).toBe('auth.common.back');
      expect(button.injector.get(MatTooltip).message).toBe(ariaLabel);
    });
  });

  describe('what the last attempt ended in', () => {
    it('should say nothing while there is nothing to say', async () => {
      await mount(BareHostComponent);

      expect(host.querySelector(ALERT)).toBeNull();
    });

    it('should show a failure as an error and give it the focus', async () => {
      const fixture = await mount(BareHostComponent);

      fixture.componentInstance.error.set({ title: 'error.title', body: 'error.body' });
      await fixture.whenStable();

      const alert = host.querySelector<HTMLElement>(ALERT);

      expect(alert?.classList).toContain('plastik-alert--error');
      expect(textOf(`${ALERT} [alert-title]`)).toBe('error.title');
      expect(textOf(`${ALERT} [alert-subtitle]`)).toBe('error.body');
      expect(document.activeElement).toBe(alert);
    });

    it('should keep the kind a failure brings with it', async () => {
      const fixture = await mount(BareHostComponent);

      fixture.componentInstance.error.set({ type: 'WARNING', title: 'error.title' });
      await fixture.whenStable();

      expect(host.querySelector(ALERT)?.classList).toContain('plastik-alert--warning');
      expect(host.querySelector(`${ALERT} [alert-subtitle]`)).toBeNull();
    });

    it('should offer the way out a failure brings with it', async () => {
      const fixture = await mount(BareHostComponent);

      fixture.componentInstance.error.set({
        title: 'error.title',
        link: { label: 'error.again', route: '/again' },
      });
      await fixture.whenStable();

      const link = host.querySelector(`${ALERT} a`);

      expect(link?.textContent?.trim()).toBe('error.again');
      expect(link?.getAttribute('href')).toBe('/again');
    });

    it('should show a good end as a success, without taking the focus', async () => {
      const fixture = await mount(BareHostComponent);

      fixture.componentInstance.success.set({ title: 'success.title' });
      await fixture.whenStable();

      const alert = host.querySelector(ALERT);

      expect(alert?.classList).toContain('plastik-alert--success');
      expect(document.activeElement).not.toBe(alert);
    });

    it('should show the failure when both are set, and take it away when it is cleared', async () => {
      const fixture = await mount(BareHostComponent);

      fixture.componentInstance.success.set({ title: 'success.title' });
      fixture.componentInstance.error.set({ title: 'error.title' });
      await fixture.whenStable();

      expect(textOf(`${ALERT} [alert-title]`)).toBe('error.title');

      fixture.componentInstance.error.set(null);
      fixture.componentInstance.success.set(null);
      await fixture.whenStable();

      expect(host.querySelector(ALERT)).toBeNull();
    });
  });

  describe('the body of the view', () => {
    it('should project the heading, the description and the content of the view', async () => {
      await mount(ProjectingHostComponent, { hasFacade: true });

      expect(textOf('h2')).toBe('Heading of the view');
      expect(textOf('mat-card-content > p')).toBe('What the view is for');
      expect(textOf('.projected')).toBe('Projected body');
      // A view that projects its content does not get the form of the facade as well.
      expect(host.querySelector(FORM)).toBeNull();
    });

    it('should draw the form of the facade, with its links, when the view projects nothing', async () => {
      await mount(BareHostComponent, { hasFacade: true });

      expect(host.querySelector(FORM)).not.toBeNull();
      expect(textOf(`${FORM} .extra-links a`)).toBe('auth.login.recoverAccess');
      expect(host.querySelector(`${FORM} .extra-links a`)?.getAttribute('href')).toBe('/recover');
    });

    it('should draw no form without a facade', async () => {
      await mount(BareHostComponent);

      expect(host.querySelector(FORM)).toBeNull();
    });

    it('should have the facade forget its failure when the screen goes away', async () => {
      const fixture = await mount(ProjectingHostComponent, { hasFacade: true });

      expect(facade.clearError).not.toHaveBeenCalled();

      fixture.destroy();

      expect(facade.clearError).toHaveBeenCalledTimes(1);
    });
  });

  describe('where the flow of the view ended', () => {
    const end: AuthFormMessage = {
      type: 'ERROR',
      title: 'end.title',
      body: 'end.body',
      link: { label: 'end.next', route: '/next' },
    };

    it('should draw a heading, a sentence and one filled link in place of the heading of the view', async () => {
      const fixture = await mount(ProjectingHostComponent);

      expect(host.querySelector(OUTCOME)).toBeNull();

      fixture.componentInstance.outcome.set(end);
      await fixture.whenStable();

      expect(host.querySelectorAll('h2')).toHaveLength(1);
      expect(textOf('h2')).toBe('end.title');
      expect(textOf(`${OUTCOME} p`)).toBe('end.body');
      expect(textOf(OUTCOME_LINK)).toBe('end.next');
      expect(host.querySelector(OUTCOME_LINK)?.getAttribute('href')).toBe('/next');
      expect(host.textContent).not.toContain('What the view is for');
    });

    it('should be a group named by its heading and described by its sentence', async () => {
      const fixture = await mount(ProjectingHostComponent);

      fixture.componentInstance.outcome.set(end);
      await fixture.whenStable();

      const panel = host.querySelector(OUTCOME);
      const named = panel?.getAttribute('aria-labelledby') ?? '';
      const described = panel?.getAttribute('aria-describedby') ?? '';

      expect(host.querySelector(`#${named}`)?.textContent).toContain('end.title');
      expect(host.querySelector(`#${described}`)?.textContent).toContain('end.body');
    });

    it('should take the focus when it appears', async () => {
      const fixture = await mount(ProjectingHostComponent);

      fixture.componentInstance.outcome.set(end);
      await fixture.whenStable();

      expect(document.activeElement).toBe(host.querySelector(OUTCOME));
    });

    it('should draw no notice, whatever kind the end carries and whatever the last attempt said', async () => {
      const fixture = await mount(ProjectingHostComponent);

      fixture.componentInstance.error.set({ title: 'error.title' });
      fixture.componentInstance.outcome.set(end);
      await fixture.whenStable();

      expect(host.querySelector(ALERT)).toBeNull();
    });

    it('should still draw what the view projects as its content', async () => {
      const fixture = await mount(ProjectingHostComponent);

      fixture.componentInstance.outcome.set(end);
      await fixture.whenStable();

      expect(textOf('.projected')).toBe('Projected body');
    });

    it('should do with a heading alone', async () => {
      const fixture = await mount(ProjectingHostComponent);

      fixture.componentInstance.outcome.set({ title: 'end.title' });
      await fixture.whenStable();

      const panel = host.querySelector(OUTCOME);

      expect(panel?.querySelector('p')).toBeNull();
      expect(panel?.querySelector('a')).toBeNull();
      expect(panel?.hasAttribute('aria-describedby')).toBe(false);
    });

    it('should give the heading of the view back when the end is taken away', async () => {
      const fixture = await mount(ProjectingHostComponent);

      fixture.componentInstance.outcome.set(end);
      await fixture.whenStable();
      fixture.componentInstance.outcome.set(null);
      await fixture.whenStable();

      expect(host.querySelector(OUTCOME)).toBeNull();
      expect(textOf('h2')).toBe('Heading of the view');
      expect(textOf('mat-card-content > p')).toBe('What the view is for');
    });
  });

  describe('accessibility', () => {
    it('should have no violations where a flow ended', async () => {
      const fixture = await mount(ProjectingHostComponent);

      fixture.componentInstance.outcome.set({
        title: 'end.title',
        body: 'end.body',
        link: { label: 'end.next', route: '/next' },
      });
      await fixture.whenStable();

      expect(host.querySelector(OUTCOME)).not.toBeNull();
      expect(await axe(host)).toHaveNoViolations();
    });

    it('should have no violations, with and without a notice', async () => {
      const fixture = await mount(ProjectingHostComponent);

      expect(await axe(host)).toHaveNoViolations();

      fixture.componentInstance.error.set({ title: 'error.title', body: 'error.body' });
      await fixture.whenStable();

      expect(host.querySelector(ALERT)).not.toBeNull();
      expect(await axe(host)).toHaveNoViolations();
    });
  });
});
