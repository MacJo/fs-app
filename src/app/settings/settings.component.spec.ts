import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {RouterTestingModule} from "@angular/router/testing";
import { TranslateModule, TranslateLoader, TranslateFakeLoader, TranslateService } from '@ngx-translate/core';

import { HomeComponent } from '../home/home.component'
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsComponent ],
      imports:[
        MatSnackBarModule,
        RouterTestingModule.withRoutes(
          [{path: '', component: HomeComponent}, 
          {path: 'settings', component: SettingsComponent}]
        ),
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
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should create 3 buttons', () => {
    expect(document.getElementById('btn-search')).toBeTruthy();
    expect(document.getElementById('btn-settings')).toBeTruthy();
    expect(document.getElementById('btn-return')).toBeTruthy();
  });
});
