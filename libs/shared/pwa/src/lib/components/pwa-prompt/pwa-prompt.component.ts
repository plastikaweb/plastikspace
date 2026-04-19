import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { PwaInstallService } from '../../services/pwa-install.service';

@Component({
  selector: 'plastik-pwa-prompt',
  imports: [MatButtonModule, MatIconModule, TranslateModule, SharedImgContainerComponent],
  templateUrl: './pwa-prompt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class PwaPromptComponent {
  protected readonly pwa = inject(PwaInstallService);
  protected readonly data = inject<{ name: string; logo: string; defaultLogo?: string }>(
    MAT_BOTTOM_SHEET_DATA
  );
  readonly #bottomSheetRef = inject(MatBottomSheetRef<PwaPromptComponent>);
  #installAttempted = false;

  constructor() {
    // Covers all dismiss paths: close button, later button, backdrop tap, swipe-to-dismiss.
    // installPwa() manages its own state, so we skip it via the flag.
    this.#bottomSheetRef
      .afterDismissed()
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (!this.#installAttempted) {
          this.pwa.dismissForLater();
        }
      });
  }

  install(): void {
    this.#installAttempted = true;
    this.pwa.installPwa().then(() => this.#bottomSheetRef.dismiss());
  }

  later(): void {
    this.#bottomSheetRef.dismiss();
  }

  close(): void {
    this.#bottomSheetRef.dismiss();
  }
}
