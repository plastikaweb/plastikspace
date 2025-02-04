import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { buttonHasALinkGuard } from './button';
import { buttonAsLinkMock, buttonMock } from './button.mock';

describe('Button Entities', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideExperimentalZonelessChangeDetection()],
    });
  });

  it('should run buttonHasALinkGuard to determine if button configuration is of type link', () => {
    let isALinkType = buttonHasALinkGuard(buttonMock);
    expect(isALinkType).toBeFalsy();
    isALinkType = buttonHasALinkGuard(buttonAsLinkMock);
    expect(isALinkType).toBeTruthy();
  });
});
