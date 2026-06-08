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
import { escapeHtml } from '@plastik/shared/objects';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    const params = { ...this.data.params };

    if (params) {
      for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key) && typeof params[key] === 'string') {
          params[key] = escapeHtml(params[key] as string);
        }
      }
    }

    const translated = this.#translate.instant(this.data.message, params);
    return this.#sanitizer.bypassSecurityTrustHtml(translated);
  });
}
