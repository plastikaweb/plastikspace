import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { of } from 'rxjs';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { EcoStoreProfileAvatarFeatureComponent } from './eco-store-profile-avatar-feature.component';

describe('EcoStoreProfileAvatarFeatureComponent', () => {
  let component: EcoStoreProfileAvatarFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProfileAvatarFeatureComponent>;

  const mockConfirmService = {
    confirm: vi.fn().mockReturnValue(of(true)),
  };

  const mockProfileStore = {
    user: vi.fn().mockReturnValue({ id: '1', avatar: 'avatar.png' }),
    updateAvatar: vi.fn().mockResolvedValue(true),
    deleteAvatar: vi.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileAvatarFeatureComponent, TranslateModule.forRoot()],
      providers: [
        { provide: SharedConfirmDialogService, useValue: mockConfirmService },
        { provide: pocketBaseUserProfileStore, useValue: mockProfileStore },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProfileAvatarFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start editing', () => {
    component.onStartEdit();
    expect(component['isEditing']()).toBe(true);
  });

  it('should cancel editing', () => {
    component.onStartEdit();
    component.onCropCancelled();
    expect(component['isEditing']()).toBe(false);
  });

  it('should handle crop confirmed', async () => {
    component.onStartEdit();
    const file = new File([''], 'avatar.png', { type: 'image/png' });
    await component.onCropConfirmed(file);
    expect(mockProfileStore.updateAvatar).toHaveBeenCalledWith(file);
    expect(component['isEditing']()).toBe(false);
  });

  it('should handle delete with confirmation', async () => {
    await component.onDelete();
    expect(mockConfirmService.confirm).toHaveBeenCalled();
    expect(mockProfileStore.deleteAvatar).toHaveBeenCalled();
  });
});
