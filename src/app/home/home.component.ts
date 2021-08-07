import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ElasticService } from '../core/services/elastic/elastic.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  cssStyle: string;
  themePath: string;
  authVal: boolean = false;

  constructor(private router: Router, @Inject(LOCAL_STORAGE) private _storage: StorageService, private elastic: ElasticService,
  private _snackBar: MatSnackBar, private translate: TranslateService) { }

  ngOnInit(): void {
    
    let theme = this._storage.get('theme_ui')
    let defThemePath = 'assets/themes/classic_theme/';
    let defCss = 'light';

    if(theme === 'classic') {
      this.cssStyle = 'light';
      this.themePath = defThemePath || 'assets/themes/classic_theme/';
    }
    if(theme === 'darkmode') {
      this.cssStyle = 'dark';
      this.themePath = defThemePath || 'assets/themes/darkmode_theme/';
    }
    else {
      this.cssStyle = defCss;
      this.themePath = defThemePath;
    }

    this.verifySettings();
  }

  verifySettings(): void{
    let id = this._storage.get('id');
    let apiKey = this._storage.get('apiKey');
    let appmode = this._storage.get('appmode');

    if (!id || !apiKey || !appmode) {  
      this.router.navigateByUrl('/settings');
      this._storage.set('first_login', true)

      //init necessary data for first time start
      this._storage.set('theme_ui', 'classic');
      this._storage.set('searchTimeline', {"start":"2019-10-01","end":"now","archive":false,"departments":[]});
      this._storage.set('available-departments', [""]);
      this._storage.set('theme_ui', 'classic');

      this.translate.get('PAGES.ALERT.SETTINGS_MISSING').subscribe(text => this._snackBar.open(text, 'X', {
        duration: 2000,
      }));
      
    } else {
      this._storage.set('first_login', false)
      this.updateDepartments();
    }
  }

  updateDepartments(): void{
    this.elastic.getDepartments();
  }

}
