import { inject, Injectable, TemplateRef } from '@angular/core';
import {
  CreateHotToastRef,
  HotToastService,
  ToastOptions,
  ToastPosition,
} from '@ngxpert/hot-toast';
import { Notification } from '@plastik/shared/notification/entities';

@Injectable({
  providedIn: 'root',
})
export class SharedNotificationUiHotToastService {
  readonly #toast = inject(HotToastService);

  /**
   * @description Shows a notification using hot-toast and returns its ref for in-place updates.
   * @param {Notification} notification The notification configuration.
   * @param {TemplateRef<unknown>} template The custom template used to render the notification.
   * @returns {CreateHotToastRef<unknown> | undefined} The created toast ref, or undefined when no template is given.
   */
  show(
    notification: Notification,
    template: TemplateRef<unknown>
  ): CreateHotToastRef<unknown> | undefined {
    const { type, duration, verticalPosition, horizontalPosition, containerClass, action, id } =
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
      duration: duration || 5000,
      position,
      className: `type-${type.toLowerCase()}`,
      dismissible: !!action,
    };

    // The store-assigned stable id lets hot-toast track this toast and keep it under visibleToasts.
    if (id) {
      configuration.id = id;
    }

    if (containerClass) {
      configuration.className += ` ${containerClass}`;
    }

    if (template) {
      return this.#toast.show(template, configuration);
    }

    return undefined;
  }

  close(): void {
    this.#toast.close();
  }
}
