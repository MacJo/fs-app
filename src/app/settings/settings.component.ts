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
    const theme = this.storage.get('theme');
    const defThemePath = 'assets/themes/classic/';

    if (theme === 'classic') {
      this.cssStyle = 'light';
      this.themePath = 'assets/themes/classic/';
    } else if (theme === 'darkmode') {
      this.cssStyle = 'dark';
      this.themePath = 'assets/themes/darkmode/';
    } else {
      this.themePath = defThemePath;
    }
  }

}
