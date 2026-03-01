import { inject } from '@angular/core';
import { POCKETBASE_INSTANCE } from '@plastik/core/api-pocketbase';
import { SendOptions } from 'pocketbase';
import { activityStore } from '../+state/activity.store';

let activeRequest = 0;
const debounceTime = 100;
let timer: unknown | number = null;

/**
 * Interceptor to track activity based on active requests.
 *
 * This interceptor tracks the number of active requests to the PocketBase API.
 * When the number of active requests reaches zero, it debounces the activity
 * state update to avoid frequent state changes.
 */
export function pocketBaseActivityInterceptor() {
  const store = inject(activityStore);
  const pb = inject(POCKETBASE_INSTANCE);

  const originalSend = pb.send;

  pb.send = async function <T = unknown>(path: string, params?: SendOptions): Promise<T> {
    const headers = params?.headers || {};
    const requireGlobalLoading = headers['require-global-loading'] === 'true';

    if (!requireGlobalLoading) {
      return originalSend.call(pb, path, params as SendOptions) as Promise<T>;
    }

    if (activeRequest === 0) {
      if (timer !== null) {
        clearTimeout(timer as number);
      }
      timer = setTimeout(() => {
        if (activeRequest > 0) {
          store.setActivity(true);
        }
      }, debounceTime);
    }
    activeRequest++;

    try {
      const result = await (originalSend.call(pb, path, params as SendOptions) as Promise<T>);
      return result;
    } finally {
      activeRequest--;
      if (activeRequest <= 0) {
        activeRequest = 0;
        clearTimeout(timer as number);
        store.setActivity(false);
      }
    }
  };
}
