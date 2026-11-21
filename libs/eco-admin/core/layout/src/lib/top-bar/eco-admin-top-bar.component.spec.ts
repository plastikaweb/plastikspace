import { OverlayContainer } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { PocketBaseUser } from '@plastik/core/entities';
import { POCKETBASE_WITH_TRANSLATION_ENVIRONMENT } from '@plastik/core/environments';
import { ecoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context';
import { mockEcoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context/testing';
import { LanguageSwitcherService } from '@plastik/shared/translation';
import { axe } from 'vitest-axe';

import { EcoAdminTopBarComponent } from './eco-admin-top-bar.component';

describe('EcoAdminTopBarComponent', () => {
  let fixture: ComponentFixture<EcoAdminTopBarComponent>;
  let host: HTMLElement;
  let overlay: HTMLElement;
  const updateLanguage = vi.fn().mockResolvedValue(true);

  const openAccountMenu = async (): Promise<void> => {
    host.querySelector<HTMLButtonElement>('.top-bar-account')?.click();
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    mockPocketBaseUserProfileStore.user.set({
      id: 'user-1',
      name: 'Marta Puig Soler',
      role: 'TENANT_ADMIN',
    } as PocketBaseUser);
    mockEcoAdminTenantContextStore.tenantName.set('El Llevat');
    mockPocketBaseUserProfileStore.logout.mockReset();
    updateLanguage.mockClear();

    await TestBed.configureTestingModule({
      imports: [EcoAdminTopBarComponent],
      providers: [
        provideRouter([]),
        provideTranslateService(),
        {
          provide: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT,
          useValue: { languages: ['ca', 'es'], defaultLanguage: 'ca' },
        },
        {
          provide: pocketBaseUserProfileStore,
          useValue: { ...mockPocketBaseUserProfileStore, updateLanguage },
        },
        { provide: ecoAdminTenantContextStore, useValue: mockEcoAdminTenantContextStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoAdminTopBarComponent);
    host = fixture.nativeElement;
    overlay = TestBed.inject(OverlayContainer).getContainerElement();
    fixture.componentRef.setInput('titleKey', 'shell.nav.socis');
    fixture.detectChanges();
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.user.set(null);
    mockEcoAdminTenantContextStore.tenantName.set('');
  });

  it("titles the bar with the view's rail label", () => {
    expect(host.querySelector('.top-bar-title')?.textContent).toContain('shell.nav.socis');
  });

  it("draws the account button with the user's two initials", () => {
    const account = host.querySelector('.top-bar-account');

    expect(account?.textContent?.trim()).toBe('MP');
    expect(account?.getAttribute('aria-label')).toBe('shell.account.menuLabelNamed');
  });

  it('names the user, the role and the tenant in the account menu', async () => {
    await openAccountMenu();

    expect(overlay.textContent).toContain('Marta Puig Soler');
    expect(overlay.textContent).toContain('shell.account.role.TENANT_ADMIN');
    expect(overlay.textContent).toContain('El Llevat');
  });

  it('closes the session from the account menu and goes back to the login screen', async () => {
    const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);

    await openAccountMenu();
    overlay.querySelector<HTMLButtonElement>('[mat-menu-item]')?.click();

    expect(mockPocketBaseUserProfileStore.logout).toHaveBeenCalledTimes(1);
    expect(navigateByUrl).toHaveBeenCalledWith('/accedir');
  });

  it('switches the language, remembers it and stores it on the user', () => {
    const use = vi.spyOn(TestBed.inject(TranslateService), 'use');
    const save = vi.spyOn(TestBed.inject(LanguageSwitcherService), 'save');

    (
      fixture.componentInstance as unknown as { onLanguageChange(lang: string): void }
    ).onLanguageChange('es');

    expect(use).toHaveBeenCalledWith('es');
    expect(save).toHaveBeenCalledWith('es');
    expect(updateLanguage).toHaveBeenCalledWith('es');
  });

  it('names no tenant in the account menu of the platform bar', async () => {
    fixture.componentRef.setInput('variant', 'platform');
    fixture.detectChanges();
    await openAccountMenu();

    expect(overlay.textContent).toContain('shell.account.role.GLOBAL_ADMIN');
    expect(overlay.textContent).not.toContain('El Llevat');
  });

  it('has no accessibility violations', async () => {
    expect(await axe(host)).toHaveNoViolations();
  });
});
