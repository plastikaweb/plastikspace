import { inject, Injectable } from '@angular/core';
import { RecordAuthResponse, type AuthModel } from 'pocketbase';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';

@Injectable({
  providedIn: 'root',
})
export class PocketBaseAuthService {
  readonly #pb = inject(POCKETBASE_INSTANCE);

  async login(email: string, password: string): Promise<RecordAuthResponse<AuthModel>> {
    return await this.#pb.collection('users').authWithPassword(email, password);
  }

  logout(): void {
    this.#pb.authStore.clear();
  }

  get isValid(): boolean {
    return this.#pb.authStore.isValid;
  }

  get authModel(): AuthModel | null {
    return this.#pb.authStore.record;
  }
}
