import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { SESSION_STORAGE, StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  theme: string;
  templateTheme: string;
  themePath: string;
  cssStyle: string;
  
  constructor(@Inject(LOCAL_STORAGE) private _storage: StorageService) 
  { }

  ngOnInit(): void {
    let theme = this._storage.get('theme_ui')
    let defThemePath = 'assets/themes/classic_theme/';

    if (theme === 'classic') {
      this.cssStyle = 'light';
      this.themePath = 'assets/themes/classic_theme/';
    } else if (theme === 'darkmode') {
      this.cssStyle = 'dark';
      this.themePath = 'assets/themes/darkmode_theme/';
    } else {
      this.themePath = defThemePath;
    }
  }

}
