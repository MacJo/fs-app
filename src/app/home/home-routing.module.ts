import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { SettingsComponent } from '../settings/settings.component';
import { UserSettingsComponent } from '../settings/user-settings/user-settings.component';
import { SearchSettingsComponent } from '../settings/search-settings/search-settings.component';
import { LoginGuard } from '../core/guards/login/login.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'user-settings',
    component: UserSettingsComponent
  },
  {
    path: 'search-settings',
    component: SearchSettingsComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
