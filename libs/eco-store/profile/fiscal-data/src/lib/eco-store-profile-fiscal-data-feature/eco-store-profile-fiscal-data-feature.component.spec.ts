import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { PocketBaseUserFiscalProfile } from '@plastik/core/entities';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { EcoStoreProfileFiscalDataFeatureComponent } from './eco-store-profile-fiscal-data-feature.component';

const fiscalProfile: PocketBaseUserFiscalProfile = {
  id: 'fiscal1',
  collectionId: 'fiscal_profiles',
  collectionName: 'user_fiscal_profiles',
  created: new Date('2026-01-01T00:00:00.000Z'),
  updated: new Date('2026-01-01T00:00:00.000Z'),
  user: 'user1',
  fiscalName: 'Fable Fable SL',
  nif: '12345678Z',
  address: 'Carrer Major, 1',
  city: 'Barcelona',
  zip: '08001',
};

describe('EcoStoreProfileFiscalDataFeatureComponent', () => {
  let component: EcoStoreProfileFiscalDataFeatureComponent;
  let fixture: ComponentFixture<EcoStoreProfileFiscalDataFeatureComponent>;
  let fiscalProfileSignal: ReturnType<typeof signal<PocketBaseUserFiscalProfile | null>>;
  let saveFiscalProfile: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    fiscalProfileSignal = signal<PocketBaseUserFiscalProfile | null>(null);
    saveFiscalProfile = vi.fn();

    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileFiscalDataFeatureComponent],
      providers: [
        provideTranslateService(),
        providePlainInputFormly(),
        {
          provide: pocketBaseUserProfileStore,
          useValue: {
            ...mockPocketBaseUserProfileStore,
            fiscalProfile: fiscalProfileSignal,
            saveFiscalProfile,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreProfileFiscalDataFeatureComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no accessibility violations', async () => {
    const results = await axe(fixture.nativeElement);
    expect(results).toHaveNoViolations();
  }, 30000);

  it('should map an empty model when there is no stored fiscal profile', () => {
    expect(component['model']()).toEqual({
      fiscalName: '',
      nif: '',
      address: '',
      city: '',
      zip: '',
    });
  });

  it('should map a stored fiscal profile into the form model', () => {
    fiscalProfileSignal.set(fiscalProfile);

    expect(component['model']()).toEqual({
      fiscalName: 'Fable Fable SL',
      nif: '12345678Z',
      address: 'Carrer Major, 1',
      city: 'Barcelona',
      zip: '08001',
    });
  });

  it('should delegate onSubmit to saveFiscalProfile', () => {
    const data = {
      fiscalName: 'Fable Fable SL',
      nif: '12345678Z',
      address: 'Carrer Major, 1',
      city: 'Barcelona',
      zip: '08001',
    };

    component.onSubmit(data);

    expect(saveFiscalProfile).toHaveBeenCalledWith(data);
  });
});
