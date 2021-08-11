import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { ElasticService } from '../../core/services/elastic/elastic.service';
import { Subscription } from 'rxjs';
import { ElectronService } from '../../core/services/electron/electron.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit {

  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  hits: any[];
  hitsSubscription: Subscription;
  totalRes;
  platform;

  templatePath: string;
  cssStyle: string;

  dirPath: string;

  nuser: any;

  constructor(private srcService: ElasticService, @Inject(LOCAL_STORAGE) private _storage: StorageService, 
  private _snackBar: MatSnackBar, private translate: TranslateService, private dialog: MatDialog,
  private electron: ElectronService) { }

  ngOnInit(): void {
    this.hitsSubscription = this.srcService.searchResponse.subscribe((selectedresults) => {
      this.hits = selectedresults.hits;
      this.totalRes = selectedresults.total;
    });

    // used to for variable drive path
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
  }

  // isElectron(): boolean { // NOT NECESSARY
  //   return !!(window && window.process && window.process.type);
  // }

  async openFileLocal(path) {
    path = path.replace(/\\/g, "/");
    let openRes = await this.electron.shell.openPath(path);

    if (openRes !== "") {
      this.translate.get('PAGES.ALERT.CANT_OPEN').subscribe(text => this._snackBar.open(text, 'X', {
        duration: 2000,
      }));
    }
  }

  async openFileLocalDir(path) {
    console.log(path);

    path = path.replace(/\\/g, "/");
    console.log('path ' + path);

    await this.electron.shell.showItemInFolder(path);
  }

  private _openMenu(): void {
    this.trigger.openMenu();
  }

  ngOnDestroy() {
    this.hitsSubscription.unsubscribe();
  }
}
