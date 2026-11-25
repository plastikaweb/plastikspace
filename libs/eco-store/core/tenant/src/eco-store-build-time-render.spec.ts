import { PLATFORM_ID, REQUEST } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { injectIsBuildTimeRender } from './eco-store-build-time-render';

describe('injectIsBuildTimeRender', () => {
  /**
   * Reads the flag as Angular would on the given platform, rendering the given request.
   * @param { 'server' | 'browser' } platform - Where the app runs.
   * @param { Request | null } request - The request being rendered; `null` in the browser and at build time.
   * @returns { boolean } The flag.
   */
  function isBuildTimeRender(platform: 'server' | 'browser', request: Request | null): boolean {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platform },
        { provide: REQUEST, useValue: request },
      ],
    });

    return TestBed.runInInjectionContext(() => injectIsBuildTimeRender());
  }

  it('is true on the server with no request: the prerender and the route extraction', () => {
    expect(isBuildTimeRender('server', null)).toBe(true);
  });

  it('is false when the server renders a request', () => {
    expect(isBuildTimeRender('server', new Request('https://el-llevat.example.test/botiga'))).toBe(
      false
    );
  });

  it('is false in the browser', () => {
    expect(isBuildTimeRender('browser', null)).toBe(false);
  });
});
