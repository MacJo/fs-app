import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  apiKey: string;
  id: string;
  cloudid: string;
  appmode: string;
  theme_ui: string

  es_url: string;
  es_index: string;
  

  showInfo: boolean;

  /*excluded*/
  pc_name: string;
  os_user: string;
  dirPath: string
  num_of_results: number;

  theme: boolean;
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
    // this.dirPath = this._storage.get('dirPath');

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

    if(this.appmode === 'local') this.os_user = this.electron.os.userInfo().username;
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

}
