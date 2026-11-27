import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ECO_ADMIN_PLATFORM_NAV, ECO_ADMIN_TENANT_NAV } from '@plastik/eco-admin/layout-config';
import { axe } from 'vitest-axe';

import { EcoAdminNavPanelComponent, EcoAdminNavLayer } from './eco-admin-nav-panel.component';

@Component({ template: '' })
class BlankComponent {}

describe('EcoAdminNavPanelComponent', () => {
  let fixture: ComponentFixture<EcoAdminNavPanelComponent>;
  let host: HTMLElement;

  const links = (): HTMLAnchorElement[] =>
    Array.from(host.querySelectorAll<HTMLAnchorElement>('a'));

  const render = async (
    layer: EcoAdminNavLayer = 'full',
    variant: 'tenant' | 'platform' = 'tenant'
  ): Promise<void> => {
    fixture.componentRef.setInput('layer', layer);
    fixture.componentRef.setInput('variant', variant);
    fixture.componentRef.setInput(
      'items',
      variant === 'platform' ? ECO_ADMIN_PLATFORM_NAV : ECO_ADMIN_TENANT_NAV
    );
    fixture.detectChanges();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoAdminNavPanelComponent],
      providers: [
        provideRouter([{ path: '**', component: BlankComponent }]),
        provideTranslateService(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoAdminNavPanelComponent);
    host = fixture.nativeElement;
    fixture.componentRef.setInput('heading', 'El Llevat');
    fixture.componentRef.setInput('subheading', 'Eco Admin');
  });

  it('links every entry to its route, inside a labelled navigation landmark', async () => {
    await render();

    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe('shell.nav.label');
    expect(links().map(link => link.getAttribute('href'))).toEqual(
      ECO_ADMIN_TENANT_NAV.map(entry => `/${entry.path}`)
    );
  });

  it('marks the entry of the current route as the current page', async () => {
    await TestBed.inject(Router).navigateByUrl('/socis');
    await render();

    const current = links().filter(link => link.getAttribute('aria-current') === 'page');

    expect(current).toHaveLength(1);
    expect(current[0].getAttribute('href')).toBe('/socis');
    expect(current[0].classList).toContain('is-active');
  });

  it('makes its header the «menu» button, named by what it shows and then by what it does', async () => {
    const toggled = vi.fn();

    fixture.componentInstance.menuToggled.subscribe(toggled);
    fixture.componentRef.setInput('menuControls', 'eco-admin-nav');
    await render('full');

    const head = host.querySelector<HTMLButtonElement>('button.nav-head');

    expect(head?.getAttribute('aria-label')).toBe('El Llevat, Eco Admin, shell.nav.foldMenu');
    expect(head?.getAttribute('aria-expanded')).toBe('true');
    expect(head?.getAttribute('aria-controls')).toBe('eco-admin-nav');

    head?.click();
    expect(toggled).toHaveBeenCalledTimes(1);
  });

  it('folded, keeps every label for assistive technology but not on screen', async () => {
    fixture.componentRef.setInput('menuExpanded', false);
    await render('rail');

    expect(host.classList).toContain('is-rail');
    expect(host.textContent).not.toContain('El Llevat');
    expect(host.querySelector('button.nav-head')?.getAttribute('aria-label')).toBe(
      'shell.nav.unfoldMenu'
    );
    for (const label of Array.from(host.querySelectorAll('.nav-label'))) {
      expect(label.classList).toContain('sr-only');
    }
  });

  it('as a drawer, offers a close button that asks to close', async () => {
    const closeRequested = vi.fn();

    fixture.componentInstance.closeRequested.subscribe(closeRequested);
    await render('drawer');

    const close = host.querySelector<HTMLButtonElement>('.nav-close');

    expect(host.querySelector('button.nav-head')).toBeNull();
    expect(host.querySelector('nav')?.getAttribute('aria-label')).toBe('shell.nav.drawerLabel');
    expect(close?.getAttribute('aria-label')).toBe('shell.nav.close');
    close?.click();
    expect(closeRequested).toHaveBeenCalledTimes(1);
  });

  it("draws the platform's rail with its mark and no scope note", async () => {
    await render('full', 'platform');

    expect(host.classList).toContain('is-platform');
    expect(host.querySelector('.nav-mark-icon')?.textContent).toBe('admin_panel_settings');
    expect(host.querySelector('.nav-scope')).toBeNull();
    expect(links()).toHaveLength(ECO_ADMIN_PLATFORM_NAV.length);
  });

  it.each<EcoAdminNavLayer>(['full', 'rail', 'drawer'])(
    'has no accessibility violations (%s)',
    async layer => {
      await render(layer);

      expect(await axe(host)).toHaveNoViolations();
    }
  );
});
