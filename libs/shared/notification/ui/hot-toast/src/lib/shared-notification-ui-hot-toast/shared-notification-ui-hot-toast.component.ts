import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SharedImgContainerComponent } from '@plastik/shared/img-container';
import {
  Notification,
  NOTIFICATION_POSITION,
  NOTIFICATION_TYPES_CONFIG,
} from '@plastik/shared/notification/entities';
import { SharedNotificationUiHotToastService } from './shared-notification-ui-hot-toast.service';

@Component({
  selector: 'plastik-shared-notification-ui-hot-toast',
  imports: [MatIconModule, TranslatePipe, SharedImgContainerComponent],
  templateUrl: './shared-notification-ui-hot-toast.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedNotificationUiHotToastComponent {
  readonly #toastService = inject(SharedNotificationUiHotToastService);
  readonly #notificationGlobalConfig = inject(NOTIFICATION_TYPES_CONFIG);
  readonly #notificationGlobalPosition = inject(NOTIFICATION_POSITION);

  readonly notification = input.required<Notification | null>();

  readonly mergedNotification = computed(() => {
    const notification = this.notification();
    if (!notification) {
      return null;
    }
    return {
      ...this.#notificationGlobalConfig[notification.type],
      ...this.#notificationGlobalPosition,
      ...notification,
    };
  });

  readonly notificationImage = computed(
    () => (this.mergedNotification()?.parameters?.['image'] as string) || null
  );
  readonly notificationName = computed(
    () => (this.mergedNotification()?.parameters?.['name'] as string) || ''
  );

  readonly toastTemplate = viewChild.required<TemplateRef<unknown>>('toastTemplate');
  readonly sendDismiss = output<Notification>();

  constructor() {
    effect(() => {
      const notification = this.mergedNotification();
      const template = this.toastTemplate();

      if (notification && template) {
        this.#toastService.show(notification, template);
      }
    });
  }
}
