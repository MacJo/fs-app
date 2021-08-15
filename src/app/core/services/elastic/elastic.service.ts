import { Inject, Injectable } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { Subject, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OsService } from '../os/os.service';
import Axios from 'axios';
import { RequestBody } from '../../../shared/typings/fs-server';

@Injectable({
  providedIn: 'root'
})
export class ElasticService {

  searchResponse = new BehaviorSubject<any>('');

  private apiKey: string;
  private cloudid: string;
  private id: string;
  private appmode: string;

  

  constructor(private os: OsService, private snackBar: MatSnackBar,
    private translate: TranslateService, @Inject(LOCAL_STORAGE) private storage: StorageService) {

      this.cloudid = this.storage.get('cloudid');
      this.id = this.storage.get('id');
      this.apiKey = this.storage.get('apiKey');
      this.appmode = this.storage.get('appmode');
  }

  async searchForProxy(searchbarvalue: string, customSearchTimeline = null, ) {

    const defaultTimeline = this.storage.get('searchTimeline');
    const searchDepartments = this.storage.get('searchDepartments');

    let timeline;

    if(customSearchTimeline) {
      timeline = customSearchTimeline;
      if (customSearchTimeline.departments.length === 0) timeline.departments = defaultTimeline.departments;
    }
    else {
      timeline = defaultTimeline;
      timeline.departments = searchDepartments;
    }

    try {
      let username;

      if (this.appmode === 'local') username = this.os.username();
      else username = this.id;
      
      const body = {
        user: {
          username,
          password: this.apiKey,
        },
        timeline, // customSearchTimeline || defaultTimeline
        searchbar: searchbarvalue
      };

      Axios.post(this.cloudid + 'search', body).then(response => {
        //THIS IS WRONG, PLEASE CORRECT. SHOULD NEVER RETURN EMPTY RESPONSE UNLESS UNKNOWN ERROR
        if (!response.data) {
          this.translate.get('PAGES.SERVER_CODES.503').subscribe(text => this.snackBar.open(text, 'X', {
            duration: 2000,
          }));
        }
        if (response.data.code) {
          if (response.data.code === '501') {
            this.translate.get('PAGES.SERVER_CODES.501').subscribe(text => this.snackBar.open(text, 'X', {
              duration: 2000,
            }));
          }
          if (response.data.code === '503') {
            this.translate.get('PAGES.SERVER_CODES.503').subscribe(text => this.snackBar.open(text, 'X', {
              duration: 2000,
            }));
          }
        }

        this.searchResponse.next(response.data);

      }).catch(error => {
        console.log(error);
        console.log('AXIOS CATCH REAL ERROR');
        this.translate.get('PAGES.ALERT.ES_CONN_FAIL').subscribe(text => this.snackBar.open(text, 'X', {
          duration: 2000,
        }));
      });
    } catch (e) {
      this.translate.get('PAGES.ALERT.ES_CONN_FAIL').subscribe(text => this.snackBar.open(text, 'X', {
        duration: 2000,
      }));
    }
  }

  async getDepartments() {
    let body: RequestBody;

    if(!this.cloudid) return;

    try {
      let username: string;

      if (this.appmode === 'local') username = this.os.username();
      else username = this.id;

      body = {
        user: {
        username,
        password: this.apiKey,
        }
      };

      Axios.post(this.cloudid + 'available-departments', body).then(response => {
        // console.log(response.data);
        this.storage.set('available-departments', response.data);
      }).catch(error => {
        this.translate.get('PAGES.ALERT.ES_CONN_FAIL').subscribe(text => this.snackBar.open(text, 'X', {
          duration: 2000,
        }));
      });
    } catch (e) {
      this.translate.get('PAGES.ALERT.ES_CONN_FAIL').subscribe(text => this.snackBar.open(text, 'X', {
        duration: 2000,
      }));
    }
  }
}
