import { Component, OnInit, Inject } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';

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
  
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) 
  { }

  ngOnInit(): void {
    const theme = this.storage.get('theme_ui');
    const defThemePath = 'assets/themes/classic_theme/';

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
