import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
// import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';
import { AuthRoutingModule } from './auth-routing.module';
import { InputNumberModule } from 'primeng/inputnumber';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { PasswordStrengthComponent } from './components/password-strength/password-strength.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ToastModule } from 'primeng/toast';
import { HttpLoaderModule } from '../loader/http-loader/http-loader.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    PasswordStrengthComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // NgxCountriesDropdownModule,
    InputNumberModule,
    NgxIntlTelInputModule,
    ToastModule,
    HttpLoaderModule,
  ],
  exports: [PasswordStrengthComponent],
})
export class AuthModule {}
