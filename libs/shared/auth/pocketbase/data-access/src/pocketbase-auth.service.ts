import { computed, inject, Injectable } from '@angular/core';
import { AuthFacade } from '@plastik/auth/entities';
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

  async updateProfile(id: string, data: { name: string; phone: string }): Promise<AuthModel> {
    return await this.#pb.collection('users').update(id, data);
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

  get authModel(): AuthModel | null {
    return this.#pb.authStore.record;
  }
}
