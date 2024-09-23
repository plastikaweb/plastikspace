import { Injectable, inject } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SharedConfirmFeatureComponent } from './shared-confirm-feature.component';

@Injectable({
  providedIn: 'root',
})
export class SharedConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  confirm(
    title = 'Attention!',
    message = 'Do you really want to delete this item?',
    ko = 'Cancel',
    ok = 'Delete'
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(SharedConfirmFeatureComponent, {
      data: { title, message, ko, ok },
    });

    return dialogRef.afterClosed();
  }
}
