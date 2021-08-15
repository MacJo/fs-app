import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
    this.checkStorage()
   }

  isLogin(): boolean{
    return true;
  }

  initStorage(reset: boolean = null): boolean {

    if(!this.checkStorage || reset) {

      if(!this.storage.has('appmode')) this.storage.set('appmode', '');

      if(!this.storage.has('cloudid')) this.storage.set('cloudid', '');

      if(!this.storage.has('_user')) this.storage.set('_user', '');

      if(!this.storage.has('searchSettings')) this.storage.set('searchSettings', '');

      if(!this.storage.has('first_login')) this.storage.set('first_login', '');

      if(!this.storage.has('login')) this.storage.set('login', '');
      
      if(!this.storage.has('theme')) this.storage.set('theme', '');

      this.initStorage();
    } else {
      return true;
    }
  }

  resetStorage(): boolean{
    return this.initStorage(true);
  }

  private checkStorage(): boolean{
    
    if(this.storage.has('appmode')) return false;

    if(this.storage.has('cloudid')) return false;

    if(this.storage.has('_user')) return false;

    if(this.storage.has('searchSettings')) return false;

    if(this.storage.has('first_login')) return false;

    if(this.storage.has('login')) return false;

    if(this.storage.has('theme')) return false;

    return true;
  }
}
