import { DIALOG_DATA } from '@angular/cdk/dialog';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { escapeHtml } from '@plastik/shared/objects';

@Component({
  selector: 'plastik-shared-confirm-feature',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, TranslateModule, RouterLink],
  templateUrl: './shared-confirm-feature.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'block',
  },
})
export class SharedConfirmFeatureComponent {
  readonly #translate = inject(TranslateService);
  readonly #sanitizer = inject(DomSanitizer);
  protected readonly data = inject(DIALOG_DATA);

  protected readonly icon = computed(() => this.data.icon || 'help_outline');

  protected readonly message = computed(() => {
    // SECURITY: If message is already a SafeHtml or non-string object, do not pass to translate.instant()
    // which expects a string translation key and would throw TypeError: key.split is not a function.
    if (typeof this.data.message !== 'string') {
      return this.data.message;
    }

    const params = this.data.params;
    // SECURITY (XSS): Ensure all params are sanitized with escapeHtml, casting non-string/primitive values
    // to strings to prevent XSS payloads bypassing type checks via arrays or objects.
    const escapedParams = params
      ? Object.fromEntries(
          Object.entries(params).map(([key, value]) => [key, escapeHtml(String(value ?? ''))])
        )
      : params;
    const translated = this.#translate.instant(this.data.message, escapedParams);

    return this.#sanitizer.bypassSecurityTrustHtml(translated);
  });
}
