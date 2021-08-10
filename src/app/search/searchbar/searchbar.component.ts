import { Component, OnInit, OnDestroy, Inject, Injectable } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
// import { ElasticService } from '../core/services/elastic/elastic.service';
// import { OsService } from '../core/services/os/os.service';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
// import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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
export class SearchbarComponent implements OnInit {

  hints = [];
  searchbar: string;
  oldsearchbar: string;
  searchTouched: boolean;

  listdepartments;

  departmentsCtrl = new FormControl();
  filteredDepartments: Observable<string[]>;

  searchbarEdited: boolean

  customSearchState: boolean = false;

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

  cssStyle: string;
  templatePath: string;

  //chips module
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  //chip seperator key
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  quoteReg = new RegExp(/"([^']*)"/);
  filetypeReg = new RegExp(/:([^']*)/);
  folderTypeReg = new RegExp(/\#([^']*)/);
  minusTypeReg = new RegExp(/\-([^']*)/);
  wildcardTypeReg = new RegExp(/([^']*)\*([^']*)/);

  // , private _hotkeysService: HotkeysService

  constructor(private _snackBar: MatSnackBar, private translate: TranslateService,
    private router: Router, @Inject(LOCAL_STORAGE) private _storage: StorageService){}

  ngOnInit(): void {
    let theme = this._storage.get('theme_ui')
    let defThemePath = 'assets/themes/classic_theme/';

    this.listdepartments = this._storage.get('available-departments') || ["N/A"];

    this.optionalTimeline = {
      start:'',
      end: 'now',
      archive: false,
      departments: [],
    };

    if(theme === 'classic') {
      this.cssStyle = 'light';
      this.templatePath = defThemePath || 'assets/themes/classic_theme/';
    }
    if(theme === 'darkmode') {
      this.cssStyle = 'dark';
      this.templatePath = defThemePath || 'assets/themes/darkmode_theme/';
    }
    else this.templatePath = defThemePath;

    // this._hotkeysService.add(new Hotkey('f2', (event: KeyboardEvent): boolean => {
    //   this.customSearchState = !this.customSearchState;
    //   return false; // Prevent bubbling
    // },null, 'customsearchstate'));

    this.initFilteredDep();
  }

  _search() : void {
    if(this.searchbar === this.oldsearchbar && !this.searchTouched) return;
    else {
      this.oldsearchbar = this.searchbar;
      this.searchTouched = false;
    }
    
    //Validate for data presence
    if(!this._storage.get('apiKey') || !this._storage.get('id')){
      this.translate.get('PAGES.ALERT.SETTINGS_MISSING').subscribe(text => this._snackBar.open(text, 'X', {
        duration: 2000,
      }));
      return;
    }
    if(!this.searchbar){
      this.translate.get('PAGES.ALERT.SEARCH_EMPTY').subscribe(text => this._snackBar.open(text, 'X', {
        duration: 2000,
      }));
      return;
    } 

    // if(this.customSearchState) this.srcService.searchForProxy(this.searchbar, this.optionalTimeline);
    // else this.srcService.searchForProxy(this.searchbar);
  }

  //DEPRECATED
  processArray(array) : void {
    for(let elem of array){
      let resultOfFiletype      = this.filetypeReg.exec(elem);
      let resultOfFoldertype    = this.folderTypeReg.exec(elem);
      let resultOfWildcardtype  = this.wildcardTypeReg.exec(elem);
      let resultOfMinustype     = this.minusTypeReg.exec(elem);
      
      if(resultOfFiletype) this.searchBody.file.push({value: resultOfFiletype[1]});
      else if (resultOfFoldertype) this.searchBody.folder.push({value: resultOfFoldertype[1]});
      else if (resultOfWildcardtype) this.searchBody.wildcard.push({value: resultOfWildcardtype[0]});
      else if (resultOfMinustype) this.searchBody.minus.push({value: resultOfMinustype[1]});
      else { if(elem !== "") this.searchBody.general.push({value: elem}); }
    }
  }

  //DEPRECATED
  separateInArray(stringToProcess) : void {
    return stringToProcess.split(' ');
  }

  changeCustomSearchState() : void {
    this.customSearchState = !this.customSearchState
  }

  searchArchive($event) : void{
      this._storage.set('searchArchive', $event.checked)
      this.searchTouched = true;
  }

  activateOptionalTimeline($event) : void {
    this.optionalTimelineState = $event.checked;
  }
  
  dateChange(type, $event) : void {
    if(type === 'start') this.optionalTimeline.start = $event.srcElement.value
    else this.optionalTimeline.end = $event.srcElement.value
    this.searchTouched = true;
  }

  addDepartment(event: MatChipInputEvent): void {
    
    const input = event.input;
    const value = event.value;

    this.searchTouched = true;

    if(value == '') this._search();

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

}
