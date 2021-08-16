import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';

import { SearchResultComponent } from './search-result.component';

describe('SearchResultComponent', () => {
  let component: SearchResultComponent;
  let fixture: ComponentFixture<SearchResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchResultComponent ],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        MatDialogModule,
        TranslateModule.forRoot({
          loader:{
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [TranslateService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  ///// UI TESTS /////
  // TEST ANIMATION TO RESULTS
  it('should create searchresult animation', () => {
    component.hits = null;
    fixture.detectChanges();

    const container = document.getElementById('wait-animation');
    expect(container).toBeTruthy();
  });

  it('should create searchresult container', () => {
    component.hits = ['test', 'test'];
    fixture.detectChanges();

     const container = document.getElementById('result-container');
    expect(container).toBeTruthy();
  });

  // TEST RESULT LIST

  // SHOULD RENDER TR

  // SHOULD RENDER TD LEFT
  
  // SHOULD RENDER TD RIGHT

  // SHOULD RENDER ICON

  // SHOULD RENDER LABELS

  // SHOULD RENDER ITEM DATA

  // SHOULD RENDER THEME

  ///// LOGIC TESTS /////

  // SHOULD OPEN LOCAL FILE

  // SHOULD OPEN LOCAL FOLDER

  // SHOULD SUBSCRIBE TO RESULTS 

  // TEST TRANSLATION TEXTS
});
