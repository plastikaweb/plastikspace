import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { AddressCardComponent } from '@plastik/shared/address-card/ui';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { filter, take, tap } from 'rxjs';

@Component({
  selector: 'eco-eco-store-profile-addresses-feature',
  imports: [
    AddressCardComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './eco-store-profile-addresses-feature.component.html',
  styleUrl: './eco-store-profile-addresses-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileAddressesFeatureComponent {
  readonly #confirmService = inject(SharedConfirmDialogService);
  protected readonly profileStore = inject(pocketBaseUserProfileStore);

  onEdit(addressId: string): void {
    // eslint-disable-next-line no-console
    console.log(addressId);
    // TODO: navigate to address edit form
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
