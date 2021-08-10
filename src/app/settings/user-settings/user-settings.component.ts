import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from '../../core/services';


@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  apiKey: string;
  id: string;
  cloudid: string;
  appmode: string;
  theme_ui: string

  es_url: string;
  es_index: string;
  theme: boolean;

  showInfo: boolean;

  /*excluded*/
  pc_name: string;
  os_user: string;
  dirPath: string
  num_of_results: number;

  templateTheme: string;
  themePath: string;
  cssStyle: string;
  templatePath: string;

  authfilePath: string;
  setts;
  settingsSubscription: Subscription;


  constructor(@Inject(LOCAL_STORAGE) private _storage: StorageService, 
    private router: Router, private electron: ElectronService,
    private _snackBar: MatSnackBar, private translate: TranslateService) { }

  ngOnInit(): void {
    this.setTheme();

    this.showInfo = false;   
    this.id = this._storage.get('id');
    this.appmode = this._storage.get('appmode');
    this.apiKey = this._storage.get('apiKey');
    this.dirPath = this._storage.get('dirPath');

    let theme = this._storage.get('theme_ui')
    let defThemePath = 'assets/themes/classic_theme/';

    if (theme === 'classic') {
      this.cssStyle = 'light';
      this.templatePath = 'assets/themes/classic_theme/';
    }
    if (theme === 'darkmode') {
      this.cssStyle = 'dark';
      this.templatePath = 'assets/themes/darkmode_theme/';
    }
    else this.templatePath = defThemePath;

    if(this.appmode === 'local') {
      this.showInfo = true;
      this.os_user = this.electron.os.userInfo().username;
    }
  }

  setTheme(): void {
    let theme = this._storage.get('theme_ui')
    let defThemePath = 'assets/themes/classic_theme/';
    let defCss = 'light';

    if (theme === 'classic') {
      this.cssStyle = 'light';
      this.themePath = 'assets/themes/classic_theme/';
      this.theme = false;
    }
    else if (theme === 'darkmode') {
      this.cssStyle = 'dark';
      this.themePath = 'assets/themes/darkmode_theme/';
      this.theme = true;
    }
    else {
      this.cssStyle = defCss;
      this.themePath = defThemePath;
      this.theme = false;
    }
  }

  getFileAuth(eventTarget: EventTarget): void {

    console.log(eventTarget);
    
    // console.log('updating user data settings');
    
    // // console.log(file);
    // let path = file[0].path;
    // path = path.toString();;

    // if (this.electron.fs.existsSync(path)) {
    //   this.electron.fs.readFile(path, 'UTF8', (err, data) => {
    //     if (err) {
    //       this.translate.get('PAGES.ALERT.AUTH_UPLOAD_ERROR').subscribe(text => this._snackBar.open(text, 'X', {
    //         duration: 2000,
    //       }));
    //       console.log(err);
    //     }
    //     else if (data) {
    //       data = JSON.parse(data)

    //       if (!data["a"] || !data["b"] || !data["c"] || !data["e"]) {
    //         this.translate.get('PAGES.ALERT.AUTH_FILE_ERROR').subscribe(text => this._snackBar.open(text, 'X', {
    //           duration: 2000,
    //         }));
    //       } else {
    //         this._change('id', this.convertFromHex(data["a"]));
    //         this._change('apiKey', this.convertFromHex(data["b"]));
    //         this._change('cloudid', this.convertFromHex(data["c"]));
    //         this._change('appmode', this.convertFromHex(data["e"]));

    //         this.id = this.convertFromHex(data["a"]);
    //         this.apiKey = this.convertFromHex(data["b"])
    //         this.cloudid = this.convertFromHex(data["c"])
    //         this.appmode =  this.convertFromHex(data["e"])

    //         console.log('new data ' + this.id + ' ' + this.apiKey);
            

    //         this.translate.get('PAGES.SETTINGS.SETTINGSSAVED').subscribe(text => this._snackBar.open(text, 'X', {
    //           duration: 1000,
    //         }));
    //       }
    //     }
    //   });
    // } else {
    //   console.log('Not able to find Auth file for user!');
    //   this.translate.get('PAGES.ALERT.AUTH_FILE_NOT_FOUND').subscribe(text => this._snackBar.open(text, 'X', {
    //     duration: 2000,
    //   }));
    // }
  }

  _change(ligne, value): void {
    this._storage.set(ligne, value);
  }

  _changeTheme(): void { //button switch
    (this.theme) ? this._storage.set('theme_ui', 'darkmode') : this._storage.set('theme_ui', 'classic');
    this.setTheme();
  }

  _changeShowInfo(){
    this.showInfo = !this.showInfo;
  }

  _apply(): void {
    if (!this.id || !this.apiKey || !this.appmode) {
      console.log('Missing data in settings form');
      if (!this.dirPath) {
        this.translate.get('PAGES.ALERT.DIRPATH_MISSING').subscribe(text => this._snackBar.open(text, 'X', {
          duration: 2000,
        }));
      } else {
        this.translate.get('PAGES.ALERT.AUTH_FILE_ERROR').subscribe(text => this._snackBar.open(text, 'X', {
          duration: 2000,
        }));
      }
    } else {
      this._storage.set('first_login', false);
      this.router.navigateByUrl('/home');
    }
  }

  _reset(): void {
    this._storage.remove('cloudid');
    this._storage.remove('apiKey');
  }

  convertFromHex(hex) {
    let str = '';
    hex = hex.toString();//force conversion
    for (let i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }

}
