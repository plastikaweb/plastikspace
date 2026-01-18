import { ChangeDetectionStrategy, Component, inject, signal, effect } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'eco-eco-store-cart',
  standalone: true,
  imports: [MatStepperModule, TranslatePipe, RouterOutlet],
  templateUrl: './eco-store-cart.component.html',
  styleUrl: './eco-store-cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreCartComponent {
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  readonly steps = [
    { label: 'cart.steps.summary', route: 'resum' },
    { label: 'cart.steps.shipping', route: 'enviament' },
    { label: 'cart.steps.confirmation', route: 'confirmacio' },
  ];

  selectedStepIndex = signal(0);

  constructor() {
    effect(() => {
      // Sync URL with stepper if needed, or rely on Router events.
      // But simpler is to let Router be the source of truth.
    });

    // Simple sync: watch router events to update selected index
    this.#router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        this.#updateStepFromUrl();
      });

    // Initial sync
    this.#updateStepFromUrl();
  }

  onStepChange(event: StepperSelectionEvent): void {
    const step = this.steps[event.selectedIndex];
    if (step) {
      this.#router.navigate([step.route], { relativeTo: this.#route });
    }
  }

  #updateStepFromUrl(): void {
    const childRoute = this.#route.snapshot.firstChild;
    if (childRoute && childRoute.url.length > 0) {
      const path = childRoute.url[0].path;
      const index = this.steps.findIndex(s => s.route === path);
      if (index !== -1) {
        this.selectedStepIndex.set(index);
      }
    }
  }
}
