import { registerLocaleData } from '@angular/common';
import localeCa from '@angular/common/locales/ca';
import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsActive } from '@plastik/shared/activity/data-access';
import { SharedActivityUiOverlayComponent } from '@plastik/shared/activity/ui';
import { NotificationFacade } from '@plastik/shared/notification/data-access';
import { NotificationUiMatSnackbarDirective } from '@plastik/shared/notification/ui/mat-snackbar';

registerLocaleData(localeCa, 'ca-ES');

@Component({
    selector: 'plastik-root',
    imports: [RouterOutlet, SharedActivityUiOverlayComponent, NotificationUiMatSnackbarDirective],
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly meta = inject(Meta);
  protected readonly notificationFacade = inject(NotificationFacade);
  protected readonly notificationConfig = toSignal(this.notificationFacade?.config$);
  protected readonly isActive = toSignal(this.store.select(selectIsActive));

  ngOnInit(): void {
    this.meta.addTag({
      name: 'description',
      content: 'Botiga per socis del Llevat, associació de consum ecològic i de proximitat',
    });
  }
}
