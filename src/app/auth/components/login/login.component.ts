import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { apiResponseService } from 'src/app/shared/services/apiResponse.service';
import { environment } from 'src/app/shared/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userForm!: FormGroup;
  private apiUrl = `${environment.url}/login`;
  submitted: boolean = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cookieService: CookieService,
    private dialogService: DialogService,
    private apiResponseService: apiResponseService
  ) {
    this.userForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  closePopup() {
    const dialogRef = this.dialogService.getloginDialogRef();
    dialogRef.close();
  }

  submitForm() {
    if (this.userForm.valid) {
      const email = this.userForm.value.email;
      const password = this.userForm.value.password;

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const checkUser = this.http.post(this.apiUrl, formData);
      checkUser.subscribe((response: any) => {
        console.log(response);
        console.log(response.status);
        try {
          if (response.status === 200) {
            this.cookieService.set('access_token', response.token);
            this.cookieService.set('ref_token', response.ref_token);
            this.apiResponseService.handleApiResponse(
              { message: 'Login Successfull' },
              true
            );
            const loginDialogRef = this.dialogService.getloginDialogRef();
            loginDialogRef.close();
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 500);
          } else throw response.result;
        } catch (error) {
          if (error === 'Email not registered')
            this.userForm.setErrors({ notRegistered: true });
                                                
          if (error === 'Incorrect password')
            this.userForm.setErrors({ incorrectPassword: true });

          this.apiResponseService.handleApiResponse({ message: error }, false);
        }
      });
    } else {
      this.submitted = false;
    }
  }
}
