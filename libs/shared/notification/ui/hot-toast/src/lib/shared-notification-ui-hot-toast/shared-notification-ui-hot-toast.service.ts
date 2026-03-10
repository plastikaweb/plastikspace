import { inject, Injectable, TemplateRef } from '@angular/core';
import { HotToastService, ToastOptions, ToastPosition } from '@ngxpert/hot-toast';
import { Notification } from '@plastik/shared/notification/entities';

@Injectable({
  providedIn: 'root',
})
export class SharedNotificationUiHotToastService {
  readonly #toast = inject(HotToastService);

  /**
   * @description Shows a notification using hot-toast.
   * @param {Notification} notification The notification configuration.
   * @param {TemplateRef<unknown>} template Optional custom template to render the notification.
   */
  show(
    notification: Notification,
    template: TemplateRef<unknown>
    // onClose?: (data: unknown) => void
  ): void {
    const { type, duration, verticalPosition, horizontalPosition, containerClass, action, name } =
      notification;

    const vPos = verticalPosition || 'bottom';
    const hPos = horizontalPosition || 'center';

    let position: ToastPosition;

    if (vPos === 'top') {
      if (hPos === 'start' || hPos === 'left') {
        position = 'top-left';
      } else if (hPos === 'end' || hPos === 'right') {
        position = 'top-right';
      } else {
        position = 'top-center';
      }
    } else {
      if (hPos === 'start' || hPos === 'left') {
        position = 'bottom-left';
      } else if (hPos === 'end' || hPos === 'right') {
        position = 'bottom-right';
      } else {
        position = 'bottom-center';
      }
    }

    const configuration: ToastOptions<void> = {
      id: name,
      duration: duration || 5000,
      position,
      className: `type-${type.toLowerCase()}`,
      dismissible: !!action,
    };

    if (containerClass) {
      configuration.className += ` ${containerClass}`;
    }

    if (template) {
      this.#toast.show(template, configuration);
      // toast.afterClosed.subscribe(data => {
      //   if (onClose) {
      //     onClose(data);
      //   }
      // });
    }
  }

  close(): void {
    this.#toast.close();
  }
}
