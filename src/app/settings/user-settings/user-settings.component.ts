import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElectronService } from '../../core/services';
import { TranslateService } from '@ngx-translate/core';
import { Licence } from '../../shared/typings/settings';
import { OsService } from '../../core/services/os/os.service';
import { SettingsService } from '../../core/services/settings/settings.service';

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

  apiKey: string;
  id: string;
  cloudid: string;
  
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


  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private translate: TranslateService, 
    private electron: ElectronService, private snackBar: MatSnackBar, private os: OsService, private settings: SettingsService) {
    }

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
    
    if (this.electron.fs.existsSync(filepath)) {
      this.electron.fs.readFile(filepath, 'UTF8', (err, data) => {
        if (err) {
          this.translate.get('PAGES.ALERT.AUTH_UPLOAD_ERROR').subscribe(text => this.snackBar.open(text, 'X', {
            duration: 2000,
          }));
        }
        else if (data) {
          data = JSON.parse(data)

          if (!data["a"] || !data["b"] || !data["c"] || !data["e"]) {
            this.translate.get('PAGES.ALERT.AUTH_FILE_ERROR').subscribe(text => this.snackBar.open(text, 'X', {
              duration: 2000,
            }));
          } else {

            this.lcc = {
              id: this.id = this.convertFromHex(data["a"]),
              username: (this.convertFromHex(data["e"]) === 'local') ? this.os.username() : this.convertFromHex(data["a"]),
              apiKey: this.convertFromHex(data["b"]),
              url: this.convertFromHex(data["c"]),
              appmode: this.convertFromHex(data["e"])
            }

            this.storage.set('lcc', this.lcc)
            
            this.translate.get('PAGES.SETTINGS.SETTINGSSAVED').subscribe(text => this.snackBar.open(text, 'X', {
              duration: 1000,
            }));
          }
        }
      });
    } else {
      this.translate.get('PAGES.ALERT.AUTH_FILE_NOT_FOUND').subscribe(text => this.snackBar.open(text, 'X', {
        duration: 2000,
      }));
    }
  }

  _change(ligne, value): void {
    this.storage.set(ligne, value);
  }

  _changeTheme(): void {
    (this.themeInputValue) ? this.storage.set('theme', 'darkmode') : this.storage.set('theme', 'classic');
    this.setTheme();
  }

  convertFromHex(hex) {
    let str = '';
    hex = hex.toString();
    for (let i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

}
