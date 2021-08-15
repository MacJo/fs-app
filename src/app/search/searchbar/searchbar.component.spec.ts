import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HomeComponent } from '../../home/home.component';
import { SettingsComponent } from '../../settings/settings.component';

import { SearchbarComponent } from './searchbar.component';

describe('SearchbarComponent', () => {
  let component: SearchbarComponent;
  let fixture: ComponentFixture<SearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchbarComponent ],
      imports: [
        MatSnackBarModule,
        MatAutocompleteModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          {path: '', component: HomeComponent}, 
          {path: 'settings', component: SettingsComponent}
        ]),
        TranslateModule.forRoot({
          loader: {
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
    fixture = TestBed.createComponent(SearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  // TEST UI //

  it('should create searchbar nav container', () => {
    const container = document.getElementById('nav-container');
    expect(container).toBeTruthy();
  });

  it('should have placeholder "Search"', () => {
    const placeholder = (<HTMLInputElement>document.getElementById('searchbar')).placeholder;
    expect(placeholder).toBe('PAGES.SETTINGS.SEARCH');
  })

  it('should have placeholder "Department"', () => {
    component.customSearchState = true;
    fixture.detectChanges();

    let placeholder = (<HTMLInputElement>document.getElementById("input-department")).placeholder;
    expect(placeholder).toBe("PAGES.SETTINGS.INPUT-DEPARTMENT");
  })

  it('should create chips container ', () => {
    component.customSearchState = true;
    
    fixture.detectChanges();
    let chipCon = document.getElementById("chips-container");
    
    fixture.detectChanges();

    expect(chipCon).toBeTruthy();
  });

  it('should create date-start & date-end', () => {
    component.customSearchState = true;
    
    fixture.detectChanges();
    let dateStart = document.getElementById("date-start");
    let dateStartlabel = document.getElementById("date-start-label");
    let dateEnd = document.getElementById("date-end");
    let dateEndlabel = document.getElementById("date-end-label");
    
    fixture.detectChanges();

    expect(dateStart).toBeTruthy();
    expect(dateEnd).toBeTruthy();

    expect(dateStartlabel).toBeTruthy();
    expect(dateEndlabel).toBeTruthy();
  });

  it('should create chips container ', () => {
    component.customSearchState = true;
    
    fixture.detectChanges();
    const chipCon = document.getElementById("chips-container");
    
    fixture.detectChanges();

    expect(chipCon).toBeTruthy();
  });

  it('should create department chips ', () => {
    component.customSearchState = true;
    
    fixture.detectChanges();
    const chipList = document.getElementById("chip-list");
    
    fixture.detectChanges();

    expect(chipList).toBeTruthy();
  });

  // TEST LOGIC //

  it('search a word - search()', () => {
    component.searchbar = "Hello";
    fixture.detectChanges();
    
    const result = component._search()
    expect(result).toBeTrue();
  });

  it('search twice the same word - search()', () => {
    component.searchbar = "Hello";
    fixture.detectChanges();
    component._search()
    fixture.detectChanges();
    
    const search2 = component._search()
    expect(search2).toBeFalse();
  });

  it('search twice the same word and a new word - search()', () => {
    component.searchbar = "Hello";
    fixture.detectChanges();
    
    component._search()
    fixture.detectChanges();
    
    component._search()
    component.searchbar = "Hello World!";
    fixture.detectChanges();
    
    const search3 = component._search();
    expect(search3).toBeTrue();
  });

  it('should change search state - TRUE | FALSE', () => {
    
    component.customSearchState = true;
    component.changeCustomSearchState();
    fixture.detectChanges();

    expect(component.customSearchState).toBe(false);

    component.customSearchState = false;
    component.changeCustomSearchState();
    fixture.detectChanges();

    expect(component.customSearchState).toBe(true);
  });

  it('should change archive search state', () => {
    let $event = {
      checked:true
    };

    const result = component.changeArchive($event)

    expect(result).toBeTrue();

    $event.checked = false;
    const result2 = component.changeArchive($event)

    expect(result2).toBeFalse();
  })

  it('should change timeline', () => {
    let $event = {
      checked:true
    };

    const result = component.changeOptionalTimeline($event)

    expect(result).toBeTrue();

    $event.checked = false;
    const result2 = component.changeOptionalTimeline($event)

    expect(result2).toBeFalse();
  })

  it('should change dates', () => {
    let $event = {
      srcElement: {
        value: '12-08-1990'
      }
    };

    component.changeDate('start', $event)
    component.changeDate('end', $event)

    expect(component.optionalTimeline.start).toBe($event.srcElement.value);
    expect(component.optionalTimeline.end).toBe($event.srcElement.value);
  })

});
