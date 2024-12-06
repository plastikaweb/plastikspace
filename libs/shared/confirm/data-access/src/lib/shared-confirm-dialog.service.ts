import { inject, Injectable } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { map, Observable } from 'rxjs';
import { SharedConfirmFeatureComponent } from './shared-confirm-feature.component';

@Injectable({
  providedIn: 'root',
})
export class SharedConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  confirm(
    title: string,
    message: string | SafeHtml,
    ko = 'Cancel',
    ok = 'Delete'
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(SharedConfirmFeatureComponent, {
      data: { title, message, ko, ok },
    });

    return dialogRef.afterClosed().pipe(map(result => result || false));
  }
}
