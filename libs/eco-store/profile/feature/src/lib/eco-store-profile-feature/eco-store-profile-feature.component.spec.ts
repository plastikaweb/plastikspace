import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { EcoStoreProfileFeatureComponent } from './eco-store-profile-feature.component';

describe('EcoStoreProfileFeatureComponent', () => {
  let component: EcoStoreProfileFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProfileFeatureComponent>;
  let confirmDialog: SharedConfirmDialogService;

  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileFeatureComponent],
      providers: [
        provideTranslateService(),
        provideRouter([]),
        {
          provide: pocketBaseUserProfileStore,
          useValue: mockPocketBaseUserProfileStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProfileFeatureComponent);
    component = fixture.componentInstance;
    confirmDialog = TestBed.inject(SharedConfirmDialogService);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call convertTrialToActive when onBecomeMember is called and confirmed', () => {
    vi.spyOn(confirmDialog, 'confirm').mockReturnValue(of(true));
    component.onBecomeMember();
    expect(confirmDialog.confirm).toHaveBeenCalled();
    expect(mockPocketBaseUserProfileStore.convertTrialToActive).toHaveBeenCalled();
  });

  it('should not call convertTrialToActive when onBecomeMember is called and cancelled', () => {
    vi.spyOn(confirmDialog, 'confirm').mockReturnValue(of(false));
    component.onBecomeMember();
    expect(confirmDialog.confirm).toHaveBeenCalled();
    expect(mockPocketBaseUserProfileStore.convertTrialToActive).not.toHaveBeenCalled();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);

    expect(results).toHaveNoViolations();
  }, 30000);
});
