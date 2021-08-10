import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { ElasticService } from '../../core/services/elastic/elastic.service';
import { Subscription } from 'rxjs';
import { ElectronService } from '../../core/services/electron/electron.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MatMenuTrigger } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';
// import { OsService } from '../core/services/os/os.service';
// import { WebsocketService } from '../core/services/websocket/websocket.service';



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


    // this.platform = this.os.osInfo().platform;

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
  }

  isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  async openFileLocal(path) {
    // this.LoggerService.writeToFailLogger('LOW', path, 'SearchResult-openFile')

    // console.log(path);

    path = path.replace(/\\/g, "/");
    console.log('path ' + path);

    let openRes = await this.electron.shell.openPath(path);

    if (openRes === "") console.log('File opened');
    else {
      console.log('File did not opened');
      this.translate.get('PAGES.ALERT.CANT_OPEN').subscribe(text => this._snackBar.open(text, 'X', {
        duration: 2000,
      }));
    }
  }

  async openFileLocalDir(path) {
    // this.LoggerService.writeToFailLogger('LOW', path, 'SearchResult-openFile')

    console.log(path);

    path = path.replace(/\\/g, "/");
    console.log('path ' + path);

    await this.electron.shell.showItemInFolder(path);
  }

  private _openMenu(): void {
    this.trigger.openMenu();
  }

  // private _sendPing(filename, filepath): void {
  //   let dialogRef = this.dialog.open(DialogComponent, this.nuser);

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed with result');
  //     console.log(result);
  //     if (!result) {
  //       console.log('Event canceled');
  //       return;
  //     } else {
  //       // let message = {filename: filename, filepath: filepath, userid : result.id };
  //       console.log('Sending message to socket');
  //       console.log({ filename: filename, filepath: filepath, userDestination: result.userid });
  //       // this.ws.sendPing({ filename: filename, filepath: filepath, userDestination: result.userid });
  //     }
  //   });
  // }

  ngOnDestroy() {
    this.hitsSubscription.unsubscribe();
  }
}
