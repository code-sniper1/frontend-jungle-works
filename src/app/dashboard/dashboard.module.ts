import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ShowUsersComponent } from './components/show-users/show-users.component';
import { EditUserComponent } from './components/show-users/edit-user/edit-user.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ResetPasswordComponent } from './components/profile/reset-password/reset-password.component';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardComponent,
    ProfileComponent,
    NavbarComponent,
    ShowUsersComponent,
    EditUserComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxIntlTelInputModule,
    ToastModule,
    PaginatorModule,
    SharedModule,
  ],
})
export class DashboardModule {}
