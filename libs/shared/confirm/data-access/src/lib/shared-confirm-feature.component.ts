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
    const message = this.data.message;
    if (typeof message !== 'string') {
      // SECURITY (XSS): Skip translation and return message as-is if it is already SafeHtml or not a string to avoid runtime translation errors.
      return message;
    }
    const params = this.data.params;
    const escapedParams = params
      ? Object.fromEntries(
          Object.entries(params).map(([key, value]) => [
            key,
            typeof value === 'number' ? value : escapeHtml(String(value ?? '')),
          ])
        )
      : params;
    const translated = this.#translate.instant(message, escapedParams);
    return this.#sanitizer.bypassSecurityTrustHtml(translated);
  });
}
