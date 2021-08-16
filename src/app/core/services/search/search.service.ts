import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { authApiOptions, authPwdOptions, RequestBody } from '../../../shared/typings/fs-server';
import { serverSettings } from '../../../shared/typings/search';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchResponse = new BehaviorSubject<any>('');

  private srv: serverSettings;
  private lcc: authApiOptions;
  
  constructor(private snackBar: MatSnackBar, private translate: TranslateService,
    @Inject(LOCAL_STORAGE) private storage: StorageService, private http: HttpClient) {
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

      this.http.post(this.srv.url + 'search', body).subscribe(
        (response: any) => {
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
        },
        (error: Error) => {
          this.translate.get('PAGES.ALERT.ES_CONN_FAIL').subscribe(text => this.snackBar.open(text, 'X', {
            duration: 2000,
          }));
        }
      );
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

      this.http.post(this.srv.url + 'available-departments', body).subscribe(
        (response: any) => {
          this.storage.set('available-departments', response.data);
        },
        (error: Error) => {
          this.translate.get('PAGES.ALERT.ES_CONN_FAIL').subscribe(text => this.snackBar.open(text, 'X', {
            duration: 2000,
          }));
        }
      );
    } catch (e) {
      this.translate.get('PAGES.ALERT.ES_CONN_FAIL').subscribe(text => this.snackBar.open(text, 'X', {
        duration: 2000,
      }));
    }
  }
}
