import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { CanDeactivateComponent } from '@plastik/core/can-deactivate';
import { UserContactForm } from '@plastik/core/entities';
import { EcoStoreSharedNoResultsComponent } from '@plastik/eco-store/no-results';
import { AddressCardComponent } from '@plastik/shared/address-card/ui';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { filter, map, take, tap } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { ecoStoreProfileAddressesFeatureFormConfig } from './eco-store-profile-addresses-feature-form.config';

@Component({
  selector: 'eco-eco-store-profile-addresses-feature',
  imports: [
    AddressCardComponent,
    EcoStoreSharedNoResultsComponent,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    SharedFormFeatureModule,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './eco-store-profile-addresses-feature.component.html',
  styleUrl: './eco-store-profile-addresses-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileAddressesFeatureComponent implements CanDeactivateComponent {
  readonly #confirmService = inject(SharedConfirmDialogService);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);
  protected readonly profileStore = inject(pocketBaseUserProfileStore);
  protected readonly formConfig = ecoStoreProfileAddressesFeatureFormConfig();
  protected readonly isNewRoute = toSignal(
    this.#route.url.pipe(map(segments => segments.some(s => s.path === 'nova'))),
    { initialValue: false }
  );
  readonly pendingChanges = signal(false);

  protected readonly skeletonItems = linkedSignal({
    source: () => ({
      isSyncing: this.profileStore.isLoading(),
      isSynced: this.profileStore.addressesLoaded(),
      count: this.profileStore.getUserContacts().length,
    }),
    computation: s => {
      if (s.isSyncing && !s.isSynced) {
        const count = s.count > 0 ? s.count : 0;
        return Array(count).fill(0);
      }
      return [];
    },
  });

  onEdit(addressId: string): void {
    // eslint-disable-next-line no-console
    console.log(addressId);
    // TODO: navigate to address edit form
  }

  onAddNew(): void {
    this.#router.navigate(['nova'], { relativeTo: this.#route });
  }

  onCreateAddress(address: UserContactForm): void {
    this.profileStore.createAddress(address);
    this.#router.navigate(['..'], { relativeTo: this.#route });
  }

  onDelete(addressId: string, addressName: string): void {
    this.#confirmService
      .confirm(
        'profile.addresses.delete.label',
        'profile.addresses.delete.message',
        'common.cancel',
        'common.delete',
        { address: addressName.toUpperCase() }
      )
      .pipe(
        take(1),
        filter(Boolean),
        tap(() => this.profileStore.deleteAddress(addressId))
      )
      .subscribe();
  }

  onSetDefault(addressId: string): void {
    this.profileStore.setDefaultAddress(addressId);
  }
}
