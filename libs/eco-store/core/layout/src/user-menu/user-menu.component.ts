import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, output, viewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { pocketBaseUserProfileStore } from '@plastik/auth/pocketbase/data-access';
import { EcoUserAvatarComponent } from '../user-avatar/user-avatar.component';

@Component({
  selector: 'eco-user-menu',
  imports: [
    MatMenuModule,
    MatDividerModule,
    MatIconModule,
    RouterLink,
    TranslateModule,
    EcoUserAvatarComponent,
    DatePipe,
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EcoUserMenuComponent {
  protected readonly profileStore = inject(pocketBaseUserProfileStore);

  logoutEvent = output<void>();

  readonly menu = viewChild.required<MatMenu>('userMenu');
  protected readonly isTrial = this.profileStore.isTrial;
  protected readonly isTrialExpired = this.profileStore.isTrialExpired;
  protected readonly trialEndsAtDate = this.profileStore.trialEndsAtDate;
  protected readonly roleIcon = this.profileStore.roleIcon;

  logout(): void {
    this.logoutEvent.emit();
  }
}
