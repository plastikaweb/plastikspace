import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { provideTranslateService } from '@ngx-translate/core';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { EcoStoreProfileAccessSecurityFeatureComponent } from './eco-store-profile-access-security-feature.component';

describe('EcoStoreProfileAccessSecurityFeatureComponent', () => {
  const requestEmailChange = vi.fn();
  let fixture: ComponentFixture<EcoStoreProfileAccessSecurityFeatureComponent>;
  let component: EcoStoreProfileAccessSecurityFeatureComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileAccessSecurityFeatureComponent],
      providers: [
        provideTranslateService(),
        providePlainInputFormly(),
        {
          provide: pocketBaseUserProfileStore,
          useValue: { user: signal({ email: 'old@mail.com' }), requestEmailChange },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EcoStoreProfileAccessSecurityFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('submitting a new email calls store.requestEmailChange', () => {
    component['onSubmit']({ email: 'new@mail.com' });
    expect(requestEmailChange).toHaveBeenCalledWith('new@mail.com');
  });

  it('exposes the current email to the form config', () => {
    expect(component['currentEmail']()).toBe('old@mail.com');
  });
});
