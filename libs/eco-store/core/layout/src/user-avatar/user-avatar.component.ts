import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { PocketBaseUser } from '@plastik/core/entities';
import { PocketBaseImageUrlPipe } from '@plastik/eco-store/shared/utils';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import { NgClass } from '@angular/common';

@Component({
  selector: 'eco-user-avatar',
  standalone: true,
  imports: [SharedImgContainerComponent, PocketBaseImageUrlPipe, NgClass],
  template: `
    @if (user().avatar) {
      <plastik-img-container
        class="overflow-hidden rounded-full object-cover"
        [ngClass]="avatarClass()"
        [src]="user() | pocketBaseImageUrl: user().avatar"
        [title]="user().name || 'Avatar'"
        [dimensions]="{ width: 60, height: 60 }" />
    } @else {
      <span
        class="text-primary-700 bg-primary-50 flex items-center justify-center rounded-full font-bold"
        [ngClass]="initialsClass()">
        {{ initials() }}
      </span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  readonly user = input.required<PocketBaseUser>();
  readonly initials = input<string | undefined>();
  readonly avatarClass = input<string>('size-6');
  readonly initialsClass = input<string>('size-6 text-xs bg-white');
}
