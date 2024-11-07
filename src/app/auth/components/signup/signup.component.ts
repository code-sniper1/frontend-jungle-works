import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  confirmPasswordValidator,
  nameValidator,
} from '../../../shared/validators/validator';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { CountryISO } from 'ngx-intl-tel-input';
import { environment } from 'src/app/shared/environments/environment';
import { apiResponseService } from 'src/app/shared/services/apiResponse.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public CountryISO = CountryISO;

  imgSrc: string =
    'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp';
  userForm!: FormGroup;
  passwordIsValid = false;
  submitted: boolean = true;

  private apiUrl = `${environment.url}/signup`;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dialogService: DialogService,
    private cookieService: CookieService,
    private apiResponseService: apiResponseService
  ) {}

  ngOnInit() {
    this.userForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.pattern(/^[^\d]+$/)]],
        phone: ['', [Validators.required,Validators.minLength(6)]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
          ],
        ],
        password: ['', [Validators.required]],
        repeatPassword: ['', [Validators.required]],
        userImg: ['', Validators.required],
        address: ['', Validators.required],
      },
      { validators: [confirmPasswordValidator, nameValidator] }
    );
  }

  passwordValid(event: boolean) {
    this.passwordIsValid = event;
  }

  image!: File;
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.image = file;
      if (file.size > 2000000) {
        this.userForm.setErrors({ sizeExceeded: true });
      }
    }
  }
  closePopup() {
    const dialogRef = this.dialogService.getDialogRef();
    dialogRef.close();
  }

  submitForm() {
    if (this.passwordIsValid === false)
      this.userForm.setErrors({ weakPass: true });
    if (this.userForm.get('phone')?.errors)
      this.userForm.setErrors({ phLength: true });
    if (this.userForm.valid) {
      const name = this.userForm.value.name;
      const phone = this.userForm.value.phone.internationalNumber;
      const email = this.userForm.value.email;
      const password = this.userForm.value.password;
      const repeatPassword = this.userForm.value.repeatPassword;
      const address = this.userForm.value.address;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('repeatPassword', repeatPassword);
      formData.append('address', address);
      formData.append('image', this.image);

      const upload = this.http.post(this.apiUrl, formData);
      upload.subscribe((response: any) => {
        try {
          if (response.status === 200) {
            if (response.result === 'Verified') {
              this.cookieService.set('access_token', response.token);
              this.cookieService.set('ref_token', response.ref_token);
              const dialogRef = this.dialogService.getDialogRef();
              dialogRef.close();
              this.apiResponseService.handleApiResponse(
                { message: 'Signup Successfull' },
                true
              );
              setTimeout(() => {
                this.router.navigate(['/dashboard']);
              }, 500);
            }
          } else throw response.result;
        } catch (error) {
          if (error === 'Email already registered') {
            this.apiResponseService.handleApiResponse(
              { message: 'Email already registered' },
              false
            );
            this.userForm.setErrors({ alreadyRegistered: true });
          }
        }
      });
    } else {
      this.submitted = false;
    }
  }
}
