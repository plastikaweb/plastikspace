import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatStepperModule } from '@angular/material/stepper';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { filter, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'eco-eco-store-cart',
  imports: [MatStepperModule, TranslatePipe, RouterOutlet],
  templateUrl: './eco-store-cart.component.html',
  styleUrl: './eco-store-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreCartComponent {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  readonly #tenantStore = inject(ecoStoreTenantStore);
  readonly isStoreOpen = this.#tenantStore.isStoreOpen;

  readonly steps = [
    { label: 'cart.steps.summary', route: 'resum' },
    { label: 'cart.steps.shipping', route: 'enviament' },
    { label: 'cart.steps.confirmation', route: 'confirmacio' },
  ];

  readonly selectedStepIndex = toSignal(
    this.#router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      map(() => this.#getStepIndexFromUrl())
    ),
    { initialValue: 0 }
  );

  onStepChange(event: StepperSelectionEvent): void {
    const targetStep = this.steps[event.selectedIndex];
    const currentIndex = this.#getStepIndexFromUrl();

    if (!this.isStoreOpen() && event.selectedIndex > 0) {
      return;
    }

    // We only navigate if the index is different to avoid loops.
    if (event.selectedIndex !== currentIndex && targetStep) {
      this.#router.navigate([targetStep.route], { relativeTo: this.#route });
    }
  }

  #getStepIndexFromUrl(): number {
    const childRoute = this.#route.snapshot.firstChild;
    if (!childRoute) return 0;

    const path = childRoute.url[0]?.path;
    const index = this.steps.findIndex(s => s.route === path);
    return index !== -1 ? index : 0;
  }
}
