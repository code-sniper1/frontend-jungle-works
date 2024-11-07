import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { nameValidator } from 'src/app/shared/validators/validator';
import { CountryISO } from 'ngx-intl-tel-input';
import { DataService } from 'src/app/shared/services/data.service';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { Router } from '@angular/router';
import { environment } from 'src/app/shared/environments/environment';
import { apiResponseService } from 'src/app/shared/services/apiResponse.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public CountryISO = CountryISO;
  private viewUrl = `${environment.url}/profile`;
  private editUrl = `${environment.url}/editUser`;
  profileForm!: FormGroup;
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private dialogService: DialogService,
    private apiResponseService: apiResponseService,
    private router: Router
  ) {}

  editOn: boolean = false;
  imageUrl!: string;
  submitted: boolean = true;
  updationSuccessfull: boolean = false;
  ref_token!: string;
  ngOnInit(): void {
    this.profileForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.pattern(/^[^\d]+$/)]],
        phone: ['', [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
          ],
        ],
        address: ['', Validators.required],
        userImg: [''],
      },
      { validators: nameValidator }
    );

    const token = this.cookieService.get('ref_token');
    const headers = new HttpHeaders().set('ref_token', token);
    const res = this.http.get(this.viewUrl, { headers });
    res.subscribe((response: any) => {
      if (response.status === 200) {
        this.ref_token = response.result.ref_token;
        if (response.result.image === null)
          this.imageUrl =
            'https://atg-prod-scalar.s3.amazonaws.com/studentpower/media/user%20avatar.png';
        else {
          const arrayBufferView = new Uint8Array(response.result.image.data);
          const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
          const urlCreator = window.URL || window.webkitURL;
          this.imageUrl = urlCreator.createObjectURL(blob);
        }
        this.profileForm.patchValue({
          name: response.result.name,
          phone: response.result.phone,
          email: response.result.email,
          address: response.result.address,
        });
        this.profileForm.disable();
      }
    });
  }

  editProfile() {
    this.editOn = true;
    this.profileForm.enable();
  }

  image!: File;
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.image = file;
      if (file.size > 2000000) {
        this.profileForm.setErrors({ sizeExceeded: true });
      } else {
        const blob = new Blob([this.image], { type: 'image/jpeg' });
        const urlCreator = window.URL || window.webkitURL;
        this.imageUrl = urlCreator.createObjectURL(blob);
      }
    }
  }

  resetPassword() {
    this.dataService.setUserToken(this.ref_token);
    this.dialogService.openResetPasswordDialog();
  }

  saveProfile() {
    if (this.profileForm.get('phone')?.errors)
      this.profileForm.setErrors({ phLength: true });
    if (this.profileForm.valid) {
      const name = this.profileForm.value.name;
      const phone = this.profileForm.value.phone.internationalNumber;
      const email = this.profileForm.value.email;
      const address = this.profileForm.value.address;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('address', address);
      formData.append('image', this.image);

      const token = this.cookieService.get('ref_token');
      const headers = new HttpHeaders().set('ref_token', token);
      const res = this.http.post(this.editUrl, formData, { headers });
      res.subscribe((response: any) => {
        try {
          if (response.status === 200) {
            this.editOn = false;
            this.profileForm.disable();
            setTimeout(() => {
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(['/dashboard/profile']);
                });
            }, 500);
            this.apiResponseService.handleApiResponse(
              { message: 'Profile Updated Successfully' },
              true
            );
          }else throw response.result;
        } catch (error) {
          console.log(error);
          this.apiResponseService.handleApiResponse(
            { message: 'Problem updating Profile' },
            false
          );
        }
      });
    } else {
      this.submitted = false;
    }
  }

  logout() {
    try {
      this.cookieService.delete('access_token');
      this.cookieService.delete('ref_token');
      this.cookieService.delete('role');

      this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);
    }
  }

  dashboard(){
    this.router.navigate(['/dashboard'])
  }
}
