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

  confirm(
    title: string,
    message: string | SafeHtml,
    ko = 'Cancel',
    ok = 'Delete',
    params?: Record<string, unknown>
  ): Observable<boolean> {
    const dialogRef = this.#dialog.open(SharedConfirmFeatureComponent, {
      data: { title, message, ko, ok, params },
    });

    return dialogRef.afterClosed().pipe(map(result => result || false));
  }
}
