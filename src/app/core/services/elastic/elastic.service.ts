import { Inject, Injectable } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { Subject, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OsService } from '../os/os.service';
import Axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ElasticService {

  esIndex: string;
  query = { size: 100, query: {} };
  queryBool = { bool: {} };
  queryMulti = { multi_match: {} };
  queryMust = { must: [] };
  queryMustNot = { must_not: [] };
  queryShould = { should: [] };
  queryWild = { wildcard: {} };

  private apiKey: string;
  private cloudid: string;
  private id: string;
  private appmode: string;

  searchResponse = new BehaviorSubject<any>('');

  constructor(private os: OsService, private _snackBar: MatSnackBar,
    private translate: TranslateService, @Inject(LOCAL_STORAGE) private _storage: StorageService) {

      this.cloudid = this._storage.get('cloudid');
      this.id = this._storage.get('id');
      this.apiKey = this._storage.get('apiKey');
      this.appmode = this._storage.get('appmode');

  }

  async searchForProxy(searchbarvalue: string, customSearchTimeline = null, ) {

    let storageTimeline = this._storage.get('searchTimeline');
    let searchDepartments = this._storage.get('searchDepartments');

    let timeline

    if(customSearchTimeline) {
      timeline = customSearchTimeline  
      if (customSearchTimeline.departments.length == 0) timeline.departments = storageTimeline.departments
    }
    else {
      timeline = storageTimeline;
      timeline.departments = searchDepartments;
    }

    try {
      let body;
      let username;

      if (this.appmode === 'local') username = this.os.username();
      else username = this.id
      
      body = {
        'user': {
          'username': username,
          'password': this.apiKey,
        },
        'timeline' : timeline,
        'searchbar': searchbarvalue
      };

      // console.log(body);

      Axios.post(this.cloudid + 'search', body).then(response => {
        //THIS IS WRONG, PLEASE CORRECT. SHOULD NEVER RETURN EMPTY RESPONSE UNLESS UNKNOWN ERROR
        if (!response.data) {
          console.log('SERVER RESPONSE IS EMPTY, PLEASE CORRECT THIS!')
          this.translate.get('PAGES.SERVER_CODES.503').subscribe(text => this._snackBar.open(text, 'X', {
            duration: 2000,
          }));
        }
        if (response.data.code) {
          if (response.data.code === "501") {
            this.translate.get('PAGES.SERVER_CODES.501').subscribe(text => this._snackBar.open(text, 'X', {
              duration: 2000,
            }));
          }
          if (response.data.code === "503") {
            this.translate.get('PAGES.SERVER_CODES.503').subscribe(text => this._snackBar.open(text, 'X', {
              duration: 2000,
            }));
          }
        }

        this.searchResponse.next(response.data);

      }).catch(error => {
        console.log(error);
        console.log('AXIOS CATCH REAL ERROR');
        this.translate.get('PAGES.ALERT.ES_CONN_FAIL').subscribe(text => this._snackBar.open(text, 'X', {
          duration: 2000,
        }));
      });
    } catch (e) {
      console.log(e);
      console.log('GLOBAL CATCH REAL ERROR');
      this.translate.get('PAGES.ALERT.ES_CONN_FAIL').subscribe(text => this._snackBar.open(text, 'X', {
        duration: 2000,
      }));
    }
  }

  async getDepartments() {
    console.log('getting departments')

    if(!this.cloudid) return;

    try {
      let body;

      let username: string;

      if (this.appmode === 'local') username = this.os.username();
      else username = this.id

      body = {
        'user': {
          'username': username,
          'password': this.apiKey,
        }
      };

      Axios.post(this.cloudid + 'available-departments', body).then(response => {
        // console.log(response.data);
        this._storage.set('available-departments', response.data);
      }).catch(error => {
        console.log(error);
        console.log('AXIOS CATCH REAL ERROR');
        this.translate.get('PAGES.ALERT.ES_CONN_FAIL').subscribe(text => this._snackBar.open(text, 'X', {
          duration: 2000,
        }));
      });
    } catch (e) {
      console.log(e);
      console.log('GLOBAL CATCH REAL ERROR');
      this.translate.get('PAGES.ALERT.ES_CONN_FAIL').subscribe(text => this._snackBar.open(text, 'X', {
        duration: 2000,
      }));
    }
  }
}
