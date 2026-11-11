import { computed, inject, Injectable } from '@angular/core';
import { AuthFacade, ChangePasswordData } from '@plastik/auth/entities';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { RecordAuthResponse, type AuthModel } from 'pocketbase';

@Injectable({
  providedIn: 'root',
})
export class PocketBaseAuthService implements AuthFacade {
  readonly #pb = inject(POCKETBASE_INSTANCE);
  loggedIn = computed(() => this.#pb.authStore.isValid);

  async login(email: string, password: string): Promise<RecordAuthResponse<AuthModel>> {
    return await this.#pb.collection('users').authWithPassword(email, password);
  }

  /**
   * Asks PocketBase to email a one-time code to the given address.
   * PocketBase answers with an id even when no user holds that address, so this never reveals whether one exists.
   * @param {string} email The address of the user signing in.
   * @returns {Promise<string>} The id of the code request, needed to verify the code.
   */
  async requestOtp(email: string): Promise<string> {
    const { otpId } = await this.#pb.collection('users').requestOTP(email);

    return otpId;
  }

  /**
   * Completes a login with the emailed one-time code as the second factor.
   * @param {string} otpId The id returned by `requestOtp`.
   * @param {string} code The code the user received by email.
   * @param {string} mfaId The id of the pending login, taken from the 401 that `login` rejected with.
   * @returns {Promise<RecordAuthResponse<AuthModel>>} The auth response; the token is already in the auth store.
   */
  async loginWithOtp(
    otpId: string,
    code: string,
    mfaId: string
  ): Promise<RecordAuthResponse<AuthModel>> {
    return await this.#pb.collection('users').authWithOTP(otpId, code, { mfaId });
  }

  async register(
    email: string,
    password: string,
    name: string
  ): Promise<RecordAuthResponse<AuthModel>> {
    return await this.#pb.collection('users').create({
      email,
      password,
      name,
    });
  }

  async requestPassword(email: string): Promise<boolean> {
    return await this.#pb.collection('users').requestPasswordReset(email);
  }

  async confirmPasswordReset(
    token: string,
    password: string,
    passwordConfirm: string
  ): Promise<boolean> {
    return await this.#pb
      .collection('users')
      .confirmPasswordReset(token, password, passwordConfirm);
  }

  async requestEmailChange(newEmail: string): Promise<boolean> {
    return await this.#pb.collection('users').requestEmailChange(newEmail);
  }

  async confirmEmailChange(token: string, password: string): Promise<boolean> {
    return await this.#pb.collection('users').confirmEmailChange(token, password);
  }

  async changePassword(
    id: string,
    email: string,
    passwords: ChangePasswordData
  ): Promise<RecordAuthResponse<AuthModel>> {
    await this.#pb.collection('users').update(id, {
      oldPassword: passwords.oldPassword,
      password: passwords.password,
      passwordConfirm: passwords.passwordConfirm,
    });

    // Changing the password rotates the user's tokenKey, invalidating the current
    // JWT — re-authenticate with the new password to keep the session alive.
    return await this.#pb.collection('users').authWithPassword(email, passwords.password);
  }

  async updateProfile(id: string, profile: { name: string; phone: string }): Promise<AuthModel> {
    return await this.#pb.collection('users').update(id, profile);
  }

  async updateLanguage(id: string, language: string): Promise<AuthModel> {
    return await this.#pb.collection('users').update(id, { language });
  }

  async updateAvatar(id: string, file: File): Promise<AuthModel> {
    const formData = new FormData();

    formData.append('avatar', file, file.name);

    return await this.#pb.collection('users').update(id, formData);
  }

  async deleteAvatar(id: string): Promise<AuthModel> {
    return await this.#pb.collection('users').update(id, { avatar: null });
  }

  async convertTrialToActive(id: string): Promise<AuthModel> {
    const updated = await this.#pb.collection('users').update(id, {
      membershipStatus: 'ACTIVE',
      trialEndsAt: null,
    });

    await this.#pb.collection('users').authRefresh();

    return updated;
  }

  logout(): void {
    this.#pb.authStore.clear();
  }

  get token(): string {
    return this.#pb.authStore.token;
  }

  get authModel(): AuthModel | null {
    return this.#pb.authStore.record;
  }
}
