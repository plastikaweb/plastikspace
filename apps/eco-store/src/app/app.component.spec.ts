import { DOCUMENT } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { POCKETBASE_WITH_TRANSLATION_ENVIRONMENT } from '@plastik/core/environments';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideEnvironmentPocketBaseTranslationMock(),
        provideRouter([]),
        provideTranslateService(),
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
      ],
    }).compileComponents();
  });

  const setup = () => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create the app', () => {
    setup();
    expect(component).toBeTruthy();
  });

  it('should add preconnect link to the head', () => {
    const document = TestBed.inject(DOCUMENT);
    const env = TestBed.inject(POCKETBASE_WITH_TRANSLATION_ENVIRONMENT);

    // Initial check: if it was already added by a previous test or run, remove it
    const existing = Array.from(
      document.head.querySelectorAll(`link[rel="preconnect"][href="${env.baseApiUrl}"]`)
    );
    existing.forEach(el => el.remove());

    setup();

    const preconnectLinks = Array.from(document.head.querySelectorAll('link[rel="preconnect"]'));
    const preconnectExists = preconnectLinks.some(
      link => link.getAttribute('href') === env.baseApiUrl
    );
    expect(preconnectExists).toBeTruthy();
  });

  it('should register eco_logo SVG icon', () => {
    const iconRegistry = TestBed.inject(MatIconRegistry);
    const spy = vi.spyOn(iconRegistry, 'addSvgIconLiteral');

    setup();

    expect(spy).toHaveBeenCalledWith('eco_logo', expect.anything());
  });

  it('should have no accessibility violations', async () => {
    setup();
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  });
});
