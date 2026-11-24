import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { EcoStoreProfileBasicFeatureComponent } from './eco-store-profile-basic-feature.component';

describe('EcoStoreProfileBasicFeatureComponent', () => {
  let component: EcoStoreProfileBasicFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProfileBasicFeatureComponent>;

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileBasicFeatureComponent],
      providers: [
        provideTranslateService(),
        providePlainInputFormly(),
        {
          provide: pocketBaseUserProfileStore,
          useValue: mockPocketBaseUserProfileStore,
        },
        {
          provide: SharedConfirmDialogService,
          useValue: { confirm: vi.fn(() => of(true)) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProfileBasicFeatureComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const input = (key: string): HTMLInputElement =>
    fixture.nativeElement.querySelector(`input[id*="${key}"]`);

  it('should let the browser fill in the name and the phone (WCAG 1.3.5)', () => {
    fixture.detectChanges();

    expect(input('name').getAttribute('autocomplete')).toBe('name');
    expect(input('phone').getAttribute('autocomplete')).toBe('tel');
  });

  it('should accept a short real name', () => {
    fixture.detectChanges();
    const name = input('name');

    name.value = 'Ana Gil';
    name.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(name.classList).toContain('ng-valid');
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  }, 30000);
});
