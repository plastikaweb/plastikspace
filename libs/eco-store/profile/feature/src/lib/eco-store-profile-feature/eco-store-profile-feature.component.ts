import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';

@Component({
  selector: 'eco-eco-store-profile-feature',
  imports: [TranslateModule, RouterOutlet, MatIconModule],
  templateUrl: './eco-store-profile-feature.component.html',
  styleUrl: './eco-store-profile-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoStoreProfileFeatureComponent {
  readonly profileStore = inject(pocketBaseUserProfileStore);
}
