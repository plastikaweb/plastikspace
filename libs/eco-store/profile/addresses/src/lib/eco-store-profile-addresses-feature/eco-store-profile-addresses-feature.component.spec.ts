import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EcoStoreProfileAddressesFeatureComponent } from './eco-store-profile-addresses-feature.component';

describe('EcoStoreProfileAddressesFeatureComponent', () => {
  let component: EcoStoreProfileAddressesFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProfileAddressesFeatureComponent>;

  const mockConfirmService = {
    confirm: vi.fn().mockReturnValue(of(true)),
  };

  const mockProfileStore = {
    getUserContacts: vi.fn().mockReturnValue([
      {
        id: '1',
        name: 'Home',
        address: '123 Main St',
        city: 'Barcelona',
        zip: '08001',
        default: true,
      },
      {
        id: '2',
        name: 'Work',
        address: '456 Office Rd',
        city: 'Barcelona',
        zip: '08002',
        default: false,
      },
    ]),
    deleteAddress: vi.fn().mockResolvedValue(true),
    setDefaultAddress: vi.fn().mockResolvedValue(true),
    updateAddress: vi.fn().mockResolvedValue(true),
    addressesLoaded: vi.fn().mockReturnValue(true),
    isLoading: vi.fn().mockReturnValue(false),
    createAddress: vi.fn().mockResolvedValue(true),
  };

  const mockActivatedRoute = {
    url: of([]),
    paramMap: of({ get: () => null }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileAddressesFeatureComponent],
      providers: [
        provideTranslateService(),
        { provide: SharedConfirmDialogService, useValue: mockConfirmService },
        { provide: pocketBaseUserProfileStore, useValue: mockProfileStore },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProfileAddressesFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle delete with confirmation', () => {
    component.onDelete('1', 'Home');
    expect(mockConfirmService.confirm).toHaveBeenCalled();
    expect(mockProfileStore.deleteAddress).toHaveBeenCalledWith('1');
  });

  it('should handle set default', () => {
    component.onSetDefault('2');
    expect(mockProfileStore.setDefaultAddress).toHaveBeenCalledWith('2');
  });
});
