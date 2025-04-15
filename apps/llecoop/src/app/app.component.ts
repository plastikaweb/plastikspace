import { DOCUMENT, registerLocaleData } from '@angular/common';
import localeCa from '@angular/common/locales/ca';
import { Component, inject, OnInit, Renderer2 } from '@angular/core';
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
  protected readonly notificationStore = inject(notificationStore);
  protected readonly isActive = toSignal(this.#store.select(selectIsActive));

  ngOnInit(): void {
    this.#meta.addTag({
      name: 'description',
      content: 'Botiga per socis del Llevat, associació de consum ecològic i de proximitat',
    });

    const linkElement = this.#renderer.createElement('link');
    this.#renderer.setAttribute(linkElement, 'rel', 'preconnect');
    this.#renderer.setAttribute(linkElement, 'href', 'https://firebasestorage.googleapis.com');
    this.#renderer.appendChild(this.#document.head, linkElement);
  }
}
