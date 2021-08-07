import { Injectable } from '@angular/core';
import { ElectronService } from '../electron/electron.service';

@Injectable({
  providedIn: 'root'
})
export class OsService {

  constructor(private electron: ElectronService) { }
  osInfo(){
    return {
      'osRelease': this.electron.os.release(),
      'platform': this.electron.os.platform(),
      'hostname': this.electron.os.hostname(),
      'userInfo': this.electron.os.userInfo(),
      'networkInterface': this.electron.os.networkInterfaces()
    }
  }

  username(){
    return this.electron.os.userInfo().username;
  }

  domain(){
    // return (this.electron.os.userInfo().username.split('@', 0) === this.electron.os.userInfo().username.split('@', 1)) ? false : this.electron.os.userInfo().username.split('@', 1);
    let homedirsplit = this.electron.os.userInfo().homedir.split('.');

    if(homedirsplit.length <= 1) return false;
    
    let rest = homedirsplit.length - 1;
    return homedirsplit[rest];
  }
}
