import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { nameValidator } from 'src/app/shared/validators/validator';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';
import { CountryISO } from 'ngx-intl-tel-input';
import { environment } from 'src/app/shared/environments/environment';
import { apiResponseService } from 'src/app/shared/services/apiResponse.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  public CountryISO = CountryISO;
  editForm!: FormGroup;
  private editUrl: string = `${environment.url}/getUser`;
  private saveUrl: string = `${environment.url}/updateUser`;
  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private dataService: DataService,
    private router: Router,
    private apiResponseService: apiResponseService
  ) {}

  imageUrl: string = '';
  submitted: boolean = true;
  ngOnInit(): void {
    this.editForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.pattern(/^[^\d]+$/)]],
        phone: ['', Validators.required],
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

    const headers = new HttpHeaders().set(
      'ref_token',
      this.dataService.getUserToken()
    );
    const res = this.http.get(this.editUrl, { headers });
    res.subscribe((response: any) => {
      if (response.status === 200) {
        if (response.result.image === null)
          this.imageUrl =
            'https://atg-prod-scalar.s3.amazonaws.com/studentpower/media/user%20avatar.png';
        else {
          const arrayBufferView = new Uint8Array(response.result.image.data);
          const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
          const urlCreator = window.URL || window.webkitURL;
          this.imageUrl = urlCreator.createObjectURL(blob);
        }
        this.editForm.patchValue({
          name: response.result.name,
          phone: response.result.phone,
          email: response.result.email,
          address: response.result.address,
        });
      }
    });
  }

  image!: File;
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.image = file;
      if (file.size > 2000000) {
        this.editForm.setErrors({ sizeExceeded: true });
      } else {
        const blob = new Blob([this.image], { type: 'image/jpeg' });
        const urlCreator = window.URL || window.webkitURL;
        this.imageUrl = urlCreator.createObjectURL(blob);
      }
    }
  }

  closePopup() {
    const dialogRef = this.dialogService.getEditUserDialogRef();
    dialogRef.close();
  }

  submitForm() {
    if (this.editForm.get('phone')?.errors)
      this.editForm.setErrors({ phLength: true });
    if (this.editForm.valid) {
      const name = this.editForm.value.name;
      const phone = this.editForm.value.phone.internationalNumber;
      const email = this.editForm.value.email;
      const address = this.editForm.value.address;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('address', address);
      formData.append('image', this.image);

      const headers = new HttpHeaders().set(
        'ref_token',
        this.dataService.getUserToken()
      );
      const upload = this.http.post(this.saveUrl, formData, { headers });
      upload.subscribe((response: any) => {
        try {
          if (response.status === 200) {
            this.apiResponseService.handleApiResponse(
              { message: 'User Updated Successfully' },
              true
            );
            const dialogRef = this.dialogService.getEditUserDialogRef();
            dialogRef.close();
            setTimeout(() => {
              this.router
                .navigateByUrl('/', { skipLocationChange: true })
                .then(() => {
                  this.router.navigate(['/dashboard/users']);
                });
            }, 500);
          }else throw response.result;
        } catch (error) {
          this.apiResponseService.handleApiResponse(
            { message: 'Problem Updating User' },
            false
          );
        }
      });
    } else {
      this.submitted = false;
    }
  }
}
