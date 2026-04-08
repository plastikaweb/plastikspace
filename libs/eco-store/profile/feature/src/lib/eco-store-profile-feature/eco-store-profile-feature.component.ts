import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'eco-eco-store-profile-feature',
  imports: [TranslateModule, RouterOutlet, MatIconModule],
  templateUrl: './eco-store-profile-feature.component.html',
  styleUrl: './eco-store-profile-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileFeatureComponent {
  readonly profileStore = inject(pocketBaseUserProfileStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  readonly titleInput = input<string>('title');
  readonly iconInput = input<string>('icon');

  readonly #routeData = toSignal(
    this.#router.events.pipe(
      startWith(null),
      filter(e => e === null || e instanceof NavigationEnd),
      map(() => this.#getDeepestSnapshotData())
    ),
    { initialValue: this.#getDeepestSnapshotData() }
  );

  protected readonly title = computed(() => {
    const v = this.titleInput?.();
    if (v) return v;
    return this.#routeData()?.['title'] ?? '';
  });

  protected readonly icon = computed(() => {
    const v = this.iconInput?.();
    if (v) return v;
    return this.#routeData()?.['icon'] ?? '';
  });

  #getDeepestSnapshotData() {
    let s = this.#route.snapshot;
    while (s.firstChild) s = s.firstChild;
    return s.data ?? {};
  }
}
