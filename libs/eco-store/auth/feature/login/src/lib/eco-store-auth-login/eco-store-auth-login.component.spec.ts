import { IMAGE_LOADER } from '@angular/common';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_FORM_FACADE } from '@plastik/auth/entities';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { mockPocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access/testing';
import { provideEnvironmentPocketBaseTranslationMock } from '@plastik/core/environments/testing';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { mockEcoStoreTenantStore } from '@plastik/eco-store/tenant/testing';
import { EcoStoreAuthLoginComponent } from './eco-store-auth-login.component';

describe('EcoStoreAuthLoginComponent', () => {
  let component: EcoStoreAuthLoginComponent;
  let fixture: ComponentFixture<EcoStoreAuthLoginComponent>;

  const authFacadeMock = {
    formConfig: {
      getConfig: () => [],
      getSubmitFormConfig: () => ({}),
    },
    extraLinks: signal([]),
    onSubmit: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreAuthLoginComponent, TranslateModule.forRoot()],
      providers: [
        provideEnvironmentPocketBaseTranslationMock(),
        provideRouter([]),
        { provide: AUTH_FORM_FACADE, useValue: authFacadeMock },
        { provide: pocketBaseUserProfileStore, useValue: mockPocketBaseUserProfileStore },
        { provide: ecoStoreTenantStore, useValue: mockEcoStoreTenantStore },
        { provide: IMAGE_LOADER, useValue: (src: string) => src },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EcoStoreAuthLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
