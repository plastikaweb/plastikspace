import { IMAGE_LOADER } from '@angular/common';
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_FORM_FACADE, AUTH_LOGIN_ERRORS, AuthFormMessage } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { NavigationService } from '@plastik/core/router-state';
import { PwaNavigationService } from '@plastik/eco-store/shared/utils';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { EcoStoreAuthLoginComponent } from './eco-store-auth-login.component';

describe('EcoStoreAuthLoginComponent', () => {
  let component: EcoStoreAuthLoginComponent;
  let fixture: ComponentFixture<EcoStoreAuthLoginComponent>;
  let navigationService: NavigationService;

  const authFacadeMock = {
    formConfig: {
      getConfig: () => [],
      getSubmitFormConfig: () => ({}),
    },
    error: signal<AuthFormMessage | null>(null),
    onSubmit: vi.fn(),
    clearError: vi.fn(),
  };

  const navigationServiceMock = {
    back: vi.fn(),
  };

  const pwaNavigationServiceMock = {
    isStandalone: signal(false),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreAuthLoginComponent, TranslateModule.forRoot(), FormlyModule.forRoot()],
      providers: [
        provideEnvironmentPocketBaseTranslationMock(),
        provideRouter([]),
        { provide: AUTH_FORM_FACADE, useValue: authFacadeMock },
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
        { provide: NavigationService, useValue: navigationServiceMock },
        { provide: PwaNavigationService, useValue: pwaNavigationServiceMock },
        { provide: IMAGE_LOADER, useValue: (src: string) => src },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreAuthLoginComponent);
    component = fixture.componentInstance;
    navigationService = TestBed.inject(NavigationService);
    fixture.detectChanges();
  });

  afterEach(() => authFacadeMock.error.set(null));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show no notice before an attempt', () => {
    expect(fixture.nativeElement.querySelector('plastik-shared-alert')).toBeNull();
  });

  it('should say on the screen why an attempt failed', async () => {
    authFacadeMock.error.set(AUTH_LOGIN_ERRORS.wrong);
    await fixture.whenStable();

    const alert: HTMLElement | null = fixture.nativeElement.querySelector('plastik-shared-alert');

    expect(alert?.getAttribute('role')).toBe('alert');
    expect(alert?.classList).toContain('plastik-alert--error');
    expect(alert?.textContent).toContain('auth.login.error.wrong.title');
    expect(alert?.textContent).toContain('auth.login.error.wrong.body');
  });

  it('should have the facade forget the failure when the screen goes away', () => {
    authFacadeMock.clearError.mockClear();

    fixture.destroy();

    expect(authFacadeMock.clearError).toHaveBeenCalledTimes(1);
  });

  describe('the way in for a visitor who is not a member yet', () => {
    const tenant = mockEcoStoreTenantStore.tenant as unknown as WritableSignal<
      Record<string, unknown>
    >;
    const original = tenant();
    const joinLink = (): HTMLAnchorElement | null =>
      fixture.nativeElement.querySelector('a[href^="mailto:"]');

    afterEach(() => tenant.set(original));

    it('is not offered while the cooperative has no address', () => {
      expect(joinLink()).toBeNull();
      expect(fixture.nativeElement.textContent).not.toContain('auth.login.join.question');
    });

    it('offers the address of the cooperative, with the subject filled in', () => {
      tenant.set({ ...original, email: ' hola@el-llevat.test ' });
      fixture.detectChanges();

      const link = joinLink();

      expect(link?.getAttribute('href')).toBe(
        'mailto:hola@el-llevat.test?subject=auth.login.join.subject'
      );
      expect(link?.textContent).toContain('hola@el-llevat.test');
      expect(link?.querySelector('mat-icon')?.getAttribute('aria-hidden')).toBe('true');
      expect(fixture.nativeElement.textContent).toContain('auth.login.join.question');
      expect(fixture.nativeElement.textContent).toContain('auth.login.join.invite');
    });

    it('offers no way to register: PRV-05b brings it', () => {
      tenant.set({ ...original, email: 'hola@el-llevat.test' });
      fixture.detectChanges();

      const hrefs = Array.from(
        fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>
      ).map(link => link.getAttribute('href'));

      expect(hrefs).toEqual(['/recuperar-contrasenya', expect.stringMatching(/^mailto:/)]);
    });
  });
});
