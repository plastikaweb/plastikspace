import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ViewTransitionService {
  readonly #activeId = signal<string | null>(null);

  readonly activeId = this.#activeId.asReadonly();

  setActiveId(id: string | null) {
    if (id === this.#activeId()) return;
    this.#activeId.set(id);
  }
}
