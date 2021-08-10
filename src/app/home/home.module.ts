import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';

// NG Translate
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import {BrowserModule} from '@angular/platform-browser';

import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SettingsComponent } from '../settings/settings.component';
import { SearchSettingsComponent } from '../settings/search-settings/search-settings.component';
import { UserSettingsComponent } from '../settings/user-settings/user-settings.component';
import { SearchbarComponent } from '../search/searchbar/searchbar.component';
import { SearchResultComponent } from '../search/search-result/search-result.component'


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    HomeComponent, 
    SettingsComponent, 
    SearchSettingsComponent, 
    UserSettingsComponent,
    SearchbarComponent,
    SearchResultComponent
  ],
  imports: [
    CommonModule, 
    SharedModule, 
    HomeRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    
    MatMenuModule, 
    MatCheckboxModule, 
    MatSnackBarModule, 
    MatAutocompleteModule, 
    MatIconModule, 
    MatButtonModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatChipsModule, 
    MatSlideToggleModule, 
    
    FormsModule, ReactiveFormsModule,
    TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    }
  })],
  providers:[
    {provide: TranslatePipe}
  ]
})
export class HomeModule {}
