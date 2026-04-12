import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { TrialBannerComponent } from './trial-banner.component';

describe('TrialBannerComponent', () => {
  let component: TrialBannerComponent;
  let fixture: ComponentFixture<TrialBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrialBannerComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(TrialBannerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit becomeMember when button is clicked', () => {
    const spy = vi.spyOn(component.becomeMember, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should have is-expired class if trial has expired', () => {
    fixture.componentRef.setInput('trialEndsAt', new Date(Date.now() - 1000));
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('is-expired')).toBe(true);
  });

  it('should not have is-expired class if trial is active', () => {
    fixture.componentRef.setInput('trialEndsAt', new Date(Date.now() + 1000000));
    fixture.detectChanges();
    expect(fixture.nativeElement.classList.contains('is-expired')).toBe(false);
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  }, 30000);
});
