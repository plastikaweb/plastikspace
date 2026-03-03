import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { ecoStoreOrdersStore } from '@plastik/eco-store/orders/data-access';

@Component({
  selector: 'eco-order-confirmation',
  imports: [MatButtonModule, MatCardModule, MatIconModule, RouterLink, TranslatePipe],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderConfirmationComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #ordersStore = inject(ecoStoreOrdersStore);
  readonly #userProfileStore = inject(pocketBaseUserProfileStore);
  readonly orderId = this.#route.snapshot.paramMap.get('id') ?? '';

  readonly #order = computed(() => this.#ordersStore.getItemById(this.orderId));

  protected readonly orderNumber = computed(() => this.#order()?.orderNumber ?? '');

  protected readonly userEmail = computed(() => this.#userProfileStore.user()?.email ?? '');
}
