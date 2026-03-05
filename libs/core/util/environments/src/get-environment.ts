import { inject } from '@angular/core';
import { EnvironmentPocketBase } from './environment';
import { POCKETBASE_ENVIRONMENT } from './environment.token';

export const getEnvironment = (): EnvironmentPocketBase => inject(POCKETBASE_ENVIRONMENT);
