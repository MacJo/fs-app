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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SearchbarComponent } from '../search/searchbar/searchbar.component';
import { SearchResultComponent } from '../search/search-result/search-result.component'
import { SettingsComponent } from '../settings/settings.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [HomeComponent, SearchbarComponent, SearchResultComponent, SettingsComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule, BrowserModule,
    MatMenuModule, MatIconModule, MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule, MatNativeDateModule, 
    MatChipsModule, MatSlideToggleModule, MatSnackBarModule, 
    MatSnackBarModule, MatAutocompleteModule,MatMenuModule, 
    MatIconModule, MatButtonModule, MatDatepickerModule, 
    MatNativeDateModule, MatChipsModule, MatSlideToggleModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
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
