import { A11yModule, FocusMonitor } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, Renderer2 } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { POCKETBASE_WITH_TRANSLATION_ENVIRONMENT } from '@plastik/core/environments';
import { EcoStoreLayoutService } from '@plastik/eco-store/entities';
import { activityStore } from '@plastik/shared/activity/data-access';
import { SharedActivityUiOverlayComponent } from '@plastik/shared/activity/ui';
import { SkipLinkComponent } from '@plastik/shared/skip-link';

@Component({
  imports: [
    RouterOutlet,
    SharedActivityUiOverlayComponent,
    TranslateModule,
    SkipLinkComponent,
    A11yModule,
  ],
  selector: 'eco-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'w-full h-screen h-lvh block',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly #translate = inject(TranslateService);
  readonly #environment = inject(POCKETBASE_WITH_TRANSLATION_ENVIRONMENT);
  protected readonly activityStore = inject(activityStore);
  readonly #document = inject(DOCUMENT);
  readonly #focusMonitor = inject(FocusMonitor);
  readonly #renderer = inject(Renderer2);
  readonly #layoutService = inject(EcoStoreLayoutService);

  readonly matIconRegistry = inject(MatIconRegistry);
  readonly domSanitizer = inject(DomSanitizer);

  constructor() {
    this.#translate.addLangs(this.#environment.languages);
    this.addPreconnectLink();
    this.addSvgIcon();
  }

  ngOnInit(): void {
    this.#focusMonitor.monitor(this.#document.body, true).subscribe(origin => {
      if (origin === 'keyboard') {
        this.#renderer.addClass(this.#document.body, 'is-keyboard-active');
      } else {
        this.#renderer.removeClass(this.#document.body, 'is-keyboard-active');
      }
    });
  }

  private addPreconnectLink(): void {
    const link = this.#document.createElement('link');
    link.rel = 'preconnect';
    link.href = this.#environment.baseApiUrl;
    this.#document.head.appendChild(link);
  }

  private addSvgIcon(): void {
    this.matIconRegistry.addSvgIconLiteral(
      'eco_logo',
      this.domSanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
        </svg>
      `)
    );
  }
}
