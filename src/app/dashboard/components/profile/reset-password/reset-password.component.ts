import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Spinkit } from 'ng-http-loader';
import { environment } from 'src/app/shared/environments/environment';
import { apiResponseService } from 'src/app/shared/services/apiResponse.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  public spinkit = Spinkit;
  resetForm!: FormGroup;
  submitted: boolean = true;
  passwordIsValid = false;

  private resetUrl: string = `${environment.url}/resetPass`;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private dataService: DataService,
    private apiResponseService: apiResponseService
  ) {}

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  closePopup() {
    const dialogRef = this.dialogService.getResetPasswordDialogRef();
    dialogRef.close();
  }

  passwordValid(event: boolean) {
    this.passwordIsValid = event;
  }

  submitForm() {
    if (this.resetForm.valid) {
      const password = this.resetForm.value.password;
      const newPassword = this.resetForm.value.newPassword;

      const formData = new FormData();
      formData.append('password', password);
      formData.append('newPassword', newPassword);

      const headers = new HttpHeaders().set(
        'ref_token',
        this.dataService.getUserToken()
      );

      const reset = this.http.patch(this.resetUrl, formData, { headers });
      reset.subscribe((response: any) => {
        try {
          if (response.status === 200) {
            if (response.result === 'Success') {
              this.apiResponseService.handleApiResponse(
                { message: 'Password Updated Successfully' },
                true
              );
              const dialogRef = this.dialogService.getResetPasswordDialogRef();
              dialogRef.close();
            }
          }else throw response.result;
        } catch (error) {
          if (error === 'Wrong Password') {
            this.resetForm.setErrors({ wrongPass: true });
            this.apiResponseService.handleApiResponse(
              { message: 'Wrong Password' },
              false
            );
          } else
            this.apiResponseService.handleApiResponse(
              { message: 'Failure' },
              false
            );
        }
      });
    } else {
      this.submitted = false;
    }
  }
}
