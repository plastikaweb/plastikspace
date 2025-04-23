import { LlecoopEnvironment } from '@plastik/llecoop/entities';

export const environment: LlecoopEnvironment = {
  name: 'El Llevat',
  production: true,
  useEmulators: false,
  firebase: {
    apiKey: 'AIzaSyBYAf8AnIFG5XxO2VfQGoW3f3pz1vGdwUY',
    authDomain: 'llecoop-plastikaweb.firebaseapp.com',
    projectId: 'llecoop-plastikaweb',
    storageBucket: 'llecoop-plastikaweb.firebasestorage.app',
    messagingSenderId: '745750777394',
    appId: '1:745750777394:web:9f7c78d49915a55ccab62b',
    measurementId: 'G-67ZESDXEEJ',
  },
  imageKit: {
    endpoint: 'https://ik.imagekit.io/jx7xzmliv6/',
  },
};
