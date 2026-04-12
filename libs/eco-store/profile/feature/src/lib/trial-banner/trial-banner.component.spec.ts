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
    fixture.componentRef.setInput('trialEndsAt', new Date(Date.now() + 1000000));
    fixture.detectChanges();
    const spy = vi.spyOn(component.becomeMember, 'emit');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should use ERROR alert type when trial has expired', () => {
    fixture.componentRef.setInput('trialEndsAt', new Date(Date.now() - 1000));
    fixture.detectChanges();
    expect((component as any).alertType()).toBe('ERROR');
  });

  it('should use WARNING alert type when trial is active', () => {
    fixture.componentRef.setInput('trialEndsAt', new Date(Date.now() + 1000000));
    fixture.detectChanges();
    expect((component as any).alertType()).toBe('WARNING');
  });

  it('should have no accessibility violations', async () => {
    fixture.componentRef.setInput('trialEndsAt', new Date(Date.now() + 1000000));
    fixture.detectChanges();
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  }, 30000);
});
