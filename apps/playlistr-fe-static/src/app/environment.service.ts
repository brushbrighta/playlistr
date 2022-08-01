import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { IEnvironmentService } from '@playlistr/fe/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService implements IEnvironmentService {
  public isStaticApp = !!environment.staticApp;
}
