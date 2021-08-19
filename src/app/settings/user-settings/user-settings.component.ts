import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { Subscription } from 'rxjs';
import { Licence } from '../../shared/typings/settings';
import { SettingsService } from '../../core/services/settings/settings.service';
import { FileAuthService } from '../../core/services/auth/file-auth/file-auth.service';

interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit  {

  username: string;
  appmode: string;

  lcc: Licence;
  id: string;
  
  es_url: string;
  es_index: string;
  
  showInfo: boolean;
  
  themeInputValue: boolean;
  templateTheme: string;
  themePath: string;
  cssStyle: string;

  authfilePath: string;
  setts;
  settingsSubscription: Subscription;


  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private settings: SettingsService,
  private fileAuth: FileAuthService) {}

  ngOnInit(): void {
    const lcc: Licence = this.storage.get('lcc')
    
    this.username = lcc.username;
    this.appmode = lcc.appmode;

    this.setTheme();
    
    this.showInfo = (this.settings.isLogin()) ? true : false; 
  }

  setTheme(): void {
    let theme = this.storage.get('theme')

    if (theme === 'classic') {
      this.cssStyle = 'light';
      this.themePath = 'assets/themes/classic/';
      this.themeInputValue = false;
    }
    else if (theme === 'darkmode') {
      this.cssStyle = 'dark';
      this.themePath = 'assets/themes/darkmode/';
      this.themeInputValue = true;
    }
  }

  getFileAuth($event): void {
    const files :FileList = $event.target.files;
    const filepath = files[0].path.toString();

    this.fileAuth.authByFile(filepath)
  }

  doLogin(authCred){
    // implement other auth service
  }

  _changeTheme(): void {
    (this.themeInputValue) ? this.storage.set('theme', 'darkmode') : this.storage.set('theme', 'classic');
    this.setTheme();
  }



}
