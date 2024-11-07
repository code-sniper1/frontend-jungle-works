import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from '../shared/guards/auth-guard.guard';
import { ShowUsersComponent } from './components/show-users/show-users.component';

const routes: Routes = [
  { path: '', title: 'Dashboard', component: DashboardComponent, canActivate:[authGuard] },
  { path: 'profile', title: 'Profile', component: ProfileComponent,canActivate:[authGuard] },
  { path: 'users', title: 'Users', component: ShowUsersComponent,canActivate:[authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
