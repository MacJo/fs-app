import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { OsService } from '../../os/os.service';
import { Licence } from '../../../../shared/typings/settings';
import { ElectronService } from '../../electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class FileAuthService {

  lcc: Licence;
  constructor(private electron: ElectronService, @Inject(LOCAL_STORAGE) private storage: StorageService, private snackBar: MatSnackBar,
  private translate: TranslateService, private os: OsService) { }

  authByFile(filepath){
    if (this.electron.fs.existsSync(filepath)) {
      this.electron.fs.readFile(filepath, 'UTF8', (err, data) => {
        if (err) {
          this.translate.get('PAGES.ALERT.AUTH_UPLOAD_ERROR').subscribe(text => this.snackBar.open(text, 'X', {
            duration: 2000,
          }));
        } else if (data) {
          data = JSON.parse(data)

          if (!data["a"] || !data["b"] || !data["c"] || !data["e"]) {
            this.translate.get('PAGES.ALERT.AUTH_FILE_ERROR').subscribe(text => this.snackBar.open(text, 'X', {
              duration: 2000,
            }));
          } else {
            this.lcc = {
              id: this.convertFromHex(data["a"]),
              username: (this.convertFromHex(data["e"]) === 'local') ? this.os.username() : this.convertFromHex(data["a"]),
              apiKey: this.convertFromHex(data["b"]),
              url: this.convertFromHex(data["c"]),
              appmode: this.convertFromHex(data["e"])
            }

            this.storage.set('lcc', this.lcc)
            this.translate.get('PAGES.SETTINGS.SETTINGSSAVED').subscribe(text => this.snackBar.open(text, 'X', {
              duration: 1000,
            }));
          }
        }
      });
    } else {
      this.translate.get('PAGES.ALERT.AUTH_FILE_NOT_FOUND').subscribe(text => this.snackBar.open(text, 'X', {
        duration: 2000,
      }));
    }
  }

  convertFromHex(hex) {
    let str = '';
    hex = hex.toString();
    for (let i = 0; i < hex.length; i += 2)
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
  }
}
