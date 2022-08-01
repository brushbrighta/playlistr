import { InjectionToken } from '@angular/core';

export interface IEnvironmentService {
  isStaticApp: boolean;
}

export const ANGULAR_ENVIRONMENT_SERVICE =
  new InjectionToken<IEnvironmentService>('ANGULAR_ENVIRONMENT_SERVICE');
