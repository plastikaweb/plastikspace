import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DOCUMENT, registerLocaleData } from '@angular/common';
import localeCa from '@angular/common/locales/ca';
import { Component, effect, inject, OnInit, Renderer2 } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsActive } from '@plastik/shared/activity/data-access';
import { SharedActivityUiOverlayComponent } from '@plastik/shared/activity/ui';
import { notificationStore } from '@plastik/shared/notification/data-access';
import { NotificationUiMatSnackbarDirective } from '@plastik/shared/notification/ui/mat-snackbar';

registerLocaleData(localeCa, 'ca-ES');

@Component({
  selector: 'plastik-root',
  imports: [RouterOutlet, SharedActivityUiOverlayComponent, NotificationUiMatSnackbarDirective],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly #store = inject(Store);
  readonly #meta = inject(Meta);
  readonly #document = inject(DOCUMENT);
  readonly #renderer = inject(Renderer2);
  readonly #liveAnnouncer = inject(LiveAnnouncer);
  protected readonly notificationStore = inject(notificationStore);
  protected readonly isActive = toSignal(this.#store.select(selectIsActive));

  constructor() {
    effect(() => {
      if (this.isActive()) {
        this.#liveAnnouncer.announce('Carregant dades...', 'assertive', 100);
      }
    });
  }

  ngOnInit(): void {
    this.#meta.addTag({
      name: 'description',
      content: 'Botiga per socis del Llevat, associació de consum ecològic i de proximitat',
    });

    // const linkElement = this.#renderer.createElement('link');
    // this.#renderer.setAttribute(linkElement, 'rel', 'preconnect');
    // this.#renderer.setAttribute(linkElement, 'href', 'https://firebasestorage.googleapis.com');
    // this.#renderer.appendChild(this.#document.head, linkElement);

    const linkElement2 = this.#renderer.createElement('link');
    this.#renderer.setAttribute(linkElement2, 'rel', 'preconnect');
    this.#renderer.setAttribute(linkElement2, 'href', 'https://ik.imagekit.io');
    this.#renderer.appendChild(this.#document.head, linkElement2);
  }
}
