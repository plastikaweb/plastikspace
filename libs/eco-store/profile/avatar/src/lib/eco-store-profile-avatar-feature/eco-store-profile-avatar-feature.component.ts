import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { SharedConfirmDialogService } from '@plastik/shared/confirm';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { SharedImgCropperComponent } from '@plastik/shared/img-cropper';
import { filter, take, tap } from 'rxjs';

@Component({
  selector: 'eco-eco-store-profile-avatar-feature',
  imports: [
    SharedImgContainerComponent,
    SharedImgCropperComponent,
    PocketBaseImageUrlPipe,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
  ],
  templateUrl: './eco-store-profile-avatar-feature.component.html',
  styleUrl: './eco-store-profile-avatar-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileAvatarFeatureComponent {
  readonly #confirmService = inject(SharedConfirmDialogService);
  protected readonly profileStore = inject(pocketBaseUserProfileStore);

  protected readonly isEditing = signal(false);
  protected readonly hasAvatar = computed(() => !!this.profileStore.user()?.avatar);

  onStartEdit(): void {
    this.isEditing.set(true);
  }

  async onCropConfirmed(file: File): Promise<void> {
    const ok = await this.profileStore.updateAvatar(file);
    if (ok) this.isEditing.set(false);
  }

  onCropCancelled(): void {
    this.isEditing.set(false);
  }

  async onDelete(): Promise<void> {
    this.#confirmService
      .confirm(
        'common.image.delete.title',
        'common.image.delete.message',
        'common.cancel',
        'common.delete'
      )
      .pipe(
        take(1),
        filter(Boolean),
        tap(() => this.profileStore.deleteAvatar())
      )
      .subscribe();
  }
}
