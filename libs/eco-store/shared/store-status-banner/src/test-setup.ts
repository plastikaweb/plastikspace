import { toHaveNoViolations } from 'jest-axe';
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

expect.extend(toHaveNoViolations);

setupZoneTestEnv();
