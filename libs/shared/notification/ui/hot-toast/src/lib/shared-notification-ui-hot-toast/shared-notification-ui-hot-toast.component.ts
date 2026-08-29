import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnDestroy,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { CreateHotToastRef } from '@ngxpert/hot-toast';
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
export class SharedNotificationUiHotToastComponent implements OnDestroy {
  readonly #toastService = inject(SharedNotificationUiHotToastService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #notificationGlobalConfig = inject(NOTIFICATION_TYPES_CONFIG);
  readonly #notificationGlobalPosition = inject(NOTIFICATION_POSITION);

  #toastRef: CreateHotToastRef<unknown> | null = null;

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

      if (!notification || !template) {
        return;
      }

      // Same id with refreshed content: update the live toast in place rather than stacking a
      // duplicate (hot-toast ignores a repeat show() for an existing id).
      if (this.#toastRef) {
        this.#toastRef.updateMessage(template);

        return;
      }

      this.#toastRef = this.#toastService.show(notification, template) ?? null;
      this.#toastRef?.afterClosed.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe(() => {
        // Auto-dismiss/close removes the entry from the store so the array never leaks.
        this.#toastRef = null;
        this.sendDismiss.emit(notification);
      });
    });
  }

  ngOnDestroy(): void {
    // If the toast outlives the component (e.g. the store cleared everything), close it.
    this.#toastRef?.close();
  }
}
