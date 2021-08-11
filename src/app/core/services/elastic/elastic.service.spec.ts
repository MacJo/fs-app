import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { ElasticService } from './elastic.service';

describe('ElasticService', () => {
  let service: ElasticService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })]
    });
    service = TestBed.inject(ElasticService);
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
