import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ElectronService } from '../../core/services';
import { UserObj } from '../../shared/typings/settings'
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit  {

  user: UserObj;

  apiKey: string;
  id: string;
  cloudid: string;
  appmode: string;
  
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
    private electron: ElectronService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.setTheme();

    this.showInfo = false;
  }

  setTheme(): void {
    let theme = this.storage.get('theme_ui')
    
    if (theme === 'classic') {
      this.cssStyle = 'light';
      this.themePath = 'assets/themes/classic_theme/';
      this.themeInputValue = false;
    }
    else if (theme === 'darkmode') {
      this.cssStyle = 'dark';
      this.themePath = 'assets/themes/darkmode_theme/';
      this.themeInputValue = true;
    }
  }

  getFileAuth(file): void {
    
    let nfile : File = file[0];
    let path = nfile.path;
    
    path = path.toString();

    if (this.electron.fs.existsSync(path)) {
      this.electron.fs.readFile(path, 'UTF8', (err, data) => {
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
            this._change('id', this.convertFromHex(data["a"]));
            this._change('apiKey', this.convertFromHex(data["b"]));
            this._change('cloudid', this.convertFromHex(data["c"]));
            this._change('appmode', this.convertFromHex(data["e"]));

            this.id = this.convertFromHex(data["a"]);
            this.apiKey = this.convertFromHex(data["b"])
            this.cloudid = this.convertFromHex(data["c"])
            this.appmode =  this.convertFromHex(data["e"])

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
    (this.themeInputValue) ? this.storage.set('theme_ui', 'darkmode') : this.storage.set('theme_ui', 'classic');
    this.setTheme();
  }

  // not necessary anymore
  _changeShowInfo(){
    this.showInfo = !this.showInfo;
  }

  convertFromHex(hex) {
    let str = '';
    hex = hex.toString();
    for (let i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

}
