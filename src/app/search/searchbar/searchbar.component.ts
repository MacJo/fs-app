import { Component, OnInit, Inject } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { SearchService } from '../../core/services/search/search.service';

export interface Department {
  name: string;
}

export interface Extension {
  name: string;
}

export interface Timeline {
  start: string,
  end: string,
  archive: boolean,
  departments: Department[]
}

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent implements OnInit{

  hints = [];
  searchbar: string;
  oldsearchbar: string;
  searchTouched: boolean;

  listdepartments;

  departmentsCtrl = new FormControl();
  filteredDepartments: Observable<string[]>;

  searchbarEdited: boolean;
  customSearchState = false;

  optionalTimelineState: boolean;
  optionalTimeline: Timeline;

  departments: Department[] = [
  ];

  extensions: Extension[] = [
  ];

  searchBody = {
    quote: [],
    file: [],
    folder: [],
    wildcard: [],
    minus: [],
    general: []
  };

  theme: string;
  defThemePath: string
  cssStyle: string;
  themePath: string;

  //chips module
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  //chip seperator key
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private snackBar: MatSnackBar, private translate: TranslateService, private search: SearchService,
    private router: Router, @Inject(LOCAL_STORAGE) private storage: StorageService){}

  ngOnInit(): void {
    this.listdepartments = this.storage.get('available-departments') || ["N/A"];
    this.theme = this.storage.get('theme')
    this.defThemePath = 'assets/themes/classic/';

    this.optionalTimeline = {
      start:'',
      end: 'now',
      archive: false,
      departments: [],
    };

    if(this.theme === 'classic') {
      this.cssStyle = 'light';
      this.themePath = this.defThemePath || 'assets/themes/classic/';
    }
    if(this.theme === 'darkmode') {
      this.cssStyle = 'dark';
      this.themePath = this.defThemePath || 'assets/themes/darkmode/';
    }
    
    this.initFilteredDep();
  }

  _search() : boolean {
    if(!this.searchbar){
      this.translate.get('PAGES.ALERT.SEARCH_EMPTY').subscribe(text => this.snackBar.open(text, 'X', { duration: 2000,}));
      return false;
    } 
    
    if(this.searchbar === this.oldsearchbar && !this.searchTouched) return false;
    else {
      this.oldsearchbar = this.searchbar;
      this.searchTouched = false;
      if(this.customSearchState) this.search.searchForProxy(this.searchbar, this.optionalTimeline);
      else this.search.searchForProxy(this.searchbar);

      return true;
    }
  }

  changeCustomSearchState(): boolean {
    return this.customSearchState = !this.customSearchState;
  }

  changeArchive($event): boolean{
      this.storage.set('searchArchive', $event.checked)
      this.searchTouched = true;
      return $event.checked;
  }

  changeOptionalTimeline($event): boolean {
    return this.optionalTimelineState = $event.checked;
  }
  
  changeDate(type, $event): void {
    if(type === 'start') this.optionalTimeline.start = $event.srcElement.value
    if(type === 'end') this.optionalTimeline.end = $event.srcElement.value
    this.searchTouched = true;
  }

  addDepartment(event: MatChipInputEvent): void {
    
    const input = event.input;
    const value = event.value;

    this.searchTouched = true;

    if(value === '') this._search();

    const index = this.listdepartments.indexOf(event.value);
    if(index >= 0){
      // Add our fruit
      if ((value || '').trim()) {
        this.departments.push({name: value.trim()});
        this.optionalTimeline.departments = this.departments;
        this.initFilteredDep();
      }
    }

    // Reset the input value
    if (input) input.value = '';
  }

  selectDepartment(event: MatAutocompleteSelectedEvent): void {

  }

  removeDepartment(department: Department): void {
    const index = this.departments.indexOf(department);

    this.searchTouched = true;
    
    if (index >= 0) {
      this.departments.splice(index, 1);
      this.optionalTimeline.departments = this.departments;
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listdepartments.filter(dep => dep.toLowerCase().indexOf(filterValue) === 0);
  }

  initFilteredDep(){
    this.filteredDepartments = this.departmentsCtrl.valueChanges.pipe(startWith(null),
        map((dep: string | null) => dep ? this._filter(dep) : this.listdepartments.slice()));
  }

  openSettings(){
    this.router.navigateByUrl('/settings');
  }
}
