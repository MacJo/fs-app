import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { serverSettings } from '../../../shared/typings/search';
import { authApiOptions, RequestBody } from '../../../shared/typings/fs-server';

import Axios from 'axios'

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchResponse = new BehaviorSubject<any>('');

  private srv: serverSettings;
  private lcc: authApiOptions;
  
  constructor(private snackBar: MatSnackBar, private translate: TranslateService,
    @Inject(LOCAL_STORAGE) private storage: StorageService) {
      this.lcc = this.storage.get('lcc')
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
      const body: RequestBody = {
        user: {
          username: this.lcc.username,
          password: this.lcc.apiKey,  
        },
        timeline,
        searchbar: searchbarvalue
      };

      Axios.post(this.srv.url + 'search', body).then(response => {
        if (!response.data) {
          console.log('SERVER RESPONSE IS EMPTY, PLEASE CORRECT THIS!')
          this.translate.get('PAGES.SERVER_CODES.503').subscribe(text => this.snackBar.open(text, 'X', {
            duration: 2000,
          }));
        }
        if (response.data.code) {
          if (response.data.code === "501") {
            this.translate.get('PAGES.SERVER_CODES.501').subscribe(text => this.snackBar.open(text, 'X', {
              duration: 2000,
            }));
          }
          if (response.data.code === "503") {
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
    try {
      const body: RequestBody = {
        user: {
          username: this.lcc.username,
          password: this.lcc.apiKey,  
        }
      };

      Axios.post(this.srv.url + 'available-departments', body).then(response => {
        this.storage.set('available-departments', response.data);
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

}
