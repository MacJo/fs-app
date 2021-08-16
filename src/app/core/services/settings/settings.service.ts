import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { serverSettings, Timeline } from '../../../shared/typings/search';
import { Licence } from '../../../shared/typings/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService{
  
  private firstLogin: boolean;
  private theme: string;

  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {
    this.initStorage();
   }

  isLogin(): boolean{
    return true;
  }

  initStorage(reset: boolean = null): boolean {
    console.log('Init Storage');

      if(!this.storage.has('searchTimeline')) {
        const sT: Timeline = {
          start: '2019-01-01',
          end: 'now',
          archive: false,
          departments: []
        } 
        this.storage.set('searchTimeline', sT);
      }
      
      if(!this.storage.has('lcc')){
        const lcc: Licence = {"id":"","username":"","apiKey":"","url":"https://demo.partiri.cloud/","appmode":""};
        this.storage.set('lcc', lcc);
      }

      if(!this.storage.has('srv')) {
        const srv: serverSettings = { url: ''}
        this.storage.set('srv', srv);
      }

      if(!this.storage.has('first_login')) this.storage.set('first_login', true);

      if(!this.storage.has('theme')) this.storage.set('theme', 'classic');

      return true;
  }

  resetStorage(): boolean {
    return this.initStorage(true);
  }

  private checkStorage(): boolean {
    
    if(this.storage.has('searchTimeline')) return false;

    if(this.storage.has('srv')) return false;

    if(this.storage.has('first_login')) return false;

    if(this.storage.has('theme')) return false;

    return true;
  }

}
