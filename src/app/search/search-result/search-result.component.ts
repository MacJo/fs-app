import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { Subscription } from 'rxjs';
import { ElectronService } from '../../core/services/electron/electron.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
import { SearchService } from '../../core/services/search/search.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy {

  ngOnDestroy() {
    this.hitsSubscription.unsubscribe();
  }
  
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

  hits: any[];
  hitsSubscription: Subscription;
  totalRes;
  platform;

  themePath: string;
  cssStyle: string;

  nuser: any;

  constructor(private search: SearchService, @Inject(LOCAL_STORAGE) private storage: StorageService, 
  private snackBar: MatSnackBar, private translate: TranslateService, private dialog: MatDialog,
  private electron: ElectronService) { }

  ngOnInit(): void {
    this.hitsSubscription = this.search.searchResponse.subscribe((selectedresults) => {
      this.hits = selectedresults.hits;
      this.totalRes = selectedresults.total;
    });

    const theme = this.storage.get('theme');
    const defThemePath = 'assets/themes/classic/';

    if (theme === 'classic') {
      this.cssStyle = 'light';
      this.themePath = 'assets/themes/classic/';
    }
    if (theme === 'darkmode') {
      this.cssStyle = 'dark';
      this.themePath = 'assets/themes/darkmode/';
    }
    else this.themePath = defThemePath;
  }

  // isElectron(): boolean { // NOT NECESSARY
  //   return !!(window && window.process && window.process.type);
  // }

  async openFileLocal(path) {
    path = path.replace(/\\/g, '/');
    const openRes = await this.electron.shell.openPath(path);

    if (openRes !== '') {
      this.translate.get('PAGES.ALERT.CANT_OPEN').subscribe(text => this.snackBar.open(text, 'X', {
        duration: 2000,
      }));
    }
  }

  async openFileLocalDir(path) {
    console.log(path);

    path = path.replace(/\\/g, '/');
    console.log('path ' + path);

    await this.electron.shell.showItemInFolder(path);
  }

  private _openMenu(): void {
    this.trigger.openMenu();
  }

}
