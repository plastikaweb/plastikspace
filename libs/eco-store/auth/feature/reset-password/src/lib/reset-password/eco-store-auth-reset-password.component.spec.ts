import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { provideTranslateService } from '@ngx-translate/core';
import {
  AUTH_FORM_FACADE,
  AUTH_RESET_PASSWORD_MESSAGES,
  AuthFormMessage,
} from '@plastik/auth/entities';
import { NavigationService } from '@plastik/core/router-state';
import { PwaNavigationService } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';

import { EcoStoreAuthResetPasswordComponent } from './eco-store-auth-reset-password.component';

const ALERT = 'plastik-shared-alert';
const FORM = 'plastik-shared-form-feature';
const BACK = '[content] > a[href="/accedir"]';
const OUTCOME = '[role="group"]';
const NEXT = `${OUTCOME} a.mat-mdc-unelevated-button`;

describe('EcoStoreAuthResetPasswordComponent', () => {
  const error = signal<AuthFormMessage | null>(null);
  const success = signal<AuthFormMessage | null>(null);
  const canSubmit = signal(true);
  const clearError = vi.fn();
  let component: EcoStoreAuthResetPasswordComponent;
  let fixture: ComponentFixture<EcoStoreAuthResetPasswordComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    error.set(null);
    success.set(null);
    canSubmit.set(true);
    clearError.mockReset();

    await TestBed.configureTestingModule({
      imports: [EcoStoreAuthResetPasswordComponent, FormlyModule.forRoot()],
      providers: [
        provideTranslateService(),
        provideRouter([]),
        {
          provide: AUTH_FORM_FACADE,
          useValue: {
            formConfig: {
              getConfig: vi.fn(() => []),
              getSubmitFormConfig: vi.fn(() => ({})),
            },
            onSubmit: vi.fn(),
            isLoading: vi.fn(() => false),
            error,
            success,
            canSubmit,
            clearError,
          },
        },
        {
          provide: ecoStoreTenantStore,
          useValue: {
            tenant: vi.fn(() => ({})),
          },
        },
        {
          provide: NavigationService,
          useValue: { back: vi.fn() },
        },
        {
          provide: PwaNavigationService,
          useValue: { isStandalone: vi.fn(() => false) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreAuthResetPasswordComponent);
    component = fixture.componentInstance;
    host = fixture.nativeElement;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the form and no notice while there is nothing to report', () => {
    expect(host.querySelector(FORM)).not.toBeNull();
    expect(host.querySelector(ALERT)).toBeNull();
    expect(host.querySelector(OUTCOME)).toBeNull();
    expect(host.querySelector('h2')?.textContent).toContain('auth.resetPassword.title');
  });

  it('offers the way back to the login screen under the form', () => {
    const back = host.querySelector(BACK);

    expect(back?.textContent).toContain('auth.forgotPassword.backToLogin');
    expect(back?.querySelector('mat-icon')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('says that the link no longer works in place of the heading, without the form', async () => {
    error.set(AUTH_RESET_PASSWORD_MESSAGES.expired);
    canSubmit.set(false);
    await fixture.whenStable();

    const panel = host.querySelector(OUTCOME);

    expect(host.querySelectorAll('h2')).toHaveLength(1);
    expect(host.querySelector('h2')?.textContent).toContain('auth.resetPassword.expired.title');
    expect(panel?.textContent).toContain('auth.resetPassword.expired.description');
    expect(host.querySelector(NEXT)?.getAttribute('href')).toBe('/recuperar-contrasenya');
    expect(document.activeElement).toBe(panel);
    expect(host.querySelector(ALERT)).toBeNull();
    expect(host.querySelector(FORM)).toBeNull();
    expect(host.querySelector(BACK)).not.toBeNull();
  });

  it('says that the password was changed in place of the heading, and offers the login screen alone', async () => {
    success.set(AUTH_RESET_PASSWORD_MESSAGES.done);
    canSubmit.set(false);
    await fixture.whenStable();

    const panel = host.querySelector(OUTCOME);

    expect(host.querySelector('h2')?.textContent).toContain('auth.resetPassword.done.title');
    expect(panel?.textContent).toContain('auth.resetPassword.done.description');
    expect(host.querySelector(NEXT)?.getAttribute('href')).toBe('/accedir');
    expect(document.activeElement).toBe(panel);
    expect(host.querySelector(ALERT)).toBeNull();
    expect(host.querySelector(FORM)).toBeNull();
    expect(host.querySelector(BACK)).toBeNull();
  });

  it('forgets how the attempt ended when the screen goes away', () => {
    fixture.destroy();

    expect(clearError).toHaveBeenCalled();
  });
});
