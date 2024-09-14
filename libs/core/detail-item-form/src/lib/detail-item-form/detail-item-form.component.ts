import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SharedFormFeatureModule } from '@plastik/shared/form';
import { DETAIL_ITEM_VIEW_FACADE } from './detail-item-view-facade.type';

@Component({
  selector: 'plastik-detail-item-form',
  standalone: true,
  imports: [SharedFormFeatureModule, MatIconModule, TitleCasePipe, MatButtonModule, RouterLink],
  templateUrl: './detail-item-form.component.html',
  styleUrl: './detail-item-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailItemFormComponent {
  protected facade = inject(DETAIL_ITEM_VIEW_FACADE);

  onSubmit(data: object): void {
    this.facade.onSubmit?.(data);
  }
}
