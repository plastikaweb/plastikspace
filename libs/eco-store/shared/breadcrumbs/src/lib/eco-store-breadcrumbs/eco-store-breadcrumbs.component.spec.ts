import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatTooltip } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as axeMatchers from 'vitest-axe/matchers';
import { BreadcrumbItem, EcoStoreBreadcrumbsComponent } from './eco-store-breadcrumbs.component';

/**
 * Extend Vitest matchers with axe matchers for accessibility testing.
 * This ensures that `toHaveNoViolations()` is available on `expect()`.
 */
expect.extend(axeMatchers);

describe('EcoStoreBreadcrumbsComponent', () => {
  let component: EcoStoreBreadcrumbsComponent;
  let fixture: ComponentFixture<EcoStoreBreadcrumbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreBreadcrumbsComponent],
      providers: [provideZonelessChangeDetection(), provideRouter([]), provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreBreadcrumbsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a list item for each breadcrumb item', async () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', routerLink: ['/'] },
      { label: 'Products', routerLink: ['/botiga'] },
      { label: 'Detail' },
    ];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    await fixture.whenStable();

    const listItems = fixture.debugElement.queryAll(By.css('li'));
    // +1 for the back button li
    expect(listItems.length).toBe(items.length + 1);
  });

  it('should render a link for items with routerLink', async () => {
    const items: BreadcrumbItem[] = [{ label: 'Home', routerLink: ['/'] }];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    await fixture.whenStable();

    const link = fixture.debugElement.query(By.css('a'));
    expect(link).toBeTruthy();
    expect(link.nativeElement.textContent).toContain('Home');
  });

  it('should render a span (no link) for the current page item', async () => {
    const items: BreadcrumbItem[] = [{ label: 'Current page' }];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    await fixture.whenStable();

    const span = fixture.debugElement.query(By.css('li > span'));
    expect(span).toBeTruthy();
    expect(span.nativeElement.textContent.trim()).toBe('Current page');
  });

  it('should render a skeleton placeholder when item.loading is true', async () => {
    const items: BreadcrumbItem[] = [{ loading: true, skeletonWidth: '4rem' }];
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    await fixture.whenStable();

    const skeleton = fixture.debugElement.query(By.css('[aria-hidden="true"].animate-pulse'));
    expect(skeleton).toBeTruthy();
  });

  it('should emit goBack when the back button is clicked', async () => {
    fixture.componentRef.setInput('backAriaLabel', 'Go back');
    fixture.detectChanges();
    await fixture.whenStable();

    const goBackSpy = vi.spyOn(component.goBack, 'emit');
    const button = fixture.debugElement.query(By.css('button[matIconButton]'));
    button.nativeElement.click();

    expect(goBackSpy).toHaveBeenCalledOnce();
  });

  it('should render a tooltip on the back button that matches backAriaLabel', async () => {
    const label = 'Tornar enrere';
    fixture.componentRef.setInput('backAriaLabel', label);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.debugElement.query(By.css('button[matIconButton]'));
    const tooltip = button.injector.get(MatTooltip);

    expect(tooltip.message).toBe(label);
  });

  it('should have no accessibility violations', async () => {
    const items: BreadcrumbItem[] = [{ label: 'Home', routerLink: ['/'] }, { label: 'Detail' }];
    fixture.componentRef.setInput('items', items);
    fixture.componentRef.setInput('backAriaLabel', 'Go back');
    fixture.detectChanges();
    await fixture.whenStable();

    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  }, 10000);
});
