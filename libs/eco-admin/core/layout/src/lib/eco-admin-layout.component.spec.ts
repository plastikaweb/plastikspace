import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MATERIAL_ANIMATIONS } from '@angular/material/core';
import { MatSidenav } from '@angular/material/sidenav';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { PocketBaseUser } from '@plastik/core/entities';
import { POCKETBASE_WITH_TRANSLATION_ENVIRONMENT } from '@plastik/core/environments';
import { ecoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context';
import { mockEcoAdminTenantContextStore } from '@plastik/eco-admin/tenant-context/testing';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { axe } from 'vitest-axe';

import { EcoAdminLayoutComponent } from './eco-admin-layout.component';

@Component({ template: '<h1>Vista</h1>' })
class BlankComponent {}

describe('EcoAdminLayoutComponent', () => {
  let fixture: ComponentFixture<EcoAdminLayoutComponent>;
  let host: HTMLElement;
  let ample$: BehaviorSubject<BreakpointState>;

  const rail = (): HTMLElement => host.querySelector('#eco-admin-nav') as HTMLElement;
  const drawer = (): HTMLElement => host.querySelector('mat-sidenav') as HTMLElement;
  const menuButton = (): HTMLButtonElement =>
    host.querySelector<HTMLButtonElement>('#eco-admin-nav button.nav-head') as HTMLButtonElement;
  const isDrawerOpen = (): boolean => drawer().classList.contains('mat-drawer-opened');

  // Material reports a close through `openedChange`, asynchronously: check the view again after it.
  const settle = async (): Promise<void> => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  const render = async (ample: boolean): Promise<void> => {
    ample$.next({ matches: ample, breakpoints: {} });
    fixture = TestBed.createComponent(EcoAdminLayoutComponent);
    host = fixture.nativeElement;
    await TestBed.inject(Router).navigateByUrl('/tauler');
    await settle();
  };

  beforeEach(async () => {
    localStorage.clear();
    ample$ = new BehaviorSubject<BreakpointState>({ matches: true, breakpoints: {} });
    mockPocketBaseUserProfileStore.user.set({
      id: 'user-1',
      name: 'Marta Puig',
      role: 'TENANT_ADMIN',
    } as PocketBaseUser);
    mockPocketBaseUserProfileStore.isGlobalAdmin.set(false);
    mockEcoAdminTenantContextStore.tenantName.set('El Llevat');

    await TestBed.configureTestingModule({
      imports: [EcoAdminLayoutComponent],
      providers: [
        provideRouter([
          { path: 'tauler', component: BlankComponent, title: 'shell.nav.tauler' },
          { path: 'socis', component: BlankComponent, title: 'shell.nav.socis' },
        ]),
        provideTranslateService(),
        { provide: MATERIAL_ANIMATIONS, useValue: { animationsDisabled: true } },
        {
          provide: POCKETBASE_WITH_TRANSLATION_ENVIRONMENT,
          useValue: { languages: ['ca', 'es'], defaultLanguage: 'ca' },
        },
        {
          provide: pocketBaseUserProfileStore,
          useValue: { ...mockPocketBaseUserProfileStore, updateLanguage: vi.fn() },
        },
        { provide: ecoAdminTenantContextStore, useValue: mockEcoAdminTenantContextStore },
        { provide: BreakpointObserver, useValue: { observe: () => ample$.asObservable() } },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    mockPocketBaseUserProfileStore.user.set(null);
    mockPocketBaseUserProfileStore.isGlobalAdmin.set(false);
    mockEcoAdminTenantContextStore.tenantName.set('');
  });

  it('renders the routed view inside the main landmark the skip link jumps to', async () => {
    await render(true);

    const main = host.querySelector('main');

    expect(main?.id).toBe('mainContent');
    expect(main?.getAttribute('tabindex')).toBe('-1');
    expect(main?.querySelector('h1')?.textContent).toBe('Vista');
  });

  it("titles the top bar with the current route's label", async () => {
    await render(true);
    expect(host.querySelector('.top-bar-title')?.textContent).toContain('shell.nav.tauler');

    await TestBed.inject(Router).navigateByUrl('/socis');
    await settle();

    expect(host.querySelector('.top-bar-title')?.textContent).toContain('shell.nav.socis');
  });

  it("heads the rail with the tenant's name", async () => {
    await render(true);

    expect(rail().textContent).toContain('El Llevat');
  });

  describe('AMPLE', () => {
    it('folds the rail to icons with its header, the «menu» button, and expands it again', async () => {
      await render(true);
      expect(rail().classList).not.toContain('is-rail');
      expect(menuButton().getAttribute('aria-expanded')).toBe('true');
      expect(menuButton().getAttribute('aria-controls')).toBe('eco-admin-nav');
      expect(menuButton().getAttribute('aria-label')).toBe(
        'El Llevat, Eco Admin, shell.nav.foldMenu'
      );

      menuButton().click();
      await settle();

      expect(rail().classList).toContain('is-rail');
      expect(menuButton().getAttribute('aria-expanded')).toBe('false');
      expect(menuButton().getAttribute('aria-label')).toBe('shell.nav.unfoldMenu');
      expect(isDrawerOpen()).toBe(false);

      menuButton().click();
      await settle();

      expect(rail().classList).not.toContain('is-rail');
    });

    it('has no accessibility violations', async () => {
      await render(true);

      expect(await axe(host)).toHaveNoViolations();
    });
  });

  describe('PLEGAT', () => {
    const openDrawer = async (): Promise<void> => {
      await render(false);
      menuButton().focus();
      menuButton().click();
      await settle();
    };

    it('keeps the rail folded and opens the drawer as a modal dialog', async () => {
      await render(false);
      expect(rail().classList).toContain('is-rail');
      expect(menuButton().getAttribute('aria-expanded')).toBe('false');
      expect(menuButton().hasAttribute('aria-controls')).toBe(false);

      menuButton().click();
      await settle();

      expect(isDrawerOpen()).toBe(true);
      expect(drawer().getAttribute('role')).toBe('dialog');
      expect(drawer().getAttribute('aria-modal')).toBe('true');
      expect(drawer().getAttribute('aria-label')).toBe('shell.nav.drawerLabel');
      expect(menuButton().getAttribute('aria-controls')).toBe(drawer().id);
    });

    it('closes the drawer with Escape, through Material, and gives the focus back to «menu»', async () => {
      await openDrawer();

      const closed = firstValueFrom(
        fixture.debugElement.query(By.directive(MatSidenav)).componentInstance.openedChange
      );

      drawer().dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true })
      );
      expect(await closed).toBe(false);
      fixture.detectChanges();

      expect(isDrawerOpen()).toBe(false);
      expect(menuButton().getAttribute('aria-expanded')).toBe('false');
      expect(document.activeElement).toBe(menuButton());
    });

    it('closes the drawer from the scrim and from its close button', async () => {
      await openDrawer();
      host.querySelector<HTMLElement>('.mat-drawer-backdrop')?.click();
      await settle();
      expect(isDrawerOpen()).toBe(false);

      menuButton().click();
      await settle();
      drawer().querySelector<HTMLButtonElement>('.nav-close')?.click();
      await settle();
      expect(isDrawerOpen()).toBe(false);
    });

    it('closes the drawer with a swipe to the left of 80px', async () => {
      await openDrawer();

      const at = (type: string, clientX: number): Event => {
        const event = new Event(type, { bubbles: true });

        Object.defineProperty(event, 'touches', {
          value: type === 'touchend' ? [] : [{ clientX, clientY: 300 }],
        });

        return event;
      };

      drawer().dispatchEvent(at('touchstart', 250));
      drawer().dispatchEvent(at('touchmove', 160));
      drawer().dispatchEvent(at('touchend', 160));
      await settle();

      expect(isDrawerOpen()).toBe(false);
    });

    it('closes the drawer when one of its entries navigates', async () => {
      await openDrawer();

      await TestBed.inject(Router).navigateByUrl('/socis');
      await settle();

      expect(isDrawerOpen()).toBe(false);
    });

    it('has no accessibility violations with the drawer open', async () => {
      await openDrawer();

      expect(await axe(host)).toHaveNoViolations();
    });
  });

  it("gives a global administrator the platform's rail", async () => {
    mockPocketBaseUserProfileStore.isGlobalAdmin.set(true);
    await render(true);

    expect(rail().classList).toContain('is-platform');
    expect(rail().textContent).toContain('Eco Platform');
    expect(rail().textContent).toContain('shell.nav.platformRole');
    expect(host.querySelector('.top-bar')?.textContent).not.toContain('platformChip');
  });
});
