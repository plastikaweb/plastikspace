import { ChangeDetectionStrategy, Component, DOCUMENT, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { POCKETBASE_WITH_TRANSLATION_ENVIRONMENT } from '@plastik/core/environments';
import { activityStore } from '@plastik/shared/activity/data-access';
import { SharedActivityUiOverlayComponent } from '@plastik/shared/activity/ui';
import { SkipLinkComponent } from '@plastik/shared/skip-link';

@Component({
  imports: [RouterOutlet, SharedActivityUiOverlayComponent, TranslateModule, SkipLinkComponent],
  selector: 'eco-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'w-full h-lvh block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly #translate = inject(TranslateService);
  readonly #environment = inject(POCKETBASE_WITH_TRANSLATION_ENVIRONMENT);
  protected readonly activityStore = inject(activityStore);
  readonly #document = inject(DOCUMENT);

  ngOnInit(): void {
    this.#translate.addLangs(this.#environment.languages);
    this.addPreconnectLink();
  }

  private addPreconnectLink(): void {
    const link = this.#document.createElement('link');
    link.rel = 'preconnect';
    link.href = this.#environment.baseApiUrl;
    this.#document.head.appendChild(link);
  }
}
