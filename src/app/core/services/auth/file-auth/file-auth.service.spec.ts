import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { FileAuthService } from './file-auth.service';

describe('FileAuthService', () => {
  let service: FileAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })]
    });
    service = TestBed.inject(FileAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
