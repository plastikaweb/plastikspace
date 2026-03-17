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

  logout(): void {
    this.#pb.authStore.clear();
  }

  get authModel(): AuthModel | null {
    return this.#pb.authStore.record;
  }
}
