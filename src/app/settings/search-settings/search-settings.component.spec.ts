import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { TranslateModule ,TranslateFakeLoader, TranslateLoader, TranslateService } from '@ngx-translate/core';

import { SearchSettingsComponent } from './search-settings.component';

describe('SearchSettingsComponent', () => {
  let component: SearchSettingsComponent;
  let fixture: ComponentFixture<SearchSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSettingsComponent ],
      imports:[TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateFakeLoader
        }
      }),
      MatAutocompleteModule],
      providers: [TranslateService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // SHOULD RENDER 2 DATE INPUTS

  // SHOULD RENDER ARCHIVE INPUT

  // SHOULD RENDER CHIP LIST

  // SHOULD RENDER RETURN BUTTON

  // ADD CHIPS TO LIST AND VALIDATE CONTENT

  // TEST INPUT ONCHANGE
});
