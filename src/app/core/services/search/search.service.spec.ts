import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach( async() => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })]
    });
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

    // TEST SEARCHFORPROXY()
  // // TEST SEARCHBARVALUE
  // // TEST CUSTOM TIMELINE
  // // TEST APPMODE (CLOUD/LOCAL)
  // // TEST BODY BEING SENT IN REQUEST
  // // TEST ERROR ON REQUEST
  // // TEST ERROR ON CATCH

  // TEST GET DEPARTMENTS
  // // TEST APPMODE (CLOUD/LOCAL)
  // // TEST BODY BEING SENT IN REQUEST
  // // TEST ERROR ON REQUEST
  // // TEST ERROR ON CATCH
});
