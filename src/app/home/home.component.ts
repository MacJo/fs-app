import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  cssStyle: string;
  themePath: string;
  authVal = false;

  constructor(private router: Router, @Inject(LOCAL_STORAGE) private storage: StorageService, 
  private snackBar: MatSnackBar, private translate: TranslateService) { }

  ngOnInit(): void {
    
    const theme = this.storage.get('theme');
    const defThemePath = 'assets/themes/classic/';
    const defCss = 'light';

    if(theme === 'classic') {
      this.cssStyle = 'light';
      this.themePath = defThemePath || 'assets/themes/classic/';
    }
    if(theme === 'darkmode') {
      this.cssStyle = 'dark';
      this.themePath = defThemePath || 'assets/themes/darkmode/';
    }
  }

  // OBSOLETE
  verifySettings(): void{
    const id = this.storage.get('id');
    const apiKey = this.storage.get('apiKey');
    const appmode = this.storage.get('appmode');

    if (!id || !apiKey || !appmode) {  
      // this.router.navigateByUrl('/settings');
      this.storage.set('first_login', true);

      //init necessary data for first time start
      this.storage.set('theme', 'classic');
      this.storage.set('searchTimeline', {start:'2019-10-01',end:'now',archive:false,departments:[]});
      this.storage.set('available-departments', [""]);
      this.storage.set('theme', 'classic');

      this.translate.get('PAGES.ALERT.SETTINGS_MISSING').subscribe(text => this.snackBar.open(text, 'X', {
        duration: 2000,
      }));
      
    } else {
      this.storage.set('first_login', false);
    }
  }
}
