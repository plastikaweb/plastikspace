import { FocusMonitor } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { POCKETBASE_WITH_TRANSLATION_ENVIRONMENT } from '@plastik/core/environments';
import { ecoStoreTenantStore } from '@plastik/eco-store/tenant';
import { activityStore } from '@plastik/shared/activity/data-access';
import { SharedActivityUiOverlayComponent } from '@plastik/shared/activity/ui';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { SharedNotificationUiHotToastComponent } from '@plastik/shared/notification/ui/hot-toast';
import { PwaInstallService } from '@plastik/shared/pwa';
import { SkipLinkComponent } from '@plastik/shared/skip-link';

@Component({
  imports: [
    RouterOutlet,
    SharedActivityUiOverlayComponent,
    SharedNotificationUiHotToastComponent,
    TranslateModule,
    SkipLinkComponent,
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
  protected readonly activityStore = inject(activityStore);
  protected readonly notificationStore = inject(notificationStore);
  readonly #tenantStore = inject(ecoStoreTenantStore);
  readonly #translate = inject(TranslateService);
  readonly #environment = inject(POCKETBASE_WITH_TRANSLATION_ENVIRONMENT);
  readonly #document = inject(DOCUMENT);
  readonly #focusMonitor = inject(FocusMonitor);
  readonly #renderer = inject(Renderer2);
  readonly #meta = inject(Meta);

  readonly #matIconRegistry = inject(MatIconRegistry);
  readonly #domSanitizer = inject(DomSanitizer);
  readonly #pwaInstallService = inject(PwaInstallService);

  constructor() {
    this.#translate.addLangs(this.#environment.languages);
    this.#addPreconnectLink();
    this.#addEcoLogoIcon();
    this.#addIosSafariIcon();

    effect(() => {
      const description = this.#tenantStore.tenantDescriptionTranslated();

      if (description) {
        this.#meta.updateTag({ name: 'description', content: description });
      }
    });
  }

  ngOnInit(): void {
    this.#focusMonitor.monitor(this.#document.body, true).subscribe(origin => {
      if (origin === 'keyboard') {
        this.#renderer.addClass(this.#document.body, 'is-keyboard-active');
      } else {
        this.#renderer.removeClass(this.#document.body, 'is-keyboard-active');
      }
    });

    // Delay showing the PWA prompt to avoid interrupting first paint.
    // On iOS Safari, we trigger the prompt manually if it should be shown.
    // On Android, the service auto-triggers on before install prompt event.
    setTimeout(() => {
      if (this.#pwaInstallService.isIos() && this.#pwaInstallService.shouldShowPrompt()) {
        this.#pwaInstallService.showPrompt();
      }
    }, 5000);
  }

  #addPreconnectLink(): void {
    const apiLink = this.#document.createElement('link');

    apiLink.rel = 'preconnect';
    apiLink.href = this.#environment.baseApiUrl;
    apiLink.setAttribute('crossorigin', '');
    this.#document.head.appendChild(apiLink);

    const appLink = this.#document.createElement('link');

    appLink.rel = 'preconnect';
    appLink.href = this.#document.location.origin;
    this.#document.head.appendChild(appLink);
  }

  #addEcoLogoIcon(): void {
    this.#matIconRegistry.addSvgIconLiteral(
      'eco_logo',
      this.#domSanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
          <path fill="currentColor" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
        </svg>
      `)
    );
  }

  #addIosSafariIcon(): void {
    this.#matIconRegistry.addSvgIconLiteral(
      'safari',
      this.#domSanitizer.bypassSecurityTrustHtml(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
        </svg>
      `)
    );
  }
}
