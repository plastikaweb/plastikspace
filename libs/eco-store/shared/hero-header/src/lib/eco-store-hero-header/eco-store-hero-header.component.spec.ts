import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect } from 'vitest';
import { axe } from 'vitest-axe';
import * as axeMatchers from 'vitest-axe/matchers';
import { EcoStoreHeroHeaderComponent } from './eco-store-hero-header.component';

expect.extend(axeMatchers);

describe('EcoStoreHeroHeaderComponent', () => {
  let component: EcoStoreHeroHeaderComponent;
  let fixture: ComponentFixture<EcoStoreHeroHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreHeroHeaderComponent],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreHeroHeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render subtitle row when icon and subtitle are empty', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.debugElement.query(By.css('.category-subtitle'))).toBeNull();
  });

  it('should render the subtitle row with icon and text when provided', async () => {
    fixture.componentRef.setInput('icon', 'receipt_long');
    fixture.componentRef.setInput('subtitle', '3 orders');
    fixture.detectChanges();
    await fixture.whenStable();

    const subtitle = fixture.debugElement.query(By.css('.category-subtitle'));

    expect(subtitle).toBeTruthy();
    expect(subtitle.nativeElement.textContent).toContain('receipt_long');
    expect(subtitle.nativeElement.textContent).toContain('3 orders');
  });

  it('should render the title in an h2 when provided', async () => {
    fixture.componentRef.setInput('title', 'My Orders');
    fixture.detectChanges();
    await fixture.whenStable();

    const heading = fixture.debugElement.query(By.css('h2'));

    expect(heading).toBeTruthy();
    expect(heading.nativeElement.textContent.trim()).toBe('My Orders');
  });

  it('should not render the title row when title is empty', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.debugElement.query(By.css('h2'))).toBeNull();
  });

  it('should apply the compact modifier class when compact input is true', async () => {
    fixture.componentRef.setInput('compact', true);
    fixture.detectChanges();
    await fixture.whenStable();

    const header = fixture.debugElement.query(By.css('header'));

    expect(header.nativeElement.classList.contains('hero-header--compact')).toBe(true);
  });

  it('should toggle the reveal-up class via disableReveal input', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const header = fixture.debugElement.query(By.css('header'));

    expect(header.nativeElement.classList.contains('reveal-up')).toBe(true);

    fixture.componentRef.setInput('disableReveal', true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(header.nativeElement.classList.contains('reveal-up')).toBe(false);
  });

  it('should set the --delay CSS variable from revealDelay', async () => {
    fixture.componentRef.setInput('revealDelay', '120ms');
    fixture.detectChanges();
    await fixture.whenStable();

    const header = fixture.debugElement.query(By.css('header'));

    expect(header.nativeElement.style.getPropertyValue('--delay')).toBe('120ms');
  });

  it('should apply a header role attribute when headerRole is set', async () => {
    fixture.componentRef.setInput('headerRole', 'presentation');
    fixture.detectChanges();
    await fixture.whenStable();

    const header = fixture.debugElement.query(By.css('header'));

    expect(header.nativeElement.getAttribute('role')).toBe('presentation');
  });

  it('should project default content inside hero-content', async () => {
    @Component({
      imports: [EcoStoreHeroHeaderComponent],
      template: `
        <eco-store-hero-header>
          <div data-testId="extra">Extra content</div>
        </eco-store-hero-header>
      `,
    })
    class HostComponent {}

    const hostFixture = TestBed.createComponent(HostComponent);

    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const projected = hostFixture.debugElement.query(By.css('[data-testId="extra"]'));

    expect(projected).toBeTruthy();
    expect(projected.nativeElement.closest('.hero-content')).toBeTruthy();
  });

  it('should project [heroAction] content next to the title', async () => {
    @Component({
      imports: [EcoStoreHeroHeaderComponent],
      template: `
        <eco-store-hero-header title="Title with action">
          <button heroAction data-testId="action">Action</button>
        </eco-store-hero-header>
      `,
    })
    class HostComponent {}

    const hostFixture = TestBed.createComponent(HostComponent);

    hostFixture.detectChanges();
    await hostFixture.whenStable();

    const action = hostFixture.debugElement.query(By.css('[data-testId="action"]'));

    expect(action).toBeTruthy();
    const titleRow = action.nativeElement.parentElement;

    expect(titleRow.querySelector('h2')).toBeTruthy();
  });

  it('should be accessible when rendered with title and subtitle', async () => {
    fixture.componentRef.setInput('icon', 'storefront');
    fixture.componentRef.setInput('subtitle', '5 products');
    fixture.componentRef.setInput('title', 'Catalog');
    fixture.detectChanges();
    await fixture.whenStable();

    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  });
});
