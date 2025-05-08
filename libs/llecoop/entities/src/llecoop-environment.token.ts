import { Environment } from '@plastik/core/environments';

export type LlecoopEnvironment = Environment & {
  useEmulators: boolean;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId?: string;
  };
  imageKit: {
    endpoint: string;
  };
};
