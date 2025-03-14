import { NgClass, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DETAIL_ITEM_VIEW_FACADE } from '@plastik/core/detail-edit-view';
import { SharedFormFeatureModule } from '@plastik/shared/form';

@Component({
  selector: 'plastik-profile-feature',
  imports: [NgClass, MatIconModule, TitleCasePipe, MatButtonModule, SharedFormFeatureModule],
  templateUrl: './profile-feature.component.html',
  styleUrl: './profile-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFeatureComponent {
  protected facade = inject(DETAIL_ITEM_VIEW_FACADE);
  pendingChanges = signal(false);
}
