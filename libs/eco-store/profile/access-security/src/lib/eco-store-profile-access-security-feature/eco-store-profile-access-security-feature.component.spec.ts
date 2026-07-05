import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { provideTranslateService } from '@ngx-translate/core';
import { providePasswordWithVisibilityFormly } from '@plastik/shared/form/password';
import { providePlainInputFormly } from '@plastik/shared/form/util';
import { EcoStoreProfileAccessSecurityFeatureComponent } from './eco-store-profile-access-security-feature.component';

describe('EcoStoreProfileAccessSecurityFeatureComponent', () => {
  const requestEmailChange = vi.fn();
  const changePassword = vi.fn();
  let fixture: ComponentFixture<EcoStoreProfileAccessSecurityFeatureComponent>;
  let component: EcoStoreProfileAccessSecurityFeatureComponent;

  beforeEach(async () => {
    requestEmailChange.mockClear();
    changePassword.mockClear();
    await TestBed.configureTestingModule({
      imports: [EcoStoreProfileAccessSecurityFeatureComponent],
      providers: [
        provideTranslateService(),
        providePlainInputFormly(),
        providePasswordWithVisibilityFormly(),
        {
          provide: pocketBaseUserProfileStore,
          useValue: { user: signal({ email: 'old@mail.com' }), requestEmailChange, changePassword },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(EcoStoreProfileAccessSecurityFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('submitting a new email calls store.requestEmailChange', () => {
    component['onEmailSubmit']({ email: 'new@mail.com' });
    expect(requestEmailChange).toHaveBeenCalledWith('new@mail.com');
  });

  it('bumps the email reset counter after a successful request', async () => {
    requestEmailChange.mockResolvedValueOnce(true);
    await component['onEmailSubmit']({ email: 'new@mail.com' });
    expect(component['emailFormReset']()).toBe(1);
  });

  it('keeps the email form when the request fails', async () => {
    requestEmailChange.mockResolvedValueOnce(false);
    await component['onEmailSubmit']({ email: 'used@mail.com' });
    expect(component['emailFormReset']()).toBe(0);
  });

  it('exposes the current email to the form config', () => {
    expect(component['currentEmail']()).toBe('old@mail.com');
  });

  it('submitting the password form maps the model to ChangePasswordData', () => {
    component['onPasswordSubmit']({
      oldPassword: 'test-current-pw',
      newPassword: 'test-new-pw-1',
      confirmPassword: 'test-new-pw-1',
    });
    expect(changePassword).toHaveBeenCalledWith({
      oldPassword: 'test-current-pw',
      password: 'test-new-pw-1',
      passwordConfirm: 'test-new-pw-1',
    });
  });

  it('ignores a password submit with missing fields', () => {
    component['onPasswordSubmit']({ oldPassword: '', newPassword: 'x', confirmPassword: 'x' });
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('bumps the reset counter after a successful password change', async () => {
    changePassword.mockResolvedValueOnce(true);
    await component['onPasswordSubmit']({
      oldPassword: 'test-current-pw',
      newPassword: 'test-new-pw-1',
      confirmPassword: 'test-new-pw-1',
    });
    expect(component['passwordFormReset']()).toBe(1);
  });

  it('keeps the form and focuses the current-password input on failure', async () => {
    changePassword.mockResolvedValueOnce(false);
    const currentPasswordInput = fixture.nativeElement.querySelector(
      'input[autocomplete="current-password"]'
    ) as HTMLInputElement;
    expect(currentPasswordInput).toBeTruthy();
    const focusSpy = vi.spyOn(currentPasswordInput, 'focus');
    const selectSpy = vi.spyOn(currentPasswordInput, 'select');

    await component['onPasswordSubmit']({
      oldPassword: 'test-wrong-pw',
      newPassword: 'test-new-pw-1',
      confirmPassword: 'test-new-pw-1',
    });
    currentPasswordInput.dispatchEvent(new FocusEvent('focus'));

    expect(component['passwordFormReset']()).toBe(0);
    expect(focusSpy).toHaveBeenCalled();
    expect(selectSpy).toHaveBeenCalled();
  });
});
