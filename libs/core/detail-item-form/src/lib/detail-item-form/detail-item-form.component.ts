import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CanDeactivateComponent } from '@plastik/core/can-deactivate';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { ColorPickerFormlyModule } from '@plastik/shared/form/color-picker';
import { TableFormlyModule } from '@plastik/shared/form/table';
import { TextAreaWithCounterFormlyModule } from '@plastik/shared/form/textarea-with-counter';

import { DETAIL_ITEM_VIEW_FACADE } from './detail-item-view-facade.type';
import { ImgLoaderFormlyModule } from '@plastik/shared/form/img-loader';

@Component({
  imports: [
    MatIconModule,
    MatButtonModule,
    TitleCasePipe,
    RouterLink,
    NgClass,
    TableFormlyModule,
    SharedFormFeatureModule,
    ColorPickerFormlyModule,
    TextAreaWithCounterFormlyModule,
    ImgLoaderFormlyModule,
  ],
  templateUrl: './detail-item-form.component.html',
  styleUrl: './detail-item-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailItemFormComponent implements CanDeactivateComponent {
  protected facade = inject(DETAIL_ITEM_VIEW_FACADE);
  pendingChanges = signal(false);
}
