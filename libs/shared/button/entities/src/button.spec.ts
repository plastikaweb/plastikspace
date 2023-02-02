import { buttonHasALinkGuard } from './button';
import { buttonAsLinkMock, buttonMock } from './button.mock';

describe('Button Entities', () => {
  it('should run buttonHasALinkGuard to determine if button configuration is of type link', () => {
    let isALinkType = buttonHasALinkGuard(buttonMock);
    expect(isALinkType).toBeFalsy();
    isALinkType = buttonHasALinkGuard(buttonAsLinkMock);
    expect(isALinkType).toBeTruthy();
  });
});
