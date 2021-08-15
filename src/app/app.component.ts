import { Component, NgZone, OnInit } from '@angular/core';
import { ElectronService } from './core/services/electron/electron.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private electronService: ElectronService, private translate: TranslateService, 
    private ngZone: NgZone, private router: Router) {
    this.translate.setDefaultLang('en');

    // Get and set app language
    const sysLang = navigator.language.split('-');

    if (sysLang[0] === 'en') translate.setDefaultLang('en');
    if (sysLang[0] === 'fr') translate.setDefaultLang('fr');
    if (sysLang[0] === 'de') translate.setDefaultLang('de');
    if (sysLang[0] === 'pt') translate.setDefaultLang('pt');
    else translate.setDefaultLang('en');

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Run in electron');
      console.log('Electron ipcRenderer', this.electronService.ipcRenderer);
      console.log('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.log('Run in browser');
    }
  }

  ngOnInit() {
    this.electronService.ipcRenderer.on('goto-settings', (event, arg) => {
      this.ngZone.run(() => {
        this.router.navigate(['/settings']);
      });
    });
  }
}
