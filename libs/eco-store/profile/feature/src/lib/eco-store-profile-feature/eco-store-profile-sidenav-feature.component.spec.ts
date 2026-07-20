import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { EcoStoreProfileSidenavFeatureComponent } from './eco-store-profile-sidenav-feature.component';

/**
 * Finds the rendered `mat-list-item` whose text content includes the given label.
 * @param {HTMLElement} root - Root element to search within.
 * @param {string} label - Visible label text to look for.
 * @returns {HTMLElement | undefined} The matching item, if any.
 */
function findListItemByLabel(root: HTMLElement, label: string): HTMLElement | undefined {
  return Array.from(root.querySelectorAll('mat-list-item')).find(item =>
    item.textContent?.includes(label)
  ) as HTMLElement | undefined;
}

describe('EcoStoreProfileSidenavFeatureComponent', () => {
  let fixture: ComponentFixture<EcoStoreProfileSidenavFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileSidenavFeatureComponent],
      providers: [
        provideTranslateService(),
        provideRouter([]),
        {
          provide: ecoStoreTenantStore,
          useValue: mockEcoStoreTenantStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProfileSidenavFeatureComponent);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('does not show the fiscal data item when the tenant flag is off', () => {
    fixture.detectChanges();

    expect(findListItemByLabel(fixture.nativeElement, 'Dades fiscals')).toBeUndefined();
  });

  it('shows the fiscal data item when the tenant flag is on', () => {
    TestBed.resetTestingModule();
    const tenantStoreStub = {
      ...mockEcoStoreTenantStore,
      tenant: signal({ ...mockEcoStoreTenantStore.tenant(), fiscalDataEnabled: true }),
    };

    TestBed.configureTestingModule({
      imports: [EcoStoreProfileSidenavFeatureComponent],
      providers: [
        provideTranslateService(),
        provideRouter([]),
        {
          provide: ecoStoreTenantStore,
          useValue: tenantStoreStub,
        },
      ],
    });

    const localFixture = TestBed.createComponent(EcoStoreProfileSidenavFeatureComponent);
    localFixture.detectChanges();

    expect(findListItemByLabel(localFixture.nativeElement, 'Dades fiscals')).toBeTruthy();
  });
});
