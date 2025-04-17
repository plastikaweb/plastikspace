import { provideExperimentalZonelessChangeDetection, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT } from '@plastik/core/environments';

import { ImageKitService } from './image-kit.service';

/**
 * @description A environment service mock function to add to providers TestBed array.
 * @returns { Provider } The Provider ready to be added to providers array in modules or standalone components.
 */
function provideEnvironmentMock(): Provider {
  return {
    provide: ENVIRONMENT,
    useValue: {
      production: false,
      name: 'my-app',
      apiUrl: 'https://api',
      firebase: {
        storageBucket: 'my-app.appspot.com',
      },
      imageKit: {
        endpoint: 'https://ik.imagekit.io/my-app',
      },
    },
  };
}

describe('ImageKitService', () => {
  let service: ImageKitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideExperimentalZonelessChangeDetection(),
        ImageKitService,
        provideEnvironmentMock(),
      ],
    });
    service = TestBed.inject(ImageKitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
