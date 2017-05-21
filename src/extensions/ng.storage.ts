import { Injectable } from '@angular/core';
import { LocalStorageService, ILocalStorageServiceConfig } from 'angular-2-local-storage';

export interface NgStorageConfig extends ILocalStorageServiceConfig { }

@Injectable()
export class NgStorageServcie extends LocalStorageService {
  constructor(config: ILocalStorageServiceConfig) {
    super(config);
  }
}
