import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { AUTH_SCREEN_DEFAULTS } from '@plastik/auth/entities';
import { axe } from 'vitest-axe';

import { EcoAdminAuthForgotPasswordSentComponent } from './eco-admin-auth-forgot-password-sent.component';

describe('EcoAdminAuthForgotPasswordSentComponent', () => {
  let fixture: ComponentFixture<EcoAdminAuthForgotPasswordSentComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoAdminAuthForgotPasswordSentComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        // What `provideEcoAdminAuthScreen()` says once in the application, as far as this screen shows it.
        {
          provide: AUTH_SCREEN_DEFAULTS,
          useValue: { title: signal('Eco Admin'), icon: 'eco', cardClass: 'eco-shake-on-error' },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoAdminAuthForgotPasswordSentComponent);
    host = fixture.nativeElement;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('names the application and says the email is on its way', () => {
    expect(host.querySelector('h1')?.textContent).toContain('Eco Admin');
    expect(host.querySelector('h2')?.textContent).toContain('auth.forgotPasswordSent.title');
    expect(host.textContent).toContain('auth.forgotPasswordSent.description');
    expect(host.textContent).toContain('auth.forgotPasswordSent.checkSpam');
  });

  it('has no form: there is nothing left to send', () => {
    expect(host.querySelector('form')).toBeNull();
    expect(host.querySelector('plastik-shared-alert')).toBeNull();
  });

  it('offers the way back to the login screen', () => {
    const links = host.querySelectorAll<HTMLAnchorElement>('a[href="/accedir"]');

    expect(links).toHaveLength(1);
    expect(links[0].textContent).toContain('auth.forgotPasswordSent.backToLogin');
  });

  it('keeps its icons away from assistive technology', () => {
    const icons = host.querySelectorAll('[content] mat-icon');

    expect(icons).toHaveLength(2);
    icons.forEach(icon => expect(icon.getAttribute('aria-hidden')).toBe('true'));
  });

  it('has no accessibility violations', async () => {
    expect(await axe(host)).toHaveNoViolations();
  });
});
