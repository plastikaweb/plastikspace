import { inject, Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';
import { SharedConfirmFeatureComponent } from './shared-confirm-feature.component';

@Injectable({
  providedIn: 'root',
})
export class SharedConfirmDialogService {
  readonly #dialog = inject(MatDialog);

  /**
   * @description Opens a confirmation dialog.
   * @param {string} title The title of the dialog.
   * @param {string | SafeHtml} message The message to display, can be a string or SafeHtml.
   * @param {string} ko The label for the cancel button. Defaults to 'Cancel'.
   * @param {string} ok The label for the confirm button. Defaults to 'Delete'.
   * @param {Record<string, unknown>} params Optional parameters for the translation.
   * @param {string} icon Optional icon to display.
   * @returns {Observable<boolean>} An observable that emits true if confirmed, false otherwise.
   */
  confirm(
    title: string,
    message: string | SafeHtml,
    ko = 'Cancel',
    ok = 'Delete',
    params?: Record<string, unknown>,
    icon?: string
  ): Observable<boolean> {
    const dialogRef = this.#dialog.open(SharedConfirmFeatureComponent, {
      data: { title, message, ko, ok, params, icon },
    });

    return dialogRef.afterClosed().pipe(map(result => result || false));
  }
}
